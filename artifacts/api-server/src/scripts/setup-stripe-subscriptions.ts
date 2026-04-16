import Stripe from "stripe";
import { getStripeClient } from "../lib/stripe-client";

interface TierSetup {
  name: string;
  tier: string;
  basePriceCad: number;
  launchPriceCad: number;
}

const TIERS: TierSetup[] = [
  { name: "QB Expert Support — Essentials", tier: "essentials", basePriceCad: 4900, launchPriceCad: 2500 },
  { name: "QB Expert Support — Professional", tier: "professional", basePriceCad: 9900, launchPriceCad: 5000 },
  { name: "QB Expert Support — Premium", tier: "premium", basePriceCad: 14900, launchPriceCad: 7500 },
];

const COUPONS = [
  { id: "pro_service_10", name: "Pro Subscriber — 10% Off", percentOff: 10 },
  { id: "premium_service_20", name: "Premium Sub — 20% Off", percentOff: 20 },
];

async function main() {
  const stripe = await getStripeClient();
  console.log("Setting up Stripe subscription products...\n");

  const envLines: string[] = [];

  async function findExistingProduct(name: string): Promise<Stripe.Product | null> {
    const products = await stripe.products.list({ limit: 100 });
    return products.data.find(p => p.name === name) || null;
  }

  async function findExistingCoupon(id: string): Promise<Stripe.Coupon | null> {
    try {
      return await stripe.coupons.retrieve(id);
    } catch {
      return null;
    }
  }

  for (const tier of TIERS) {
    let product = await findExistingProduct(tier.name);
    if (!product) {
      product = await stripe.products.create({
        name: tier.name,
        metadata: { tier: tier.tier, type: "subscription" },
      });
      console.log(`Created product: ${tier.name} (${product.id})`);
    } else {
      console.log(`Product exists: ${tier.name} (${product.id})`);
    }

    const existingPrices = await stripe.prices.list({ product: product.id, limit: 10 });

    let standardPrice = existingPrices.data.find(
      p => p.unit_amount === tier.basePriceCad && p.recurring?.interval === "month" && p.active
    );
    if (!standardPrice) {
      standardPrice = await stripe.prices.create({
        product: product.id,
        currency: "cad",
        unit_amount: tier.basePriceCad,
        recurring: { interval: "month" },
        metadata: { tier: tier.tier, type: "standard" },
      });
      console.log(`  Created standard price: $${(tier.basePriceCad / 100).toFixed(2)} CAD/mo (${standardPrice.id})`);
    } else {
      console.log(`  Standard price exists: (${standardPrice.id})`);
    }

    let promoPrice = existingPrices.data.find(
      p => p.unit_amount === tier.launchPriceCad && p.recurring?.interval === "month" && p.active
    );
    if (!promoPrice) {
      promoPrice = await stripe.prices.create({
        product: product.id,
        currency: "cad",
        unit_amount: tier.launchPriceCad,
        recurring: { interval: "month" },
        metadata: { tier: tier.tier, type: "promo" },
      });
      console.log(`  Created promo price: $${(tier.launchPriceCad / 100).toFixed(2)} CAD/mo (${promoPrice.id})`);
    } else {
      console.log(`  Promo price exists: (${promoPrice.id})`);
    }

    const envKey = tier.tier.toUpperCase();
    envLines.push(`STRIPE_PRICE_${envKey}=${standardPrice.id}`);
    envLines.push(`STRIPE_PRICE_${envKey}_PROMO=${promoPrice.id}`);
  }

  console.log("\nSetting up discount coupons...\n");

  for (const coupon of COUPONS) {
    const existing = await findExistingCoupon(coupon.id);
    if (!existing) {
      const created = await stripe.coupons.create({
        id: coupon.id,
        name: coupon.name,
        percent_off: coupon.percentOff,
        duration: "forever",
      });
      console.log(`Created coupon: ${coupon.name} (${created.id})`);
    } else {
      console.log(`Coupon exists: ${coupon.name} (${existing.id})`);
    }
    envLines.push(`STRIPE_COUPON_${coupon.id === "pro_service_10" ? "PRO_10" : "PREMIUM_20"}=${coupon.id}`);
  }

  console.log("\n--- Environment Variables ---\n");
  for (const line of envLines) {
    console.log(line);
  }
  console.log("\nDone! Add these to your Replit Secrets or Render environment variables.");
}

main().catch(err => {
  console.error("Setup failed:", err);
  process.exit(1);
});
