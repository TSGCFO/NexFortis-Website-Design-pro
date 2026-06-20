# Step 2 — National Page Map + Cannibalization (LOCKED candidate)

**Date:** 2026-06-20 · **Clustering:** KI order `b0574d01` (agglomerative, grouping_accuracy 2, hub medium, cluster+context+rank, Canada). Raw: `seo-tools/tmp/national-clusters-acc2.json` (+ acc5 preserved). Registry: `seo-tools/runbook/keyword-ownership.json` (**PROMOTED 2026-06-20, supersedes & discards PR #107 spoke set**) → **cannibalization check PASSED (87 kw / 12 pages, 0 overlaps).**

## Interpretation (why business-logic grouping, not KI's 50 clusters)

KI clusters by **SERP overlap**, not by business service. At accuracy 2 it merged genuinely co-ranking synonyms (Local SEO 6→1, Web Design 4→1, Link Building 5→1, Reputation 5→1, Content 3→1, CRO 3→1, AI-SEO 2→1) but kept SERP-distinct terms apart (`seo services` vs `seo company`/`agency`; PPC/Google-Ads variants). That's **SERP reality, not a lever issue** — so pages are grouped by service (business logic), using KI's intent/journey/SERP data to assign terms and decide include/exclude. Iterating clustering further to force 13 clusters would be a rabbit hole (the SERPs genuinely differ).

## The 12 national pages (Phase A — hubs)

All under `/services/digital-marketing/`. Primary = H1 target; (full clusters in candidate registry).

| Page | Primary (H1) | Key cluster terms | Notes |
| --- | --- | --- | --- |
| **digital-marketing** (PILLAR, exists) | digital marketing services | agency/company/firm/online/internet… | hub → links all spokes |
| **seo** | seo services *(Transactional/BOFU, 4300)* | seo company/agency/professional/consultant; **technical seo** + **ecommerce seo** folded as sections | technical-seo & ecommerce-seo = sub-page candidates later |
| **local-seo** | local seo services *(3300, KD6)* | local seo company/agency/consultant/small-business; **GBP** folded as a section | GBP is info/branded → section, not own page |
| **web-design** | web design services | web design company/agency/custom/best; **website-maintenance** folded in as a section | KD high (55–95) |
| **google-ads-ppc** | google ads management | google ads agency/services; **PPC** agency/services/management mesh | Google Ads + PPC = one line |
| **social-media-marketing** | social media marketing services | agency/company/companies | |
| **content-marketing** | content marketing services | agency/service/b2b/video | |
| **link-building** | link building services | service/seo-link-building/packages/outreach | |
| **geo-ai-search** | generative engine optimization | answer engine optimization, ai seo services/agency/optimization | the 2026 differentiator; intent still emerging-info |
| **reputation-management** | reputation management services | online rep mgmt services/agency, company, brand | promoted by data (KD3–6, $8 CPC) |
| **email-marketing** | email marketing services | agency/company/automation/small-business | |
| **conversion-rate-optimization** | conversion rate optimization services | agency/company/consultant | low vol, premium CPC ($16–17) |

## Borderline calls (flagged for confirmation)

- **Technical SEO** + **Ecommerce SEO** → folded into the SEO page as sections (low standalone vol, but KD0 — could split into own sub-pages later).
- **GBP** → section of Local SEO (informational/branded intent).
- **Website Maintenance** → folded into Web Design as a section (CONFIRMED — not a standalone page).
- **Analytics & Reporting** → DROPPED from the page set (no commercial buyer demand surfaced); becomes a cross-cutting "reporting" section within each service.
- **Google Ads + PPC** → merged into one page (both target the same buyer).

## Relationship to PR #107 (the prior 13-spoke guess)

This grounded map DIFFERS from PR #107's spokes: GBP/technical-seo/analytics become sections-or-dropped; PPC merges into Google Ads; reputation-management, geo-ai-search (merged), website-maintenance are new. **This map supersedes the PR #107 spoke set** (the "done wrong" guess). Phase A builds fresh per this map.

## Next

On confirmation: promote candidate → `seo-tools/runbook/keyword-ownership.json`, then Phase A page builds (run-book chain) starting with **SEO** (highest-demand, transactional head). Phase B = `[service]+[city]` geo layer.
