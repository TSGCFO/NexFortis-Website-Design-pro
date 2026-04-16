import { Router, type Request, type Response } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import multer from "multer";
import { db } from "@workspace/db";
import {
  qbSubscriptions,
  qbTicketUsage,
  qbSupportTickets,
} from "@workspace/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
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

const router = Router();

const TICKET_BUCKET = "ticket-attachments";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const ticketSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => req.userId || ipKeyGenerator(req),
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

async function getOrCreateTicketUsage(subscriptionId: number, periodStart: Date, periodEnd: Date, ticketLimit: number) {
  const [existing] = await db
    .select()
    .from(qbTicketUsage)
    .where(
      and(
        eq(qbTicketUsage.subscriptionId, subscriptionId),
        eq(qbTicketUsage.periodStart, periodStart),
      ),
    )
    .limit(1);

  if (existing) return existing;

  const [created] = await db
    .insert(qbTicketUsage)
    .values({ subscriptionId, periodStart, periodEnd, ticketLimit, ticketsUsed: 0 })
    .returning();
  return created;
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
        res.status(413).json({ error: "Attachment too large. Maximum size is 10MB." });
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
      if (!sub) {
        res.status(403).json({ error: "An active subscription is required to submit tickets" });
        return;
      }

      const tier = sub.tier as SubscriptionTier;
      const tierConfig = getTierConfig(tier);

      if (!isUnlimitedTickets(tier) && sub.currentPeriodStart && sub.currentPeriodEnd) {
        const usage = await getOrCreateTicketUsage(
          sub.id,
          sub.currentPeriodStart,
          sub.currentPeriodEnd,
          tierConfig.ticketLimit,
        );

        if (usage.ticketsUsed >= tierConfig.ticketLimit) {
          res.status(403).json({
            error: "Ticket limit reached for this billing cycle",
            ticketsUsed: usage.ticketsUsed,
            ticketLimit: tierConfig.ticketLimit,
            resetDate: sub.currentPeriodEnd.toISOString(),
          });
          return;
        }
      }

      const now = new Date();
      const critical = isCritical === "true" || isCritical === true;
      const afterHours = isAfterHours(now);
      const slaMinutes = getSlaMinutesForTier(tier);
      const slaDeadline = calculateSlaDeadline(now, slaMinutes, critical);

      const [ticket] = await db
        .insert(qbSupportTickets)
        .values({
          userId,
          subscriptionId: sub.id,
          tierAtSubmission: tier,
          subject: sanitizeInput(subject),
          message: sanitizeInput(message),
          status: "open",
          isCritical: critical,
          isAfterHours: afterHours,
          slaDeadline,
        })
        .returning();

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

      if (!isUnlimitedTickets(tier) && sub.currentPeriodStart && sub.currentPeriodEnd) {
        await db
          .update(qbTicketUsage)
          .set({ ticketsUsed: sql`${qbTicketUsage.ticketsUsed} + 1` })
          .where(
            and(
              eq(qbTicketUsage.subscriptionId, sub.id),
              eq(qbTicketUsage.periodStart, sub.currentPeriodStart),
            ),
          );
      }

      res.status(201).json({
        ticket: { ...ticket, attachmentPath },
      });
    } catch (ticketErr) {
      console.error("Ticket submission error:", ticketErr);
      res.status(500).json({ error: "Failed to create ticket" });
    }
  });
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
      ...t,
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
        ...ticket,
        slaStatus: ticket.slaDeadline ? getSlaStatus(ticket.slaDeadline) : null,
        slaRemainingMinutes: ticket.slaDeadline ? getTimeRemainingMinutes(ticket.slaDeadline) : null,
      },
    });
  } catch (err) {
    console.error("Get ticket error:", err);
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
});

export default router;
