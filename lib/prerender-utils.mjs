import http from "node:http";
import path from "node:path";
import { existsSync, statSync, createReadStream } from "node:fs";

export function resolveRequestPath({ url, base, distDir }) {
  let decoded;
  try {
    decoded = decodeURIComponent(url.split("?")[0]);
  } catch {
    return { requested: null, insideDist: false, decoded: null };
  }
  let stripped = decoded;
  if (base !== "/" && stripped.startsWith(base.slice(0, -1))) {
    stripped = stripped.slice(base.length - 1);
  }
  if (!stripped.startsWith("/")) stripped = "/" + stripped;
  const requested = path.resolve(distDir, "." + stripped);
  const distRoot = path.resolve(distDir);
  const insideDist =
    requested === distRoot || requested.startsWith(distRoot + path.sep);
  return { requested, insideDist, decoded: stripped };
}

export function validatePrerenderedHtml({ route, html, noindexAllowlist }) {
  if (noindexAllowlist && noindexAllowlist.has(route)) return;
  const noindexContent = detectNoindex(html);
  if (noindexContent !== null) {
    throw new Error(
      `prerendered HTML still has noindex robots meta — SEO component did not render or override the shell's noindex tag (robots="${noindexContent}"). Add this route to NOINDEX_ALLOWLIST only if you intentionally want it de-indexed.`,
    );
  }
}

// Replace EVERY <title>…</title> in an HTML string with the given title.
// react-helmet-async injects its <title> alongside the original index.html
// template <title>, so puppeteer's page.content() serializes both. The
// downstream dedupe step keeps the last <title> (Map insertion order),
// which is usually the generic template title — clobbering the per-page
// title. By replacing ALL <title> tags with the live document.title before
// dedupe, whichever survives carries the right per-page title.
// Call with `await page.evaluate(() => document.title)`.
export function replaceTitleTag(html, newTitle) {
  if (!newTitle || typeof newTitle !== "string") return html;
  const escaped = newTitle
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, `<title>${escaped}</title>`);
}

export function detectNoindex(html) {
  const robotsTags = [
    ...html.matchAll(/<meta\b[^>]*\bname\s*=\s*["']robots["'][^>]*>/gi),
  ];
  for (const t of robotsTags) {
    const c = t[0].match(/\bcontent\s*=\s*["']([^"']+)["']/i);
    const v = (c?.[1] ?? "").toLowerCase();
    if (v.includes("noindex")) {
      return c?.[1] ?? "";
    }
  }
  return null;
}

const DEFAULT_MIME = {
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

export function createStaticServer({ distDir, base, mime = DEFAULT_MIME }) {
  return http.createServer((req, res) => {
    const { requested, insideDist } = resolveRequestPath({
      url: req.url,
      base,
      distDir,
    });
    if (!insideDist || requested === null) {
      res.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
      res.end("Forbidden");
      return;
    }
    try {
      if (existsSync(requested) && statSync(requested).isFile()) {
        const ext = path.extname(requested).toLowerCase();
        res.writeHead(200, {
          "content-type": mime[ext] || "application/octet-stream",
        });
        createReadStream(requested).pipe(res);
        return;
      }
    } catch {}
    const indexPath = path.join(distDir, "index.html");
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    createReadStream(indexPath).pipe(res);
  });
}
