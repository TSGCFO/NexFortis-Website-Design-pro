import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [react()],
        test: {
          name: "nexfortis-components",
          include: ["tests/seo/components/nexfortis/*.test.tsx"],
          environment: "jsdom",
          globals: false,
          setupFiles: ["./tests/seo/vitest.setup.ts"],
        },
        resolve: {
          alias: {
            "@": path.resolve(import.meta.dirname, "artifacts/nexfortis/src"),
            "@assets": path.resolve(import.meta.dirname, "attached_assets"),
          },
          dedupe: ["react", "react-dom"],
        },
      },
      {
        plugins: [react()],
        test: {
          name: "qb-portal-components",
          include: ["tests/seo/components/qb-portal/*.test.tsx"],
          environment: "jsdom",
          globals: false,
          setupFiles: ["./tests/seo/vitest.setup.ts"],
        },
        resolve: {
          alias: {
            "@": path.resolve(import.meta.dirname, "artifacts/qb-portal/src"),
            "@assets": path.resolve(import.meta.dirname, "attached_assets"),
          },
          dedupe: ["react", "react-dom"],
        },
      },
    ],
  },
});
