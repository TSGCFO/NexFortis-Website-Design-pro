# Cursor Prompt — PR #8: Remaining thin-text pages

**Branch:** `phase2/pr8-thin-text-pages`  
**Spec:** `docs/superpowers/specs/2026-04-26-seo-audit-fix-plan.md` § "PR #8"  
**Audit:** PDF p.34-35

## HARD RULES (same as previous PRs)

## Goal

Each remaining thin-text page renders ≥500 words of body text in prerendered HTML.

## Affected pages

- `nexfortis.com/services` (currently 455w)
- `nexfortis.com/blog` (389w)
- `qb.nexfortis.com/subscription` (409w)
- `qb.nexfortis.com/qbm-guide` (383w)
- `qb.nexfortis.com/category/quickbooks-conversion` (392w)
- `qb.nexfortis.com/category/quickbooks-data-services` (430w)
- `qb.nexfortis.com/faq` (360w — also paragraph-split in PR #7)
- `qb.nexfortis.com/category/volume-packs` (only if still <500w after PR #1)

## Files

- The corresponding page templates under `artifacts/{nexfortis,qb-portal}/src/pages/`.
- Category data file (if categories pull copy from a JSON) — likely a category map in `qb-portal/src/data/`. Inspect first.

## TDD — `tests/seo/thin-text-pages.test.mjs`

```js
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import * as cheerio from "cheerio";

const PAGES = [
  "artifacts/nexfortis/dist/public/services/index.html",
  "artifacts/nexfortis/dist/public/blog/index.html",
  "artifacts/qb-portal/dist/public/subscription/index.html",
  "artifacts/qb-portal/dist/public/qbm-guide/index.html",
  "artifacts/qb-portal/dist/public/category/quickbooks-conversion/index.html",
  "artifacts/qb-portal/dist/public/category/quickbooks-data-services/index.html",
  "artifacts/qb-portal/dist/public/faq/index.html",
  "artifacts/qb-portal/dist/public/category/volume-packs/index.html",
];

test("each page renders ≥500 words", () => {
  for (const p of PAGES) {
    const $ = cheerio.load(readFileSync(p, "utf8"));
    $("script,style,noscript").remove();
    const words = $("main").text().split(/\s+/).filter(Boolean).length;
    assert.ok(words >= 500, `${p}: ${words} words`);
  }
});
```

## Stop conditions

Do not invent service offerings, capacities, blog posts, or category statistics. If genuine content cannot reach 500 words without fabrication, STOP and surface — we may consolidate categories or rework the blog index.
