#!/usr/bin/env node
// Nexfortis marketing sitemap generator.
//
// 1. Walks the prerender output (`dist/public/`) for every emitted index.html
//    so static + service + legal pages are picked up automatically with real
//    per-URL <lastmod> derived from prerendered file mtime.
// 2. Fetches live published blog posts from the API by default
//    (`SITEMAP_BLOG_API`, falling back to `https://api.nexfortis.com`) so blog
//    URLs and their `updatedAt` timestamps are real, not stamped. If the API
//    cannot be reached at build time it falls back to a small known-good list
//    so the build never produces an empty sitemap.
// Run AFTER `vite build && node prerender.mjs`.
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

const FALLBACK_POSTS = [
  { slug: "5-signs-your-business-needs-an-it-audit", updatedAt: "2026-03-20" },
  { slug: "microsoft-365-migration-checklist-canadian-smbs", updatedAt: "2026-03-15" },
  { slug: "quickbooks-desktop-vs-online", updatedAt: "2026-03-10" },
  { slug: "what-is-pipeda-why-it-matters", updatedAt: "2026-03-05" },
  { slug: "top-5-workflow-automation-wins-small-businesses", updatedAt: "2026-03-01" },
];

function priorityFor(loc) {
  if (loc === "/") return { priority: "1.0", changefreq: "weekly" };
  if (loc === "/services") return { priority: "0.9", changefreq: "monthly" };
  if (loc === "/about") return { priority: "0.8", changefreq: "monthly" };
  if (loc.startsWith("/services/")) return { priority: "0.8", changefreq: "monthly" };
  if (loc === "/contact" || loc === "/blog") return { priority: "0.7", changefreq: "weekly" };
  if (loc === "/terms" || loc === "/privacy") return { priority: "0.3", changefreq: "yearly" };
  return { priority: "0.5", changefreq: "monthly" };
}

async function walkPrerendered() {
  const urls = [];
  if (!existsSync(distDir)) {
    throw new Error(`[sitemap] missing ${distDir} — run prerender first.`);
  }
  async function visit(absDir, relDir) {
    const entries = await fs.readdir(absDir, { withFileTypes: true });
    for (const e of entries) {
      const abs = path.join(absDir, e.name);
      if (e.isDirectory()) {
        await visit(abs, path.posix.join(relDir, e.name));
      } else if (e.isFile() && e.name === "index.html") {
        const loc = relDir === "" ? "/" : "/" + relDir;
        const lastmod = statSync(abs).mtime.toISOString().slice(0, 10);
        urls.push({ loc, lastmod });
      }
    }
  }
  await visit(distDir, "");
  return urls;
}

const apiUrl = process.env.SITEMAP_BLOG_API || "https://api.nexfortis.com";
let posts = null;
try {
  const res = await fetch(`${apiUrl}/blog/posts`, { signal: AbortSignal.timeout(5000) });
  if (res.ok) {
    const live = await res.json();
    if (Array.isArray(live) && live.length > 0) {
      posts = live.filter((p) => p.published !== false);
      console.log(`[sitemap] fetched ${posts.length} live blog posts from ${apiUrl}`);
    }
  }
} catch (e) {
  console.warn(`[sitemap] could not fetch live posts from ${apiUrl} (${e.message}); using fallback list`);
}
if (!posts) posts = FALLBACK_POSTS;

const found = await walkPrerendered();
const urls = found.map((u) => {
  const meta = priorityFor(u.loc);
  return { loc: SITE + u.loc, lastmod: u.lastmod, ...meta };
});

for (const p of posts) {
  const lastmod = (p.updatedAt || p.createdAt || today).slice(0, 10);
  urls.push({
    loc: `${SITE}/blog/${p.slug}`,
    lastmod,
    changefreq: "monthly",
    priority: "0.6",
  });
}

urls.sort((a, b) => {
  if (a.loc === SITE + "/") return -1;
  if (b.loc === SITE + "/") return 1;
  return a.loc.localeCompare(b.loc);
});

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
await fs.writeFile(path.join(distDir, "sitemap.xml"), xml, "utf-8");
console.log(`[sitemap] walked dist/public + ${posts.length} blog posts → ${urls.length} URLs (lastmod = real mtimes/timestamps)`);
