import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env["SUPABASE_URL"];
const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

let supabaseAdmin: SupabaseClient | null = null;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    "SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY environment variables are missing. " +
    "Supabase admin client is disabled — auth-dependent routes will return 503.",
  );
} else {
  supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export { supabaseAdmin };

export function createSupabaseClient(accessToken: string): SupabaseClient {
  const anonKey = process.env["SUPABASE_ANON_KEY"];
  if (!anonKey) {
    throw new Error("SUPABASE_ANON_KEY environment variable is required.");
  }

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL environment variable is required.");
  }

  return createClient(
    supabaseUrl,
    anonKey,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
