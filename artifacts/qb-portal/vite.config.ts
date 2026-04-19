import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { createRequire } from "module";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { stableHmr } from "../../lib/vite-plugin-stable-hmr";
// SEO tag dedupe + key list lives in ../../lib/seo-dedupe so both artifacts
// (nexfortis + qb-portal) share identical behavior; see that file for details.
import { dedupeSeoTags } from "../../lib/seo-dedupe";

// vite-plugin-prerender ships a .mjs that uses require() which conflicts
// with the top-level `await` in this ESM Vite config. Load the CJS build
// explicitly so Node treats it as CommonJS.
const require = createRequire(import.meta.url);
const vitePrerender = require("vite-plugin-prerender") as typeof import("vite-plugin-prerender").default & {
  PuppeteerRenderer: new (opts: Record<string, unknown>) => unknown;
};

const PORTAL_LANDING_SLUGS = [
  "enterprise-to-premier-conversion",
  "audit-trail-removal",
  "super-condense",
  "file-repair",
  "accountedge-to-quickbooks",
  "sage-50-to-quickbooks",
  "multi-currency-removal",
  "list-reduction",
  "qbo-readiness",
  "quickbooks-file-too-large",
  "quickbooks-running-slow",
  "quickbooks-company-file-error",
  "quickbooks-multi-currency-problems",
  "etech-alternative",
  "quickbooks-conversion-canada",
  "affordable-enterprise-conversion",
  "how-conversion-works",
  "is-it-safe",
  "quickbooks-desktop-end-of-life",
  "quickbooks-support-subscription",
];

// NOTE: The prompt brief listed 7 hypothetical category slugs
// (conversion-services, data-optimization, etc.), but the live product
// catalog (`public/products.json`) and the sitemap actually use these 5
// real category slugs. Prerendering nonexistent slugs would just produce
// "Category not found" placeholders, so we use the real ones.
const PORTAL_CATEGORY_SLUGS = [
  "quickbooks-conversion",
  "quickbooks-data-services",
  "platform-migrations",
  "expert-support",
  "volume-packs",
];

const PORTAL_SERVICE_SLUGS = [
  "enterprise-to-premier-standard",
  "enterprise-to-premier-complex",
  "guaranteed-30-minute",
  "file-health-check",
  "rush-delivery",
  "extended-support",
  "audit-trail-removal",
  "super-condense",
  "list-reduction",
  "multi-currency-removal",
  "qbo-readiness-report",
  "cra-period-copy",
  "audit-trail-cra-bundle",
  "accountedge-to-quickbooks",
  "sage50-to-quickbooks",
  "expert-support-essentials",
  "expert-support-professional",
  "expert-support-premium",
  "5-pack-conversions",
  "10-pack-conversions",
];

const PORTAL_PRERENDER_ROUTES = [
  "/",
  "/catalog",
  "/faq",
  "/qbm-guide",
  "/subscription",
  "/terms",
  "/privacy",
  "/waitlist",
  ...PORTAL_LANDING_SLUGS.map((s) => `/landing/${s}`),
  ...PORTAL_CATEGORY_SLUGS.map((s) => `/category/${s}`),
  ...PORTAL_SERVICE_SLUGS.map((s) => `/service/${s}`),
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
            routes: PORTAL_PRERENDER_ROUTES,
            renderer: new vitePrerender.PuppeteerRenderer({
              // Several pages (catalog, category, service-detail) need to
              // wait for an async fetch of /products.json plus a network
              // failure on /api/qb/site-settings/promo-status (no API at
              // build time). 4000ms gives helmet + React time to settle.
              renderAfterTime: 4000,
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
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
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
