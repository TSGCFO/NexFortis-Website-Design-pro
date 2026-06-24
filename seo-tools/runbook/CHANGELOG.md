# NexFortis Content Build — Change Log

**Purpose.** Make this repo self-replicating. `CONTENT-RUNBOOK.md` is the *process* (the 8 steps + the exact tool per step). This file is the *execution history*: what was built, in what order, the decisions made, and the learnings — so a future session can add pages or audit existing ones **from the repo + git history alone, without re-reading session transcripts.**

How the pieces fit together:
- `CONTENT-RUNBOOK.md` — the HOW (process + per-step tool).
- `_facts.md` — ground-truth fact base (the ONLY source of NexFortis claims; nothing else may be stated).
- `keyword-ownership.json` — the locked 12-page map: each page's primary + secondary keywords (the cannibalization map).
- `<slug>/01-keywords.* … 06d-aidetect.json` — the per-page artifact trail; the files ARE the record of each step's output.
- **This CHANGELOG** — the WHAT/WHEN/WHY + the decisions not derivable from the files.

---

## Quick start — adding N more service pages later

Mirror any completed spoke's folder (e.g. `link-building/`) and follow `CONTENT-RUNBOOK.md`:
1. **Steps 0–2 (map + keywords + clustering):** 3-tool keyword research (`dataforseo.mjs` + Ahrefs + Semrush); KI clustering (`keyword-insights.mjs cluster`); add the page's primary + secondaries to `keyword-ownership.json`; run `check-cannibalization.mjs` (one page = one cluster).
2. **Step 3 brief (KI):** `keyword-insights.mjs brief "<kw>" "Canada"` → `wait-brief`; review vs the scraped SERP → `<slug>/03-brief.json`.
3. **Step 4 outline (KI):** `keyword-insights.mjs outline <order> "<additional_context>"`; reconcile to the locked 6-H2 spine (Option B) → lock `<slug>/04-outline.json` + `.md`.
4. **Step 5 draft:** Claude-authored, grounded ONLY in 03-brief + 04-outline + `_facts.md`; SERP-derived length; no fabrication → `<slug>/05-draft.md`.
5. **Step 6 gates:** 6a fact-check (every claim vs `_facts.md`; add ≥3 live-verified stats, distinct cited URLs) → 6b EEAT (independent `content-quality-auditor`) → 6c humanize (`humanize.mjs`, PROSE ONLY — see below) + proofread + re-verify → 6d `plagiarism-check.mjs scan <slug>` (Winston, binding) + `undetectable-detect.mjs` (AI, advisory).
6. **Steps 7–8 (integration + QA):** see `CONTENT-RUNBOOK.md` + `STATUS.md`.

---

## Decisions & learnings (durable — read before building)

**12-page map.** Pillar `digital-marketing` + 11 spokes: seo, local-seo, web-design, google-ads-ppc, social-media-marketing, content-marketing, link-building, geo-ai-search, reputation-management, email-marketing, conversion-rate-optimization. SUPERSEDES the old 13-spoke PR#107 build (see Supersession).

**Outline = Option B (SEO-page model).** Every locked secondary keyword appears as a grouped bold sub-point under "Our <svc> services"; provider/agency-synonym secondaries are woven into the intro + "Why choose". 6-H2 spine: What <svc> services include · Our <svc> services · Our <svc> process · Why choose NexFortis for <svc> · <Svc> pricing after a free <audit|consultation> · Frequently Asked Questions. ("Who it's for" folds into the intro callout at Step 7.)

**Length = SERP-derived per page (not uniform).** From each brief's service-page SERP subset (exclude listicle/software/Wikipedia/Google-product/YouTube outliers). A Gate-1 (ranking) vs Gate-2 (conversion) trade-off: a complete page with all secondaries + a 6-Q FAQ + 3 stats naturally runs longer than a thin SERP median — acceptable.

**No fabrication (hard rule).** State only `_facts.md` facts (Hassan Sadiq = Founder & CEO; 15+ yrs enterprise tech; Microsoft Solutions Partner; Google Partner — google-ads only; Canadian, Nobleton/GTA, serves Canada; transparent/fixed-monthly/month-to-month/no-lock-in; free consultation). NO invented client results/counts/prices/guarantees/awards/timelines. Third-party stats only if cited to a named source + live-verified at 6a (firecrawl); ≥3 distinct citation URLs/page. "and" not "&" in headings.

**Humanizer (Step 6c) — IMPORTANT.** The Undetectable humanizer is a paraphraser that ALTERS facts by design (it fabricated "multi-million dollar company" + hallucinated "Google Ads Palau" on google-ads-ppc; it drops citations + mangles FAQ questions). Audited against the live Undetectable Humanization-API-v2 + Detector-API docs (2026-06-23). `humanize.mjs` is now configured:
- **model v2 / strength Quality / purpose Business Material** (gentlest).
- **Prose only:** the FAQ section (from its heading) and any block containing a citation or link are NEVER sent to the humanizer (preserved verbatim).
- Output STILL needs strict manual verification every time: re-run `check-keyword-coverage.mjs`, confirm the link set is unchanged, 0 leftover sentinels, every stat exact, no fabrication; hand-repair anything dropped.

**AI-detection = ADVISORY (non-binding).** `undetectable-detect.mjs` over-flags professional human prose. Binding gates = Winston plagiarism + keyword/heading coverage. Precedent: SEO page shipped at AI 72, local-seo at 66 — a page in the 60s is acceptable; never degrade facts/keywords chasing <50.

**Phase B (geo `[service]+[city]`) — decisions (durable; full detail in `geo/01`…`geo/04`).**
- **5 geo services ONLY** (data-confirmed, 3-tool): seo, local-seo, web-design, google-ads-ppc, social-media-marketing. The other 6 spokes have near-zero `[service]+[city]` demand → national hubs only, NO city pages.
- **Cities:** ALL 25 GTA municipalities ship for the 5 services regardless of demand (operator rule; demand sets BUILD ORDER only). Metros demand-gated. Lead demand = Toronto + the major metros (Calgary/Edmonton/Vancouver), NOT GTA suburbs (a corrected assumption). Contamination to watch: Uxbridge-UK, Halifax-UK, "london ontario" (not London UK), Surrey-UK.
- **Waves, not all-at-once:** Phase B = **79** demand-backed pages in 4 ROI waves; the **~88** near-zero GTA exurb pages DEFERRED to a possible **Phase C**; 43 weak metros dropped; Burnaby folded into Vancouver. (`geo/03-build-waves.md`)
- **Anti-doorway (HARD rule):** every city page must be GENUINELY local (real neighbourhoods, districts, market context, local proof) — never a templated city-name swap, or Google penalizes the whole cluster. Encoded as REQUIRED `GeoPageContent` fields (`localContext`, `serviceAreas`≥6, `localProof`≥2, ≥1 city-specific FAQ). Local proof = real result where available, else a CITED market stat — **NEVER an invented testimonial** (`_facts.md`).
- **Architecture:** geo pages live in a separate `geo-links.ts` registry (so they can NEVER flood the mega-menu/footer — those read `getPublishedSpokes()`); routes are codegen'd as literal `<Route>` from that registry (param routes are excluded from prerender discovery); new `_GeoServicePageBody`; `seo.tsx` made `geo.region`/`placename` + `ServiceSchema.areaServed` per-page props (all were hardcoded — verified). Cannibalization: national spoke owns the unqualified head ("local seo services"), each city page owns ONLY city-qualified strings ("local seo toronto"). (`geo/04-architecture-design.md`)

---

## Build history (newest first)

### 2026-06-24 — Phase B kickoff: geo demand scoping + wave plan + architecture + foundation (IN PROGRESS)
- **Demand scoping (3-tool consensus, LOCKED):** workflow `geo-demand-crosscheck` ran Ahrefs + DataForSEO + Semrush across the spokes × all GTA municipalities + Canadian metros. → `geo/02-demand-matrix.md` (locked), `geo/demand-raw.json` (raw per-city numbers), `geo/01-demand-discovery.md` (Ahrefs-only first pass). Confirmed the 5 geo services + the metros-not-suburbs lead; caught place-name contamination.
- **Wave plan (`geo/03-build-waves.md`):** 79 demand-backed Phase B pages in 4 ROI waves (W1 15 · W2 19 · W3 27 · W4 18); 88 near-zero GTA → Phase C; 43 weak metros dropped.
- **Architecture (DESIGNED + APPROVED, `geo/04-architecture-design.md`):** workflow `geo-architecture-design` mapped the real spoke arch (5 readers) + a Plan-agent synthesized it; hand-verified the load-bearing `seo.tsx` hardcoding. Operator decisions: **A = codegen literal routes**, **B = mix** (real local proof where available, cited market-stats fallback — never invented).
- **Foundation IMPLEMENTED (typecheck green, commit `79151fd`):** `geo-links.ts` (registry + helpers, Wave-1 seeded w/ Local SEO Toronto `published:false`); `_geoContent.tsx` (`GeoPageContent` type w/ required local fields); `seo.tsx` (backward-compatible geo props). **REMAINING:** `_GeoServicePageBody` + 3 local UI blocks + `gen-geo-routes.mjs` codegen + App.tsx wiring + drift test + spoke "Areas we serve" DOWN-link + cannibalization in `test:seo`; then page #1 (Local SEO Toronto) via the run book.

### 2026-06-23/24 — Phase A COMPLETED (Steps 7–8 + mega-menu)
- **Step 7 (integration), commits `297d6d9`…`8b7f6b5`:** 7A reconciled the app to the 12-map (renamed geo/google-ads, dropped technical-seo/analytics, folded GBP→local-seo, added reputation-management); 7B integrated all 11 spokes as typed `DM_SPOKE_CONTENT`. typecheck + build green; metas ≤160; keyword coverage 100%/page.
- **Step 8 (QA), through `a3aea86`:** verified on the **Render PR-108 preview** (build passed; all 12 pages prerendered w/ title/meta/body/Service+FAQ+Person JSON-LD; sitemap = the 12 new routes). Cannibalization clean (87 kw). SEO test fixtures reconciled — snapshots regenerated from the deployed prerender, `dm-word-targets.json` + `__known-issues__.json` updated to the 12-map.
- **Services mega-menu restructure**, commits `926c389`, `b7c768a` (built via the Replit connector, reviewed + synced over SSH): two-level nested flyout — 5 mains; hovering Digital Marketing opens a right-side panel of the DM spokes (data-driven from `getPublishedSpokes()`); two-column + viewport-bound scroll-cap; keyboard-accessible.
- **Deferred to-dos logged in-repo:** nav hover-intent UX (inline `TODO(nav-hover-intent)` in `layout.tsx`); site-wide visual redesign (`docs/TODO-visual-redesign.md`).

### 2026-06-23 — Steps 5–6 for the 8 remaining spokes (+ humanizer hardening)
- Built + fully gated: google-ads-ppc, social-media-marketing, content-marketing, link-building, geo-ai-search, reputation-management, email-marketing, conversion-rate-optimization.
- Step 5 drafts + 6a (fact-check + 3 live-verified stats) + 6b (EEAT) produced via a deterministic multi-agent workflow, grounded strictly in each page's 03-brief + 04-outline + `_facts.md`; then 6c + 6d done page-by-page with strict verification.
- Results: all 8 — coverage PASS, zero fabrication (3 cited stats each), 6b SHIP (61–64), Winston plagiarism ≤2% (binding PASS). AI advisory: 6 HUMAN; geo 68 + google-ads-ppc 56 accepted (advisory).
- 6c method used: clean drafts that already scored HUMAN kept as-is (email, social, cro); flagged pages gently humanized (prose only) + hand-repaired (link-building 62→24, content-marketing 63→19, reputation 65→20); geo accepted at 68 (intrinsically AI-pattern-heavy); google-ads-ppc hand-humanized (tool fabricated) at 56.

### 2026-06-20 … 06-22 — SEO integrated (Step 7) + local-seo + web-design + 12-map lock + front-loading
- Locked the 12-page map, the Option-B outline model, the SERP-length rule, and the run-book discipline (`CONTENT-RUNBOOK.md`, `CLAUDE.md`).
- SEO spoke taken through Step 7 (integrated into the app); local-seo + web-design through Step 6.
- Front-loaded KI briefs + outlines for the 8 remaining spokes while the KI API was healthy.

### 2026-06-18 — old 13-spoke build (PR#107 / Cursor) — SUPERSEDED
- Produced 13 spokes under different slugs and integrated them into the app. The **app is still on this old structure** (see Supersession); its runbook folders are NOT stale until Step 7 reconciles the app.

---

## Supersession status (cleanup now SAFE — deferred)

Step 7A (commit `297d6d9`) reconciled the live app to the 12-map — the app NO LONGER references the old slugs, and `tests/seo/dm-word-targets.json` was reconciled at Step 8 (commit `a3aea86`). The old-slug runbook folders are therefore **safe to delete** (deferred — not yet removed):
- `generative-engine-optimization/` → became `geo-ai-search`
- `google-ads/` → became `google-ads-ppc`
- `google-business-profile/` → folded into `local-seo` (GBP section)
- `technical-seo/` → dropped
- `analytics-reporting/` → dropped

(Trace provenance + show the list before deleting, per protocol. The old DM URLs currently return a 200 SPA-fallback shell, not 404/301 — out of scope per operator.)

---

## Current state (2026-06-24)
- **Phase A: ✅ COMPLETE** (on PR #108, unmerged) — Steps 1–8 for the pillar + 11 spokes + the services mega-menu restructure; verified on the Render PR-108 preview.
- **Phase B: IN PROGRESS** — geo demand scoping LOCKED, wave plan set (79 pages / 4 waves; 88 deferred to Phase C), architecture DESIGNED + APPROVED, foundation IMPLEMENTED (`geo-links.ts` + `_geoContent.tsx` + `seo.tsx`). **Next:** finish the architecture wiring (`_GeoServicePageBody` + UI blocks + `gen-geo-routes.mjs` + App.tsx + drift test + spoke DOWN-link + cannibalization-in-`test:seo`), then the per-page run book on Wave 1 starting Local SEO Toronto. See `STATUS.md` + `geo/01`…`geo/04`.
- **PR #108 → main → production:** needs explicit operator authorization — do NOT merge without it.

## Roadmap
- **Phase A: ✅ DONE** — the 12 national service pages (Steps 1–8) + the mega-menu.
- **Phase B: CURRENT** — geo `[service]+[city]` layer: 5 services × demand-backed cities, in ROI waves. Build now = 79 pages; ~88 near-zero GTA exurbs deferred to Phase C. Specs: `geo/02-demand-matrix.md`, `geo/03-build-waves.md`, `geo/04-architecture-design.md` (option D origin: `00-architecture.md`).
- **Phase C (deferred):** the near-zero-demand GTA exurb pages (all-GTA coverage, no SEO ROI) — genuine-local or noindex when greenlit.
- **Future:** the other 4 main services each gain their own sub-services under the same nested pattern.
