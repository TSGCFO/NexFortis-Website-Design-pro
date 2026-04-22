#!/usr/bin/env node
// Post-deploy SEO head-tag verification for both NexFortis sites.
//
// For every URL in both production sitemaps, verifies:
//   1. Page returns HTTP 200 and is not an empty SPA shell
//   2. <title>, <meta description>, <link canonical>, <meta robots>,
//      og:title, og:description, og:url, og:image, og:type, and
//      twitter:card are all present
//   3. <link rel="canonical"> matches the fetched URL (trailing-slash tolerant)
//   4. <meta name="robots"> does NOT contain "noindex"
//   5. No duplicate title / description / canonical / og:url tags
//   6. At least one <script type="application/ld+json"> block exists
//      and every block parses as valid JSON
//
// Usage:
//   node scripts/seo-verification/verify-head-tags.mjs
//   node scripts/seo-verification/verify-head-tags.mjs --json > results.json
//
// Exit code: 0 if all pass, 1 if any CRITICAL error found.

import fs from "node:fs/promises";

const SITEMAPS = [
  "https://qb.nexfortis.com/sitemap.xml",
  "https://nexfortis.com/sitemap.xml",
];

const jsonMode = process.argv.includes("--json");
const log = (...a) => { if (!jsonMode) console.log(...a); };
const err = (...a) => console.error(...a);

// --- URL discovery ---
async function loadUrlsFromSitemap(sitemapUrl) {
  const res = await fetch(sitemapUrl, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`sitemap ${sitemapUrl} returned ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

// --- HTML head extraction ---
// Match attribute values that may contain single quotes inside a double-quoted
// value (and vice-versa). The attribute-value regex uses a capture group that
// allows escaped quotes of the other kind, which matches real HTML entity-
// encoded content in the wild.
function attrValue(html, tagPattern) {
  const m = html.match(tagPattern);
  return m ? m[1] : null;
}

function extractHead(html) {
  const tag = {};
  tag.title = attrValue(html, /<title[^>]*>([^<]+)<\/title>/i);
  tag.description = attrValue(
    html,
    /<meta\s+[^>]*\bname=["']description["'][^>]*\bcontent=(?:"([^"]*)"|'([^']*)')[^>]*>/i,
  );
  // The regex above captures alternative groups; flatten.
  const multiCapture = (m) => (m ? (m[1] ?? m[2] ?? null) : null);

  const descMatch = html.match(
    /<meta\s+[^>]*\bname=["']description["'][^>]*\bcontent=(?:"([^"]*)"|'([^']*)')[^>]*>/i,
  );
  tag.description = multiCapture(descMatch);

  const canonicalMatch = html.match(
    /<link\s+[^>]*\brel=["']canonical["'][^>]*\bhref=(?:"([^"]*)"|'([^']*)')[^>]*>/i,
  );
  tag.canonical = multiCapture(canonicalMatch);

  const robotsMatch = html.match(
    /<meta\s+[^>]*\bname=["']robots["'][^>]*\bcontent=(?:"([^"]*)"|'([^']*)')[^>]*>/i,
  );
  tag.robots = multiCapture(robotsMatch);

  for (const prop of ["og:title", "og:description", "og:url", "og:image", "og:type", "og:site_name", "og:locale"]) {
    const re = new RegExp(
      `<meta\\s+[^>]*\\bproperty=["']${prop.replace(":", "\\:")}["'][^>]*\\bcontent=(?:"([^"]*)"|'([^']*)')[^>]*>`,
      "i",
    );
    const key = prop.replace(":", "_").replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
    tag[key] = multiCapture(html.match(re));
  }
  for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
    const re = new RegExp(
      `<meta\\s+[^>]*\\bname=["']${name.replace(":", "\\:")}["'][^>]*\\bcontent=(?:"([^"]*)"|'([^']*)')[^>]*>`,
      "i",
    );
    const key = name.replace(":", "_").toLowerCase();
    tag[key] = multiCapture(html.match(re));
  }

  // Dedupe counts
  tag._titleCount = (html.match(/<title[\s>]/gi) || []).length;
  tag._descCount = (html.match(/<meta\s+[^>]*\bname=["']description["']/gi) || []).length;
  tag._canonicalCount = (html.match(/<link\s+[^>]*\brel=["']canonical["']/gi) || []).length;
  tag._robotsCount = (html.match(/<meta\s+[^>]*\bname=["']robots["']/gi) || []).length;
  tag._ogUrlCount = (html.match(/<meta\s+[^>]*\bproperty=["']og:url["']/gi) || []).length;

  // JSON-LD
  const ldBlocks = [...html.matchAll(
    /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )].map((m) => m[1].trim());
  tag._jsonLdBlocks = ldBlocks;
  const ldTypes = [];
  let invalidLd = 0;
  for (const b of ldBlocks) {
    try {
      const parsed = JSON.parse(b);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const it of items) {
        if (it && it["@type"]) {
          ldTypes.push(Array.isArray(it["@type"]) ? it["@type"].join(",") : it["@type"]);
        }
      }
    } catch { invalidLd++; }
  }
  tag._jsonLdTypes = ldTypes;
  tag._jsonLdInvalid = invalidLd;

  return tag;
}

// --- per-URL check ---
const REQUIRED = [
  "title", "description", "canonical", "robots",
  "og_title", "og_description", "og_url", "og_image", "og_type",
  "twitter_card",
];

async function check(url) {
  const r = { url, errors: [], warnings: [] };
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20000) });
    r.status = res.status;
    if (res.status !== 200) { r.errors.push(`http-${res.status}`); return r; }
    const html = await res.text();
    r.bodyBytes = html.length;

    // Empty-shell detection
    if (/<div[^>]*id=["']root["'][^>]*>\s*<\/div>\s*<\/body>/i.test(html)) {
      r.errors.push("empty-spa-shell");
    }

    const tag = extractHead(html);
    for (const k of REQUIRED) if (!tag[k]) r.errors.push(`missing:${k}`);

    if (tag.canonical) {
      const norm = (u) => u.replace(/\/$/, "").toLowerCase();
      if (norm(tag.canonical) !== norm(url)) {
        r.errors.push(`canonical-mismatch: canonical=${tag.canonical}`);
      }
    }
    if (tag.robots && /noindex/i.test(tag.robots)) {
      r.errors.push(`noindex-leak: robots=${tag.robots}`);
    }
    if (tag._titleCount > 1) r.errors.push(`duplicate-title:${tag._titleCount}`);
    if (tag._descCount > 1) r.errors.push(`duplicate-description:${tag._descCount}`);
    if (tag._canonicalCount > 1) r.errors.push(`duplicate-canonical:${tag._canonicalCount}`);
    if (tag._robotsCount > 1) r.errors.push(`duplicate-robots:${tag._robotsCount}`);
    if (tag._ogUrlCount > 1) r.errors.push(`duplicate-og-url:${tag._ogUrlCount}`);

    if (tag._jsonLdInvalid > 0) r.errors.push(`invalid-jsonld:${tag._jsonLdInvalid}`);
    if (tag._jsonLdBlocks.length === 0) r.warnings.push("no-jsonld");

    r.title = tag.title;
    r.description = tag.description;
    r.canonical = tag.canonical;
    r.robots = tag.robots;
    r.jsonLdTypes = tag._jsonLdTypes;
  } catch (e) {
    r.errors.push(`fetch-error:${e.message}`);
  }
  return r;
}

// --- main ---
log(`[seo-verify] loading URLs from ${SITEMAPS.length} sitemaps...`);
const allUrls = [];
for (const sm of SITEMAPS) {
  const urls = await loadUrlsFromSitemap(sm);
  log(`[seo-verify]   ${sm}: ${urls.length} URLs`);
  allUrls.push(...urls);
}

log(`[seo-verify] checking ${allUrls.length} URLs...`);
const results = [];
const batchSize = 10;
for (let i = 0; i < allUrls.length; i += batchSize) {
  const batch = allUrls.slice(i, i + batchSize);
  const br = await Promise.all(batch.map(check));
  results.push(...br);
  if (!jsonMode) process.stderr.write(`.`);
}
if (!jsonMode) process.stderr.write(`\n`);

const critical = results.filter((r) => r.errors.length > 0);
const warned = results.filter((r) => r.errors.length === 0 && r.warnings.length > 0);
const clean = results.filter((r) => r.errors.length === 0 && r.warnings.length === 0);

if (jsonMode) {
  console.log(JSON.stringify({ total: results.length, clean: clean.length, warned: warned.length, critical: critical.length, results }, null, 2));
} else {
  log(`\n=== SUMMARY ===`);
  log(`Total URLs: ${results.length}`);
  log(`Clean: ${clean.length}`);
  log(`Warnings only: ${warned.length}`);
  log(`Critical errors: ${critical.length}`);
  if (critical.length > 0) {
    log(`\n--- CRITICAL ---`);
    for (const r of critical) {
      log(`[${r.status}] ${r.url}`);
      for (const e of r.errors) log(`    ERR: ${e}`);
    }
  }
  if (warned.length > 0) {
    log(`\n--- WARNINGS ---`);
    for (const r of warned) {
      log(`[${r.status}] ${r.url}`);
      for (const w of r.warnings) log(`    WARN: ${w}`);
    }
  }
}

process.exit(critical.length > 0 ? 1 : 0);
