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

let storageAvailable = false;

async function verifyStorageBucket(): Promise<void> {
  if (!supabaseAdmin) return;
  try {
    const { error } = await supabaseAdmin.storage.from("order-files").list("", { limit: 1 });
    if (error) {
      console.error(`[Storage] order-files bucket verification failed: ${error.message}`);
      return;
    }
    storageAvailable = true;
  } catch (err) {
    console.error("[Storage] order-files bucket verification failed:", err);
  }
}

verifyStorageBucket();

export function isStorageAvailable(): boolean {
  return storageAvailable;
}

export function createSupabaseClient(accessToken: string): SupabaseClient | null {
  const anonKey = process.env["SUPABASE_ANON_KEY"];
  if (!anonKey) {
    console.warn("SUPABASE_ANON_KEY is missing — createSupabaseClient unavailable.");
    return null;
  }

  if (!supabaseUrl) {
    console.warn("SUPABASE_URL is missing — createSupabaseClient unavailable.");
    return null;
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
