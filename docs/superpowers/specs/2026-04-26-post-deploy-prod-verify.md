# Spec: Post-Deploy Production SEO Verification

**Date:** 2026-04-26
**Status:** Implemented (PR pending)
**Owner:** primary AI agent (per session handoff rules)

## Problem

The existing live-site SEO verifiers in `scripts/seo-verification/`
(`verify-rendered-content.mjs`, `verify-head-tags.mjs`) only run on PR
previews. After a PR merges to `main` and Render redeploys production, no
automated check fires against the live `nexfortis.com` and `qb.nexfortis.com`
HTML. A regression that ships only on production (e.g., a Render-side
prerender skip, an env-var-dependent rendering bug, a CDN cache poisoning)
would go undetected until manually noticed or surfaced by Search Console.

## Hard rule

**Do not modify any file under `scripts/seo-verification/`.** This includes
both verifier scripts and their tests. The wiring must invoke them
externally.

## Solution

Add a new GitHub Actions workflow at
`.github/workflows/post-deploy-prod-verify.yml` that calls the existing
verifiers against production sitemaps.

### Triggers

1. `repository_dispatch` with `event_type=render-deploy-succeeded` — fired by
   a Render Outgoing Webhook configured on each service.
2. `workflow_dispatch` — manual on-demand from Actions UI.
3. `schedule: '0 7 * * *'` — daily safety net at 07:00 UTC (~03:00 EDT).
4. `push: branches: [main]` — best-effort post-merge run with a 5-minute
   sleep to allow Render to roll out before verification.

### Job

- Checkout, set up Node 24
- Resolve `SITEMAP_URLS` env from trigger context (prod URLs by default)
- Run `node scripts/seo-verification/verify-rendered-content.mjs`
- Run `node scripts/seo-verification/verify-head-tags.mjs`
- On failure: create or comment on a `prod-verify-failure`-labelled issue
  with a link to the failing run.

### Concurrency

`concurrency: post-deploy-prod-verify` with `cancel-in-progress: false` so
overlapping runs queue rather than cancel.

## Render webhook setup (manual, one-time)

After this workflow ships, the user must:

1. In the Render dashboard for `nexfortis-marketing` and
   `nexfortis-qb-portal` (and optionally `nexfortis-api`):
   Settings → Notifications/Webhooks → Add Outgoing Webhook
2. URL:
   `https://api.github.com/repos/TSGCFO/NexFortis-Website-Design-pro/dispatches`
3. Method: POST
4. Headers:
   - `Authorization: token <fine-grained PAT with repo:dispatch>`
   - `Accept: application/vnd.github+json`
5. Body:
   ```json
   {
     "event_type": "render-deploy-succeeded",
     "client_payload": {
       "service": "{{service.name}}",
       "deploy": "{{deploy.id}}",
       "url": "{{service.url}}"
     }
   }
   ```
6. Trigger: "Deploy succeeded"

If the webhook can't be configured immediately, the daily cron + push trigger
provide acceptable fallback coverage (≤24h to detection).

## Out of scope (not in this PR)

- Modifying or replacing the verifier scripts (forbidden by hard rule)
- Adding new check categories (size, viewport, robots.txt validation)
- Slack/email notifications beyond GitHub Issues
- Branch protection: this workflow does NOT need to be a required check
  because it runs against prod, not against PRs

## Acceptance criteria

- [x] Workflow file exists at `.github/workflows/post-deploy-prod-verify.yml`
- [x] Workflow runs on all 4 trigger types
- [x] Both existing verifier scripts invoked unchanged
- [x] No file under `scripts/seo-verification/` modified
- [x] Failure path creates/comments a labelled GitHub Issue
- [ ] Render webhook configured on both prod services (manual, post-merge)
- [ ] First scheduled run completes successfully against prod
