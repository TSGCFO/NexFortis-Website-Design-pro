import { createClient } from "@supabase/supabase-js";

async function seedOperator() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
    process.exit(1);
  }

  const email = process.argv[2];
  const password = process.env.OPERATOR_PASSWORD || process.argv[3];

  if (!email) {
    console.error("Usage: npx tsx artifacts/api-server/src/seed-operator.ts <email> [password]");
    console.error("Password can also be set via OPERATOR_PASSWORD env var.");
    process.exit(1);
  }

  if (!password) {
    console.error("Password required. Set OPERATOR_PASSWORD env var or pass as second argument.");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`Looking up existing user: ${email}...`);

  const { data: allUsersData, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (listError) {
    console.error("Failed to query users:", listError.message);
    process.exit(1);
  }

  const existingUser = allUsersData.users.find((u: { email?: string }) => u.email === email) || null;

  let userId: string;

  if (existingUser) {
    console.log(`User already exists: ${existingUser.id}`);
    userId = existingUser.id;
  } else {
    console.log(`Creating new user: ${email}...`);
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: "Operator", phone: "" },
    });

    if (error) {
      console.error("Failed to create user:", error.message);
      process.exit(1);
    }

    console.log(`Auth user created: ${data.user.id}`);
    userId = data.user.id;
  }

  const { data: existingProfile } = await supabase
    .from("qb_users")
    .select("id, role")
    .eq("id", userId)
    .single();

  if (existingProfile?.role === "operator") {
    console.log("User is already an operator. No changes needed.");
    return;
  }

  if (existingProfile) {
    const { error: updateError } = await supabase
      .from("qb_users")
      .update({ role: "operator" })
      .eq("id", userId);

    if (updateError) {
      console.error("Failed to update role:", updateError.message);
      process.exit(1);
    }
  } else {
    const { error: insertError } = await supabase
      .from("qb_users")
      .insert({ id: userId, email, name: "Operator", role: "operator" });

    if (insertError) {
      console.error("Failed to insert profile:", insertError.message);
      process.exit(1);
    }
  }

  console.log("Operator role assigned. Account ready.");
  console.log(`  Email: ${email}`);
  console.log(`  User ID: ${userId}`);
}

seedOperator().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
