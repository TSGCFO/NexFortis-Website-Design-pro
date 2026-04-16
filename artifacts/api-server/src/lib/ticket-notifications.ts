import { db } from "@workspace/db";
import { qbNotificationEvents, qbNotificationPreferences, qbUsers } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { sendEmail } from "./email-service";
import {
  ticketCreatedEmail,
  operatorRepliedEmail,
  ticketResolvedEmail,
} from "./email-templates";
import { logger } from "./logger";

export type TicketNotificationType =
  | "ticket_created"
  | "customer_replied"
  | "operator_replied"
  | "ticket_resolved";

const PORTAL_URL = process.env.PORTAL_URL || "https://nexfortis.com/qb-portal";
const API_BASE_URL = process.env.API_BASE_URL || "https://nexfortis.com/api";

const PREF_FIELD_MAP: Record<string, "ticketCreated" | "operatorReplied" | "ticketResolved"> = {
  ticket_created: "ticketCreated",
  operator_replied: "operatorReplied",
  ticket_resolved: "ticketResolved",
};

async function getOrCreateUnsubscribeToken(userId: string): Promise<string> {
  const [existing] = await db
    .select({ unsubscribeToken: qbNotificationPreferences.unsubscribeToken })
    .from(qbNotificationPreferences)
    .where(eq(qbNotificationPreferences.userId, userId))
    .limit(1);

  if (existing) {
    return existing.unsubscribeToken;
  }

  const token = randomBytes(32).toString("hex");
  await db.insert(qbNotificationPreferences).values({
    userId,
    unsubscribeToken: token,
  });
  return token;
}

async function isNotificationEnabled(userId: string, type: TicketNotificationType): Promise<boolean> {
  const prefField = PREF_FIELD_MAP[type];
  if (!prefField) return false;

  const [prefs] = await db
    .select()
    .from(qbNotificationPreferences)
    .where(eq(qbNotificationPreferences.userId, userId))
    .limit(1);

  if (!prefs) return true;
  return prefs[prefField];
}

async function getUserEmail(userId: string): Promise<{ email: string; name: string } | null> {
  const [user] = await db
    .select({ email: qbUsers.email, name: qbUsers.name })
    .from(qbUsers)
    .where(eq(qbUsers.id, userId))
    .limit(1);

  return user || null;
}

export async function emitTicketNotification(
  type: TicketNotificationType,
  ticketId: number,
  userId: string,
  payload: Record<string, unknown>,
): Promise<void> {
  try {
    const [event] = await db.insert(qbNotificationEvents).values({
      type,
      ticketId,
      userId,
      payload,
      sent: false,
    }).returning();

    logger.info({ type, ticketId, userId, eventId: event.id }, "[Notification] Event emitted");

    if (type === "customer_replied") {
      return;
    }

    const prefField = PREF_FIELD_MAP[type];
    if (!prefField) return;

    const enabled = await isNotificationEnabled(userId, type);
    if (!enabled) {
      logger.info({ type, ticketId, userId }, "[Notification] User opted out of this notification type");
      return;
    }

    const user = await getUserEmail(userId);
    if (!user) {
      logger.warn({ userId }, "[Notification] User not found for email");
      return;
    }

    const unsubscribeToken = await getOrCreateUnsubscribeToken(userId);
    const unsubscribeUrl = `${API_BASE_URL}/qb/notifications/preferences?token=${unsubscribeToken}`;
    const customerName = user.name || "Customer";

    let emailContent: { subject: string; html: string } | null = null;

    switch (type) {
      case "ticket_created":
        emailContent = ticketCreatedEmail(
          customerName,
          ticketId,
          (payload.subject as string) || "Support Request",
          (payload.slaDeadline as string) || new Date().toISOString(),
          (payload.isCritical as boolean) || false,
          PORTAL_URL,
          unsubscribeUrl,
        );
        break;
      case "operator_replied":
        emailContent = operatorRepliedEmail(
          customerName,
          ticketId,
          (payload.subject as string) || "Support Request",
          (payload.replyPreview as string) || "",
          PORTAL_URL,
          unsubscribeUrl,
        );
        break;
      case "ticket_resolved":
        emailContent = ticketResolvedEmail(
          customerName,
          ticketId,
          (payload.subject as string) || "Support Request",
          PORTAL_URL,
          unsubscribeUrl,
        );
        break;
    }

    if (emailContent) {
      const sent = await sendEmail({
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html,
        replyTo: "support@nexfortis.com",
      });

      if (sent) {
        await db
          .update(qbNotificationEvents)
          .set({ sent: true })
          .where(eq(qbNotificationEvents.id, event.id));
      }
    }
  } catch (err) {
    logger.error({ err, type, ticketId, userId }, "[Notification] Failed to process notification");
  }
}
