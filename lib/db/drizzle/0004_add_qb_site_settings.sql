CREATE TABLE IF NOT EXISTS "qb_site_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "qb_site_settings" ADD CONSTRAINT "qb_site_settings_updated_by_qb_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."qb_users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
INSERT INTO "qb_site_settings" ("key", "value") VALUES ('launch_promo_active', 'true') ON CONFLICT ("key") DO NOTHING;
