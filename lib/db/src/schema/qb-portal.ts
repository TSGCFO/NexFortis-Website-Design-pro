import { pgTable, serial, text, integer, boolean, timestamp, uuid, unique, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const qbUsers = pgTable("qb_users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default(""),
  phone: text("phone"),
  role: text("role").notNull().default("customer"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  check("qb_users_role_check", sql`${table.role} IN ('customer', 'operator')`),
]);

export const qbOrders = pgTable("qb_orders", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => qbUsers.id),
  serviceId: integer("service_id").notNull(),
  serviceName: text("service_name").notNull(),
  addons: text("addons"),
  totalCad: integer("total_cad").notNull(),
  status: text("status").notNull().default("submitted"),
  qbVersion: text("qb_version"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  stripeSessionId: text("stripe_session_id"),
  uploadToken: text("upload_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const qbOrderFiles = pgTable("qb_order_files", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => qbOrders.id).notNull(),
  fileType: text("file_type").notNull(),
  fileName: text("file_name").notNull(),
  storagePath: text("storage_path"),
  fileSizeBytes: integer("file_size_bytes"),
  expired: boolean("expired").default(false),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const qbWaitlistSignups = pgTable("qb_waitlist_signups", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  unique("waitlist_email_product_unique").on(table.email, table.productId),
]);

export const qbSupportTickets = pgTable("qb_support_tickets", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => qbUsers.id),
  subscriptionId: integer("subscription_id"),
  tierAtSubmission: text("tier_at_submission"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("open"),
  isCritical: boolean("is_critical").default(false),
  isAfterHours: boolean("is_after_hours").default(false),
  slaDeadline: timestamp("sla_deadline", { withTimezone: true }),
  firstResponseAt: timestamp("first_response_at", { withTimezone: true }),
  operatorReply: text("operator_reply"),
  internalNote: text("internal_note"),
  attachmentPath: text("attachment_path"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const qbSubscriptions = pgTable("qb_subscriptions", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => qbUsers.id).notNull(),
  tier: text("tier").notNull(),
  status: text("status").notNull().default("active"),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripePriceId: text("stripe_price_id"),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  check("qb_subscriptions_tier_check", sql`${table.tier} IN ('essentials', 'professional', 'premium')`),
  check("qb_subscriptions_status_check", sql`${table.status} IN ('active', 'past_due', 'canceled', 'incomplete')`),
]);

export const qbTicketUsage = pgTable("qb_ticket_usage", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").references(() => qbSubscriptions.id).notNull(),
  periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
  periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
  ticketsUsed: integer("tickets_used").notNull().default(0),
  ticketLimit: integer("ticket_limit").notNull(),
}, (table) => [
  unique("ticket_usage_sub_period_unique").on(table.subscriptionId, table.periodStart),
]);

export const qbReferrals = pgTable("qb_referrals", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => qbUsers.id).notNull(),
  subscriptionId: integer("subscription_id").references(() => qbSubscriptions.id).notNull(),
  code: text("code").notNull().unique(),
  totalEarnings: integer("total_earnings").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const qbReferralEvents = pgTable("qb_referral_events", {
  id: serial("id").primaryKey(),
  referralId: integer("referral_id").references(() => qbReferrals.id).notNull(),
  orderId: integer("order_id").references(() => qbOrders.id),
  amountCad: integer("amount_cad").notNull().default(2500),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQbUserSchema = createInsertSchema(qbUsers);
export const insertQbOrderSchema = createInsertSchema(qbOrders);
export const insertQbWaitlistSchema = createInsertSchema(qbWaitlistSignups);
export const insertQbSupportTicketSchema = createInsertSchema(qbSupportTickets);
export const insertQbSubscriptionSchema = createInsertSchema(qbSubscriptions);
export const insertQbTicketUsageSchema = createInsertSchema(qbTicketUsage);
export const insertQbReferralSchema = createInsertSchema(qbReferrals);
export const insertQbReferralEventSchema = createInsertSchema(qbReferralEvents);
