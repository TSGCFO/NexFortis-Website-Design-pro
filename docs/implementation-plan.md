# NexFortis Implementation Plan

## Gap Analysis: PRD Requirements vs. Current Codebase

### Legend
- ✅ Exists and works
- 🟡 Partially exists, needs modification
- ❌ Does not exist, needs building

---

### A. Product Catalog & Pricing (Feature PRD: feature-product-catalog-pricing.md)

| Requirement | Status | Gap |
|---|---|---|
| 20-product catalog | 🟡 | 54 products exist in products.json — needs complete overhaul to 20 |
| 5 categories | 🟡 | 6+ categories exist — need consolidation to 5 |
| Base price + launch price fields | ❌ | Only `price_cad` exists. No `launch_price`, `promo_active`, or `original_price` fields |
| Strikethrough pricing display | ❌ | No promo/discount UI anywhere |
| Category pages | ✅ | `/category/:slug` exists and works |
| Product detail pages | ✅ | `/service/:slug` exists — needs content overhaul |
| Catalog search/filter | ✅ | Search bar + category filter pills exist |
| Add-on flow | 🟡 | Add-ons exist but limited to 2. Need 3 add-ons with correct prices |
| Volume packs (5-pack, 10-pack) | ❌ | No pack products exist |
| Bundle products | ❌ | No bundle concept in catalog |
| Migration products | ❌ | AccountEdge + Sage 50 at $249 need adding |
| Per-service file upload types | 🟡 | Only .QBM accepted. Migrations need different file types |
| Stripe live mode | 🟡 | Test mode works. Needs live keys |
| GST/HST tax | ❌ | No tax configuration in Stripe checkout |
| Order total in cents | ✅ | `total_cad` stored as integer |
| Replace hassansadiq73@gmail.com | 🟡 | Present in 4 frontend locations |

### B. Expert Support Subscription (Feature PRD: feature-expert-support-subscription.md)

| Requirement | Status | Gap |
|---|---|---|
| 3-tier subscription products | ❌ | No subscription concept exists |
| Stripe subscription billing | ❌ | Only one-time payments exist |
| Subscription management (upgrade/downgrade/cancel) | ❌ | No subscription UI |
| Ticket count tracking per cycle | ❌ | No ticket counting |
| Tier-based ticket routing/priority | ❌ | No priority system |
| SLA timer logic | ❌ | No SLA concept |
| Service discounts for subscribers (10%/20%) | ❌ | No discount mechanism |
| Monthly file health check | ❌ | No health check concept |
| Microsoft Bookings integration (Premium) | ❌ | Not started |
| Referral code for Premium tier | ❌ | No referral system |
| Subscription tier display on portal | ❌ | Portal has no subscription section |
| Support ticket enhancement | 🟡 | Basic create/list exists. Need priority, SLA, thread/reply |
| Ticket status update API | ❌ | No PATCH/PUT endpoint for tickets |

### C. Promo Code System (Feature PRD: feature-promo-code-system.md)

| Requirement | Status | Gap |
|---|---|---|
| Promo code input at checkout | ❌ | No promo code field |
| Code validation API | ❌ | No promo code API |
| Code types (%, fixed, free, subscription) | ❌ | No code system |
| Code constraints (limits, expiry, restrictions) | ❌ | No constraint system |
| Stripe Coupon/PromotionCode integration | ❌ | Not implemented |
| Promo codes DB table | ❌ | Table doesn't exist |
| Admin code management | ❌ | No admin panel |
| Code analytics | ❌ | No tracking |

### D. Operator Admin Panel (Feature PRD: feature-operator-admin-panel.md)

| Requirement | Status | Gap |
|---|---|---|
| Admin/operator auth role | 🟡 | Supabase Auth + RLS replaces the homegrown role column approach. Need Supabase Auth integration, operator MFA, RLS policies |
| Admin routes (frontend) | ❌ | No /admin/* routes |
| Admin routes (backend) | ❌ | No admin API endpoints. Needs Supabase JWT verification + requireOperator with AAL2 check |
| Order management dashboard | ❌ | No admin order view |
| Order status update API | ❌ | Only Stripe webhook updates status |
| Customer management | ❌ | No admin customer view |
| Ticket management (admin view all) | ❌ | Tickets only viewable by owner |
| Ticket response/reply | ❌ | No reply mechanism |
| SLA timer display | ❌ | No SLA system |
| Product/pricing management | ❌ | Products are static JSON |
| Dashboard analytics | ❌ | No revenue/order metrics |
| Global promo toggle | ❌ | No feature flag system |
| Processed file upload back to customer | ❌ | Only customer→server upload exists |

### E. SEO Landing Pages (Feature PRD: feature-seo-landing-pages.md)

| Requirement | Status | Gap |
|---|---|---|
| react-helmet-async | ❌ | Not installed in qb-portal |
| Per-page meta tags | ❌ | Static title only |
| robots.txt | ❌ | Doesn't exist for qb-portal |
| sitemap.xml | ❌ | Doesn't exist for qb-portal |
| JSON-LD schemas | ❌ | None in qb-portal |
| OG/Twitter meta tags | ❌ | Not implemented (image exists but unused) |
| Landing page routes | ❌ | No SEO landing pages |
| Landing page content | ❌ | No content written |
| Internal linking | ❌ | No cross-page SEO linking |
| Breadcrumb navigation | ❌ | No breadcrumbs |

### F. NexFortis Main Website Gaps (Master PRD: master-nexfortis-website-remaining-work.md)

| Requirement | Status | Gap |
|---|---|---|
| QB Portal link → qb.nexfortis.com | 🟡 | Links to /qb-portal/ (relative) not subdomain |
| Blog admin authentication | ❌ | No auth on /blog/admin |
| Founder headshot | 🟡 | Placeholder image |
| LinkedIn URL | 🟡 | TODO marker |
| GA4 activation | 🟡 | Commented out with placeholder ID |
| GTM setup | ❌ | Not present |
| Contact form email routing | 🟡 | Resend conditional — needs RESEND_API_KEY |
| Legal pages | ✅ | Privacy + Terms fully written |
| Password reset email | ❌ | Token generated but no email sent |
| Delete placeholder.tsx | 🟡 | Dead code still present |
| Badge images | 🟡 | Placeholder quality |

### G. Security Foundation (Feature PRD: feature-security-auth-storage.md)

| Requirement | Status | Gap |
|---|---|---|
| Supabase Auth (email+password) | ❌ | Homegrown bcrypt+HMAC auth exists. Needs full replacement with Supabase Auth. |
| Google social login | ❌ | Not started. Needs Google OAuth credentials + Supabase provider config. |
| Microsoft social login | ❌ | Not started. Needs Azure AD app registration + Supabase provider config. |
| TOTP MFA for operator | ❌ | No MFA exists. Needs Supabase MFA enrollment + challenge screens. |
| Supabase Storage (file uploads) | ❌ | Files stored on local filesystem via multer. Needs migration to Supabase Storage with RLS. |
| File magic byte validation | ❌ | Only file extension check exists. Needs OLE2 magic byte verification. |
| Signed download URLs | ❌ | Downloads served directly from filesystem. Needs Supabase signed URLs with expiry. |
| 7-day auto-deletion | ❌ | No auto-deletion. Needs pg_cron job in Supabase. |
| Helmet security headers | ❌ | No security headers. Needs helmet middleware. |
| CORS lockdown | ❌ | CORS is open (origin: true). Needs explicit allowlist. |
| Rate limiting | ❌ | No rate limiting on any endpoint. Needs global + per-route limits. |
| Stripe webhook verification | ❌ | No signature verification. Needs constructEvent with raw body. |
| Input validation hardening | ❌ | Basic field checks only. Needs body size limits, HTML sanitization. |
| RLS policies on all tables | ❌ | No row-level security. Needs RLS on all qb_* tables. |
| UUID primary key migration | ❌ | qb_users uses serial integer PK. Needs UUID PK referencing auth.users. |

---

## Implementation Sequence

### Dependency Graph

```
Phase 0 (Foundation — MUST be first)
├── P0-1: Product catalog overhaul (DONE — Prompt 01)
├── P0-2: Email replacement (DONE — Prompt 01)
├── P0-3: QB Portal SEO foundation (DONE — Prompt 01)
└── P0-4: Catalog UI enhancements (DONE — Prompt 02, fixes in progress)

Phase 1 (Security Foundation — NEW, must be before any admin/commerce work)
├── P1-1: Supabase Auth migration + Web hardening (Prompt 03 rewrite)
└── P1-2: Supabase Storage migration (merged into Prompt 04)

Phase 2 (Admin + Commerce — requires P1-1)
├── P2-1: Admin auth + panel shell (Prompt 05 — now uses Supabase Auth)
├── P2-2: Order flow update (Prompt 04 — now includes Supabase Storage)
└── P2-3: Stripe live mode + GST/HST (Prompt XX)

Phase 3 (Subscriptions — requires P2-1)
├── P3-1: Support subscription backend
├── P3-2: Support subscription frontend
└── P3-3: Ticket system enhancement

Phase 4 (Growth Features — requires P2-2, P3-1)
├── P4-1: Promo code system
├── P4-2: Promo code admin
└── P4-3: Subscriber discount integration

Phase 5 (Content & SEO — can start after P0-3)
├── P5-1: SEO landing pages batch 1
├── P5-2: SEO landing pages batch 2
└── P5-3: Main website fixes

Phase 6 (Polish & Launch Prep)
├── P6-1: Transactional emails
├── P6-2: Admin dashboard analytics
└── P6-3: Security verification pass (Prompt 15)
```

### Prompt Sequence (for Replit Agent)

Each prompt = one PR. Scoped to be completable in a single agent session.

| # | Prompt | Phase | Deps | Scope |
|---|---|---|---|---|
| 1 | **Foundation: Catalog + Email + SEO base** ✅ DONE | P0 | None | Replace products.json with 20-product catalog. Replace all 4 hassansadiq73@gmail.com refs with support@nexfortis.com. Add react-helmet-async, create SEO component, robots.txt, sitemap.xml for qb-portal. Add basic OG tags. |
| 2 | **Catalog UI: Strikethrough pricing + promo display** ✅ DONE (fixes in progress) | P0 | #1 | Update all product cards, detail pages, order form to show original price crossed out + launch price. Update home page featured services. Update FAQ for new products. |
| 3 | **Supabase Auth Migration + Web Application Hardening** ⚠️ REWRITTEN | P1 | None | Complete replacement of homegrown bcrypt+HMAC auth with Supabase Auth. Covers: Supabase Auth setup, auth context rewrite (login/register/logout via Supabase), backend middleware replacement (requireAuth + requireOperator using Supabase JWT verification), Google social login, Microsoft social login, Helmet security headers, CORS lockdown (explicit allowlist), rate limiting (global + per-route via express-rate-limit), Stripe webhook signature verification (constructEvent), input validation hardening, operator seed via Supabase Admin API, schema migration (UUID PK on qb_users, drop password_hash column, drop qb_password_resets table), RLS policies on all qb_* tables. NOTE: MFA screens deferred to Prompt 03B. |
| 3B | **MFA Enrollment + Challenge Screens + AAL2 Enforcement** 🆕 NEW | P1 | #3 | TOTP MFA enrollment screen for operator (QR code + verify flow). MFA challenge screen shown after AAL1 login. Admin panel route guard: checks AAL2 before rendering. Backend requireOperator middleware: verifies JWT aal claim is aal2. Database RLS: sensitive admin operations require auth.current_aal() = 'aal2'. Separate prompt because Prompt 03 is already very large — MFA is frontend-only and can be parallelized after #3 lands. |
| 4 | **Order Flow Update + Supabase Storage Migration** ⚠️ UPDATED | P1/P2 | #1, #3 | Update order form for new product IDs. File upload accepts per-service types (.qbm for conversions, different for migrations). Volume pack ordering flow. Bundle handling. File upload migrated from local multer to Supabase Storage (Express API streams to Supabase server-side). Magic byte validation for QBM files (OLE2 D0 CF 11 E0 check). Signed download URLs with 1-hour expiry (Supabase Storage createSignedUrl). Upload token moved from URL params to request header. Expired file state UI in portal. 7-day auto-deletion via pg_cron job in Supabase. |
| 5 | **Admin Panel MVP: Orders + Tickets** ⚠️ UPDATED | P2 | #3, #3B | Admin order list/detail/status-update. Admin ticket list/respond. Download customer files via Supabase signed URLs. Upload processed files back to customer. All admin routes use Supabase Auth for operator verification — requireOperator checks JWT + AAL2 claim. |
| 6 | **Support subscription backend** | P3 | #5 | Stripe subscription products, plans, webhooks. Subscription DB tables. Ticket counting per cycle. SLA timer logic. Business hours calculation. |
| 7 | **Support subscription frontend** | P3 | #6 | Subscription purchase flow in catalog. Portal subscription tab (manage/upgrade/cancel). Tier badge display. Ticket submission with priority. |
| 8 | **Ticket system enhancement** | P3 | #5, #6 | Ticket reply/thread. Status updates. Admin SLA timer display. Priority routing. Email notifications on ticket events. |
| 9 | **Promo code system** | P4 | #4, #6 | Promo codes DB table. Validate/redeem API. Checkout promo code field. Stripe coupon integration. Subscriber discount at checkout. |
| 10 | **Promo code admin** | P4 | #5, #9 | Admin create/edit/deactivate codes. Code analytics. Referral code auto-generation for Premium subscribers. |
| 11 | **SEO landing pages batch 1** | P5 | #1 | 6 service-specific landing pages with content, JSON-LD, breadcrumbs, internal linking. |
| 12 | **SEO landing pages batch 2** | P5 | #11 | Problem-focused + comparison + educational pages. |
| 13 | **Main website fixes** | P5 | None | Blog admin auth. QB Portal link → qb.nexfortis.com. GA4 activation. Headshot, LinkedIn, dead code cleanup. |
| 14 | **Transactional emails** | P6 | #6 | Resend integration for: order confirmation, ticket acknowledgment, password reset (now via Supabase Auth flow), welcome, subscription events. |
| 15 | **Security verification pass** | P6 | All | Verify all Supabase Auth flows end-to-end. RLS policy audit. CORS and rate limit validation. Global error handler. Production env validation. Final audit. |

### Parallel Round Assignments

| Round | Prompts | Notes |
|---|---|---|
| Round 1 | Prompt 01 ✅ + Prompt 02 ✅ | DONE |
| Round 2 | Prompt 03 (Supabase Auth) | SOLO — too critical and large to parallelize with anything |
| Round 3 | Prompt 03B (MFA) + Prompt 04 (Order flow + Storage) | Can run in parallel: MFA is frontend-only, Prompt 04 is backend-focused |
| Round 4 | Prompt 05 (Admin MVP) + Prompt 06 (Support subscription backend) | Admin and subscription backend touch different files |
| Round 5 | Prompt 07 (Support subscription frontend) + Prompt 08 (Ticket enhancement) | Both frontend but different page areas |
| Round 6 | Prompt 09 (Promo codes) + Prompt 11 (SEO batch 1) | Completely independent |
| Round 7 | Prompt 10 (Promo admin) + Prompt 12 (SEO batch 2) + Prompt 13 (Main site fixes) | All independent |
| Round 8 | Prompt 14 (Transactional emails) + Prompt 15 (Security verification pass) | Can be done together — verification catches any remaining issues |

---

## Notes for Replit Agent Prompts

1. **Context file**: Every prompt must reference `replit.md` and relevant PRDs in `docs/prd/`
2. **Branch strategy**: Each prompt uses the Replit worktree + manual push workflow (not a standard git feature branch + PR flow). Create changes in Replit, test in the Replit preview, then push manually to the remote.
3. **No docs/ changes**: Per `replit.md` user preferences, agent should not modify `docs/` directory
4. **Testing**: Agent should verify changes work in the Replit preview
5. **Products source of truth**: After Prompt 1, `products.json` (or `catalog.ts`) becomes the single source of truth
6. **Incremental**: Each PR should be independently deployable without breaking existing functionality
7. **Prompt 03 is a TOTAL REWRITE** — the old "Admin auth foundation" prompt is entirely replaced by the Supabase Auth Migration + Web Application Hardening prompt. All auth-related code references throughout the codebase change from the homegrown bcrypt+HMAC approach to Supabase Auth.
8. **Production hosting is Render, not Replit.** Production database is Supabase PostgreSQL. Replit is the development environment only. **One Supabase project** is used for both dev and prod — no need for separate projects at this stage.
9. **Replit has separate dev/prod environment variable support.** Dev secrets (Supabase dev project keys, Stripe test keys) are set as Replit dev-only secrets. Production secrets (Supabase prod project keys, Stripe live keys) are set as Render environment variables.
10. **External Dependencies** (packages/services needed beyond current stack): Supabase Auth, Supabase Storage, `@supabase/supabase-js`, `helmet`, `express-rate-limit`. Remove: `bcrypt`, `QB_TOKEN_SECRET` env var.
11. **Auth system**: Supabase Auth (pending migration from homegrown bcrypt+HMAC auth in Prompt 03). After Prompt 03 lands, all auth flows (login, register, logout, password reset, social login, session management) are handled by Supabase — the Express API only validates JWTs, it no longer issues or manages tokens.
