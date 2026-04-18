import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { qbSiteSettings } from "@workspace/db/schema";

export const LAUNCH_PROMO_KEY = "launch_promo_active";
export const LAUNCH_PROMO_LABEL = "Launch Special — 50% Off";

const CACHE_TTL_MS = 30_000;

interface PromoStatusCacheEntry {
  active: boolean;
  expiresAt: number;
}

let promoStatusCache: PromoStatusCacheEntry | null = null;

function parseBoolish(raw: string | null | undefined, fallback: boolean): boolean {
  if (raw == null) return fallback;
  const v = String(raw).trim().toLowerCase();
  if (v === "true" || v === "1" || v === "yes" || v === "on") return true;
  if (v === "false" || v === "0" || v === "no" || v === "off") return false;
  return fallback;
}

export async function readLaunchPromoActiveFromDb(): Promise<boolean> {
  const [row] = await db
    .select()
    .from(qbSiteSettings)
    .where(eq(qbSiteSettings.key, LAUNCH_PROMO_KEY))
    .limit(1);
  return parseBoolish(row?.value, true);
}

export async function getLaunchPromoActive(): Promise<boolean> {
  const now = Date.now();
  if (promoStatusCache && promoStatusCache.expiresAt > now) {
    return promoStatusCache.active;
  }
  try {
    const active = await readLaunchPromoActiveFromDb();
    promoStatusCache = { active, expiresAt: now + CACHE_TTL_MS };
    return active;
  } catch (err) {
    console.error("[site-settings] Failed to read launch promo status from DB:", err);
    if (promoStatusCache) return promoStatusCache.active;
    // No DB result and no prior cache — fall back to "active" (the default
    // historical behavior) so checkout pricing matches the static catalog.
    return true;
  }
}

export function getLaunchPromoActiveSync(): boolean {
  // Use only the cached value. Callers that need a guaranteed-fresh value
  // should call `getLaunchPromoActive()` (which is async). This sync helper
  // exists for hot paths like `getActivePrice()` that cannot be made async.
  return promoStatusCache?.active ?? true;
}

export function invalidateLaunchPromoCache(): void {
  promoStatusCache = null;
}

/**
 * Eagerly populate the in-memory cache. Call once at startup so synchronous
 * readers (like `getActivePrice()`) reflect the current DB value rather than
 * the default `true` fallback.
 */
export async function primeLaunchPromoCache(): Promise<void> {
  try {
    const active = await readLaunchPromoActiveFromDb();
    promoStatusCache = { active, expiresAt: Date.now() + CACHE_TTL_MS };
  } catch (err) {
    console.error("[site-settings] Failed to prime launch promo cache:", err);
  }
}
