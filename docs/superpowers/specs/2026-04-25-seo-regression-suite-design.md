# SEO Regression Test Suite — Design Spec

**Date:** 2026-04-25
**Author:** Computer (Claude Sonnet 4.6)
**Status:** Draft — awaiting user review
**Related:** [`/nexfortis-codebase-analysis.md`](../../../nexfortis-codebase-analysis.md), `/seo-audit/*.md`, `/TODO-SEO-FIX-PLAN.md`

---

## 1. Why this exists

The Seobility audit (25 Apr 2026, 47 pages) flagged ~40 issues across both `nexfortis.com` and `qb.nexfortis.com`, ranging from one-pixel title overruns to systemic duplicate-content patterns. The codebase analysis identified a single render pattern in `service-detail.tsx` as the root cause for most of the QB portal findings.

Before fixing any of those issues, we need an automated regression test suite that ensures:

1. **No SEO regression slips through.** The codebase has an enormous amount of SEO infrastructure already — sitemaps, prerender, JSON-LD, canonicals, OG tags, security headers. While fixing the audit findings, none of that should silently break.
2. **Every fix is verifiable.** "I fixed C1" should mean "the test for C1 used to fail and now passes," not "I edited the file and eyeballed it."
3. **Cloud agents can build fixes safely.** Phase 2 hands SEO fixes to Cursor / Claude Code / Codex agents. The test suite is the validation oracle — green = correct.
4. **Crawlers see what we think they see.** Tests run against the prerendered HTML output (what Googlebot reads), not the post-hydration DOM.

## 2. Non-goals

- Performance benchmarking (Lighthouse) — covered by existing audit tooling.
- Visual regression / screenshot diffs — out of scope.
- Replacing manual judgment on copy quality — tests check structure and rules, not whether a paragraph is well-written.
- Lint-level checks already done by TypeScript or ESLint — no duplication.
- Production monitoring — that's a separate observability layer (GSC, GA, Sentry).

## 3. Decisions (locked)

These were settled during brainstorming and are inputs to the design, not topics to revisit:

| Decision | Locked answer |
|---|---|
| Test layers | All four: snapshots, invariants, component, post-deploy verifiers |
| Snapshot strictness | Strict freeze — any diff fails; explicit `--update` to accept |
| Baseline source | Build from current `main`; commit snapshots to repo |
| Invariants enforced | All four sets including aggressive anchor rules |
| Git workflow | Per-step PRs into `main`; never direct |
| Branch protection | **Active** (ruleset `15556829`) — PR required, linear history, no force push |
| Phase 1 builder | Computer, directly, TDD-disciplined |
| Phase 2 builder | Cloud agents with prompts; Computer reviews |
| Render PR previews | **Active** for all 3 services — tested and confirmed |

## 4. Architecture

### 4.1 Directory layout

```
nexfortis/
├── tests/
│   └── seo/
│       ├── lib/
│       │   ├── extract.mjs           # html → normalized fingerprint
│       │   ├── pixel-width.mjs       # title/desc pixel calculation
│       │   ├── jsonld.mjs            # extract & validate JSON-LD blocks
│       │   ├── anchor-rules.mjs      # cross-page anchor analysis
│       │   └── load-dist.mjs         # walk artifacts/*/dist/, return [{site, route, html}]
│       ├── snapshots.test.mjs        # strict-freeze tests
│       ├── invariants.test.mjs       # programmatic rules
│       ├── components.test.tsx       # Vitest + RTL
│       ├── __snapshots__/
│       │   ├── nexfortis/            # one .snap.json per route
│       │   └── qb-portal/
│       ├── __known-issues__.json     # allowlist for pre-existing audit findings
│       ├── fixtures/
│       │   └── seobility-pixel-widths.json  # known measurements for calibration
│       └── README.md                 # how to run, when to update
├── .github/
│   └── workflows/
│       └── seo-tests.yml             # CI workflow
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-04-25-seo-regression-suite-design.md  # this file
```

### 4.2 The four layers

#### Layer 1: Snapshot tests (`snapshots.test.mjs`)

For every prerendered HTML file in `artifacts/nexfortis/dist/` and `artifacts/qb-portal/dist/`, generate a normalized fingerprint and compare to the committed baseline.

**Fingerprint shape (per page):**

```jsonc
{
  "route": "/about",
  "title": "About NexFortis | NexFortis IT Solutions",
  "description": "...",
  "canonical": "https://nexfortis.com/about",
  "robots": "index,follow",
  "og": {
    "title": "...",
    "description": "...",
    "url": "https://nexfortis.com/about",
    "image": "https://nexfortis.com/opengraph.png",
    "type": "website"
  },
  "twitter": { "card": "summary_large_image" },
  "headings": [
    { "level": 1, "text": "About NexFortis" },
    { "level": 2, "text": "Our Story" },
    { "level": 2, "text": "Our Values" }
  ],
  "jsonld": [
    { "@type": "Organization", "name": "NexFortis", "url": "..." },
    { "@type": "BreadcrumbList", "itemListElement": [...] }
  ],
  "anchors": [
    { "text": "Get a Free Quote", "href": "/contact" },
    { "text": "Browse our IT services", "href": "/services" }
  ],
  "rootDivIsEmpty": false,
  "hasNoindex": false
}
```

**Normalization rules** (so non-meaningful changes don't fail tests):
- Whitespace collapsed to single spaces
- JSON-LD pretty-printed and sorted by `@type`
- Anchors deduplicated by `[text, href]` pair
- `image` URLs trimmed of cache-busting query params
- All text trimmed

**Test logic:** for each route in dist, compare new fingerprint to `__snapshots__/<site>/<route>.snap.json`. Use a structured diff (not stringify+compare) so failure messages identify the exact field that changed.

**Update workflow:** `pnpm test:seo --update` re-writes all snapshots from current build. Reviewer sees the diff in the PR.

#### Layer 2: Invariants (`invariants.test.mjs`)

Programmatic rules that don't drift with content changes. Each rule failure includes route + offending value + remediation hint.

**Rule set:**

| ID | Rule | Source |
|---|---|---|
| INV-001 | Every page has exactly one `<h1>` | Seobility hard rule |
| INV-002 | `<title>` pixel width 200–580 px | Seobility hard rule |
| INV-003 | `<meta description>` pixel width 400–1000 px | Seobility hard rule |
| INV-004 | `<h1>` text length 25–70 chars | Seobility hard rule |
| INV-005 | `<link rel="canonical">` present and matches page URL | SEO contract |
| INV-006 | `<meta robots>` does not contain `noindex` | SEO contract |
| INV-007 | OG/Twitter required tags present (title, description, url, image, type, card) | SEO contract |
| INV-008 | Heading hierarchy: no level skipped (no H3 before H2 under any H1) | Accessibility + SEO |
| INV-009 | At least one `<script type="application/ld+json">` per page | SEO contract |
| INV-010 | Every JSON-LD block parses as valid JSON, has `@context` and `@type` | Schema validity |
| INV-011 | Every page has a `BreadcrumbList` JSON-LD block | SEO contract (existing convention) |
| INV-012 | Service-detail pages emit `Service` JSON-LD | Existing convention |
| INV-013 | No duplicate `@type` within a single page (e.g., two `Organization` blocks) | Schema validity |
| INV-014 | `<div id="root">` is non-empty (prerender shell check) | Catches empty SPA shells |
| INV-015 | Anchor uniqueness: no anchor text points to two different URLs across the site | Audit finding I2 |
| INV-016 | Anchor length: `text.length ≤ 120` chars OR text matches exempt allowlist | Audit finding I3 |
| INV-017 | Generic anchors banned: `read article`, `read more`, `details`, `learn more`, `click here` | Audit finding I2 |
| INV-018 | Sitemap URLs all resolve in dist (no orphan sitemap entries) | Catches broken links pre-deploy |
| INV-019 | No URL appears in sitemap with `noindex` meta | Configuration error catch |
| INV-020 | All `<img>` tags have non-empty `alt` (or `alt=""` for decorative with `aria-hidden`) | Accessibility + SEO |

**Allowlist (`__known-issues__.json`):**

The audit identified pre-existing issues. We don't want PR #7 to fail with 40 errors — we want it to fail with **0 errors** and an allowlist enumerating the known issues by `(rule_id, route)` pair. As each Phase 2 fix lands, it removes its allowlist entry. When the allowlist is empty, all invariants are enforced.

```jsonc
{
  "INV-004": [
    { "site": "nexfortis", "route": "/about", "current": "About NexFortis", "expected": "expand to 25-70 chars", "issue": "I1" },
    { "site": "nexfortis", "route": "/contact", "current": "Contact us", "issue": "I1" }
  ],
  "INV-016": [
    { "site": "qb-portal", "route": "/service/enterprise-to-premier-standard", "issue": "I3" }
  ]
}
```

#### Layer 3: Component tests (`components.test.tsx`)

Render each page component with React Testing Library + Vitest, assert `<SEO>` emits the right tags. Catches issues before any build runs.

**Coverage:**
- For each top-level page component (~25 pages across both sites), one test that:
  - Renders the component inside `MemoryRouter` + `HelmetProvider`
  - Reads emitted `<head>` after render
  - Asserts: title set, description set, canonical correct, BreadcrumbSchema rendered, page-specific schemas (Service / FAQ / Article) rendered when applicable

**Why this matters even with snapshots:** snapshots run after build (~30 s). Component tests run in <2 s and catch obvious mistakes immediately. They also test component-level invariants that are hard to assert at HTML level (e.g., "the SEO component received a non-empty `description` prop").

#### Layer 4: Post-deploy verifiers (existing, modified)

`scripts/seo-verification/verify-head-tags.mjs` and `verify-rendered-content.mjs` already exist. Today they hard-code production sitemaps. We modify them to accept env vars:

```bash
SITEMAP_URLS="https://pr-42-nexfortis-marketing.onrender.com/sitemap.xml,https://pr-42-nexfortis-qb-portal.onrender.com/sitemap.xml" \
  node scripts/seo-verification/verify-head-tags.mjs
```

The CI workflow then runs them against PR preview URLs after Render finishes the preview build.

### 4.3 CI workflow (`.github/workflows/seo-tests.yml`)

```yaml
name: SEO Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  local-tests:
    name: Local SEO test suite
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm test:seo:components       # fast, no build
      - run: pnpm build                     # marketing + qb-portal both prerender
      - run: pnpm test:seo:snapshots
      - run: pnpm test:seo:invariants

  preview-verifiers:
    name: Verify Render PR previews
    runs-on: ubuntu-latest
    needs: local-tests
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - run: |
          PR=${{ github.event.pull_request.number }}
          MARKETING="https://pr-${PR}-nexfortis-marketing.onrender.com"
          QB="https://pr-${PR}-nexfortis-qb-portal.onrender.com"
          # Wait for both previews to be live (poll up to 10 min)
          for url in "$MARKETING" "$QB"; do
            for i in {1..60}; do
              if curl -sfI "$url/" | grep -q "200"; then break; fi
              sleep 10
            done
          done
          SITEMAP_URLS="${MARKETING}/sitemap.xml,${QB}/sitemap.xml" \
            node scripts/seo-verification/verify-head-tags.mjs
          SITEMAP_URLS="${MARKETING}/sitemap.xml,${QB}/sitemap.xml" \
            node scripts/seo-verification/verify-rendered-content.mjs
```

Both jobs become **required status checks** in the branch protection ruleset (added in PR #9).

### 4.4 NPM scripts

Added to root `package.json`:

```jsonc
{
  "scripts": {
    "test:seo": "node --test 'tests/seo/**/*.test.mjs' && pnpm test:seo:components",
    "test:seo:snapshots": "node --test 'tests/seo/snapshots.test.mjs'",
    "test:seo:invariants": "node --test 'tests/seo/invariants.test.mjs'",
    "test:seo:components": "vitest run tests/seo/components.test.tsx",
    "test:seo:update": "UPDATE_SNAPSHOTS=1 node --test 'tests/seo/snapshots.test.mjs'"
  }
}
```

The `--update` flag is just an env var read by the snapshot test driver. When set, instead of comparing it overwrites snapshot files.

## 5. Implementation phasing

### Phase 1: Build the test suite (Computer-led, TDD)

10 sequential PRs into `main`. Each PR:
1. Has its own failing test written first
2. Implements minimal code to make it pass
3. Stays green standalone — main is always shippable
4. Goes through the same CI as future PRs (the suite tests itself)

| PR # | Title | Files added/touched | Why this size |
|---|---|---|---|
| 1 | feat(seo-tests): scaffold test directory and pnpm scripts | `tests/seo/README.md`, root `package.json` scripts, `vitest.config.ts` | Tiny, sets the foundation |
| 2 | feat(seo-tests): HTML extractor + tests | `lib/extract.mjs` + tests | Self-contained utility |
| 3 | feat(seo-tests): pixel-width calculator + tests | `lib/pixel-width.mjs` + tests + fixtures | Calibrated against Seobility |
| 4 | feat(seo-tests): JSON-LD extractor + validator | `lib/jsonld.mjs` + tests | Self-contained utility |
| 5 | feat(seo-tests): anchor-rule analyzer | `lib/anchor-rules.mjs` + tests | Self-contained utility |
| 6 | feat(seo-tests): snapshot test driver + initial baseline | `snapshots.test.mjs`, `__snapshots__/**` | Largest PR; ~66 snapshot files |
| 7 | feat(seo-tests): invariants test suite + known-issues allowlist | `invariants.test.mjs`, `__known-issues__.json` | Allowlist seeded from audit |
| 8 | feat(seo-tests): component-level SEO tests | `components.test.tsx`, vitest dev dep | Adds Vitest to devDeps |
| 9 | ci(seo-tests): GitHub Actions workflow + branch protection update | `.github/workflows/seo-tests.yml` | Wires CI gates |
| 10 | docs(seo-tests): final README + AGENTS.md update + Phase 2 prompt template | `tests/seo/README.md`, `AGENTS.md`, `docs/seo-fix-prompt-template.md` | Sets up Phase 2 |

**Branch naming:** `feat/seo-tests-N-<slug>` for PRs 1–8; `ci/seo-tests` for PR 9; `docs/seo-tests-readme` for PR 10.

**Estimated wall-clock effort for Phase 1:** 4–6 hours of focused work, spread across however many sessions you want.

### Phase 2: Fix the audit issues (cloud-agent-led, Computer reviews)

After Phase 1 ships, each fix from the codebase analysis becomes one PR. Order from the report:

1. **C1** — Fix duplicate description render in `service-detail.tsx` (highest-impact)
2. **C2** — Code-split QB portal bundle
3. **C3** — Add internal links from QB home to deep landing pages
4. **I1** — Rewrite 17 short H1s
5. **I2** — Fix 5 identical-anchor patterns
6. **I3** — Compress 20 long anchors
7. **I4** — Trim 3 portal meta descriptions
8. **I5** — Trim one blog title
9. **I6** — Privacy/terms heading hierarchy
10. **I7** — Add missing alt on `/about`
11. **I8** — Mobile performance work
12. **M1–M8** — Polish, as time allows

Each Phase 2 PR follows this template:
1. Cloud agent receives the fix prompt (file path + remediation + expected behavior + test commands)
2. Agent makes code change, runs `pnpm test:seo`, observes failures (intended — those failures are the issue being fixed)
3. Agent removes the corresponding entry from `__known-issues__.json`
4. Agent runs `pnpm test:seo:update` to accept the new snapshot baseline
5. Agent runs `pnpm test:seo` again — must pass
6. Agent opens PR; preview deploys spin up; preview verifiers run
7. Computer reviews PR diff for: scope (only intended files changed), allowlist removal correct, snapshot diffs sensible
8. Computer approves and merges

## 6. Risk assessment

### What can go wrong

| Risk | Likelihood | Mitigation |
|---|---|---|
| Pixel-width calc is off vs Seobility's algorithm | Medium | Calibrate against `fixtures/seobility-pixel-widths.json` derived from the audit's actual measurements |
| Snapshot churn from non-deterministic builds (timestamps in HTML) | Medium | Normalize timestamps to `<TS>`; document in extractor |
| Cloud agent updates wrong snapshot or accepts unintended changes | Medium | PR review checklist + snapshot diffs visible in PR; structured snapshots make diffs readable |
| Render preview URL pattern changes | Low | Workflow uses interpolated URL; if format changes, update one place |
| Build time on CI is slow (full prerender of both sites) | Low-Medium | Cache `pnpm` and `node_modules`; consider build-output caching keyed on source hash later |
| Aggressive anchor rules (INV-015 to 017) cause false positives | High | All flagged in allowlist on PR #7; only enforced as Phase 2 progresses |
| TDD discipline breaks if pixel-width math is wrong | Medium | Write failing test against known-good Seobility values first; iterate until matches |

### What this design explicitly does NOT do

- Does not check Lighthouse / Core Web Vitals — out of scope
- Does not run dynamic crawls — only static dist/ HTML
- Does not test JS-rendered content — explicitly tests pre-hydration HTML (which is what crawlers see)
- Does not enforce content quality (readability, keyword density) — would require human judgment

## 7. Success criteria

The suite is "done" (Phase 1 complete) when:

1. ✅ `pnpm test:seo` runs locally and passes against current `main`
2. ✅ All 10 PRs merged with green CI
3. ✅ Branch protection ruleset includes `seo-tests/local-tests` and `seo-tests/preview-verifiers` as required status checks
4. ✅ A test PR that intentionally introduces a regression (e.g., changes a canonical) is rejected by CI
5. ✅ A test PR that intentionally accepts a new snapshot via `--update` is accepted by CI
6. ✅ `__known-issues__.json` enumerates every pre-existing audit finding with route + rule ID
7. ✅ `AGENTS.md` describes the snapshot-update workflow for cloud agents

Phase 2 is "done" when `__known-issues__.json` is empty for all rule IDs except those the user explicitly accepts as wontfix.

## 8. Open questions

None blocking — all major decisions are locked. Two minor items to resolve during implementation:

- **Q1:** Should we add an additional invariant for image dimensions (`width`/`height` attributes for CLS prevention)? Defer to PR #7; if implementation is trivial, include.
- **Q2:** Should the snapshot driver also fingerprint the sitemap.xml itself (URL set + lastmod)? Defer to PR #6; likely yes, as a separate `sitemap.snap.json` per site.

---

## 9. Approval gate

This spec needs the user's approval before any code is written. Reviewer should answer:

1. Architecture (section 4) — is the four-layer separation right?
2. Phasing (section 5) — is the 10-PR breakdown for Phase 1 too granular, too coarse, or right?
3. Invariant rules (section 4.2 Layer 2) — any rules to add, remove, or soften?
4. Risks (section 6) — any unaddressed concerns?

Once approved, Computer creates PR #1 (the scaffold) and Phase 1 begins.
