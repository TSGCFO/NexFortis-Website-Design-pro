# NexFortis Service-Architecture Build — STATUS / RESUME POINT

**Last updated:** 2026-06-20. **Read this first to resume.** Branch: `cursor/bc-f9434f5d-…-09e7`. Domain: nexfortis.com.

---

## THE OBJECTIVE
NexFortis.com currently has ONE page under Services ("Digital Marketing"). Goal: market that NexFortis sells **all 104 line items** in `seo-tools/Nexfortis-competitor-services.md` (104 deliverables / 10 categories, scraped from 19 GTA/Canadian agencies) as **strategically-grouped service subpages under `/services/digital-marketing`** — built to **rank AND sell**. Full goal + method in memory `nexfortis-service-architecture-goal`.

## THE METHOD (non-negotiable, per Hassan)
The run book is a **dependency chain**: each step is the INPUT to the next; bad upstream compounds downstream. An "off" output is a **symptom of an upstream step done wrong**, NOT a caveat to patch — trace it upstream. Do NOT rush; do each step properly and grounded in real data before advancing. Ground EVERYTHING in the competitor report + real tool data, never in assumptions or the prior (discarded) 13-spoke guess.

## LOCKED DECISIONS
1. **Architecture framework = B-validated-by-C:** lay out candidate buyer service lines from the report; real demand (Step 1) + KI clustering (Step 2) decide which earn a URL, exact names, and sub-pages. 104 items ≠ 104 pages (doorway-penalty); group intelligently; every item represented somewhere.
2. **Geography = geo layer ELEVATED to primary** (data: `[service]+[city]` dominates at KD 0–30). Two layers built together: national `[service]` hubs + `[service]+[city]` geo pages. Cities = **every GTA municipality** + major Canadian metros (Vancouver, Calgary, Ottawa, Edmonton, Montreal, Winnipeg, Hamilton, KW, London, Halifax…). Full city list in `00-architecture.md`. Geo pages need GENUINE local content (no thin templates). URL: `/services/digital-marketing/<service>/<city>`.
3. **Phasing:** **Phase A** = build the ~13 national service hubs first (foundation). **Phase B** = geo fan-out off each hub, prioritized by low-KD/high-demand combos (GTA core + Van/Cal/Ott/Edm first). Per-page production (esp. geo scale) to use a structured/parallel approach (run-book skill + subagents).
4. **Expansion engine = Ahrefs matching-terms + Semrush.** KI keyword-discovery DROPPED (dashboard-only `/v2/` Bearer; noisy autocomplete idea-net with no volume). See memory `ki-api-levers`.
5. **Confirmed commercial service lines (13)** + 4 data corrections — see `01-keywords-master.json`. SEO (head `seo company`) · Local SEO (+GBP as a section) · Web Design · Google Ads/PPC · Social Media Marketing (NOT "management") · Content Marketing · Link Building · GEO/AI Search · Technical SEO · Reputation Management (promoted by data) · Email · CRO · Website Maintenance. Corrections: DROP facebook/meta-ads page (DfS 9,900 mirage → real 50–110), FOLD GBP into Local SEO, name social "Marketing", demote SEO Audit to lead-magnet.

## CHAIN PROGRESS
- **Step 0 — Architecture:** ✅ DONE. `00-architecture.md` (approved candidate map + geo + phasing).
- **Step 1 — Keyword research:** 🔄 IN PROGRESS.
  - ✅ 3-tool head validation + intent for all 13 lines → `01-keywords-master.json`.
  - ✅ Ahrefs expansion for 6/13 lines + geo-dominance finding → `01-expansion-ahrefs.md`.
  - ⬜ Expand remaining 7 lines (link building, email, GBP, reputation, CRO, GEO/AI, PPC/Local-Services) via Ahrefs matching-terms (Canada, commercial filter).
  - ⬜ (optional) Semrush related cross-check on a sample.
- **Step 2 — Clustering:** ⬜ NEXT after expansion. KI clustering `POST /api/keywords-insights/order/` with DELIBERATE levers (`clustering_method`, `grouping_accuracy`, `hub_creation_method`), `insights:[cluster,context,rank]`, our url. Feed the consolidated commercial-filtered universe. Produces the validated national page map + cannibalization fence (resolves Technical SEO own-page-vs-section).
- **Steps 3–8:** ⬜ per page (Phase A hubs first). Brief → KI auto-outline (steered via `additional_context`, locked to `04-outline.json`) → Claude draft (brand + Canadian English) → fact-check/EEAT/humanize/plagiarism + keyword-coverage gates → link wiring + nav → publish QA.

## IMMEDIATE NEXT STEP
Steps 0–2 DONE. National page map LOCKED + promoted → `keyword-ownership.json` (**12 pages**, 87 kw, cannibalization-clean; supersedes & discards PR #107). Map: `02-page-map.md`. Clustering: KI order `b0574d01` (acc-2), raw in `tmp/national-clusters-acc2.json`.
**NOW = Phase A** — build the 12 national hubs via the run-book chain (Step 3 KI brief → Step 4 KI outline steered via additional_context → Step 5 Claude draft [brand + Canadian English] → Step 6 fact-check/EEAT/humanize/plagiarism + keyword-coverage gates → Step 7 link wiring + nav → Step 8 QA), **starting with `seo`** (transactional head `seo services`), then by demand (local-seo, web-design, google-ads-ppc, social-media-marketing, content-marketing, link-building, geo-ai-search, reputation-management, email-marketing, conversion-rate-optimization). Then **Phase B** = `[service]+[city]` geo layer.
**Note:** old PR #107 artifacts (runbook/<slug>/ folders, _dmContent.tsx spokes, internal-links.ts spokes) are DISCARDED — to be replaced during Phase A builds.
12 national slugs: digital-marketing(pillar) · seo · local-seo · web-design · google-ads-ppc · social-media-marketing · content-marketing · link-building · geo-ai-search · reputation-management · email-marketing · conversion-rate-optimization.

## PENDING RUN-BOOK HARDENING (from the start of this session — discussed, NOT yet built)
These were the 3 original asks before the architecture pivot; still TODO:
1. **KI brief poller fix** — raise `waitBrief` `maxSeconds` (360→ higher) + resumable harvest. (Outline cmds already added to `keyword-insights.mjs`.)
2. ✅ **DONE — Mandatory humanizer gate (Step 6c)** = `seo-tools/runbook/humanize.mjs`. Humanizes prose only (headings never sent; lists preserved); protects every keyword + link via sentinels; BINDING integrity verify (headings + keywords + links) via the coverage gate; AI-detection advisory. **Step-6c standard flow = humanize → light proofread (fix glosses) → re-verify coverage.** Built + run on SEO (`seo/06c-humanized.md`; raw in `06c-humanized.attempt.md`).
3. ✅ **DONE — Keyword/outline coverage gate** = `seo-tools/runbook/check-keyword-coverage.mjs <slug> [content-file]`. Verifies primary + EVERY secondary keyword + every H1/H2/H3 from `<slug>/04-outline.json`. Tested (passes real draft; fails a broken fixture). TODO: wire into pre-push + `test:seo` at Step 7 (rendered-page check).
4. **KI brief poller fix** (only remaining): raise `waitBrief` timeout + parse `payload.id` not first-UUID (the SEO-brief poller grabbed the folder_id by mistake).

## KEY ARTIFACTS
- `seo-tools/Nexfortis-competitor-services.md` — the 104-item competitor report (Step-0 ground truth).
- `seo-tools/runbook/00-architecture.md` — the architecture spec (+ geo + phasing + full city list).
- `seo-tools/runbook/01-keywords-master.json` — 3-tool head validation + intent + 4 corrections.
- `seo-tools/runbook/01-expansion-ahrefs.md` — Ahrefs universe expansion (6/13 lines) + geo finding.
- `seo-tools/keyword-insights.mjs` — KI client (brief/wait-brief, cluster/cluster-status, **outline/wait-outline** added this session).
- Memory: `nexfortis-service-architecture-goal`, `ki-api-levers`, `content-run-book`, `pr107-review`.

## TOOLING CHEATSHEET
- **DataForSEO:** `node seo-tools/dataforseo.mjs keywords "kw1,kw2,…" 2124 en` (2124=Canada).
- **Semrush MCP:** `execute_report` report=`phrase_these` params `{database:"ca", phrase:"a;b;c", export_columns:"Ph,Nq,Cp,Co"}` (intent col didn't return; use Ahrefs for intent).
- **Ahrefs MCP:** `keywords-explorer-overview` / `matching-terms` — `country:"ca"`, `keywords` COMMA-separated, `select:"keyword,volume,difficulty,cpc,intents"`, `where` JSON filter, `match_mode:"terms"`. CPC in cents (÷100). `intents.commercial` = buyer discriminator.
- **KI brief/outline:** `node seo-tools/keyword-insights.mjs brief "<kw>" "Canada" "<folder>"` → `wait-brief <id>`; `outline <order_id> "<context>"` → `wait-outline <order_id> <auto_id>`. Pillar briefs done: `63ee711d-…`, `b5fb9013-…`.
- **KI clustering:** `node seo-tools/keyword-insights.mjs cluster <payload.json>` → `cluster-status <id>` → `download-xlsx`. Payload shape: `seo-tools/cluster-localseo.json`.
- **KI discovery:** dashboard-only; not API-usable (skip).
- Secrets in `seo-tools/secrets.local.json` (gitignored). NEVER commit/echo.
