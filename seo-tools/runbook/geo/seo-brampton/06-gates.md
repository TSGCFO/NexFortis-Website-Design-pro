# seo/brampton — Step 6 gate record

- **6a fact-check: PASS.** Brand claims grounded in `_facts.md`. 3 stats reused from national seo 06a (verified). Guardrails clean: no Google-Partner, no fabricated results, no client counts.
- **6b EEAT: SHIP — 79/100** (independent). 0 veto failures. All 12 named Brampton districts verified real (incl. Churchville — Brampton's only heritage conservation district — and Sandalwood). Differentiated from local-seo (Local SEO scoped as one component); no fabrication. Lower-than-usual score is the thin Experience dimension (very-thin 207–272 SERP → lean page), i.e. the E/Exp ceiling deferred until real client proof exists.
- **6c humanize: not run.** AI-detect null (advisory).
- **6d plagiarism: PASS — Winston 0%** (binding). **coverage: PASS — 5/5** (binding). meta 151.
- **TEMPLATE FIX (surfaced by 6b):** the auto features heading rendered "Our seo services work in [city]" (`serviceLabel.toLowerCase()` of the link text). Changed `_GeoServicePageBody` to use `c.serviceType` → "Our SEO work in [city]" / "Our Local SEO work in [city]" / "Our Web Design work in [city]". Affects every SEO/local-SEO geo page; live-page fixtures regenerated at the #7+#8 deploy.

**Verdict: gate-complete.** Data-grounded primary `seo company brampton` (`seo services brampton` weaker). Very lean page (SERP 207–272).
