import { Router, type Request, type Response } from "express";
import {
  getLaunchPromoActive,
  LAUNCH_PROMO_LABEL,
} from "../lib/site-settings";

const router = Router();

/**
 * Public endpoint used by the storefront to discover whether the launch promo
 * is currently active. The storefront uses this to override the static
 * `promo_active` value baked into `products.json`.
 */
router.get("/promo-status", async (_req: Request, res: Response) => {
  try {
    const active = await getLaunchPromoActive();
    res.set("Cache-Control", "public, max-age=30");
    res.json({
      promo_active: active,
      promo_label: active ? LAUNCH_PROMO_LABEL : "",
    });
  } catch (err) {
    console.error("[site-settings] promo-status error:", err);
    res.status(500).json({ error: "Failed to load promo status" });
  }
});

export default router;
