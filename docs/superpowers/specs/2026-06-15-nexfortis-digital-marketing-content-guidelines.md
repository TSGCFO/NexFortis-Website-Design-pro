# NexFortis Digital-Marketing Content Guidelines

Date: 2026-06-15 · The human-readable half of the content gate. Machine-enforced constants live in
`artifacts/nexfortis/src/lib/brand-voice.ts`; the gate is
`tests/seo/dm-service-pages.content.test.mjs`. Keep them in sync.

## Voice

A senior consultant who genuinely wants the client to win — plain-spoken, specific, and confident
without hype. We sell outcomes (leads, revenue, visibility), not jargon. Canadian English. Short
sentences. Concrete examples over adjectives.

## Hard rules

1. **No fabrication.** Never invent stats, testimonials, case studies, client names, or
   credentials. If a real proof point isn't available, omit the claim.
2. **Every statistic is sourced.** Use a real, named source rendered as an outbound citation
   (`StatBand`). Verify the figure and the URL before shipping.
3. **No banned phrases** (see `brand-voice.ts`): world-class, cutting-edge, synergy, seamless,
   game-changing, state-of-the-art, one-stop shop, take your business to the next level, etc.
4. **Reading level**: aim Grade 8–9; keep most sentences under ~30 words.
5. **Approved CTAs** point to `/contact`: "Get a Free Quote" (primary, site-wide), "Book a Free
   Consultation", "Talk to a Specialist", "Request a Proposal".
6. **Descriptive internal links only.** Use the canonical `linkText` from `internal-links.ts`; never
   "click here", "learn more", "read more".

## Required proof elements

| Element | Spoke page | Pillar page |
|---|---|---|
| Rendered words | ≥1,200 (target 1,200–1,800) | ≥2,000 |
| Sourced stats (cited) | ≥3 | ≥3 |
| Internal links | ≥3 | ≥3 (plus the spoke grid) |
| FAQ entries (FAQPage schema) | ≥4 | ≥6 |
| Author bio + Person schema | yes | yes |
| Service + Breadcrumb + FAQPage schema | yes | yes |

## Page section order

**Spoke**: hero (h1) → breadcrumb → intro + StatBand → "What's included" (FeatureGrid) → "How we
deliver" (StepsTimeline) → comparison (FeatureComparison) → pricing reference → testimonial (if
real) → related services → FAQ → author bio → CTA.

**Pillar**: hero → intro + StatBand → published-services grid (linked) → remaining-capabilities grid
(non-linked) → coverage sections (search / AI search / the rest) → how we work → why NexFortis →
FAQ → author bio → CTA.

## Heading hierarchy

Exactly one content `<h1>` (the hero). Every section heading is `<h2>`; cards, steps, and pricing
titles are `<h3>`. Never skip a level. (The only exceptions are the pre-existing global footer/
noscript headings, allowlisted site-wide.)

## Meta

Title ≤60 chars before the auto-appended " | NexFortis IT Solutions" — keep the page-specific part
≲30 chars and avoid "&" (it escapes to `&amp;` and widens the title). Description 140–160 chars,
benefit-led, includes the primary keyword once.
