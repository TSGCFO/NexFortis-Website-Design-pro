import { Router, type Request, type Response } from "express";
import multer from "multer";
import { db } from "@workspace/db";
import {
  qbSubscriptions,
  qbSupportTickets,
  qbUsers,
  qbTicketUsage,
  qbTicketReplies,
} from "@workspace/db/schema";
import { eq, and, desc, sql, asc, ilike, or, isNull, isNotNull, gte, lte, count as drizzleCount } from "drizzle-orm";
import sanitizeHtml from "sanitize-html";
import { getSlaStatus, getTimeRemainingMinutes } from "../lib/business-hours";
import { emitTicketNotification } from "../lib/ticket-notifications";
import { supabaseAdmin } from "../lib/supabase";

const TICKET_BUCKET = "ticket-attachments";

const ALLOWED_MIMETYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
]);

const adminReplyUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMETYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type '${file.mimetype}' is not allowed. Accepted types: images, PDF, Word documents, plain text, and CSV.`));
    }
  },
});

/**
 * Uploads an operator reply attachment. Throws on any error so the caller
 * can abort the reply insertion instead of silently dropping the file.
 */
async function uploadAdminAttachment(ticketId: number, file: Express.Multer.File): Promise<string> {
  if (!supabaseAdmin) {
    throw new Error("Attachment storage is not configured. Please try again without an attachment or contact support.");
  }
  const ext = file.originalname.split(".").pop() || "bin";
  const storagePath = `ticket-${ticketId}/reply-${Date.now()}.${ext}`;
  const { error } = await supabaseAdmin.storage
    .from(TICKET_BUCKET)
    .upload(storagePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });
  if (error) {
    console.error(`[Admin Tickets] Attachment upload failed for ticket ${ticketId}: ${error.message}`);
    throw new Error(`Attachment upload failed: ${error.message}`);
  }
  return storagePath;
}

const router = Router();

function sanitizeInput(input: string): string {
  return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} }).trim();
}

router.get("/subscriptions", async (req: Request, res: Response) => {
  try {
    const { status, tier } = req.query;

    let query = db
      .select({
        subscription: qbSubscriptions,
        userName: qbUsers.name,
        userEmail: qbUsers.email,
      })
      .from(qbSubscriptions)
      .innerJoin(qbUsers, eq(qbSubscriptions.userId, qbUsers.id))
      .orderBy(desc(qbSubscriptions.createdAt))
      .$dynamic();

    const conditions = [];
    if (status && typeof status === "string") {
      conditions.push(eq(qbSubscriptions.status, status));
    }
    if (tier && typeof tier === "string") {
      conditions.push(eq(qbSubscriptions.tier, tier));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query;

    res.json({
      subscriptions: results.map(r => ({
        ...r.subscription,
        userName: r.userName,
        userEmail: r.userEmail,
      })),
    });
  } catch (err) {
    console.error("Admin list subscriptions error:", err);
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
});

router.get("/subscriptions/:id", async (req: Request, res: Response) => {
  try {
    const subId = parseInt(req.params.id as string);
    if (isNaN(subId)) {
      res.status(400).json({ error: "Invalid subscription ID" });
      return;
    }

    const [result] = await db
      .select({
        subscription: qbSubscriptions,
        userName: qbUsers.name,
        userEmail: qbUsers.email,
      })
      .from(qbSubscriptions)
      .innerJoin(qbUsers, eq(qbSubscriptions.userId, qbUsers.id))
      .where(eq(qbSubscriptions.id, subId))
      .limit(1);

    if (!result) {
      res.status(404).json({ error: "Subscription not found" });
      return;
    }

    const usageHistory = await db
      .select()
      .from(qbTicketUsage)
      .where(eq(qbTicketUsage.subscriptionId, subId))
      .orderBy(desc(qbTicketUsage.periodStart));

    res.json({
      subscription: {
        ...result.subscription,
        userName: result.userName,
        userEmail: result.userEmail,
      },
      usageHistory,
    });
  } catch (err) {
    console.error("Admin get subscription error:", err);
    res.status(500).json({ error: "Failed to fetch subscription" });
  }
});

const VALID_TICKET_STATUSES = ["open", "in_progress", "resolved", "closed"] as const;

const VALID_TICKET_TRANSITIONS: Record<string, string[]> = {
  open: ["in_progress", "resolved", "closed"],
  in_progress: ["resolved", "closed"],
  resolved: ["closed", "open"],
  closed: ["open"],
};

router.get("/tickets", async (req: Request, res: Response) => {
  try {
    const { status: filterStatus, search, tier, critical, sort, page: pageStr, limit: limitStr } = req.query;

    const page = Math.max(1, parseInt(pageStr as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(limitStr as string) || 50));
    const offset = (page - 1) * limit;

    const sortMode = (sort as string) || "priority";

    const orderClauses = sortMode === "newest"
      ? [desc(qbSupportTickets.createdAt)]
      : sortMode === "oldest"
        ? [asc(qbSupportTickets.createdAt)]
        : [
            desc(qbSupportTickets.isCritical),
            sql`CASE ${qbSupportTickets.tierAtSubmission}
              WHEN 'premium' THEN 0
              WHEN 'professional' THEN 1
              WHEN 'essentials' THEN 2
              ELSE 3
            END`,
            asc(qbSupportTickets.createdAt),
          ];

    const conditions = [];

    if (filterStatus && typeof filterStatus === "string" && filterStatus !== "all") {
      const statuses = filterStatus.split(",").map(s => s.trim()).filter(Boolean);
      const invalidStatuses = statuses.filter(s => !(VALID_TICKET_STATUSES as readonly string[]).includes(s));
      if (invalidStatuses.length > 0) {
        res.status(400).json({ error: `Invalid status value(s): ${invalidStatuses.join(", ")}. Valid values: ${VALID_TICKET_STATUSES.join(", ")}` });
        return;
      }
      if (statuses.length === 1) {
        conditions.push(eq(qbSupportTickets.status, statuses[0]));
      } else if (statuses.length > 1) {
        conditions.push(sql`${qbSupportTickets.status} IN (${sql.join(statuses.map(s => sql`${s}`), sql`, `)})`);
      }
    }

    if (tier && typeof tier === "string" && tier !== "all") {
      if (tier === "none") {
        conditions.push(isNull(qbSupportTickets.tierAtSubmission));
      } else {
        conditions.push(eq(qbSupportTickets.tierAtSubmission, tier));
      }
    }

    if (critical === "true") {
      conditions.push(eq(qbSupportTickets.isCritical, true));
    }

    if (search && typeof search === "string") {
      conditions.push(
        or(
          ilike(qbSupportTickets.subject, `%${search}%`),
          ilike(qbUsers.email, `%${search}%`),
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(qbSupportTickets)
      .leftJoin(qbUsers, eq(qbSupportTickets.userId, qbUsers.id))
      .where(whereClause);
    const total = Number(countResult[0]?.count || 0);

    let query = db
      .select({
        ticket: qbSupportTickets,
        userName: qbUsers.name,
        userEmail: qbUsers.email,
      })
      .from(qbSupportTickets)
      .leftJoin(qbUsers, eq(qbSupportTickets.userId, qbUsers.id))
      .orderBy(...orderClauses)
      .$dynamic();

    if (whereClause) {
      query = query.where(whereClause);
    }

    const results = await query.limit(limit).offset(offset);

    const slaBreachedResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(qbSupportTickets)
      .where(
        and(
          isNotNull(qbSupportTickets.slaDeadline),
          isNull(qbSupportTickets.firstResponseAt),
          sql`${qbSupportTickets.slaDeadline} < NOW()`,
          sql`${qbSupportTickets.status} IN ('open', 'in_progress')`,
        ),
      );

    const openCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(qbSupportTickets)
      .where(sql`${qbSupportTickets.status} IN ('open', 'in_progress')`);

    const criticalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(qbSupportTickets)
      .where(
        and(
          eq(qbSupportTickets.isCritical, true),
          sql`${qbSupportTickets.status} IN ('open', 'in_progress')`,
        ),
      );

    res.json({
      tickets: results.map(r => ({
        ...r.ticket,
        userName: r.userName,
        userEmail: r.userEmail,
        slaStatus: r.ticket.slaDeadline ? getSlaStatus(r.ticket.slaDeadline) : null,
        slaRemainingMinutes: r.ticket.slaDeadline ? getTimeRemainingMinutes(r.ticket.slaDeadline) : null,
      })),
      total,
      page,
      limit,
      slaBreached: Number(slaBreachedResult[0]?.count || 0),
      openCount: Number(openCountResult[0]?.count || 0),
      criticalCount: Number(criticalCountResult[0]?.count || 0),
    });
  } catch (err) {
    console.error("Admin list tickets error:", err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

// IMPORTANT: /tickets/stats must be defined before /tickets/:id to avoid :id capturing "stats" as a ticket ID
router.get("/tickets/stats", async (req: Request, res: Response) => {
  try {
    const openResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(qbSupportTickets)
      .where(eq(qbSupportTickets.status, "open"));

    const inProgressResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(qbSupportTickets)
      .where(eq(qbSupportTickets.status, "in_progress"));

    const criticalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(qbSupportTickets)
      .where(
        and(
          eq(qbSupportTickets.isCritical, true),
          sql`${qbSupportTickets.status} IN ('open', 'in_progress')`,
        ),
      );

    const slaBreachedResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(qbSupportTickets)
      .where(
        and(
          isNotNull(qbSupportTickets.slaDeadline),
          isNull(qbSupportTickets.firstResponseAt),
          sql`${qbSupportTickets.slaDeadline} < NOW()`,
          sql`${qbSupportTickets.status} IN ('open', 'in_progress')`,
        ),
      );

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const avgResponseResult = await db
      .select({
        avgMinutes: sql<number>`COALESCE(AVG(EXTRACT(EPOCH FROM (${qbSupportTickets.firstResponseAt} - ${qbSupportTickets.createdAt})) / 60), 0)`,
      })
      .from(qbSupportTickets)
      .where(
        and(
          isNotNull(qbSupportTickets.firstResponseAt),
          gte(qbSupportTickets.createdAt, thirtyDaysAgo),
        ),
      );

    const complianceTotal = await db
      .select({ count: sql<number>`count(*)` })
      .from(qbSupportTickets)
      .where(
        and(
          isNotNull(qbSupportTickets.slaDeadline),
          isNotNull(qbSupportTickets.firstResponseAt),
        ),
      );

    const complianceMet = await db
      .select({ count: sql<number>`count(*)` })
      .from(qbSupportTickets)
      .where(
        and(
          isNotNull(qbSupportTickets.slaDeadline),
          isNotNull(qbSupportTickets.firstResponseAt),
          sql`${qbSupportTickets.firstResponseAt} <= ${qbSupportTickets.slaDeadline}`,
        ),
      );

    const totalWithSla = Number(complianceTotal[0]?.count || 0);
    const metSla = Number(complianceMet[0]?.count || 0);
    const slaCompliancePercent = totalWithSla > 0
      ? Math.round((metSla / totalWithSla) * 1000) / 10
      : 100;

    const tierCounts = await db
      .select({
        tier: qbSupportTickets.tierAtSubmission,
        count: sql<number>`count(*)`,
      })
      .from(qbSupportTickets)
      .where(sql`${qbSupportTickets.status} IN ('open', 'in_progress')`)
      .groupBy(qbSupportTickets.tierAtSubmission);

    const ticketsByTier: Record<string, number> = {
      premium: 0,
      professional: 0,
      essentials: 0,
      none: 0,
    };
    for (const row of tierCounts) {
      const key = row.tier || "none";
      ticketsByTier[key] = Number(row.count);
    }

    res.json({
      openTickets: Number(openResult[0]?.count || 0),
      inProgressTickets: Number(inProgressResult[0]?.count || 0),
      criticalOpen: Number(criticalResult[0]?.count || 0),
      slaBreached: Number(slaBreachedResult[0]?.count || 0),
      avgResponseMinutes: Math.round(Number(avgResponseResult[0]?.avgMinutes || 0)),
      slaCompliancePercent,
      ticketsByTier,
    });
  } catch (err) {
    console.error("Admin ticket stats error:", err);
    res.status(500).json({ error: "Failed to fetch ticket stats" });
  }
});

router.get("/tickets/:id", async (req: Request, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id as string);
    if (isNaN(ticketId)) {
      res.status(400).json({ error: "Invalid ticket ID" });
      return;
    }

    const [result] = await db
      .select({
        ticket: qbSupportTickets,
        userName: qbUsers.name,
        userEmail: qbUsers.email,
      })
      .from(qbSupportTickets)
      .leftJoin(qbUsers, eq(qbSupportTickets.userId, qbUsers.id))
      .where(eq(qbSupportTickets.id, ticketId))
      .limit(1);

    if (!result) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    res.json({
      ticket: {
        ...result.ticket,
        userName: result.userName,
        userEmail: result.userEmail,
        slaStatus: result.ticket.slaDeadline ? getSlaStatus(result.ticket.slaDeadline) : null,
        slaRemainingMinutes: result.ticket.slaDeadline ? getTimeRemainingMinutes(result.ticket.slaDeadline) : null,
      },
    });
  } catch (err) {
    console.error("Admin get ticket error:", err);
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
});

// Returns the full reply thread for a ticket with operator-visible details
// (sender name/email, internal notes, attachment URLs). Unlike the customer
// endpoint in qb-tickets.ts, operators see ALL reply rows including internal
// notes. Used by admin/ticket-detail.tsx to render the conversation history.
router.get("/tickets/:id/replies", async (req: Request, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id as string);
    if (isNaN(ticketId)) {
      res.status(400).json({ error: "Invalid ticket ID" });
      return;
    }

    const [ticket] = await db
      .select({ id: qbSupportTickets.id })
      .from(qbSupportTickets)
      .where(eq(qbSupportTickets.id, ticketId))
      .limit(1);

    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    const replies = await db
      .select({
        reply: qbTicketReplies,
        senderName: qbUsers.name,
        senderEmail: qbUsers.email,
      })
      .from(qbTicketReplies)
      .leftJoin(qbUsers, eq(qbTicketReplies.senderId, qbUsers.id))
      .where(eq(qbTicketReplies.ticketId, ticketId))
      .orderBy(asc(qbTicketReplies.createdAt));

    const repliesWithUrls = await Promise.all(
      replies.map(async (r) => {
        let attachmentUrl: string | null = null;
        if (r.reply.attachmentPath && supabaseAdmin) {
          const { data } = await supabaseAdmin.storage
            .from(TICKET_BUCKET)
            .createSignedUrl(r.reply.attachmentPath, 3600);
          attachmentUrl = data?.signedUrl || null;
        }
        return {
          ...r.reply,
          senderName: r.senderName,
          senderEmail: r.senderEmail,
          attachmentUrl,
        };
      }),
    );

    res.json({ replies: repliesWithUrls });
  } catch (err) {
    console.error("Admin get replies error:", err);
    res.status(500).json({ error: "Failed to fetch replies" });
  }
});

router.post("/tickets/:id/reply", (req: Request, res: Response) => {
  const singleUpload = adminReplyUpload.single("attachment");
  singleUpload(req, res, async (uploadErr) => {
    if (uploadErr) {
      if (uploadErr instanceof multer.MulterError && uploadErr.code === "LIMIT_FILE_SIZE") {
        res.status(413).json({ error: "Attachment too large. Maximum size is 10MB." });
      } else {
        res.status(400).json({ error: uploadErr.message || "Upload failed" });
      }
      return;
    }

    try {
      const ticketId = parseInt(req.params.id as string);
      if (isNaN(ticketId)) {
        res.status(400).json({ error: "Invalid ticket ID" });
        return;
      }

      const { reply, internalNote, status } = req.body;
      const trimmedReply = typeof reply === "string" ? reply.trim() : "";
      if (!trimmedReply) {
        res.status(400).json({ error: "Reply is required" });
        return;
      }

      const [ticket] = await db
        .select()
        .from(qbSupportTickets)
        .where(eq(qbSupportTickets.id, ticketId))
        .limit(1);

      if (!ticket) {
        res.status(404).json({ error: "Ticket not found" });
        return;
      }

      const operatorId = req.userId!;

      let attachmentPath: string | null = null;
      if (req.file) {
        try {
          attachmentPath = await uploadAdminAttachment(ticketId, req.file);
        } catch (uploadErr: any) {
          // Upload happens before any DB writes, so no rollback needed.
          res.status(500).json({
            error: uploadErr?.message || "Failed to upload attachment. Please try again.",
          });
          return;
        }
      }

      if (!ticket.userId) {
        res.status(400).json({ error: "Ticket has no associated user" });
        return;
      }

      const updates: Partial<{
        operatorReply: string;
        updatedAt: Date;
        firstResponseAt: Date;
        internalNote: string;
        status: string;
      }> = {
        operatorReply: sanitizeInput(reply),
        updatedAt: new Date(),
      };

      if (!ticket.firstResponseAt) {
        updates.firstResponseAt = new Date();
        console.log(`[SLA] Ticket ${ticketId} first response at ${new Date().toISOString()}, SLA deadline was ${ticket.slaDeadline?.toISOString()}`);
      }

      if (internalNote) {
        updates.internalNote = sanitizeInput(internalNote);
      }

      if (status && VALID_TICKET_TRANSITIONS[ticket.status]?.includes(status)) {
        updates.status = status;
        console.log(`[AUDIT] Ticket ${ticketId} status changed to ${status} by operator ${operatorId}`);
      } else if (ticket.status === "open") {
        updates.status = "in_progress";
      }

      const updated = await db.transaction(async (tx) => {
        await tx.insert(qbTicketReplies).values({
          ticketId,
          senderId: operatorId,
          senderRole: "operator",
          message: sanitizeInput(trimmedReply),
          attachmentPath,
        });

        const [result] = await tx
          .update(qbSupportTickets)
          .set(updates)
          .where(eq(qbSupportTickets.id, ticketId))
          .returning();

        return result;
      });

      await emitTicketNotification("operator_replied", ticketId, ticket.userId, {
        subject: ticket.subject,
        replyPreview: reply.substring(0, 200),
      });

      if (updates.status === "resolved") {
        await emitTicketNotification("ticket_resolved", ticketId, ticket.userId, {
          subject: ticket.subject,
        });
      }

      res.json({ ticket: updated });
    } catch (err) {
      console.error("Admin ticket reply error:", err);
      res.status(500).json({ error: "Failed to reply to ticket" });
    }
  });
});

router.patch("/tickets/:id/status", async (req: Request, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id as string);
    if (isNaN(ticketId)) {
      res.status(400).json({ error: "Invalid ticket ID" });
      return;
    }

    const { status, internalNote } = req.body;
    if (!status && !internalNote) {
      res.status(400).json({ error: "Status or internalNote is required" });
      return;
    }

    const [ticket] = await db
      .select()
      .from(qbSupportTickets)
      .where(eq(qbSupportTickets.id, ticketId))
      .limit(1);

    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (status && status !== ticket.status) {
      const allowedTransitions = VALID_TICKET_TRANSITIONS[ticket.status] || [];
      if (!allowedTransitions.includes(status)) {
        res.status(400).json({
          error: `Invalid status transition from '${ticket.status}' to '${status}'. Allowed: ${allowedTransitions.join(", ") || "none"}`,
        });
        return;
      }
      updates.status = status;
    }

    if (internalNote) {
      updates.internalNote = sanitizeInput(internalNote);
    }

    const [updated] = await db
      .update(qbSupportTickets)
      .set(updates)
      .where(eq(qbSupportTickets.id, ticketId))
      .returning();

    if (updates.status) {
      console.log(`[AUDIT] Ticket ${ticketId} status changed to ${updates.status} by operator ${req.userId}`);
    }
    if (internalNote) {
      console.log(`[AUDIT] Ticket ${ticketId} internal note updated by operator ${req.userId}`);
    }

    if (updates.status === "resolved") {
      if (!ticket.userId) {
        res.status(500).json({ error: "Ticket has no associated user" });
        return;
      }
      await emitTicketNotification("ticket_resolved", ticketId, ticket.userId, {
        subject: ticket.subject,
      });
    }

    res.json({ ticket: updated });
  } catch (err) {
    console.error("Admin update ticket status error:", err);
    res.status(500).json({ error: "Failed to update ticket status" });
  }
});

export default router;
