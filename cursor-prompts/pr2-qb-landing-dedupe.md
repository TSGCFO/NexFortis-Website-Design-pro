# Cursor Prompt — PR #2: QB landing-page text-block dedupe

**Repo:** `TSGCFO/NexFortis-Website-Design-pro`  
**Base branch:** `main`  
**Working branch:** `phase2/pr2-qb-landing-dedupe`  
**Spec:** `docs/superpowers/specs/2026-04-26-seo-audit-fix-plan.md` § "PR #2"  
**Audit source:** `2026-04-25_venture-full-export.pdf` (PDF p.42-46)  
**Depends on:** PR #1 merged & live-verified.

## HARD RULES (same as PR #1)

1. Do not touch `scripts/seo-verification/`.
2. Do not modify `docs/` (except `docs/superpowers/specs|plans/`).
3. Never use "scrape"/"crawl".
4. Squash merge with `--delete-branch`; use `gh` CLI for GitHub URLs.
5. Required checks: `Local SEO test suite`, `Verify Render PR previews`.

## Goal

Close:

- 203 cross-page duplicate text blocks (PDF p.42-44) — close ≥140 of 203
- Pages with little text — close 5 of remaining 13 (landings still <500w after dedupe)
- Catalog/category "Included" overlap entries (PDF p.45-46)

## Files

**Modify:** `artifacts/qb-portal/src/data/landingPages.ts` only.  
**Create:** `tests/seo/landing-pages.content.test.mjs`

**Out of scope:** every other file. If the dedupe requires template changes, STOP and surface.

## Landing pages affected (≥10 of the 18)

`enterprise-to-premier-conversion`, `quickbooks-file-too-large`, `quickbooks-running-slow`, `audit-trail-removal`, `quickbooks-desktop-end-of-life`, `etech-alternative`, `affordable-enterprise-conversion`, `quickbooks-support-subscription`, `super-condense`, `accountedge-to-quickbooks`, `quickbooks-company-file-error`, `multi-currency-removal`, `list-reduction`, `is-it-safe`, `how-conversion-works`.

## Approach

For each landing page, audit its `hero.intro`, every entry in `overview[]`, every `benefits[].body`, every `process[].body`, and every `faqs[].answer`. For each text block of ≥100 chars that currently appears verbatim on more than 2 of these landing pages, **rewrite the duplicate copies** so the wording is unique to each page (the copy must still be accurate; do not invent facts).

Rule: **no text block ≥100 chars may appear on more than 2 landing pages.** Catalog and category pages must not appear as "Included" hits in Seobility's prefix-match against any landing page (verify with the test below).

## Word count

After dedupe, each landing page must still render ≥500 words of unique body text in its prerendered HTML.

## TDD test — `tests/seo/landing-pages.content.test.mjs`

```js
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";

const QB_DIST = "artifacts/qb-portal/dist/public";

const LANDING_SLUGS = [
  "enterprise-to-premier-conversion",
  "quickbooks-file-too-large",
  "quickbooks-running-slow",
  "audit-trail-removal",
  "quickbooks-desktop-end-of-life",
  "etech-alternative",
  "affordable-enterprise-conversion",
  "quickbooks-support-subscription",
  "super-condense",
  "accountedge-to-quickbooks",
  "quickbooks-company-file-error",
  "multi-currency-removal",
  "list-reduction",
  "is-it-safe",
  "how-conversion-works",
];

function loadBody(slug) {
  const html = readFileSync(join(QB_DIST, "landing", slug, "index.html"), "utf8");
  const $ = cheerio.load(html);
  $("script,style,noscript").remove();
  return { $, text: $("main").text().replace(/\s+/g, " ").trim() };
}

test("each landing page renders ≥500 words", () => {
  for (const s of LANDING_SLUGS) {
    const { text } = loadBody(s);
    const w = text.split(/\s+/).filter(Boolean).length;
    assert.ok(w >= 500, `${s}: ${w} words`);
  }
});

test("no text block ≥100 chars appears on more than 2 landing pages", () => {
  const seen = new Map(); // block -> Set<slug>
  for (const s of LANDING_SLUGS) {
    const { $ } = loadBody(s);
    const blocks = $("main p, main li").map((_, el) => $(el).text().replace(/\s+/g, " ").trim()).get()
      .filter(t => t.length >= 100);
    for (const b of blocks) {
      if (!seen.has(b)) seen.set(b, new Set());
      seen.get(b).add(s);
    }
  }
  for (const [block, slugs] of seen) {
    assert.ok(slugs.size <= 2, `block on ${slugs.size} pages: "${block.slice(0, 80)}…"`);
  }
});
```

## Verification

```bash
pnpm install
pnpm --filter qb-portal build
pnpm --filter qb-portal prerender
node --test tests/seo/landing-pages.content.test.mjs
pnpm test
```

All exit 0.

## Commit + PR

- Commit: `feat(qb-portal): dedupe landing-page text blocks across 15 landings (audit PR-2)`
- `gh pr create --base main --head phase2/pr2-qb-landing-dedupe --title "PR #2 — QB landing-page text-block dedupe (audit, 15 pages)" --body-file …`

## Stop conditions

If meeting "≤2 pages per shared block" requires removing a factually-shared item (e.g., the same security disclaimer that genuinely belongs on every page), STOP and surface — we will likely move that block into a shared component referenced by id, not duplicate-copy in the data file.
