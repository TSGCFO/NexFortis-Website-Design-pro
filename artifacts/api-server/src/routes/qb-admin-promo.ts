import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  qbPromoCodes,
  qbPromoCodeRedemptions,
  qbPromoCodeAdminEvents,
  qbOrders,
  qbUsers,
} from "@workspace/db/schema";
import { eq, and, desc, asc, sql, ilike, or } from "drizzle-orm";
import {
  createStripeCouponAndPromoCode,
  deactivateStripePromoCode,
  reactivateStripePromoCode,
  type PromoCodeStripeInput,
} from "../lib/promo-stripe";
import { generateUniqueReferralCode } from "../lib/referral-code";

const router = Router();

const VALID_TYPES = ["percentage", "fixed_amount", "free_service", "subscription"] as const;
type PromoType = typeof VALID_TYPES[number];

const ALLOWED_CATEGORIES = [
  "quickbooks-conversion",
  "quickbooks-data-services",
  "platform-migrations",
  "expert-support",
  "volume-packs",
];

type PromoRow = typeof qbPromoCodes.$inferSelect;
type AdminEventInsert = typeof qbPromoCodeAdminEvents.$inferInsert;
type AdminEventAction = "create" | "update" | "deactivate" | "reactivate";
type JsonState = AdminEventInsert["beforeState"];

function computeStatus(row: PromoRow): "active" | "inactive" | "expired" | "exhausted" {
  if (!row.isActive) return "inactive";
  if (row.expiresAt && row.expiresAt.getTime() < Date.now()) return "expired";
  if (row.maxUses != null && row.redemptionCount >= row.maxUses) return "exhausted";
  return "active";
}

function withStatus(row: PromoRow) {
  return { ...row, status: computeStatus(row) };
}

function toJsonState(row: PromoRow | null): JsonState {
  if (!row) return null;
  // Drizzle returns Date instances; serialize for JSONB storage so audit
  // payloads round-trip cleanly.
  return JSON.parse(JSON.stringify(row)) as JsonState;
}

async function logAdminEvent(
  adminUserId: string,
  action: AdminEventAction,
  promoCodeId: number,
  beforeState: PromoRow | null,
  afterState: PromoRow | null,
) {
  try {
    await db.insert(qbPromoCodeAdminEvents).values({
      adminUserId,
      action,
      promoCodeId,
      beforeState: toJsonState(beforeState),
      afterState: toJsonState(afterState),
    });
  } catch (err) {
    console.error("[Admin Promo] Failed to log audit event:", err);
  }
}

function parseDate(v: unknown): Date | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  if (typeof v !== "string") return undefined;
  const d = new Date(v);
  if (isNaN(d.getTime())) return undefined;
  return d;
}

function asInt(v: unknown): number | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return undefined;
  return Math.floor(n);
}

function asBool(v: unknown, def = false): boolean {
  if (typeof v === "boolean") return v;
  if (v === "true") return true;
  if (v === "false") return false;
  return def;
}

function asStringArray(v: unknown): string[] | null | undefined {
  if (v === undefined) return undefined;
  if (v === null) return null;
  if (!Array.isArray(v)) return undefined;
  const arr = v.map((x) => String(x).trim()).filter(Boolean);
  return arr.length > 0 ? arr : null;
}

// ────────────────────────────────────────────────────────────────────────────
// GET /promo-analytics — summary
// ────────────────────────────────────────────────────────────────────────────
router.get("/promo-analytics", async (_req: Request, res: Response) => {
  try {
    const [activeRow] = await db
      .select({ c: sql<number>`count(*)::int` })
      .from(qbPromoCodes)
      .where(
        and(
          eq(qbPromoCodes.isActive, true),
          or(
            sql`${qbPromoCodes.expiresAt} IS NULL`,
            sql`${qbPromoCodes.expiresAt} > NOW()`,
          )!,
          or(
            sql`${qbPromoCodes.maxUses} IS NULL`,
            sql`${qbPromoCodes.redemptionCount} < ${qbPromoCodes.maxUses}`,
          )!,
        ),
      );

    const [redemptionRow] = await db
      .select({
        total: sql<number>`count(*)::int`,
        discount: sql<number>`COALESCE(SUM(${qbPromoCodeRedemptions.discountAmountCents}), 0)::int`,
      })
      .from(qbPromoCodeRedemptions);

    const topCodes = await db
      .select({
        promoCodeId: qbPromoCodeRedemptions.promoCodeId,
        code: qbPromoCodes.code,
        redemptions: sql<number>`count(*)::int`,
        discountCents: sql<number>`COALESCE(SUM(${qbPromoCodeRedemptions.discountAmountCents}), 0)::int`,
      })
      .from(qbPromoCodeRedemptions)
      .innerJoin(qbPromoCodes, eq(qbPromoCodeRedemptions.promoCodeId, qbPromoCodes.id))
      .groupBy(qbPromoCodeRedemptions.promoCodeId, qbPromoCodes.code)
      .orderBy(sql`count(*) desc`)
      .limit(5);

    res.json({
      activeCodes: activeRow?.c ?? 0,
      totalRedemptions: redemptionRow?.total ?? 0,
      totalDiscountCents: redemptionRow?.discount ?? 0,
      topCodes,
    });
  } catch (err) {
    console.error("[Admin Promo] analytics error:", err);
    res.status(500).json({ error: "Failed to load analytics" });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// GET /promo-codes — paginated list
// ────────────────────────────────────────────────────────────────────────────
router.get("/promo-codes", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const search = (req.query.search as string | undefined)?.trim();
    const status = req.query.status as string | undefined;
    const type = req.query.type as string | undefined;
    const sortField = (req.query.sort as string) || "createdAt";
    const sortDir = (req.query.order as string) === "asc" ? "asc" : "desc";

    const conds: any[] = [];
    if (search) conds.push(ilike(qbPromoCodes.code, `%${search}%`));
    if (type && (VALID_TYPES as readonly string[]).includes(type)) {
      conds.push(eq(qbPromoCodes.type, type as PromoType));
    }
    if (status === "inactive") conds.push(eq(qbPromoCodes.isActive, false));
    else if (status === "expired") {
      conds.push(eq(qbPromoCodes.isActive, true));
      conds.push(sql`${qbPromoCodes.expiresAt} IS NOT NULL AND ${qbPromoCodes.expiresAt} < NOW()`);
    } else if (status === "exhausted") {
      conds.push(eq(qbPromoCodes.isActive, true));
      conds.push(sql`${qbPromoCodes.maxUses} IS NOT NULL AND ${qbPromoCodes.redemptionCount} >= ${qbPromoCodes.maxUses}`);
    } else if (status === "active") {
      conds.push(eq(qbPromoCodes.isActive, true));
      conds.push(sql`(${qbPromoCodes.expiresAt} IS NULL OR ${qbPromoCodes.expiresAt} > NOW())`);
      conds.push(sql`(${qbPromoCodes.maxUses} IS NULL OR ${qbPromoCodes.redemptionCount} < ${qbPromoCodes.maxUses})`);
    }
    const whereClause = conds.length > 0 ? and(...conds) : undefined;

    const [countRow] = await db
      .select({ c: sql<number>`count(*)::int` })
      .from(qbPromoCodes)
      .where(whereClause);
    const total = countRow?.c ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const actualPage = Math.min(page, totalPages);
    const offset = (actualPage - 1) * limit;

    const sortColumn =
      sortField === "code" ? qbPromoCodes.code
      : sortField === "redemptionCount" ? qbPromoCodes.redemptionCount
      : sortField === "expiresAt" ? qbPromoCodes.expiresAt
      : qbPromoCodes.createdAt;

    const rows = await db
      .select()
      .from(qbPromoCodes)
      .where(whereClause)
      .orderBy(sortDir === "asc" ? asc(sortColumn) : desc(sortColumn))
      .limit(limit)
      .offset(offset);

    res.json({
      promoCodes: rows.map(withStatus),
      total,
      page: actualPage,
      limit,
    });
  } catch (err) {
    console.error("[Admin Promo] list error:", err);
    res.status(500).json({ error: "Failed to fetch promo codes" });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// POST /promo-codes — create
// ────────────────────────────────────────────────────────────────────────────
router.post("/promo-codes", async (req: Request, res: Response) => {
  try {
    const adminUserId = req.userId!;
    const body = req.body || {};

    const rawType = String(body.type || "");
    if (!(VALID_TYPES as readonly string[]).includes(rawType)) {
      res.status(400).json({ error: "Invalid type" });
      return;
    }
    const type = rawType as PromoType;

    let code = (body.code || "").toString().trim();
    if (!code && body.autoGenerate) {
      code = await generateUniqueReferralCode();
    }
    if (!code || code.length < 6 || code.length > 32 || !/^[A-Za-z0-9_-]+$/.test(code)) {
      res.status(400).json({ error: "Code must be 6–32 alphanumeric characters (underscore/hyphen allowed)." });
      return;
    }

    const [existing] = await db
      .select({ id: qbPromoCodes.id })
      .from(qbPromoCodes)
      .where(sql`LOWER(${qbPromoCodes.code}) = LOWER(${code})`)
      .limit(1);
    if (existing) {
      res.status(409).json({ error: "A promo code with this code already exists." });
      return;
    }

    const percentOff = asInt(body.percentOff);
    const amountOffCents = asInt(body.amountOffCents);
    const subscriptionDurationMonths = asInt(body.subscriptionDurationMonths);
    const maxUses = asInt(body.maxUses);
    const maxUsesPerCustomer = asInt(body.maxUsesPerCustomer);
    const minOrderAmountCents = asInt(body.minOrderAmountCents);
    const expiresAt = parseDate(body.expiresAt);
    const productIds = asStringArray(body.productIds);
    const categoryIds = asStringArray(body.categoryIds);

    if (type === "percentage" && (percentOff == null || percentOff < 1 || percentOff > 100)) {
      res.status(400).json({ error: "Percentage codes require percentOff between 1 and 100." });
      return;
    }
    if (type === "fixed_amount" && (amountOffCents == null || amountOffCents < 1)) {
      res.status(400).json({ error: "Fixed-amount codes require amountOffCents >= 1." });
      return;
    }
    if (type === "free_service") {
      const hasProduct = (productIds && productIds.length > 0) || (categoryIds && categoryIds.length > 0);
      if (!hasProduct) {
        res.status(400).json({ error: "Free service codes require at least one product or category restriction." });
        return;
      }
    }
    if (type === "subscription" && (subscriptionDurationMonths == null || subscriptionDurationMonths < 1 || subscriptionDurationMonths > 36)) {
      res.status(400).json({ error: "Subscription codes require subscriptionDurationMonths between 1 and 36." });
      return;
    }

    if (categoryIds) {
      const invalid = categoryIds.filter((c) => !ALLOWED_CATEGORIES.includes(c));
      if (invalid.length > 0) {
        res.status(400).json({ error: `Unknown categories: ${invalid.join(", ")}` });
        return;
      }
    }

    if (maxUses != null && maxUses < 1) {
      res.status(400).json({ error: "maxUses must be >= 1 or omitted for unlimited." });
      return;
    }
    if (maxUsesPerCustomer != null && maxUsesPerCustomer < 1) {
      res.status(400).json({ error: "maxUsesPerCustomer must be >= 1 or omitted for unlimited." });
      return;
    }
    if (minOrderAmountCents != null && minOrderAmountCents < 0) {
      res.status(400).json({ error: "minOrderAmountCents must be >= 0." });
      return;
    }

    const stripeInput: PromoCodeStripeInput = {
      code,
      type,
      percentOff: percentOff ?? null,
      amountOffCents: amountOffCents ?? null,
      subscriptionDurationMonths: subscriptionDurationMonths ?? null,
      maxUses: maxUses ?? null,
      expiresAt: expiresAt ?? null,
    };
    const stripeIds = await createStripeCouponAndPromoCode(stripeInput);

    const insertValues: typeof qbPromoCodes.$inferInsert = {
      code,
      isActive: true,
      type,
      percentOff: type === "free_service" ? 100 : (percentOff ?? null),
      amountOffCents: amountOffCents ?? null,
      subscriptionDurationMonths: subscriptionDurationMonths ?? null,
      maxUses: maxUses ?? null,
      maxUsesPerCustomer: maxUsesPerCustomer ?? null,
      expiresAt: expiresAt ?? null,
      productIds: productIds ?? null,
      categoryIds: categoryIds ?? null,
      minOrderAmountCents: minOrderAmountCents ?? null,
      firstTimeCustomerOnly: asBool(body.firstTimeCustomerOnly, false),
      stackableWithLaunchPromo: asBool(body.stackableWithLaunchPromo, true),
      restrictedToEmail: body.restrictedToEmail ? String(body.restrictedToEmail).trim().toLowerCase() : null,
      appliesToBasePrice: asBool(body.appliesToBasePrice, false),
      description: body.description ? String(body.description).slice(0, 500) : null,
      stripeCouponId: stripeIds.stripeCouponId,
      stripePromotionCodeId: stripeIds.stripePromotionCodeId,
    };

    const [inserted] = await db.insert(qbPromoCodes).values(insertValues).returning();
    await logAdminEvent(adminUserId, "create", inserted.id, null, inserted);

    res.status(201).json({ promoCode: withStatus(inserted) });
  } catch (err) {
    console.error("[Admin Promo] create error:", err);
    res.status(500).json({ error: "Failed to create promo code" });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// GET /promo-codes/:id — detail with redemption log + audit events
// ────────────────────────────────────────────────────────────────────────────
router.get("/promo-codes/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid promo code ID" });
      return;
    }

    const [row] = await db.select().from(qbPromoCodes).where(eq(qbPromoCodes.id, id)).limit(1);
    if (!row) {
      res.status(404).json({ error: "Promo code not found" });
      return;
    }

    const redemptionPage = Math.max(1, parseInt(req.query.redemptionPage as string) || 1);
    const redemptionLimit = Math.min(100, Math.max(1, parseInt(req.query.redemptionLimit as string) || 25));
    const offset = (redemptionPage - 1) * redemptionLimit;

    const [countRow] = await db
      .select({ c: sql<number>`count(*)::int` })
      .from(qbPromoCodeRedemptions)
      .where(eq(qbPromoCodeRedemptions.promoCodeId, id));
    const totalRedemptions = countRow?.c ?? 0;

    const redemptions = await db
      .select({
        id: qbPromoCodeRedemptions.id,
        userId: qbPromoCodeRedemptions.userId,
        guestEmail: qbPromoCodeRedemptions.guestEmail,
        orderId: qbPromoCodeRedemptions.orderId,
        discountAmountCents: qbPromoCodeRedemptions.discountAmountCents,
        orderTotalBeforeCents: qbPromoCodeRedemptions.orderTotalBeforeCents,
        orderTotalAfterCents: qbPromoCodeRedemptions.orderTotalAfterCents,
        redeemedAt: qbPromoCodeRedemptions.redeemedAt,
        customerName: qbUsers.name,
        customerEmail: qbUsers.email,
        orderStatus: qbOrders.status,
      })
      .from(qbPromoCodeRedemptions)
      .leftJoin(qbUsers, eq(qbPromoCodeRedemptions.userId, qbUsers.id))
      .leftJoin(qbOrders, eq(qbPromoCodeRedemptions.orderId, qbOrders.id))
      .where(eq(qbPromoCodeRedemptions.promoCodeId, id))
      .orderBy(desc(qbPromoCodeRedemptions.redeemedAt))
      .limit(redemptionLimit)
      .offset(offset);

    const events = await db
      .select({
        id: qbPromoCodeAdminEvents.id,
        action: qbPromoCodeAdminEvents.action,
        beforeState: qbPromoCodeAdminEvents.beforeState,
        afterState: qbPromoCodeAdminEvents.afterState,
        createdAt: qbPromoCodeAdminEvents.createdAt,
        adminUserId: qbPromoCodeAdminEvents.adminUserId,
        adminName: qbUsers.name,
        adminEmail: qbUsers.email,
      })
      .from(qbPromoCodeAdminEvents)
      .leftJoin(qbUsers, eq(qbPromoCodeAdminEvents.adminUserId, qbUsers.id))
      .where(eq(qbPromoCodeAdminEvents.promoCodeId, id))
      .orderBy(desc(qbPromoCodeAdminEvents.createdAt))
      .limit(50);

    res.json({
      promoCode: withStatus(row),
      redemptions: redemptions.map((r) => ({
        ...r,
        customerEmail: r.customerEmail ?? r.guestEmail,
      })),
      totalRedemptions,
      redemptionPage,
      redemptionLimit,
      events,
    });
  } catch (err) {
    console.error("[Admin Promo] detail error:", err);
    res.status(500).json({ error: "Failed to fetch promo code" });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// PATCH /promo-codes/:id — restricted update (only mutable fields)
// ────────────────────────────────────────────────────────────────────────────
type EditableValue = number | string | boolean | Date | null;
type EditableUpdates = Partial<Pick<PromoRow,
  | "maxUses"
  | "maxUsesPerCustomer"
  | "expiresAt"
  | "minOrderAmountCents"
  | "firstTimeCustomerOnly"
  | "stackableWithLaunchPromo"
  | "appliesToBasePrice"
  | "restrictedToEmail"
  | "description"
  | "isActive"
  | "stripePromotionCodeId"
  | "updatedAt"
>>;

router.patch("/promo-codes/:id", async (req: Request, res: Response) => {
  try {
    const adminUserId = req.userId!;
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid promo code ID" });
      return;
    }

    const [before] = await db.select().from(qbPromoCodes).where(eq(qbPromoCodes.id, id)).limit(1);
    if (!before) {
      res.status(404).json({ error: "Promo code not found" });
      return;
    }

    const body = req.body || {};
    const updates: EditableUpdates = {};
    const has = (k: string) => Object.prototype.hasOwnProperty.call(body, k);

    if (has("maxUses")) {
      const n = asInt(body.maxUses);
      if (n !== undefined) {
        if (n != null && n < 1) { res.status(400).json({ error: "maxUses must be >= 1 or null" }); return; }
        updates.maxUses = n;
      }
    }
    if (has("maxUsesPerCustomer")) {
      const n = asInt(body.maxUsesPerCustomer);
      if (n !== undefined) {
        if (n != null && n < 1) { res.status(400).json({ error: "maxUsesPerCustomer must be >= 1 or null" }); return; }
        updates.maxUsesPerCustomer = n;
      }
    }
    if (has("minOrderAmountCents")) {
      const n = asInt(body.minOrderAmountCents);
      if (n !== undefined) {
        if (n != null && n < 0) { res.status(400).json({ error: "minOrderAmountCents must be >= 0" }); return; }
        updates.minOrderAmountCents = n;
      }
    }
    if (has("expiresAt")) {
      const d = parseDate(body.expiresAt);
      if (d !== undefined) updates.expiresAt = d;
    }
    if (has("firstTimeCustomerOnly")) updates.firstTimeCustomerOnly = asBool(body.firstTimeCustomerOnly, before.firstTimeCustomerOnly);
    if (has("stackableWithLaunchPromo")) updates.stackableWithLaunchPromo = asBool(body.stackableWithLaunchPromo, before.stackableWithLaunchPromo);
    if (has("appliesToBasePrice")) updates.appliesToBasePrice = asBool(body.appliesToBasePrice, before.appliesToBasePrice);
    if (has("isActive")) updates.isActive = asBool(body.isActive, before.isActive);
    if (has("restrictedToEmail")) updates.restrictedToEmail = body.restrictedToEmail ? String(body.restrictedToEmail).trim().toLowerCase() : null;
    if (has("description")) updates.description = body.description ? String(body.description).slice(0, 500) : null;

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No editable fields provided" });
      return;
    }

    if (updates.maxUses != null && updates.maxUses < before.redemptionCount) {
      res.status(400).json({ error: `maxUses cannot be less than current redemption count (${before.redemptionCount}).` });
      return;
    }

    const willToggleActive = "isActive" in updates && updates.isActive !== before.isActive;

    // Mirror to Stripe BEFORE persisting so any new promotion code ID is stored.
    if (willToggleActive) {
      if (updates.isActive === false && before.stripePromotionCodeId) {
        await deactivateStripePromoCode(before.stripePromotionCodeId);
      } else if (updates.isActive === true) {
        const result = await reactivateStripePromoCode(
          before.stripeCouponId,
          before.stripePromotionCodeId,
          before.code,
        );
        if (result.replaced && result.stripePromotionCodeId) {
          updates.stripePromotionCodeId = result.stripePromotionCodeId;
        }
      }
    }

    updates.updatedAt = new Date();

    const [updated] = await db
      .update(qbPromoCodes)
      .set(updates)
      .where(eq(qbPromoCodes.id, id))
      .returning();

    const action: AdminEventAction =
      willToggleActive ? (updates.isActive ? "reactivate" : "deactivate") : "update";

    await logAdminEvent(adminUserId, action, id, before, updated);

    res.json({ promoCode: withStatus(updated) });
  } catch (err) {
    console.error("[Admin Promo] update error:", err);
    res.status(500).json({ error: "Failed to update promo code" });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// POST /promo-codes/:id/deactivate — explicit deactivation
// ────────────────────────────────────────────────────────────────────────────
router.post("/promo-codes/:id/deactivate", async (req: Request, res: Response) => {
  try {
    const adminUserId = req.userId!;
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid promo code ID" });
      return;
    }

    const [before] = await db.select().from(qbPromoCodes).where(eq(qbPromoCodes.id, id)).limit(1);
    if (!before) {
      res.status(404).json({ error: "Promo code not found" });
      return;
    }

    if (!before.isActive) {
      res.json({ promoCode: withStatus(before) });
      return;
    }

    const [updated] = await db
      .update(qbPromoCodes)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(qbPromoCodes.id, id))
      .returning();

    if (before.stripePromotionCodeId) {
      await deactivateStripePromoCode(before.stripePromotionCodeId);
    }

    await logAdminEvent(adminUserId, "deactivate", id, before, updated);

    res.json({ promoCode: withStatus(updated) });
  } catch (err) {
    console.error("[Admin Promo] deactivate error:", err);
    res.status(500).json({ error: "Failed to deactivate promo code" });
  }
});

export default router;
