import { db } from "@workspace/db";
import { qbPromoCodes } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";

const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCode(): string {
  let code = "REF";
  for (let i = 0; i < 6; i++) {
    code += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return code;
}

export async function generateUniqueReferralCode(maxAttempts = 5): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const code = randomCode();
    const [existing] = await db
      .select({ id: qbPromoCodes.id })
      .from(qbPromoCodes)
      .where(sql`LOWER(${qbPromoCodes.code}) = LOWER(${code})`)
      .limit(1);
    if (!existing) return code;
  }
  throw new Error("Failed to generate a unique referral code after multiple attempts");
}
