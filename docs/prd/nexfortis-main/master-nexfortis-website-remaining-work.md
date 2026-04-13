# Master PRD: NexFortis Main Website — Remaining Work

**Document type:** Master PRD (Remaining Work)  
**Artifact:** `artifacts/nexfortis` — nexfortis.com corporate website  
**Company:** 17756968 Canada Inc. (operating as NexFortis)  
**Owner/Operator:** Hassan Sadiq  
**Repository:** `github.com/TSGCFO/NexFortis-Website-Design-pro` (monorepo)  
**Status:** 95% complete — this PRD documents the 5% that remains  
**Related PRDs:**
- `docs/prd/qb-portal/feature-product-catalog-overhaul.md`
- `docs/prd/qb-portal/feature-support-subscription.md`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [User Experience & Functionality](#2-user-experience--functionality)
3. [Technical Specifications](#3-technical-specifications)
4. [Risks & Roadmap](#4-risks--roadmap)
5. [Work Breakdown: Pre-Launch vs. Post-Launch](#5-work-breakdown-pre-launch-vs-post-launch)

---

## 1. Executive Summary

### 1.1 Problem Statement

The NexFortis corporate website (`nexfortis.com`) is 95% production-ready — professional copy is in place, SEO is excellent, and all 14 routes are built. However, six specific gaps prevent launch alongside the QB Portal: the QuickBooks service page routes visitors to a dead-end `/contact` CTA instead of `qb.nexfortis.com`; the blog admin CMS is publicly accessible with no authentication; founder profile fields contain placeholder data; the contact form sends email to a personal Gmail address; legal pages and analytics infrastructure are not yet configured. These gaps collectively undermine trust, create a security vulnerability, and break the conversion funnel between the main site and the QB Portal — the primary revenue source.

### 1.2 Proposed Solution

Execute eight targeted workstreams on `artifacts/nexfortis` and the shared API server to close every pre-launch gap before `qb.nexfortis.com` goes live. The work is strictly additive — no pages need to be rebuilt. The largest scope items are: (1) updating QB service page CTAs to route to `qb.nexfortis.com`; (2) adding authentication middleware to the blog admin route on both the frontend and API server; and (3) configuring Resend for contact form emails. Remaining items (founder photo, LinkedIn, legal pages, analytics connectors) are content and configuration changes, not engineering work.

### 1.3 Success Criteria

| # | Criterion | Target | Measurement |
|---|-----------|--------|-------------|
| SC-1 | QB Portal referral conversion | ≥ 15% of `/services/quickbooks` visitors click through to `qb.nexfortis.com` within 30 days of launch | Google Analytics event tracking on CTA buttons |
| SC-2 | Blog admin security | Zero unauthorized blog post creations, edits, or deletions | Server-side auth on all `/api/blog/posts` write routes; confirmed via penetration test |
| SC-3 | Contact form deliverability | 100% of contact form submissions deliver a confirmation email to `support@nexfortis.com` and an acknowledgement to the submitter within 60 seconds | Resend delivery logs |
| SC-4 | Legal compliance | Privacy Policy and Terms of Service live on `nexfortis.com` before any Stripe transactions are processed on `qb.nexfortis.com` | Manual verification before QB Portal launch |
| SC-5 | Lighthouse scores | All pages score ≥ 90 on Performance, Accessibility, Best Practices, and SEO in a Lighthouse CI run | Lighthouse CI report in CI pipeline |
| SC-6 | Founder profile completeness | Founder headshot is a real photo and LinkedIn URL resolves to the correct company/personal page | Manual verification |

---

## 2. User Experience & Functionality

### 2.1 User Personas

#### Persona A — Prospective QB Portal Customer (Primary)

A Canadian small business owner or bookkeeper who has found `nexfortis.com` via organic search or a referral. They are evaluating NexFortis before committing to a paid QB conversion or data service. They read the QuickBooks service page to understand capabilities, then need a clear, trusted path to `qb.nexfortis.com` to place an order. Any friction — a CTA that goes nowhere, missing legal pages, or a contact form that doesn't respond — kills the conversion.

#### Persona B — General IT Services Prospect

A business evaluating NexFortis for Digital Marketing, Microsoft 365, IT Consulting, or Automation services. They visit the main site for company background and service details, and use the contact form to start a conversation. They care about brand credibility: professional headshots, real LinkedIn presence, and published legal pages signal a legitimate company.

#### Persona C — Blog Reader / SEO Traffic

A user who arrives via an organic search result on a QB-related keyword landing on a blog post. This persona doesn't have an active purchase intent but is a warm lead. They must be directed toward the QB Portal or a contact form. Blog content is the primary long-term SEO driver for QB Portal referral traffic.

#### Persona D — Operator (Hassan Sadiq)

The sole NexFortis operator managing the blog CMS, contact form submissions, and day-to-day site maintenance. Hassan needs the blog admin protected behind credentials so that only he can manage content. He also needs contact form submissions to arrive at `support@nexfortis.com`, not a personal Gmail, to keep business communications cleanly separated.

---

### 2.2 User Stories

#### Workstream W1: QB Portal Integration

**US-W1.1**
As a **QB Portal Customer (Persona A)**, I want the QuickBooks service page to prominently display a CTA that takes me directly to `qb.nexfortis.com`, so that I can begin an order without having to search for a separate URL.

**Acceptance Criteria:**
- The `/services/quickbooks` page MUST contain a primary CTA button labeled "Go to QB Services Portal" (or equivalent) that links externally to `https://qb.nexfortis.com`.
- The existing "Request a License" buttons on tool/product cards MUST be replaced or supplemented with direct QB Portal links (see FR-W1 for exact behavior by card type).
- A secondary CTA or informational callout MUST explain that the QB Portal is NexFortis's dedicated ordering platform, setting visitor expectations.
- The navigation bar (global layout) MUST include a persistent, visible reference to `qb.nexfortis.com` for visitors on QB-related pages — either as a nav item or a floating top banner when on `/services/quickbooks`.
- Clicking any QB Portal CTA MUST open `qb.nexfortis.com` in the same browser tab (not `_blank`) unless explicitly specified otherwise.
- The `/services/quickbooks` CTA buttons MUST be tracked as GA4 events: `event: "cta_click", category: "qb_portal_referral", label: "[button_location]"`.

**US-W1.2**
As a **QB Portal Customer (Persona A)**, I want the main site's branding to feel consistent with `qb.nexfortis.com`, so that I don't feel I have been redirected to an unrelated third-party site.

**Acceptance Criteria:**
- Both sites MUST display the same NexFortis logo, color tokens (Navy `#0A1628`, Azure `#0F92E3`, Rose Gold `#B76E79`), and typography (Inter body, Alegreya Sans SC display).
- Any cross-site navigation (nexfortis.com → qb.nexfortis.com) MUST not require the user to re-establish context — the QB Portal landing page must clearly acknowledge the visitor came from the main site's QuickBooks service area (handled via consistent messaging; no technical session sharing required at launch).

**US-W1.3**
As a **Blog Reader (Persona C)**, I want blog posts about QuickBooks topics to contain inline CTAs pointing to `qb.nexfortis.com`, so that search traffic converts to QB Portal visits.

**Acceptance Criteria:**
- The blog post template (`pages/blog-post.tsx`) MUST support an optional `ctaBlock` field in the blog post schema that renders a branded callout card within the article body.
- For QB-category posts, a default CTA block MUST be rendered at the end of the article body: "Need QuickBooks file work done? [Visit the QB Portal →]"
- The CTA block MUST use the existing `.section-brand-azure` visual treatment for visual consistency.

---

#### Workstream W2: Blog Admin Authentication

**US-W2.1**
As the **Operator (Hassan)**, I want the blog admin interface at `/blog/admin` to require a valid operator login before displaying, so that no unauthorized person can create, edit, or delete blog posts.

**Acceptance Criteria:**
- Navigating to `/blog/admin` without a valid session MUST redirect to a login page (either the QB Portal's login at `qb.nexfortis.com/login` via shared token, or a dedicated operator login at `nexfortis.com/admin/login`).
- An unauthenticated `POST /api/blog/posts` request MUST return HTTP 401.
- An unauthenticated `PUT /api/blog/posts/:id` request MUST return HTTP 401.
- An unauthenticated `DELETE /api/blog/posts/:id` request MUST return HTTP 401.
- `GET /api/blog/posts/all` (all posts including drafts) MUST require authentication and return HTTP 401 for unauthenticated requests. `GET /api/blog/posts` (published only) MAY remain public.
- The operator login MUST use the same HMAC-signed token mechanism already implemented in the API server for QB Portal auth (no new auth system needed).
- The operator account MUST be a special `role: "operator"` or `isOperator: true` flag on the `qb_users` table (or a separate `operator_users` table — see Technical Specifications for decision).
- After login, the admin session MUST persist for 7 days (matching the existing QB Portal token TTL) or until explicit logout.
- The `robots.txt` already disallows `/blog/admin` — this MUST be verified as part of this workstream.

**US-W2.2**
As the **Operator (Hassan)**, I want the blog admin to display a "Logged in as Hassan Sadiq" indicator and a logout button, so that I can confirm I'm authenticated and end my session when finished.

**Acceptance Criteria:**
- A small authenticated-user banner MUST appear at the top of the `/blog/admin` page showing the logged-in user's name.
- A "Log Out" button in the admin header MUST call `POST /api/qb/auth/logout` (or a shared equivalent) and redirect to the blog admin login page.

---

#### Workstream W3: Founder Profile Updates

**US-W3.1**
As a **General IT Services Prospect (Persona B)**, I want to see a real photograph of the NexFortis founder on the About page, so that I can assess the credibility and authenticity of the company leadership.

**Acceptance Criteria:**
- The `about.tsx` TODO comment `{/* TODO: Replace with actual founder headshot */}` MUST be resolved — the `about-team.png` group photo placeholder MUST be replaced with Hassan Sadiq's actual headshot.
- The image MUST be provided in both `.webp` and `.png` formats for the `<picture>` element fallback pattern already used throughout the site.
- The image dimensions MUST be appropriate for the current layout (referenced styles determine exact dimensions — minimum 400×400px, square crop preferred).
- The `alt` text MUST be "Hassan Sadiq, Founder & CEO of NexFortis".
- Image file size MUST be ≤ 150 KB for the WebP version.

**US-W3.2**
As a **General IT Services Prospect (Persona B)**, I want the LinkedIn links on the About page and in the footer to resolve to a real NexFortis page, so that I can verify company legitimacy through a trusted third-party platform.

**Acceptance Criteria:**
- Both `about.tsx` (line ~107) and `layout.tsx` (line ~341) LinkedIn TODO markers MUST be resolved with the correct URL.
- If the NexFortis LinkedIn company page is live, the URL MUST be `https://www.linkedin.com/company/nexfortis` (or the verified slug).
- If the company page is not yet live, the link MUST either be removed entirely or replaced with Hassan Sadiq's personal LinkedIn profile URL — a broken or placeholder `#` link is not acceptable.
- The `aria-label` on the LinkedIn icon link MUST read "NexFortis on LinkedIn" or "Hassan Sadiq on LinkedIn" accordingly.

**US-W3.3**
As a **General IT Services Prospect (Persona B)**, I want the About page company registration information to accurately reflect NexFortis's legal details, so that I can verify the company is a legitimate registered Canadian business.

**Acceptance Criteria:**
- Company legal name: "17756968 Canada Inc." (operating as NexFortis)
- Incorporation date: March 9, 2026
- Jurisdiction: Federal CBCA
- Business Number (BN): 797942570 RC0001
- Address: 204 Hill Farm Rd, Nobleton, ON L7B 0A1
- If any of the above fields are displayed on the About page, they MUST match these values exactly.
- These values MUST also be consistent with the Privacy Policy and Terms of Service legal pages.

---

#### Workstream W4: Contact Form & Email Updates

**US-W4.1**
As a **Prospect (Persona A or B)**, I want to receive a prompt automated acknowledgement email when I submit the contact form, so that I know my message was received and when to expect a response.

**Acceptance Criteria:**
- On successful `POST /api/contact`, the API MUST send two emails via the Resend API:
  1. **Notification to operator:** To `support@nexfortis.com`, subject "New Contact Form Submission — [submitter name]", including all form fields (name, email, phone, company, service, message).
  2. **Acknowledgement to submitter:** To the submitter's email address, subject "We received your message — NexFortis", using the template in `docs/email_templates.md` (or a new contact-specific template if one doesn't exist).
- Both emails MUST be sent within 30 seconds of form submission.
- If the Resend API call fails, the submission MUST still be accepted (HTTP 200) and logged to the server, but the failure MUST be logged as an error for operator review.
- The `from` address for all nexfortis.com transactional emails MUST be `noreply@nexfortis.com` (Resend sending domain configured for `nexfortis.com`).

**US-W4.2**
As the **Operator (Hassan)**, I want all site-visible references to `hassansadiq73@gmail.com` replaced with `support@nexfortis.com`, so that the personal email is not publicly exposed on the corporate website.

**Acceptance Criteria:**
- A full-codebase search of `artifacts/nexfortis` for `hassansadiq73@gmail.com` MUST return zero matches after this workstream is complete.
- The contact page (`/contact`) MUST display `support@nexfortis.com` as the published email address.
- The footer MUST display `support@nexfortis.com` (or a generic "Contact Us" link to `/contact`).
- Resend domain verification for `nexfortis.com` MUST be confirmed before this workstream is marked complete.

---

#### Workstream W5: Legal Pages

**US-W5.1**
As a **Prospect (Persona A)**, I want to review NexFortis's Privacy Policy before submitting a contact form or placing an order on the QB Portal, so that I understand how my data is handled.

**Acceptance Criteria:**
- The `/privacy` route in `artifacts/nexfortis` MUST have substantive, legally accurate content that satisfies:
  - **PIPEDA** (Canadian federal privacy law) — NexFortis is a federal CBCA entity
  - **Stripe's ToS** — Stripe requires a published Privacy Policy for merchants
  - **Standard disclosures:** data collected, purpose, retention, third-party processors (Stripe, Resend, Google Analytics), user rights, contact information
- The Privacy Policy MUST display:
  - Company legal name: "17756968 Canada Inc. operating as NexFortis"
  - Contact email: `support@nexfortis.com`
  - Physical address: 204 Hill Farm Rd, Nobleton, ON L7B 0A1
  - "Last updated" date
- The Privacy Policy MUST be the same document linked from `qb.nexfortis.com` — either hosted on `nexfortis.com/privacy` (canonical) or duplicated with a canonical `<link>` tag pointing to `nexfortis.com/privacy`.

**US-W5.2**
As a **Prospect (Persona A)**, I want to review NexFortis's Terms of Service before purchasing, so that I understand service guarantees, refund policies, and acceptable use.

**Acceptance Criteria:**
- The `/terms` route in `artifacts/nexfortis` MUST have substantive content including:
  - Service descriptions and delivery timelines (referencing QB Portal services)
  - Payment terms (CAD pricing, GST/HST applicability)
  - Refund and cancellation policy
  - Acceptable use of the QB Portal
  - Limitation of liability
  - Governing law: Ontario, Canada
  - Contact for disputes: `support@nexfortis.com`
- The Terms of Service MUST be linked from the QB Portal's checkout flow confirmation checkbox ("I agree to the Terms of Service").
- Both `/privacy` and `/terms` MUST be linked in the footer of both `nexfortis.com` and `qb.nexfortis.com`.

**US-W5.3** _(Conditional — only if Google Analytics is implemented)_
As a **Site Visitor**, I want to be informed about cookie usage on `nexfortis.com`, so that I can make an informed consent decision.

**Acceptance Criteria:**
- If Google Analytics (GA4) is implemented, a cookie consent banner MUST appear on first visit.
- The banner MUST offer "Accept" and "Decline" options. If declined, GA4 tracking MUST be disabled for that session and subsequent sessions.
- Consent preference MUST be stored in `localStorage` and respected on subsequent page loads.
- The cookie policy MUST be referenced in the Privacy Policy under a "Cookies and Tracking" section.

---

#### Workstream W6: Analytics & Tracking

**US-W6.1**
As the **Operator (Hassan)**, I want Google Analytics 4 installed on `nexfortis.com`, so that I can measure which pages drive traffic to the QB Portal and optimize content accordingly.

**Acceptance Criteria:**
- GA4 measurement ID (format `G-XXXXXXXXXX`) MUST be injected via Google Tag Manager (not hard-coded in source).
- GTM container snippet MUST be placed in the `<head>` (async) and `<body>` (noscript) of `index.html`.
- The following events MUST be configured in GTM:
  - `page_view` — automatic (GA4 built-in)
  - `cta_click` — custom event on all QB Portal referral buttons (from W1)
  - `contact_form_submit` — fired on successful `POST /api/contact` response
  - `outbound_click` — automatic on all `a[target="_blank"]` links to `qb.nexfortis.com`
- GA4 MUST be configured with the correct currency (`CAD`) and industry vertical (`Software`).
- `nexfortis.com` and `qb.nexfortis.com` MUST be configured as a cross-domain measurement pair in GA4 so that conversion paths that span both domains are tracked as single sessions.

**US-W6.2**
As the **Operator (Hassan)**, I want Google Search Console connected to `nexfortis.com`, so that I can monitor organic search impressions, clicks, and indexing health.

**Acceptance Criteria:**
- `nexfortis.com` MUST be verified in Google Search Console via DNS TXT record or HTML file verification.
- The `sitemap.xml` at `nexfortis.com/sitemap.xml` (already present) MUST be submitted to Search Console.
- The search console property MUST be linked to the GA4 property for unified reporting.

---

#### Workstream W7: Performance & Accessibility Polish

**US-W7.1**
As any **Site Visitor**, I want `nexfortis.com` to load quickly and be fully usable on mobile devices, so that I have a professional first impression of NexFortis.

**Acceptance Criteria:**
- Lighthouse CI scores on the production build of every page MUST be:
  - Performance: ≥ 90
  - Accessibility: ≥ 95 (site already has strong accessibility foundations)
  - Best Practices: ≥ 90
  - SEO: ≥ 95
- Largest Contentful Paint (LCP) MUST be ≤ 2.5 s on simulated 4G (Lighthouse throttling).
- Cumulative Layout Shift (CLS) MUST be ≤ 0.1.
- Cross-browser rendering MUST be verified in: Chrome (latest), Firefox (latest), Safari 16+, Edge (latest).
- All pages MUST be fully functional and visually correct at viewport widths: 320px, 375px, 768px, 1024px, 1440px.
- All interactive elements (buttons, links, form fields) MUST have visible focus indicators that meet WCAG 2.1 AA contrast requirements.

---

#### Workstream W8: Blog Content Strategy (Post-Launch)

**US-W8.1**
As the **Operator (Hassan)**, I want a documented blog content plan with 12 initial article topics, so that I can begin populating the blog immediately after launch to drive organic QB Portal traffic.

**Acceptance Criteria:**
- A `docs/content/blog-content-plan.md` file MUST exist in the monorepo with:
  - 12 article topics targeting QB-related search keywords
  - Recommended word counts (1,000–2,000 words per article)
  - Target keyword for each article
  - Suggested CTA block for each article (linking to specific QB Portal services)
- At least 3 articles from the content plan MUST be authored and seeded to the blog database before the QB Portal launch date.
- Articles MUST use real slugs (`/blog/[slug]`) that are added to `sitemap.xml` after publish.

**US-W8.2** _(Nice-to-have, post-launch)_
As a **Prospect (Persona A or B)**, I want to sign up for a NexFortis newsletter, so that I receive QB tips, product updates, and promotional announcements.

**Acceptance Criteria (post-launch only):**
- A newsletter signup form with a single email field MUST be added to the blog index page sidebar and/or the homepage footer section.
- Newsletter signups MUST be stored in the database and/or forwarded to an email marketing platform (TBD — Resend audiences is the lowest-friction option given existing Resend integration).
- A double-opt-in confirmation email MUST be sent on signup.

---

### 2.3 Non-Goals

The following are explicitly out of scope for this Master PRD:

1. **Rebuilding any existing pages** — All 14 routes are complete and no page-level redesign is planned.
2. **Shared component library extraction** — `nexfortis` and `qb-portal` each maintain their own component copies. No cross-artifact lib consolidation is in scope.
3. **A/B testing infrastructure** — Conversion rate optimization through A/B testing is a post-launch v2 item.
4. **Multi-language support (French)** — CRTC bilingualism is not required for a federal IT company selling technical services; deferred unless there is demonstrated demand.
5. **Dark mode refinements** — Dark mode is already implemented and not a gap item.
6. **New service pages** — No new service categories will be added to `nexfortis.com` before launch.
7. **CMS migration** — The current blog CMS (custom admin page + Express API + PostgreSQL) is adequate for launch. A headless CMS migration is a post-launch consideration.
8. **QB Portal admin panel** — Operator order management UI is tracked in the QB Portal PRD, not here.
9. **Cookie consent for non-analytics pages** — If analytics are not implemented before launch, the cookie banner workstream (W5.3) is deferred entirely.
10. **Automated SEO monitoring or rank tracking** — SEO dashboards and keyword rank tracking are post-launch marketing tools.

---

## 3. Technical Specifications

### 3.1 Architecture Overview

The main NexFortis site is a statically-served React SPA deployed on Replit. It communicates with the shared `artifacts/api-server` (Express 5) at runtime for three purposes: blog post reads/writes, contact form submission, and health checks. The API server is the single backend for both `nexfortis.com` and `qb.nexfortis.com`.

```
nexfortis.com (Replit static)
│
├─ /api/contact              → POST → api-server (Resend email dispatch)
├─ /api/blog/posts           → GET  → api-server (published posts)
├─ /api/blog/posts/:slug     → GET  → api-server (single post)
└─ /api/blog/posts [write]   → POST/PUT/DELETE → api-server (operator-authenticated)

qb.nexfortis.com (Replit static, separate deployment)
│
└─ /api/qb/*                 → api-server (all QB Portal endpoints)

api-server (Replit always-on)
│
├─ PostgreSQL (lib/db, Drizzle ORM)
│   ├─ blog_posts table
│   └─ qb_users, qb_orders, qb_order_files, qb_support_tickets, ...
└─ Resend API (email delivery for contact form + QB Portal transactional emails)
```

**Key constraint:** Both frontends share the same API server instance. Authentication middleware added to blog write routes must not interfere with QB Portal authentication routes, and vice versa. Both use the same HMAC-signed token format — operator authentication is distinguished by a role flag on the user record.

---

### 3.2 Integration Points

#### 3.2.1 Blog Admin Authentication (W2)

**Approach:** Add a route guard middleware (`requireOperator`) to the API server that validates the HMAC-signed token from the `Authorization: Bearer <token>` header or the `session` httpOnly cookie, then checks `user.isOperator === true`.

**DB change required:**
```sql
-- Option A: Add column to existing qb_users table
ALTER TABLE qb_users ADD COLUMN is_operator BOOLEAN NOT NULL DEFAULT FALSE;

-- Option B: Separate operator_users table (cleaner separation, recommended)
CREATE TABLE operator_users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Recommendation:** Option B (separate `operator_users` table) avoids mixing customer accounts with operator accounts and removes any risk of a customer account accidentally receiving operator permissions. Operator accounts do not need the full `qb_users` fields.

**API changes (`api-server/routes/blog.ts`):**
```typescript
// Before: no middleware
router.post('/posts', createPost);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);
router.get('/posts/all', getAllPosts);

// After: requireOperator middleware added
router.post('/posts', requireOperator, createPost);
router.put('/posts/:id', requireOperator, updatePost);
router.delete('/posts/:id', requireOperator, deletePost);
router.get('/posts/all', requireOperator, getAllPosts);
```

**New auth routes needed:**
```
POST /api/operator/auth/login    ← Operator login (returns HMAC token)
POST /api/operator/auth/logout   ← Clear operator session
GET  /api/operator/auth/me       ← Verify operator session (used by /blog/admin page)
```

**Frontend change (`pages/blog-admin.tsx`):**
Add a session check `useEffect` on mount that calls `GET /api/operator/auth/me`. If the response is 401, redirect to a new `pages/admin-login.tsx` page (route: `/admin/login`). The admin login page is a minimal form (email + password) that calls `POST /api/operator/auth/login`.

**Operator account setup:** Hassan's operator account is seeded directly in the database via a one-time setup script (`scripts/seed-operator.ts`). No self-registration flow is needed — there will only ever be one operator at launch.

---

#### 3.2.2 Resend Email Configuration (W4)

**Environment variables required:**
```env
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_DOMAIN=nexfortis.com
CONTACT_NOTIFICATION_EMAIL=support@nexfortis.com
```

**Resend domain verification steps:**
1. Add Resend's DNS records (MX, TXT, CNAME) to the `nexfortis.com` DNS zone.
2. Verify sender domain in the Resend dashboard.
3. Configure `noreply@nexfortis.com` as the sending address.

**Contact form email flow (`api-server/routes/contact.ts`):**
```typescript
// Current: logs to console if RESEND_API_KEY not set
// Required: always attempt Resend; log error on failure but still return 200

const resend = new Resend(process.env.RESEND_API_KEY);

// Email 1: operator notification
await resend.emails.send({
  from: 'noreply@nexfortis.com',
  to: 'support@nexfortis.com',
  subject: `New Contact Form Submission — ${body.name}`,
  html: operatorNotificationTemplate(body),
});

// Email 2: submitter acknowledgement
await resend.emails.send({
  from: 'noreply@nexfortis.com',
  to: body.email,
  subject: 'We received your message — NexFortis',
  html: submitterAcknowledgementTemplate(body),
});
```

**Email templates:** Add two new templates to `docs/email_templates.md`:
- `contact-operator-notification.html` — internal notification to Hassan
- `contact-submitter-acknowledgement.html` — customer-facing confirmation

---

#### 3.2.3 QB Portal CTAs (W1)

The `/services/quickbooks` page (`pages/services/quickbooks.tsx`) currently has product cards with CTAs that call `/contact`. These require surgical updates — no page restructure.

**Changes required in `quickbooks.tsx`:**
1. Hero/section CTA: Change primary button from `/contact` to `https://qb.nexfortis.com` with label "Go to QB Services Portal".
2. Product/tool cards: Each card's CTA button should link to the corresponding service on `qb.nexfortis.com/service/[slug]` if a direct mapping exists, or `https://qb.nexfortis.com/catalog` as a fallback.
3. "View All Tools" or "Request a License" buttons: Replace with "Order on QB Portal →" linking to `https://qb.nexfortis.com/catalog`.
4. Add a branded callout box before the product card grid: "All QB services are ordered through the NexFortis QB Portal — a dedicated platform for file uploads, order tracking, and support."

**Navigation change (optional but recommended):**
Add a "QB Portal" entry to the main navigation bar's Services dropdown that links externally to `https://qb.nexfortis.com`. This ensures discovery from every page, not just `/services/quickbooks`.

**No sitemap changes needed** — `nexfortis.com/services/quickbooks` already exists in `sitemap.xml`.

---

#### 3.2.4 Google Tag Manager & Analytics (W6)

**GTM setup (one-time, no code deploy after initial install):**

1. Create GTM container for `nexfortis.com` (container ID format: `GTM-XXXXXXX`).
2. Add GTM snippet to `artifacts/nexfortis/index.html`:
   ```html
   <!-- Google Tag Manager (head) -->
   <script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
   <!-- End Google Tag Manager -->

   <!-- Google Tag Manager (noscript body) -->
   <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX" height="0" width="0"></iframe></noscript>
   ```
3. Create GA4 property for `nexfortis.com`; link to Search Console property.
4. Configure GTM tags:
   - GA4 Configuration tag (fires on All Pages)
   - GA4 Event tag for `cta_click` (trigger: click on elements with `data-ga-event="cta_click"`)
   - GA4 Event tag for `contact_form_submit` (trigger: custom dataLayer push from contact form success handler)
5. Configure cross-domain measurement: add `qb.nexfortis.com` to GA4's "Configure your domains" list.

**DataLayer integration in React:**
Push events to `window.dataLayer` from relevant React components:
```typescript
// In contact form success handler
window.dataLayer?.push({
  event: 'contact_form_submit',
  service_category: formData.service,
});

// In QB Portal CTA onClick handlers
window.dataLayer?.push({
  event: 'cta_click',
  cta_location: 'quickbooks_service_page_hero',
  cta_destination: 'qb.nexfortis.com',
});
```

---

#### 3.2.5 Legal Pages (W5)

Both `/privacy` and `/terms` route files (`pages/privacy.tsx` and `pages/terms.tsx`) already exist in the codebase. The analysis confirms they are non-trivial files. This workstream is primarily **content review and accuracy verification**, not engineering.

**Required content audits:**
- Verify Privacy Policy mentions Stripe, Resend, and Google Analytics as third-party processors.
- Verify Terms of Service references QB Portal services, CAD pricing, and GST/HST applicability.
- Verify both pages display "Last updated: [date]" — update to the actual publication date.
- Verify all legal name and contact details match the canonical values in section 2.2.3 above.

**Cross-linking:**
- Both pages must be linked in the footer of `artifacts/nexfortis/src/components/layout.tsx` (verify existing links are not broken).
- Both pages must be linked in the footer of `artifacts/qb-portal/src/components/layout.tsx` (verify or add).
- The QB Portal checkout confirmation checkbox must reference the Terms of Service URL.

**Canonical meta tag:**
Both pages in `qb-portal` must include:
```html
<link rel="canonical" href="https://nexfortis.com/[privacy|terms]" />
```
This avoids duplicate content penalties if the QB Portal's legal pages have substantively identical content.

---

### 3.3 Security & Privacy

#### 3.3.1 Blog Admin Security (current gap — critical)

| Vulnerability | Current state | Required fix |
|---|---|---|
| Unauthenticated `POST /api/blog/posts` | Anyone can create posts | `requireOperator` middleware |
| Unauthenticated `PUT /api/blog/posts/:id` | Anyone can edit any post | `requireOperator` middleware |
| Unauthenticated `DELETE /api/blog/posts/:id` | Anyone can delete any post | `requireOperator` middleware |
| Unauthenticated `GET /api/blog/posts/all` | Drafts visible to public | `requireOperator` middleware |
| `/blog/admin` UI accessible without login | Any URL-knower is a de-facto admin | Frontend auth guard + redirect |

#### 3.3.2 Personal Email Exposure (current gap — medium)

`hassansadiq73@gmail.com` must not appear anywhere in `artifacts/nexfortis` source. A codebase-wide search must confirm zero matches before launch.

#### 3.3.3 Contact Form Protections

The existing contact form at `POST /api/contact` should be protected against spam/abuse:
- **Rate limiting:** Maximum 5 contact form submissions per IP per hour (add to the existing in-memory rate limiter pattern from login).
- **Input validation:** All fields already validated by the Express handler; verify no XSS payloads are passed through to Resend email HTML templates (sanitize `message` field with a HTML-escaping utility before injecting into email templates).
- **CSRF:** The contact form is a cross-origin form POST from a React SPA served on the same Replit domain as the API. SameSite cookie policy is adequate. If CORS ever separates the domains, add CSRF tokens.

#### 3.3.4 Privacy & Data Minimization

- Contact form collects: name, email, phone (optional), company (optional), service interest, message. All are necessary — no reduction needed.
- Blog posts are public — no PII is involved in blog post storage.
- Google Analytics: Configure GA4 in "Basic" mode (no User-ID, no enhanced signals) to minimize PII collection. IP anonymization is on by default in GA4.
- Resend: Email addresses submitted via the contact form are used solely for sending the acknowledgement email. They are not stored beyond the Resend logs (30-day retention). This must be disclosed in the Privacy Policy.

---

## 4. Risks & Roadmap

### 4.1 Phased Rollout

#### Phase 0 — Pre-Launch Blockers (must be complete before QB Portal goes live)

These items directly affect either revenue conversion, security, legal compliance, or brand credibility. **Nothing in this phase is optional.**

| ID | Workstream | Item | Owner | Estimated Effort |
|----|-----------|------|-------|-----------------|
| P0-1 | W1 | Update `/services/quickbooks` CTAs to link to `qb.nexfortis.com` | Dev | 2–4 hours |
| P0-2 | W2 | Add `requireOperator` middleware to all blog write API routes | Dev | 3–5 hours |
| P0-3 | W2 | Add frontend auth guard to `/blog/admin` + new `/admin/login` page | Dev | 3–5 hours |
| P0-4 | W2 | Create `operator_users` table + seed operator account script | Dev | 2–3 hours |
| P0-5 | W4 | Replace `hassansadiq73@gmail.com` with `support@nexfortis.com` in all `nexfortis` source files | Dev | 1 hour |
| P0-6 | W4 | Configure Resend sending domain for `nexfortis.com` | Ops | 1–2 hours |
| P0-7 | W4 | Implement dual-email dispatch in `POST /api/contact` | Dev | 2–3 hours |
| P0-8 | W5 | Review and finalize Privacy Policy content (PIPEDA + Stripe compliance) | Content + Legal | 3–6 hours |
| P0-9 | W5 | Review and finalize Terms of Service content | Content + Legal | 3–6 hours |
| P0-10 | W5 | Verify Privacy + ToS are linked from footer of both `nexfortis` and `qb-portal` | Dev | 30 min |

**Total estimated Phase 0 effort:** ~22–38 developer hours  
**Gate:** Phase 0 must be verified complete before the QB Portal launches with live Stripe keys.

---

#### Phase 1 — Launch Week (complete within 7 days of QB Portal launch)

| ID | Workstream | Item | Owner | Estimated Effort |
|----|-----------|------|-------|-----------------|
| P1-1 | W3 | Replace founder headshot placeholder with actual photo | Content | 1 hour |
| P1-2 | W3 | Resolve LinkedIn URL TODOs (both `about.tsx` and `layout.tsx`) | Dev | 30 min |
| P1-3 | W3 | Verify About page company registration details match legal values | Content | 30 min |
| P1-4 | W6 | Set up Google Tag Manager container + GA4 property | Ops | 2–3 hours |
| P1-5 | W6 | Install GTM snippet in `index.html` | Dev | 30 min |
| P1-6 | W6 | Configure QB Portal referral CTA events in GTM | Ops | 2 hours |
| P1-7 | W6 | Verify Google Search Console and submit sitemap | Ops | 1 hour |
| P1-8 | W6 | Configure GA4 cross-domain measurement with `qb.nexfortis.com` | Ops | 1 hour |
| P1-9 | W1 | Add "QB Portal" nav item to main navigation bar | Dev | 1 hour |
| P1-10 | W1 | Add CTA block support to blog post template for QB-category articles | Dev | 2 hours |

**Total estimated Phase 1 effort:** ~12–17 developer hours

---

#### Phase 2 — 30 Days Post-Launch (content and polish)

| ID | Workstream | Item | Owner | Estimated Effort |
|----|-----------|------|-------|-----------------|
| P2-1 | W7 | Run Lighthouse CI audit on all pages; remediate any scores below 90 | Dev | 4–8 hours |
| P2-2 | W7 | Cross-browser and cross-device QA (Chrome, Firefox, Safari, Edge; 320px–1440px) | QA | 4–6 hours |
| P2-3 | W7 | Accessibility audit (WCAG 2.1 AA) against axe-core or Lighthouse a11y | Dev | 2–4 hours |
| P2-4 | W5 | Add cookie consent banner if GA4 is live (conditional on W6) | Dev | 3–5 hours |
| P2-5 | W8 | Create `docs/content/blog-content-plan.md` with 12 QB article topics | Content | 2–3 hours |
| P2-6 | W8 | Author and publish first 3 blog articles; add slugs to sitemap | Content | 6–10 hours |

**Total estimated Phase 2 effort:** ~21–36 hours

---

#### Phase 3 — 60–90 Days Post-Launch (growth features)

| ID | Workstream | Item | Owner | Estimated Effort |
|----|-----------|------|-------|-----------------|
| P3-1 | W8 | Newsletter signup integration (Resend Audiences) | Dev | 4–6 hours |
| P3-2 | W8 | Case studies / testimonials section on homepage (after first customer reviews collected) | Dev + Content | 6–10 hours |
| P3-3 | — | Conversion tracking: QB Portal referral attribution in GA4 | Ops | 2–4 hours |
| P3-4 | — | LinkedIn company page creation (if not done earlier) | Content | 2 hours |

---

### 4.2 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Resend domain verification takes longer than expected** — DNS propagation or Resend approval delays could block contact form email delivery at launch. | Medium | High — contact form silently fails for visitors | Begin Resend domain verification at least 5 business days before QB Portal launch; test with a staging send before cutting over. The existing fallback (console log) ensures submissions are not lost — operator checks server logs until Resend is confirmed. |
| **Operator account seed script fails in production** — If the `operator_users` table migration or seed script has an error, Hassan would be locked out of the blog admin after the auth guard is deployed. | Low | High — operator cannot manage blog content | Test the full flow (migration + seed + login + admin access) in the Replit dev environment before deploying to production. Include a manual rollback step: a script to temporarily disable the auth guard via environment variable. |
| **QB Portal CTA link changes break existing search rankings** — If any current `/services/quickbooks` inbound links were indexed against specific anchor text pointing at `/contact`, changing the CTA may create inconsistency (though the URL does not change). | Low | Low — no URL changes involved, only link targets | No mitigation needed — page URLs are not changing. Only CTA button `href` attributes change. |
| **Founder headshot not available before launch** — If Hassan has no suitable professional photo, the placeholder remains. | Medium | Low — placeholder is a group team photo, not broken | Establish a deadline for photo delivery (Phase 1). If the deadline is missed, remove the headshot section entirely rather than ship a placeholder — hiding the section is preferable to looking like a template site. |
| **Google Analytics cross-domain tracking misconfiguration** — Incorrect GA4 cross-domain setup may result in sessions on `qb.nexfortis.com` appearing as direct traffic instead of referrals from `nexfortis.com`. | Medium | Medium — conversion attribution is broken but revenue is not affected | Test cross-domain measurement in GA4 DebugView before launch. The `gtag.js` `linker` parameter in the URL confirms cross-domain handoff is working. |
| **Privacy Policy content is legally insufficient** — Content not written by a lawyer may miss PIPEDA-specific requirements (e.g., accountability designation, access/correction rights). | Medium | High — regulatory risk and Stripe ToS non-compliance | Use a reputable Privacy Policy generator as a base (e.g., TermsFeed PIPEDA template) and customize with NexFortis-specific details. Flag for review by a Canadian tech/privacy lawyer before significant revenue is processed. |
| **In-memory blog API rate limiter** — Like the login rate limiter, the contact form rate limiter (if added) will reset on server restart. | Low | Low — Replit always-on restarts are infrequent | Accept at launch; move to database-backed rate limiting in a v1.1 hardening pass if abuse is observed. |

---

## 5. Work Breakdown: Pre-Launch vs. Post-Launch

### Summary Table

| Priority | ID | Item | Phase | Hours (est.) |
|----------|---|------|-------|-------------|
| 🔴 Critical | P0-1 | QB Portal CTAs on `/services/quickbooks` | Pre-Launch | 2–4 |
| 🔴 Critical | P0-2 | Blog admin API auth (backend) | Pre-Launch | 3–5 |
| 🔴 Critical | P0-3 | Blog admin frontend auth guard | Pre-Launch | 3–5 |
| 🔴 Critical | P0-4 | `operator_users` table + seed script | Pre-Launch | 2–3 |
| 🔴 Critical | P0-5 | Remove personal Gmail from all nexfortis source | Pre-Launch | 1 |
| 🔴 Critical | P0-6 | Resend domain verification for nexfortis.com | Pre-Launch | 1–2 |
| 🔴 Critical | P0-7 | Contact form dual-email dispatch (Resend) | Pre-Launch | 2–3 |
| 🔴 Critical | P0-8 | Privacy Policy content (PIPEDA + Stripe) | Pre-Launch | 3–6 |
| 🔴 Critical | P0-9 | Terms of Service content | Pre-Launch | 3–6 |
| 🔴 Critical | P0-10 | Legal pages linked from both site footers | Pre-Launch | 0.5 |
| 🟡 High | P1-1 | Real founder headshot | Launch Week | 1 |
| 🟡 High | P1-2 | LinkedIn URL resolution | Launch Week | 0.5 |
| 🟡 High | P1-3 | About page registration details audit | Launch Week | 0.5 |
| 🟡 High | P1-4 | GTM container + GA4 property setup | Launch Week | 2–3 |
| 🟡 High | P1-5 | GTM snippet in index.html | Launch Week | 0.5 |
| 🟡 High | P1-6 | QB Portal referral event tags in GTM | Launch Week | 2 |
| 🟡 High | P1-7 | Google Search Console verification + sitemap | Launch Week | 1 |
| 🟡 High | P1-8 | GA4 cross-domain config | Launch Week | 1 |
| 🟡 High | P1-9 | "QB Portal" nav item | Launch Week | 1 |
| 🟡 High | P1-10 | Blog post CTA block for QB categories | Launch Week | 2 |
| 🟢 Medium | P2-1 | Lighthouse CI remediation | 30 days post | 4–8 |
| 🟢 Medium | P2-2 | Cross-browser/device QA | 30 days post | 4–6 |
| 🟢 Medium | P2-3 | WCAG 2.1 AA accessibility audit | 30 days post | 2–4 |
| 🟢 Medium | P2-4 | Cookie consent banner (if GA4 live) | 30 days post | 3–5 |
| 🟢 Medium | P2-5 | Blog content plan document | 30 days post | 2–3 |
| 🟢 Medium | P2-6 | Author + publish 3 initial blog articles | 30 days post | 6–10 |
| 🔵 Low | P3-1 | Newsletter signup (Resend Audiences) | 60–90 days | 4–6 |
| 🔵 Low | P3-2 | Testimonials section | 60–90 days | 6–10 |
| 🔵 Low | P3-3 | QB Portal referral attribution in GA4 | 60–90 days | 2–4 |
| 🔵 Low | P3-4 | LinkedIn company page creation | 60–90 days | 2 |

**Total pre-launch required:** ~22–38 hours  
**Total launch week:** ~12–17 hours  
**Total 30-day post-launch:** ~21–36 hours  
**Total 60–90 day horizon:** ~14–22 hours

---

*Last updated: 2026 — 17756968 Canada Inc. (NexFortis). For questions, contact support@nexfortis.com.*
