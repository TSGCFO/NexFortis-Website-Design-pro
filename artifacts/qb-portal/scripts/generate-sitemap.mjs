#!/usr/bin/env node
// QB sitemap generator. Walks the prerender output (`dist/public/`) for every
// emitted `index.html` and turns each into a sitemap URL. Per-URL <lastmod> is
// the actual mtime of that prerendered file. Priority/changefreq are inferred
// from the URL prefix. Run AFTER `vite build && node prerender.mjs`.
import fs from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const distDir = path.join(root, "dist", "public");
const publicDir = path.join(root, "public");
const SITE = "https://qb.nexfortis.com";
const today = new Date().toISOString().slice(0, 10);

function priorityFor(loc) {
  if (loc === "/") return { priority: "1.0", changefreq: "weekly" };
  if (loc === "/catalog") return { priority: "0.9", changefreq: "weekly" };
  if (loc.startsWith("/landing/")) return { priority: "0.9", changefreq: "monthly" };
  if (loc.startsWith("/category/")) return { priority: "0.8", changefreq: "weekly" };
  if (loc.startsWith("/service/")) return { priority: "0.8", changefreq: "monthly" };
  if (loc === "/subscription" || loc === "/qbm-guide") return { priority: "0.7", changefreq: "monthly" };
  if (loc === "/waitlist" || loc === "/faq") return { priority: "0.6", changefreq: "monthly" };
  if (loc === "/terms" || loc === "/privacy") return { priority: "0.3", changefreq: "yearly" };
  return { priority: "0.5", changefreq: "monthly" };
}

// Walk prerendered output for every index.html.
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

const found = await walkPrerendered();
const urls = found.map((u) => {
  const meta = priorityFor(u.loc);
  return {
    loc: SITE + u.loc,
    lastmod: u.lastmod,
    changefreq: meta.changefreq,
    priority: meta.priority,
  };
});

// Sort: home first, then alphabetically by loc, for stable output.
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
console.log(`[sitemap] walked dist/public, wrote ${urls.length} URLs (lastmod = real prerender mtime)`);
void today;
