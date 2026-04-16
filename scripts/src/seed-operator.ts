import bcrypt from "bcryptjs";
import { db, operatorUsers } from "@workspace/db";

async function main() {
  let email = process.env.OPERATOR_EMAIL;
  let password = process.env.OPERATOR_PASSWORD;
  const name = process.env.OPERATOR_NAME || "Operator";

  if (!email || !password) {
    console.warn(
      "[seed-operator] OPERATOR_EMAIL and/or OPERATOR_PASSWORD not set. " +
        "Falling back to default operator credentials. " +
        "DO NOT use defaults in production — set OPERATOR_EMAIL and OPERATOR_PASSWORD env vars."
    );
    email = email || "operator@nexfortis.com";
    password = password || "ChangeMe123!";
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
