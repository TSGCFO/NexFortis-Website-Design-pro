-- Migration: Add subscription system tables (Task #39)
-- Adds: qb_subscriptions, qb_ticket_usage, qb_referrals, qb_referral_events
-- Extends: qb_users (stripe_customer_id), qb_support_tickets (subscription-aware columns)
-- ============================================================================

-- 1. Add stripe_customer_id to qb_users
ALTER TABLE "qb_users" ADD COLUMN IF NOT EXISTS "stripe_customer_id" text;

--> statement-breakpoint

-- 2. Add subscription-aware columns to qb_support_tickets
ALTER TABLE "qb_support_tickets" ADD COLUMN IF NOT EXISTS "subscription_id" integer;
ALTER TABLE "qb_support_tickets" ADD COLUMN IF NOT EXISTS "tier_at_submission" text;
ALTER TABLE "qb_support_tickets" ADD COLUMN IF NOT EXISTS "is_critical" boolean DEFAULT false;
ALTER TABLE "qb_support_tickets" ADD COLUMN IF NOT EXISTS "is_after_hours" boolean DEFAULT false;
ALTER TABLE "qb_support_tickets" ADD COLUMN IF NOT EXISTS "sla_deadline" timestamp with time zone;
ALTER TABLE "qb_support_tickets" ADD COLUMN IF NOT EXISTS "first_response_at" timestamp with time zone;
ALTER TABLE "qb_support_tickets" ADD COLUMN IF NOT EXISTS "operator_reply" text;
ALTER TABLE "qb_support_tickets" ADD COLUMN IF NOT EXISTS "internal_note" text;
ALTER TABLE "qb_support_tickets" ADD COLUMN IF NOT EXISTS "attachment_path" text;

--> statement-breakpoint

-- 3. Create qb_subscriptions table
CREATE TABLE IF NOT EXISTS "qb_subscriptions" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL,
  "tier" text NOT NULL,
  "status" text DEFAULT 'active' NOT NULL,
  "stripe_subscription_id" text,
  "stripe_price_id" text,
  "current_period_start" timestamp with time zone,
  "current_period_end" timestamp with time zone,
  "cancel_at_period_end" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "qb_subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id"),
  CONSTRAINT "qb_subscriptions_tier_check" CHECK ("qb_subscriptions"."tier" IN ('essentials', 'professional', 'premium')),
  CONSTRAINT "qb_subscriptions_status_check" CHECK ("qb_subscriptions"."status" IN ('active', 'past_due', 'canceled', 'incomplete'))
);

--> statement-breakpoint

-- 4. Create qb_ticket_usage table
CREATE TABLE IF NOT EXISTS "qb_ticket_usage" (
  "id" serial PRIMARY KEY NOT NULL,
  "subscription_id" integer NOT NULL,
  "period_start" timestamp with time zone NOT NULL,
  "period_end" timestamp with time zone NOT NULL,
  "tickets_used" integer DEFAULT 0 NOT NULL,
  "ticket_limit" integer NOT NULL,
  CONSTRAINT "ticket_usage_sub_period_unique" UNIQUE("subscription_id", "period_start")
);

--> statement-breakpoint

-- 5. Create qb_referrals table
CREATE TABLE IF NOT EXISTS "qb_referrals" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL,
  "subscription_id" integer NOT NULL,
  "code" text NOT NULL,
  "total_earnings" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "qb_referrals_code_unique" UNIQUE("code")
);

--> statement-breakpoint

-- 6. Create qb_referral_events table
CREATE TABLE IF NOT EXISTS "qb_referral_events" (
  "id" serial PRIMARY KEY NOT NULL,
  "referral_id" integer NOT NULL,
  "order_id" integer,
  "amount_cad" integer DEFAULT 2500 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

--> statement-breakpoint

-- 7. Add foreign key constraints for new tables
ALTER TABLE "qb_subscriptions" ADD CONSTRAINT "qb_subscriptions_user_id_qb_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."qb_users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "qb_ticket_usage" ADD CONSTRAINT "qb_ticket_usage_subscription_id_qb_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."qb_subscriptions"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "qb_referrals" ADD CONSTRAINT "qb_referrals_user_id_qb_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."qb_users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "qb_referrals" ADD CONSTRAINT "qb_referrals_subscription_id_qb_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."qb_subscriptions"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "qb_referral_events" ADD CONSTRAINT "qb_referral_events_referral_id_qb_referrals_id_fk" FOREIGN KEY ("referral_id") REFERENCES "public"."qb_referrals"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "qb_referral_events" ADD CONSTRAINT "qb_referral_events_order_id_qb_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."qb_orders"("id") ON DELETE no action ON UPDATE no action;
