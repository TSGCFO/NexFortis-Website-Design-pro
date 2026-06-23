# NexFortis Service-Architecture Build — STATUS / RESUME POINT

**Last updated:** 2026-06-23. **Read this first to resume.** Branch: `seo/dm-service-architecture`.
Full reasoning + history: `seo-tools/runbook/CHANGELOG.md`. Process: `seo-tools/CONTENT-RUNBOOK.md`.

---

## THE OBJECTIVE
Market NexFortis's digital-marketing capabilities as strategically-grouped service subpages under `/services/digital-marketing`, built to rank AND sell, grounded in `seo-tools/Nexfortis-competitor-services.md` + `seo-tools/runbook/_facts.md`. Architecture = the **12-page map**: pillar `digital-marketing` + 11 spokes (seo, local-seo, web-design, google-ads-ppc, social-media-marketing, content-marketing, link-building, geo-ai-search, reputation-management, email-marketing, conversion-rate-optimization).

## WHERE WE ARE — content COMPLETE
Run-book Steps 1–6 are **complete for all 12 pages**:
- **seo** — through Step 7 (already integrated into the app).
- **local-seo, web-design** — through Step 6.
- **google-ads-ppc, social-media-marketing, content-marketing, link-building, geo-ai-search, reputation-management, email-marketing, conversion-rate-optimization** — through Step 6 (2026-06-23).

Each page's record is its `<slug>/01…06d` artifact trail; gate verdicts live in the `06*.json` files. All binding gates green (coverage, fact-check, Winston plagiarism ≤2%); AI-detection is advisory.

## EXACT NEXT STEP — Step 7 integration (NOT started for the 10 non-seo spokes)
The app is STILL on the OLD 13-spoke slugs. Step 7 reconciles the app to the 12-map:
1. Put each spoke's `06c-humanized.md` into `artifacts/nexfortis/src/pages/services/digital-marketing/_dmContent.tsx` as typed `DM_SPOKE_CONTENT[slug]`.
2. Reconcile slugs to the 12-map across `internal-links.ts`, `App.tsx` routes, and the page files: rename generative-engine-optimization→geo-ai-search, google-ads→google-ads-ppc; fold google-business-profile into local-seo; drop technical-seo + analytics-reporting; add reputation-management.
3. `internal-links.ts`: set `published: true` (auto-wires nav / footer / related) + canonical `linkText`.
4. Reconcile `04-outline.json` ↔ rendered headings; `&`→`and` in headings; ≥3 distinct citation URLs; meta ≤160.
5. Reconcile `tests/seo/dm-word-targets.json` to the new slugs / SERP-derived targets.

## Step 8 — QA (after Step 7)
`pnpm -C artifacts/nexfortis build:no-prerender` → prerender → coverage on rendered HTML → cannibalization → `node --test tests/seo/*.test.mjs` (git checkout sitemap snapshots after update) → live Render preview.

## PENDING CLEANUP (do during/after Step 7 — NOT before; see CHANGELOG "Supersession status")
- Remove old-slug runbook folders (generative-engine-optimization, google-ads, google-business-profile, technical-seo, analytics-reporting) ONLY after the app no longer references them.
- Reconcile `tests/seo/dm-word-targets.json`.
