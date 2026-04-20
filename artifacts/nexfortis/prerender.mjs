import http from "node:http";
import fs from "node:fs/promises";
import { existsSync, statSync, createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { dedupeSeoTags } from "../../lib/seo-dedupe.mjs";
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
  const apiUrl = process.env.BLOG_API || process.env.SITEMAP_BLOG_API || "https://api.nexfortis.com";
  const fallbackPath = path.join(__dirname, "scripts", "blog-fallback.json");
  let posts = null;
  try {
    const res = await fetch(`${apiUrl}/blog/posts`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const live = await res.json();
      if (Array.isArray(live) && live.length > 0) {
        posts = live.filter((p) => p.published !== false);
        console.log(`[prerender] fetched ${posts.length} live blog posts from ${apiUrl}`);
      }
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
  }
  const unique = [...new Set(routes)];
  if (unique.length !== routes.length) {
    console.warn(`[prerender] removed ${routes.length - unique.length} duplicate blog slug(s)`);
  }
  console.log(`[prerender] ${unique.length} valid blog routes`);
  return unique;
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let url = decodeURIComponent(req.url.split("?")[0]);
      if (base !== "/" && url.startsWith(base.slice(0, -1))) {
        url = url.slice(base.length - 1);
      }
      if (!url.startsWith("/")) url = "/" + url;
      let filePath = path.join(distDir, url);
      try {
        if (existsSync(filePath) && statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          res.writeHead(200, { "content-type": MIME[ext] || "application/octet-stream" });
          createReadStream(filePath).pipe(res);
          return;
        }
      } catch {}
      const indexPath = path.join(distDir, "index.html");
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      createReadStream(indexPath).pipe(res);
    });
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
  const blogRoutes = await discoverBlogRoutes();
  const ROUTES = [...staticRoutes, ...blogRoutes];

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
      try {
        await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
        await new Promise((r) => setTimeout(r, 250));
        const html = await page.content();
        const cleaned = dedupeSeoTags(
          html
            .replace(/<script[^>]*replit-dev-banner[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<script[^>]*cartographer[^>]*>[\s\S]*?<\/script>/gi, ""),
        );
        const outDir = path.join(distDir, route === "/" ? "" : route);
        await fs.mkdir(outDir, { recursive: true });
        const outFile = path.join(outDir, "index.html");
        await fs.writeFile(outFile, cleaned, "utf-8");
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
    await browser.close();
    server.close();
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
