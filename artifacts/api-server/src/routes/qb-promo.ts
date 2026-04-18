import { Router, type Request, type Response } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { db } from "@workspace/db";
import {
  qbPromoCodes,
  qbPromoCodeRedemptions,
  qbReferralCredits,
  qbOrders,
  qbUsers,
  qbSubscriptions,
} from "@workspace/db/schema";
import { eq, and, sql, or, count } from "drizzle-orm";
import { requireAuth } from "./qb-portal";
import { sendEmail } from "../lib/email-service";
import { referralCreditEarnedEmail } from "../lib/email-templates";
import { supabaseAdmin } from "../lib/supabase";
import { loadProductCatalog } from "../lib/product-catalog";

function categoryOfProduct(productId: string): string | null {
  const idNum = Number(productId);
  if (!Number.isFinite(idNum)) return null;
  const p = loadProductCatalog().services.find((x) => x.id === idNum);
  return p?.category_slug || null;
}

const router = Router();

function getClientIp(req: any): string {
  // app.set("trust proxy", 1) makes req.ip the real client IP from the
  // first untrusted hop. Use req.ip rather than the raw X-Forwarded-For
  // header to avoid client-controlled spoofing of the rate-limit key.
  return req.ip || req.socket?.remoteAddress || "unknown";
}

const validateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => ipKeyGenerator(getClientIp(req)),
  message: { valid: false, errorCode: "RATE_LIMITED", errorMessage: "Too many attempts. Please try again in a minute." },
});

interface OrderItemInput {
  productId: string | number;
  quantity: number;
  unitPriceCents: number;
}

export interface ValidateInput {
  code: string;
  orderItems: OrderItemInput[];
  userId?: string;
  guestEmail?: string;
  orderType: "one_time" | "subscription";
}

export interface OrderItemInputExported extends OrderItemInput {}

const REFERRAL_CREDIT_CENTS = 2500;
const LAUNCH_PROMO_PERCENT = 50;

function launchPromoActive(): boolean {
  return (process.env.LAUNCH_PROMO_ACTIVE || "").toLowerCase() === "true";
}

function formatCad(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
}

function codeLabel(row: typeof qbPromoCodes.$inferSelect): string {
  if (row.type === "percentage") return `${row.percentOff}% off`;
  if (row.type === "free_service") return "Free service";
  if (row.type === "fixed_amount") return `${formatCad(row.amountOffCents || 0)} off`;
  if (row.type === "subscription") return `${row.percentOff ?? 100}% off (${row.subscriptionDurationMonths ?? 1} month${(row.subscriptionDurationMonths ?? 1) > 1 ? "s" : ""})`;
  return "Discount";
}

function itemMatches(row: typeof qbPromoCodes.$inferSelect, item: OrderItemInput): boolean {
  const hasProductRestriction = !!(row.productIds && row.productIds.length > 0);
  const hasCategoryRestriction = !!(row.categoryIds && row.categoryIds.length > 0);
  if (!hasProductRestriction && !hasCategoryRestriction) return true;
  const pid = String(item.productId);
  if (hasProductRestriction && row.productIds!.includes(pid)) return true;
  if (hasCategoryRestriction) {
    const cat = categoryOfProduct(pid);
    if (cat && row.categoryIds!.includes(cat)) return true;
  }
  return false;
}

function productMatches(row: typeof qbPromoCodes.$inferSelect, orderItems: OrderItemInput[]): boolean {
  return orderItems.some((item) => itemMatches(row, item));
}

function matchingProductIds(row: typeof qbPromoCodes.$inferSelect, orderItems: OrderItemInput[]): (string | number)[] {
  return orderItems.filter((it) => itemMatches(row, it)).map((it) => it.productId);
}

function computeBaseSubtotal(items: OrderItemInput[]): number {
  return items.reduce((s, it) => s + Math.max(0, Math.floor(it.unitPriceCents * Math.max(1, it.quantity))), 0);
}

function computeDiscount(
  row: typeof qbPromoCodes.$inferSelect,
  baseSubtotal: number,
): number {
  if (row.type === "percentage" || row.type === "free_service") {
    const percent = row.type === "free_service" ? 100 : (row.percentOff ?? 0);
    return Math.floor((baseSubtotal * percent) / 100);
  }
  if (row.type === "fixed_amount") {
    return Math.min(baseSubtotal, row.amountOffCents ?? 0);
  }
  if (row.type === "subscription") {
    const percent = row.percentOff ?? 100;
    return Math.floor((baseSubtotal * percent) / 100);
  }
  return 0;
}

async function findCode(code: string) {
  const [row] = await db
    .select()
    .from(qbPromoCodes)
    .where(sql`LOWER(${qbPromoCodes.code}) = LOWER(${code})`)
    .limit(1);
  return row || null;
}

async function customerRedemptionCount(
  promoCodeId: number,
  userId?: string,
  email?: string,
): Promise<number> {
  if (!userId && !email) return 0;
  const conds = [] as any[];
  if (userId) conds.push(eq(qbPromoCodeRedemptions.userId, userId));
  if (email) conds.push(eq(qbPromoCodeRedemptions.guestEmail, email.toLowerCase()));
  const [row] = await db
    .select({ c: count() })
    .from(qbPromoCodeRedemptions)
    .where(and(eq(qbPromoCodeRedemptions.promoCodeId, promoCodeId), conds.length > 1 ? or(...conds) : conds[0]));
  return Number(row?.c || 0);
}

async function hasPreviousCompletedOrder(userId?: string, email?: string): Promise<boolean> {
  if (!userId && !email) return false;
  const conds = [] as any[];
  if (userId) conds.push(eq(qbOrders.userId, userId));
  if (email) conds.push(eq(qbOrders.customerEmail, email));
  const [row] = await db
    .select({ c: count() })
    .from(qbOrders)
    .where(and(
      conds.length > 1 ? or(...conds) : conds[0],
      or(eq(qbOrders.status, "paid"), eq(qbOrders.status, "processing"), eq(qbOrders.status, "completed"))!,
    ));
  return Number(row?.c || 0) > 0;
}

export type ValidationResult =
  | { ok: true; row: typeof qbPromoCodes.$inferSelect; baseSubtotal: number; launchPromoCents: number; codeDiscountCents: number; finalTotal: number; previewLineItems: any[]; stackingNotice?: string }
  | { ok: false; errorCode: string; errorMessage: string };

export async function runValidation(input: ValidateInput): Promise<ValidationResult> {
  const row = await findCode(input.code);
  if (!row || !row.isActive) {
    return { ok: false, errorCode: "NOT_FOUND", errorMessage: "This promo code is invalid or has expired." };
  }

  if (row.expiresAt && row.expiresAt.getTime() < Date.now()) {
    return { ok: false, errorCode: "EXPIRED", errorMessage: `This promo code expired on ${fmtDate(row.expiresAt)}.` };
  }

  if (row.maxUses != null && row.redemptionCount >= row.maxUses) {
    return { ok: false, errorCode: "EXHAUSTED", errorMessage: "This promo code has reached its usage limit." };
  }

  if (row.maxUsesPerCustomer != null) {
    const used = await customerRedemptionCount(row.id, input.userId, input.guestEmail?.toLowerCase());
    if (used >= row.maxUsesPerCustomer) {
      return { ok: false, errorCode: "ALREADY_USED_MAX_TIMES", errorMessage: "You have already used this code the maximum number of times." };
    }
  }

  if (row.restrictedToEmail) {
    const callerEmail = (input.guestEmail || "").toLowerCase();
    let authEmail = "";
    if (input.userId) {
      const [u] = await db.select().from(qbUsers).where(eq(qbUsers.id, input.userId)).limit(1);
      authEmail = (u?.email || "").toLowerCase();
    }
    if (row.restrictedToEmail.toLowerCase() !== callerEmail && row.restrictedToEmail.toLowerCase() !== authEmail) {
      return { ok: false, errorCode: "EMAIL_RESTRICTED", errorMessage: "This promo code is not valid for your account." };
    }
  }

  if (!productMatches(row, input.orderItems)) {
    return { ok: false, errorCode: "PRODUCT_MISMATCH", errorMessage: "This code is not valid for the selected product(s)." };
  }

  const baseSubtotal = computeBaseSubtotal(input.orderItems);

  if (row.minOrderAmountCents != null && baseSubtotal < row.minOrderAmountCents) {
    return {
      ok: false,
      errorCode: "MINIMUM_NOT_MET",
      errorMessage: `This code requires a minimum order of ${formatCad(row.minOrderAmountCents)} CAD. Your current subtotal is ${formatCad(baseSubtotal)}.`,
    };
  }

  if (row.firstTimeCustomerOnly) {
    const has = await hasPreviousCompletedOrder(input.userId, input.guestEmail);
    if (has) {
      return { ok: false, errorCode: "FIRST_TIME_ONLY", errorMessage: "This promo code is for first-time customers only." };
    }
  }

  // Discount computation with launch promo stacking
  const launchActive = launchPromoActive();
  let launchPromoCents = 0;
  let codeDiscountCents = 0;
  let stackingNotice: string | undefined;
  const previewLineItems: any[] = [];

  if (launchActive && input.orderType === "one_time") {
    launchPromoCents = Math.floor((baseSubtotal * LAUNCH_PROMO_PERCENT) / 100);
  }

  if (launchPromoCents > 0 && !row.stackableWithLaunchPromo) {
    // Apply whichever is greater
    const codeOnBase = computeDiscount(row, baseSubtotal);
    if (codeOnBase > launchPromoCents) {
      codeDiscountCents = codeOnBase;
      launchPromoCents = 0;
      stackingNotice = "This code cannot stack with the launch promo. The code discount was applied because it was greater.";
    } else {
      codeDiscountCents = 0;
      stackingNotice = "This code cannot stack with the launch promo. The launch promo was kept because it was greater.";
    }
  } else if (launchPromoCents > 0 && row.stackableWithLaunchPromo) {
    const basis = row.appliesToBasePrice ? baseSubtotal : (baseSubtotal - launchPromoCents);
    codeDiscountCents = Math.min(basis, computeDiscount(row, basis));
  } else {
    codeDiscountCents = computeDiscount(row, baseSubtotal);
  }

  if (launchPromoCents > 0) {
    previewLineItems.push({ label: "Launch Promo (50% off)", amountCents: -launchPromoCents });
  }
  if (codeDiscountCents > 0) {
    previewLineItems.push({ label: `Promo: ${row.code} — ${codeLabel(row)}`, amountCents: -codeDiscountCents });
  }

  const finalTotal = Math.max(0, baseSubtotal - launchPromoCents - codeDiscountCents);

  return { ok: true, row, baseSubtotal, launchPromoCents, codeDiscountCents, finalTotal, previewLineItems, stackingNotice };
}

function sanitizeItems(raw: any): OrderItemInput[] | null {
  if (!Array.isArray(raw)) return null;
  const out: OrderItemInput[] = [];
  for (const it of raw) {
    if (!it || typeof it !== "object") return null;
    const productId = it.productId;
    const quantity = Number(it.quantity);
    const unitPriceCents = Number(it.unitPriceCents);
    if (!productId || !Number.isFinite(quantity) || quantity < 1) return null;
    if (!Number.isFinite(unitPriceCents) || unitPriceCents < 0) return null;
    out.push({ productId, quantity: Math.floor(quantity), unitPriceCents: Math.floor(unitPriceCents) });
  }
  return out;
}

router.post("/validate", validateLimiter, async (req: Request, res: Response) => {
  try {
    const rawCode = (req.body?.code || "").toString().trim();
    if (rawCode.length < 6) {
      res.json({ valid: false, errorCode: "INVALID_INPUT", errorMessage: "Please enter a valid promo code." });
      return;
    }

    const items = sanitizeItems(req.body?.orderItems);
    if (!items || items.length === 0) {
      res.status(400).json({ valid: false, errorCode: "INVALID_INPUT", errorMessage: "Invalid order items." });
      return;
    }

    const orderType = req.body?.orderType === "subscription" ? "subscription" : "one_time";
    const userId = typeof req.body?.userId === "string" ? req.body.userId : undefined;
    const guestEmail = typeof req.body?.guestEmail === "string" ? req.body.guestEmail : undefined;

    const result = await runValidation({ code: rawCode, orderItems: items, orderType, userId, guestEmail });
    if (!result.ok) {
      res.json({ valid: false, errorCode: result.errorCode, errorMessage: result.errorMessage });
      return;
    }

    res.json({
      valid: true,
      discountType: result.row.type,
      discountValue: result.row.type === "fixed_amount" ? result.row.amountOffCents : result.row.percentOff,
      discountAmountCents: result.codeDiscountCents,
      launchPromoDiscountCents: result.launchPromoCents,
      appliesToItems: matchingProductIds(result.row, items),
      stackable: result.row.stackableWithLaunchPromo,
      finalOrderTotalCents: result.finalTotal,
      previewLineItems: result.previewLineItems,
      codeDescription: codeLabel(result.row),
      stackingNotice: result.stackingNotice,
      code: result.row.code,
    });
  } catch (err) {
    console.error("Promo validate error:", err);
    res.status(500).json({ valid: false, errorCode: "SERVER_ERROR", errorMessage: "Unable to validate code at this time." });
  }
});

export interface RedemptionInput {
  rawCode: string;
  orderId: number;
  orderItems: OrderItemInput[];
  orderType: "one_time" | "subscription";
  userId?: string;
  guestEmail?: string;
}

export async function runRedemption(input: RedemptionInput): Promise<
  | { ok: true; discountAmountCents: number; launchPromoDiscountCents: number; finalOrderTotalCents: number; redemptionId: number; promoCodeRow: typeof qbPromoCodes.$inferSelect }
  | { error: { code: string; message: string } }
> {
    const { rawCode, orderId, orderItems: items, orderType, userId, guestEmail } = input;

    const redemption = await db.transaction(async (tx) => {
      const [locked] = await tx.execute<any>(
        sql`SELECT * FROM qb_promo_codes WHERE LOWER(code) = LOWER(${rawCode}) FOR UPDATE`,
      ).then((r: any) => (r.rows ?? r) as any[]);

      if (!locked) {
        return { error: { code: "NOT_FOUND", message: "This promo code is invalid or has expired." } };
      }

      // Re-run validation using locked row values
      const row = {
        id: locked.id,
        code: locked.code,
        isActive: locked.is_active,
        type: locked.type,
        percentOff: locked.percent_off,
        amountOffCents: locked.amount_off_cents,
        subscriptionDurationMonths: locked.subscription_duration_months,
        maxUses: locked.max_uses,
        maxUsesPerCustomer: locked.max_uses_per_customer,
        redemptionCount: locked.redemption_count,
        expiresAt: locked.expires_at ? new Date(locked.expires_at) : null,
        productIds: locked.product_ids,
        categoryIds: locked.category_ids,
        minOrderAmountCents: locked.min_order_amount_cents,
        firstTimeCustomerOnly: locked.first_time_customer_only,
        stackableWithLaunchPromo: locked.stackable_with_launch_promo,
        restrictedToEmail: locked.restricted_to_email,
        appliesToBasePrice: locked.applies_to_base_price,
        ownerUserId: locked.owner_user_id,
        stripeCouponId: locked.stripe_coupon_id,
        stripePromotionCodeId: locked.stripe_promotion_code_id,
        description: locked.description,
        createdAt: new Date(locked.created_at),
        updatedAt: new Date(locked.updated_at),
      } as typeof qbPromoCodes.$inferSelect;

      if (!row.isActive) {
        return { error: { code: "NOT_FOUND", message: "This promo code is invalid or has expired." } };
      }
      if (row.expiresAt && row.expiresAt.getTime() < Date.now()) {
        return { error: { code: "EXPIRED", message: "This promo code has expired." } };
      }
      if (row.maxUses != null && row.redemptionCount >= row.maxUses) {
        return { error: { code: "RACE_EXHAUSTED", message: "This promo code was just used by another customer and has reached its limit. Please complete your order at the standard price." } };
      }

      // Per-customer usage check (using tx)
      if (row.maxUsesPerCustomer != null && (userId || guestEmail)) {
        const conds: any[] = [];
        if (userId) conds.push(eq(qbPromoCodeRedemptions.userId, userId));
        if (guestEmail) conds.push(eq(qbPromoCodeRedemptions.guestEmail, guestEmail.toLowerCase()));
        const [r] = await tx
          .select({ c: count() })
          .from(qbPromoCodeRedemptions)
          .where(and(eq(qbPromoCodeRedemptions.promoCodeId, row.id), conds.length > 1 ? or(...conds) : conds[0]));
        if (Number(r?.c || 0) >= row.maxUsesPerCustomer) {
          return { error: { code: "ALREADY_USED_MAX_TIMES", message: "You have already used this code the maximum number of times." } };
        }
      }

      // Email restriction (using tx)
      if (row.restrictedToEmail) {
        const callerEmail = (guestEmail || "").toLowerCase();
        let authEmail = "";
        if (userId) {
          const [u] = await tx.select().from(qbUsers).where(eq(qbUsers.id, userId)).limit(1);
          authEmail = (u?.email || "").toLowerCase();
        }
        if (row.restrictedToEmail.toLowerCase() !== callerEmail && row.restrictedToEmail.toLowerCase() !== authEmail) {
          return { error: { code: "EMAIL_RESTRICTED", message: "This promo code is not valid for your account." } };
        }
      }

      // Product match (pure function)
      if (!productMatches(row, items)) {
        return { error: { code: "PRODUCT_MISMATCH", message: "This code is not valid for the selected product(s)." } };
      }

      // Min order amount (pure function)
      const baseSubtotal = computeBaseSubtotal(items);
      if (row.minOrderAmountCents != null && baseSubtotal < row.minOrderAmountCents) {
        return {
          error: {
            code: "MINIMUM_NOT_MET",
            message: `This code requires a minimum order of ${formatCad(row.minOrderAmountCents)} CAD. Your current subtotal is ${formatCad(baseSubtotal)}.`,
          },
        };
      }

      // First-time customer check (using tx)
      if (row.firstTimeCustomerOnly && (userId || guestEmail)) {
        const conds2: any[] = [];
        if (userId) conds2.push(eq(qbOrders.userId, userId));
        if (guestEmail) conds2.push(eq(qbOrders.customerEmail, guestEmail));
        const [r2] = await tx
          .select({ c: count() })
          .from(qbOrders)
          .where(and(
            conds2.length > 1 ? or(...conds2) : conds2[0],
            or(eq(qbOrders.status, "paid"), eq(qbOrders.status, "processing"), eq(qbOrders.status, "completed"))!,
          ));
        if (Number(r2?.c || 0) > 0) {
          return { error: { code: "FIRST_TIME_ONLY", message: "This promo code is for first-time customers only." } };
        }
      }

      // Compute discounts (pure functions)
      const launchActive = launchPromoActive();
      let launchPromoCents = 0;
      let codeDiscountCents = 0;
      if (launchActive && orderType === "one_time") {
        launchPromoCents = Math.floor((baseSubtotal * LAUNCH_PROMO_PERCENT) / 100);
      }
      if (launchPromoCents > 0 && !row.stackableWithLaunchPromo) {
        const codeOnBase = computeDiscount(row, baseSubtotal);
        if (codeOnBase > launchPromoCents) {
          codeDiscountCents = codeOnBase;
          launchPromoCents = 0;
        } else {
          codeDiscountCents = 0;
        }
      } else if (launchPromoCents > 0 && row.stackableWithLaunchPromo) {
        const basis = row.appliesToBasePrice ? baseSubtotal : (baseSubtotal - launchPromoCents);
        codeDiscountCents = Math.min(basis, computeDiscount(row, basis));
      } else {
        codeDiscountCents = computeDiscount(row, baseSubtotal);
      }
      const finalTotal = Math.max(0, baseSubtotal - launchPromoCents - codeDiscountCents);

      // Increment redemption count
      await tx.execute(
        sql`UPDATE qb_promo_codes SET redemption_count = redemption_count + 1, updated_at = NOW() WHERE id = ${row.id}`,
      );

      // Create redemption record
      const [redRow] = await tx
        .insert(qbPromoCodeRedemptions)
        .values({
          promoCodeId: row.id,
          userId: userId || null,
          guestEmail: guestEmail ? guestEmail.toLowerCase() : null,
          orderId,
          discountAmountCents: codeDiscountCents,
          orderTotalBeforeCents: baseSubtotal,
          orderTotalAfterCents: finalTotal,
          ownerUserId: row.ownerUserId || null,
        })
        .returning();

      // Update the order record
      await tx
        .update(qbOrders)
        .set({
          promoCodeId: row.id,
          discountAmountAppliedCents: codeDiscountCents + launchPromoCents,
          subtotalBeforeDiscountCents: baseSubtotal,
          paymentStatus: finalTotal === 0 ? "free_promo" : null,
          totalCad: finalTotal,
          updatedAt: new Date(),
        })
        .where(eq(qbOrders.id, orderId));

      // Referral credit
      if (row.ownerUserId) {
        await tx.insert(qbReferralCredits).values({
          beneficiaryUserId: row.ownerUserId,
          amountCents: REFERRAL_CREDIT_CENTS,
          source: "promo_code_redemption",
          promoCodeRedemptionId: redRow.id,
          orderId,
          status: "pending",
        });
      }

      return {
        ok: true as const,
        discountAmountCents: codeDiscountCents,
        launchPromoDiscountCents: launchPromoCents,
        finalOrderTotalCents: finalTotal,
        redemptionId: redRow.id,
        promoCodeRow: row,
      };
    });

    if ("error" in redemption && redemption.error) {
      return { error: redemption.error };
    }

    const promoRow = (redemption as any).promoCodeRow as typeof qbPromoCodes.$inferSelect | undefined;
    if (promoRow?.ownerUserId) {
      try {
        const [totals] = await db
          .select({ sum: sql<number>`COALESCE(SUM(${qbReferralCredits.amountCents}), 0)::int` })
          .from(qbReferralCredits)
          .where(eq(qbReferralCredits.beneficiaryUserId, promoRow.ownerUserId));
        const totalCents = totals?.sum || 0;

        let ownerEmail: string | null = null;
        let ownerName: string = "there";
        const [ownerUserRow] = await db.select().from(qbUsers).where(eq(qbUsers.id, promoRow.ownerUserId)).limit(1);
        if (ownerUserRow) ownerName = ownerUserRow.name || "there";
        if (supabaseAdmin) {
          const { data } = await supabaseAdmin.auth.admin.getUserById(promoRow.ownerUserId);
          ownerEmail = data?.user?.email || null;
        }

        if (ownerEmail) {
          const origin = process.env.PUBLIC_APP_URL || "https://nexfortis.com";
          const portalUrl = `${origin}/qb-portal`;
          const unsubUrl = `${origin}/qb-portal/unsubscribe?email=${encodeURIComponent(ownerEmail)}`;
          const tpl = referralCreditEarnedEmail(
            ownerName, REFERRAL_CREDIT_CENTS, totalCents, portalUrl, unsubUrl,
          );
          await sendEmail({ to: ownerEmail, subject: tpl.subject, html: tpl.html });
        }
      } catch (emailErr) {
        console.error("[Promo/Redeem] Referral email failed:", emailErr);
      }
    }

    return redemption as any;
}

router.post("/redeem", requireAuth, async (req: Request, res: Response) => {
  try {
    const rawCode = (req.body?.code || "").toString().trim();
    const orderId = Number(req.body?.orderId);
    const items = sanitizeItems(req.body?.orderItems);
    const orderType = req.body?.orderType === "subscription" ? "subscription" : "one_time";
    const guestEmail = typeof req.body?.guestEmail === "string" ? req.body.guestEmail : undefined;

    if (!rawCode || rawCode.length < 6 || !Number.isFinite(orderId) || orderId <= 0 || !items) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const userId = (req as any).userId as string | undefined;

    // IDOR: verify the order belongs to the caller
    const [orderRow] = await db.select().from(qbOrders).where(eq(qbOrders.id, orderId)).limit(1);
    if (!orderRow) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    if (orderRow.userId && orderRow.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const result = await runRedemption({ rawCode, orderId, orderItems: items, orderType, userId, guestEmail });
    if ("error" in result) {
      res.status(409).json({ error: result.error.code, message: result.error.message });
      return;
    }

    res.json({
      ok: true,
      discountAmountCents: result.discountAmountCents,
      launchPromoDiscountCents: result.launchPromoDiscountCents,
      finalOrderTotalCents: result.finalOrderTotalCents,
    });
  } catch (err) {
    console.error("Promo redeem error:", err);
    res.status(500).json({ error: "Failed to redeem promo code" });
  }
});

router.get("/referral-stats", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string;

    // Only return if user has active premium subscription
    const [sub] = await db
      .select()
      .from(qbSubscriptions)
      .where(and(eq(qbSubscriptions.userId, userId), eq(qbSubscriptions.status, "active")))
      .limit(1);

    if (!sub || sub.tier !== "premium") {
      res.json({ eligible: false, code: null, totalCreditsCents: 0, redemptions: [] });
      return;
    }

    const [referralCode] = await db
      .select()
      .from(qbPromoCodes)
      .where(and(eq(qbPromoCodes.ownerUserId, userId), eq(qbPromoCodes.isActive, true)))
      .limit(1);

    const credits = await db
      .select()
      .from(qbReferralCredits)
      .where(eq(qbReferralCredits.beneficiaryUserId, userId));

    const totalCreditsCents = credits.reduce((sum, c) => sum + c.amountCents, 0);

    const pendingCents = credits.filter((c) => c.status === "pending").reduce((s, c) => s + c.amountCents, 0);
    const appliedCents = credits.filter((c) => c.status === "applied").reduce((s, c) => s + c.amountCents, 0);

    res.json({
      eligible: true,
      code: referralCode ? referralCode.code : null,
      stats: {
        code: referralCode ? referralCode.code : null,
        totalRedemptions: credits.length,
        totalCreditsEarnedCents: totalCreditsCents,
        pendingCreditsCents: pendingCents,
        appliedCreditsCents: appliedCents,
        redemptions: credits.map((c) => ({
          orderId: c.orderId ?? null,
          subscriptionId: null,
          redeemedAt: (c.createdAt as Date).toISOString(),
          creditAmountCents: c.amountCents,
          status: c.status,
        })),
      },
    });
  } catch (err) {
    console.error("Referral stats error:", err);
    res.status(500).json({ error: "Failed to load referral stats" });
  }
});

export default router;
