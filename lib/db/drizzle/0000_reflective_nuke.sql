-- Migration: Supabase Auth cutover (Prompt 03)
-- Strategy: Destructive drop-and-recreate. This migration drops all QB tables
-- and recreates them with UUID PKs/FKs for Supabase Auth integration.
-- WARNING: This migration destroys all existing QB data. Only safe for pre-production.
-- ============================================================================

-- 1. Drop old tables (reverse FK order)
DROP TABLE IF EXISTS "qb_password_resets" CASCADE;
DROP TABLE IF EXISTS "qb_order_files" CASCADE;
DROP TABLE IF EXISTS "qb_support_tickets" CASCADE;
DROP TABLE IF EXISTS "qb_orders" CASCADE;
DROP TABLE IF EXISTS "qb_waitlist_signups" CASCADE;
DROP TABLE IF EXISTS "qb_users" CASCADE;

--> statement-breakpoint

-- 2. Recreate qb_users with UUID PK (linked to Supabase auth.users), no password_hash
CREATE TABLE "qb_users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"phone" text,
	"role" text DEFAULT 'customer' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "qb_users_email_unique" UNIQUE("email"),
	CONSTRAINT "qb_users_role_check" CHECK ("qb_users"."role" IN ('customer', 'operator'))
);

--> statement-breakpoint

-- 3. Recreate qb_orders with UUID user_id FK
CREATE TABLE "qb_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"service_id" integer NOT NULL,
	"service_name" text NOT NULL,
	"addons" text,
	"total_cad" integer NOT NULL,
	"status" text DEFAULT 'submitted' NOT NULL,
	"qb_version" text,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" text,
	"stripe_session_id" text,
	"upload_token" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

--> statement-breakpoint

-- 4. Recreate qb_order_files with expired/deleted_at columns
CREATE TABLE "qb_order_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"file_type" text NOT NULL,
	"file_name" text NOT NULL,
	"storage_path" text,
	"file_size_bytes" integer,
	"expired" boolean DEFAULT false,
	"deleted_at" timestamp with time zone,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);

--> statement-breakpoint

-- 5. Recreate qb_support_tickets with UUID user_id FK
CREATE TABLE "qb_support_tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

--> statement-breakpoint

-- 6. Recreate qb_waitlist_signups (unchanged)
CREATE TABLE "qb_waitlist_signups" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"product_id" integer NOT NULL,
	"product_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_email_product_unique" UNIQUE("email","product_id")
);

--> statement-breakpoint

-- 7. Add foreign key constraints
ALTER TABLE "qb_order_files" ADD CONSTRAINT "qb_order_files_order_id_qb_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."qb_orders"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "qb_orders" ADD CONSTRAINT "qb_orders_user_id_qb_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."qb_users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "qb_support_tickets" ADD CONSTRAINT "qb_support_tickets_user_id_qb_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."qb_users"("id") ON DELETE no action ON UPDATE no action;

-- NOTE: The FK from qb_users.id -> auth.users(id) is in supabase-rls-setup.sql
-- because it references Supabase's auth schema which Drizzle cannot manage.
