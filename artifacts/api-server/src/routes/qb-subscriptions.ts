import { Router, type Request, type Response } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { db } from "@workspace/db";
import {
  qbUsers,
  qbSubscriptions,
  qbTicketUsage,
  qbReferrals,
} from "@workspace/db/schema";
import { eq, and, sql } from "drizzle-orm";
import crypto from "crypto";
import Stripe from "stripe";
import { supabaseAdmin } from "../lib/supabase";
import {
  getTierConfig,
  isValidTier,
  isUpgrade,
  isDowngrade,
  isUnlimitedTickets,
  getStripePriceIds,
  type SubscriptionTier,
} from "../lib/subscription-config";

const router = Router();

const stripe = process.env["STRIPE_SECRET_KEY"]
  ? new Stripe(process.env["STRIPE_SECRET_KEY"])
  : null;

function getSubPeriod(stripeSub: Stripe.Subscription): { start: number; end: number } {
  const item = stripeSub.items.data[0];
  return {
    start: item?.current_period_start ?? 0,
    end: item?.current_period_end ?? 0,
  };
}

const subscriptionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => req.userId || ipKeyGenerator(req),
  message: { error: "Too many requests. Please try again later." },
});


async function getActiveSubscription(userId: string) {
  const [sub] = await db
    .select()
    .from(qbSubscriptions)
    .where(and(eq(qbSubscriptions.userId, userId), eq(qbSubscriptions.status, "active")))
    .limit(1);
  return sub || null;
}

async function getOrCreateTicketUsage(subscriptionId: number, periodStart: Date, periodEnd: Date, ticketLimit: number) {
  const [existing] = await db
    .select()
    .from(qbTicketUsage)
    .where(
      and(
        eq(qbTicketUsage.subscriptionId, subscriptionId),
        eq(qbTicketUsage.periodStart, periodStart),
      ),
    )
    .limit(1);

  if (existing) return existing;

  const [created] = await db
    .insert(qbTicketUsage)
    .values({ subscriptionId, periodStart, periodEnd, ticketLimit, ticketsUsed: 0 })
    .returning();
  return created;
}

router.post("/checkout", subscriptionLimiter, async (req: Request, res: Response) => {
  try {
    if (!stripe) {
      res.status(503).json({ error: "Payment service unavailable" });
      return;
    }

    const userId = req.userId!;
    const { tier, usePromo } = req.body;

    if (!tier || !isValidTier(tier)) {
      res.status(400).json({ error: "Invalid subscription tier" });
      return;
    }

    const existingSub = await getActiveSubscription(userId);
    if (existingSub) {
      res.status(409).json({ error: "You already have an active subscription. Use upgrade instead." });
      return;
    }

    const [user] = await db.select().from(qbUsers).where(eq(qbUsers.id, userId)).limit(1);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { user_id: userId },
      });
      stripeCustomerId = customer.id;
      await db.update(qbUsers).set({ stripeCustomerId }).where(eq(qbUsers.id, userId));
    }

    const priceIds = getStripePriceIds(tier);
    const priceId = usePromo && priceIds.promo ? priceIds.promo : priceIds.standard;

    if (!priceId) {
      res.status(503).json({ error: "Subscription pricing not configured" });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { user_id: userId, tier, type: "subscription" },
      subscription_data: {
        metadata: { user_id: userId, tier },
      },
      success_url: `${req.headers.origin || "http://localhost"}/qb-portal/subscription?success=true`,
      cancel_url: `${req.headers.origin || "http://localhost"}/qb-portal/subscription?canceled=true`,
    });

    res.status(201).json({ checkoutUrl: session.url });
  } catch (err) {
    console.error("Subscription checkout error:", err);
    res.status(500).json({ error: "Failed to create subscription checkout" });
  }
});

router.get("/me", async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const sub = await getActiveSubscription(userId);

    if (!sub) {
      res.json({ subscription: null });
      return;
    }

    const tierConfig = getTierConfig(sub.tier as SubscriptionTier);
    let usage = null;

    if (sub.currentPeriodStart && sub.currentPeriodEnd) {
      usage = await getOrCreateTicketUsage(
        sub.id,
        sub.currentPeriodStart,
        sub.currentPeriodEnd,
        tierConfig.ticketLimit,
      );
    }

    const [referral] = await db
      .select()
      .from(qbReferrals)
      .where(eq(qbReferrals.subscriptionId, sub.id))
      .limit(1);

    res.json({
      subscription: {
        ...sub,
        ticketLimit: tierConfig.ticketLimit,
        ticketsUsed: usage?.ticketsUsed ?? 0,
        ticketsRemaining: isUnlimitedTickets(sub.tier as SubscriptionTier)
          ? -1
          : Math.max(0, tierConfig.ticketLimit - (usage?.ticketsUsed ?? 0)),
        slaMinutes: tierConfig.slaMinutes,
        discountPercent: tierConfig.discountPercent,
      },
      referral: referral ? { code: referral.code, totalEarnings: referral.totalEarnings } : null,
    });
  } catch (err) {
    console.error("Get subscription error:", err);
    res.status(500).json({ error: "Failed to fetch subscription" });
  }
});

router.post("/upgrade", subscriptionLimiter, async (req: Request, res: Response) => {
  try {
    if (!stripe) {
      res.status(503).json({ error: "Payment service unavailable" });
      return;
    }

    const userId = req.userId!;
    const { tier: newTier } = req.body;

    if (!newTier || !isValidTier(newTier)) {
      res.status(400).json({ error: "Invalid subscription tier" });
      return;
    }

    const sub = await getActiveSubscription(userId);
    if (!sub || !sub.stripeSubscriptionId) {
      res.status(404).json({ error: "No active subscription found" });
      return;
    }

    const currentTier = sub.tier as SubscriptionTier;
    if (!isUpgrade(currentTier, newTier)) {
      res.status(400).json({ error: "New tier must be higher than current tier" });
      return;
    }

    const priceIds = getStripePriceIds(newTier);
    const priceId = priceIds.standard || priceIds.promo;
    if (!priceId) {
      res.status(503).json({ error: "Subscription pricing not configured" });
      return;
    }

    const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
    const itemId = stripeSub.items.data[0]?.id;
    if (!itemId) {
      res.status(500).json({ error: "Subscription item not found" });
      return;
    }

    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      items: [{ id: itemId, price: priceId }],
      proration_behavior: "create_prorations",
      metadata: { user_id: userId, tier: newTier },
    });

    await db
      .update(qbSubscriptions)
      .set({ tier: newTier, stripePriceId: priceId, updatedAt: new Date() })
      .where(eq(qbSubscriptions.id, sub.id));

    if (newTier === "premium") {
      const existingRef = await db
        .select()
        .from(qbReferrals)
        .where(eq(qbReferrals.subscriptionId, sub.id))
        .limit(1);
      if (existingRef.length === 0) {
        const code = crypto.randomBytes(4).toString("hex").toUpperCase();
        await db.insert(qbReferrals).values({
          userId,
          subscriptionId: sub.id,
          code,
        });
      }
    }

    res.json({ message: "Subscription upgraded successfully", tier: newTier });
  } catch (err) {
    console.error("Subscription upgrade error:", err);
    res.status(500).json({ error: "Failed to upgrade subscription" });
  }
});

router.post("/downgrade", subscriptionLimiter, async (req: Request, res: Response) => {
  try {
    if (!stripe) {
      res.status(503).json({ error: "Payment service unavailable" });
      return;
    }

    const userId = req.userId!;
    const { tier: newTier } = req.body;

    if (!newTier || !isValidTier(newTier)) {
      res.status(400).json({ error: "Invalid subscription tier" });
      return;
    }

    const sub = await getActiveSubscription(userId);
    if (!sub || !sub.stripeSubscriptionId) {
      res.status(404).json({ error: "No active subscription found" });
      return;
    }

    const currentTier = sub.tier as SubscriptionTier;
    if (!isDowngrade(currentTier, newTier)) {
      res.status(400).json({ error: "New tier must be lower than current tier" });
      return;
    }

    const priceIds = getStripePriceIds(newTier);
    const priceId = priceIds.standard || priceIds.promo;
    if (!priceId) {
      res.status(503).json({ error: "Subscription pricing not configured" });
      return;
    }

    const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
    const period = getSubPeriod(stripeSub);
    const currentPriceId = stripeSub.items.data[0]?.price?.id as string;

    const schedules = await stripe.subscriptionSchedules.list({
      customer: stripeSub.customer as string,
      limit: 1,
    });

    const phases = [
      {
        items: [{ price: currentPriceId, quantity: 1 }],
        start_date: period.start,
        end_date: period.end,
      },
      {
        items: [{ price: priceId, quantity: 1 }],
        start_date: period.end,
      },
    ];

    if (schedules.data.length > 0 && schedules.data[0].status === "active") {
      await stripe.subscriptionSchedules.update(schedules.data[0].id, { phases });
    } else {
      const schedule = await stripe.subscriptionSchedules.create({
        from_subscription: sub.stripeSubscriptionId,
      });
      await stripe.subscriptionSchedules.update(schedule.id, { phases });
    }

    res.json({
      message: "Downgrade scheduled for next billing cycle",
      newTier,
      effectiveDate: new Date(period.end * 1000).toISOString(),
    });
  } catch (err) {
    console.error("Subscription downgrade error:", err);
    res.status(500).json({ error: "Failed to downgrade subscription" });
  }
});

router.post("/cancel", subscriptionLimiter, async (req: Request, res: Response) => {
  try {
    if (!stripe) {
      res.status(503).json({ error: "Payment service unavailable" });
      return;
    }

    const userId = req.userId!;
    const sub = await getActiveSubscription(userId);
    if (!sub || !sub.stripeSubscriptionId) {
      res.status(404).json({ error: "No active subscription found" });
      return;
    }

    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await db
      .update(qbSubscriptions)
      .set({ cancelAtPeriodEnd: true, updatedAt: new Date() })
      .where(eq(qbSubscriptions.id, sub.id));

    res.json({
      message: "Subscription will cancel at end of current period",
      cancelAt: sub.currentPeriodEnd?.toISOString(),
    });
  } catch (err) {
    console.error("Subscription cancel error:", err);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
});

router.post("/reactivate", subscriptionLimiter, async (req: Request, res: Response) => {
  try {
    if (!stripe) {
      res.status(503).json({ error: "Payment service unavailable" });
      return;
    }

    const userId = req.userId!;
    const sub = await getActiveSubscription(userId);
    if (!sub || !sub.stripeSubscriptionId) {
      res.status(404).json({ error: "No active subscription found" });
      return;
    }

    if (!sub.cancelAtPeriodEnd) {
      res.status(400).json({ error: "Subscription is not set to cancel" });
      return;
    }

    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    await db
      .update(qbSubscriptions)
      .set({ cancelAtPeriodEnd: false, updatedAt: new Date() })
      .where(eq(qbSubscriptions.id, sub.id));

    res.json({ message: "Subscription reactivated" });
  } catch (err) {
    console.error("Subscription reactivate error:", err);
    res.status(500).json({ error: "Failed to reactivate subscription" });
  }
});

export default router;
