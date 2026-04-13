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
| Admin/operator auth role | ❌ | No role column in qb_users, no admin middleware |
| Admin routes (frontend) | ❌ | No /admin/* routes |
| Admin routes (backend) | ❌ | No admin API endpoints |
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

---

## Implementation Sequence

### Dependency Graph

```
Phase 0 (Foundation — MUST be first)
├── P0-1: Product catalog overhaul (products.json → 20 products)
├── P0-2: Email replacement (hassansadiq73 → support@nexfortis.com)
├── P0-3: Admin auth foundation (role column, middleware, operator seed)
└── P0-4: QB Portal SEO foundation (react-helmet, robots.txt, sitemap, OG tags)

Phase 1 (Core Commerce — requires P0-1, P0-3)
├── P1-1: Catalog UI overhaul (strikethrough pricing, launch promo display)
├── P1-2: Order flow update (new products, add-ons, file types per service)
├── P1-3: Stripe live mode + GST/HST tax
└── P1-4: Admin panel MVP (order management, ticket management)

Phase 2 (Subscriptions — requires P0-3, P1-4)
├── P2-1: Support subscription backend (Stripe subscriptions, ticket counting, SLA)
├── P2-2: Support subscription frontend (purchase flow, portal integration)
└── P2-3: Ticket system enhancement (reply, status update, priority, admin view)

Phase 3 (Growth Features — requires P1-1, P2-1)
├── P3-1: Promo code system (backend + checkout integration)
├── P3-2: Promo code admin panel section
└── P3-3: Subscriber discount integration at checkout

Phase 4 (Content & SEO — can start after P0-4)
├── P4-1: SEO landing pages (service-specific)
├── P4-2: SEO landing pages (problem-focused + comparison)
└── P4-3: SEO landing pages (educational/trust)

Phase 5 (Main Website Fixes — independent)
├── P5-1: Blog admin auth
├── P5-2: QB Portal link update (→ qb.nexfortis.com)
├── P5-3: GA4 activation + cross-domain tracking
└── P5-4: Minor fixes (headshot, LinkedIn, dead code, badges)

Phase 6 (Polish & Launch Prep)
├── P6-1: Transactional emails (order confirmation, ticket ack, password reset)
├── P6-2: Admin dashboard analytics
├── P6-3: CORS lockdown, security hardening
└── P6-4: Global error handler, production logging
```

### Prompt Sequence (for Replit Agent)

Each prompt = one PR. Scoped to be completable in a single agent session.

| # | Prompt | Phase | Deps | Scope |
|---|---|---|---|---|
| 1 | **Foundation: Catalog + Email + SEO base** | P0 | None | Replace products.json with 20-product catalog. Replace all 4 hassansadiq73@gmail.com refs with support@nexfortis.com. Add react-helmet-async, create SEO component, robots.txt, sitemap.xml for qb-portal. Add basic OG tags. |
| 2 | **Catalog UI: Strikethrough pricing + promo display** | P1 | #1 | Update all product cards, detail pages, order form to show original price crossed out + launch price. Update home page featured services. Update FAQ for new products. |
| 3 | **Admin auth foundation** | P0 | None | Add `role` column to qb_users. Create operator middleware. Create admin login route. Seed operator account. Create admin layout with sidebar nav shell. |
| 4 | **Order flow update** | P1 | #1 | Update order form for new product IDs. File upload accepts per-service types (.qbm for conversions, different for migrations). Volume pack ordering flow. Bundle handling. |
| 5 | **Admin panel MVP: Orders + Tickets** | P1 | #3 | Admin order list/detail/status-update. Admin ticket list/respond. Download customer files. Upload processed files. |
| 6 | **Support subscription backend** | P2 | #3 | Stripe subscription products, plans, webhooks. Subscription DB tables. Ticket counting per cycle. SLA timer logic. Business hours calculation. |
| 7 | **Support subscription frontend** | P2 | #6 | Subscription purchase flow in catalog. Portal subscription tab (manage/upgrade/cancel). Tier badge display. Ticket submission with priority. |
| 8 | **Ticket system enhancement** | P2 | #5, #6 | Ticket reply/thread. Status updates. Admin SLA timer display. Priority routing. Email notifications on ticket events. |
| 9 | **Promo code system** | P3 | #4, #6 | Promo codes DB table. Validate/redeem API. Checkout promo code field. Stripe coupon integration. Subscriber discount at checkout. |
| 10 | **Promo code admin** | P3 | #5, #9 | Admin create/edit/deactivate codes. Code analytics. Referral code auto-generation for Premium subscribers. |
| 11 | **SEO landing pages batch 1** | P4 | #1 | 6 service-specific landing pages with content, JSON-LD, breadcrumbs, internal linking. |
| 12 | **SEO landing pages batch 2** | P4 | #11 | Problem-focused + comparison + educational pages. |
| 13 | **Main website fixes** | P5 | None | Blog admin auth. QB Portal link → qb.nexfortis.com. GA4 activation. Headshot, LinkedIn, dead code cleanup. |
| 14 | **Transactional emails** | P6 | #6 | Resend integration for: order confirmation, ticket acknowledgment, password reset, welcome, subscription events. |
| 15 | **Security + polish** | P6 | All | CORS whitelist. Global error handler. Production env validation. Final audit. |

---

## Notes for Replit Agent Prompts

1. **Context file**: Every prompt must reference `replit.md` and relevant PRDs in `docs/prd/`
2. **Branch strategy**: Each prompt creates a feature branch, PR against main
3. **No docs/ changes**: Per `replit.md` user preferences, agent should not modify `docs/` directory
4. **Testing**: Agent should verify changes work in the Replit preview
5. **Products source of truth**: After Prompt 1, `products.json` (or `catalog.ts`) becomes the single source of truth
6. **Incremental**: Each PR should be independently deployable without breaking existing functionality
