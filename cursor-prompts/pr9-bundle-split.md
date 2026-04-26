# Cursor Prompt — PR #9: Code-split QB portal JS bundle

**Branch:** `phase2/pr9-bundle-split`  
**Spec:** `docs/superpowers/specs/2026-04-26-seo-audit-fix-plan.md` § "PR #9"  
**Audit:** PDF p.24 (`qb.nexfortis.com/assets/index-D7_0iFHf.js` — 932.8 kB > 0.5 MB)

## HARD RULES (same as previous PRs)

## Goal

No single JS chunk under `artifacts/qb-portal/dist/public/assets/*.js` exceeds **500 kB** after build. Lighthouse mobile performance ≥75 on `qb.nexfortis.com/`. All routes still load and function correctly (smoke test).

## Files

- `artifacts/qb-portal/vite.config.ts` — add a `build.rollupOptions.output.manualChunks` config that splits vendor (react, react-dom, wouter, lucide-react, recharts/charts, react-hook-form, zod, etc.) into separate chunks.
- `artifacts/qb-portal/src/App.tsx` (or wherever the wouter `<Route>` declarations live) — convert each route component import to `React.lazy(() => import(...))` and wrap the route tree in `<Suspense fallback={...}>`.
- Any heavy non-route module imported eagerly (e.g., chart libs, markdown renderers) — convert to dynamic `import()`.

**Do NOT touch:** prerender pipeline, `scripts/seo-verification/`, or change the prerender allowlist.

## Approach

1. Run `pnpm --filter qb-portal build`, capture the chunk size report.
2. Identify the top 3-5 modules contributing to the 932 kB bundle.
3. Configure `manualChunks` to extract them.
4. Convert all route-level page components to lazy imports.
5. Re-build, confirm no chunk >500 kB, prerender still passes (the prerender uses Puppeteer which renders JS — Suspense fallbacks must resolve to the real page content during prerender).
6. Add a smoke test that hits 5 representative routes (`/`, `/catalog`, `/service/enterprise-to-premier-standard`, `/landing/enterprise-to-premier-conversion`, `/faq`) via Puppeteer and asserts the H1 renders within 5s.

## TDD — `tests/seo/bundle-size.test.mjs`

```js
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

test("no JS chunk in qb-portal/dist/public/assets exceeds 500 kB", () => {
  const dir = "artifacts/qb-portal/dist/public/assets";
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".js")) continue;
    const size = statSync(join(dir, f)).size;
    assert.ok(size <= 500_000, `${f}: ${size} bytes`);
  }
});
```

## Acceptance

- All assets ≤500 kB.
- Prerendered HTML for every route still contains its H1, meta description, canonical, and OG tags (head-tag verifier already enforces this).
- Lighthouse CI mobile perf ≥75 (gate from prior planned PR-E — wire it up here if not already in workflow).

## Stop conditions

If lazy-loading routes breaks prerender (Puppeteer doesn't wait for the chunk to resolve), STOP and surface. Solution may be: configure prerender to wait for `networkidle0` and a known sentinel element, or pre-prefetch route chunks via a manifest. Do not silently regress prerender output.
