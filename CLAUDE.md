## Learning and Memory Management

- Memory is handled by the **Hindsight** MCP server (Hindsight Cloud, bank `openclaw`). The `hindsight-memory` plugin auto-recalls on every prompt and auto-retains on stop, so durable context is captured automatically.
- Proactively `retain` / `sync_retain` important technical decisions, architectural choices, user preferences, and project context; `recall` (or `reflect`) relevant prior context before starting complex tasks.
- The `private-journal` tool has been removed — do not use it. Use Hindsight for all memory.
- Hindsight runs on top of Claude's native auto-memory, which remains enabled.

## NexFortis Content Run Book — non-negotiable execution discipline

The run book (`seo-tools/CONTENT-RUNBOOK.md`) is a strict DEPENDENCY CHAIN: each step's output is the next step's input. Follow it exactly — this section exists because I have repeatedly skipped steps and rationalized substitutes.

1. **One step at a time, with Hassan's checkpoint between steps.** No autonomous multi-step runs.
2. **Run the prescribed tool and show its RAW output FIRST, before any synthesis.** If I present a step's result without the tool's raw output first, I skipped the step — stop me. (Verifiable anti-skip gate.)
3. **KI generates the brief AND the outline in its AI backend — I NEVER author either myself.** Even if the brief or outline comes out completely off or nonsensical, I do NOT get to write it. My role is reviewer + steerer, never author.
4. **Both the brief and the outline are AI-generated and CAN hallucinate — each gets a thorough, comprehensive, big-picture review against its source** (brief ⇒ the scraped SERP/raw data; outline ⇒ the brief). "Jobs complete (16/17)" ≠ "correct."
5. **If a KI output is wrong: diagnose WHY, then either fix it directly or regenerate through KI with adjusted levers** (outline: `additional_context`; brief: keyword/location; clustering: method / accuracy / hub) and re-review. NEVER substitute my own authored version.
6. **Block on any stall / break / "off" output.** Don't work around it; trace it UPSTREAM (my error or a prior step), never "the tool is just wrong." Verify completeness before building on any output.
7. **Ground everything** in the competitor report + real tool data + `_facts.md`. NO fabricated stats/clients/numbers/prices/guarantees ("exaggerate" = confident framing of TRUE facts only).

### Per-step tool — use exactly this, do not substitute
| Step | Tool / command |
|---|---|
| 1 Keyword research | `node seo-tools/dataforseo.mjs keywords "k1,k2" 2124 en` + Ahrefs MCP overview/matching-terms (country `ca`, intents) + Semrush if on plan — 3-tool consensus |
| 2 Cluster + cannibalization | KI `keyword-insights.mjs cluster <payload.json>` (global map = `seo-tools/runbook/keyword-ownership.json`) → `node seo-tools/runbook/check-cannibalization.mjs` |
| 3 Brief (KI) | `keyword-insights.mjs brief "<kw>" "Canada"` → `wait-brief <payload.id>`; verify 16/17 (api_jobs skipped; optimizations_* can lag → `get-brief` re-check) → **then thoroughly review the brief vs the scraped SERP data** |
| 4 Outline (KI generates) | `keyword-insights.mjs outline <order_id> "<additional_context>"` → `wait-outline <order_id> <auto_id>`. **Then thoroughly review vs the brief `raw[]`. Wrong? adjust `additional_context` + regenerate via KI + re-review — NEVER hand-author.** Reconcile to template rendered headings → lock `<slug>/04-outline.json` |
| 5 Draft | Claude (primary writer), grounded in brief + outline + `_facts.md` |
| 6 Gates | 6a fact-check (verify each stat live via firecrawl, or cut) ▸ 6b `aaron-seo-geo:content-quality-auditor` (run it — never self-grade) ▸ 6c `humanize.mjs <slug>` + proofread + re-verify ▸ 6d `plagiarism-check.mjs scan <slug>` (Winston, binding) + `undetectable-detect.mjs` (AI, advisory) ▸ coverage `check-keyword-coverage.mjs <slug> <file>` |
| 7 Integrate | `_dmContent.tsx` typed `DM_SPOKE_CONTENT[slug]`; `internal-links.ts` `published` flag; reconcile `04-outline.json` ↔ rendered headings; `&`→`and` in headings; ≥3 DISTINCT citation URLs; meta ≤160 |
| 8 QA | `pnpm -C artifacts/nexfortis build:no-prerender` → `PUPPETEER_EXECUTABLE_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" node prerender.mjs` → coverage on rendered HTML → cannibalization → `node --test tests/seo/*.test.mjs` (bash; `git checkout` sitemap snapshots after update) → live Render preview |

### KI brief stall protocol
KI's `html_scraping` intermittently fails (healthy, then stalls). A stalled brief eventually finishes — **do NOT relaunch it.** Wait, or hold the page and brief via the KI UI in Claude-in-Chrome. **When the API is healthy, front-load Steps 1→brief→outline for ALL pages** before it breaks again. Brief order IDs: `seo-tools/runbook/brief-orders.json`.
