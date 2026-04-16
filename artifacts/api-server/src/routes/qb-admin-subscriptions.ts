import { Router, type Request, type Response } from "express";
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
      .limit(limit)
      .offset(offset)
      .$dynamic();

    if (whereClause) {
      query = query.where(whereClause);
    }

    const results = await query;

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

router.post("/tickets/:id/reply", async (req: Request, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id as string);
    if (isNaN(ticketId)) {
      res.status(400).json({ error: "Invalid ticket ID" });
      return;
    }

    const { reply, internalNote, status } = req.body;
    if (!reply) {
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

    await db.insert(qbTicketReplies).values({
      ticketId,
      senderId: operatorId,
      senderRole: "operator",
      message: sanitizeInput(reply),
    });

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

    const [updated] = await db
      .update(qbSupportTickets)
      .set(updates)
      .where(eq(qbSupportTickets.id, ticketId))
      .returning();

    await emitTicketNotification("operator_replied", ticketId, ticket.userId!, {
      subject: ticket.subject,
      replyPreview: reply.substring(0, 200),
    });

    res.json({ ticket: updated });
  } catch (err) {
    console.error("Admin ticket reply error:", err);
    res.status(500).json({ error: "Failed to reply to ticket" });
  }
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
      await emitTicketNotification("ticket_resolved", ticketId, ticket.userId!, {
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
