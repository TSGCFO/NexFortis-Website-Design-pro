# Step 0 — Service-Page Information Architecture (the map that grounds the chain)

**Date:** 2026-06-20 · **Status:** approved candidate hypothesis (validated by Steps 1–2) · **Domain:** nexfortis.com

## Objective

NexFortis.com has ONE page under Services — "Digital Marketing." Market that NexFortis sells **all 104 line items** in `seo-tools/Nexfortis-competitor-services.md` (104 deliverables / 10 categories, scraped from 19 GTA/Canadian agencies) as **strategically-grouped service subpages under `/services/digital-marketing`**. Rank AND sell-everything.

## Method (non-negotiable)

The run book is a **dependency chain** — each step is the INPUT to the next. Bad upstream compounds downstream. An "off" output is a **symptom of an upstream step done wrong**, never a caveat to patch. Trace anomalies upstream.

## Geography (decided: option D)

**Geo layer ELEVATED to primary** (data-driven, 2026-06-20): buyer demand is dominated by `[service]+[city]` at KD 0–30 (e.g. `local seo toronto` KD 0, `seo services calgary` KD 15). Two layers built together:
- **National (Canada)** service hubs — the `[service]` pages.
- **Geo `[service]+[city]`** — **every GTA municipality** (Toronto, Mississauga, Brampton, Markham, Vaughan, Richmond Hill, Oakville, Burlington, Oshawa, Pickering, Ajax, Whitby, Milton, Newmarket, Aurora, Caledon, Halton Hills, Georgina, King, Whitchurch-Stouffville, East Gwillimbury, Uxbridge, Brock, Scugog, Clarington) **+ major Canadian metros** (Vancouver, Calgary, Ottawa, Edmonton, Montreal, Winnipeg, Hamilton, Kitchener-Waterloo, London, Halifax, etc.).
- Each geo page needs **genuine local content** (not templated thin pages) to avoid the doorway-page penalty (report Caveat #4). URLs geo-extensible: `/services/digital-marketing/<service>/<city>`.
- Expansion engine = **Ahrefs matching-terms + Semrush** (KI keyword-discovery is dashboard-only `/v2/` Bearer, a noisy volume-less idea-net — skipped; see `ki-api-levers`).

## Grouping framework (decided: B validated by C)

Lay out candidate buyer-facing service lines from the report; **real demand (Step 1) + KI clustering (Step 2) decide** which earn a URL, the exact buyer-language names, and which Tier-2 sub-pages exist. Every line item is represented *somewhere* (sales goal); only demand-backed services get a URL (SEO goal). **104 items ≠ 104 pages** — thin templated pages = doorway-page penalty (report Caveat #4).

## Approved candidate architecture

**Pillar (exists):** `/services/digital-marketing` — Digital Marketing Services (hub → links all lines).

| # | Service line *(name provisional — Step 1 sets it)* | Owns (report) | Tier-2 sub-page candidates *(demand-gated)* |
| --- | --- | --- | --- |
| 1 | SEO Services | Cat 1 strategy (1.4–1.7) + Cat 3 On-Page | SEO Audit (1.1/1.2), Keyword Research (1.5) |
| 2 | Technical SEO | Cat 2 (16) | Core Web Vitals/Site Speed, Schema Markup |
| 3 | Local SEO | Cat 6 (8) | Citation Building, Local Landing Pages → Layer 2 |
| 4 | Google Business Profile Mgmt | Cat 7 (10) | — |
| 5 | Content Marketing | Cat 4 (10) | Blog Writing, Website Copywriting |
| 6 | Link Building | Cat 5 (9) | — |
| 7 | GEO / AI Search | Cat 9 (7) | — |
| 8 | Google Ads / PPC | 10.1, 10.2 | Local Services Ads (Google Guaranteed) |
| 9 | Social Media Marketing | 10.3, 10.4 | Meta/Facebook Ads Mgmt |
| 10 | Web Design & Development | 10.5, 10.6 | Website Care Plans |
| 11 | Email Marketing | 10.8 | — |
| 12 | Conversion Rate Optimization | 10.10, 8.8, 1.10 | — |
| 13 | Analytics & Reporting | Cat 8 (8) | — |

### Judgment calls (approved)

- **GBP is its own line** (strong standalone GMB/GBP demand), not folded under Local SEO.
- **Technical SEO is its own line**, not buried in SEO.
- **Category 1 process items** (discovery call, personas, baseline, roadmap, quarterly review) are **not pages** — they're "how we work" content inside the pillar/service pages. Exception: **SEO Audit** = its own lead-magnet page.
- **Auxiliary low-demand** (CRM 10.9, Logo/Brand 10.7, Web Chat 10.12, Reputation Mgmt 10.11) = **sections/mentions** for now; promote to pages only if Step 1 shows demand.

### Where all 104 land (nothing lost)

Cat 1 → SEO Services (+ SEO Audit page). Cat 2 → Technical SEO. Cat 3 → On-Page section of SEO Services. Cat 4 → Content Marketing. Cat 5 → Link Building. Cat 6 → Local SEO. Cat 7 → GBP. Cat 8 → Analytics & Reporting. Cat 9 → GEO/AI Search. Cat 10 → split: Ads (10.1–10.3), Social (10.3–10.4), Web (10.5–10.6), Email (10.8), CRO (10.10) as lines; CRM/Logo/Chatbot/Reputation as sections.

## Step-1 seed strategy

Seeds = **buyer-facing service terms only** (never internal sub-tasks like canonical tags / xml sitemap / alt text). Exclude bare "digital marketing" (pillar's informational head). 13 service-line heads + buyer synonyms (services/company/agency/management) + Tier-2 sub-page candidate terms. Validate with 3-tool volume/difficulty/intent (DataForSEO + Ahrefs + Semrush) and expand the universe with KI `/api/keyword-discovery/`.

## Chain execution (per page, after the map is validated)

Step 1 keyword research (3-tool, grounded in report seeds) → Step 2 KI clustering with **deliberate levers** (clustering_method, grouping_accuracy, hub_creation_method) + one-page-one-cluster cannibalization gate → Step 3 KI brief → Step 4 KI auto-outline steered via `additional_context`, curated/locked to `04-outline.json` → Step 5 Claude draft (enforces NexFortis brand + Canadian English) → Step 6 fact-check/EEAT/humanize/plagiarism + keyword-coverage gates → Step 7 link wiring + nav → Step 8 publish QA. See `ki-api-levers` memory.
