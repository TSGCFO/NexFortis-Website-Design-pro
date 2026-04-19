#!/usr/bin/env node
// Generates public/sitemap.xml AND dist/public/sitemap.xml from the
// prerendered output. Run AFTER `vite build && node prerender.mjs` so each
// URL's <lastmod> is the actual mtime of its prerendered index.html (or the
// source file if running before prerender, e.g. for a dev/preview check).
import fs from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const distDir = path.join(root, "dist", "public");
const publicDir = path.join(root, "public");
const SITE = "https://nexfortis.com";
const today = new Date().toISOString().slice(0, 10);

const STATIC = [
  { loc: "/", priority: "1.0", changefreq: "weekly", source: "src/pages/home.tsx" },
  { loc: "/about", priority: "0.8", changefreq: "monthly", source: "src/pages/about.tsx" },
  { loc: "/services", priority: "0.9", changefreq: "monthly", source: "src/pages/services.tsx" },
  { loc: "/services/digital-marketing", priority: "0.8", changefreq: "monthly", source: "src/pages/services/digital-marketing.tsx" },
  { loc: "/services/microsoft-365", priority: "0.8", changefreq: "monthly", source: "src/pages/services/microsoft-365.tsx" },
  { loc: "/services/quickbooks", priority: "0.8", changefreq: "monthly", source: "src/pages/services/quickbooks.tsx" },
  { loc: "/services/it-consulting", priority: "0.8", changefreq: "monthly", source: "src/pages/services/it-consulting.tsx" },
  { loc: "/services/workflow-automation", priority: "0.8", changefreq: "monthly", source: "src/pages/services/automation.tsx" },
  { loc: "/contact", priority: "0.7", changefreq: "monthly", source: "src/pages/contact.tsx" },
  { loc: "/blog", priority: "0.7", changefreq: "weekly", source: "src/pages/blog.tsx" },
  { loc: "/privacy", priority: "0.3", changefreq: "yearly", source: "src/pages/privacy.tsx" },
  { loc: "/terms", priority: "0.3", changefreq: "yearly", source: "src/pages/terms.tsx" },
];

const FALLBACK_POSTS = [
  { slug: "5-signs-your-business-needs-an-it-audit", createdAt: "2026-03-20", updatedAt: "2026-03-20" },
  { slug: "microsoft-365-migration-checklist-canadian-smbs", createdAt: "2026-03-15", updatedAt: "2026-03-15" },
  { slug: "quickbooks-desktop-vs-online", createdAt: "2026-03-10", updatedAt: "2026-03-10" },
  { slug: "what-is-pipeda-why-it-matters", createdAt: "2026-03-05", updatedAt: "2026-03-05" },
  { slug: "top-5-workflow-automation-wins-small-businesses", createdAt: "2026-03-01", updatedAt: "2026-03-01" },
];

function mtimeFor(loc, source) {
  // Prefer the prerendered HTML's mtime (real "when did this URL change").
  const prerendered =
    loc === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, loc, "index.html");
  if (existsSync(prerendered)) {
    return statSync(prerendered).mtime.toISOString().slice(0, 10);
  }
  // Fall back to source page mtime.
  if (source) {
    const srcAbs = path.join(root, source);
    if (existsSync(srcAbs)) return statSync(srcAbs).mtime.toISOString().slice(0, 10);
  }
  return today;
}

const apiUrl = process.env.SITEMAP_BLOG_API || "";
let posts = FALLBACK_POSTS;
if (apiUrl) {
  try {
    const res = await fetch(`${apiUrl}/blog/posts`);
    if (res.ok) {
      const live = await res.json();
      if (Array.isArray(live) && live.length > 0) posts = live.filter((p) => p.published);
    }
  } catch (e) {
    console.warn(`[sitemap] could not fetch live blog posts (${e.message}); using fallback`);
  }
}

const urls = [
  ...STATIC.map((s) => ({
    loc: SITE + s.loc,
    lastmod: mtimeFor(s.loc, s.source),
    changefreq: s.changefreq,
    priority: s.priority,
  })),
  ...posts.map((p) => ({
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

await fs.writeFile(path.join(publicDir, "sitemap.xml"), xml, "utf-8");
if (existsSync(distDir)) {
  await fs.writeFile(path.join(distDir, "sitemap.xml"), xml, "utf-8");
}
console.log(`[sitemap] wrote ${urls.length} URLs (lastmod from prerender mtimes when available)`);
