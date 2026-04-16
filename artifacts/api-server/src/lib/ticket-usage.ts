import { db } from "@workspace/db";
import { qbTicketUsage } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Atomically gets or creates a ticket-usage row using INSERT ... ON CONFLICT DO NOTHING
 * followed by a SELECT.  Safe under concurrent requests because the unique constraint
 * (subscriptionId, periodStart) prevents duplicates.
 */
export async function getOrCreateTicketUsage(
  subscriptionId: number,
  periodStart: Date,
  periodEnd: Date,
  ticketLimit: number,
  txOrDb: Pick<typeof db, "insert" | "select"> = db,
) {
  await txOrDb
    .insert(qbTicketUsage)
    .values({ subscriptionId, periodStart, periodEnd, ticketLimit, ticketsUsed: 0 })
    .onConflictDoNothing({
      target: [qbTicketUsage.subscriptionId, qbTicketUsage.periodStart],
    });

  const [row] = await txOrDb
    .select()
    .from(qbTicketUsage)
    .where(
      and(
        eq(qbTicketUsage.subscriptionId, subscriptionId),
        eq(qbTicketUsage.periodStart, periodStart),
      ),
    )
    .limit(1);

  return row;
}
