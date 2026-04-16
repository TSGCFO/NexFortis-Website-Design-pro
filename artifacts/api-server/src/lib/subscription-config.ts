export type SubscriptionTier = "essentials" | "professional" | "premium";

export interface TierConfig {
  tier: SubscriptionTier;
  ticketLimit: number;
  slaMinutes: number;
  discountPercent: number;
  basePriceCad: number;
  launchPriceCad: number;
  stripeCouponId: string | null;
}

const TIER_CONFIGS: Record<SubscriptionTier, TierConfig> = {
  essentials: {
    tier: "essentials",
    ticketLimit: 3,
    slaMinutes: 60,
    discountPercent: 0,
    basePriceCad: 4900,
    launchPriceCad: 2500,
    stripeCouponId: null,
  },
  professional: {
    tier: "professional",
    ticketLimit: 8,
    slaMinutes: 60,
    discountPercent: 10,
    basePriceCad: 9900,
    launchPriceCad: 5000,
    stripeCouponId: process.env["STRIPE_COUPON_PRO_10"] || null,
  },
  premium: {
    tier: "premium",
    ticketLimit: -1,
    slaMinutes: 30,
    discountPercent: 20,
    basePriceCad: 14900,
    launchPriceCad: 7500,
    stripeCouponId: process.env["STRIPE_COUPON_PREMIUM_20"] || null,
  },
};

const TIER_ORDER: SubscriptionTier[] = ["essentials", "professional", "premium"];

export function getTierConfig(tier: SubscriptionTier): TierConfig {
  return TIER_CONFIGS[tier];
}

export function isValidTier(tier: string): tier is SubscriptionTier {
  return tier in TIER_CONFIGS;
}

export function getTierIndex(tier: SubscriptionTier): number {
  return TIER_ORDER.indexOf(tier);
}

export function isUpgrade(from: SubscriptionTier, to: SubscriptionTier): boolean {
  return getTierIndex(to) > getTierIndex(from);
}

export function isDowngrade(from: SubscriptionTier, to: SubscriptionTier): boolean {
  return getTierIndex(to) < getTierIndex(from);
}

export function isUnlimitedTickets(tier: SubscriptionTier): boolean {
  return TIER_CONFIGS[tier].ticketLimit === -1;
}

const priceTierMap: Record<string, SubscriptionTier> = {};

function buildPriceTierMap(): void {
  const envMappings: Array<{ env: string; tier: SubscriptionTier }> = [
    { env: "STRIPE_PRICE_ESSENTIALS", tier: "essentials" },
    { env: "STRIPE_PRICE_ESSENTIALS_PROMO", tier: "essentials" },
    { env: "STRIPE_PRICE_PROFESSIONAL", tier: "professional" },
    { env: "STRIPE_PRICE_PROFESSIONAL_PROMO", tier: "professional" },
    { env: "STRIPE_PRICE_PREMIUM", tier: "premium" },
    { env: "STRIPE_PRICE_PREMIUM_PROMO", tier: "premium" },
  ];

  const missing: string[] = [];
  for (const { env, tier } of envMappings) {
    const priceId = process.env[env];
    if (priceId) {
      priceTierMap[priceId] = tier;
    } else {
      missing.push(env);
    }
  }

  if (missing.length > 0) {
    console.warn(
      `[subscription-config] Missing Stripe price env vars: ${missing.join(", ")}. ` +
      "Subscription checkout will return 503 until these are configured.",
    );
  }

  if (!process.env["STRIPE_COUPON_PRO_10"]) {
    console.warn("[subscription-config] STRIPE_COUPON_PRO_10 not set — Professional subscriber discounts disabled.");
  }
  if (!process.env["STRIPE_COUPON_PREMIUM_20"]) {
    console.warn("[subscription-config] STRIPE_COUPON_PREMIUM_20 not set — Premium subscriber discounts disabled.");
  }
}

buildPriceTierMap();

export function tierFromPriceId(priceId: string): SubscriptionTier | null {
  return priceTierMap[priceId] || null;
}

export function getStripePriceIds(tier: SubscriptionTier): { standard: string | null; promo: string | null } {
  const envBase = tier.toUpperCase();
  return {
    standard: process.env[`STRIPE_PRICE_${envBase}`] || null,
    promo: process.env[`STRIPE_PRICE_${envBase}_PROMO`] || null,
  };
}

export function getAllTierConfigs(): TierConfig[] {
  return TIER_ORDER.map(t => TIER_CONFIGS[t]);
}
