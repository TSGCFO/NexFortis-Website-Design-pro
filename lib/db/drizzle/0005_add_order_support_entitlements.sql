CREATE TABLE "qb_order_support_entitlements" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"user_id" uuid NOT NULL,
	"tickets_allowed" integer DEFAULT 2 NOT NULL,
	"tickets_used" integer DEFAULT 0 NOT NULL,
	"sla_minutes" integer DEFAULT 120 NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"is_upgraded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "qb_order_support_entitlements_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
ALTER TABLE "qb_support_tickets" ADD COLUMN "entitlement_id" integer;--> statement-breakpoint
ALTER TABLE "qb_order_support_entitlements" ADD CONSTRAINT "qb_order_support_entitlements_order_id_qb_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."qb_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qb_order_support_entitlements" ADD CONSTRAINT "qb_order_support_entitlements_user_id_qb_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."qb_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qb_support_tickets" ADD CONSTRAINT "qb_support_tickets_entitlement_id_qb_order_support_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "public"."qb_order_support_entitlements"("id") ON DELETE no action ON UPDATE no action;