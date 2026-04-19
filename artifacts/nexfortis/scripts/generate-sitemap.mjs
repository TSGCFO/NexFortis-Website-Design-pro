#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.join(__dirname, "..", "public", "sitemap.xml");
const SITE = "https://nexfortis.com";
const today = new Date().toISOString().slice(0, 10);

const STATIC = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/about", priority: "0.8", changefreq: "monthly" },
  { loc: "/services", priority: "0.9", changefreq: "monthly" },
  { loc: "/services/digital-marketing", priority: "0.8", changefreq: "monthly" },
  { loc: "/services/microsoft-365", priority: "0.8", changefreq: "monthly" },
  { loc: "/services/quickbooks", priority: "0.8", changefreq: "monthly" },
  { loc: "/services/it-consulting", priority: "0.8", changefreq: "monthly" },
  { loc: "/services/workflow-automation", priority: "0.8", changefreq: "monthly" },
  { loc: "/contact", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog", priority: "0.7", changefreq: "weekly" },
  { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
  { loc: "/terms", priority: "0.3", changefreq: "yearly" },
];

// Fallback blog posts mirror the in-app fallbackPosts in src/pages/blog.tsx.
// Override at build time by setting SITEMAP_BLOG_API to your live API base URL.
const FALLBACK_POSTS = [
  { slug: "5-signs-your-business-needs-an-it-audit", createdAt: "2026-03-20", published: true },
  { slug: "microsoft-365-migration-checklist-canadian-smbs", createdAt: "2026-03-15", published: true },
  { slug: "quickbooks-desktop-vs-online", createdAt: "2026-03-10", published: true },
  { slug: "what-is-pipeda-why-it-matters", createdAt: "2026-03-05", published: true },
  { slug: "top-5-workflow-automation-wins-small-businesses", createdAt: "2026-03-01", published: true },
];

const apiUrl = process.env.SITEMAP_BLOG_API || "";
let posts = FALLBACK_POSTS;
if (apiUrl) {
  try {
    const res = await fetch(`${apiUrl}/blog/posts`);
    if (res.ok) {
      const live = await res.json();
      if (Array.isArray(live) && live.length > 0) posts = live;
    }
  } catch (e) {
    console.warn(`[sitemap] could not fetch live blog posts (${e.message}); using fallback list`);
  }
}

const urls = [
  ...STATIC.map((s) => ({ loc: SITE + s.loc, lastmod: today, changefreq: s.changefreq, priority: s.priority })),
  ...posts
    .filter((p) => p.published)
    .map((p) => ({
      loc: `${SITE}/blog/${p.slug}`,
      lastmod: (p.updatedAt || p.createdAt || today).slice(0, 10),
      changefreq: "monthly",
      priority: "0.6",
    })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

await fs.writeFile(outFile, xml, "utf-8");
console.log(`[sitemap] wrote ${urls.length} URLs -> ${path.relative(process.cwd(), outFile)}`);
