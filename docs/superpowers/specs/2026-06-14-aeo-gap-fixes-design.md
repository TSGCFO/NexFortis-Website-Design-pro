# AEO Gap Fixes — Design Spec

**Date:** 2026-06-14
**Author:** Hassan Sadiq (via Perplexity Computer)
**Branch:** `seo/aeo-gap-fixes`
**Status:** Approved for implementation planning

---

## Background

Both NexFortis sites (main marketing site `nexfortis.com` and the QuickBooks
conversion portal `qb.nexfortis.com`) already have a strong AEO (Answer Engine
Optimization) foundation: comprehensive JSON-LD schema (Organization,
LocalBusiness, Service, FAQPage, HowTo, BreadcrumbList, Article), a shared
cross-host entity identity ("NexFortis IT Solutions" with stable `@id`
references), prerendering so AI crawlers see real HTML, and answer-shaped
FAQ/definition/comparison content.

A codebase audit identified gaps. This spec covers the four the user chose to
close. Off-site presence work (Wikipedia/Reddit/reviews) is explicitly OUT of
scope — it is marketing, not a codebase change.

## Non-negotiable process constraint

**Nothing is committed or pushed directly to `main`. All changes go through
Pull Requests for the user to review and merge.** The assistant does not merge.
All work happens on feature branches.

## PR structure

- **PR 1 — "AEO discovery files" (static, zero-risk):** robots.txt (both sites)
  + llms.txt (both sites). Static files in `public/`, no build changes.
- **PR 2 — "Generated pricing.md" (build change):** new build script for the
  QB portal that generates `pricing.md` from the catalog, wired into the build.
- **Monitoring:** not a PR. Baseline run now + scheduled recurring task.

---

## Workstream 1 — Unblock AI crawlers (PR 1)

**Files:** `artifacts/nexfortis/public/robots.txt`,
`artifacts/qb-portal/public/robots.txt`

**Change:** Move these bots from the blocked group into the allowed group,
respecting the same path exclusions the other allowed bots use (portal keeps
`/portal`, `/admin`, `/order`, checkout paths excluded):

- GPTBot
- anthropic-ai
- ClaudeBot
- Claude-Web
- Google-Extended
- cohere-ai
- CCBot

**Keep blocking:** Bytespider, Omgilibot (low-value scrapers, drive no
citations).

**Implementation note (verified against current files):** the existing allowed
bots (PerplexityBot, Applebot, OAI-SearchBot, etc.) each carry an identical
path-exclusion block. The 7 newly-unblocked bots get the SAME block copied
verbatim:
- Portal: `/portal`, `/portal/`, `/login`, `/register`, `/forgot-password`,
  `/reset-password`, `/order`, `/order/`, `/auth/callback`, `/admin`, `/admin/`,
  `/admin/mfa-enroll`, `/admin/mfa-challenge`, `/ticket`, `/ticket/`
- Main site: `/admin/login`, `/blog/admin`
The `User-agent: *` default and `Sitemap:` lines stay unchanged.

**Rationale:** Maximize citation eligibility across ChatGPT, Gemini / Google AI
Overviews, Claude, and Perplexity. For a new business, discoverability outweighs
protecting content from training. Login/checkout/admin paths remain excluded
from all crawlers.

---

## Workstream 2 — llms.txt (PR 1, static, both sites)

Hand-authored files per the llmstxt.org spec, placed in each site's `public/`
so they deploy at the site root. Uses the canonical org identity
"NexFortis IT Solutions" to reinforce the cross-host entity link.

**`nexfortis.com/llms.txt`** — verified routes from `App.tsx`:

```
# NexFortis IT Solutions

> Canadian IT services company (Nobleton, ON) providing managed IT,
> Microsoft 365, QuickBooks migration, digital marketing, and workflow
> automation for small-to-medium businesses across Canada.

## Services
- [Services overview](https://nexfortis.com/services)
- [IT Consulting & Managed IT](https://nexfortis.com/services/it-consulting)
- [Microsoft 365](https://nexfortis.com/services/microsoft-365)
- [QuickBooks Migration & Tools](https://nexfortis.com/services/quickbooks)
- [Digital Marketing](https://nexfortis.com/services/digital-marketing)
- [Workflow Automation](https://nexfortis.com/services/workflow-automation)

## Key pages
- [About](https://nexfortis.com/about)
- [Contact](https://nexfortis.com/contact)
- [Blog](https://nexfortis.com/blog)
```

**`qb.nexfortis.com/llms.txt`** — verified public routes from `App.tsx`:

```
# NexFortis IT Solutions — QuickBooks Conversion Portal

> Productized, fixed-price QuickBooks file conversion and data migration
> services for Canadian businesses (Enterprise/Premier/Pro conversions, file
> recovery, .QBM handling, add-ons). Operated by NexFortis IT Solutions,
> Nobleton, ON.

## Key pages
- [Service catalog](https://qb.nexfortis.com/catalog)
- [FAQ](https://qb.nexfortis.com/faq)
- [QBM file guide](https://qb.nexfortis.com/qbm-guide)
- [Subscription / support plans](https://qb.nexfortis.com/subscription)
- [Pricing (machine-readable)](https://qb.nexfortis.com/pricing.md)

## Notes
- Individual services live under /service/<slug>; categories under
  /category/<slug> — all linked from the catalog.
- Portal, login, checkout, and admin routes are private and excluded.
```

Maintenance: near-zero (page maps, not content).

---

## Workstream 3 — pricing.md (PR 2, build-generated, QB portal only)

**New file:** `artifacts/qb-portal/scripts/generate-pricing.mjs`, modeled on the
existing `scripts/generate-sitemap.mjs`.

**Behavior:**
- Reads the product catalog (the data exposed by `src/lib/products.ts` /
  `products.json`): `name`, `category`, `base_price_cad`, `launch_price_cad`,
  `turnaround`, `deliverable`.
- **Prices are stored in CENTS** — divide by 100 and format as CAD with 2
  decimals (matches `seo-schemas.ts` line 153: `(launch_price_cad / 100)`).
- Respect promo logic: show both launch price and regular (base) price per
  item so the file is accurate regardless of `promo_active` state.
- Emits clean markdown grouped by category, written to BOTH `public/pricing.md`
  and `dist/public/pricing.md` (same dual-write pattern as the sitemap script).
- Wired into the portal `build` script after prerender:
  `... && node scripts/generate-sitemap.mjs && node scripts/generate-pricing.mjs`
- Add a `"pricing"` npm script alias mirroring the `"sitemap"` alias.

**Discoverability (DECIDED):** `pricing.md` is discoverable via three paths and
is **NOT** added to `sitemap.xml` (it is a utility file, not an HTML page):
1. The portal `llms.txt` links to it directly (primary AI-agent path):
   `- [Pricing (machine-readable)](https://qb.nexfortis.com/pricing.md)`
2. Predictable root URL convention (`/pricing.md`).
3. A normal in-page hyperlink to `/pricing.md` (e.g., footer or catalog page)
   so any link-following crawler can reach it. Exact placement decided in the
   implementation plan.

Sitemaps target search-engine indexing of HTML pages; AI agents do not rely on
the sitemap to find utility files, so adding it there would mainly signal
Googlebot (undesired for a non-page) with no agent-discovery benefit.

**Why its own PR:** touches the build pipeline → real deploy risk → deserves
focused review (verify script output + confirm build still passes the existing
`seo-tests.yml` and `post-deploy-prod-verify.yml` CI workflows).

---

## Workstream 4 — AI-visibility monitoring (no repo changes)

**Baseline now:** ~15 priority queries checked across AI engines (ChatGPT,
Perplexity, Google AI Overviews, Claude) to record whether nexfortis.com /
qb.nexfortis.com is cited. Logged as a baseline table. Example queries:
- "QuickBooks Enterprise to Premier conversion Canada"
- "QuickBooks file conversion service cost Canada"
- "managed IT provider Nobleton Ontario"
- "Microsoft 365 migration consultant Ontario small business"
- "cheapest QuickBooks data conversion service"
(Full list finalized at baseline time.)

**Recurring task:** scheduled check (proposed monthly — confirm cadence before
scheduling) that re-runs the queries, flags new own-citations and competitor
citations, and notifies the user. Each run consumes credits.

---

## Acceptance criteria

- [ ] PR 1: both robots.txt files unblock the 7 listed bots, still block
      Bytespider/Omgilibot, still exclude login/checkout/admin paths.
- [ ] PR 1: both llms.txt files present in `public/`, valid llmstxt.org format,
      correct verified URLs, canonical org name.
- [ ] PR 2: `generate-pricing.mjs` produces accurate CAD pricing (cents/100),
      grouped by category, dual-written, wired into build; CI passes.
- [ ] PR 2: `pricing.md` linked from portal `llms.txt` + an in-page hyperlink;
      NOT added to sitemap.xml.
- [ ] Both PRs open for user review; nothing merged to main by the assistant.
- [ ] Monitoring: baseline table delivered; recurring task scheduled at
      user-confirmed cadence.

## Out of scope

- Off-site presence (Wikipedia, Reddit, review sites, YouTube).
- llms-full.txt (full-text variant) — minimal index only.
- Any change to existing schema, prerendering, or content.
