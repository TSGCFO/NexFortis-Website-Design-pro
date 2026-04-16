import Stripe from "stripe";
import { getStripeClient } from "./stripe-client";

export interface PromoCodeStripeInput {
  code: string;
  type: "percentage" | "fixed_amount" | "free_service" | "subscription";
  percentOff?: number | null;
  amountOffCents?: number | null;
  subscriptionDurationMonths?: number | null;
  maxUses?: number | null;
  expiresAt?: Date | null;
}

export interface PromoCodeStripeIds {
  stripeCouponId: string | null;
  stripePromotionCodeId: string | null;
}

async function getStripeOrNull(): Promise<Stripe | null> {
  try {
    return await getStripeClient();
  } catch {
    console.warn("[Promo/Stripe] Stripe not configured — skipping Stripe coupon creation");
    return null;
  }
}

export async function createStripeCouponAndPromoCode(
  input: PromoCodeStripeInput,
): Promise<PromoCodeStripeIds> {
  const stripe = await getStripeOrNull();
  if (!stripe) return { stripeCouponId: null, stripePromotionCodeId: null };

  const couponParams: Stripe.CouponCreateParams = {
    metadata: { code: input.code, type: input.type },
  };

  if (input.type === "percentage" || input.type === "free_service") {
    couponParams.percent_off = input.type === "free_service" ? 100 : (input.percentOff ?? 0);
  } else if (input.type === "fixed_amount") {
    couponParams.amount_off = input.amountOffCents ?? 0;
    couponParams.currency = "cad";
  } else if (input.type === "subscription") {
    couponParams.percent_off = input.percentOff ?? 100;
    couponParams.duration = "repeating";
    couponParams.duration_in_months = input.subscriptionDurationMonths ?? 1;
  }

  if (!couponParams.duration) {
    couponParams.duration = "once";
  }
  if (input.maxUses != null) couponParams.max_redemptions = input.maxUses;
  if (input.expiresAt) couponParams.redeem_by = Math.floor(input.expiresAt.getTime() / 1000);

  try {
    const coupon = await stripe.coupons.create(couponParams, {
      idempotencyKey: `promo_coupon_${input.code}`,
    });
    const promo = await stripe.promotionCodes.create(
      { coupon: coupon.id, code: input.code } as any,
      { idempotencyKey: `promo_code_${input.code}` },
    );
    return { stripeCouponId: coupon.id, stripePromotionCodeId: promo.id };
  } catch (err) {
    console.error("[Promo/Stripe] Failed to create Stripe coupon:", err);
    return { stripeCouponId: null, stripePromotionCodeId: null };
  }
}

export async function deactivateStripePromoCode(stripePromotionCodeId: string): Promise<void> {
  const stripe = await getStripeOrNull();
  if (!stripe) return;
  try {
    await stripe.promotionCodes.update(stripePromotionCodeId, { active: false });
  } catch (err) {
    console.error("[Promo/Stripe] Failed to deactivate promo code:", err);
  }
}

/**
 * Reactivate a Stripe promotion code. If the existing promotion code can be
 * re-enabled (Stripe allows toggling `active` back to true), do that. If
 * Stripe rejects the update (e.g. coupon was deleted), create a fresh
 * promotion code on the existing coupon and return its new ID.
 */
export async function reactivateStripePromoCode(
  stripeCouponId: string | null,
  stripePromotionCodeId: string | null,
  code: string,
): Promise<{ stripePromotionCodeId: string | null; replaced: boolean }> {
  const stripe = await getStripeOrNull();
  if (!stripe) return { stripePromotionCodeId, replaced: false };
  if (stripePromotionCodeId) {
    try {
      const updated = await stripe.promotionCodes.update(stripePromotionCodeId, { active: true });
      return { stripePromotionCodeId: updated.id, replaced: false };
    } catch (err) {
      console.warn("[Promo/Stripe] Could not toggle promo code active=true, will recreate:", err);
    }
  }
  if (stripeCouponId) {
    try {
      const promo = await stripe.promotionCodes.create(
        { coupon: stripeCouponId, code } as unknown as Stripe.PromotionCodeCreateParams,
        { idempotencyKey: `promo_code_reactivate_${code}_${Date.now()}` },
      );
      return { stripePromotionCodeId: promo.id, replaced: true };
    } catch (err) {
      console.error("[Promo/Stripe] Failed to recreate promo code on reactivate:", err);
    }
  }
  return { stripePromotionCodeId, replaced: false };
}

export async function applyStripeCouponToPayment(
  stripeCouponId: string,
  paymentIntentId: string,
  idempotencyKey: string,
): Promise<void> {
  const stripe = await getStripeOrNull();
  if (!stripe) return;
  try {
    await stripe.paymentIntents.update(
      paymentIntentId,
      { discounts: [{ coupon: stripeCouponId }] } as any,
      { idempotencyKey },
    );
  } catch (err) {
    console.error("[Promo/Stripe] Failed to apply coupon to payment:", err);
  }
}

export async function applyStripeCouponToSubscription(
  stripeCouponId: string,
  subscriptionId: string,
  idempotencyKey: string,
): Promise<void> {
  const stripe = await getStripeOrNull();
  if (!stripe) return;
  try {
    await stripe.subscriptions.update(
      subscriptionId,
      { discounts: [{ coupon: stripeCouponId }] } as any,
      { idempotencyKey },
    );
  } catch (err) {
    console.error("[Promo/Stripe] Failed to apply coupon to subscription:", err);
  }
}
