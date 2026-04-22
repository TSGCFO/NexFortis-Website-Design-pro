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

// Routes that are intentionally allowed to keep a noindex robots meta in their
// prerendered output. Empty by default — the build fails if any rendered page
// still has noindex. Add a route here only if you intentionally want it
// de-indexed.
const NOINDEX_ALLOWLIST = new Set([]);

const EXCLUDED_PATTERNS = [
  /^\/admin/,
  // Belt-and-braces: any future /portal/* subroute (e.g. /portal/settings)
  // would otherwise escape into the prerender queue since only /portal is
  // in EXCLUDED_ROUTES above. Authenticated portal pages must never be
  // prerendered or indexed.
  /^\/portal/,
  /\/:/,
];

function isExcluded(route) {
  if (EXCLUDED_ROUTES.includes(route)) return true;
  return EXCLUDED_PATTERNS.some((p) => p.test(route));
}

async function discoverStaticRoutes() {
  const appTsxRaw = await fs.readFile(path.join(__dirname, "src", "App.tsx"), "utf-8");
  // Strip JSX block comments ({/* ... */}) and line comments (// ...) before
  // scanning for <Route path="..."> literals. Otherwise a cautionary comment
  // that mentions `path="*"` as a counter-example gets matched as a real
  // route, which then fails puppeteer navigation and kills the whole build.
  // (We only strip for route extraction; the actual TSX file on disk is
  // unchanged. The substitution preserves line counts to keep any future
  // regex-based diagnostics readable.)
  const appTsx = appTsxRaw
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, (m) => " ".repeat(m.length));
  const matches = [...appTsx.matchAll(/<Route\s+path="([^"]+)"/g)];
  const routes = [];
  for (const m of matches) {
    const route = m[1];
    if (!route.startsWith("/")) {
      // Defense-in-depth: a literal that doesn't start with "/" is not a
      // valid wouter static route. Skip silently rather than feed an
      // invalid URL to puppeteer (which crashes the whole browser session).
      continue;
    }
    if (isExcluded(route)) continue;
    routes.push(route);
  }
  if (!routes.includes("/")) routes.unshift("/");
  return [...new Set(routes)];
}

async function loadDynamicRoutes() {
  const routes = [];

  // products.json drives /service/* and /category/* routes. A missing or
  // unparseable file would silently publish a site with zero service and
  // category pages prerendered — fail the build instead so the issue is
  // visible in the Render build log and the previous deploy stays live.
  const productsPath = path.join(__dirname, "public", "products.json");
  let products;
  try {
    products = JSON.parse(await fs.readFile(productsPath, "utf-8"));
  } catch (e) {
    throw new Error(
      `[prerender] required file ${productsPath} missing or invalid (${e.message}). ` +
        `This file drives /service/* and /category/* routes — aborting build.`,
    );
  }
  const serviceList = products.services || [];
  if (!Array.isArray(serviceList) || serviceList.length === 0) {
    throw new Error(
      `[prerender] ${productsPath} contains no services — at least one service is required, aborting build.`,
    );
  }
  const cats = new Set();
  let serviceRoutesAdded = 0;
  for (const s of serviceList) {
    if (s.slug) {
      routes.push(`/service/${s.slug}`);
      serviceRoutesAdded++;
    }
    if (s.category_slug) cats.add(s.category_slug);
  }
  if (serviceRoutesAdded === 0) {
    throw new Error(
      `[prerender] no services with a .slug field in ${productsPath} — aborting build.`,
    );
  }
  for (const slug of cats) routes.push(`/category/${slug}`);

  // landingPages.ts drives /landing/* routes. A missing file or a TypeScript
  // refactor that changes the slug literal syntax would silently yield zero
  // landing pages — fail the build on that condition too.
  const landingPath = path.join(__dirname, "src", "data", "landingPages.ts");
  let landingTs;
  try {
    landingTs = await fs.readFile(landingPath, "utf-8");
  } catch (e) {
    throw new Error(
      `[prerender] required file ${landingPath} missing (${e.message}). ` +
        `This file drives /landing/* routes — aborting build.`,
    );
  }
  const slugs = [...landingTs.matchAll(/^\s*slug:\s*"([^"]+)"/gm)].map((m) => m[1]);
  if (slugs.length === 0) {
    throw new Error(
      `[prerender] matched zero landing-page slugs in ${landingPath} — ` +
        `either the file is empty or the slug literal syntax changed. Aborting build.`,
    );
  }
  for (const slug of slugs) routes.push(`/landing/${slug}`);

  return routes;
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
  const dynamicRoutes = await loadDynamicRoutes();
  const ROUTES = [...new Set([...staticRoutes, ...dynamicRoutes])];

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
        // CRITICAL: react-helmet-async injects <head> tags via a useEffect
        // that runs after React commit. On slow CI runners networkidle0 can
        // fire BEFORE helmet has flushed, leaving only the shell's noindex
        // robots meta in the serialized HTML — which then fails validation
        // for every route. Wait for an unambiguous signal that helmet has
        // flushed: a <meta name="description"> tag in head. The shell has
        // no description meta, so its presence proves the SEO component
        // committed. (We can't use a robots-content check here because
        // some qb-portal routes are intentionally noIndex.)
        // NOTE: helmet-async v3 does NOT add data-rh="true" to client-side
        // DOM tags (only to SSR strings), so we check tag presence directly.
        try {
          await page.waitForFunction(
            () => !!document.head.querySelector('meta[name="description"]'),
            { timeout: 15000 },
          );
        } catch {
          throw new Error(
            "SEO component never flushed a description meta within 15s — helmet may not be wrapped around this route or React failed to commit",
          );
        }
        await new Promise((r) => setTimeout(r, 250));
        const html = await page.content();
        // react-helmet-async sets document.title via DOM mutation; capture
        // the live document.title and inject it back into the serialized HTML.
        const liveTitle = await page.evaluate(() => document.title);
        const cleaned = dedupeSeoTags(
          replaceTitleTag(html, liveTitle)
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
        // without a trailing slash. e.g. `/catalog` -> `dist/catalog.html`.
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
  // Write two copies of the noindex shell:
  //   - 200.html: Render's SPA fallback for unknown URLs (keeps existing behavior)
  //   - spa-shell.html: explicit target for intentional SPA-only rewrites
  //     (e.g. /admin, /blog/admin). These routes are NOT prerendered, so
  //     rewriting them to /index.html would serve the fully prerendered
  //     homepage (with index,follow robots + homepage canonical) and Google
  //     would see them as duplicates of /. Rewriting them to
  //     /spa-shell.html serves the bare noindex shell instead, which
  //     Google correctly skips.
  const fallbackPath = path.join(distDir, "200.html");
  await fs.writeFile(fallbackPath, shellHtml, "utf-8");
  console.log(`[prerender] wrote noindex SPA fallback -> 200.html`);
  const spaShellPath = path.join(distDir, "spa-shell.html");
  await fs.writeFile(spaShellPath, shellHtml, "utf-8");
  console.log(`[prerender] wrote noindex SPA shell -> spa-shell.html`);

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
