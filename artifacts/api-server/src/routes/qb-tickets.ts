import { Router, type Request, type Response } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import multer from "multer";
import { db } from "@workspace/db";
import {
  qbSubscriptions,
  qbTicketUsage,
  qbSupportTickets,
  qbTicketReplies,
  qbUsers,
  qbOrderSupportEntitlements,
  qbOrders,
} from "@workspace/db/schema";
import { eq, and, desc, asc, gt, sql } from "drizzle-orm";
import sanitizeHtml from "sanitize-html";
import { supabaseAdmin } from "../lib/supabase";
import {
  getTierConfig,
  isUnlimitedTickets,
  type SubscriptionTier,
} from "../lib/subscription-config";
import {
  isAfterHours,
  calculateSlaDeadline,
  getSlaMinutesForTier,
  getTimeRemainingMinutes,
  getSlaStatus,
} from "../lib/business-hours";
import { emitTicketNotification } from "../lib/ticket-notifications";
import { getOrCreateTicketUsage } from "../lib/ticket-usage";

const router = Router();

const TICKET_BUCKET = "ticket-attachments";

const ALLOWED_TICKET_MIMETYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
];

const ticketFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (ALLOWED_TICKET_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type "${file.mimetype}" is not allowed. Accepted: images, PDF, Word documents, plain text, and CSV.`));
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: ticketFileFilter,
});

function getClientIp(req: any): string {
  // app.set("trust proxy", 1) makes req.ip the real client IP from the
  // first untrusted hop. Use req.ip rather than the raw X-Forwarded-For
  // header to avoid client-controlled spoofing of the rate-limit key.
  return req.ip || req.socket?.remoteAddress || "unknown";
}

const ticketSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => req.userId || ipKeyGenerator(getClientIp(req)),
  message: { error: "Too many requests. Please try again later." },
});

function sanitizeInput(input: string): string {
  return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} }).trim();
}

async function getActiveSubscription(userId: string) {
  const [sub] = await db
    .select()
    .from(qbSubscriptions)
    .where(and(eq(qbSubscriptions.userId, userId), eq(qbSubscriptions.status, "active")))
    .limit(1);
  return sub || null;
}

async function getActiveOrderEntitlement(userId: string) {
  const [entitlement] = await db
    .select()
    .from(qbOrderSupportEntitlements)
    .where(
      and(
        eq(qbOrderSupportEntitlements.userId, userId),
        gt(qbOrderSupportEntitlements.expiresAt, sql`now()`),
        sql`${qbOrderSupportEntitlements.ticketsUsed} < ${qbOrderSupportEntitlements.ticketsAllowed}`,
      ),
    )
    .orderBy(asc(qbOrderSupportEntitlements.expiresAt))
    .limit(1);
  return entitlement || null;
}

async function uploadTicketAttachment(
  ticketId: number,
  file: Express.Multer.File,
): Promise<string | null> {
  if (!supabaseAdmin) return null;

  const ext = file.originalname.split(".").pop() || "bin";
  const storagePath = `tickets/${ticketId}/${Date.now()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(TICKET_BUCKET)
    .upload(storagePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    console.warn(`[Tickets] Attachment upload failed: ${error.message}`);
    return null;
  }

  return storagePath;
}

router.post("/", ticketSubmitLimiter, (req: Request, res: Response) => {
  const singleUpload = upload.single("attachment");
  singleUpload(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        res.status(413).json({ error: "Attachment too large. Maximum size is 25MB." });
      } else {
        res.status(400).json({ error: err.message || "Upload failed" });
      }
      return;
    }

    try {
      const userId = req.userId!;
      const { subject, message, isCritical } = req.body;

      if (!subject || !message) {
        res.status(400).json({ error: "Subject and message are required" });
        return;
      }

      const sub = await getActiveSubscription(userId);
      const entitlement = sub ? null : await getActiveOrderEntitlement(userId);

      if (!sub && !entitlement) {
        res.status(403).json({ error: "An active subscription is required to submit tickets" });
        return;
      }

      const now = new Date();
      const critical = isCritical === "true" || isCritical === true;
      const afterHours = isAfterHours(now);

      let tierForTicket: string;
      let slaDeadline: Date;

      if (sub) {
        const tier = sub.tier as SubscriptionTier;
        tierForTicket = tier;
        const slaMinutes = getSlaMinutesForTier(tier);
        slaDeadline = calculateSlaDeadline(now, slaMinutes, critical);
      } else {
        tierForTicket = entitlement!.isUpgraded ? "order-extended" : "order-basic";
        slaDeadline = calculateSlaDeadline(now, entitlement!.slaMinutes, critical);
      }

      const ticket = await db.transaction(async (tx) => {
        if (sub) {
          const tier = sub.tier as SubscriptionTier;
          const tierConfig = getTierConfig(tier);

          if (!isUnlimitedTickets(tier) && sub.currentPeriodStart && sub.currentPeriodEnd) {
            const usage = await getOrCreateTicketUsage(
              sub.id,
              sub.currentPeriodStart,
              sub.currentPeriodEnd,
              tierConfig.ticketLimit,
              tx,
            );

            if (usage.ticketsUsed >= tierConfig.ticketLimit) {
              throw Object.assign(new Error("Ticket limit reached for this billing cycle"), {
                limitReached: true,
                ticketsUsed: usage.ticketsUsed,
                ticketLimit: tierConfig.ticketLimit,
                resetDate: sub.currentPeriodEnd!.toISOString(),
              });
            }
          }

          const [created] = await tx
            .insert(qbSupportTickets)
            .values({
              userId,
              subscriptionId: sub.id,
              entitlementId: null,
              tierAtSubmission: tierForTicket,
              subject: sanitizeInput(subject),
              message: sanitizeInput(message),
              status: "open",
              isCritical: critical,
              isAfterHours: afterHours,
              slaDeadline,
            })
            .returning();

          if (!isUnlimitedTickets(tier) && sub.currentPeriodStart && sub.currentPeriodEnd) {
            await tx
              .update(qbTicketUsage)
              .set({ ticketsUsed: sql`${qbTicketUsage.ticketsUsed} + 1` })
              .where(
                and(
                  eq(qbTicketUsage.subscriptionId, sub.id),
                  eq(qbTicketUsage.periodStart, sub.currentPeriodStart),
                ),
              );
          }

          return created;
        }

        const [created] = await tx
          .insert(qbSupportTickets)
          .values({
            userId,
            subscriptionId: null,
            entitlementId: entitlement!.id,
            tierAtSubmission: tierForTicket,
            subject: sanitizeInput(subject),
            message: sanitizeInput(message),
            status: "open",
            isCritical: critical,
            isAfterHours: afterHours,
            slaDeadline,
          })
          .returning();

        await tx
          .update(qbOrderSupportEntitlements)
          .set({
            ticketsUsed: sql`${qbOrderSupportEntitlements.ticketsUsed} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(qbOrderSupportEntitlements.id, entitlement!.id));

        return created;
      });

      let attachmentPath: string | null = null;
      if (req.file) {
        attachmentPath = await uploadTicketAttachment(ticket.id, req.file);
        if (attachmentPath) {
          await db
            .update(qbSupportTickets)
            .set({ attachmentPath })
            .where(eq(qbSupportTickets.id, ticket.id));
        }
      }

      emitTicketNotification("ticket_created", ticket.id, userId, {
        subject: ticket.subject,
        tier: tierForTicket,
        isCritical: critical,
        slaDeadline: slaDeadline.toISOString(),
      }).catch((err) => console.error("[Notification] Failed:", err));

      res.status(201).json({
        ticket: { ...ticket, attachmentPath },
      });
    } catch (ticketErr: any) {
      if (ticketErr?.limitReached) {
        res.status(403).json({
          error: ticketErr.message,
          ticketsUsed: ticketErr.ticketsUsed,
          ticketLimit: ticketErr.ticketLimit,
          resetDate: ticketErr.resetDate,
        });
        return;
      }
      console.error("Ticket submission error:", ticketErr);
      res.status(500).json({ error: "Failed to create ticket" });
    }
  });
});

router.get("/entitlements", async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    const sub = await getActiveSubscription(userId);
    let subscriptionPayload: {
      tier: string;
      ticketsUsed: number;
      ticketLimit: number;
      ticketsRemaining: number;
      slaMinutes: number;
    } | null = null;

    if (sub) {
      const tier = sub.tier as SubscriptionTier;
      const tierConfig = getTierConfig(tier);
      let ticketsUsed = 0;

      if (sub.currentPeriodStart && sub.currentPeriodEnd) {
        const usage = await getOrCreateTicketUsage(
          sub.id,
          sub.currentPeriodStart,
          sub.currentPeriodEnd,
          tierConfig.ticketLimit,
        );
        ticketsUsed = usage?.ticketsUsed ?? 0;
      }

      const unlimited = isUnlimitedTickets(tier);
      subscriptionPayload = {
        tier,
        ticketsUsed,
        ticketLimit: tierConfig.ticketLimit,
        ticketsRemaining: unlimited
          ? -1
          : Math.max(0, tierConfig.ticketLimit - ticketsUsed),
        slaMinutes: tierConfig.slaMinutes,
      };
    }

    const entitlementRows = await db
      .select({
        entitlement: qbOrderSupportEntitlements,
        serviceName: qbOrders.serviceName,
      })
      .from(qbOrderSupportEntitlements)
      .leftJoin(qbOrders, eq(qbOrderSupportEntitlements.orderId, qbOrders.id))
      .where(eq(qbOrderSupportEntitlements.userId, userId))
      .orderBy(desc(qbOrderSupportEntitlements.expiresAt));

    const now = new Date();
    const orderEntitlements = entitlementRows.map(({ entitlement, serviceName }) => {
      const isExpired = entitlement.expiresAt.getTime() < now.getTime();
      const ticketsRemaining = entitlement.ticketsAllowed - entitlement.ticketsUsed;
      const isActive = !isExpired && entitlement.ticketsUsed < entitlement.ticketsAllowed;

      return {
        id: entitlement.id,
        orderId: entitlement.orderId,
        serviceName: serviceName ?? null,
        ticketsAllowed: entitlement.ticketsAllowed,
        ticketsUsed: entitlement.ticketsUsed,
        ticketsRemaining,
        slaMinutes: entitlement.slaMinutes,
        startsAt: entitlement.startsAt,
        expiresAt: entitlement.expiresAt,
        isUpgraded: entitlement.isUpgraded,
        isExpired,
        isActive,
      };
    });

    res.json({
      subscription: subscriptionPayload,
      orderEntitlements,
    });
  } catch (err) {
    console.error("Get entitlements error:", err);
    res.status(500).json({ error: "Failed to fetch entitlements" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const tickets = await db
      .select()
      .from(qbSupportTickets)
      .where(eq(qbSupportTickets.userId, userId))
      .orderBy(desc(qbSupportTickets.createdAt));

    const ticketsWithSla = tickets.map(t => ({
      id: t.id,
      subject: t.subject,
      message: t.message,
      status: t.status,
      isCritical: t.isCritical,
      isAfterHours: t.isAfterHours,
      tierAtSubmission: t.tierAtSubmission,
      firstResponseAt: t.firstResponseAt,
      slaDeadline: t.slaDeadline,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      slaStatus: t.slaDeadline ? getSlaStatus(t.slaDeadline) : null,
      slaRemainingMinutes: t.slaDeadline ? getTimeRemainingMinutes(t.slaDeadline) : null,
    }));

    res.json({ tickets: ticketsWithSla });
  } catch (err) {
    console.error("Get tickets error:", err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const ticketId = parseInt(req.params.id as string);

    if (isNaN(ticketId)) {
      res.status(400).json({ error: "Invalid ticket ID" });
      return;
    }

    const [ticket] = await db
      .select()
      .from(qbSupportTickets)
      .where(and(eq(qbSupportTickets.id, ticketId), eq(qbSupportTickets.userId, userId)))
      .limit(1);

    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    res.json({
      ticket: {
        id: ticket.id,
        subject: ticket.subject,
        message: ticket.message,
        status: ticket.status,
        isCritical: ticket.isCritical,
        isAfterHours: ticket.isAfterHours,
        tierAtSubmission: ticket.tierAtSubmission,
        firstResponseAt: ticket.firstResponseAt,
        slaDeadline: ticket.slaDeadline,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        slaStatus: ticket.slaDeadline ? getSlaStatus(ticket.slaDeadline) : null,
        slaRemainingMinutes: ticket.slaDeadline ? getTimeRemainingMinutes(ticket.slaDeadline) : null,
      },
    });
  } catch (err) {
    console.error("Get ticket error:", err);
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
});

const replyUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: ticketFileFilter,
});

router.post("/:id/replies", (req: Request, res: Response) => {
  const singleUpload = replyUpload.single("attachment");
  singleUpload(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        res.status(413).json({ error: "Attachment too large. Maximum size is 10MB." });
      } else {
        res.status(400).json({ error: err.message || "Upload failed" });
      }
      return;
    }

    try {
      const userId = req.userId!;
      const userRole = req.userRole || "customer";
      const ticketId = parseInt(req.params.id as string);

      if (isNaN(ticketId)) {
        res.status(400).json({ error: "Invalid ticket ID" });
        return;
      }

      const message = typeof req.body.message === "string" ? req.body.message.trim() : "";
      if (!message) {
        res.status(400).json({ error: "Message is required" });
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

      const isOperator = userRole === "operator";
      if (!isOperator && ticket.userId !== userId) {
        res.status(403).json({ error: "Not authorized to reply to this ticket" });
        return;
      }

      const senderRole = isOperator ? "operator" : "customer";

      let attachmentPath: string | null = null;
      if (req.file) {
        attachmentPath = await uploadTicketAttachment(ticketId, req.file);
      }

      const [reply] = await db
        .insert(qbTicketReplies)
        .values({
          ticketId,
          senderId: userId,
          senderRole,
          message: sanitizeInput(message),
          attachmentPath,
        })
        .returning();

      const ticketUpdates: Record<string, unknown> = { updatedAt: new Date() };

      if (isOperator && !ticket.firstResponseAt) {
        ticketUpdates.firstResponseAt = new Date();
        console.log(`[SLA] Ticket ${ticketId} first response at ${new Date().toISOString()}, SLA deadline was ${ticket.slaDeadline?.toISOString()}`);
      }

      if (isOperator && ticket.status === "open") {
        ticketUpdates.status = "in_progress";
      }

      await db
        .update(qbSupportTickets)
        .set(ticketUpdates)
        .where(eq(qbSupportTickets.id, ticketId));

      if (isOperator) {
        await emitTicketNotification("operator_replied", ticketId, ticket.userId!, {
          subject: ticket.subject,
          replyPreview: message.substring(0, 200),
        });
      } else {
        await emitTicketNotification("customer_replied", ticketId, userId, {
          subject: ticket.subject,
          replyPreview: message.substring(0, 200),
        });
      }

      res.status(201).json({ reply });
    } catch (replyErr) {
      console.error("Reply submission error:", replyErr);
      res.status(500).json({ error: "Failed to post reply" });
    }
  });
});

router.get("/:id/replies", async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const userRole = req.userRole || "customer";
    const ticketId = parseInt(req.params.id as string);

    if (isNaN(ticketId)) {
      res.status(400).json({ error: "Invalid ticket ID" });
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

    const isOperator = userRole === "operator";
    if (!isOperator && ticket.userId !== userId) {
      res.status(403).json({ error: "Not authorized to view replies" });
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

    const filteredReplies = isOperator
      ? replies
      : replies.filter(r => r.reply.senderRole !== "internal");

    const repliesWithUrls = await Promise.all(
      filteredReplies.map(async (r) => {
        let attachmentUrl: string | null = null;
        if (r.reply.attachmentPath && supabaseAdmin) {
          const { data } = await supabaseAdmin.storage
            .from(TICKET_BUCKET)
            .createSignedUrl(r.reply.attachmentPath, 3600);
          attachmentUrl = data?.signedUrl || null;
        }

        if (isOperator) {
          return {
            ...r.reply,
            senderName: r.senderName,
            senderEmail: r.senderEmail,
            attachmentUrl,
          };
        }

        return {
          id: r.reply.id,
          ticketId: r.reply.ticketId,
          senderRole: r.reply.senderRole,
          senderName: r.reply.senderRole === "operator" ? "NexFortis Support" : r.senderName,
          message: r.reply.message,
          createdAt: r.reply.createdAt,
          attachmentUrl,
        };
      }),
    );

    res.json({ replies: repliesWithUrls });
  } catch (err) {
    console.error("Get replies error:", err);
    res.status(500).json({ error: "Failed to fetch replies" });
  }
});

export default router;
