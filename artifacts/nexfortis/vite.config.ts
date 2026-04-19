import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { createRequire } from "module";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { stableHmr } from "../../lib/vite-plugin-stable-hmr";

// vite-plugin-prerender ships a .mjs that uses require() which conflicts
// with the top-level `await` in this ESM Vite config. Load the CJS build
// explicitly so Node treats it as CommonJS.
const require = createRequire(import.meta.url);
const vitePrerender = require("vite-plugin-prerender") as typeof import("vite-plugin-prerender").default & {
  PuppeteerRenderer: new (opts: Record<string, unknown>) => unknown;
};

// Pre-rendered HTML contains both the static SEO tags from index.html (the
// SPA shell, with homepage values) AND the per-page tags injected at runtime
// by react-helmet-async. Crawlers must see exactly one canonical/title/desc/OG
// per page, so we dedupe inside <head>, keeping the LAST occurrence of each
// SEO tag (helmet's per-page version is rendered after the static fallback).
const SEO_DEDUPE_KEYS = new Set([
  "description",
  "robots",
  "canonical",
  "og:title",
  "og:description",
  "og:url",
  "og:image",
  "og:type",
  "og:site_name",
  "og:locale",
  "twitter:card",
  "twitter:title",
  "twitter:description",
  "twitter:image",
]);

function dedupeSeoTags(html: string): string {
  const headStart = html.indexOf("<head");
  if (headStart === -1) return html;
  const headOpenEnd = html.indexOf(">", headStart) + 1;
  const headEnd = html.indexOf("</head>", headOpenEnd);
  if (headOpenEnd <= 0 || headEnd === -1) return html;

  const before = html.slice(0, headOpenEnd);
  const head = html.slice(headOpenEnd, headEnd);
  const after = html.slice(headEnd);

  const tagRe = /<title>[\s\S]*?<\/title>|<(?:link|meta)\b[^>]*\/?>/gi;
  type Match = { key: string; start: number; end: number };
  const matches: Match[] = [];
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(head)) !== null) {
    const tag = m[0];
    let key: string | null = null;
    if (/^<title>/i.test(tag)) {
      key = "__title__";
    } else {
      const attrMatch = tag.match(/\b(name|property|rel)\s*=\s*"([^"]+)"/i);
      if (attrMatch) {
        const attrVal = attrMatch[2].toLowerCase();
        if (SEO_DEDUPE_KEYS.has(attrVal)) key = attrVal;
      }
    }
    if (key) matches.push({ key, start: m.index, end: m.index + tag.length });
  }

  const lastIdxByKey = new Map<string, number>();
  matches.forEach((mt, i) => lastIdxByKey.set(mt.key, i));
  const toRemove = matches
    .filter((mt, i) => lastIdxByKey.get(mt.key) !== i)
    .sort((a, b) => b.start - a.start);

  let newHead = head;
  for (const mt of toRemove) {
    newHead = newHead.slice(0, mt.start) + newHead.slice(mt.end);
  }
  return before + newHead + after;
}

const PRERENDER_ROUTES = [
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

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

export default defineConfig({
  base: basePath,
  plugins: [
    stableHmr(),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
    ...(process.env.NODE_ENV === "production"
      ? [
          vitePrerender({
            staticDir: path.resolve(import.meta.dirname, "dist/public"),
            outputDir: path.resolve(import.meta.dirname, "dist/public"),
            indexPath: path.resolve(
              import.meta.dirname,
              "dist/public/index.html",
            ),
            routes: PRERENDER_ROUTES,
            renderer: new vitePrerender.PuppeteerRenderer({
              renderAfterTime: 2000,
              headless: true,
              maxConcurrentRoutes: 4,
              args: ["--no-sandbox", "--disable-setuid-sandbox"],
              // Allow operators to point at a pre-installed Chromium when
              // Puppeteer's bundled binary is not downloaded (e.g. in CI
              // sandboxes or pnpm workspaces with `onlyBuiltDependencies`).
              ...(process.env.PUPPETEER_EXECUTABLE_PATH
                ? { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH }
                : {}),
            }),
            postProcess(renderedRoute: {
              html: string;
              route: string;
              originalRoute: string;
            }) {
              renderedRoute.html = dedupeSeoTags(renderedRoute.html);
              // If a route triggered a client-side redirect during render,
              // preserve the original route so the file is written at the
              // expected path (otherwise the route is silently dropped).
              if (
                renderedRoute.originalRoute &&
                renderedRoute.route !== renderedRoute.originalRoute
              ) {
                renderedRoute.route = renderedRoute.originalRoute;
              }
              return renderedRoute;
            },
            minify: {
              collapseBooleanAttributes: true,
              collapseWhitespace: true,
              decodeEntities: true,
              removeAttributeQuotes: false,
              minifyCSS: true,
            },
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("@tanstack/react-query")) return "vendor-query";
            if (id.includes("react-helmet-async")) return "vendor-helmet";
            if (id.includes("lucide-react")) return "vendor-icons";
            if (id.includes("react-dom") || id.includes("/react/")) return "vendor-react";
          }
        },
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
