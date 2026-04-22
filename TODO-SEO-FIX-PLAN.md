# SEO Re-Audit — Fix Plan & PR Status

> **For the AI agent reading this after context compaction:** Read this file
> **and** `TODO-SEO-AUDIT.md` immediately on resume before taking any other
> action on SEO work. This file is the status board.

Last updated: 2026-04-22

---

## Three-PR Plan (locked with user on 2026-04-22)

### PR #50 — Sitemap + prerender fail-closed guards + blog API unification

**Status: MERGED**

**Branch:** `fix/seo-pr1-sitemap-prerender-guards`
**GitHub:** https://github.com/TSGCFO/NexFortis-Website-Design-pro/pull/50

**Scope (delivered):**

1. Regenerate committed `artifacts/qb-portal/public/sitemap.xml` to drop 4 retired expert-support URLs. 49 URLs now, matches live prod byte-for-byte on URL set / priority / changefreq.
2. Harden `artifacts/qb-portal/prerender.mjs` `loadDynamicRoutes()`:
   - `products.json` missing/invalid → throw
   - `services[]` empty or non-array → throw
   - zero services with `.slug` → throw
   - `landingPages.ts` missing → throw
   - zero slug matches → throw
3. Harden `artifacts/nexfortis/scripts/generate-sitemap.mjs` `loadBlogDates()`:
   - blog-fallback.json missing → throw (was unhandled rejection)
   - Blog API default changed: `api.nexfortis.com` (NXDOMAIN) → `nexfortis-api.onrender.com/api`
   - New primary env var `BLOG_API` unifies both scripts

**Verification performed:**
- Happy path: loadDynamicRoutes returns 41 routes (17 svc + 4 cat + 20 landing). ✓
- Failure: moved products.json aside → throws with descriptive error. ✓
- Failure: pointed fallback loader at nonexistent file → throws. ✓
- Sitemap diff vs live: URL sets identical, priorities identical, changefreqs identical, only lastmod dates differ (expected). ✓
- Line-by-line review by primary AI agent: complete. ✓

**User decisions on PR1:**
- Failure mode: Hard exit with clear error (Render keeps previous deploy live, shows error in build log)
- Blog API host: Drop api.nexfortis.com for now, use onrender URL everywhere

---

### PR #51 — Polish pass (every issue from audit's "IMPORTANT" and "MINOR" buckets)

**Status: NOT STARTED**

**Scope (must fix every single one of these — user said "no issue whatsoever deferred"):**

#### From Head Tags audit

- [ ] Title overruns on 6 URLs
  - `artifacts/nexfortis/src/pages/blog-post.tsx:54` — use separate `seoTitle` field (add `seoTitle` column to blog API; fall back to H1 truncated to 60 chars)
  - `artifacts/qb-portal/src/pages/catalog.tsx` — shorten title prop
  - `artifacts/qb-portal/src/pages/subscription.tsx` — shorten title prop
- [ ] Description overruns on 11 URLs
  - `artifacts/qb-portal/src/pages/service-detail.tsx` — use new `meta_description` field (add column to Supabase `services`; fall back to `description` truncated to 155 chars + "…")
  - `artifacts/nexfortis/src/pages/blog-post.tsx` — use new `metaDescription` field (add to blog API; fall back to excerpt truncated)

#### From JSON-LD gaps

- [ ] `artifacts/qb-portal/src/components/landing-page-layout.tsx:49-58` — extend the `else if` branch to emit a `HowTo` schema for `category === "problem"` and `category === "comparison"` landings when `process.length > 0`
- [ ] `artifacts/nexfortis/src/pages/services.tsx` — add `<ServiceSchema>` wrapper (service overview page is missing one)

#### From Link Integrity audit

- [ ] `artifacts/api-server/src/routes/qb-admin-promo.ts:28` — remove `"expert-support"` from `ALLOWED_CATEGORIES` (dead code, no products reference that slug anymore)
- [ ] `artifacts/qb-portal/src/pages/catalog.tsx:40` — update description from "20 services across 5 categories" to "17 services across 4 categories" (or make it dynamic from products.json count)
- [ ] `artifacts/qb-portal/src/pages/home.tsx:142` — remove "expert support" mention (retired category)
- [ ] `artifacts/qb-portal/src/pages/category.tsx:~52` — fix "Browse 6 QuickBooks quickbooks conversion services services" double-word bug (strip "services" suffix from categoryName before interpolating)
- [ ] Orphan page fix: add an inbound link from `/subscription` to `/landing/quickbooks-support-subscription`
- [ ] Anchor text casing: standardize "Contact Us" → "Contact us" (17 wins over 7) across all 24 nexfortis pages
- [ ] Anchor text casing: match landing-page title casing across the 3 qb-portal pages that link to `/landing/how-conversion-works`

#### From Prerender audit (IMPORTANT items, not CRITICAL)

- [ ] `artifacts/qb-portal/prerender.mjs` — add `/^\/portal/` to `EXCLUDED_PATTERNS` (future `/portal/settings` would otherwise escape into the prerender queue)
- [ ] `artifacts/qb-portal/src/App.tsx` and `artifacts/nexfortis/src/App.tsx` — add code comment near `<Route component={NotFound}/>` warning against adding `path="*"` (would break prerender with cryptic error)
- [ ] `artifacts/nexfortis/prerender.mjs` near `/services/automation-software` exclusion — add a code comment tying it to the render.yaml redirect so future devs don't unpair them

#### Deferred / user-to-clarify-later

- [ ] GSC recrawl requests for the 4 retired URLs (`/service/expert-support-{essentials,professional,premium}` + `/category/expert-support`) — this is a manual action in Google Search Console after PR #51 ships; not automatable via API without OAuth flow setup

---

### PR #52 — Accessibility + Performance

**Status: NOT STARTED — user wants to discuss scope before work begins**

**Accessibility items from Lighthouse:**

- [ ] `color-contrast`: per-page sweep; PR #47 fixed headers, now need body secondary text, muted states, hover states, disabled states. Need full axe run per page.
- [ ] `heading-order`: find and fix H2→H4 skips (need per-page verification)
- [ ] `meta-viewport`: remove `user-scalable=no` from all pages (violates WCAG 1.4.4 — pinch-to-zoom)
- [ ] `aria-allowed-role` on nexfortis desktop: find and fix invalid ARIA role

**Performance items from Lighthouse:**

- [ ] Unused JavaScript (~300–750 ms savings): code-split heavier routes, especially `/services/microsoft-365` (mobile score 19)
- [ ] Preconnect to third-party origins (~300 ms): add `<link rel="preconnect">` for API, fonts, GA
- [ ] Render-blocking CSS: inline critical CSS or async-load non-critical
- [ ] Offscreen images: lazy-load below-the-fold images

**User's stated questions about PR #52 (to discuss live before starting):**
- Scope: how aggressive vs conservative on code-splitting
- Whether to defer any of these items
- Whether to run an autonomous experimentation loop (user has `autoresearch` skill) on the performance optimizations

---

## After PR #52: Remaining pre-launch work

- [ ] Subscription cancel test — original pre-landmine goal; test that a subscription customer can cancel via the portal, receives email confirmation, Stripe subscription transitions to canceled, portal UI reflects canceled state
- [ ] Subscription checkout promo-code support (deferred) — `artifacts/api-server/src/routes/qb-subscriptions.ts` lacks `allow_promotion_codes`, `discounts`, or `promoCode` in body; subscription customers cannot apply coupons at checkout
- [ ] Phase 4 results report — compile all work done since text-contrast fix
- [ ] SEO snapshot/diff CI (user-designed, post-launch) — non-blocking GitHub Action that diffs head tags / sitemap / JSON-LD per PR and posts a comment; user wants notifications, not gating

---

## User's Guardrails (preserve exactly)

1. "Any issue whatsoever. We do not move forward until it's fully resolved to the next prompt" (before PR #52)
2. "All PR reviews and committed changes must only be reviewed by you. All your reviews must always be line by line reviews. You must read every line" — the primary AI agent is the sole code reviewer; does not trust external reviewers
3. "Do not make changes to files in the `docs/` directory" (Replit agent only)
4. Never use "scrape" or "crawl"
5. "Don't ask user about adding packages — just do it"
6. "I need a more detailed explanation in simple everyday language, no technical terms, before we push anything"
7. GitHub: use `gh`/`git` CLI with `api_credentials=["github"]`, NOT browser_task
8. SEO CI design (DEFERRED): snapshot + diff notifications, NOT build-blocking
9. "This is too much of a landmine for customers. We will be bombarded with returns/refunds. Stripe doesn't like that" — reason for PR #48 + PR #49 + PR #50 cleanup

---

## Key Infrastructure Facts (preserve)

- **Render services:**
  - qb-portal static site: `srv-d7jdcb0sfn5c73bkla90` at https://qb.nexfortis.com
  - marketing static site: https://nexfortis.com
  - API server: `srv-d7jdcb0sfn5c73bkla9g` at https://nexfortis-api.onrender.com
  - Render team: `tea-d6v9rs8gjchc738hevb0`
- **GitHub repo:** `TSGCFO/NexFortis-Website-Design-pro`, local checkout at `/tmp/nf-review`, always work on `main` as base
- **Supabase project:** `tleuyzqhrynianirdiir`
- **Stripe LIVE account:** `acct_1TNCrPIlg3BstMSE`
- **Operator email:** h.sadiq@nexfortis.com
- **Test customer (Desmond):** milesdesmond743@gmail.com / user_id `ecb6b642-1942-488a-b225-5d951790cdfb`

---

## Architecture Quick Reference

**Two sites, both at `/tmp/nf-review`:**
- `artifacts/nexfortis/` — marketing site at nexfortis.com
- `artifacts/qb-portal/` — customer portal at qb.nexfortis.com

**Both prerenders are dynamic (do NOT hardcode new routes):**
- nexfortis `prerender.mjs`: discovers routes from App.tsx `<Route path="...">` + blog posts from API with fallback.
  - EXCLUDED_ROUTES: `/admin/login`, `/blog/admin`, `/blog/:slug`, `/services/automation-software`
  - EXCLUDED_PATTERNS: `/^\/admin/`, `/\/:/`
  - NOINDEX_ALLOWLIST: empty (build fails if noindex leaks)
- qb-portal `prerender.mjs`: App.tsx static routes + dynamic from products.json + landingPages.ts
  - EXCLUDED_ROUTES: `/order`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/auth/callback`, `/portal`, `/ticket/:id`, `/order/:id`, `/service/:slug`, `/category/:slug`, `/landing/:slug`
  - (service/category/landing `:slug` patterns are excluded as patterns; real concrete URLs like `/service/enterprise-to-premier-standard` are added separately from products.json)

**Sitemaps (also dynamic):**
- `scripts/generate-sitemap.mjs` on each site walks `dist/public/*/index.html`, each directory becomes a URL

**render.yaml redirects (qb-portal):**
- `/service/expert-support-essentials` → `/subscription` (301)
- `/service/expert-support-professional` → `/subscription` (301)
- `/service/expert-support-premium` → `/subscription` (301)
- `/category/expert-support` → `/subscription` (301)

**render.yaml redirects (nexfortis):**
- `/services/automation-software` → `/services/workflow-automation` (301)
