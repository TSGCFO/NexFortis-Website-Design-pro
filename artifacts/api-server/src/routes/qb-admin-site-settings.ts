import { Router, type Request, type Response } from "express";
import { eq, sql } from "drizzle-orm";
import { db } from "@workspace/db";
import { qbSiteSettings, qbUsers } from "@workspace/db/schema";
import {
  LAUNCH_PROMO_KEY,
  invalidateLaunchPromoCache,
  readLaunchPromoActiveFromDb,
} from "../lib/site-settings";
import { resetProductCatalogCache } from "../lib/product-catalog";

const router = Router();

interface LaunchPromoStatusResponse {
  promo_active: boolean;
  updated_at: string | null;
  updated_by_name: string | null;
}

async function fetchLaunchPromoStatus(): Promise<LaunchPromoStatusResponse> {
  const [row] = await db
    .select({
      value: qbSiteSettings.value,
      updatedAt: qbSiteSettings.updatedAt,
      updatedBy: qbSiteSettings.updatedBy,
      updatedByName: qbUsers.name,
    })
    .from(qbSiteSettings)
    .leftJoin(qbUsers, eq(qbSiteSettings.updatedBy, qbUsers.id))
    .where(eq(qbSiteSettings.key, LAUNCH_PROMO_KEY))
    .limit(1);

  if (!row) {
    return { promo_active: true, updated_at: null, updated_by_name: null };
  }

  return {
    promo_active: row.value === "true",
    updated_at: row.updatedAt ? row.updatedAt.toISOString() : null,
    updated_by_name: row.updatedByName || null,
  };
}

router.get("/site-settings/launch-promo", async (_req: Request, res: Response) => {
  try {
    const status = await fetchLaunchPromoStatus();
    res.json(status);
  } catch (err) {
    console.error("[Admin Settings] Failed to read launch promo status:", err);
    res.status(500).json({ error: "Failed to load launch promo status" });
  }
});

router.put("/site-settings/launch-promo", async (req: Request, res: Response) => {
  try {
    const { active } = req.body || {};
    if (typeof active !== "boolean") {
      res.status(400).json({ error: "Request body must include `active` boolean" });
      return;
    }
    const adminUserId = req.userId!;

    await db
      .insert(qbSiteSettings)
      .values({
        key: LAUNCH_PROMO_KEY,
        value: active ? "true" : "false",
        updatedBy: adminUserId,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: qbSiteSettings.key,
        set: {
          value: active ? "true" : "false",
          updatedBy: adminUserId,
          updatedAt: sql`now()`,
        },
      });

    invalidateLaunchPromoCache();
    resetProductCatalogCache();

    // Re-prime cache so synchronous readers immediately see the new value.
    const newActive = await readLaunchPromoActiveFromDb();

    res.json({ ok: true, promo_active: newActive });
  } catch (err) {
    console.error("[Admin Settings] Failed to update launch promo:", err);
    res.status(500).json({ error: "Failed to update launch promo" });
  }
});

export default router;
