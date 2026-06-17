# Operator setup — before you launch the Cursor Cloud Agent

Do these **before** pasting `seo-tools/CURSOR-AGENT-PROMPT.md` into the Cursor agent. The prompt is
the agent's key; this is your pre-flight so the agent doesn't stop on a missing precondition.

## 1. The branch the agent runs on (most important)
The agent needs **both** of these on its branch:
- the digital-marketing **page infrastructure** (the typed link graph, `_DmSpokePageBody`, content
  components, the SEO + content tests) — currently on **`claude/sweet-gauss-aqsk4o`** (PR #102, unmerged), and
- the **run book + tooling** (`seo-tools/`) — currently on **PR #103** (off `main`) and untracked in
  the working tree.

Neither `main` nor the feature branch alone has both *committed*. **Recommended:** I prepare a single
"agent base" branch = `claude/sweet-gauss-aqsk4o` with `seo-tools/` committed onto it, push it, and you
point Cursor at that branch. (Say the word and I'll create it.) The agent then opens its own PR off
that base and **does not merge**.

When I prepare that base branch I will also: (a) make sure the **`seo-tools/.gitignore`** (which
ignores `secrets.local.json` + `tmp/`) is committed on it — without it, a stray `git add -A` by the
agent could commit your API keys; and (b) enable the **pre-push gate** on it (`git config
core.hooksPath seo-tools/runbook/git-hooks`) so the run-book enforcement is live from the first push.

> Do **not** just branch off `main` — `seo-tools/` and the page infra aren't both there, and the agent
> will stop at the §4 preconditions.

## 2. Secrets (the agent will `auth`-check these and stop if missing)
Provide these to the Cursor cloud environment (as Cursor secrets/env vars, or in
`seo-tools/secrets.local.json` — which is **gitignored**, never commit it):
- `KEYWORD_INSIGHTS_API_KEY` (`kwi_sk_…`)
- `KEYWORD_INSIGHTS_FOLDER_ID` (the NexFortis Keyword Insights workspace folder id — copy it from the KI app URL, or from your existing `seo-tools/secrets.local.json`; don't paste it into committed files)
- `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD`
- `UNDETECTABLE_AI_API_KEY` (Undetectable.ai — Gate-3 AI-detection; you have API access for this)
- `WINSTON_AI_API_KEY` (Winston AI — Gate-3 plagiarism; free account = 2,500 credits to start, paid from ~$10/mo)

Balances last seen: Keyword Insights ≈ 14,710 credits; DataForSEO ≈ $30. **14 briefs ≈ 7,000 KI credits**
— enough, but confirm before launch.

## 3. Credit pre-authorization
The agent stops before each paid call **unless your launch message pre-authorizes a budget**. To let
it run unattended, include something explicit like: *"Budget approved: up to 14 KI briefs (~7,000
credits) + DataForSEO keyword pulls. Reuse existing briefs. Do not use the ~1,200-credit KI writer."*

## 4. The NexFortis facts source (required — or the agent flags everything)
The agent may only state **real** facts. Give it a short **facts doc** — real services offered,
demonstrated results you can stand behind, true service-area coverage, approved brand voice, your
correct title/byline. Without it, the agent grounds in the repo and marks anything unverifiable
`[CONFIRM]` for you (safe, but you'll have more to confirm). Drop the doc in the repo and name its
path in your launch message.

## 5. Tools that are NOT available in Cursor (decide how to handle)
- **Ahrefs / Semrush** (Claude Code plugins) — the agent falls back to DataForSEO + KI (sufficient).
  If you want the 3rd/4th cross-check, run them yourself and hand the agent the numbers.
- **EEAT auditor** (aaron plugin) — the agent self-audits against the CORE-EEAT checklist in the prompt.
- **Undetectable.ai** (Gate-3 AI-detection) — ✅ you have API access; the repo helper
  `undetectable-detect.mjs` is wired. Just set `UNDETECTABLE_AI_API_KEY`. (Undetectable does
  AI-detection + humanizing, **not** plagiarism.)
- **Plagiarism** — ✅ **Winston AI** (verified: Undetectable has **no** plagiarism API, UI-only). The
  helper `seo-tools/plagiarism-check.mjs` is **built and key-verified** (`node seo-tools/plagiarism-check.mjs auth`
  returned OK). **Cost: 2 credits/word** — a ~1,500-word page ≈ 3,000 credits, so your free ~2,500
  covers **less than one page** and the full 14-page run is **~42,000 credits** → buy a paid plan
  sized for that before launch (the Local SEO pilot or a single page is fine on the free tier).
  (Winston also does AI-detection, so you *could* consolidate both Gate-3 halves onto it; but
  Undetectable is already wired for AI-detection, so the simplest split is **Undetectable = AI,
  Winston = plagiarism**.)
- **Live verification + self-testing** — ✅ Cursor cloud agents now run a VM with a browser
  (computer-use), so the agent builds, opens the Render preview, and visually verifies each live page
  itself; you don't need to wire a browser tool.

## 6. Model + the hard rules to restate in your launch message
- **Opus 4.8, high effort.**
- Reiterate: **one page at a time, one step at a time, artifacts before proceeding, no fabrication,
  do NOT merge.**
- Tell it the order: **pillar first, then the 13 spokes (Local SEO first — its Steps 1–3 are reusable).**
- Be aware: only **Steps 1–2** of the run book are battle-tested (a live walkthrough produced real
  Local SEO artifacts). **Steps 3–8 in the prompt are doc-derived** — the agent will harden them on the
  first page (the pillar). Review the pillar closely before letting it scale to the other 13. (If you'd
  rather, I can finish the Local SEO walkthrough through Step 5 here first, so the prompt ships fully
  ground-truthed.)

## 7. What you get back
A single PR you review — 14 pages, each with its `seo-tools/runbook/<slug>/` artifact trail (the audit
proof that each went through the run book), a per-page verification ledger of every stat/claim, the
open `[CONFIRM]` list, and total credits spent. **You merge; the agent never does.**

## Suggested launch message (paste alongside the prompt)
> Build the NexFortis digital-marketing pillar + 13 spokes per `seo-tools/CURSOR-AGENT-PROMPT.md`,
> Opus 4.8 / high effort. Work one page at a time, one step at a time, write each step's artifact
> before the next, and never fabricate. Order: pillar first, then the 13 spokes starting with Local
> SEO (reuse its Steps 1–3). Facts source: `<path you provide>`. Budget approved: up to 14 KI briefs
> (~7,000 credits) + DataForSEO pulls; reuse existing briefs; do NOT use the ~1,200-credit KI writer.
> Gate 3: AI-detection via Undetectable.ai (`UNDETECTABLE_AI_API_KEY`) + plagiarism via Winston AI
> (`WINSTON_AI_API_KEY`). Open one PR and STOP — do not merge.
