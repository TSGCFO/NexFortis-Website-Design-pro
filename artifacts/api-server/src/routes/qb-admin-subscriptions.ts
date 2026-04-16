import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  qbSubscriptions,
  qbSupportTickets,
  qbUsers,
  qbTicketUsage,
} from "@workspace/db/schema";
import { eq, and, desc, sql, asc } from "drizzle-orm";
import sanitizeHtml from "sanitize-html";
import { getSlaStatus, getTimeRemainingMinutes } from "../lib/business-hours";

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

router.get("/tickets", async (req: Request, res: Response) => {
  try {
    const { status: filterStatus } = req.query;

    let query = db
      .select({
        ticket: qbSupportTickets,
        userName: qbUsers.name,
        userEmail: qbUsers.email,
      })
      .from(qbSupportTickets)
      .leftJoin(qbUsers, eq(qbSupportTickets.userId, qbUsers.id))
      .orderBy(
        desc(qbSupportTickets.isCritical),
        sql`CASE ${qbSupportTickets.tierAtSubmission}
          WHEN 'premium' THEN 0
          WHEN 'professional' THEN 1
          WHEN 'essentials' THEN 2
          ELSE 3
        END`,
        asc(qbSupportTickets.createdAt),
      )
      .$dynamic();

    if (filterStatus && typeof filterStatus === "string") {
      query = query.where(eq(qbSupportTickets.status, filterStatus));
    }

    const results = await query;

    res.json({
      tickets: results.map(r => ({
        ...r.ticket,
        userName: r.userName,
        userEmail: r.userEmail,
        slaStatus: r.ticket.slaDeadline ? getSlaStatus(r.ticket.slaDeadline) : null,
        slaRemainingMinutes: r.ticket.slaDeadline ? getTimeRemainingMinutes(r.ticket.slaDeadline) : null,
      })),
    });
  } catch (err) {
    console.error("Admin list tickets error:", err);
    res.status(500).json({ error: "Failed to fetch tickets" });
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

    const updates: Record<string, any> = {
      operatorReply: sanitizeInput(reply),
      updatedAt: new Date(),
    };

    if (!ticket.firstResponseAt) {
      updates.firstResponseAt = new Date();
    }

    if (internalNote) {
      updates.internalNote = sanitizeInput(internalNote);
    }

    if (status && ["open", "resolved", "closed"].includes(status)) {
      updates.status = status;
    }

    const [updated] = await db
      .update(qbSupportTickets)
      .set(updates)
      .where(eq(qbSupportTickets.id, ticketId))
      .returning();

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

    const { status } = req.body;
    if (!status || !["open", "resolved", "closed"].includes(status)) {
      res.status(400).json({ error: "Invalid status. Must be open, resolved, or closed." });
      return;
    }

    const [updated] = await db
      .update(qbSupportTickets)
      .set({ status, updatedAt: new Date() })
      .where(eq(qbSupportTickets.id, ticketId))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    res.json({ ticket: updated });
  } catch (err) {
    console.error("Admin update ticket status error:", err);
    res.status(500).json({ error: "Failed to update ticket status" });
  }
});

export default router;
