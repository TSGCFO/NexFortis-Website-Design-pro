# Step 4 — Local SEO page outline (LOCKED, grounded) — /services/digital-marketing/local-seo

**Primary:** `local seo services` · **Date:** 2026-06-21 (rebuild; supersedes the reverted hand-authored outline)
**Source:** KI auto-generate outline — brief `09843ffb-46e6-4e75-9538-01a158ca3fb6`, `auto_generate_order_id` `a2282990-4701-4746-bdc0-d844540b8b25`; raw in `seo-tools/tmp/outline-09843ffb-….json` (80 items: 1 H1, 7 H2, 7 H3, 40 li, 9 p, 16 strong). Steering (`additional_context`) in `seo-tools/tmp/local-seo-outline-ctx.txt` — mirrors the proven SEO-spoke template. **KI-GENERATED, then REVIEWED & GROUNDED** against the brief's `serp_page` (19 ranking pages), `people_also_asked`, and `questions`. Never hand-authored.

## Grounded-review result

KI's outline MATCHES the real ranking SERP intent (transactional local-SEO service pages) and groups the sub-services under one H2 as steered. Real local-SEO ranking themes covered: Google Business Profile (optimization + management), local citations / NAP consistency, Google Map Pack / local rankings, reviews & reputation, near-me / local keyword optimization, multi-location / service-area businesses. Reconciliations / flags (not blind-accepted):

- **Template fold (Step-7 pattern, mirrors SEO page):** KI H2 "Who Our Local SEO Services Are For" folds into the intro callout (not a standalone rendered H2); "FAQ" renders as the template's fixed **"Frequently Asked Questions."** → locked gate `04-outline.json` = 6 H2.
- **FAQ timeline claim FLAG (Step 6a):** the FAQ answer "60–90 days … 3–6 months" is a generic industry expectation — verify/soften at fact-check so it never reads as a guarantee (per `_facts.md`; no fabricated timelines/guarantees).
- **GBP fold-in CONFIRMED:** all 3 GBP keywords owned by local-seo (keyword-ownership.json) — covered as a lead sub-service, not a separate page.
- **Keyword coverage:** all 9 owned keywords (primary + 8 secondary) present in the KI outline (checked).
- **No fabrication:** pricing scoped-after-audit (no invented prices); no invented clients/stats/awards.

## Locked outline (KI-generated)

- **H1:** Local SEO Services by NexFortis | Canadian Local SEO Agency  *(rendered H1 reconciled at Step 7 → "Local SEO Services for Canadian Businesses", per SEO-page precedent)*
- **H2 1. What NexFortis Local SEO Services Include** — end-to-end local SEO tied to outcomes (calls, direction requests, local conversions); Canadian local SEO agency / company framing; flexible engagement (consultant vs full-service agency).
- **H2 2. Our Local SEO Services** *(one section, grouped points)* — Google Business Profile optimization & management · Local citations & NAP consistency · Google Map Pack & local rankings · Review & reputation building · Near-me / local keyword optimization (service + location pages, schema, internal linking).
- **H2 3. Who Our Local SEO Services Are For** *(folds into intro callout at render)* — small businesses, brick-and-mortar, service-area businesses (SABs), multi-location, currently-invisible businesses, those burned by other agencies.
- **H2 4. Our Local SEO Process** — Free Local SEO Audit → Strategy → Execution (in-house) → Monthly Reporting & ongoing management.
- **H2 5. Why Choose NexFortis for Local SEO** — local SEO as core competency; custom (not templated); current with GBP/Map-Pack changes; transparent reporting; outcomes over vanity metrics; dedicated point of contact.
- **H2 6. Local SEO Pricing After a Free Audit** — no fixed price; scoped by market/locations/baseline/goals; flexible models (project GBP → ongoing monthly); CTA to free audit.
- **H2 7. FAQ → "Frequently Asked Questions"** — what's included · local vs general SEO agency · how long to results *(soften timeline)* · small-business budgets · multi-location · how to get started.

## Owned secondary keywords to cover (keyword-ownership.json → local-seo) — for the coverage gate

`local seo company` · `local seo agency` · `local seo service` · `local seo consultant` · `local seo services for small business` · `google business profile optimization` · `google business profile management` · `google business profile services`. (Primary: `local seo services`.)

## Draft directives (Step 5)

- **~1,500–1,600 words** within the locked content-gate band **1,100–1,900** (`tests/seo/dm-word-targets.json` → local-seo). Beat the thin SERP (median ~160w); match the robust cluster (seodepot 1,430). KI `word_count_avg` 456 is artificially low — ignore.
- **Canadian English** (-ize: optimization; -our: behaviour/colour).
- **Ground strictly in `_facts.md`** — NO invented stats, client results, testimonials, prices, guarantees, or ranking timelines (soften the 60–90-day FAQ line).
- Every owned secondary keyword present (keyword-coverage gate).
- Internal links: pillar `digital-marketing` + `seo`, `reputation-management` (reviews), `web-design`, `content-marketing`, `geo-ai-search` where referenced. (Geo `[city]` pages are Phase B.)
- CTA: free local SEO audit/consultation. Schema: Service + Person (Hassan Sadiq) + FAQPage. Use "and" not "&" in headings.
- **Meta targets (Step 7, mirroring the locked SEO page — these are the per-page "target characters"):** `metaTitle` short, **≤60 chars**, pattern "Local SEO Services in Canada"; `metaDescription` **≤160 chars (SEO landed 144)**, pattern "Canadian local SEO company: Google Business Profile, citations, Map Pack rankings, reviews. Founder-led, month-to-month, built to rank and convert. Free local SEO audit."; `h1` = "Local SEO Services for Canadian Businesses" (locked in `04-outline.json`). EEAT: same honest author box (Hassan Sadiq, Founder & CEO; 15+ yrs enterprise tech; Microsoft Solutions Partner) — confident framing of TRUE facts only; ≥3 distinct cited stat URLs, each live-verified at Step 6a. EEAT scored via `aaron-seo-geo:content-quality-auditor` (never self-grade).
