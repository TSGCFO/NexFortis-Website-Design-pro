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

---

## Build history (newest first)

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

## Supersession status (READ before any cleanup)

The live app (`internal-links.ts`, `App.tsx`, `_dmContent.tsx`, `pages/services/digital-marketing/*.tsx`) still serves the OLD slugs. These runbook folders back **currently-live pages** — **pending Step 7, NOT stale; do not delete until the app no longer references them:**
- `generative-engine-optimization/` → becomes `geo-ai-search`
- `google-ads/` → becomes `google-ads-ppc`
- `google-business-profile/` → folds into `local-seo` (GBP section)
- `technical-seo/` → folded / dropped
- `analytics-reporting/` → dropped from the map

Also pending Step 7: `tests/seo/dm-word-targets.json` reconcile to the new slugs/targets.

---

## Current state (2026-06-23)
- **Content (Steps 1–6): COMPLETE** for the pillar + all 11 spokes. seo also at Step 7.
- **Next: Step 7 integration** (reconcile the app to the 12-map) + Step 8 QA. See `STATUS.md` for the exact next action.

## Roadmap
- **Phase A (current):** the 12 national service pages. Completed by Steps 7–8.
- **Phase B (next):** the geo layer — Option D `[service]+[city]` pages for GTA municipalities + major Canadian metros. Full spec: `00-architecture.md` → "Geography (decided: option D)". Do NOT lose this.
