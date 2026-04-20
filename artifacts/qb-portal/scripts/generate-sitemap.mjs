#!/usr/bin/env node
// Builds public/sitemap.xml + dist/public/sitemap.xml from prerender output.
// Run AFTER vite build (which includes prerendering).
import fs from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const distDir = path.join(root, "dist", "public");
const publicDir = path.join(root, "public");
const SITE = "https://qb.nexfortis.com";

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

if (!existsSync(distDir)) throw new Error(`[sitemap] ${distDir} missing — run vite build first.`);

const urls = [];
async function visit(absDir, relDir) {
  for (const e of await fs.readdir(absDir, { withFileTypes: true })) {
    const abs = path.join(absDir, e.name);
    if (e.isDirectory()) await visit(abs, path.posix.join(relDir, e.name));
    else if (e.isFile() && e.name === "index.html") {
      const loc = relDir === "" ? "/" : "/" + relDir;
      urls.push({ loc: SITE + loc, lastmod: statSync(abs).mtime.toISOString().slice(0, 10), ...priorityFor(loc) });
    }
  }
}
await visit(distDir, "");

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
