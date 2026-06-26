# NexFortis Content SEO Run Book (canonical)

The validated, repeatable pipeline for producing a ranking, converting page for the
NexFortis marketing site. Built and stress-tested across the SEOwind + Keyword Insights
evaluation. This is the process every page goes through — the pillar, the 11 service
spokes (the 12-page map), the Phase B geo `[service]+[city]` pages, and later industry pages.

## The two gates (govern every decision in this run book)
1. **SEO / Google ranking first.** If a choice doesn't help the page rank, it loses.
2. **Then the customer journey / conversion.** Once ranking is satisfied, optimise for a
   real human deciding to buy — clarity, trust, and a clear next step.
Every step below is judged against these, in this order.

## The pipeline at a glance
1. Keyword research & generation → DataForSEO + Ahrefs (+ Semrush cross-check)
2. Cluster into pages + lock the **cannibalization map** → Keyword Insights clustering  ← HARD GATE 1
3. SERP analysis + content brief (per page) → Keyword Insights brief
4. Brief/outline review + **SERP-derived length** → Claude
5. **First-draft generation → Claude (PRIMARY writer)**
6. Post-draft gate stack → fact-check ▸ EEAT ▸ humanize ▸ plagiarism  ← HARD GATES 2 & 3
7. On-page finalization + internal-link wiring → typed hub-and-spoke link graph
8. Publish QA → 20-rule SEO invariant suite + content-QA gate + live page check

---

## Step 1 — Keyword research & generation
- **Tools:** DataForSEO (`seo-tools/dataforseo.mjs`), Ahrefs (MCP), Semrush (MCP) as a
  third cross-check. Location = **Canada** (Canada location_code 2124 for DataForSEO).
- The three tools **disagree, especially on difficulty** — take the **consensus**, don't
  trust any single tool's number.
- **Output:** the keyword universe with volumes + difficulty for the NexFortis topic space
  (digital marketing / SEO services, the GTA city/industry modifiers, etc.).

## Step 2 — Cluster into pages + lock the cannibalization map  (HARD GATE 1)
- **Tool:** Keyword Insights **clustering** (`seo-tools/keyword-insights.mjs cluster`) —
  groups keywords by **live SERP overlap**. SERP overlap is the data-driven definition of
  "same intent," which is exactly what Google cannibalizes on.
- **Rule: one page = one cluster.** Assign each cluster to exactly one page:
  - The **pillar** owns the head-term cluster.
  - Each of the **11 spokes** (the 12-page map) owns a distinct sub-intent cluster.
  - **No keyword appears on two pages. No cluster is split across pages.**
- **Gate (BUILT + WIRED):** the **keyword-ownership registry** is `seo-tools/runbook/keyword-ownership.json`
  (page → owned cluster/keywords) and the **cannibalization test** is `seo-tools/runbook/check-cannibalization.mjs`,
  which **runs as part of `test:seo`**. Add the new page's primary + secondaries to the registry, then run
  `node seo-tools/runbook/check-cannibalization.mjs` → must exit 0. No page proceeds until it owns a clean,
  non-overlapping cluster.
- Why this is a hard gate: with 1 pillar + 11 near-topic spokes (+ Phase B geo pages), cannibalization is the
  default failure mode — two pages competing for the same query split authority and both lose.

## Step 3 — SERP analysis + content brief (per page)
- **Tool:** Keyword Insights **content brief** (`keyword-insights.mjs brief` →
  `wait-brief`). One call returns the live SERP pages, **competitor word counts**, the
  People-Also-Ask / Reddit / Quora **questions**, and **secondary keywords with volumes**.
- Fully programmatic, no browser. Use the **NexFortis workspace folder** (folder_id in
  `secrets.local.json`) so briefs land in the right workspace.
- **Output:** the structured brief = the research foundation for the page.

## Step 4 — KI outline generation + thorough review  (KI generates; Claude reviews/steers, NEVER hand-authors)
- **KI generates the outline** from the brief: `keyword-insights.mjs outline <order_id> "<additional_context>"`
  → `wait-outline <order_id> <auto_id>`. Steer via `additional_context` toward a **service-page**
  (transactional) structure — not the generic informational outline KI/SERP defaults to.
- **Both the brief (Step 3) and this outline are AI-generated in KI's backend and CAN hallucinate** —
  each requires a thorough, comprehensive, **big-picture review**: the brief against the scraped
  SERP/raw data, the outline against the brief.
- **Claude NEVER hand-authors the brief or outline.** If a KI output is off — even completely
  nonsensical — do NOT write it yourself. Diagnose WHY, then either fix it directly or **regenerate
  through KI with adjusted levers** (`additional_context` for the outline; keyword/location for the
  brief; clustering method/accuracy/hub) and re-review. (This is a HARD rule — authoring it myself is
  the exact failure that invalidated the first local-seo build.)
- **Length is SERP-derived, NOT a fixed 1,200 words.** Read the competitor word counts in the brief;
  identify the **service-page subset**; beat the thin pages without ballooning to guide length.
- **Re-confirm the cannibalization gate:** the outline targets only this page's cluster.
- **Output:** a reviewed, cannibalization-safe, intent-correct outline locked to `<slug>/04-outline.json`
  (reconciled to the app template's rendered headings) + the target word range.

## Step 5 — First-draft generation  →  Claude (PRIMARY writer)
- **Claude writes the first draft.** This is a locked decision (see "Why Claude writes" below).
  Inputs: the brief research + the Step-4 outline + **NexFortis's real facts** (brand voice,
  services, GTA/Mississauga + 905 focus) + the **hard guardrails**:
  - **No fabricated statistics; no invented clients, numbers, awards, prices, or
    capabilities NexFortis has not demonstrated.**
  - Canadian English; speak to the business owner; outcomes-first (calls/leads/booked jobs);
    service-page/landing-page format; clear CTAs to a free consultation/audit; pricing shared
    after a free audit (never invent a price).
- **Optional second-opinion generators (NOT load-bearing, validation-gated):**
  - **KI Writer Agent** (`keyword-insights.mjs writer ... landing_page`): has a real
    `landing_page` content type (Service pages / Local business landing pages). **Currently
    returns server-side HTTP 500** (down) and has a **known location-defaults-to-US bug**.
    Before ever using it for a draft: run a health check, then **manually verify the location** —
    `writer` echoes the requested location only at creation; **`wait-writer` does NOT verify
    location or scan for US drift** (it just polls + saves the article). The US-drift check is a
    manual step you perform on the saved `seo-tools/tmp/ki-writer-<id>.md` output; reject if it
    drifted. Until it passes, it is not used.
  - **SEOwind** (browser-only, via the `seowind-service-page` skill): works but is slow,
    fragile, unscalable, and its writer fabricates. Occasional one-off / second opinion only.
- These tool-writers are optional because both have repeatedly failed the bar (SEOwind
  fabricates + can't scale; KI is down + location bug). **Default and backbone = Claude.**

## Step 6 — Post-draft gate stack  (all mandatory, in this order)
- **6a. Itemized fact-check / verification  (HARD GATE 2).** Scan the draft and produce a
  concrete, line-referenced list of **every** statistic, sourced claim, outcome/results
  claim, and brand-capability/experience claim. For each: **verify against a real primary
  source, or cut it.** Capability/experience claims must be **literally true**. A generic
  "please double-check the stats" reminder does NOT satisfy this gate.
- **6b. EEAT audit.** Run the **aaron-seo-geo content-quality-auditor** (80-item CORE-EEAT).
  Target **8+**. Apply its concrete fixes (case study with real metrics, author byline /
  reviewed-by, primary sources, last-updated date, advanced-expertise signals like
  LocalBusiness schema).
- **6c. Humanize.** Claude-native natural writing is the first line; if needed, `seo-tools/runbook/humanize.mjs <slug>`
  (Undetectable, **PROSE ONLY** — never the FAQ or any block carrying a citation/link; the humanizer alters
  facts by design). Then proofread + re-verify coverage/links/stats by hand.
- **6d. Plagiarism + AI-detection  (HARD GATE 3).** Run `seo-tools/runbook/plagiarism-check.mjs scan <slug>`
  (**Winston — BINDING**) + `undetectable-detect.mjs` (**AI-detection — ADVISORY**; it over-flags professional
  prose, so a page in the 60s is acceptable — never degrade facts/keywords chasing a lower score). **Run LAST**,
  after all rewriting. Plagiarism fail → revise → re-run.

## Step 7 — On-page finalization + internal-link wiring
- Title / meta description / **schema** (LocalBusiness / Service where applicable).
- **Internal links** via the repo's **typed hub-and-spoke link graph** — this both adds the
  links and **enforces the cluster map on-page** (pillar ↔ spokes, no cross-wiring that
  re-introduces cannibalization).
- **Navigation (locked):** surface every spoke via the **mega-menu sub-menu + footer links — NO
  sidebar**. The pillar sits in the main nav; spokes (and geo/industry pages) hang off it as a
  mega-menu dropdown + footer. This is the UI manifestation of the link graph: it gives each spoke
  site-wide internal links (gate 1) and a clean discovery path (gate 2).

## Step 8 — Publish QA
- The **20-rule SEO invariant suite** + the **content-QA / length test**
  (`tests/seo/dm-service-pages.content.test.mjs`) — now uses **SERP-derived per-page targets**
  (`tests/seo/dm-word-targets.json`, NOT a fixed floor) and **IS wired into `test:seo`** (alongside
  cannibalization + the geo-route-drift guard). Run `node --test tests/seo/*.test.mjs`; everything must pass.
  CI ("Local SEO test suite", `.github/workflows/seo-tests.yml`) runs the full gate on every push — never merge red.
- On the PR, **open the deployed Render preview URL in a browser and check the live page**
  (not just local) before merge.

---

## Geo `[service]+[city]` pages — per-page adaptation (Phase B)

Geo city pages run the SAME 8 steps, with these adaptations. Architecture: `runbook/geo/04-architecture-design.md`. Scope/waves: `runbook/geo/03-build-waves.md`. Demand data already collected (3-tool consensus): `runbook/geo/demand-raw.json`.

- **Scope (locked):** ONLY the **5 geo services** (seo, local-seo, web-design, google-ads-ppc, social-media-marketing) get city pages — the other 6 spokes have near-zero `[service]+[city]` demand (national hubs only). All 25 GTA municipalities ship regardless of demand; metros are demand-gated. Build in ROI waves; the near-zero GTA exurbs are **Phase C** (deferred).
- **Step 1 (keywords):** do NOT re-research — pull the page's `bestQuery` + variants + volume/KD from `geo/demand-raw.json`.
- **Step 2 (cannibalization):** add the city cluster to `keyword-ownership.json` keyed `"<service>/<city>"`: primary = `"<service> <city>"`, secondaries = **city-qualified variants ONLY** (never the national head — the spoke owns `"<service> services"`). Run `check-cannibalization.mjs` → exit 0.
- **Step 3 (brief):** geo-intent KI brief; emphasize local entities/competitors to cover.
- **Step 4 (length + outline):** geo SERPs are leaner than national — target ~**700–1500** `<main>` words (tighten per measured SERP). Outline = the spoke skeleton + the REQUIRED local sections: `localContext`, `serviceAreas` (≥6), `localProof` (≥2), nearby-cities, ≥1 city-specific FAQ.
- **Step 5 (draft) — the ANTI-DOORWAY core:** author CITY-UNIQUE prose — real neighbourhoods/districts/landmarks/market context (public + verifiable; no fabrication). **Local proof = a real NexFortis result where the operator has one, otherwise a CITED market stat — NEVER an invented testimonial** (`_facts.md`). No `localContext`/`intro`/FAQ paragraph may repeat across two city pages (the cross-page paragraph-dedup test is the doorway guard).
- **Step 6 (gates):** same stack; the paragraph-dedup check is the doorway gate.
- **Step 7 (integrate):** content → `_geoContent.tsx` (`GeoPageContent`); add the entry to `geo-links.ts` + flip `published:true`; regen routes (`scripts/gen-geo-routes.mjs`). Links: UP to the national spoke, ACROSS to sibling city pages (same service), DOWN from the spoke's "Areas we serve". Geo lives in `geo-links.ts` (NOT `DM_SPOKES`) so it can never flood the mega-menu.
- **Step 8 (QA):** the geo page emits `geo.region=CA-<region>`, `geo.placename=<city>`, and `ServiceSchema.areaServed=City` (via the new `seo.tsx` props); the build prerenders the route (wave-gate the build — one bad page fails the whole deploy); add `dm-word-targets.json` + snapshot + known-issues entries per route; `check-cannibalization.mjs` runs in `test:seo`.

---

## Locked decisions (and why)
- **Claude is the primary draft writer.** SEOwind and KI Writer Agent are *struck out as the
  backbone* — both are optional, validation-gated second opinions only. Evidence: SEOwind's
  output fabricated stats/claims/capabilities despite explicit instructions and its browser
  flow doesn't scale; KI's Writer Agent is returning server-side 500s, has a known
  location-defaults-to-US bug, and its quality is unverified. Claude writing directly =
  reliable, controllable, scalable, and grounded in real brand truth.
- **Length is SERP-derived, never a fixed word count.** Proven: for "local seo services"
  the ranking service pages run ~340–1,650 words while guides/directories run 5k–15k; a
  fixed 1,200 is not SERP-justified.
- **One page = one cluster** is the cannibalization defence, enforced as a checkable gate.
- **Verify-before-publish is mandatory** — no "generate and publish." Every AI draft gets the
  itemized fact-check + plagiarism/AI-detection before it can ship.

## Tools map
| Job | Tool |
|---|---|
| Keyword research + volumes/difficulty | DataForSEO (`seo-tools/dataforseo.mjs`), Ahrefs MCP, Semrush MCP |
| Clustering (cannibalization map) | Keyword Insights (`seo-tools/keyword-insights.mjs cluster`) |
| SERP analysis + brief + questions + secondary kws | Keyword Insights brief (`keyword-insights.mjs brief`/`wait-brief`) |
| Outline | **KI generates** (`keyword-insights.mjs outline`/`wait-outline`, steered via `additional_context`) → **Claude reviews/steers vs the brief, NEVER hand-authors** |
| First draft | **Claude** (primary) |
| Optional second-opinion draft (validation-gated) | KI Writer Agent (`keyword-insights.mjs writer`); SEOwind (`seowind-service-page` skill) |
| EEAT audit | aaron-seo-geo content-quality-auditor (80-item CORE-EEAT) |
| Humanize (prose only) | Claude-native; `humanize.mjs` (Undetectable) |
| Plagiarism (binding) + AI-detection (advisory) | Winston (`plagiarism-check.mjs scan`) + Undetectable (`undetectable-detect.mjs`) |
| Internal links | repo typed hub-and-spoke link graph |
| Publish QA | 20-rule SEO suite (`pnpm test:seo`) + content-QA gate + live Render check |

## Current application (as of 2026-06-25)
The 12 national pages (pillar + 11 spokes) **and Phase B Wave 1 (15 geo `[service]+[city]` pages)** are
COMPLETE, merged to `main` (PR #108), and live on production. **Next = the remaining geo pages** — Waves
2/3/4 = 64 pages, full checklist in **`seo-tools/runbook/TODO-phase-b-geo.md`** (next page up:
`google-ads-ppc/saskatoon`). Run each one through Steps 1–8 above + the geo adaptations. Current state +
exact next action: **`runbook/STATUS.md`** (has a "⭐ START HERE" block); full history + decisions:
**`runbook/CHANGELOG.md`**.
