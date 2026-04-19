import http from "node:http";
import fs from "node:fs/promises";
import { existsSync, statSync, createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist", "public");
const base = (process.env.BASE_PATH || "/").replace(/\/?$/, "/");
const port = Number(process.env.PRERENDER_PORT || 4173);

const ROUTES = [
  "/",
  "/about",
  "/services",
  "/services/digital-marketing",
  "/services/microsoft-365",
  "/services/quickbooks",
  "/services/it-consulting",
  "/services/workflow-automation",
  "/contact",
  "/blog",
  "/privacy",
  "/terms",
];

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

function dedupeHead(html) {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return html;
  let head = headMatch[1];

  // Find each tag with a key; keep only the LAST occurrence per key (helmet wins over template).
  const collectRe =
    /(<title>[\s\S]*?<\/title>|<meta\b[^>]*\/?>|<link\b[^>]*\/?>)/gi;
  const matches = [];
  let m;
  while ((m = collectRe.exec(head)) !== null) {
    matches.push({ raw: m[0], start: m.index, end: m.index + m[0].length });
  }
  function keyFor(raw) {
    if (/^<title>/i.test(raw)) return "title";
    const tagName = raw.match(/^<(\w+)/i)[1].toLowerCase();
    if (tagName === "meta") {
      const n = raw.match(/\bname=["']([^"']+)["']/i);
      if (n) return `meta:name:${n[1].toLowerCase()}`;
      const p = raw.match(/\bproperty=["']([^"']+)["']/i);
      if (p) return `meta:property:${p[1].toLowerCase()}`;
      const ip = raw.match(/\bitemprop=["']([^"']+)["']/i);
      if (ip) return `meta:itemprop:${ip[1].toLowerCase()}`;
      if (/\bcharset=/i.test(raw)) return "meta:charset";
      const he = raw.match(/http-equiv=["']([^"']+)["']/i);
      if (he) return `meta:http-equiv:${he[1].toLowerCase()}`;
      return null;
    }
    if (tagName === "link") {
      const rel = raw.match(/\brel=["']([^"']+)["']/i);
      if (!rel) return null;
      const r = rel[1].toLowerCase();
      if (r === "canonical") return "link:canonical";
      if (r === "alternate") {
        const hl = raw.match(/\bhreflang=["']([^"']+)["']/i);
        return `link:alternate:${hl ? hl[1].toLowerCase() : "default"}`;
      }
      return null;
    }
    return null;
  }
  // For <title>, helmet places its tag BEFORE the template's, so keep FIRST.
  // For meta/link, helmet appends AFTER the template's, so keep LAST.
  const firstIndexByKey = new Map();
  const lastIndexByKey = new Map();
  matches.forEach((mm, i) => {
    const k = keyFor(mm.raw);
    if (!k) return;
    if (!firstIndexByKey.has(k)) firstIndexByKey.set(k, i);
    lastIndexByKey.set(k, i);
  });
  const removeIdx = new Set();
  matches.forEach((mm, i) => {
    const k = keyFor(mm.raw);
    if (!k) return;
    const keeper = k === "title" ? firstIndexByKey.get(k) : lastIndexByKey.get(k);
    if (keeper !== i) removeIdx.add(i);
  });
  // Rebuild head from end to start so indices remain valid.
  for (let i = matches.length - 1; i >= 0; i--) {
    if (!removeIdx.has(i)) continue;
    const mm = matches[i];
    // Also consume trailing whitespace newline
    let endTrim = mm.end;
    while (endTrim < head.length && /\s/.test(head[endTrim])) endTrim++;
    head = head.slice(0, mm.start) + head.slice(endTrim);
  }
  return html.replace(headMatch[0], `<head>${head}</head>`);
}

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
      // SPA fallback
      const indexPath = path.join(distDir, "index.html");
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      createReadStream(indexPath).pipe(res);
    });
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

async function prerender() {
  if (!existsSync(distDir)) {
    console.error(`[prerender] dist not found: ${distDir}`);
    process.exit(1);
  }
  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
  const baseUrl = `http://127.0.0.1:${port}${base.slice(0, -1)}`;
  console.log(`[prerender] serving ${distDir} at ${baseUrl}/`);

  let ok = 0;
  let fail = 0;
  try {
    for (const route of ROUTES) {
      const url = baseUrl + route;
      const page = await browser.newPage();
      await page.setUserAgent("ReactSnap/Prerender Mozilla/5.0");
      try {
        await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
        // Wait an extra tick for helmet to flush
        await new Promise((r) => setTimeout(r, 250));
        const html = await page.content();
        // Strip server-injected dev banner / cartographer if present, then de-dupe SEO head tags
        const cleaned = dedupeHead(
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
  console.log(`[prerender] done. ${ok} ok, ${fail} failed.`);
  if (fail > 0) process.exit(1);
}

prerender().catch((e) => {
  console.error("[prerender] fatal:", e);
  process.exit(1);
});
