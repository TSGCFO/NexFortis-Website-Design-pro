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
  let source = "fallback";
  try {
    const res = await fetch(`${apiUrl}/blog/posts`, { signal: AbortSignal.timeout(15000) });
    if (res.ok) {
      const live = await res.json();
      if (Array.isArray(live) && live.length > 0) {
        posts = live.filter((p) => p.published !== false);
        source = "live";
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
  // When the live API succeeds AND posts include content, refresh the
  // checked-in fallback file so future builds can survive an API outage
  // with the same content. Best-effort: ignore write errors.
  if (source === "live" && posts.some((p) => p.content)) {
    try {
      const minimal = posts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        category: p.category,
        coverImage: p.coverImage,
        published: p.published,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));
      await fs.writeFile(fallbackPath, JSON.stringify(minimal, null, 2) + "\n", "utf-8");
      console.log(`[prerender] refreshed blog-fallback.json with ${minimal.length} live post bodies`);
    } catch (e) {
      console.warn(`[prerender] could not refresh fallback file (${e.message}); continuing`);
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
    // Only keep full post objects (those with content) — required to drive
    // request interception. Posts without content fall back to the SPA shell
    // (less ideal but doesn't break the build).
    if (p.content && p.title) postsBySlug.set(p.slug, p);
  }
  const unique = [...new Set(routes)];
  if (unique.length !== routes.length) {
    console.warn(`[prerender] removed ${routes.length - unique.length} duplicate blog slug(s)`);
  }
  console.log(`[prerender] ${unique.length} valid blog routes (${postsBySlug.size} with full content for interception)`);
  if (postsBySlug.size === 0) {
    // Soft-warn instead of hard-exit. The build still succeeds; affected blog
    // post pages will render as the SPA shell with whatever client-side
    // fetches resolve to (usually 404 → "Article Not Found"). This is a
    // degraded state but keeps deploys unblocked when the API is unreachable
    // from the build environment.
    console.warn(`[prerender] WARNING: no blog posts have full content; blog post pages will`);
    console.warn(`[prerender] prerender as the SPA shell. Check that ${apiUrl}/blog/posts`);
    console.warn(`[prerender] is reachable from the build environment, or update`);
    console.warn(`[prerender] artifacts/nexfortis/scripts/blog-fallback.json with full bodies.`);
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

      // Intercept client-side blog API calls on EVERY page (not just blog
      // post routes). The /blog index page calls /api/blog/posts, the nav
      // may prefetch, and the blog-post page calls /api/blog/posts/<slug>.
      // When VITE_API_BASE_URL points at a remote origin, apiFetch uses
      // credentials: "include" + Content-Type: application/json which
      // triggers a CORS OPTIONS preflight. The remote API's allowlist does
      // not include 127.0.0.1:4173 (the local static server origin used by
      // the prerender), so the preflight fails, the GET is blocked by
      // Chromium, and the React app renders "Article Not Found". We answer
      // BOTH the OPTIONS preflight and the GET locally so no request ever
      // leaves the build container.
      const blogSlugMatch = route.match(/^\/blog\/([a-z0-9][a-z0-9-]*[a-z0-9])$/);
      const isBlogPost = blogSlugMatch && postsBySlug.has(blogSlugMatch[1]);
      // Build CORS response headers. When the request is credentialed
      // (apiFetch sets credentials: "include"), the browser rejects
      // Access-Control-Allow-Origin: "*" and also requires the
      // Allow-Credentials header. Echo the request's Origin header back so
      // credentialed requests are accepted regardless of whether the
      // VITE_API_BASE_URL is same-origin (127.0.0.1:4173) or cross-origin
      // (nexfortis-api.onrender.com).
      const buildCorsHeaders = (req) => {
        const reqHeaders = req.headers();
        const origin = reqHeaders["origin"] || "*";
        const acrh = reqHeaders["access-control-request-headers"] || "Content-Type, Authorization, X-Upload-Token";
        return {
          "access-control-allow-origin": origin,
          "access-control-allow-methods": "GET, POST, OPTIONS",
          "access-control-allow-headers": acrh,
          "access-control-allow-credentials": "true",
          "access-control-max-age": "600",
          "vary": "Origin",
        };
      };
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        const reqUrl = req.url();
        const method = req.method();
        // Handle CORS preflight for any /api/blog/posts or /api/blog/posts/<slug>
        if (method === "OPTIONS" && /\/api\/blog\/posts(?:\/[a-z0-9][a-z0-9-]*[a-z0-9])?$/.test(reqUrl)) {
          req.respond({ status: 204, headers: buildCorsHeaders(req) });
          return;
        }
        // Match the slug-specific endpoint (apiFetch builds /api/blog/posts/<slug>)
        const slugMatch = reqUrl.match(/\/api\/blog\/posts\/([a-z0-9][a-z0-9-]*[a-z0-9])$/);
        if (slugMatch && postsBySlug.has(slugMatch[1])) {
          req.respond({
            status: 200,
            contentType: "application/json",
            headers: buildCorsHeaders(req),
            body: JSON.stringify(postsBySlug.get(slugMatch[1])),
          });
          return;
        }
        // Match the list endpoint (used by /blog index and any prefetch)
        if (/\/api\/blog\/posts$/.test(reqUrl)) {
          req.respond({
            status: 200,
            contentType: "application/json",
            headers: buildCorsHeaders(req),
            body: JSON.stringify([...postsBySlug.values()]),
          });
          return;
        }
        req.continue();
      });

      try {
        await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
        // CRITICAL: react-helmet-async injects <head> tags via a useEffect
        // that runs after React commit. On slow CI runners networkidle0 can
        // fire BEFORE helmet has flushed, leaving only the shell's noindex
        // robots meta in the serialized HTML — which then fails the noindex
        // validation for every route. Wait for an unambiguous signal that
        // helmet has flushed: a robots meta whose content contains "index"
        // but not "noindex" (i.e. the SEO component's index,follow override
        // has landed). The shell only has noindex, so the presence of an
        // index,follow tag proves helmet committed.
        // NOTE: helmet-async v3 does NOT add data-rh="true" to client-side
        // DOM tags (only to SSR-rendered string output), so we check the
        // robots content directly instead of looking for that attribute.
        try {
          await page.waitForFunction(
            () => {
              const tags = document.querySelectorAll('meta[name="robots"]');
              for (const t of tags) {
                const c = (t.getAttribute("content") || "").toLowerCase();
                if (c.includes("index") && !c.includes("noindex")) return true;
              }
              return false;
            },
            { timeout: 15000 },
          );
        } catch {
          throw new Error(
            "SEO component never flushed an index,follow robots meta within 15s — helmet may not be wrapped around this route or React failed to commit",
          );
        }
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
