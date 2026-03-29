import { pgTable, serial, text, integer, boolean, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const qbUsers = pgTable("qb_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const qbOrders = pgTable("qb_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => qbUsers.id),
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
  userId: integer("user_id").references(() => qbUsers.id),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const qbPasswordResets = pgTable("qb_password_resets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => qbUsers.id).notNull(),
  tokenHash: text("token_hash").notNull(),
  used: boolean("used").notNull().default(false),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQbUserSchema = createInsertSchema(qbUsers);
export const insertQbOrderSchema = createInsertSchema(qbOrders);
export const insertQbWaitlistSchema = createInsertSchema(qbWaitlistSignups);
export const insertQbSupportTicketSchema = createInsertSchema(qbSupportTickets);
