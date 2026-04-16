import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { qbNotificationPreferences } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/preferences", async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    if (!token) {
      res.status(400).json({ error: "Missing token parameter" });
      return;
    }

    const [prefs] = await db
      .select()
      .from(qbNotificationPreferences)
      .where(eq(qbNotificationPreferences.unsubscribeToken, token))
      .limit(1);

    if (!prefs) {
      res.status(404).json({ error: "Invalid or expired token" });
      return;
    }

    res.json({
      preferences: {
        ticketCreated: prefs.ticketCreated,
        operatorReplied: prefs.operatorReplied,
        ticketResolved: prefs.ticketResolved,
      },
    });
  } catch (err) {
    console.error("Get notification preferences error:", err);
    res.status(500).json({ error: "Failed to fetch preferences" });
  }
});

router.patch("/preferences", async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    if (!token) {
      res.status(400).json({ error: "Missing token parameter" });
      return;
    }

    const { ticketCreated, operatorReplied, ticketResolved } = req.body;

    const [existing] = await db
      .select()
      .from(qbNotificationPreferences)
      .where(eq(qbNotificationPreferences.unsubscribeToken, token))
      .limit(1);

    if (!existing) {
      res.status(404).json({ error: "Invalid or expired token" });
      return;
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (typeof ticketCreated === "boolean") updates.ticketCreated = ticketCreated;
    if (typeof operatorReplied === "boolean") updates.operatorReplied = operatorReplied;
    if (typeof ticketResolved === "boolean") updates.ticketResolved = ticketResolved;

    const [updated] = await db
      .update(qbNotificationPreferences)
      .set(updates)
      .where(eq(qbNotificationPreferences.unsubscribeToken, token))
      .returning();

    res.json({
      preferences: {
        ticketCreated: updated.ticketCreated,
        operatorReplied: updated.operatorReplied,
        ticketResolved: updated.ticketResolved,
      },
    });
  } catch (err) {
    console.error("Update notification preferences error:", err);
    res.status(500).json({ error: "Failed to update preferences" });
  }
});

router.post("/unsubscribe-all", async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    if (!token) {
      res.status(400).json({ error: "Missing token parameter" });
      return;
    }

    const [existing] = await db
      .select()
      .from(qbNotificationPreferences)
      .where(eq(qbNotificationPreferences.unsubscribeToken, token))
      .limit(1);

    if (!existing) {
      res.status(404).json({ error: "Invalid or expired token" });
      return;
    }

    await db
      .update(qbNotificationPreferences)
      .set({
        ticketCreated: false,
        operatorReplied: false,
        ticketResolved: false,
        updatedAt: new Date(),
      })
      .where(eq(qbNotificationPreferences.unsubscribeToken, token));

    res.json({ message: "Successfully unsubscribed from all ticket notifications." });
  } catch (err) {
    console.error("Unsubscribe all error:", err);
    res.status(500).json({ error: "Failed to unsubscribe" });
  }
});

export default router;
