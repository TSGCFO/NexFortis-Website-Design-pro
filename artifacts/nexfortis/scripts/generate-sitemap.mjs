#!/usr/bin/env node
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
  if (loc.startsWith("/blog/")) return { priority: "0.6", changefreq: "monthly" };
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

async function loadBlogDates() {
  // Unified blog API URL — same default and same env var the prerender script
  // uses, so both produce consistent output. Override via BLOG_API for custom
  // domains (e.g. future api.nexfortis.com CNAME).
  const apiUrl = process.env.BLOG_API || process.env.SITEMAP_BLOG_API || "https://nexfortis-api.onrender.com/api";
  const fallbackPath = path.join(__dirname, "blog-fallback.json");
  let posts = null;
  try {
    const res = await fetch(`${apiUrl}/blog/posts`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const live = await res.json();
      if (Array.isArray(live) && live.length > 0) {
        posts = live.filter((p) => p.published !== false);
        console.log(`[sitemap] using ${posts.length} live post dates from ${apiUrl}`);
      }
    }
  } catch (e) {
    console.warn(`[sitemap] live-post fetch failed (${e.message}); using checked-in fallback for dates`);
  }
  // Fall back to checked-in JSON. If that file is also missing, fail the build
  // rather than silently producing a sitemap with no blog-post dates.
  if (!posts) {
    try {
      posts = JSON.parse(await fs.readFile(fallbackPath, "utf-8"));
    } catch (e) {
      throw new Error(
        `[sitemap] blog fallback file ${fallbackPath} missing or invalid (${e.message}). ` +
          `Live API fetch also failed — aborting sitemap build rather than emit stale dates.`,
      );
    }
  }
  const dateMap = new Map();
  for (const p of posts) {
    if (p.slug) {
      dateMap.set(`/blog/${p.slug}`, (p.updatedAt || p.createdAt || new Date().toISOString()).slice(0, 10));
    }
  }
  return dateMap;
}

const prerendered = await walkPrerendered();
const blogDates = await loadBlogDates();

const urls = prerendered.map((u) => {
  const lastmod = blogDates.get(u.loc) || u.lastmod;
  return { loc: SITE + u.loc, lastmod, ...priorityFor(u.loc) };
});

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
