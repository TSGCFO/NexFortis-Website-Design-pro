# Phase B — Geo Demand Discovery (Step 1, matrix scoping)

**Date:** 2026-06-24 · **Status:** FIRST PASS (Ahrefs only — NOT yet 3-tool consensus). Do not lock until DataForSEO + Semrush cross-check.
**Method:** Ahrefs `keywords-explorer-matching-terms`, country `ca`, `match_mode=phrase`, `order_by=volume:desc`, top ~45 per service head. One head per service (paid line checked via both `ppc` and `google ads`). City-qualified rows extracted = the only demand that justifies a `[service]+[city]` page (spec Caveat #4: thin templated city pages = doorway penalty).

> ⚠️ This supersedes the assumption-based "lead services/cities" that was floated and (correctly) rejected on 2026-06-24. Leads here are DATA-derived.

## Per-service geo demand (top city combos, volume / KD)

| Service (head) | Top geo combos | Verdict |
|---|---|---|
| seo services | Toronto 1700/35, Calgary 1500/15, Edmonton 800/5, Mississauga 700/4, Vancouver 700/41, Ottawa 400/13, Halifax 350/7 | **GEO ★★★** |
| local seo | Toronto 1000/3, Vancouver 700/19, Calgary 600/0, Edmonton 500-700/0-2, Markham 500/0, Mississauga 250/0, Ottawa 250/2, Burlington 300, Stouffville 700/0, Uxbridge 400/0 | **GEO ★★★** |
| web design | Toronto 800/66, Vancouver 800/51, Edmonton 800/31, Calgary 600/26, Hamilton 500/1, Ottawa 450/38, Mississauga 400/35, Montreal 350/51 | **GEO ★★ (high KD)** |
| google ads / ppc | ppc mgmt Toronto 400/1, ppc agency Toronto 400/1, ppc Calgary 350, g.ads Calgary 250/0, ppc/g.ads Mississauga 300/250, Edmonton 200/200, g.ads Montreal 200/0, g.ads agency Toronto 200/0 | **GEO ★★ (KD≈0)** |
| social media marketing | Calgary 400/1, Toronto agency 300/7, Toronto 250/11, Vancouver 200/0, Edmonton 200/17, Hamilton 150/0, Markham 150/0, Montreal 150/1-2, Barrie 150/0, London ON 150/0 | **GEO ★★ (KD≈0)** |
| content marketing | Vancouver 200/0, Toronto agency 200/13, Toronto 150/0, Edmonton 150, Ottawa 100 | **borderline ☆** |
| link building | Barrie 100, Calgary 100, Mississauga 100, Toronto 80 | **NATIONAL ✗** |
| conversion rate optimization | Abbotsford 150, Ottawa 60, Toronto 40, Vancouver 20 | **NATIONAL ✗** |
| email marketing | Toronto 150, Vancouver 150 | **NATIONAL ✗** |
| reputation management | Toronto ~200/0 only | **NATIONAL ✗** |
| generative engine optimization | Calgary 50, Montreal 50, Lethbridge 50 (head 1000 but informational/tools) | **NATIONAL/EMERGING ✗** |

## Determination (data-backed)
- **Geo-page services (5 + 1 borderline):** seo services, local seo, web design, google ads/ppc, social media marketing; (content marketing borderline).
- **NOT geo (national hubs only):** link building, CRO, email marketing, reputation management, generative engine optimization.
- **Lead cities (aggregate [service]+city volume):** Toronto ≫ Calgary > Vancouver ≈ Edmonton > Mississauga > Ottawa, then Montreal / Hamilton / Markham / Halifax / Burlington / Barrie / London ON. **Major metros lead, NOT GTA suburbs.**

## Open items before the matrix is LOCKED
1. **3-tool consensus:** cross-check the shortlist combos with `seo-tools/dataforseo.mjs` (loc 2124) + Semrush. (Run book mandates 3-tool.)
2. **Top-45 cutoff blind spot:** targeted Ahrefs/DFS `overview` on mid-tier GTA cities NOT seen in top-45 (Brampton, Vaughan, Richmond Hill, Oakville, Oshawa, Burlington) to confirm whether they have sub-top-45 demand or are true ~0.
3. Decide page priority = volume × (low KD) × commercial intent; sequence the build order.
4. Geo route/template/content model (genuine local content) — separate architecture step before page #1.
