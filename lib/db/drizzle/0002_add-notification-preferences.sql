CREATE TABLE "qb_notification_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"ticket_id" integer,
	"user_id" uuid,
	"payload" jsonb,
	"sent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qb_notification_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"ticket_created" boolean DEFAULT true NOT NULL,
	"operator_replied" boolean DEFAULT true NOT NULL,
	"ticket_resolved" boolean DEFAULT true NOT NULL,
	"unsubscribe_token" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "qb_notification_preferences_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "qb_notification_preferences_unsubscribe_token_unique" UNIQUE("unsubscribe_token")
);
--> statement-breakpoint
CREATE TABLE "qb_ticket_replies" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticket_id" integer NOT NULL,
	"sender_id" uuid NOT NULL,
	"sender_role" text NOT NULL,
	"message" text NOT NULL,
	"attachment_path" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "qb_ticket_replies_sender_role_check" CHECK ("qb_ticket_replies"."sender_role" IN ('customer', 'operator'))
);
--> statement-breakpoint
ALTER TABLE "qb_notification_events" ADD CONSTRAINT "qb_notification_events_ticket_id_qb_support_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."qb_support_tickets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qb_notification_preferences" ADD CONSTRAINT "qb_notification_preferences_user_id_qb_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."qb_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qb_ticket_replies" ADD CONSTRAINT "qb_ticket_replies_ticket_id_qb_support_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."qb_support_tickets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qb_ticket_replies" ADD CONSTRAINT "qb_ticket_replies_sender_id_qb_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."qb_users"("id") ON DELETE no action ON UPDATE no action;