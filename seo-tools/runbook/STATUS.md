# NexFortis Service-Architecture Build — STATUS / RESUME POINT

**Last updated:** 2026-06-23. **Read this first to resume.** Branch: `seo/dm-service-architecture`.
Full reasoning + history: `seo-tools/runbook/CHANGELOG.md`. Process: `seo-tools/CONTENT-RUNBOOK.md`.

---

## THE OBJECTIVE
Market NexFortis's digital-marketing capabilities as strategically-grouped service subpages under `/services/digital-marketing`, built to rank AND sell, grounded in `seo-tools/Nexfortis-competitor-services.md` + `seo-tools/runbook/_facts.md`. Architecture = the **12-page map**: pillar `digital-marketing` + 11 spokes (seo, local-seo, web-design, google-ads-ppc, social-media-marketing, content-marketing, link-building, geo-ai-search, reputation-management, email-marketing, conversion-rate-optimization).

## ROADMAP — two phases (do not lose Phase B)
- **Phase A — national service pages (CURRENT).** The 12-page map (pillar + 11 spokes). **Completed by Steps 7–8.** ← Step 8 is all that remains.
- **Phase B — geo layer (NEXT, after Phase A).** Option D: `[service]+[city]` pages for **every GTA municipality + major Canadian metros**, at `/services/digital-marketing/<service>/<city>`, each with genuine local content (no thin doorway pages). **Full spec:** `seo-tools/runbook/00-architecture.md` → "Geography (decided: option D)". Same 8-step run book per page; expansion via Ahrefs matching-terms + Semrush.
- **Future (beyond Phase B):** the other 4 main services (Microsoft 365, QuickBooks Migration, etc.) each gain their own sub-services under the same nested pattern.

## WHERE WE ARE — Steps 1–7 COMPLETE (content built + integrated into the app)
- **Steps 1–6 (content + gates):** complete for all 12 pages. Each page's record is its `<slug>/01…06d` artifact trail. Binding gates green (coverage, fact-check, Winston plagiarism ≤2%); AI-detection advisory.
- **Step 7 (integration): DONE (2026-06-23, commits `297d6d9`..`8b7f6b5`, pushed).**
  - **7A — structural reconciliation:** app reconciled to the 12-map — renamed `generative-engine-optimization`→`geo-ai-search` and `google-ads`→`google-ads-ppc`; dropped `technical-seo`, `analytics-reporting`; folded `google-business-profile` into `local-seo`; added `reputation-management`. (`internal-links.ts`, `App.tsx`, page wrappers, pillar ref.)
  - **7B — content integration:** all 11 spokes have a typed `DM_SPOKE_CONTENT[slug]` entry built from their gated `06c-humanized.md` (stats from `06a`). All `published: true`. typecheck + `vite build` pass; metaDescriptions ≤160.

## EXACT NEXT STEP — Step 8 (QA) — the only thing left to finish Phase A
The route set changed in 7A, so the committed SEO snapshots + sitemap are **intentionally stale** until regenerated. Step 8:
1. `pnpm -C artifacts/nexfortis run build` (vite build → `prerender.mjs` → `generate-sitemap.mjs`) — prerenders the 11 new routes, drops the removed ones.
2. Coverage on the **rendered HTML** for each spoke (keywords + headings vs `04-outline.json`).
3. Cannibalization check (`check-cannibalization.mjs`) on the 12-map.
4. Regenerate SEO snapshots (`pnpm test:seo:update`) + reconcile `tests/seo/dm-word-targets.json` to the new slugs / SERP-derived targets + `tests/seo/__known-issues__.json`.
5. `node --test tests/seo/*.test.mjs` (bash). `git checkout` the sitemap snapshot after update if needed.
6. Live Render preview check.

## ALSO PENDING (after / alongside Step 8)
- **Services menu restructure (UX):** nested flyout — Services dropdown shows the 5 main services; hovering "Digital Marketing" opens a right-side flyout of the DM sub-services (reusable for the other mains later). Lives in `artifacts/nexfortis/src/components/layout.tsx`. **To be done by the Replit agent via the Replit connector** (operator's instruction), after Step 8.
- **Cleanup — now SAFE:** Step 7A removed all app references to the old slugs, so the old-slug runbook folders (`generative-engine-optimization`, `google-ads`, `google-business-profile`, `technical-seo`, `analytics-reporting`) can now be deleted. (Trace provenance + show the list before deleting, per protocol.) Optional: 301 redirects for the old URLs if they were ever indexed.
