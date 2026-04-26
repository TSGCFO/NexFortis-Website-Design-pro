# SEO Audit Fix — Phase 2 Continuation Spec

**Date:** 2026-04-26
**Source of truth:** `2026-04-25_venture-full-export.pdf` (Seobility audit, 47 pages, dated 25.04.2026)
**Approval:** Approved by user 2026-04-26 (Option C, audit-severity order)

---

## Goal

Close every open finding in the audit's "Important todos for optimization" section (PDF p.3) one PR at a time, in audit-severity order, with each PR's effect verified against production by the post-deploy live-site verifier.

## Scope

**In scope:** Every finding from PDF p.3 that is not already closed by a merged PR (#71–#79).
**Out of scope:** Findings the audit reports as "No errors or problems were found" (frames, redirects, canonicals, typos, slow response, etc.).

## Source of truth

The audit PDF is authoritative. Any prior internal document (`nexfortis-phase2-prompts.md`, allowlist labels, intermediate audits) is reference-only and may not override the PDF. If a discrepancy is found, the PDF wins.

## Already closed (do not re-touch)

| PR | Audit finding | Status |
|---|---|---|
| #72 | Image missing alt (1) | Live-verified |
| #73 | 1 of 8 long titles (blog post) | Live-verified |
| #74 | 6 deep landing pages | Live-verified |
| #76 | 27 identical anchor texts | Live-verified |
| #77 | 4 of 35 heading-structure pages (privacy/terms ×2 sites) | Live-verified |
| #78 | 3 problematic meta descriptions | Live-verified |
| #79 | 32 long anchor texts | Live-verified |

## Remaining open findings — execution order

Each PR below = one task. Tasks must be done sequentially; later PRs depend on earlier ones being merged + live-verified.

### PR #1 — QB service-page content rewrite (Very important)

**Audit findings closed (in whole or part):**

- Duplicate content: 9 of 16 (PDF p.45-46 entries 1, 2, 3, 4, 5, 6, 7, 8, 9 — the QB service pages)
- Pages with duplicate paragraphs: all 16 (PDF p.36-37)
- Pages with little text (<500 words): 15 of 28 (PDF p.34-35 entries 6, 7, 8, 9, 10, 12, 13, 14, 15, 17, 18, 19, 20 + cra-period-copy + 10-pack-conversions)
- Title-keywords-not-in-body: ~12 of 33 (PDF p.38-39 — service pages portion)
- H1-keywords-not-in-body: 0 of 9 from this set (those are in PR #3 — H1 rewrites cover this)

**Files:**
- Modify: `artifacts/qb-portal/public/products.json` — replace the duplicated `description`, `longDescription`, `features`, and feature-bullet copy across the 16 service products with **unique, keyword-rich, ≥500-word body copy per product**.
- The page template at `artifacts/qb-portal/src/pages/service-detail.tsx` consumes these fields — no template change needed.

**Affected service slugs (16):**
1. enterprise-to-premier-standard
2. enterprise-to-premier-complex
3. guaranteed-30-minute
4. file-health-check
5. extended-support
6. rush-delivery
7. audit-trail-removal
8. audit-trail-cra-bundle
9. super-condense
10. list-reduction
11. multi-currency-removal
12. qbo-readiness-report
13. cra-period-copy
14. accountedge-to-quickbooks
15. sage50-to-quickbooks
16. 5-pack-conversions (and 10-pack-conversions — sibling volume packs)

**Acceptance criteria:**

- Every modified service page renders ≥500 words of unique body text in the prerendered HTML
- No paragraph appears more than once on any single page (verify via prerender + Cheerio diff)
- Page-title keywords (from PDF p.38-39 right column, **bolded** words) appear at least once verbatim in body text
- No two pages in this set share an entire paragraph (cross-page diff)
- Tests added under `tests/seo/` that fail before the change and pass after (TDD)
- `pnpm test` green; `pnpm build` green; live-site verifier green after deploy

**Out of scope for this PR:** The QB landing pages (`qb.nexfortis.com/landing/*`) — those are PR #2.

---

### PR #2 — QB landing-page text-block dedupe (Very important)

**Audit findings closed:**

- 203 cross-page duplicate text blocks: closes ~140 of 203 (the high-frequency snippets at PDF p.42-44 entries 1, 2, 3, 11, 15, 16, 17, 18 that show on landing pages 3+ times each)
- Pages with little text: closes 5 of remaining 13 (any landing pages still under 500 words after dedupe rewrites)
- Duplicate content: closes the catalog/category overlaps (entries flagged "Included" against catalog and category pages — PDF p.45-46)

**Files:**
- Modify: `artifacts/qb-portal/src/data/landingPages.ts` — rewrite the shared `intro`, `keyPoints`, `faq` blocks so each landing page has unique copy.

**Landing pages affected (≥10):**
- enterprise-to-premier-conversion, quickbooks-file-too-large, quickbooks-running-slow, audit-trail-removal, quickbooks-desktop-end-of-life, etech-alternative, affordable-enterprise-conversion, quickbooks-support-subscription, super-condense, accountedge-to-quickbooks, quickbooks-company-file-error, multi-currency-removal, list-reduction, is-it-safe, how-conversion-works.

**Acceptance criteria:**

- No text block ≥100 chars appears on more than 2 landing pages (down from current 3+)
- Each landing page renders ≥500 words of unique body text
- Catalog and category pages no longer "Include" service pages (verify via Seobility-style prefix match in tests)
- TDD tests, `pnpm test` green, build green, live-site verifier green

---

### PR #3 — Rewrite 17 short H1s (Important)

**Audit finding closed:** All 17 H1-too-short pages from PDF p.16.

**Affected pages (17):**

`nexfortis.com`: about, contact, privacy, terms (4)
`qb.nexfortis.com`: catalog, terms, privacy, category/volume-packs, service/{5-pack-conversions, file-health-check, rush-delivery, extended-support, audit-trail-removal, super-condense, list-reduction, cra-period-copy, 10-pack-conversions} (13)

**Files:**
- Modify the corresponding page sources under `artifacts/{nexfortis,qb-portal}/src/pages/` and any data files where H1 strings live (likely `landingPages.ts` not relevant — these are the page templates themselves).

**Acceptance criteria:**

- Each H1 ≥25 characters, descriptive, contains primary keyword
- Each H1 differs from `<title>` (Seobility's "ensure H1 differs from title" rule, p.40)
- H1 keywords appear in body text (closes part of the 9 H1-keywords-not-in-body finding for the 4-and-9 overlap with this list)
- The Seobility allowlist `tests/seo/__known-issues__.json` I1 count drops from 5 to 0 after this PR's tests are wired up; site count drops from 17 to 0
- TDD tests, build green, live-verified

---

### PR #4 — Heading-structure fixes (Important)

**Audit finding closed:** Remaining 31 of 35 (35 minus the 4 closed by #77).

**Affected pages (PDF p.18):**

Structural problem: nexfortis.com/{services, blog, blog/5-signs-…}, qb.nexfortis.com/{faq, waitlist} (5 — privacy/terms already done).
Duplicate heading: nexfortis.com/{services/digital-marketing, blog/top-5-workflow-…, blog/quickbooks-desktop-vs-online} (3).
Too many headings: nexfortis.com/{services/quickbooks, blog/top-5-workflow-…, blog/what-is-pipeda-why-it-matters}, qb.nexfortis.com/catalog, qb.nexfortis.com/landing/{enterprise-to-premier-conversion, quickbooks-file-too-large, quickbooks-running-slow, audit-trail-removal, quickbooks-desktop-end-of-life} (10).

**Files:** Affected page templates and the landing-page renderer that emits `<h2>`/`<h3>` from `keyPoints`/`faq` arrays.

**Acceptance criteria:**

- No structural gaps (H1→H2→H3, no jumps)
- No duplicate heading text on a single page
- ≤8 headings per page (Seobility's "too many" threshold) unless content genuinely warrants more
- TDD heading-tree tests, build green, live-verified

---

### PR #5 — 7 remaining title rewrites (Important)

**Audit finding closed:** 7 of 8 long titles from PDF p.13-14.

**Affected pages:**

| URL | Current px | Target |
|---|---|---|
| qb.nexfortis.com/ | 641 | <580 |
| qb.nexfortis.com/service/sage50-to-quickbooks | 660 | <580 |
| qb.nexfortis.com/service/audit-trail-cra-bundle | 614 | <580 |
| qb.nexfortis.com/service/accountedge-to-quickbooks | 598 | <580 |
| qb.nexfortis.com/service/enterprise-to-premier-standard | 591 | <580 |
| qb.nexfortis.com/service/enterprise-to-premier-complex | 589 | <580 |
| qb.nexfortis.com/service/guaranteed-30-minute | 583 | <580 |

**Files:**
- Modify product-level `seo.title` in `artifacts/qb-portal/public/products.json`
- Modify the home page `<title>` source in `artifacts/qb-portal/src/pages/home.tsx` or its `SEO` component invocation

**Acceptance criteria:**

- Every title's pixel width <580 (use the existing pixel-width util in `tests/seo/`)
- Allowlist I5 count drops to 0
- Build green, live-verified

---

### PR #6 — Bold/strong cleanup (Tip)

**Audit finding closed:** Strong/bold tag problem on `qb.nexfortis.com/privacy` (PDF p.20).

**Files:** `artifacts/qb-portal/src/pages/privacy.tsx`

**Acceptance criteria:**

- No two `<strong>`/`<b>` elements with identical text content
- No `<strong>`/`<b>` containing >70 chars
- TDD test, build green, live-verified

---

### PR #7 — Few-paragraph fixes (Tip)

**Audit finding closed:** 3 pages with <3 paragraphs (PDF p.33).

**Affected pages:**
- nexfortis.com/contact (227 words, 2 paragraphs)
- qb.nexfortis.com/faq (360 words, 1 paragraph)
- qb.nexfortis.com/waitlist (142 words, 1 paragraph)

**Files:** the corresponding page templates.

**Acceptance criteria:**

- Each page renders ≥3 distinct `<p>` blocks of ≥100 chars each
- Build green, live-verified

---

### PR #8 — Remaining thin-text pages (Tip)

**Audit finding closed:** Remaining 8 of 28 thin-text pages (those not already covered by #1, #2, #7).

**Affected pages (PDF p.34-35 + remaining):**

- nexfortis.com/services (455w)
- nexfortis.com/blog (389w)
- qb.nexfortis.com/subscription (409w)
- qb.nexfortis.com/qbm-guide (383w)
- qb.nexfortis.com/category/quickbooks-conversion (392w)
- qb.nexfortis.com/category/quickbooks-data-services (430w)
- qb.nexfortis.com/faq (360w — also gets paragraph-split in #7; word-count fix here)
- qb.nexfortis.com/category/volume-packs (if still <500 after #1)

**Acceptance criteria:**

- Every listed page renders ≥500 words
- Build green, live-verified

---

### PR #9 — Large JS bundle (Tip)

**Audit finding closed:** "Issues with file sources" — `qb.nexfortis.com/assets/index-D7_0iFHf.js` 932.8 kB > 0.5 MB (PDF p.24).

**Files:** `artifacts/qb-portal/vite.config.ts`, route-level dynamic imports across `artifacts/qb-portal/src/pages/`.

**Acceptance criteria:**

- No single JS chunk in `artifacts/qb-portal/dist/public/assets/` exceeds 500 kB
- Lighthouse mobile performance ≥75 on the QB portal home (existing Phase 2 PR-E gate, not yet enforced)
- All routes still functional (e2e smoke test passes)
- Build green, live-verified

---

## Architecture notes

- **Source files only.** All copy lives in either page-template `.tsx` files, `landingPages.ts`, or `products.json`. There is no CMS.
- **Prerender chain unchanged.** Vite build → SSG renderer in `scripts/prerender.mjs` → static HTML to S3/Render. Verifier scripts under `scripts/seo-verification/` are read-only and prove rendered output.
- **Tests pattern.** Each PR adds tests under `tests/seo/` that read prerendered HTML for the affected URLs and assert specific properties (word count, heading tree, no-duplicate-paragraphs, pixel widths, etc.). Allowlist `tests/seo/__known-issues__.json` is reduced as findings close.
- **Live verification.** After each merge, the post-deploy workflow runs the live-site verifier (`live-site-verifier/`) against production. A PR is considered done only after live verification is green on its merge SHA.
- **No prerender allowlist work.** Out of scope. Prerender behavior is a workflow concern unrelated to audit findings.

## Per-PR workflow

Each PR follows the subagent-driven-development loop:

1. Controller (this agent) drafts a Cursor prompt at `cursor-prompts/<pr-name>.md` capturing all spec requirements verbatim.
2. User pastes the prompt into Cursor; Cursor agent does the work and opens a PR.
3. Controller dispatches a **spec-compliance reviewer** subagent against the PR diff. Iterate until ✅.
4. Controller dispatches a **code-quality reviewer** subagent. Iterate until ✅.
5. Resolve any Copilot threads via GraphQL `resolveReviewThread` mutation; merge once required CI checks (`Local SEO test suite`, `Verify Render PR previews`) are green via `gh pr merge --squash --delete-branch`.
6. Run live-site verifier against the merge SHA; require green.
7. Update this spec's checkbox; proceed to next PR.

## Self-review (inline)

- **Placeholder scan:** No TBDs in PR scopes. Each PR has a concrete file list and acceptance criteria.
- **Internal consistency:** PR #1 covers service pages, PR #2 covers landing pages, PR #3 covers H1s, PR #4 covers heading hierarchy — these are non-overlapping by file/finding.
- **Scope:** This is one cohesive plan (close all open audit findings). The 9 PRs are sequential tasks under one objective; no decomposition needed.
- **Ambiguity:** Acceptance criteria use exact thresholds from the audit (≥500 words, <580px, ≤120 chars, etc.) — no interpretive room.

## Source citation

Every URL list, count, and pixel value above is taken verbatim from the Seobility audit PDF dated 25.04.2026 (`2026-04-25_venture-full-export.pdf`). Pages cited inline.
