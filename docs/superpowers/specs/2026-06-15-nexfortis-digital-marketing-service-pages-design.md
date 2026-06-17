# Design Spec — Digital-Marketing Service Pages (Hub-and-Spoke)

Date: 2026-06-15 · Status: Pilot shipped (Phase 0 + Phase 1) · Branch: `claude/sweet-gauss-aqsk4o`

## Problem & goal

NexFortis has strong technical/programmatic SEO but weak **content** SEO: the whole
digital-marketing offering was one page where each service was a one-line blurb — too broad to
rank for terms like "local SEO" or "AI search optimization". The goal is to break it into a
hub-and-spoke cluster of detailed, individually-rankable pages, each better than the surveyed
competitors', porting the content-SEO patterns from the sibling S Care Companion repo **without
disturbing the locked technical-SEO machinery** (prerender, sitemap, schema, the 20-rule SEO
invariant suite).

## Why 13 pages, not 104

The competitor "104-item" research is a catalog of *operational deliverables* (SOPs), not search
topics. Building 104 pages would cause keyword cannibalization and trigger doorway/thin-content
penalties. The 104 are covered across three tiers: **13 commercial spokes** (intent-targeted page
titles), **page depth** (each spoke absorbs its category's sub-deliverables as "What's included" /
process / FAQ), and the **blog/guide cluster** (informational long-tail). Page *volume* scales later
via a geo × industry landing-page layer, not by fragmenting the spine.

## Information architecture

- Pillar (rewritten in place, URL preserved): `/services/digital-marketing`.
- 13 spokes at `/services/digital-marketing/<slug>`: `seo`, `technical-seo`, `local-seo`,
  `google-business-profile`, `content-marketing`, `link-building`,
  `generative-engine-optimization`, `google-ads`, `social-media-marketing`, `web-design`,
  `email-marketing`, `conversion-rate-optimization`, `analytics-reporting`.
- Future (not built): location `…/<service>/<city>` and industry `…/<service>/for-<industry>` pages
  (still fully static, so prerender/sitemap pick them up automatically).

A `published` flag on each spoke (in `src/lib/internal-links.ts`) gates linking, so the pillar and
RelatedServices never link an unbuilt route.

## Keyword validation (Ahrefs, Canada)

Pilot terms confirmed real and commercial: `seo services` (vol 4,300 / KD 31), `seo company`
(3,800 / KD 6), `seo agency` (4,400 / KD 19), `local seo services` (3,300 / KD 24, commercial) vs
bare `local seo` (1,900 / KD 82, informational), `generative engine optimization` (1,000 CA /
31,000 global), `digital marketing services` (2,300 / KD 10, SERP shows an AI Overview). The SEO
page weaves in "SEO company/agency" to capture the easier, larger variants; the Local SEO page
leads with "local SEO services" (the commercial term).

## Implementation pattern (ported from S Care Companion)

- **Content/template/data separation**: thin wrapper (`<slug>.tsx`) → shared template
  (`_DmSpokePageBody.tsx`) → typed data module (`_dmContent.tsx`).
- **Reusable content components** in `src/components/content/`: `InlineLink`, `StatBand`,
  `FeatureGrid`, `FeatureComparison`, `StepsTimeline`, `PricingReference`, `CalloutBox`,
  `RelatedServices`, `CTAStrip`, `AuthorBio`, `Testimonial` (+ shared `types.ts`).
- **Typed internal-link graph** (`src/lib/internal-links.ts`): canonical `linkText`/`title` per
  spoke keep every anchor unique-per-href (INV-015) and descriptive (INV-017).
- **Schema reuses the existing component-based `seo.tsx`** (Service + Breadcrumb + FAQPage; global
  Organization/LocalBusiness/WebSite come from `layout.tsx`). Only additive change: `PersonSchema`
  (author EEAT) and an optional `serviceType` on `ServiceSchema`.
- **EEAT**: every stat carries a real, named source rendered as an outbound citation; author bio +
  Person schema; testimonial/case-study blocks render only when real data exists (no fabrication).

## What shipped in the pilot (Phase 1)

Pillar rewrite + 3 spokes: **`seo`, `local-seo`, `generative-engine-optimization`** (core money
page, GTA local-intent fit, and the GEO/AI-search differentiator). All prerender, appear in the
sitemap at priority 0.8, pass the 20 SEO invariants and the new content gate.

## Content QA gate

`tests/seo/dm-service-pages.content.test.mjs` (local TDD gate, like the QB content test) enforces:
spoke ≥1,200 / pillar ≥2,000 words; zero banned phrases (mirrors `src/lib/brand-voice.ts`); meta
title ≤60 / desc ≤160 chars; ≥3 internal links; ≥3 external sourced-stat citations; ≥4 FAQ via
FAQPage JSON-LD; Service + Person JSON-LD + author named in body; no reused prose paragraphs
within/across the cluster.

## Verification (all green)

`pnpm typecheck` · `pnpm --filter @workspace/nexfortis run build` (20/20 routes prerendered) ·
`pnpm test:seo:update` (3 new + pillar + sitemap snapshots) · `pnpm test:seo` (20/20 invariants) ·
`node --test tests/seo/dm-service-pages.content.test.mjs` (8/8).

## Pre-existing allowlist note

The 3 new spoke routes were added to the INV-001 (noscript `<h1>`) and INV-008 (footer H2→H4)
allowlists. These are **pre-existing global-layout findings** already allowlisted for all 17
nexfortis routes (issues M1 / I6), not violations the new pages introduce.

## Scaling plan & open items

- Phase 2: remaining 10 spokes in batches of 3–4 (flip `published` → true, add wrapper + content +
  route + snapshot baseline per PR).
- Phase 3/4: geo and industry landing pages on the same template, with real local/vertical data.
- **Assets needed from Hassan** to deepen EEAT: confirmed author title/credentials; real client
  case-study metrics and testimonials (with permission); the final approved CTA list. Sections
  render only when real data is supplied.
