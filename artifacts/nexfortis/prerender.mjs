import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { dedupeSeoTags } from "../../lib/seo-dedupe.mjs";
import { createStaticServer, validatePrerenderedHtml } from "../../lib/prerender-utils.mjs";
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

// Replace the text inside the (first) <title>...</title> of an HTML document
// with `title`. Preserves any attributes on the title tag. If no <title> tag
// exists inside <head>, we inject a new one right after <head>.
function rewriteDocumentTitle(html, title) {
  if (!title || typeof title !== "string") return html;
  // Escape the replacement text to avoid breaking HTML (&, <, >).
  const safe = title
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const titleRe = /(<title\b[^>]*>)[\s\S]*?(<\/title>)/i;
  if (titleRe.test(html)) {
    return html.replace(titleRe, (_m, open, close) => `${open}${safe}${close}`);
  }
  const headOpen = html.match(/<head\b[^>]*>/i);
  if (headOpen) {
    const idx = headOpen.index + headOpen[0].length;
    return html.slice(0, idx) + `<title>${safe}</title>` + html.slice(idx);
  }
  return html;
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

// Load blog posts at build time. We need the FULL post objects (not just
// slugs) so the in-process static server can serve `/api/blog/posts/:slug`
// responses to the page at prerender time — without this, the page's
// `apiFetch("/blog/posts/:slug")` call 404s and the component renders its
// "Article Not Found" error state, making every prerendered blog post
// identical to the SPA shell.
async function loadBlogPosts() {
  const apiUrl = process.env.BLOG_API || process.env.SITEMAP_BLOG_API || "https://nexfortis-api.onrender.com/api";
  const fallbackPath = path.join(__dirname, "scripts", "blog-fallback.json");
  let posts = null;
  try {
    const res = await fetch(`${apiUrl}/blog/posts`, { signal: AbortSignal.timeout(10000) });
    if (res.ok) {
      const live = await res.json();
      if (Array.isArray(live) && live.length > 0) {
        posts = live.filter((p) => p.published !== false);
        console.log(`[prerender] fetched ${posts.length} live blog posts from ${apiUrl}`);
      }
    } else {
      console.warn(`[prerender] blog API ${apiUrl}/blog/posts returned HTTP ${res.status}`);
    }
  } catch (e) {
    console.warn(`[prerender] blog API fetch failed (${e.message})`);
  }
  if (!posts) {
    // Fallback JSON only carries slugs — it's sufficient for sitemap entries
    // but NOT for in-page rendering (title/excerpt/content missing). We
    // therefore treat a missing live API as a fatal error unless the
    // operator explicitly opts in via `ALLOW_BLOG_STUB=1` for the rare case
    // of building when the API is intentionally unavailable.
    if (process.env.ALLOW_BLOG_STUB === "1") {
      try {
        const stub = JSON.parse(await fs.readFile(fallbackPath, "utf-8"));
        posts = stub.map((p) => ({
          id: 0,
          title: p.title || p.slug,
          slug: p.slug,
          excerpt: p.excerpt || "",
          content: p.content || "",
          category: p.category || "",
          coverImage: null,
          published: true,
          createdAt: p.updatedAt || new Date().toISOString(),
          updatedAt: p.updatedAt || new Date().toISOString(),
        }));
        console.log(`[prerender] ALLOW_BLOG_STUB=1 — using ${posts.length} stub posts from fallback file`);
      } catch (e) {
        console.error(`[prerender] FATAL: could not load blog-fallback.json: ${e.message}`);
        process.exit(1);
      }
    } else {
      console.error(`[prerender] FATAL: could not fetch live blog posts from ${apiUrl}/blog/posts.`);
      console.error(`[prerender] This would produce prerendered blog pages with no content and duplicate metadata.`);
      console.error(`[prerender] Set ALLOW_BLOG_STUB=1 only if you knowingly accept empty blog posts.`);
      process.exit(1);
    }
  }
  // Validate every slug and deduplicate.
  const SAFE_SLUG = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
  const seen = new Set();
  const valid = [];
  for (const p of posts) {
    if (!p.slug || typeof p.slug !== "string") {
      console.warn(`[prerender] skipping blog post with missing slug`);
      continue;
    }
    if (!SAFE_SLUG.test(p.slug)) {
      console.error(`[prerender] FATAL: blog slug "${p.slug}" contains unsafe characters`);
      process.exit(1);
    }
    if (seen.has(p.slug)) {
      console.warn(`[prerender] removing duplicate slug "${p.slug}"`);
      continue;
    }
    seen.add(p.slug);
    valid.push(p);
  }
  console.log(`[prerender] ${valid.length} valid blog posts`);
  return valid;
}

// Build the list of in-memory API routes that Puppeteer's page will hit via
// same-origin /api/* calls. Each entry matches a URL and writes a JSON
// response. We only serve the GET endpoints the blog pages actually call.
function buildApiRoutes(posts) {
  const postBySlug = new Map(posts.map((p) => [p.slug, p]));
  const listJson = JSON.stringify(posts);
  const writeJson = (res, status, body) => {
    res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
    res.end(body);
  };
  return [
    // GET /api/blog/posts — list (published only)
    [/^\/api\/blog\/posts\/?(?:\?.*)?$/, (_req, res) => writeJson(res, 200, listJson)],
    // GET /api/blog/posts/:slug — single post
    [/^\/api\/blog\/posts\/([a-z0-9][a-z0-9-]*[a-z0-9])\/?(?:\?.*)?$/, (_req, res, m) => {
      const slug = m[1];
      const post = postBySlug.get(slug);
      if (!post) {
        writeJson(res, 404, JSON.stringify({ error: "Not found" }));
        return;
      }
      writeJson(res, 200, JSON.stringify(post));
    }],
    // Any other /api/* call during prerender is a bug — fail loudly with a
    // structured JSON error so the page surfaces it and the prerender
    // validator can catch it.
    [/^\/api\//, (req, res) => {
      console.warn(`[prerender] unexpected /api call during prerender: ${req.url}`);
      writeJson(res, 501, JSON.stringify({ error: `prerender stub: ${req.url}` }));
    }],
  ];
}

function startServer(apiRoutes) {
  return new Promise((resolve, reject) => {
    const server = createStaticServer({ distDir, base, apiRoutes });
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
  const blogPosts = await loadBlogPosts();
  const blogRoutes = blogPosts.map((p) => `/blog/${p.slug}`);
  const ROUTES = [...new Set([...staticRoutes, ...blogRoutes])];

  console.log(`[prerender] discovered ${ROUTES.length} routes (${staticRoutes.length} static + ${blogRoutes.length} blog)`);
  console.log(`[prerender] static routes: ${staticRoutes.join(", ")}`);
  console.log(`[prerender] blog routes: ${blogRoutes.join(", ")}`);

  const apiRoutes = buildApiRoutes(blogPosts);
  const server = await startServer(apiRoutes);
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
      try {
        await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
        await new Promise((r) => setTimeout(r, 250));
        // Capture the document.title AFTER the React app + Helmet have run.
        // react-helmet-async mutates document.title directly rather than
        // emitting a new <title> tag into the head, so page.content() can
        // serialize HTML where the text content of <title> is stale. We read
        // it out of the live DOM here and then patch the serialized HTML.
        const liveTitle = await page.title();
        const rawHtml = await page.content();
        const titlePatched = rewriteDocumentTitle(rawHtml, liveTitle);
        const cleaned = dedupeSeoTags(
          titlePatched
            .replace(/<script[^>]*replit-dev-banner[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<script[^>]*cartographer[^>]*>[\s\S]*?<\/script>/gi, ""),
        );
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

  // Final validation: every prerendered route must differ from the SPA
  // shell (200.html) AND have a non-default <title>. This catches the
  // silent-failure mode where Puppeteer serializes the loading/error state
  // and all blog posts end up byte-identical to the shell with the default
  // homepage title.
  const crypto = await import("node:crypto");
  const shellHash = crypto.createHash("sha256").update(Buffer.from(shellHtml, "utf-8")).digest("hex");

  // The default <title> from the ORIGINAL shell (captured before any route
  // was prerendered) — anything equal to this after prerender means the SEO
  // component never got a chance to set it. We read from `shellHtml` (already
  // in memory), not from dist/public/index.html, because the "/" route
  // overwrites that file with the prerendered homepage.
  const shellTitleMatch = shellHtml.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const defaultTitle = shellTitleMatch ? shellTitleMatch[1].trim() : "";

  const titlesSeen = new Map();
  const integrityErrors = [];
  for (const route of ROUTES) {
    const outFile = path.join(distDir, route === "/" ? "" : route, "index.html");
    const bytes = await fs.readFile(outFile);
    const hash = crypto.createHash("sha256").update(bytes).digest("hex");
    const html = bytes.toString("utf-8");
    const tm = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    const title = tm ? tm[1].trim() : "";

    if (hash === shellHash) {
      integrityErrors.push(`${route}: identical to 200.html shell (prerender silently failed)`);
    }
    if (route !== "/" && title && title === defaultTitle) {
      integrityErrors.push(`${route}: still has default shell <title> "${defaultTitle}" (SEO component did not override it)`);
    }
    if (!title) {
      integrityErrors.push(`${route}: missing <title> tag`);
    }
    if (title) {
      if (!titlesSeen.has(title)) titlesSeen.set(title, []);
      titlesSeen.get(title).push(route);
    }
  }
  // Flag pages that SHARE an identical title with another page — this is
  // almost always a bug (e.g. all blog posts showing the same fallback).
  for (const [title, routes] of titlesSeen) {
    if (routes.length > 1) {
      integrityErrors.push(`duplicate <title> "${title}" across ${routes.length} routes: ${routes.join(", ")}`);
    }
  }
  if (integrityErrors.length > 0) {
    console.error(`[prerender] INTEGRITY FAILED — ${integrityErrors.length} issue(s):`);
    for (const e of integrityErrors) console.error(`  - ${e}`);
    process.exit(1);
  }

  console.log(`[prerender] VERIFIED: all ${ok} routes have unique, non-shell prerendered content.`);
  console.log(`[prerender] done. ${ok} ok, ${fail} failed.`);
}

prerender().catch((e) => {
  console.error("[prerender] fatal:", e);
  process.exit(1);
});
