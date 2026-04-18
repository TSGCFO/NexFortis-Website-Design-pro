import bcrypt from "bcryptjs";
import { db, operatorUsers } from "@workspace/db";

async function main() {
  const email = process.env.OPERATOR_EMAIL?.toLowerCase().trim();
  const password = process.env.OPERATOR_PASSWORD;
  const name = process.env.OPERATOR_NAME || "Operator";

  if (!email || !password) {
    console.error(
      "[seed-operator] OPERATOR_EMAIL and OPERATOR_PASSWORD must both be set as environment variables.",
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("[seed-operator] OPERATOR_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db
    .insert(operatorUsers)
    .values({ email, passwordHash, name })
    .onConflictDoUpdate({
      target: operatorUsers.email,
      set: { passwordHash, name },
    });

  console.log(`[seed-operator] Upserted operator: ${email}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("[seed-operator] Failed:", err);
  process.exit(1);
});
