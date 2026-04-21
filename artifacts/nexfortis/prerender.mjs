import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { dedupeSeoTags } from "../../lib/seo-dedupe.mjs";
import { createStaticServer, validatePrerenderedHtml, replaceTitleTag } from "../../lib/prerender-utils.mjs";
import { execSync } from "node:child_process";

// ============================================================================
// DIAGNOSTIC BUILD — verbose, unbuffered logging to stderr so Render doesn't
// swallow stdout. Every step prints a timestamped line. Revert after debugging.
// ============================================================================
const T0 = Date.now();
function dlog(msg) {
  const t = ((Date.now() - T0) / 1000).toFixed(2);
  process.stderr.write(`[diag +${t}s] ${msg}\n`);
}
function derr(msg) {
  const t = ((Date.now() - T0) / 1000).toFixed(2);
  process.stderr.write(`[diag +${t}s ERR] ${msg}\n`);
}
function memSnap(label) {
  const m = process.memoryUsage();
  dlog(`MEM[${label}] rss=${(m.rss / 1024 / 1024).toFixed(0)}MB heap=${(m.heapUsed / 1024 / 1024).toFixed(0)}/${(m.heapTotal / 1024 / 1024).toFixed(0)}MB`);
}
process.on("uncaughtException", (err) => {
  derr(`UNCAUGHT EXCEPTION: ${err?.stack || err}`);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  derr(`UNHANDLED REJECTION: ${reason?.stack || reason}`);
  process.exit(1);
});
dlog(`boot node=${process.version} platform=${process.platform} arch=${process.arch} cwd=${process.cwd()}`);
dlog(`env NODE_ENV=${process.env.NODE_ENV || "(unset)"} PORT=${process.env.PORT || "(unset)"} BASE_PATH=${process.env.BASE_PATH || "(unset)"}`);
memSnap("boot");

function findChromium() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    dlog(`chromium via PUPPETEER_EXECUTABLE_PATH=${process.env.PUPPETEER_EXECUTABLE_PATH}`);
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  for (const bin of ["chromium", "chromium-browser", "google-chrome", "google-chrome-stable"]) {
    try {
      const p = execSync(`which ${bin}`, { encoding: "utf-8" }).trim();
      if (p) {
        dlog(`chromium found via which ${bin}: ${p}`);
        return p;
      }
    } catch {}
  }
  dlog(`chromium NOT found via which; will use puppeteer bundled binary`);
  return undefined;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist", "public");
const base = (process.env.BASE_PATH || "/").replace(/\/?$/, "/");
const port = Number(process.env.PRERENDER_PORT || 4173);

const EXCLUDED_ROUTES = [
  "/admin/login",
  "/blog/admin",
  "/blog/:slug",
  "/services/automation-software",
];

// Routes that are intentionally allowed to keep a noindex robots meta in their
// prerendered output. Empty by default — the build fails if any rendered page
// still has noindex. Add a route here only if you intentionally want it
// de-indexed.
const NOINDEX_ALLOWLIST = new Set([]);

const EXCLUDED_PATTERNS = [
  /^\/admin/,
  /\/:/,
];

function isExcluded(route) {
  if (EXCLUDED_ROUTES.includes(route)) return true;
  return EXCLUDED_PATTERNS.some((p) => p.test(route));
}

async function discoverStaticRoutes() {
  dlog(`discoverStaticRoutes: reading App.tsx`);
  const appTsx = await fs.readFile(path.join(__dirname, "src", "App.tsx"), "utf-8");
  const matches = [...appTsx.matchAll(/<Route\s+path="([^"]+)"/g)];
  const routes = [];
  for (const m of matches) {
    const route = m[1];
    if (isExcluded(route)) continue;
    routes.push(route);
  }
  if (!routes.includes("/")) routes.unshift("/");
  const out = [...new Set(routes)];
  dlog(`discoverStaticRoutes: ${out.length} routes`);
  return out;
}

async function discoverBlogRoutes() {
  const apiUrl = process.env.BLOG_API || process.env.SITEMAP_BLOG_API || "https://nexfortis-api.onrender.com/api";
  const fallbackPath = path.join(__dirname, "scripts", "blog-fallback.json");
  dlog(`discoverBlogRoutes: apiUrl=${apiUrl}`);
  let posts = null;
  try {
    const t0 = Date.now();
    const res = await fetch(`${apiUrl}/blog/posts`, { signal: AbortSignal.timeout(15000) });
    dlog(`discoverBlogRoutes: fetch returned status=${res.status} in ${Date.now() - t0}ms`);
    if (res.ok) {
      const live = await res.json();
      if (Array.isArray(live) && live.length > 0) {
        posts = live.filter((p) => p.published !== false);
        dlog(`discoverBlogRoutes: ${posts.length} live posts (${live.length} total, ${live.length - posts.length} unpublished filtered)`);
      } else {
        dlog(`discoverBlogRoutes: live response not a non-empty array: type=${typeof live} len=${Array.isArray(live) ? live.length : "n/a"}`);
      }
    } else {
      dlog(`discoverBlogRoutes: HTTP ${res.status}; falling back`);
    }
  } catch (e) {
    dlog(`discoverBlogRoutes: fetch threw "${e.message}"; using fallback`);
  }
  if (!posts) {
    try {
      const raw = await fs.readFile(fallbackPath, "utf-8");
      posts = JSON.parse(raw);
      dlog(`discoverBlogRoutes: loaded ${posts.length} posts from fallback (${raw.length} bytes)`);
    } catch (e) {
      derr(`discoverBlogRoutes: FATAL fallback load failed: ${e.message}`);
      process.exit(1);
    }
  }
  const SAFE_SLUG = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
  const routes = [];
  const postsBySlug = new Map();
  for (const p of posts) {
    if (!p.slug || typeof p.slug !== "string") {
      dlog(`discoverBlogRoutes: skipping post with missing slug`);
      continue;
    }
    if (!SAFE_SLUG.test(p.slug)) {
      derr(`discoverBlogRoutes: FATAL unsafe slug "${p.slug}"`);
      process.exit(1);
    }
    routes.push(`/blog/${p.slug}`);
    if (p.content && p.title) postsBySlug.set(p.slug, p);
  }
  const unique = [...new Set(routes)];
  if (unique.length !== routes.length) {
    dlog(`discoverBlogRoutes: removed ${routes.length - unique.length} duplicate slug(s)`);
  }
  dlog(`discoverBlogRoutes: ${unique.length} routes, ${postsBySlug.size} with full content`);
  if (postsBySlug.size === 0) {
    derr(`discoverBlogRoutes: FATAL no posts have full content`);
    derr(`  apiUrl=${apiUrl}/blog/posts reachable? set BLOG_API env if needed`);
    process.exit(1);
  }
  return { routes: unique, postsBySlug };
}

function startServer() {
  dlog(`startServer: binding 127.0.0.1:${port} serving ${distDir}`);
  return new Promise((resolve, reject) => {
    const server = createStaticServer({ distDir, base });
    server.on("error", (err) => {
      derr(`startServer: server error: ${err?.stack || err}`);
      reject(err);
    });
    server.listen(port, "127.0.0.1", () => {
      dlog(`startServer: LISTENING on 127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

function verifyPrerendered(routes) {
  const missing = [];
  for (const route of routes) {
    const dir = path.join(distDir, route === "/" ? "" : route);
    const file = path.join(dir, "index.html");
    if (!existsSync(file)) missing.push(route);
  }
  return missing;
}

async function prerender() {
  dlog(`prerender: start; distDir=${distDir}`);
  if (!existsSync(distDir)) {
    derr(`prerender: dist not found: ${distDir}`);
    process.exit(1);
  }

  const staticRoutes = await discoverStaticRoutes();
  const { routes: blogRoutes, postsBySlug } = await discoverBlogRoutes();
  const ROUTES = [...new Set([...staticRoutes, ...blogRoutes])];
  dlog(`routes total=${ROUTES.length} static=${staticRoutes.length} blog=${blogRoutes.length}`);
  dlog(`static: ${staticRoutes.join(", ")}`);
  dlog(`blog:   ${blogRoutes.join(", ")}`);

  const server = await startServer();
  memSnap("after-server");

  const chromePath = findChromium();
  dlog(`puppeteer.launch: starting (chromePath=${chromePath || "(bundled)"})`);
  const launchStart = Date.now();
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: chromePath,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      dumpio: false,
    });
    dlog(`puppeteer.launch: OK in ${Date.now() - launchStart}ms`);
  } catch (e) {
    derr(`puppeteer.launch: FAILED after ${Date.now() - launchStart}ms`);
    derr(`  error: ${e?.stack || e}`);
    derr(`  chromePath=${chromePath}`);
    try {
      const ver = execSync(`${chromePath || "chromium"} --version 2>&1`, { encoding: "utf-8" }).trim();
      derr(`  chromium --version: ${ver}`);
    } catch (v) {
      derr(`  chromium --version failed: ${v.message}`);
    }
    process.exit(1);
  }
  memSnap("after-puppeteer-launch");
  try {
    const v = await browser.version();
    dlog(`browser.version: ${v}`);
  } catch (e) {
    dlog(`browser.version failed: ${e.message}`);
  }

  const baseUrl = `http://127.0.0.1:${port}${base.slice(0, -1)}`;
  dlog(`baseUrl=${baseUrl}`);

  const shellPath = path.join(distDir, "index.html");
  const shellHtml = await fs.readFile(shellPath, "utf-8");
  dlog(`shell index.html loaded (${shellHtml.length} bytes)`);

  let ok = 0;
  let fail = 0;
  try {
    for (let i = 0; i < ROUTES.length; i++) {
      const route = ROUTES[i];
      const url = baseUrl + route;
      const routeStart = Date.now();
      dlog(`page[${i + 1}/${ROUTES.length}] START ${route}`);

      let page;
      try {
        page = await browser.newPage();
      } catch (e) {
        derr(`page[${i + 1}/${ROUTES.length}] newPage FAILED: ${e?.stack || e}`);
        fail++;
        continue;
      }

      await page.setUserAgent("ReactSnap/Prerender Mozilla/5.0");

      // Surface page-level console, errors, request failures
      page.on("pageerror", (err) => derr(`  [${route}] pageerror: ${err.message}`));
      page.on("requestfailed", (req) => {
        const f = req.failure();
        dlog(`  [${route}] requestfailed ${req.method()} ${req.url()} — ${f?.errorText || "unknown"}`);
      });

      const blogSlugMatch = route.match(/^\/blog\/([a-z0-9][a-z0-9-]*[a-z0-9])$/);
      const isBlogPost = blogSlugMatch && postsBySlug.has(blogSlugMatch[1]);
      if (isBlogPost) {
        const post = postsBySlug.get(blogSlugMatch[1]);
        await page.setRequestInterception(true);
        page.on("request", (req) => {
          const reqUrl = req.url();
          if (reqUrl.endsWith(`/api/blog/posts/${post.slug}`)) {
            req.respond({
              status: 200,
              contentType: "application/json",
              headers: { "access-control-allow-origin": "*" },
              body: JSON.stringify(post),
            });
            return;
          }
          if (reqUrl.endsWith("/api/blog/posts")) {
            req.respond({
              status: 200,
              contentType: "application/json",
              headers: { "access-control-allow-origin": "*" },
              body: JSON.stringify([...postsBySlug.values()]),
            });
            return;
          }
          req.continue();
        });
      }

      try {
        const gotoStart = Date.now();
        await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
        dlog(`  [${route}] goto OK in ${Date.now() - gotoStart}ms`);

        if (isBlogPost) {
          const wfStart = Date.now();
          try {
            await page.waitForFunction(
              () => !!document.querySelector("article h2, article h3, article p"),
              { timeout: 10000 },
            );
            dlog(`  [${route}] waitForFunction OK in ${Date.now() - wfStart}ms`);
          } catch (e) {
            dlog(`  [${route}] waitForFunction TIMEOUT after ${Date.now() - wfStart}ms: ${e.message}`);
          }
        }
        await new Promise((r) => setTimeout(r, 250));

        const html = await page.content();
        const liveTitle = await page.evaluate(() => document.title);
        dlog(`  [${route}] html=${html.length}B title="${liveTitle.slice(0, 80)}"`);
        const cleaned = dedupeSeoTags(
          replaceTitleTag(html, liveTitle)
            .replace(/<script[^>]*replit-dev-banner[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<script[^>]*cartographer[^>]*>[\s\S]*?<\/script>/gi, ""),
        );
        if (isBlogPost && /Article Not Found/i.test(cleaned)) {
          throw new Error(`blog post rendered as "Article Not Found" — interception may have failed`);
        }
        validatePrerenderedHtml({
          route,
          html: cleaned,
          noindexAllowlist: NOINDEX_ALLOWLIST,
        });
        const outDir = path.join(distDir, route === "/" ? "" : route);
        await fs.mkdir(outDir, { recursive: true });
        const outFile = path.join(outDir, "index.html");
        await fs.writeFile(outFile, cleaned, "utf-8");
        if (route !== "/") {
          const mirrorPath = path.join(distDir, route.replace(/^\//, "") + ".html");
          await fs.mkdir(path.dirname(mirrorPath), { recursive: true });
          await fs.writeFile(mirrorPath, cleaned, "utf-8");
        }
        dlog(`page[${i + 1}/${ROUTES.length}] DONE ${route} in ${Date.now() - routeStart}ms`);
        ok++;
      } catch (err) {
        derr(`page[${i + 1}/${ROUTES.length}] FAIL ${route} after ${Date.now() - routeStart}ms: ${err?.stack || err}`);
        fail++;
      } finally {
        try { await page.close(); } catch (e) { dlog(`  [${route}] page.close error: ${e.message}`); }
      }
      if ((i + 1) % 5 === 0) memSnap(`after-page-${i + 1}`);
    }
  } finally {
    dlog(`cleanup: closing browser and server`);
    try { await browser.close(); } catch (e) { dlog(`browser.close error: ${e.message}`); }
    try { server.close(); } catch (e) { dlog(`server.close error: ${e.message}`); }
  }
  const fallbackPath = path.join(distDir, "200.html");
  await fs.writeFile(fallbackPath, shellHtml, "utf-8");
  dlog(`wrote 200.html SPA fallback`);

  if (fail > 0) {
    derr(`FAILED: ${fail} route(s) could not be prerendered`);
    process.exit(1);
  }

  const missing = verifyPrerendered(ROUTES);
  if (missing.length > 0) {
    derr(`VERIFICATION FAILED: ${missing.length} route(s) missing index.html:`);
    for (const r of missing) derr(`  - ${r}`);
    process.exit(1);
  }

  dlog(`VERIFIED ${ok} routes`);
  dlog(`done. ${ok} ok, ${fail} failed. total=${((Date.now() - T0) / 1000).toFixed(1)}s`);
}

prerender().catch((e) => {
  derr(`fatal: ${e?.stack || e}`);
  process.exit(1);
});
