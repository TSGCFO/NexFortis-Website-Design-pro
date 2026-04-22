import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  coverImage: text("cover_image"),
  // Optional SEO-specific title (<=51 chars so `${seoTitle} | NexFortis IT
  // Solutions` stays under 77 chars). When NULL the blog-post page falls
  // back to truncating `title` for the <title> tag but keeps `title` as
  // the H1. Added in PR #51 after the audit found 5 blog-post titles
  // exceeded Google's ~70-char display limit.
  seoTitle: text("seo_title"),
  // Optional SEO-specific meta description (<=155 chars). When NULL the
  // blog-post page falls back to `excerpt` truncated on a word boundary.
  // Kept separate from `excerpt` because `excerpt` is visible body copy
  // that’s tuned for reader engagement, not SERP snippet length.
  metaDescription: text("meta_description"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPostsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPostsTable.$inferSelect;
