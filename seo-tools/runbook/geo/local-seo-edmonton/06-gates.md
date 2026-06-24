# local-seo/edmonton — Step 6 gate record

- **6a fact-check: PASS.** Brand claims grounded in `_facts.md`. 3 stats reused from national local-seo 06a (BrightLocal 46% local intent, Backlinko 76%, BrightLocal 71% reviews — verified). Guardrails clean (no Google-Partner, no fabricated results / no claimed Edmonton track record).
- **6b EEAT: FIX 72 → resolved.** The independent auditor caught a REAL geo error: **Sherwood Park is NOT in Edmonton** (separate hamlet in Strathcona County) — removed it (→ Terwillegar) from serviceAreas and the qualifier example. 0 veto failures; genuinely local + doorway-safe (not a Toronto template swap). Other flags (the "businesses rely on/turn to" phrasing, bare metaTitle) are house-style consistent with shipped pages 1–3 and the auto-suffixed brand; polish deferred (E/Exp ceiling).
- **6c humanize: not run (advisory).** AI-detect 71.6 (in-band).
- **6d plagiarism: PASS — Winston 0%** (binding).
- **coverage: PASS — 5/5** (binding). **FIXED a coverage bug:** `local seo services edmonton` (and `seo services markham` on page #3) only lived in the draft's features-lead, which `FeatureGrid` drops at render — moved both into `localContext` so they render. meta 158.

**Verdict: gate-complete.** Edmonton = Alberta (region AB, geo.region CA-AB). Notable: 6b caught a real local-geography error (Sherwood Park) — the independent audit earning its keep.
