# Cursor Prompt — PR #5: 7 remaining title rewrites

**Branch:** `phase2/pr5-title-rewrites`  
**Spec:** `docs/superpowers/specs/2026-04-26-seo-audit-fix-plan.md` § "PR #5"  
**Audit:** PDF p.13-14

## HARD RULES (same as previous PRs)

## Goal

7 of 8 long titles to <580px (the 8th — a blog post — was already fixed in #73).

| URL | Current px | Target | Suggested rewrite |
|---|---|---|---|
| `qb.nexfortis.com/` | 641 | <580 | "QuickBooks Conversion Services Canada \| NexFortis" |
| `qb.nexfortis.com/service/sage50-to-quickbooks` | 660 | <580 | "Sage 50 to QuickBooks Conversion \| NexFortis" |
| `qb.nexfortis.com/service/audit-trail-cra-bundle` | 614 | <580 | "Audit Trail Removal + CRA Period Copy \| NexFortis" |
| `qb.nexfortis.com/service/accountedge-to-quickbooks` | 598 | <580 | "AccountEdge to QuickBooks Conversion \| NexFortis" |
| `qb.nexfortis.com/service/enterprise-to-premier-standard` | 591 | <580 | "Enterprise to Premier Conversion (Standard) \| NexFortis" |
| `qb.nexfortis.com/service/enterprise-to-premier-complex` | 589 | <580 | "Enterprise → Premier Complex Conversion \| NexFortis" |
| `qb.nexfortis.com/service/guaranteed-30-minute` | 583 | <580 | "30-Minute QuickBooks Conversion \| NexFortis" |

You may improve the wording — just verify pixel width <580 using the existing util in `tests/seo/`.

## Files

- `artifacts/qb-portal/public/products.json` — add a `seo.title` field (or extend existing `meta_description` shape with a `seo: { title, description }` object) for the 6 service slugs.
- `artifacts/qb-portal/src/pages/service-detail.tsx` — prefer `product.seo?.title` over the default in the `<SEO>` invocation.
- `artifacts/qb-portal/src/pages/home.tsx` — direct override of the home page `<SEO title=… />`.

## Allowlist

Remove `INV-002` (I5) entries that match (note: existing `INV-002` covers 3 nexfortis service pages — different from this PR; do not remove those). This PR's targets are qb-portal — confirm by site label before editing.

## TDD — `tests/seo/title-pixel-width.test.mjs`

```js
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import * as cheerio from "cheerio";
import { measurePixelWidth } from "./pixel-width-util.mjs"; // existing util

const PAGES = [
  "artifacts/qb-portal/dist/public/index.html",
  "artifacts/qb-portal/dist/public/service/sage50-to-quickbooks/index.html",
  // … etc
];

test("affected titles render <580px", () => {
  for (const path of PAGES) {
    const $ = cheerio.load(readFileSync(path, "utf8"));
    const title = $("title").text();
    assert.ok(measurePixelWidth(title) < 580, `${path}: ${measurePixelWidth(title)}px — "${title}"`);
  }
});
```

## Verification

`pnpm test`, `pnpm --filter qb-portal build`, `pnpm --filter qb-portal prerender`, then run the test. All exit 0. Live-verify post-deploy.

## Stop conditions

If existing `pixel-width-util.mjs` does not exist under `tests/seo/`, find the equivalent util the verifier uses (read-only) and copy the algorithm into a new local util under `tests/seo/`. Do NOT modify `scripts/seo-verification/`.
