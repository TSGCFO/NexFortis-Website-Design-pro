# Cursor Cloud Agent — Build the NexFortis Digital-Marketing Pillar + 13 Service Spokes

**Run with: Opus 4.8, high effort.** You are an autonomous engineering + SEO-content agent working
in the NexFortis marketing repo. Your job is to produce the **digital-marketing hub (pillar) page
and its 13 service spokes** — every one taken end-to-end through the locked **Content SEO Run Book**,
so each page can genuinely rank *and* convert, with **no fabricated content**.

This prompt is the contract. Read it fully before doing anything. Then read the canonical sources
in §0. If anything here conflicts with the repo's actual code, the **repo code wins** for mechanics
(scripts, tests, wiring) and you must flag the conflict.

---

## 0. READ THESE FIRST (canonical, in-repo)
1. `seo-tools/CONTENT-RUNBOOK.md` — the canonical run book (decisions + the 8 steps). **Authoritative on strategy.**
2. `seo-tools/runbook/keyword-ownership.json` — the cannibalization registry (page → owned keywords).
3. `seo-tools/runbook/check-cannibalization.mjs` — the overlap checker (a real gate; you will run it).
4. `seo-tools/runbook/local-seo/01-keywords.json` and `02-cluster.json` — a fully worked Step 1–2 example.
5. `artifacts/nexfortis/src/lib/internal-links.ts` — the typed hub-and-spoke link graph (the 14 pages, slugs, published flags).
6. `artifacts/nexfortis/src/pages/services/digital-marketing/` — the existing pillar, `_DmSpokePageBody.tsx` template, `_dmContent.tsx` content module, and wrappers.
7. `tests/seo/` — the 20-rule SEO invariant suite + `dm-service-pages.content.test.mjs` (content/length gate) + `__known-issues__.json` allowlist.

If `seo-tools/` is **not** present in your checkout, STOP — see §4 (the run book + tooling must be on your branch).

---

## 1. MISSION & SCOPE
Produce **14 pages**, each through the full run book:
- **1 pillar:** `/services/digital-marketing` (the hub — broader, links to every published spoke).
- **13 spokes:** seo, local-seo, technical-seo, google-business-profile, content-marketing,
  link-building, generative-engine-optimization, google-ads, social-media-marketing, web-design,
  email-marketing, conversion-rate-optimization, analytics-reporting.

**All existing content for these pages is THROWAWAY** — the 3 "pilot" spokes (seo, local-seo, geo)
and the 3 overnight spokes (google-business-profile, content-marketing, social-media-marketing)
were written *without* the run book (AI-from-the-head, unverified). **Regenerate every page through
the run book.** Treat any existing draft (incl. `seo-tools/tmp/seowind-draft-local-seo.md`) as a
*reference shape only*, never as trusted copy.

---

## 2. THE NON-NEGOTIABLE METHOD (read this twice)
A previous run failed by doing exactly what you must NOT do: it was handed "make all the pages,"
collapsed the run book into a single "write the page" step, and produced AI-from-the-head content
in parallel — the precise thing Google's Helpful-Content system penalizes. **Do not repeat this.**

**The rules that prevent it:**
1. **One page at a time.** Fully finish a page (Steps 1→8) before starting the next. Never batch-write
   pages. Never fan out "write N pages" to sub-agents.
2. **One step at a time, in order.** Within a page, do Step N and **write its artifact file**
   (see §3) **before** Step N+1. Do not start the draft (Step 5) until Steps 1–4 artifacts exist for
   that page. Do not wire the page into the site (Step 7) until Step 6's gates have passed.
3. **Never write page copy from your own head.** Every page is grounded in its brief's research +
   NexFortis's real facts. If a fact isn't in the brief or the facts source, you don't write it
   (see §8).
4. **Artifacts are the proof.** A step is "done" only when its artifact exists and meets its
   done-check. If you can't produce the artifact, the step isn't done — stop, don't fake it.
5. **Gates are hard.** `check-cannibalization.mjs` must pass (Step 2). `pnpm test:seo` must pass
   before any push (Step 8). The fact-check ledger (Step 6a) must have zero unresolved fabrications.
   A failing gate blocks the page — fix or stop; never bypass.

**What is actually ENFORCED vs. merely ADVISORY (be honest with yourself):**
- **HARD-ENFORCED — a page literally cannot be *pushed* without it:** the committed **git pre-push gate**
  (`seo-tools/runbook/git-hooks/pre-push`, enabled with `git config core.hooksPath seo-tools/runbook/git-hooks`).
  It blocks the push if `check-cannibalization.mjs` fails, OR any `published: true` page lacks its
  run-book artifacts (`check-publish-readiness.mjs`). CI also runs `pnpm test:seo` on the PR. **Do not
  bypass with `git push --no-verify`.** This is the only thing that binds you regardless of harness —
  **install it first (see §10).**
- **ADVISORY — only your discipline holds these:** one-page-at-a-time, one-step-at-a-time, and "never
  write copy from your head." The git gate catches a page published with *missing* artifacts; it
  **cannot** tell whether the artifacts you wrote reflect real research instead of invention. That
  part is on you — honour the method above.

---

## 3. THE ARTIFACT CONTRACT (per page)
For each page, create `seo-tools/runbook/<slug>/` (pillar slug = `pillar`) and write these as you go:

| File | Step | Done-check (don't proceed until true) |
|---|---|---|
| `01-keywords.json` | 1 | Each keyword has volume + difficulty from ≥2 tools (or DataForSEO+KI if that's all that's wired), a consensus band, and live-SERP intent. |
| `02-cluster.json` | 2 | Page owns exactly one primary cluster; recorded in `keyword-ownership.json`; `check-cannibalization.mjs` exits 0. |
| `03-brief.json` (+ summary) | 3 | KI brief, location = **Canada** (not US — known bug), with the SERP word-count table + questions. |
| `04-outline.md` | 4 | A target word **range** with the competitor numbers it's derived from; every heading maps to a brief question or this cluster's keyword; nothing from another page's cluster. |
| `05-draft.md` | 5 | Word count in the Step-4 range; **every statistic carries an inline source URL or a `[NEEDS SOURCE]`/`[CONFIRM]` tag**; no banned jargon. |
| `06a-factcheck.json` | 6a | A line-referenced ledger of every stat/outcome/capability claim → verified (with source) / cut / `[CONFIRM]`. Zero unresolved fabrications. |
| `06b-eeat.json` | 6b | Self-audited EEAT ≥ 8/10 (see §7) with the concrete fixes you applied. |
| `06d-aidetect.json` | 6d | Undetectable.ai AI score **< 50** (human) AND a Winston AI **plagiarism scan** (low score, no unattributed verbatim matches). If a key is missing, `{"status":"pending-operator"}`. |
| `07-onpage.json` | 7 | Records the title/meta/schema + the internal links wired (cluster-correct only). |
| `08-qa.json` | 8 | `pnpm test:seo` result + `check-cannibalization.mjs` result + the live-URL HTTP check. |

The Local SEO page already has `01`, `02`, and a reusable brief (`seo-tools/tmp/brief-2d2300e2-*.json`)
— reuse them; don't re-spend.

---

## 4. PRECONDITIONS — verify, and STOP-and-report if any fail
- **Branch has both** the page infrastructure (link graph, `_DmSpokePageBody`, content components,
  the SEO/content tests) **and** `seo-tools/` (run book + tooling). If either is missing, stop and
  tell the operator which branch to run on (see the operator setup doc).
- **Secrets wired:** run `node seo-tools/dataforseo.mjs auth` and `node seo-tools/keyword-insights.mjs auth`.
  If either fails, STOP and ask the operator to set `KEYWORD_INSIGHTS_API_KEY`,
  `KEYWORD_INSIGHTS_FOLDER_ID`, `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD` (in `seo-tools/secrets.local.json`
  or env). **Never hardcode, echo, log, or commit secrets.** `secrets.local.json` and `tmp/` are
  gitignored — keep it that way.
- **NexFortis facts source.** You may only state real, verifiable facts. Extract NexFortis's real
  facts from the repo (existing pages, `about`, brand-voice files) AND from any facts doc the operator
  supplied. If no facts doc exists and the repo lacks a needed fact, **do not invent it** — describe
  the *approach* or flag `[CONFIRM]` (see §8).
- **Credit budget.** Paid calls spend the operator's credits (KI brief ≈ 500 credits each; DataForSEO
  per-call). If the operator's launch message **pre-authorized a budget**, proceed within it and log
  every spend. Otherwise, STOP before the first paid call of each type and request approval. Always
  reuse an existing `seo-tools/tmp/brief-*.json` before creating a new brief.
- **Gate-3 keys.** AI-detection = Undetectable.ai (`UNDETECTABLE_AI_API_KEY`, runs
  `seo-tools/undetectable-detect.mjs`). Plagiarism = Winston AI (`WINSTON_AI_API_KEY`, free tier to
  start). If either key is absent, mark that half of Gate 3 `pending-operator`.

---

## 5. TOOLS IN CURSOR — what you have, what you don't, and the fallback
You are in Cursor, **not** Claude Code — several Claude Code plugins are unavailable. Plan for it.
**Verify, don't assume:** the rows below are the author's best understanding of a Cursor Cloud Agent,
**not confirmed in your actual environment**. Before relying on any of it, confirm how *your* Cursor
agent handles secrets/env, outbound web/API access, and whether `git` runs the pre-push hook (some
setups pass `--no-verify` or skip `core.hooksPath`). If any differs, adapt and tell the operator.

| Need | Wired here? | Use this |
|---|---|---|
| Keyword volume + difficulty | ✅ DataForSEO via `node seo-tools/dataforseo.mjs keywords "..." 2124 en` | Primary. |
| Clustering + intent + SERP brief | ✅ Keyword Insights via `seo-tools/keyword-insights.mjs` (`cluster`, `brief`/`wait-brief`, `read-xlsx.mjs`, `inspect-brief.mjs`) | Primary. KI difficulty == DataForSEO. |
| Ahrefs / Semrush cross-check | ❌ (Claude Code MCP plugins) | **Fallback:** DataForSEO + KI are sufficient for the consensus; if the operator wants the 3rd/4th source, they run it and hand you the numbers. Note the gap in `01-keywords.json`. |
| EEAT audit (aaron auditor) | ❌ (Claude Code plugin) | **Fallback:** self-audit against the CORE-EEAT checklist in §7. Record score + fixes in `06b-eeat.json`. |
| AI-detection (Gate 3) | ✅ Undetectable.ai via `node seo-tools/undetectable-detect.mjs` (key `UNDETECTABLE_AI_API_KEY`) | Primary. Extract page prose to `seo-tools/tmp/detect/<slug>.txt`, run it, target **AI score < 50**; if flagged, humanize and re-run. |
| Plagiarism (Gate 3) | ✅ Winston AI Plagiarism API (`WINSTON_AI_API_KEY`) | Real gate (Undetectable has no plagiarism API). Free tier = 2,500 credits; paid from ~$10/mo. Submit each page's prose → read `plagiarismScore` + sources; investigate any unattributed match. Wire a small helper like `undetectable-detect.mjs`, using the spec at `docs.gowinston.ai/api-reference/plagiarism`. |
| Live page verification | ✅ you control a browser/VM (computer-use) | **Build, deploy the preview, and visually verify the live page yourself** (Step 8); use `curl` for quick HTTP/SEO-tag spot checks too. |
| Web fact-checking (Step 6a) | ✅ your built-in web/fetch tools | Verify every stat against a real primary source. |

---

## 6. THE 8 STEPS PER PAGE (detail in `CONTENT-RUNBOOK.md`; commands condensed here)
Judge every choice by the **two gates, in order: (1) does it help ranking? then (2) does it help the
visitor decide to buy?**

> **Provenance caveat (don't take 3–8 as gospel):** Steps 1–2 were validated by a live walkthrough
> (real artifacts exist for Local SEO at `seo-tools/runbook/local-seo/`). **Steps 3–8 are derived from
> the run-book docs, which can lag the actual code.** Treat them as the plan; verify each against the
> real repo scripts/tests as you execute, and expect to *harden* them on the first page you build (the
> pillar) before scaling to the rest.

1. **Keyword research** → `01-keywords.json`. DataForSEO + KI (Canada, loc 2124). Tools disagree
   on difficulty — record a **band**, not one number, + the live-SERP intent.
2. **Cluster + cannibalization (HARD GATE 1)** → `02-cluster.json`. Assign the page exactly one
   primary cluster; record it in `keyword-ownership.json`; run `node seo-tools/runbook/check-cannibalization.mjs`
   (must exit 0). **One page = one cluster; no keyword on two pages.** Pillar owns the head term
   ("digital marketing services/agency"); spokes own distinct sub-intent clusters; GBP terms stay on
   the GBP page; informational head terms ("local seo", etc.) go to the blog bucket, never a spoke.
3. **SERP brief** → `03-brief.json`. `keyword-insights.mjs brief "<kw>" "Canada" "<folder_id>"` →
   `wait-brief`. Confirm location == Canada. Reuse an existing brief if present.
4. **Outline + SERP-derived length (Claude — you)** → `04-outline.md`. Read the brief's competitor
   word counts, isolate the **service-page subset** (ignore guides/directories for length), target a
   length that beats the thin pages without ballooning. **There is no fixed 1,200 floor** — set a
   per-page range and state the reasoning. Build a **transactional service-page** outline (offer /
   what's included · process · who it's for · why NexFortis · timeline/expectations · FAQ from the
   brief), not a guide. Pull only this cluster's keywords/questions.
5. **First draft (Claude — you, PRIMARY writer)** → `05-draft.md`. Write from the brief + outline +
   NexFortis real facts + the §8 guardrails. Conversion-focused, Canadian English, speak to the owner,
   outcomes-first, CTA to a free consultation/audit, pricing only after a free audit (never invent a
   price). Tag every stat with a source or `[NEEDS SOURCE]`/`[CONFIRM]`.
6. **Gate stack** → `06a/06b/06d`. (6a) **Itemized fact-check (HARD GATE 2):** line-referenced ledger
   of every stat/number/outcome/capability claim → verify against a real primary source, cut, or flag
   `[CONFIRM]`. A generic "double-check the stats" does NOT satisfy this. (6b) **EEAT self-audit** (§7),
   target 8+. (6c) **Humanize** — write clean from the start; only sharpen. (6d) **AI-detection + plagiarism**
   LAST (after all edits): `node seo-tools/undetectable-detect.mjs` (Undetectable.ai) → target AI
   score **< 50**; if flagged, humanize and re-run. **Plagiarism: Winston AI Plagiarism API**
   (`WINSTON_AI_API_KEY`) — scan each page's prose, investigate any unattributed verbatim match.
7. **On-page + internal links** → `07-onpage.json` + the actual code (§9). Title/meta/schema; wire
   links via the typed link graph (cluster-correct only); flip `published: true`; add the nav entry.
8. **Publish QA** → `08-qa.json`. Build + `pnpm test:seo` (must pass) + `check-cannibalization.mjs`
   (must pass). Fix the content-QA/length test to a **SERP-derived per-page target** (it currently
   hard-codes 1,200 and isn't wired into `test:seo` — wire it in). Commit, push to the PR branch,
   `curl` the live preview route for 200 + correct H1. **Never push on a red `test:seo`.**

---

## 7. THE GATES — inlined so you don't need the plugins
**Two gates (priority order):** (1) ranking, (2) conversion.

**EEAT self-audit (Step 6b), score each 0–2, target total ≥ 8/10):**
1. **Experience** — does it read like a real practitioner wrote it (concrete specifics, real GTA/local detail), not generic AI filler?
2. **Expertise** — accurate, specific, correctly-scoped claims; correct terminology; depth that matches the SERP winners.
3. **Authoritativeness** — real, named primary sources for any stat; LocalBusiness/Service schema; author byline (Hassan Sadiq) where the template supports it.
4. **Trust** — no fabrication; claims literally true; clear CTA/contact; last-updated/real specifics; pricing handled honestly (after free audit).
5. **Veto checks (auto-fail if any true):** headline doesn't match page intent; numbers contradict each other; any stat without a real source; any capability claim NexFortis hasn't demonstrated.
Record the score, the veto results, and the fixes you applied in `06b-eeat.json`.

**Hard Gate 1** = cannibalization (Step 2, `check-cannibalization.mjs`).
**Hard Gate 2** = the itemized fact-check ledger (Step 6a).
**Hard Gate 3** = Undetectable.ai AI-detection (AI score < 50) + Winston AI plagiarism scan (low score, no unattributed matches) (Step 6d), or `pending-operator`.

---

## 8. NO-FABRICATION GUARDRAILS (verbatim — these are what Gate 2 enforces)
- **No fabricated statistics.** A cited number must come from a real, verifiable primary source you can name — otherwise don't write it.
- **No invented clients, numbers, awards, prices, or guarantees.**
- **No capability/experience claims NexFortis hasn't actually demonstrated.** Don't write "we have specific experience with X" or "we've helped N businesses" unless it's literally true. When in doubt, describe the *approach* ("our process for X is…"), not a track record.
- Ground every concrete claim in the brief's research or NexFortis's real, known facts. When neither covers it, **cut it or flag `[CONFIRM]`** — never invent to fill the page.

---

## 9. REPO WIRING — how to add/replace one page
The architecture already exists; each page is: content entry → wrapper → route → publish flag → nav + links → tests.
1. **Content entry:** add/replace the slug's object in `artifacts/nexfortis/src/pages/services/digital-marketing/_dmContent.tsx` (typed `DmSpokeContent`). The pillar is `artifacts/nexfortis/src/pages/services/digital-marketing.tsx` (its own page, ~2,000+ words, links published spokes).
2. **Wrapper:** `…/digital-marketing/<slug>.tsx` → `<DmSpokePageBody slug="<slug>" />` (already exists for all 13 — reuse).
3. **Route:** in `artifacts/nexfortis/src/App.tsx`, lazy-import + `<Route path="/services/digital-marketing/<slug>" component={…} />` (path literal so the Puppeteer prerender discovers it).
4. **Publish:** set `published: true` for the slug in `internal-links.ts` (the pillar grid + RelatedServices only surface published spokes — no dead links).
5. **Schema:** reuse `components/seo.tsx` builders (SEO, ServiceSchema, BreadcrumbSchema, FAQSchema, PersonSchema). Global Org/LocalBusiness/WebSite are emitted in `layout.tsx` — **do not re-emit them** (INV-013 double-type).
6. **Tests:** the content test auto-discovers built spokes; add the route + the pre-existing global allowlist entries (INV-001 noscript 2nd `<h1>`, INV-008 footer H2→H4) in `tests/seo/__known-issues__.json` if the suite flags them (they're a global layout pattern, legitimately allowlisted for every nexfortis route).
7. **Navigation (LOCKED decision — and it is NOT built yet, you must build it):** surface the spokes via a **mega-menu sub-menu under the Services dropdown + footer links. NO sidebar.** Pillar in the main nav; spokes hang off it. This is the on-page form of the link graph (site-wide internal links = gate 1; clean discovery = gate 2). Keep links in the DOM even when the menu is closed (so crawlers see them).

---

## 10. ORDER OF WORK, COMMITS, AND THE HARD STOP
0. **Install the pre-push gate FIRST:** `git config core.hooksPath seo-tools/runbook/git-hooks`
   (on Unix also `chmod +x seo-tools/runbook/git-hooks/pre-push`). Confirm it works by running
   `node seo-tools/runbook/check-cannibalization.mjs` and `node seo-tools/runbook/check-publish-readiness.mjs`.
   (Heads-up: publish-readiness will FAIL until the throwaway pilot pages are regenerated — that's
   correct; it's the gate doing its job.)
1. **Pillar first** — fully, all 8 steps. It validates the template and the nav before you scale.
2. **Then the 13 spokes, one at a time.** Start with **Local SEO** (its Steps 1–3 are done/reusable).
3. **Commit per page** (or per small batch) to a **single feature branch / PR**. Push only on green
   `pnpm test:seo`. Keep `seo-tools/runbook/<slug>/` artifacts in the commit (they're the audit trail).
4. **DO NOT MERGE.** Open/append to the PR; leave it for the operator to review and merge. Never push
   to `main`. Never merge autonomously.
5. If a tool breaks or a precondition fails mid-run, **STOP that page and report** — do not route
   around a missing gate or invent data to keep moving.

---

## 11. DEFINITION OF DONE (per page) + final handoff
A page is **done** when: all 10 artifacts exist and pass their done-checks; `pnpm test:seo` and
`check-cannibalization.mjs` are green; the page is wired + published + in the nav; you have
visually verified the live preview page; and Gate 3 (Undetectable AI score < 50 + Winston
plagiarism scan) is either passed or explicitly `pending-operator`.

**Per page, hand back:** the PR link; word count vs. the SERP-derived target (+ the length trade-off);
the **Step-6a verification ledger** (every stat/claim → verified/cut/`[CONFIRM]`); the cluster it
owns; and any `[CONFIRM]` items the operator must confirm-true before publishing.

**Final summary:** a table of all 14 pages with status (done / pending-operator / blocked), the open
`[CONFIRM]` list, total credits spent, and anything that needs the operator (Originality pass, facts
to confirm, Ahrefs/Semrush cross-check if wanted).
