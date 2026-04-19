import { pgTable, serial, text, integer, boolean, timestamp, uuid, unique, check, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
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
  promoCodeId: integer("promo_code_id").references(() => qbPromoCodes.id),
  discountAmountAppliedCents: integer("discount_amount_applied_cents").default(0),
  subtotalBeforeDiscountCents: integer("subtotal_before_discount_cents"),
  paymentStatus: text("payment_status"),
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
  // No FK to qb_subscriptions — intentional. Tickets must persist after subscription cancellation.
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
  entitlementId: integer("entitlement_id").references(() => qbOrderSupportEntitlements.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  check("qb_support_tickets_status_check", sql`${table.status} IN ('open', 'in_progress', 'resolved', 'closed')`),
]);

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
  pendingDowngradeTier: text("pending_downgrade_tier"),
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

export const qbOrderSupportEntitlements = pgTable("qb_order_support_entitlements", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => qbOrders.id).notNull().unique(),
  userId: uuid("user_id").references(() => qbUsers.id).notNull(),
  ticketsAllowed: integer("tickets_allowed").notNull().default(2),
  ticketsUsed: integer("tickets_used").notNull().default(0),
  slaMinutes: integer("sla_minutes").notNull().default(120),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  isUpgraded: boolean("is_upgraded").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

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

export const qbTicketReplies = pgTable("qb_ticket_replies", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").references(() => qbSupportTickets.id).notNull(),
  senderId: uuid("sender_id").references(() => qbUsers.id).notNull(),
  senderRole: text("sender_role").notNull(),
  message: text("message").notNull(),
  attachmentPath: text("attachment_path"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  check("qb_ticket_replies_sender_role_check", sql`${table.senderRole} IN ('customer', 'operator')`),
]);

export const qbNotificationEvents = pgTable("qb_notification_events", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  ticketId: integer("ticket_id").references(() => qbSupportTickets.id),
  userId: uuid("user_id"),
  payload: jsonb("payload"),
  sent: boolean("sent").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const qbNotificationPreferences = pgTable("qb_notification_preferences", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => qbUsers.id).notNull().unique(),
  ticketCreated: boolean("ticket_created").default(true).notNull(),
  operatorReplied: boolean("operator_replied").default(true).notNull(),
  ticketResolved: boolean("ticket_resolved").default(true).notNull(),
  unsubscribeToken: text("unsubscribe_token").notNull().unique(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const qbPromoCodes = pgTable("qb_promo_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  type: text("type").notNull(),
  percentOff: integer("percent_off"),
  amountOffCents: integer("amount_off_cents"),
  subscriptionDurationMonths: integer("subscription_duration_months"),
  maxUses: integer("max_uses"),
  maxUsesPerCustomer: integer("max_uses_per_customer"),
  redemptionCount: integer("redemption_count").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  productIds: text("product_ids").array(),
  categoryIds: text("category_ids").array(),
  minOrderAmountCents: integer("min_order_amount_cents"),
  firstTimeCustomerOnly: boolean("first_time_customer_only").notNull().default(false),
  stackableWithLaunchPromo: boolean("stackable_with_launch_promo").notNull().default(true),
  restrictedToEmail: text("restricted_to_email"),
  appliesToBasePrice: boolean("applies_to_base_price").notNull().default(false),
  ownerUserId: uuid("owner_user_id").references(() => qbUsers.id),
  stripeCouponId: text("stripe_coupon_id"),
  stripePromotionCodeId: text("stripe_promotion_code_id"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  check("qb_promo_codes_type_check", sql`${table.type} IN ('percentage', 'fixed_amount', 'free_service', 'subscription')`),
  uniqueIndex("qb_promo_codes_code_lower_idx").on(sql`LOWER(${table.code})`),
]);

export const qbPromoCodeRedemptions = pgTable("qb_promo_code_redemptions", {
  id: serial("id").primaryKey(),
  promoCodeId: integer("promo_code_id").references(() => qbPromoCodes.id).notNull(),
  userId: uuid("user_id").references(() => qbUsers.id),
  guestEmail: text("guest_email"),
  orderId: integer("order_id").references(() => qbOrders.id).notNull(),
  discountAmountCents: integer("discount_amount_cents").notNull(),
  orderTotalBeforeCents: integer("order_total_before_cents").notNull(),
  orderTotalAfterCents: integer("order_total_after_cents").notNull(),
  ownerUserId: uuid("owner_user_id").references(() => qbUsers.id),
  redeemedAt: timestamp("redeemed_at", { withTimezone: true }).defaultNow().notNull(),
});

export const qbReferralCredits = pgTable("qb_referral_credits", {
  id: serial("id").primaryKey(),
  beneficiaryUserId: uuid("beneficiary_user_id").references(() => qbUsers.id).notNull(),
  amountCents: integer("amount_cents").notNull(),
  source: text("source").notNull().default("promo_code_redemption"),
  promoCodeRedemptionId: integer("promo_code_redemption_id").references(() => qbPromoCodeRedemptions.id),
  orderId: integer("order_id").references(() => qbOrders.id),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  check("qb_referral_credits_status_check", sql`${table.status} IN ('pending', 'applied', 'paid_out')`),
]);

export const qbPromoCodeAdminEvents = pgTable("qb_promo_code_admin_events", {
  id: serial("id").primaryKey(),
  adminUserId: uuid("admin_user_id").notNull(),
  action: text("action").notNull(),
  promoCodeId: integer("promo_code_id").references(() => qbPromoCodes.id).notNull(),
  beforeState: jsonb("before_state"),
  afterState: jsonb("after_state").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQbPromoCodeSchema = createInsertSchema(qbPromoCodes);
export const insertQbPromoCodeRedemptionSchema = createInsertSchema(qbPromoCodeRedemptions);
export const insertQbReferralCreditSchema = createInsertSchema(qbReferralCredits);
export const insertQbPromoCodeAdminEventSchema = createInsertSchema(qbPromoCodeAdminEvents);

export const qbSiteSettings = pgTable("qb_site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  updatedBy: uuid("updated_by").references(() => qbUsers.id),
});

export const insertQbSiteSettingSchema = createInsertSchema(qbSiteSettings);

export const operatorUsers = pgTable("operator_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOperatorUserSchema = createInsertSchema(operatorUsers);

export const insertQbUserSchema = createInsertSchema(qbUsers);
export const insertQbOrderSchema = createInsertSchema(qbOrders);
export const insertQbWaitlistSchema = createInsertSchema(qbWaitlistSignups);
export const insertQbSupportTicketSchema = createInsertSchema(qbSupportTickets);
export const insertQbSubscriptionSchema = createInsertSchema(qbSubscriptions);
export const insertQbTicketUsageSchema = createInsertSchema(qbTicketUsage);
export const insertQbReferralSchema = createInsertSchema(qbReferrals);
export const insertQbReferralEventSchema = createInsertSchema(qbReferralEvents);
export const insertQbTicketReplySchema = createInsertSchema(qbTicketReplies);
export const insertQbNotificationEventSchema = createInsertSchema(qbNotificationEvents);
export const insertQbNotificationPreferenceSchema = createInsertSchema(qbNotificationPreferences);
export const insertQbOrderSupportEntitlementSchema = createInsertSchema(qbOrderSupportEntitlements);
