# Cursor Prompt — PR #6: Bold/strong cleanup on qb privacy

**Branch:** `phase2/pr6-bold-cleanup`  
**Spec:** `docs/superpowers/specs/2026-04-26-seo-audit-fix-plan.md` § "PR #6"  
**Audit:** PDF p.20

## HARD RULES (same as previous PRs)

## Goal

`qb.nexfortis.com/privacy` should not contain:

- Two `<strong>` or `<b>` elements with identical text content
- Any `<strong>`/`<b>` element with text >70 chars

## Files

`artifacts/qb-portal/src/pages/privacy.tsx` only.

## Approach

1. Inspect the page's prerendered HTML (`artifacts/qb-portal/dist/public/privacy/index.html`).
2. Identify duplicate `<strong>`/`<b>` text and over-long bold runs.
3. For duplicates: rename one, remove decorative emphasis, or convert one to plain text.
4. For >70-char bolds: emphasize only the keyword phrase, not the full sentence.

## TDD — `tests/seo/qb-privacy-bold.test.mjs`

```js
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import * as cheerio from "cheerio";

test("qb privacy has no duplicate or over-long <strong>/<b>", () => {
  const $ = cheerio.load(readFileSync("artifacts/qb-portal/dist/public/privacy/index.html", "utf8"));
  const items = $("strong,b").map((_, el) => $(el).text().trim()).get();
  for (const t of items) assert.ok(t.length <= 70, `over-long bold: "${t}"`);
  const seen = new Set();
  for (const t of items) {
    assert.ok(!seen.has(t), `duplicate bold: "${t}"`);
    seen.add(t);
  }
});
```

## Verification

`pnpm --filter qb-portal build && pnpm --filter qb-portal prerender && node --test tests/seo/qb-privacy-bold.test.mjs`. Live-verify after deploy.
