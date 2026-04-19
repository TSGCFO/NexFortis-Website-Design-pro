#!/usr/bin/env node
// Builds public/sitemap.xml + dist/public/sitemap.xml from prerender output
// and live blog posts. Run AFTER prerender.
import fs from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const distDir = path.join(root, "dist", "public");
const publicDir = path.join(root, "public");
const SITE = "https://nexfortis.com";

function priorityFor(loc) {
  if (loc === "/") return { priority: "1.0", changefreq: "weekly" };
  if (loc === "/services") return { priority: "0.9", changefreq: "monthly" };
  if (loc === "/about" || loc.startsWith("/services/")) return { priority: "0.8", changefreq: "monthly" };
  if (loc === "/contact" || loc === "/blog") return { priority: "0.7", changefreq: "weekly" };
  if (loc === "/terms" || loc === "/privacy") return { priority: "0.3", changefreq: "yearly" };
  return { priority: "0.5", changefreq: "monthly" };
}

async function walkPrerendered() {
  if (!existsSync(distDir)) throw new Error(`[sitemap] ${distDir} missing — prerender first.`);
  const urls = [];
  async function visit(absDir, relDir) {
    for (const e of await fs.readdir(absDir, { withFileTypes: true })) {
      const abs = path.join(absDir, e.name);
      if (e.isDirectory()) await visit(abs, path.posix.join(relDir, e.name));
      else if (e.isFile() && e.name === "index.html") {
        const loc = relDir === "" ? "/" : "/" + relDir;
        urls.push({ loc, lastmod: statSync(abs).mtime.toISOString().slice(0, 10) });
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
      console.log(`[sitemap] using ${posts.length} live posts from ${apiUrl}`);
    }
  }
} catch (e) {
  console.warn(`[sitemap] live-post fetch failed (${e.message}); using checked-in fallback`);
}
if (!posts) {
  posts = JSON.parse(await fs.readFile(path.join(__dirname, "blog-fallback.json"), "utf-8"));
}

const urls = (await walkPrerendered()).map((u) => ({ loc: SITE + u.loc, lastmod: u.lastmod, ...priorityFor(u.loc) }));
for (const p of posts) {
  urls.push({
    loc: `${SITE}/blog/${p.slug}`,
    lastmod: (p.updatedAt || p.createdAt || new Date().toISOString()).slice(0, 10),
    changefreq: "monthly",
    priority: "0.6",
  });
}

urls.sort((a, b) => (a.loc === SITE + "/" ? -1 : b.loc === SITE + "/" ? 1 : a.loc.localeCompare(b.loc)));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

await fs.writeFile(path.join(publicDir, "sitemap.xml"), xml, "utf-8");
await fs.writeFile(path.join(distDir, "sitemap.xml"), xml, "utf-8");
console.log(`[sitemap] wrote ${urls.length} URLs`);
