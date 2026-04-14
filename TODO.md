# NexFortis Implementation Checklist

See `docs/implementation-plan.md` for full gap analysis and dependency graph.
See `docs/prompts/` for the detailed prompt files for each step.

## Phase 0 — Foundation (no dependencies)

- [x] **Prompt 01**: Product catalog overhaul (54→20 products), email replacement (hassansadiq73→support@nexfortis.com), SEO foundation (react-helmet-async, robots.txt, sitemap.xml, OG tags) — **DONE** (PR #2 merged)
- [x] **Prompt 01 Fixes**: 24 E2E issues (FAQ content, special chars, add-ons, category counts, response time) — **DONE** (PR #3 merged)
- [ ] **Prompt 03**: Admin auth foundation — `role` column on qb_users, operator middleware, admin login, seed operator account, admin layout shell
  - PRD: `feature-operator-admin-panel.md`

## Phase 1 — Core Commerce (requires Prompt 01, 03)

- [ ] **Prompt 02**: Catalog UI — promo badges, /mo pricing, per-conversion rates, FAQ filter tabs, home page promo banner, GST/HST disclosures
  - PRD: `feature-product-catalog-pricing.md`
- [ ] **Prompt 04**: Order flow update — new product IDs, file upload per service type, volume packs, bundles
  - PRD: `feature-product-catalog-pricing.md`
- [ ] **Prompt 05**: Admin panel MVP — order management, ticket management, file download/upload
  - PRD: `feature-operator-admin-panel.md`

## Phase 2 — Subscriptions (requires Prompt 03, 05)

- [ ] **Prompt 06**: Support subscription backend — Stripe subscriptions, plans, webhooks, ticket counting, SLA timer
  - PRD: `feature-expert-support-subscription.md`
- [ ] **Prompt 07**: Support subscription frontend — purchase flow, portal tab, tier badge, ticket priority
  - PRD: `feature-expert-support-subscription.md`
- [ ] **Prompt 08**: Ticket system enhancement — reply/thread, status updates, admin SLA timer, priority routing
  - PRDs: `feature-expert-support-subscription.md`, `feature-operator-admin-panel.md`

## Phase 3 — Growth Features (requires Prompt 04, 06)

- [ ] **Prompt 09**: Promo code system — DB table, validate/redeem API, checkout field, Stripe coupons, subscriber discount
  - PRD: `feature-promo-code-system.md`
- [ ] **Prompt 10**: Promo code admin — create/edit/deactivate codes, analytics, referral code generation
  - PRDs: `feature-promo-code-system.md`, `feature-operator-admin-panel.md`

## Phase 4 — Content & SEO (can start after Prompt 01)

- [ ] **Prompt 11**: SEO landing pages batch 1 — 6 service-specific pages with content, JSON-LD, breadcrumbs
  - PRD: `feature-seo-landing-pages.md`
- [ ] **Prompt 12**: SEO landing pages batch 2 — problem-focused, comparison, and educational pages
  - PRD: `feature-seo-landing-pages.md`

## Phase 5 — Main Website Fixes (independent)

- [ ] **Prompt 13**: Blog admin auth, QB Portal link → qb.nexfortis.com, GA4, headshot, LinkedIn, dead code cleanup
  - PRD: `master-nexfortis-website-remaining-work.md`

## Phase 6 — Polish & Launch Prep

- [ ] **Prompt 14**: Transactional emails — Resend integration for order confirmation, ticket ack, password reset, welcome, subscription events
  - PRDs: multiple
- [ ] **Prompt 15**: Security + polish — CORS whitelist, global error handler, production env validation, final audit
  - PRDs: multiple

## Parallel Execution Rounds

- **Round 1**: Prompt 02 + Prompt 03 (no dependency on each other) ← NEXT
- **Round 2**: Prompt 04 + Prompt 05 (both need Round 1)
- **Round 3**: Prompt 06 + Prompt 07 + Prompt 08 (subscription phase)
- **Round 4**: Prompt 09 + Prompt 10 + Prompt 11 (growth + SEO)
- **Round 5**: Prompt 12 + Prompt 13 (SEO batch 2 + main site)
- **Round 6**: Prompt 14 → Prompt 15 (polish, sequential)

## Out of Scope (handled separately)

- [ ] Actual file processing (qb-converter CLI, separate system)
- [ ] Production Stripe keys (test mode until go-live)
- [ ] Custom domain setup (qb.nexfortis.com DNS)
- [ ] Microsoft Bookings integration (Premium tier v2)
