import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { dedupeSeoTags } from "../../lib/seo-dedupe.mjs";
import { createStaticServer, validatePrerenderedHtml, replaceTitleTag } from "../../lib/prerender-utils.mjs";
import { execSync } from "node:child_process";

function findChromium() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  for (const bin of ["chromium", "chromium-browser", "google-chrome", "google-chrome-stable"]) {
    try {
      const p = execSync(`which ${bin}`, { encoding: "utf-8" }).trim();
      if (p) return p;
    } catch {}
  }
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
  const appTsx = await fs.readFile(path.join(__dirname, "src", "App.tsx"), "utf-8");
  const matches = [...appTsx.matchAll(/<Route\s+path="([^"]+)"/g)];
  const routes = [];
  for (const m of matches) {
    const route = m[1];
    if (isExcluded(route)) continue;
    routes.push(route);
  }
  if (!routes.includes("/")) routes.unshift("/");
  return [...new Set(routes)];
}

async function discoverBlogRoutes() {
  const apiUrl = process.env.BLOG_API || process.env.SITEMAP_BLOG_API || "https://nexfortis-api.onrender.com/api";
  const fallbackPath = path.join(__dirname, "scripts", "blog-fallback.json");
  let posts = null;
  try {
    const res = await fetch(`${apiUrl}/blog/posts`, { signal: AbortSignal.timeout(15000) });
    if (res.ok) {
      const live = await res.json();
      if (Array.isArray(live) && live.length > 0) {
        posts = live.filter((p) => p.published !== false);
        console.log(`[prerender] fetched ${posts.length} live blog posts from ${apiUrl}`);
      }
    } else {
      console.warn(`[prerender] blog API returned HTTP ${res.status}; falling back`);
    }
  } catch (e) {
    console.warn(`[prerender] blog API fetch failed (${e.message}); using checked-in fallback`);
  }
  if (!posts) {
    try {
      posts = JSON.parse(await fs.readFile(fallbackPath, "utf-8"));
      console.log(`[prerender] using ${posts.length} blog posts from fallback file`);
    } catch (e) {
      console.error(`[prerender] FATAL: could not load blog-fallback.json: ${e.message}`);
      process.exit(1);
    }
  }
  const SAFE_SLUG = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
  const routes = [];
  const postsBySlug = new Map();
  for (const p of posts) {
    if (!p.slug || typeof p.slug !== "string") {
      console.warn(`[prerender] skipping blog post with missing slug`);
      continue;
    }
    if (!SAFE_SLUG.test(p.slug)) {
      console.error(`[prerender] FATAL: blog slug "${p.slug}" contains unsafe characters`);
      process.exit(1);
    }
    routes.push(`/blog/${p.slug}`);
    // Only keep full post objects (those with content) — fallback file is
    // slug-only and won't drive request interception.
    if (p.content && p.title) postsBySlug.set(p.slug, p);
  }
  const unique = [...new Set(routes)];
  if (unique.length !== routes.length) {
    console.warn(`[prerender] removed ${routes.length - unique.length} duplicate blog slug(s)`);
  }
  console.log(`[prerender] ${unique.length} valid blog routes (${postsBySlug.size} with full content for interception)`);
  if (postsBySlug.size === 0) {
    console.error(`[prerender] FATAL: no blog posts have full content. Without the live API,`);
    console.error(`[prerender] blog post pages cannot be prerendered correctly. Check that`);
    console.error(`[prerender] ${apiUrl}/blog/posts is reachable from the build environment,`);
    console.error(`[prerender] or set BLOG_API env var to a reachable URL.`);
    process.exit(1);
  }
  return { routes: unique, postsBySlug };
}

function startServer() {
  return new Promise((resolve, reject) => {
    const server = createStaticServer({ distDir, base });
    server.on("error", (err) => reject(err));
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

function verifyPrerendered(routes) {
  const missing = [];
  for (const route of routes) {
    const dir = path.join(distDir, route === "/" ? "" : route);
    const file = path.join(dir, "index.html");
    if (!existsSync(file)) {
      missing.push(route);
    }
  }
  return missing;
}

async function prerender() {
  if (!existsSync(distDir)) {
    console.error(`[prerender] dist not found: ${distDir}`);
    process.exit(1);
  }

  const staticRoutes = await discoverStaticRoutes();
  const { routes: blogRoutes, postsBySlug } = await discoverBlogRoutes();
  const ROUTES = [...new Set([...staticRoutes, ...blogRoutes])];

  console.log(`[prerender] discovered ${ROUTES.length} routes (${staticRoutes.length} static + ${blogRoutes.length} blog)`);
  console.log(`[prerender] static routes: ${staticRoutes.join(", ")}`);
  console.log(`[prerender] blog routes: ${blogRoutes.join(", ")}`);

  const server = await startServer();
  const chromePath = findChromium();
  if (chromePath) console.log(`[prerender] using Chrome at ${chromePath}`);
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
  const baseUrl = `http://127.0.0.1:${port}${base.slice(0, -1)}`;
  console.log(`[prerender] serving ${distDir} at ${baseUrl}/`);

  const shellPath = path.join(distDir, "index.html");
  const shellHtml = await fs.readFile(shellPath, "utf-8");

  let ok = 0;
  let fail = 0;
  try {
    for (const route of ROUTES) {
      const url = baseUrl + route;
      const page = await browser.newPage();
      await page.setUserAgent("ReactSnap/Prerender Mozilla/5.0");

      // For blog post routes, intercept the client-side /api/blog/posts/<slug>
      // fetch and serve the prefetched post body. Without this, the React app
      // calls the local static server, gets 404, and renders the "Article Not
      // Found" branch — producing identical empty pages for every post.
      const blogSlugMatch = route.match(/^\/blog\/([a-z0-9][a-z0-9-]*[a-z0-9])$/);
      const isBlogPost = blogSlugMatch && postsBySlug.has(blogSlugMatch[1]);
      if (isBlogPost) {
        const post = postsBySlug.get(blogSlugMatch[1]);
        await page.setRequestInterception(true);
        page.on("request", (req) => {
          const reqUrl = req.url();
          // Match the slug-specific endpoint (apiFetch builds /api/blog/posts/<slug>)
          if (reqUrl.endsWith(`/api/blog/posts/${post.slug}`)) {
            req.respond({
              status: 200,
              contentType: "application/json",
              headers: { "access-control-allow-origin": "*" },
              body: JSON.stringify(post),
            });
            return;
          }
          // Match the list endpoint (used by /blog index)
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
        await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
        // For blog posts, wait for the rendered article heading to confirm
        // the React app committed the post content (not the loading spinner
        // and not the "Article Not Found" branch).
        if (isBlogPost) {
          try {
            await page.waitForFunction(
              () => !!document.querySelector("article h2, article h3, article p"),
              { timeout: 10000 },
            );
          } catch {
            console.warn(`[prerender] ⚠ ${route}: article content not detected within 10s; snapshot may be incomplete`);
          }
        }
        await new Promise((r) => setTimeout(r, 250));
        const html = await page.content();
        // react-helmet-async sets document.title via DOM mutation; capture
        // the live document.title and inject it back into the serialized HTML
        // so per-page <title> tags survive into the prerendered output.
        const liveTitle = await page.evaluate(() => document.title);
        const cleaned = dedupeSeoTags(
          replaceTitleTag(html, liveTitle)
            .replace(/<script[^>]*replit-dev-banner[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<script[^>]*cartographer[^>]*>[\s\S]*?<\/script>/gi, ""),
        );
        // Sanity check: blog posts must NOT contain "Article Not Found".
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
        // Also write a flat `.html` mirror so static hosts that don't
        // auto-serve directory indexes (e.g. Render) handle clean URLs
        // without a trailing slash. e.g. `/about` -> `dist/about.html`.
        if (route !== "/") {
          const mirrorPath = path.join(distDir, route.replace(/^\//, "") + ".html");
          await fs.mkdir(path.dirname(mirrorPath), { recursive: true });
          await fs.writeFile(mirrorPath, cleaned, "utf-8");
        }
        console.log(`[prerender] ✓ ${route} -> ${path.relative(distDir, outFile)}`);
        ok++;
      } catch (err) {
        console.error(`[prerender] ✗ ${route}:`, err.message);
        fail++;
      } finally {
        await page.close();
      }
    }
  } finally {
    try { await browser.close(); } catch (e) { console.warn("[prerender] browser.close failed:", e.message); }
    try { server.close(); } catch (e) { console.warn("[prerender] server.close failed:", e.message); }
  }
  const fallbackPath = path.join(distDir, "200.html");
  await fs.writeFile(fallbackPath, shellHtml, "utf-8");
  console.log(`[prerender] wrote noindex SPA fallback -> 200.html`);

  if (fail > 0) {
    console.error(`[prerender] FAILED: ${fail} route(s) could not be prerendered.`);
    process.exit(1);
  }

  const missing = verifyPrerendered(ROUTES);
  if (missing.length > 0) {
    console.error(`[prerender] VERIFICATION FAILED — the following ${missing.length} route(s) have no index.html on disk:`);
    for (const r of missing) console.error(`  - ${r}`);
    process.exit(1);
  }

  console.log(`[prerender] VERIFIED: all ${ok} routes have index.html on disk.`);
  console.log(`[prerender] done. ${ok} ok, ${fail} failed.`);
}

prerender().catch((e) => {
  console.error("[prerender] fatal:", e);
  process.exit(1);
});
