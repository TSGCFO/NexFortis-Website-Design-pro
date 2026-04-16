CREATE TABLE IF NOT EXISTS "qb_subscriptions" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL REFERENCES "qb_users"("id"),
  "tier" text NOT NULL,
  "status" text NOT NULL DEFAULT 'active',
  "stripe_subscription_id" text UNIQUE,
  "stripe_price_id" text,
  "current_period_start" timestamp with time zone,
  "current_period_end" timestamp with time zone,
  "cancel_at_period_end" boolean DEFAULT false,
  "pending_downgrade_tier" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "qb_subscriptions_tier_check" CHECK ("tier" IN ('essentials', 'professional', 'premium')),
  CONSTRAINT "qb_subscriptions_status_check" CHECK ("status" IN ('active', 'past_due', 'canceled', 'incomplete'))
);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "qb_ticket_usage" (
  "id" serial PRIMARY KEY,
  "subscription_id" integer NOT NULL REFERENCES "qb_subscriptions"("id"),
  "period_start" timestamp with time zone NOT NULL,
  "period_end" timestamp with time zone NOT NULL,
  "tickets_used" integer NOT NULL DEFAULT 0,
  "ticket_limit" integer NOT NULL,
  CONSTRAINT "ticket_usage_sub_period_unique" UNIQUE ("subscription_id", "period_start")
);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "qb_referrals" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL REFERENCES "qb_users"("id"),
  "subscription_id" integer NOT NULL REFERENCES "qb_subscriptions"("id"),
  "code" text NOT NULL UNIQUE,
  "total_earnings" integer NOT NULL DEFAULT 0,
  "created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "qb_referral_events" (
  "id" serial PRIMARY KEY,
  "referral_id" integer NOT NULL REFERENCES "qb_referrals"("id"),
  "order_id" integer REFERENCES "qb_orders"("id"),
  "amount_cad" integer NOT NULL DEFAULT 2500,
  "created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "qb_notification_preferences" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL UNIQUE REFERENCES "qb_users"("id"),
  "ticket_created" boolean NOT NULL DEFAULT true,
  "operator_replied" boolean NOT NULL DEFAULT true,
  "ticket_resolved" boolean NOT NULL DEFAULT true,
  "unsubscribe_token" text NOT NULL UNIQUE,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
