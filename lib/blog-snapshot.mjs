// Only published, public article fields are serialized into the page.
export function embedBlogPostSnapshot(html, post, route) {
  if (!post || post.published !== true || route !== `/blog/${post.slug}` ||
      typeof post.id !== "number" ||
      !["title", "content", "excerpt", "category", "createdAt"].every(
        (key) => typeof post[key] === "string",
      ) || !post.title.trim() || !post.content.trim()) {
    throw new Error(`Cannot embed a published article snapshot for ${route}`);
  }
  const snapshot = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    coverImage: post.coverImage ?? null,
    seoTitle: post.seoTitle ?? null,
    metaDescription: post.metaDescription ?? null,
    published: true,
    createdAt: post.createdAt,
  };
  const json = JSON.stringify(snapshot)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  if (!html.includes("</head>")) throw new Error("Article HTML has no closing head tag");
  return html.replace("</head>", () => `<script id="nexfortis-blog-post" type="application/json">${json}</script></head>`);
}
