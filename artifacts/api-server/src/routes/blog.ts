import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { blogPostsTable, insertBlogPostSchema } from "@workspace/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { requireBlogAdmin } from "../middleware/require-blog-admin";

// seoTitle and metaDescription were added in PR #51 to separate the SERP
// title/description from the visible headline/excerpt. Admins can update
// them through the blog admin UI; omitting them keeps the fallback behavior
// (truncate title/excerpt). Any field NOT in this list is silently dropped.
const ALLOWED_UPDATE_FIELDS = [
  "title",
  "slug",
  "excerpt",
  "content",
  "category",
  "coverImage",
  "seoTitle",
  "metaDescription",
  "published",
] as const;
type AllowedField = typeof ALLOWED_UPDATE_FIELDS[number];

function sanitizeUpdateBody(body: Record<string, unknown>): Partial<Record<AllowedField, unknown>> {
  const sanitized: Record<string, unknown> = {};
  for (const key of ALLOWED_UPDATE_FIELDS) {
    if (key in body) {
      sanitized[key] = body[key];
    }
  }
  return sanitized;
}

const blogRouter = Router();

blogRouter.get("/posts", async (_req: Request, res: Response) => {
  try {
    const posts = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.published, true))
      .orderBy(desc(blogPostsTable.createdAt));
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

blogRouter.get("/posts/all", requireBlogAdmin, async (_req: Request, res: Response) => {
  try {
    const posts = await db
      .select()
      .from(blogPostsTable)
      .orderBy(desc(blogPostsTable.createdAt));
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

blogRouter.get("/posts/:slug", async (req: Request, res: Response) => {
  try {
    const [post] = await db
      .select()
      .from(blogPostsTable)
      .where(
        and(
          eq(blogPostsTable.slug, req.params.slug as string),
          eq(blogPostsTable.published, true)
        )
      );
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

blogRouter.post("/posts", requireBlogAdmin, async (req: Request, res: Response) => {
  try {
    const parsed = insertBlogPostSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
      return;
    }
    const [post] = await db.insert(blogPostsTable).values(parsed.data).returning();
    res.status(201).json(post);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as Record<string, unknown>).code === "23505") {
      res.status(409).json({ error: "A post with this slug already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to create post" });
  }
});

blogRouter.put("/posts/:id", requireBlogAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const sanitized = sanitizeUpdateBody(req.body);
    if (Object.keys(sanitized).length === 0) {
      res.status(400).json({ error: "No valid fields provided" });
      return;
    }

    const [post] = await db
      .update(blogPostsTable)
      .set({ ...(sanitized as Record<string, string | boolean | null>), updatedAt: new Date() })
      .where(eq(blogPostsTable.id, id))
      .returning();
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(post);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as Record<string, unknown>).code === "23505") {
      res.status(409).json({ error: "A post with this slug already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to update post" });
  }
});

blogRouter.delete("/posts/:id", requireBlogAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    
    const [deleted] = await db
      .delete(blogPostsTable)
      .where(eq(blogPostsTable.id, id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default blogRouter;
