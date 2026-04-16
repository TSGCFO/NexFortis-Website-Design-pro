import { db } from "@workspace/db";
import { qbNotificationEvents } from "@workspace/db/schema";

export type TicketNotificationType =
  | "ticket_created"
  | "customer_replied"
  | "operator_replied"
  | "ticket_resolved";

export async function emitTicketNotification(
  type: TicketNotificationType,
  ticketId: number,
  userId: string,
  payload: Record<string, unknown>,
): Promise<void> {
  try {
    await db.insert(qbNotificationEvents).values({
      type,
      ticketId,
      userId,
      payload,
      sent: false,
    });
    console.log(`[Notification] ${type} emitted for ticket ${ticketId}`);
  } catch (err) {
    console.error(`[Notification] Failed to emit ${type} for ticket ${ticketId}:`, err);
  }
}
