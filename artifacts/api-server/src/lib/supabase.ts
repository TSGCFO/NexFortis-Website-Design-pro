import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env["SUPABASE_URL"];
const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "FATAL: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required. " +
    "Set them in Replit Secrets or .env before starting the server.",
  );
}

const SUPABASE_URL: string = supabaseUrl;
const SERVICE_ROLE_KEY: string = serviceRoleKey;

export const supabaseAdmin: SupabaseClient = createClient(
  SUPABASE_URL,
  SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export function createSupabaseClient(accessToken: string): SupabaseClient {
  const anonKey = process.env["SUPABASE_ANON_KEY"];
  if (!anonKey) {
    throw new Error("SUPABASE_ANON_KEY environment variable is required.");
  }

  return createClient(
    SUPABASE_URL,
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
