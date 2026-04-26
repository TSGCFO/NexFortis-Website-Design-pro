import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["tests/seo/components.test.tsx"],
    environment: "jsdom",
    globals: false,
    setupFiles: ["./tests/seo/vitest.setup.ts"],
    reporters: ["default"],
  },
  resolve: {
    alias: {
      // Match the marketing & portal vite configs so component tests can
      // import from "@/components/..." just like the apps do.
      "@nx": path.resolve(__dirname, "artifacts/nexfortis/src"),
      "@qb": path.resolve(__dirname, "artifacts/qb-portal/src"),
    },
  },
});
