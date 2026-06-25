# Phase B — Geo Priority Matrix (LOCKED)

**Date:** 2026-06-24 · **Status:** LOCKED (3-tool consensus). Supersedes the Ahrefs-only first pass in `01-demand-discovery.md`.
**Method:** Workflow `geo-demand-crosscheck` (6 agents, 67 tool calls) — Ahrefs `keywords-explorer-overview` (ca) + DataForSEO (loc 2124) + Semrush (db ca), median-of-3 consensus per `[service]+[city]`. Source data: `wsf2fflls.output` (full per-city 3-tool numbers).
**Scope rule (operator):** all 25 GTA municipalities ship for the 5 geo services regardless of demand (demand sets BUILD ORDER only); metros are demand-gated (consensus ≥~150, or ≥~50 with confirmed commercial/PPC intent + CPC).

## The 5 geo services (data-confirmed)
`seo services`, `local seo`, `web design`, `google ads / ppc`, `social media marketing`.
**NOT geo (national hubs only — proven near-zero city demand):** link building, conversion rate optimization, email marketing, reputation management, generative engine optimization.

## Implied page count
| Service | GTA pages | Metro pages IN | Total |
|---|---|---|---|
| SEO services | 25 | 15 | 40 |
| Local SEO | 25 | 10 | 35 |
| Web design | 25 | 17 | 42 |
| Google Ads / PPC | 25 | 8 | 33 |
| Social media marketing | 25 | 13 | 38 |
| **TOTAL** | **125** | **63** | **188** |

≈ **185** if Burnaby folds into Vancouver (SEO/Web/SMM).

## Tier 1 (build-first) per service — vol / KD
- **SEO services:** Mississauga 1000/5, Toronto 2900/39, Brampton 400/0, Markham 500/0, Calgary 1500/15, Vancouver 1000/31, Edmonton 720/14, Ottawa 480/3.
- **Local SEO:** Toronto 1000/3, Mississauga 210/0, Calgary 480/0, Edmonton 500/0, Vancouver 480/19, Burlington 170/8, Brampton 170/9.
- **Web design:** Brampton 390/1, Mississauga 720/35, Markham 210/0, Oakville 320/12, Pickering 200/0, Milton 210/0, Hamilton 590/1, London ON 390/0, Calgary 600/26, Surrey 390/13, Windsor 150/4. (Toronto 2900/66 = Tier 1.5 — build, slow rank.)
- **Google Ads/PPC:** Toronto 400/1, Saskatoon 300/0, Calgary 250/0, Montreal 200/0, Edmonton 150, Vancouver 120/0, Mississauga 90, Ottawa 90.
- **Social media mktg:** Calgary 400/1, Toronto 320/7, Vancouver 200/0, Edmonton 190/12, London ON 150/0, Montreal 140/1.

(Full Tier 2 / Tier 3 lists + every city's 3-tool numbers: see `wsf2fflls.output`. Tier 3 = the near-zero-demand GTA exurbs — ship for coverage, lowest priority.)

## Metro cut decisions (demand-gated)
- **SEO services — IN (15):** Calgary, Vancouver, Edmonton, Ottawa, Montreal, Hamilton, Halifax, Surrey, London ON, Winnipeg, Victoria, Kitchener, Waterloo, Saskatoon, Regina. OUT: Windsor 60, Quebec City 0.
- **Local SEO — IN (10):** Edmonton, Calgary, Vancouver, Ottawa, Halifax, Hamilton, Montreal, Surrey, Winnipeg, Kitchener. OUT: London ON, Waterloo, Saskatoon, Victoria, Burnaby, Windsor, Regina, Quebec City.
- **Web design — IN (17):** Ottawa, Edmonton, Vancouver, Calgary, Hamilton, Surrey, London ON, Kitchener, Montreal, Winnipeg, Victoria, Saskatoon, Halifax, Regina, Burnaby, Windsor, Waterloo. OUT: Quebec City.
- **PPC — IN (8):** Saskatoon, Calgary, Montreal, Edmonton, Vancouver, Ottawa, Victoria, Hamilton (threshold relaxed: PPC demand skews sub-150 but high commercial intent + CPC). OUT: the rest ≤20.
- **SMM — IN (13):** Calgary, Vancouver, Edmonton, London ON, Montreal, Ottawa, Hamilton, Winnipeg, Victoria, Surrey, Windsor, Saskatoon, Burnaby. OUT: Kitchener, Waterloo, Halifax, Regina, Quebec City.

## Recommended first 15 pages (ROI = vol × low-KD × commercial)
1. Local SEO — Toronto (1000, KD 3) — best ratio in the project
2. SEO services — Mississauga (1000, KD 5)
3. Web design — Brampton (390, KD 1)
4. Web design — Hamilton (590, KD 1) *(verify DFS-difficulty conflict)*
5. SEO services — Brampton (400, KD 0)
6. Local SEO — Edmonton (500, KD 0) / Calgary (480, KD 0)
7. SEO services — Markham (500, KD 0)
8. Web design — London ON (390, KD 0)
9. Social media marketing — Calgary (400, KD 1)
10. PPC — Toronto (400, KD 1, high CPC)
11. SEO services — Calgary (1500, KD 15)
12. Web design — Mississauga (720, KD 35)
13. Local SEO — Mississauga (210, KD 0)
14. PPC — Saskatoon (300, KD 0)
15. SEO services — Toronto (2900, KD ~39) — flagship, start early (slow climb)

## ⚠️ Strategic flags before building
1. **Doorway-page risk (the big one):** of the 125 mandatory GTA pages, ~50–60 have **near-zero demand** (Caledon, Georgina, King City/Nobleton [HQ], Stouffville, East Gwillimbury, Uxbridge, Brock, Scugog, Clarington, Ajax, Whitby, Newmarket, Aurora, Pickering across services). They ship by operator rule but carry **no SEO ROI** and, if templated/thin, trigger the doorway-page penalty (spec Caveat #4). They REQUIRE genuine differentiated local content (real local detail) or a deliberately distinct content model for the zero-demand tier. **188 pages of genuine local content is a very large content effort** — needs a scalable-but-non-thin model decided up front.
2. **Contamination corrected:** Uxbridge (UK, real ON ~0), Halifax (partial UK), London (must qualify "ontario"), Surrey (UK county, partial), Hamilton (US/NZ may inflate KD), Victoria/Aurora/Brock/Georgetown (ambiguous). Use the discounted consensus, not the raw inflated number.
3. **French markets:** Quebec City English ~0 → CUT (pursue `agence seo quebec` if targeting QC); Montreal English worthwhile but undercounts true French demand (`agence …`).
4. **KD conflicts to verify before prioritizing:** Web design Hamilton (Ahrefs KD 1 vs DFS 73) and Winnipeg (33 vs 94).
5. **Metro trim option:** the 63 metro pages are optional/demand-gated — can be trimmed to top metros if 188 is too large for the first wave.

## Next
- Decide the **content model per demand tier** (esp. the zero-demand GTA tier — genuine-local vs lighter model) to avoid the doorway penalty.
- Design the **geo route + page template + local content model** (`/services/digital-marketing/<service>/<city>`).
- Then run the per-page run book starting with the #1 ROI page (Local SEO Toronto).
