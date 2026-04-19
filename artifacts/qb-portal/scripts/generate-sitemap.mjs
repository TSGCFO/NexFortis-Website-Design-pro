#!/usr/bin/env node
// Generates public/sitemap.xml AND dist/public/sitemap.xml from the prerender
// output. Run AFTER `vite build && node prerender.mjs` so each URL's <lastmod>
// is the actual mtime of its prerendered index.html.
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

const STATIC = [
  { loc: "/", priority: "1.0", changefreq: "weekly", source: "src/pages/home.tsx" },
  { loc: "/catalog", priority: "0.9", changefreq: "weekly", source: "src/pages/catalog.tsx" },
  { loc: "/faq", priority: "0.6", changefreq: "monthly", source: "src/pages/faq.tsx" },
  { loc: "/qbm-guide", priority: "0.7", changefreq: "monthly", source: "src/pages/qbm-guide.tsx" },
  { loc: "/subscription", priority: "0.7", changefreq: "monthly", source: "src/pages/subscription.tsx" },
  { loc: "/waitlist", priority: "0.6", changefreq: "monthly", source: "src/pages/waitlist.tsx" },
  { loc: "/terms", priority: "0.3", changefreq: "yearly", source: "src/pages/terms.tsx" },
  { loc: "/privacy", priority: "0.3", changefreq: "yearly", source: "src/pages/privacy.tsx" },
];

const productsJson = JSON.parse(
  await fs.readFile(path.join(publicDir, "products.json"), "utf-8"),
);
const landingTs = await fs.readFile(
  path.join(root, "src", "data", "landingPages.ts"),
  "utf-8",
);
const landingSlugs = [...landingTs.matchAll(/^\s*slug:\s*"([^"]+)"/gm)].map((m) => m[1]);
const categorySlugs = [...new Set(productsJson.services.map((s) => s.category_slug))];
const productSlugs = productsJson.services.map((s) => s.slug);
const productsJsonMtime = statSync(path.join(publicDir, "products.json"))
  .mtime.toISOString()
  .slice(0, 10);
const landingTsMtime = statSync(path.join(root, "src", "data", "landingPages.ts"))
  .mtime.toISOString()
  .slice(0, 10);

function mtimeFor(loc, sourceMtimeFallback) {
  const prerendered =
    loc === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, loc, "index.html");
  if (existsSync(prerendered)) {
    return statSync(prerendered).mtime.toISOString().slice(0, 10);
  }
  return sourceMtimeFallback || today;
}

const urls = [
  ...STATIC.map((s) => {
    const srcAbs = path.join(root, s.source);
    const fallback = existsSync(srcAbs) ? statSync(srcAbs).mtime.toISOString().slice(0, 10) : today;
    return {
      loc: SITE + s.loc,
      lastmod: mtimeFor(s.loc, fallback),
      priority: s.priority,
      changefreq: s.changefreq,
    };
  }),
  ...categorySlugs.map((slug) => ({
    loc: `${SITE}/category/${slug}`,
    lastmod: mtimeFor(`/category/${slug}`, productsJsonMtime),
    priority: "0.8",
    changefreq: "weekly",
  })),
  ...productSlugs.map((slug) => ({
    loc: `${SITE}/service/${slug}`,
    lastmod: mtimeFor(`/service/${slug}`, productsJsonMtime),
    priority: "0.8",
    changefreq: "monthly",
  })),
  ...landingSlugs.map((slug) => ({
    loc: `${SITE}/landing/${slug}`,
    lastmod: mtimeFor(`/landing/${slug}`, landingTsMtime),
    priority: "0.9",
    changefreq: "monthly",
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
