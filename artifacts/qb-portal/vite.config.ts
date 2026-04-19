import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { stableHmr } from "../../lib/vite-plugin-stable-hmr";
import vitePrerender from "vite-plugin-prerender";

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

const PORTAL_CATEGORY_SLUGS = [
  "conversion-services",
  "data-optimization",
  "data-services",
  "migration-services",
  "add-on-services",
  "support-plans",
  "bundles-multi-packs",
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
              renderAfterTime: 2000,
              headless: true,
              maxConcurrentRoutes: 4,
              args: ["--no-sandbox", "--disable-setuid-sandbox"],
            }),
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
