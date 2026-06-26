# Phase B — Geo Pages TODO (Waves 2 / 3 / 4 remaining)

**Status as of 2026-06-25:** Phase B is **15 / 79 complete**. **Wave 1 (15 pages) ✅ DONE — merged to `main` (PR #108, squash `2720d7ff2`) and LIVE on production (nexfortis.com).** **64 pages remain: Wave 2 (19) · Wave 3 (27) · Wave 4 (18).** Plus **Phase C** = 88 near-zero GTA exurbs, deferred (build only when greenlit, genuine-local or noindex).

This is the actionable checklist. Source of the wave order + vol/KD: `geo/03-build-waves.md` (ROI = vol/(KD+5)). Per-page process: **the full 8-step run book, one page at a time** — `CLAUDE.md` "NexFortis Content Run Book" + `seo-tools/CONTENT-RUNBOOK.md`. Nothing architectural is left to decide; the geo route/template/link/schema/test plumbing is built and proven (see `STATUS.md` → "Wave 1 progress"). Just repeat the pipeline per page.

> **Per page (every one of the 64 below):** 3-tool keyword consensus → **city-qualified-only** ownership in `keyword-ownership.json` + `check-cannibalization.mjs` → KI brief (review vs SERP) → KI outline (review for fabrication — NEVER hand-author) → Claude draft (grounded in `_facts.md`; SERP-derived length) → 6 gates (6a fact-check, 6b independent EEAT, 6c humanize, 6d Winston plagiarism + coverage) → integrate (`_geoContent.tsx` + `geo-links.ts` `published:true`) → Step-8 QA (`node --test tests/seo`, cannibalization, live Render preview). Artifact trail per page → `geo/<service>-<city>/`. **Wave 2+ learnings:** ≥3 sourced StatBand citations (a 2-stat band fails the invariant); FAQ answers must be **city-unique** from the start (anti-doorway dedup gate); scope credential claims to where they're true (Google Partner = Ads pages only).

---

## ✅ Wave 1 — proof-of-model (15/15 DONE, merged + live)
`local-seo/toronto` · `seo/mississauga` · `seo/markham` · `local-seo/edmonton` · `web-design/hamilton` · `local-seo/calgary` · `seo/brampton` · `web-design/london-ontario` · `seo/calgary` · `seo/hamilton` · `google-ads-ppc/toronto` (PPC template) · `social-media-marketing/calgary` (social template) · `seo/toronto` · `web-design/brampton` · `seo/ottawa`

---

## ⬜ Wave 2 — high demand ≥300 (0/19)
- [ ] `google-ads-ppc/saskatoon` — vol 300, KD 0
- [ ] `web-design/toronto` — vol 2900, KD 66
- [ ] `seo/edmonton` — vol 720, KD 14
- [ ] `seo/montreal` — vol 450, KD 11
- [ ] `seo/vancouver` — vol 1000, KD 31
- [ ] `social-media-marketing/toronto` — vol 320, KD 7
- [ ] `seo/halifax` — vol 300, KD 7
- [ ] `web-design/ottawa` — vol 1000, KD 38
- [ ] `web-design/surrey` — vol 390, KD 13  *(watch: Surrey-UK contamination)*
- [ ] `local-seo/vancouver` — vol 480, KD 19
- [ ] `web-design/calgary` — vol 600, KD 26
- [ ] `web-design/oakville` — vol 320, KD 12
- [ ] `web-design/mississauga` — vol 720, KD 35
- [ ] `web-design/edmonton` — vol 880, KD 47
- [ ] `web-design/kitchener` — vol 390, KD 22
- [ ] `web-design/vancouver` — vol 800, KD 51
- [ ] `web-design/victoria` — vol 320, KD 24
- [ ] `web-design/winnipeg` — vol 320, KD 33
- [ ] `web-design/montreal` — vol 350, KD 51

## ⬜ Wave 3 — solid demand 150–299 (0/27)
- [ ] `seo/surrey` — vol 260, KD 0  *(watch: Surrey-UK)*
- [ ] `google-ads-ppc/calgary` — vol 250, KD 0
- [ ] `seo/winnipeg` — vol 210, KD 0
- [ ] `local-seo/mississauga` — vol 210, KD 0  *(distinct from `seo/mississauga`)*
- [ ] `web-design/markham` — vol 210, KD 0
- [ ] `web-design/milton` — vol 210, KD 0
- [ ] `seo/oakville` — vol 200, KD 0
- [ ] `web-design/pickering` — vol 200, KD 0
- [ ] `google-ads-ppc/montreal` — vol 200, KD 0
- [ ] `social-media-marketing/vancouver` — vol 200, KD 0
- [ ] `local-seo/ottawa` — vol 250, KD 2
- [ ] `seo/vaughan` — vol 150, KD 0
- [ ] `seo/victoria` — vol 150, KD 0
- [ ] `social-media-marketing/london-ontario` — vol 150, KD 0  *(london-ontario, not UK)*
- [ ] `web-design/burlington` — vol 170, KD 2
- [ ] `seo/london-ontario` — vol 250, KD 9
- [ ] `web-design/windsor` — vol 150, KD 4
- [ ] `local-seo/burlington` — vol 170, KD 8
- [ ] `seo/burlington` — vol 250, KD 15
- [ ] `local-seo/brampton` — vol 170, KD 9  *(distinct from `seo/brampton`)*
- [ ] `social-media-marketing/edmonton` — vol 190, KD 12
- [ ] `web-design/saskatoon` — vol 260, KD 21
- [ ] `web-design/regina` — vol 200, KD 23
- [ ] `local-seo/halifax` — vol 150, KD 19  *(watch: Halifax-UK)*
- [ ] `web-design/oshawa` — vol 210, KD 33
- [ ] `web-design/halifax` — vol 210, KD 38
- [ ] `google-ads-ppc/edmonton` — vol 150, KD 40

## ⬜ Wave 4 — moderate demand 70–149 (0/18)
- [ ] `web-design/vaughan` — vol 140, KD 0
- [ ] `google-ads-ppc/vancouver` — vol 120, KD 0
- [ ] `local-seo/vaughan` — vol 75, KD 0
- [ ] `seo/oshawa` — vol 70, KD 0
- [ ] `seo/milton` — vol 70, KD 0
- [ ] `local-seo/oshawa` — vol 70, KD 0
- [ ] `web-design/ajax` — vol 70, KD 0
- [ ] `web-design/whitby` — vol 110, KD 4
- [ ] `seo/richmond-hill` — vol 110, KD 11
- [ ] `web-design/richmond-hill` — vol 110, KD 11
- [ ] `local-seo/markham` — vol 90, KD 12  *(distinct from `seo/markham`)*
- [ ] `web-design/newmarket` — vol 100, KD 31
- [ ] `google-ads-ppc/mississauga` — vol 90, KD 40
- [ ] `google-ads-ppc/ottawa` — vol 90, KD 40
- [ ] `social-media-marketing/burlington` — vol 80, KD 40
- [ ] `google-ads-ppc/burlington` — vol 70, KD 40
- [ ] `social-media-marketing/brampton` — vol 70, KD 40
- [ ] `google-ads-ppc/victoria` — vol 50, KD 40

---

## Phase C (deferred — NOT in Phase B)
88 near-zero-demand GTA exurb pages across the 5 services (Ajax, Aurora, Caledon, Clarington, Georgina, King City/Nobleton, Scugog, Stouffville, Uxbridge, Whitby, etc.). Ship eventually under the all-GTA rule but carry no SEO ROI — build only with genuine local content (or `noindex`) when Phase C is greenlit. Full list: `geo/03-build-waves.md` → "Phase C".

## How to resume (the exact next steps)
1. Read `STATUS.md` (resume point — has the "⭐ START HERE" onboarding) → `CHANGELOG.md` (history + durable decisions) → this file (what's left).
2. **Next page = `google-ads-ppc/saskatoon`** (the first unchecked box above; top of Wave 2, highest ROI). **One page at a time.**
3. **Follow the run book exactly — do not improvise:** `seo-tools/CONTENT-RUNBOOK.md` (the 8 steps + the exact tool per step) + `CLAUDE.md` → "NexFortis Content Run Book — non-negotiable execution discipline" (the per-step tool table + hard rules: RAW tool output first, KI generates brief + outline, no fabrication, trace anomalies upstream). Mirror a completed page's folder, e.g. `geo/google-ads-ppc-toronto/`. Ground every claim in `_facts.md`.
4. Build on a **fresh branch off `main` → new PR** (Wave 1 shipped via PR #108). Check the page off here + log it in `CHANGELOG.md` when its gates are green and it's integrated.
5. KI tip: when the API is healthy, front-load Steps 1→brief→outline for several pages before KI's HTML-collection job stalls (a stalled brief eventually finishes — **WAIT, never relaunch**).
