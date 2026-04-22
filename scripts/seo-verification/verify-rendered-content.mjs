#!/usr/bin/env node
// Post-deploy prerender verification for both NexFortis sites.
//
// Proves that every URL in both production sitemaps is served as
// fully-prerendered HTML, not an empty SPA shell that depends on
// JavaScript execution. Runs three independent checks per URL:
//
//   1. Route-specific content markers are present in the raw HTML bytes
//      (e.g. "Enterprise to Premier" on /catalog, "Teams" on
//      /services/microsoft-365). If the markers are there, the React
//      component for that route rendered during the build.
//   2. The <div id="root"> element contains child elements (the
//      React component tree), not the empty-shell pattern.
//   3. The HTML does not match the empty-shell regex
//      (<div id="root"></div> immediately before </body>).
//
// Usage:
//   node scripts/seo-verification/verify-rendered-content.mjs
//   node scripts/seo-verification/verify-rendered-content.mjs --json
//
// Exit code: 0 if every URL passes, 1 if any URL fails.

const SITEMAPS = [
  "https://qb.nexfortis.com/sitemap.xml",
  "https://nexfortis.com/sitemap.xml",
];

const jsonMode = process.argv.includes("--json");
const log = (...a) => { if (!jsonMode) console.log(...a); };

// --- URL discovery ---
async function loadUrlsFromSitemap(sitemapUrl) {
  const res = await fetch(sitemapUrl, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`sitemap ${sitemapUrl} returned ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

// Markers unique to each route's rendered React component.
// For /service/*, /category/*, /landing/*, and /blog/*, we derive markers
// from the slug itself \u2014 any word >=4 chars in the slug should appear in
// the rendered content (H1, product name, category label, etc).
function markersFor(url) {
  const u = new URL(url);
  const path = u.pathname;

  if (u.host === "qb.nexfortis.com") {
    if (path === "/") return ["Enterprise to Premier", "QuickBooks"];
    if (path === "/catalog") return ["Enterprise to Premier", "Super Condense", "Audit Trail", "File Health"];
    if (path === "/faq") return ["FAQ"];
    if (path === "/qbm-guide") return ["QuickBooks"];
    if (path === "/subscription") return ["Subscription", "QuickBooks"];
    if (path === "/waitlist") return ["waitlist"];
    if (path === "/terms") return ["Terms"];
    if (path === "/privacy") return ["Privacy"];
    if (path.startsWith("/service/") || path.startsWith("/category/") || path.startsWith("/landing/")) {
      const slug = path.split("/").pop();
      return slug.replace(/-/g, " ").split(" ").filter((w) => w.length > 3).slice(0, 2);
    }
  }
  if (u.host === "nexfortis.com") {
    if (path === "/") return ["NexFortis", "IT"];
    if (path === "/about") return ["About", "NexFortis"];
    if (path === "/services") return ["Services", "Microsoft"];
    if (path === "/services/digital-marketing") return ["Digital Marketing"];
    if (path === "/services/microsoft-365") return ["Microsoft 365", "Teams"];
    if (path === "/services/quickbooks") return ["QuickBooks"];
    if (path === "/services/it-consulting") return ["Consulting"];
    if (path === "/services/workflow-automation") return ["Automation", "Workflow"];
    if (path === "/contact") return ["Contact"];
    if (path === "/blog") return ["Blog"];
    if (path === "/privacy") return ["Privacy"];
    if (path === "/terms") return ["Terms"];
    if (path.startsWith("/blog/")) {
      const slug = path.split("/").pop();
      return slug.replace(/-/g, " ").split(" ").filter((w) => w.length > 3).slice(0, 2);
    }
  }
  return [];
}

async function check(url) {
  const started = Date.now();
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20000) });
    const html = await res.text();
    const markers = markersFor(url);
    const lowered = html.toLowerCase();
    const missing = markers.filter((m) => !lowered.includes(m.toLowerCase()));
    const isEmptyShell = /<div[^>]*id=["']root["'][^>]*>\s*<\/div>\s*<\/body>/i.test(html);
    const rootHasChildren = /<div[^>]*id=["']root["'][^>]*>\s*<[a-z]/i.test(html);

    return {
      url,
      status: res.status,
      ms: Date.now() - started,
      bodyBytes: html.length,
      expectedMarkers: markers,
      missingMarkers: missing,
      isEmptyShell,
      rootHasChildren,
      passed: res.status === 200 && missing.length === 0 && !isEmptyShell && rootHasChildren,
    };
  } catch (e) {
    return { url, passed: false, error: e.message };
  }
}

// --- main ---
log(`[prerender-verify] loading URLs from ${SITEMAPS.length} sitemaps...`);
const allUrls = [];
for (const sm of SITEMAPS) {
  const urls = await loadUrlsFromSitemap(sm);
  log(`[prerender-verify]   ${sm}: ${urls.length} URLs`);
  allUrls.push(...urls);
}

log(`[prerender-verify] checking ${allUrls.length} URLs...`);
const results = [];
const batchSize = 10;
for (let i = 0; i < allUrls.length; i += batchSize) {
  const batch = allUrls.slice(i, i + batchSize);
  const br = await Promise.all(batch.map(check));
  results.push(...br);
  if (!jsonMode) process.stderr.write(`.`);
}
if (!jsonMode) process.stderr.write(`\n`);

const passed = results.filter((r) => r.passed);
const failed = results.filter((r) => !r.passed);

if (jsonMode) {
  console.log(JSON.stringify({ total: results.length, passed: passed.length, failed: failed.length, results }, null, 2));
} else {
  log(`\n=== PRERENDER VERIFICATION ===`);
  log(`Total: ${results.length}`);
  log(`Passed (markers found + #root has children + not empty shell): ${passed.length}`);
  log(`Failed: ${failed.length}`);
  if (failed.length > 0) {
    log(`\n--- FAILURES ---`);
    for (const r of failed) {
      log(r.url);
      if (r.error) log(`  error: ${r.error}`);
      else {
        log(`  isEmptyShell=${r.isEmptyShell}  rootHasChildren=${r.rootHasChildren}  bodyBytes=${r.bodyBytes}`);
        if (r.missingMarkers?.length) log(`  missing markers: ${r.missingMarkers.join(", ")}`);
      }
    }
  }
  const emptyShells = results.filter((r) => r.isEmptyShell);
  const noChildren = results.filter((r) => !r.rootHasChildren);
  log(`\n--- SPA shell indicators ---`);
  log(`  Pages with empty <div id="root"></div>: ${emptyShells.length}`);
  log(`  Pages where #root has no child element: ${noChildren.length}`);
}

process.exit(failed.length > 0 ? 1 : 0);
