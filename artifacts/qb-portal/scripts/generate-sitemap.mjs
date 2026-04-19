#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outFile = path.join(root, "public", "sitemap.xml");
const SITE = "https://qb.nexfortis.com";
const today = new Date().toISOString().slice(0, 10);

const STATIC = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/catalog", priority: "0.9", changefreq: "weekly" },
  { loc: "/faq", priority: "0.6", changefreq: "monthly" },
  { loc: "/qbm-guide", priority: "0.7", changefreq: "monthly" },
  { loc: "/terms", priority: "0.3", changefreq: "yearly" },
  { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
];

// Read products + landing pages from disk (build-time, no API needed).
const productsJson = JSON.parse(await fs.readFile(path.join(root, "public", "products.json"), "utf-8"));
const landingTs = await fs.readFile(path.join(root, "src", "data", "landingPages.ts"), "utf-8");
const landingSlugs = [...landingTs.matchAll(/^\s*slug:\s*"([^"]+)"/gm)].map((m) => m[1]);
const categorySlugs = [...new Set(productsJson.services.map((s) => s.category_slug))];
const productSlugs = productsJson.services.map((s) => s.slug);

const urls = [
  ...STATIC.map((s) => ({ loc: SITE + s.loc, priority: s.priority, changefreq: s.changefreq })),
  ...categorySlugs.map((slug) => ({
    loc: `${SITE}/category/${slug}`,
    priority: "0.8",
    changefreq: "weekly",
  })),
  ...productSlugs.map((slug) => ({
    loc: `${SITE}/service/${slug}`,
    priority: "0.8",
    changefreq: "monthly",
  })),
  ...landingSlugs.map((slug) => ({
    loc: `${SITE}/landing/${slug}`,
    priority: "0.9",
    changefreq: "monthly",
  })),
].map((u) => ({ ...u, lastmod: today }));

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
