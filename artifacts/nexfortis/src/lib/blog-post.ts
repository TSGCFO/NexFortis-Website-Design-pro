export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  published: boolean;
  createdAt: string;
}

const SNAPSHOT_ID = "nexfortis-blog-post";

// The build stores the same published article used to produce the page HTML.
// Seed the first render from it while checking for updates in the background.
export function readPrerenderedBlogPost(slug: string): BlogPost | undefined {
  if (typeof document === "undefined") return undefined;
  const snapshot = document.getElementById(SNAPSHOT_ID);
  if (snapshot?.getAttribute("type") !== "application/json") return undefined;
  try {
    const post = JSON.parse(snapshot.textContent || "null");
    if (
      !post || post.slug !== slug || post.published !== true ||
      typeof post.id !== "number" ||
      !["title", "content", "excerpt", "category", "createdAt"].every(
        (key) => typeof post[key] === "string",
      ) || !post.title.trim() || !post.content.trim()
    ) return undefined;
    return post as BlogPost;
  } catch {
    return undefined;
  }
}

export function discardPrerenderedBlogPost(slug: string): void {
  if (readPrerenderedBlogPost(slug)) {
    document.getElementById(SNAPSHOT_ID)?.remove();
  }
}
