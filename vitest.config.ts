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
      // Expose the marketing and portal app source roots so component tests can
      // import them as @nx/* and @qb/*. The two apps each have their own "@"
      // alias scoped to their own src/, so we use distinct prefixes here to
      // avoid colliding when a single test file imports from both apps.
      "@nx": path.resolve(import.meta.dirname, "artifacts/nexfortis/src"),
      "@qb": path.resolve(import.meta.dirname, "artifacts/qb-portal/src"),
    },
  },
});
