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
const base = (process.env.BASE_PATH ?? "/qb-portal/").replace(/\/?$/, "/");
const port = Number(process.env.PRERENDER_PORT || 4174);

const EXCLUDED_ROUTES = [
  "/order",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
  "/portal",
  "/ticket/:id",
  "/order/:id",
  "/service/:slug",
  "/category/:slug",
  "/landing/:slug",
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

async function loadDynamicRoutes() {
  const routes = [];
  try {
    const products = JSON.parse(
      await fs.readFile(path.join(__dirname, "public", "products.json"), "utf-8"),
    );
    const cats = new Set();
    for (const s of products.services || []) {
      if (s.slug) routes.push(`/service/${s.slug}`);
      if (s.category_slug) cats.add(s.category_slug);
    }
    for (const slug of cats) routes.push(`/category/${slug}`);
  } catch (e) {
    console.warn(`[prerender] could not load products.json: ${e.message}`);
  }
  try {
    const landingTs = await fs.readFile(
      path.join(__dirname, "src", "data", "landingPages.ts"),
      "utf-8",
    );
    const slugs = [...landingTs.matchAll(/^\s*slug:\s*"([^"]+)"/gm)].map((m) => m[1]);
    for (const slug of slugs) routes.push(`/landing/${slug}`);
  } catch (e) {
    console.warn(`[prerender] could not load landingPages.ts: ${e.message}`);
  }
  return routes;
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
  const dynamicRoutes = await loadDynamicRoutes();
  const ROUTES = [...staticRoutes, ...dynamicRoutes];

  console.log(`[prerender] discovered ${ROUTES.length} routes (${staticRoutes.length} static + ${dynamicRoutes.length} dynamic)`);
  console.log(`[prerender] static routes: ${staticRoutes.join(", ")}`);

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
