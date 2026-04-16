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

let storageChecked = false;
let storageOk = false;
let storageLastFailure = 0;
const STORAGE_FAILURE_TTL_MS = 30_000;

export async function isStorageAvailable(): Promise<boolean> {
  if (storageChecked) return storageOk;
  if (!supabaseAdmin) return false;

  if (storageLastFailure && Date.now() - storageLastFailure < STORAGE_FAILURE_TTL_MS) {
    return false;
  }

  try {
    const { error } = await supabaseAdmin.storage.from("order-files").list("", { limit: 1 });
    if (error) {
      console.error(`[Storage] order-files bucket verification failed: ${error.message}`);
      storageLastFailure = Date.now();
      return false;
    }
    storageChecked = true;
    storageOk = true;
    storageLastFailure = 0;
    return true;
  } catch (err) {
    console.error("[Storage] order-files bucket verification failed:", err);
    storageLastFailure = Date.now();
    return false;
  }
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
