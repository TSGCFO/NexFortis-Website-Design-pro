# Cursor Prompt — PR #4: Heading-structure fixes (31 pages)

**Branch:** `phase2/pr4-heading-structure`  
**Spec:** `docs/superpowers/specs/2026-04-26-seo-audit-fix-plan.md` § "PR #4"  
**Audit:** PDF p.18

## HARD RULES (same as previous PRs)

## Goal

Every page on the audit's heading-structure list:

- No skipped levels (H1→H2→H3, no jumps to H4)
- No duplicate heading text on the same page
- ≤8 total `<h1>`-`<h6>` per page (Seobility "too many" threshold) unless content genuinely warrants more

Closes the remaining **31 of 35** heading problems. The 4 already done by #77 (privacy/terms ×2 sites) are not in scope.

## Three sub-categories from the audit

**A. Structural problem — H2→H4 jumps (5):**

- `nexfortis.com/services`
- `nexfortis.com/blog`
- `nexfortis.com/blog/5-signs-your-business-needs-an-it-audit`
- `qb.nexfortis.com/faq`
- `qb.nexfortis.com/waitlist`

Fix: replace any `<h4>` that is the first child after an `<h2>` with `<h3>`, or insert an `<h3>` parent. Keep semantic correctness — do not just renumber blindly.

**B. Duplicate heading (3):**

- `nexfortis.com/services/digital-marketing`
- `nexfortis.com/blog/top-5-workflow-automation-wins-small-businesses`
- `nexfortis.com/blog/quickbooks-desktop-vs-online`

Fix: rename one of the duplicates so each heading on the page has unique text.

**C. Too many headings — >8 (10):**

- `nexfortis.com/services/quickbooks`
- `nexfortis.com/blog/top-5-workflow-automation-wins-small-businesses`
- `nexfortis.com/blog/what-is-pipeda-why-it-matters`
- `qb.nexfortis.com/catalog`
- `qb.nexfortis.com/landing/enterprise-to-premier-conversion`
- `qb.nexfortis.com/landing/quickbooks-file-too-large`
- `qb.nexfortis.com/landing/quickbooks-running-slow`
- `qb.nexfortis.com/landing/audit-trail-removal`
- `qb.nexfortis.com/landing/quickbooks-desktop-end-of-life`

Fix: collapse over-fragmented sections — merge adjacent short H3 groups under a single H2, or convert decorative H3s to `<p class="font-semibold">`. Total `<h1>`+`<h2>`+`<h3>`+… ≤8 per page after the change.

## Allowlist updates

Remove entries from `tests/seo/__known-issues__.json` `INV-008` (issue I6) for the 31 routes covered.

## TDD — `tests/seo/heading-structure.test.mjs`

For each affected URL (set up an array), parse prerendered HTML, walk all heading elements in document order, and assert:

1. `levels.every((l, i) => i === 0 || l - levels[i - 1] <= 1)` — no level skipped.
2. `new Set(headings).size === headings.length` — no duplicate heading text on the page.
3. `headings.length <= 8`.

## Files

- All affected `.tsx` page sources under `artifacts/{nexfortis,qb-portal}/src/pages/`.
- The landing-page renderer in `artifacts/qb-portal/src/pages/landing.tsx` (or wherever `keyPoints[]`/`faq[]` get emitted) — likely needs an option to render only the first N items as headings or to render some as `<p>`.

## Stop conditions

If reducing headings to ≤8 would lose meaningful structure (e.g., a long-form blog post with legitimate sections), STOP and surface — we may need to keep that single page above 8.
