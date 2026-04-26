# Cursor Prompt — PR #7: Few-paragraph fixes (3 pages)

**Branch:** `phase2/pr7-few-paragraph-fixes`  
**Spec:** `docs/superpowers/specs/2026-04-26-seo-audit-fix-plan.md` § "PR #7"  
**Audit:** PDF p.33

## HARD RULES (same as previous PRs)

## Goal

Each of these pages must render ≥3 distinct `<p>` blocks, each ≥100 chars:

- `nexfortis.com/contact` (currently 227 words, 2 paragraphs)
- `qb.nexfortis.com/faq` (360 words, 1 paragraph)
- `qb.nexfortis.com/waitlist` (142 words, 1 paragraph)

This is a paragraph-count fix; PR #8 also bumps `/faq` to ≥500 words separately.

## Files

- `artifacts/nexfortis/src/pages/contact.tsx`
- `artifacts/qb-portal/src/pages/faq.tsx`
- `artifacts/qb-portal/src/pages/waitlist.tsx`

## TDD — `tests/seo/few-paragraph.test.mjs`

```js
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import * as cheerio from "cheerio";

const PAGES = [
  "artifacts/nexfortis/dist/public/contact/index.html",
  "artifacts/qb-portal/dist/public/faq/index.html",
  "artifacts/qb-portal/dist/public/waitlist/index.html",
];

test("each page has ≥3 paragraphs of ≥100 chars", () => {
  for (const p of PAGES) {
    const $ = cheerio.load(readFileSync(p, "utf8"));
    const paras = $("main p").map((_, el) => $(el).text().trim()).get().filter(t => t.length >= 100);
    assert.ok(paras.length >= 3, `${p}: ${paras.length} qualifying paragraphs`);
  }
});
```

## Verification

`pnpm build` (both sites), prerender both, run test, live-verify.
