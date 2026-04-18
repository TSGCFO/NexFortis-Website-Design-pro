# NexFortis Marketing Site — Product Requirements Document

**Document type:** Product Requirements Document (Marketing Site)
**Artifact:** `artifacts/nexfortis` — `nexfortis.com`
**Company:** NexFortis IT Solutions (17756968 Canada Inc.)
**Owner / Operator:** Hassan Sadiq, Founder & Principal IT Consultant
**Headquarters:** 204 Hill Farm Rd, Nobleton, ON L7B 0A1, Canada
**Status:** DRAFT v1 — pending owner review and sign-off
**Related PRDs:**
- `docs/prd/nexfortis-main/master-nexfortis-website-remaining-work.md` (gap-closure PRD for the existing 95%-complete site)
- `docs/prd/qb-portal/master-qb-portal-production-launch.md` (sister product launch)

---

## 0. How to Use This Document

This PRD is the **source of truth** for the NexFortis marketing site. It defines goals, audience, information architecture, content requirements, SEO strategy, and design direction. It deliberately does **not** include final page copy or visual mockups — those are produced in the downstream build task using this document as the brief.

If a question arises during build that this document does not answer, that is a defect in this PRD. Update the PRD first, then implement.

---

## 1. Executive Summary

### 1.1 Purpose
`nexfortis.com` is the corporate marketing site for NexFortis IT Solutions, a Canadian managed-IT and digital-services firm headquartered in Nobleton, Ontario. The site has three jobs:

1. **Establish credibility** for a sole-operator-led firm competing with multi-person MSPs by communicating credentialed expertise (Microsoft Authorized Partner, Google Partner, QuickBooks ProAdvisor) and a Canadian privacy-first posture.
2. **Generate qualified leads** for five service lines via free-quote and consultation CTAs that funnel into a contact form delivering to `support@nexfortis.com`.
3. **Drive QB Portal conversions** by routing QuickBooks-related traffic to the dedicated `qb.nexfortis.com` ordering platform — the company's primary revenue product.

### 1.2 Strategic Position
NexFortis sells a single value proposition: **"End-to-end IT under one roof for Canadian SMBs."** The differentiator is bundling marketing, cloud productivity, accounting tooling, advisory, and automation under a single accountable partner — eliminating the vendor-juggling pain SMB owners experience when stitching together a five-vendor IT stack.

### 1.3 Tagline & Voice
- **Primary tagline:** *Complexity Decoded. Advantage.*
- **Secondary line:** *Your Business. Our Technology. Limitless Growth.*
- **Voice:** confident, plain-language, Canadian-professional. Avoid hype, jargon, and "synergy" speak. Speak to business outcomes (revenue, hours saved, downtime avoided), not features.

### 1.4 Success Metrics (Launch + 90 Days)
| # | Metric | Target | Source |
|---|--------|--------|--------|
| M1 | Organic sessions / month | ≥ 1,500 | GA4 |
| M2 | Contact-form qualified leads / month | ≥ 12 | GA4 + CRM intake |
| M3 | QB Portal click-through rate from `/services/quickbooks` | ≥ 15 % | GA4 outbound event |
| M4 | Contact-form abandonment rate | ≤ 35 % | GA4 form events |
| M5 | Lighthouse Performance / Accessibility / SEO | ≥ 90 each, all pages | Lighthouse CI |
| M6 | Core Web Vitals (LCP / CLS / INP) | "Good" on 75 % of mobile sessions | CrUX / GA4 |
| M7 | Average page load (desktop, fast-3G mobile) | ≤ 2.5 s desktop, ≤ 4 s mobile | Lighthouse |

---

## 2. Audience & Personas

### 2.1 Primary Persona — "Owner-Operator Olivia"
- **Who:** Owner or operations lead of a 5–50-employee Canadian SMB (clinic, law firm, retail chain, manufacturing shop, accounting practice).
- **Tech literacy:** Comfortable with email and SaaS, but not technical. Cannot read a network diagram; can read a quote.
- **Pain:** Has 3–5 IT vendors (web host, email provider, bookkeeper's IT person, automation freelancer) who don't talk to each other. Tired of being the integrator.
- **Trigger to visit:** Searching "Microsoft 365 setup Toronto," "QuickBooks migration Canada," or referred by a peer.
- **What she needs from the site:** Proof the firm is real (address, photo of founder, certifications), proof of relevant experience (industry section, case studies), and a frictionless way to get a quote without a sales call.
- **Conversion path:** Home or service page → "Get a Free Quote" → contact form → email reply within 24 h.

### 2.2 Secondary Persona — "QuickBooks Quentin"
- **Who:** Bookkeeper, accountant, or small-business owner with a stuck QB Desktop file, a migration need, or a multi-platform accounting headache.
- **Tech literacy:** Knows accounting software well; less confident with file formats and migrations.
- **Trigger:** Search for "QuickBooks file repair," "convert Sage to QuickBooks," "QBM file recovery."
- **What he needs:** A trusted, certified QuickBooks specialist with clear pricing, fast turnaround, and a money-back guarantee.
- **Conversion path:** Search → `/services/quickbooks` page → "Go to QB Services Portal" CTA → `qb.nexfortis.com` order flow.

### 2.3 Tertiary Persona — "Strategic Steve"
- **Who:** GM, COO, or CFO of a 50–200-seat business that has outgrown ad-hoc IT and is shopping for a vCIO or fractional IT leadership.
- **Tech literacy:** Strategic, not hands-on.
- **Trigger:** Board pressure on cybersecurity / compliance, M&A integration, or licensing-cost review.
- **What he needs:** Evidence of advisory chops (process, methodology, audit deliverables), credentials, references.
- **Conversion path:** `/services/it-consulting` → "Book a Consultation" → calendar/contact form.

### 2.4 Anti-personas (Explicitly Not Targeting)
- Consumers / household IT support.
- Enterprise (1,000+ seat) procurement teams expecting RFP/SOC 2 paperwork.
- Pure-play developers shopping for staff augmentation.

---

## 3. Positioning & Value Proposition

### 3.1 Positioning Statement
> For Canadian small and mid-sized businesses that are tired of stitching together five different IT vendors, **NexFortis** is the **single accountable technology partner** that bundles marketing, cloud productivity, accounting tooling, IT advisory, and workflow automation under one roof — backed by Microsoft, Google, and Intuit certifications, and a Canadian privacy-first posture.

### 3.2 Core Value Pillars (used across home, services, footer)
1. **One Partner, Five Disciplines** — no vendor juggling.
2. **Credentialed Expertise** — Microsoft AI Cloud Partner, Google Partner, QuickBooks ProAdvisor.
3. **Canadian-First Privacy** — PIPEDA-aligned data handling, optional Canadian data residency.
4. **SMB-Sized & SMB-Priced** — solutions sized for 5- to 200-seat businesses, with transparent flat-rate pricing where possible.
5. **Outcome-Oriented** — every engagement starts with the business KPI, not a tool.

### 3.3 Competitive Differentiation
| Competitor archetype | Their weakness | NexFortis answer |
|---|---|---|
| Big-box MSP (50+ staff) | Generic, expensive, slow | Direct founder access, faster decisions |
| Solo IT freelancer | One discipline only, no cover | Full team coverage across 5 disciplines |
| Offshore web/dev shop | Time-zone, no local privacy story | Canadian-based, PIPEDA-aware |
| QuickBooks-only ProAdvisor | Can't help with the IT around it | QB **plus** M365, security, automation |

---

## 4. Brand Voice & Tone

### 4.1 Voice Pillars
- **Confident, not boastful.** State capabilities; let credentials carry the weight.
- **Plain-language.** Replace jargon with outcomes. ("Reduce manual data entry by 90 %" beats "Hyper-automate cross-system workflows.")
- **Canadian-professional.** No Americanisms in spelling (organisation, optimisation, colour). Use Canadian English (en-CA).
- **Calm.** No exclamation marks in body copy. No countdown timers. No artificial scarcity.

### 4.2 Tone by Surface
| Surface | Tone |
|---|---|
| Hero & home headlines | Bold, declarative, outcome-led |
| Service body copy | Consultative, proof-heavy, scannable |
| Blog | Educational, opinionated where useful, never preachy |
| Forms & CTAs | Direct, low-friction, reassuring (e.g. "We reply within 24 h — no sales call required") |
| Legal pages | Plain-language summary on top, full legalese below |
| Error / empty states | Friendly, action-oriented |

### 4.3 Words to Use / Avoid
- **Use:** partner, outcome, certified, transparent, Canadian, end-to-end, plain-language, accountable.
- **Avoid:** synergy, leverage (as a verb), best-in-class, world-class, disruptive, cutting-edge, ninja, rockstar.

---

## 5. Service Offering (Final List)

The site sells **five service lines**, each with a dedicated `/services/<slug>` page. The current artifact already has placeholder routes for these — this PRD confirms them as final.

| # | Service line | Slug | Primary CTA | Pricing posture |
|---|---|---|---|---|
| S1 | Digital Marketing & Web Presence | `digital-marketing` | Get a Free Quote | Project-based + monthly retainer |
| S2 | Microsoft 365 Solutions | `microsoft-365` | Get a Free Quote | Per-seat + one-time migration |
| S3 | QuickBooks Migration & Tools | `quickbooks` | **Go to QB Services Portal** (`qb.nexfortis.com`) | Productized — see QB Portal catalog |
| S4 | IT Consulting & Strategy (vCIO) | `it-consulting` | Book a Consultation | Hourly + monthly vCIO retainer |
| S5 | Workflow Automation & Custom Software | `automation-software` | Get a Free Quote | Project-based, fixed-scope |

**Pricing posture rule:** No specific dollar prices on the marketing site **except** where the QB Portal already publishes them. All other lines say "transparent flat-rate proposal after a free 30-minute discovery call." This protects margin and avoids stale prices.

**QB Portal special handling:** `/services/quickbooks` is the **only** service page whose primary CTA leaves the marketing site. It must route to `qb.nexfortis.com` rather than the contact form. See §10.

---

## 6. Information Architecture

### 6.1 Sitemap
```
/                           Home
/services                   Services overview
  /services/digital-marketing
  /services/microsoft-365
  /services/quickbooks      ← cross-links to qb.nexfortis.com
  /services/it-consulting
  /services/automation-software
/about                      About / leadership / certifications
/blog                       Blog index
  /blog/[slug]              Blog post
/contact                    Contact form + office details
/privacy                    Privacy policy (PIPEDA-aware)
/terms                      Terms of service
/admin/login                Operator login (blog CMS) — noindex
/admin/blog                 Blog admin (noindex, requireBlogAdmin)
```

### 6.2 Global Navigation (header)
Order, left to right: **Home · Services ▾ · About · Blog · Contact · QB Portal ↗** · *(right-aligned)* Theme toggle · **Get a Free Quote** (rose-gold button).

- "Services" is a hover/click dropdown listing the five service slugs plus "View All Services."
- "QB Portal" opens `qb.nexfortis.com` in the same tab (per §10) and is visually distinguished with an external-link icon.
- The "Get a Free Quote" button is always visible on desktop and collapses into the mobile menu under 768 px.

### 6.3 Global Footer
Four columns:
1. Logo + tagline + brief positioning sentence.
2. Services (links to all five service pages).
3. Company (About, Blog, Contact, Privacy, Terms).
4. Contact (HQ address, `contact@nexfortis.com`, LinkedIn).

Below: certification badge row (Microsoft, Google, QuickBooks), copyright with legal entity name, secondary privacy/terms links.

### 6.4 Cross-page Components
- **Floating "Get a Free Quote" CTA** on all `/services/*` pages.
- **Back-to-top button** appears after 400 px scroll.
- **Skip-to-main-content** link for keyboard users (already implemented).

---

## 7. Page-by-Page Content Requirements

For each page below, this PRD defines **what** the page must contain. Final word-for-word copy is produced in the build task using this brief.

### 7.1 Home (`/`)
**Goal:** Convert first-time visitors into either a quote request or a QB Portal click within ≤ 30 seconds of scroll.

**Required sections (in order):**
1. **Hero** — tagline, sub-tagline, two CTAs ("Get a Free Quote" primary, "Explore Our Services" secondary), animated brand canvas backdrop, logo treatment.
2. **Stats strip** — 4 trust numbers (businesses served, years experience, response SLA, Canadian-based).
3. **Certified-partner bar** — Microsoft, Google, QuickBooks badges with "Certified Technology Partner" label.
4. **Services showcase** — alternating left/right rows for each of the 5 services with badge, title, 1-paragraph description, 3 bullet benefits, CTA.
5. **Why us** — 4 reasons in a 2-column layout next to a team photo.
6. **Process** — 4 numbered steps (Discovery → Plan → Implement → Optimize).
7. **Industries served** — 6 industry icons + 1-line descriptions.
8. **FAQ** — 6 accordion items targeting top organic-search questions.
9. **Final CTA band** — single-line headline + "Get a Free Quote" button on navy background.

**SEO:** Title "NexFortis IT Solutions — Managed IT, Microsoft 365, QuickBooks Canada"; meta description focuses on end-to-end IT for Canadian SMBs and free consultation. Schema: Organization, LocalBusiness, WebSite, FAQ.

### 7.2 Services Overview (`/services`)
**Goal:** Help undecided visitors find the right service line.

**Required sections:**
1. Page hero with title and subtitle.
2. Five service blocks (alternating layout) with description, 4 benefit bullets, per-service CTA.
3. Closing CTA: "Not sure where to start? Book a free 30-minute consultation."

### 7.3 Service Detail Pages (`/services/<slug>`) — common structure
Each service page must follow the **same skeleton** so visitors learn the pattern once:

1. **Hero** — service name, 1-sentence value prop, primary CTA.
2. **What we do** — 2–3 paragraph plain-language overview.
3. **Capabilities** — grid of 6–9 specific deliverables with short descriptions.
4. **Process** — 3–5 step engagement model specific to the service.
5. **Outcomes / proof** — 3 quantified outcome bullets or a short case-study card.
6. **Pricing posture** — transparent statement: "Flat-rate proposal after a free 30-minute discovery call." (Exception: QB page links to QB Portal pricing.)
7. **FAQ** — 4–6 service-specific questions.
8. **Closing CTA band** — service-appropriate CTA.

**Per-service content notes:**
- **Digital Marketing:** highlight web design, on-page/technical SEO, Google Ads, content, hosting uptime, monthly reporting.
- **Microsoft 365:** highlight Microsoft Authorized Partner badge, zero-downtime migration, Intune MDM, Teams/SharePoint, MFA + Conditional Access.
- **QuickBooks:** highlight 100 % accuracy guarantee, ProAdvisor team, source platforms (Sage, SAP, Xero, NetSuite, FreshBooks), file-corruption repair, custom add-ons. **Primary CTA = "Go to QB Services Portal" → `https://qb.nexfortis.com`** (same tab). Add a secondary informational callout: "QB Portal is our dedicated ordering and account-management platform."
- **IT Consulting:** highlight vCIO retainers, IT audits, license-cost optimization, cybersecurity posture assessments, project management. CTA = "Book a Consultation."
- **Workflow Automation:** highlight Power Automate, Zapier, custom APIs, bespoke web apps, dashboards, data-entry reduction.

### 7.4 About (`/about`)
**Required sections:**
1. Hero with team photo background.
2. **Our Story** — 4–6 paragraphs covering founding rationale, geographic base (Nobleton, ON), industries served, certifications.
3. **Mission** and **Vision** statements (existing wording is approved).
4. **Core Values** — 4 values (Integrity, Innovation, Client-First, Simplicity) with descriptions.
5. **Leadership card** — Hassan Sadiq founder card with **real headshot** (not a stock or team photo) and bio. *Asset gap — flag for build task.*
6. **Partnerships & Certifications** — 3 badge cards (Microsoft, Google, QuickBooks) with one-paragraph each.
7. Closing CTA: "Let's Work Together → Contact Us."

### 7.5 Blog Index (`/blog`)
**Required behaviour:**
- Featured post (most recent) rendered large at top with category chip and "Featured" badge.
- Remaining posts in a 3-column responsive grid card layout.
- Per-card: cover image, category chip, date, read-time, title, excerpt, "Read Article →" link.
- Posts come from API (`/api/blog/posts`); page renders 5 fallback posts when API unavailable.
- Categories: Microsoft 365, IT Consulting, Automation, QuickBooks, Digital Marketing, Cybersecurity (each color-coded).
- **Initial seed:** 5 posts already drafted in the existing fallback array — keep as launch content baseline.

### 7.6 Blog Post (`/blog/[slug]`)
**Required:**
- Cover image with category chip overlay.
- Title, author (default Hassan Sadiq), publish date, read-time, social share row.
- Article body rendered from CMS-stored Markdown / sanitized HTML.
- **Inline CTA block** at end of body. For QuickBooks-category posts, default CTA = "Need QuickBooks file work done? Visit the QB Portal →" linking to `qb.nexfortis.com`. Other categories default to "Get a Free Quote → /contact." Editable per-post.
- "Related posts" — 3 cards from the same category.

### 7.7 Contact (`/contact`)
**Required:**
- Page hero, breadcrumbs.
- **Left column (2/5):** "Get In Touch" intro, HQ address card, email card (`contact@nexfortis.com`), business hours (Mon–Fri 9:00 AM – 5:00 PM EST), LinkedIn link.
- **Right column (3/5):** form with fields **Name\*, Email\*, Phone\*, Company (optional), Service Interested In\* (dropdown of 5 services + Other), Message\***. Submit posts to `/api/contact` which sends via Resend to `support@nexfortis.com` and acknowledges the submitter.
- On success: green toast "Message Sent Successfully — we'll reply within 1–2 business hours." Reset form.
- On failure: destructive toast with error.
- **Anti-spam:** rate-limit at API server (existing). Honeypot field optional.
- **Privacy notice** under submit button: "By submitting, you agree to our Privacy Policy. We never share your information."

### 7.8 Privacy Policy (`/privacy`)
**Required structure:**
1. Plain-language summary (≤ 200 words) at top.
2. Full policy covering: who we are, what data we collect (form submissions, analytics cookies, blog comments if any), purpose, third-party processors (Resend, Google Analytics, Stripe via QB Portal, Supabase via QB Portal), retention, user rights under PIPEDA (access, correction, withdrawal, complaint to OPC), data residency note (Canada-first), contact for privacy inquiries.
3. Cookie policy section listing analytics + functional cookies.
4. Effective date and last-updated date.

### 7.9 Terms of Service (`/terms`)
**Required structure:**
- Plain-language summary at top.
- Acceptable use, intellectual property, disclaimers, limitation of liability, governing law (Ontario, Canada), changes to terms, contact.
- Effective and last-updated dates.

### 7.10 Operator/Admin Pages (`/admin/*`)
- `noindex, nofollow` meta robots.
- Existing operator login + blog admin flow per master "remaining work" PRD. Out of scope for this PRD beyond confirming they exist and are protected.

---

## 8. Design Direction

### 8.1 Color Palette (existing, locked)
| Token | Hex | Usage |
|---|---|---|
| Navy | `#0A1628` | Primary surfaces, dark sections, footer |
| Azure (accent) | `#0F92E3` | Links, badges, accents, focus rings |
| Rose Gold | `#B76E79` | Primary CTAs (high-contrast on navy + light) |
| Background light | `#F7F8FA` | Brand-light section background |
| Foreground | `#0F1115` | Body text on light surfaces |
| Muted foreground | `#5A5C63` | Secondary text |

Both light and dark themes are supported. Dark theme should mirror the navy section treatments site-wide.

### 8.2 Typography
- **Display (headings, navigation, badges):** Alegreya Sans SC (small caps).
- **Body, UI, forms:** Inter.
- Fonts are **self-hosted** (already in `public/fonts`) for performance and privacy (no Google Fonts CDN call).

### 8.3 Imagery Style
- Real photography preferred over illustration where possible (founder headshot, team, office).
- Iconography from **Lucide React** (already in use).
- Service "tile" decorative blocks use a single oversized accent icon on a soft gradient — keep current treatment.
- Decorative shapes/blobs: blurred radial gradients in azure or rose-gold at low opacity.

### 8.4 Motion
- Framer Motion for entrance animations (fade + 20–30 px translate, 300–400 ms, `easeOut`).
- All animations **must respect `prefers-reduced-motion`** (already implemented).
- Hero canvas: 3D / particle effect, lazy-loaded, with a gradient fallback if WebGL unavailable.

### 8.5 Layout Conventions
- Max content width: `max-w-7xl` (1280 px) centered with responsive horizontal padding.
- Vertical section rhythm: `py-20` (mobile) → `py-28` (desktop) on hero/section blocks.
- Card radius: `rounded-3xl` for hero/feature cards; `rounded-xl` for buttons and inputs.
- Min tap target: 44×44 px (already enforced).

### 8.6 Brand Consistency with QB Portal
The QB Portal (`qb.nexfortis.com`) shares the same logo, palette, and typography. Cross-site navigation must feel like one continuous product. When a visitor leaves `/services/quickbooks` for the QB Portal, they should perceive zero visual rupture.

---

## 9. SEO Strategy

### 9.1 Keyword Targets (per page)
| Page | Primary keyword | Secondary keywords |
|---|---|---|
| `/` | managed IT services Canada | IT solutions Toronto, Canadian IT consultant |
| `/services/digital-marketing` | digital marketing agency Canada | SEO services Toronto, Google Ads management Canada |
| `/services/microsoft-365` | Microsoft 365 migration Canada | M365 setup small business, Microsoft Authorized Partner Toronto |
| `/services/quickbooks` | QuickBooks migration Canada | QuickBooks file repair, Sage to QuickBooks conversion, QBM file recovery |
| `/services/it-consulting` | virtual CIO Canada | IT consulting Toronto, IT audit services |
| `/services/automation-software` | workflow automation Canada | Power Automate consulting, custom business software |
| `/about` | NexFortis IT Solutions | Hassan Sadiq IT consultant Nobleton |
| `/blog` | (long-tail by post) | (per post) |
| `/contact` | NexFortis contact | IT consultation Ontario |

### 9.2 Meta Pattern
- **Title format:** `<Page-specific phrase> | NexFortis IT Solutions` (≤ 60 chars).
- **Description:** 140–160 chars, action-oriented, contains primary keyword + Canadian qualifier + a CTA verb.
- **Canonical URL:** absolute `https://nexfortis.com/<path>`, no trailing slash except root.
- **OpenGraph + Twitter cards:** `og:image` is a 1200×630 branded card per page (auto-generated or static).

### 9.3 Structured Data (JSON-LD)
- **Site-wide:** `Organization`, `LocalBusiness` (with HQ address, geo, hours), `WebSite` (with `SearchAction`).
- **Home + relevant pages:** `FAQPage`.
- **Service pages:** `Service` with `provider` linked to Organization, `areaServed: Canada`.
- **Blog index:** `Blog`.
- **Blog post:** `Article` with author, datePublished, dateModified, image, mainEntityOfPage.
- **All deep pages:** `BreadcrumbList`.

### 9.4 Technical SEO
- `sitemap.xml` (already in `public/`) listing all public routes.
- `robots.txt` allowing all except `/admin/*` and `/blog/admin`.
- Hreflang: `en-CA` only at launch.
- Image alt text on every non-decorative `<img>`; `aria-hidden="true"` on decorative icons.
- HTTPS-only; HSTS handled by hosting layer.
- 200 / 301 / 404 handled correctly; custom 404 page with helpful navigation.
- Page weight budget: ≤ 250 KB JS gzipped per route, ≤ 1 MB total per page.

### 9.5 Content Strategy (Blog)
- Cadence: 1 post per 2 weeks at launch, monthly thereafter once 12 evergreen posts exist.
- Pillars: QuickBooks how-tos (drives QB Portal), Microsoft 365 guides, Canadian compliance (PIPEDA), automation case studies, IT cost-saving advice.
- Every QB-category post must include the QB Portal CTA block per §7.6.

---

## 10. QB Portal Integration

The marketing site and QB Portal are sister products that share branding but live on separate hosts. The marketing site is the **top-of-funnel**; the QB Portal is the **purchase + account-management** surface.

### 10.1 Required cross-links from marketing site → QB Portal
| Surface | Link target | Behaviour |
|---|---|---|
| Header navigation "QB Portal" item | `https://qb.nexfortis.com` | Same tab; external-link icon |
| Mobile menu "QB Portal" item | `https://qb.nexfortis.com` | Same tab |
| `/services/quickbooks` primary CTA | `https://qb.nexfortis.com` | Same tab |
| `/services/quickbooks` secondary callout | `https://qb.nexfortis.com/products` | Same tab |
| QB-category blog post inline CTA | `https://qb.nexfortis.com` | Same tab |
| Footer (optional) | — | Not required — keep footer focused on company links |

### 10.2 Tracking
Every QB Portal outbound click fires a GA4 event:
```
event: "qb_portal_referral"
params: { source_page: <pathname>, link_location: <header|hero|cta|inline_cta> }
```

### 10.3 Visual continuity
Logo, color tokens, typography must be identical across both sites (see §8.1, §8.2). The QB Portal landing page is responsible for acknowledging the visitor's context — no technical session sharing is required at launch.

---

## 11. Lead Capture & Conversion Strategy

### 11.1 Primary conversion = contact-form submission
- Form on `/contact` and inline forms on service pages (or anchor links to `/contact`).
- Server: `POST /api/contact` validates with Zod, sends via Resend to `support@nexfortis.com` (verified domain — see related task), and sends an auto-acknowledgement to the submitter.
- SLA promised on the page: reply within 1–2 business hours during 9–5 EST, otherwise next business morning.

### 11.2 Secondary conversion = QB Portal click
For QuickBooks traffic only (see §10).

### 11.3 Tertiary conversion = newsletter / blog subscribe (POST-LAUNCH)
Out of scope at launch. Reserved as a post-launch growth lever.

### 11.4 CTA hierarchy (rules)
- **One primary CTA per viewport.** Rose-gold pill button.
- **Secondary CTA** is ghost / outline. Never two rose-gold buttons stacked.
- **Floating CTA** appears only on `/services/*` (already implemented).
- Every CTA has a verb-led label ("Get a Free Quote," "Book a Consultation," "Go to QB Services Portal"). Never "Click here" or "Learn more" alone.

---

## 12. Analytics & Tracking

### 12.1 Tools
- **GA4** as the system of record. Property tied to `nexfortis.com`.
- **Microsoft Clarity** (optional) for session replay and heatmaps in the first 90 days.
- No other trackers at launch (no Facebook Pixel, no LinkedIn Insight Tag) unless and until a paid-ads campaign runs.

### 12.2 Events to instrument
| Event name | Trigger | Params |
|---|---|---|
| `page_view` | Auto (GA4 default) | path, title |
| `cta_click` | Any button labeled as a primary CTA | label, location, page |
| `qb_portal_referral` | Any outbound to qb.nexfortis.com | source_page, link_location |
| `contact_form_start` | First focus on a form field | page |
| `contact_form_submit` | 200 from `/api/contact` | service_selected |
| `contact_form_error` | Non-2xx from `/api/contact` | error_code |
| `blog_post_read` | Scroll-depth ≥ 75 % on `/blog/[slug]` | slug, category |
| `external_link_click` | Any outbound with `target=_blank` | href, page |

### 12.3 Consent
- Cookie banner with reject-all and accept-all controls (PIPEDA-aligned). Analytics cookies do not load until consent is granted.
- Banner copy and behaviour are defined in the Privacy Policy.

---

## 13. Accessibility Commitments

- **WCAG 2.1 AA** as the minimum bar.
- All interactive elements keyboard-navigable in a logical tab order; visible focus rings (existing accent ring).
- Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI components.
- Form fields have associated `<label>`, `aria-required`, `aria-invalid`, and inline error text linked via `aria-describedby` (already implemented).
- Iconography is `aria-hidden="true"` when purely decorative; meaningful icons get an accessible name.
- All animations respect `prefers-reduced-motion`.
- Skip-to-main-content link present (already implemented).
- Lighthouse Accessibility score ≥ 95 per page.

---

## 14. Performance Targets

| Metric | Target (mobile, fast-3G simulated) | Target (desktop) |
|---|---|---|
| LCP | ≤ 2.5 s | ≤ 1.5 s |
| CLS | ≤ 0.10 | ≤ 0.10 |
| INP | ≤ 200 ms | ≤ 150 ms |
| TBT | ≤ 200 ms | ≤ 100 ms |
| First-load JS per route (gzipped) | ≤ 250 KB | ≤ 250 KB |

**Implementation rules:**
- Code-split per route (already in place).
- Lazy-load the hero canvas with a `Suspense` fallback (already in place).
- All images: `loading="lazy"` (except above-the-fold), explicit `width`/`height` to prevent CLS, WebP with PNG fallback via `<picture>`.
- Self-hosted fonts with `font-display: swap`.
- No third-party scripts above the fold.

---

## 15. Privacy, Security & Compliance

- **Jurisdiction:** Canadian federal (PIPEDA) + Ontario provincial.
- **Data residency:** Form submissions stored in PostgreSQL hosted in a Canadian or US region acceptable to the customer; Privacy Policy discloses the region.
- **Sub-processors disclosed in Privacy Policy:** Resend (email), Google Analytics, Stripe (QB Portal), Supabase (QB Portal).
- **Form data retention:** 24 months unless the lead becomes a customer (then per customer retention policy).
- **Security headers:** HSTS (hosting), CSP, X-Content-Type-Options, X-Frame-Options DENY, Referrer-Policy strict-origin-when-cross-origin.
- **Blog admin:** behind operator auth (already implemented).
- **Contact form:** rate-limited at the API server (already implemented).

---

## 16. Asset & Content Inventory

### 16.1 Assets already in place
- Brand logos (`logo-original.svg`, `logo-white.svg`).
- Certification badges (Microsoft, Google, QuickBooks PNGs).
- Team / about photo (`about-team.png` + WebP).
- Blog placeholder images (`blog-1.png`, `blog-2.png`, `blog-3.png`).
- Hero canvas component.
- Self-hosted Inter and Alegreya Sans SC fonts.

### 16.2 Asset gaps (flagged for build task)
- **Real founder headshot** for the About leadership card (currently uses team photo).
- **OpenGraph share images** (1200×630) per top-level page.
- **Favicon set** including 180×180 apple-touch-icon and 512×512 PWA icons (verify completeness).
- **Industry photography** for the home Industries section (currently icon-only).
- **Per-service illustrative imagery** if moving away from the current single-icon tile.
- Optional: short founder intro video for About.

### 16.3 Content gaps (flagged for build task)
- Final, lawyer-reviewed Privacy Policy and Terms of Service.
- Final per-service-page body copy (this PRD provides the brief, not the words).
- Initial 5–8 blog posts (5 fallback posts already drafted; verify SEO and add CTAs).
- Founder bio, final wording.
- Two case-study cards (one QB, one M365 ideal) — optional but recommended for credibility.

---

## 17. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| QB Portal launch slips and `/services/quickbooks` CTA points to a non-live destination | High — broken funnel | Soft-launch the marketing site with the QB CTA pointing to `/contact?service=quickbooks` and flip to `qb.nexfortis.com` on QB Portal launch day. |
| Founder photo and other content gaps delay launch | Medium | Block on (1) founder headshot, (2) verified privacy/terms text. Everything else is a fast-follow. |
| Contact form deliverability fails (Resend domain not verified) | High — silent lead loss | Sender-domain verification is a separate tracked task. Block launch on completion. |
| Lighthouse regressions from new media assets | Medium | Lighthouse CI gate at PR time; reject any route below 90. |
| SEO cannibalization between marketing site and QB Portal SEO landing pages | Medium | Marketing site `/services/quickbooks` targets advisory keywords (migration, repair); QB Portal targets transactional keywords (specific products). Review keyword overlap quarterly. |

---

## 18. Out of Scope (this PRD)

- Final per-page copy (build task).
- Visual mockups beyond design direction (build task).
- Code changes (build task).
- Anything under `qb.nexfortis.com` beyond cross-link contracts (covered by QB Portal PRDs).
- Paid advertising strategy and creative.
- Email-marketing automation (post-launch).
- Customer portal / login features for marketing-site visitors (none planned).

---

## 19. Open Questions for Owner Review

These items are placeholder-resolved in this draft based on the existing site and master remaining-work PRD. Confirm or revise before sign-off:

1. **Service-line lineup confirmed as 5?** (Digital Marketing, M365, QuickBooks, IT Consulting, Automation.) ☐ Confirmed ☐ Revise
2. **Tagline "Complexity Decoded. Advantage." stays as primary?** ☐ Confirmed ☐ Revise
3. **Pricing posture: no dollar prices on the marketing site?** ☐ Confirmed ☐ Revise
4. **Contact email: `support@nexfortis.com` as the inbox for form submissions?** ☐ Confirmed ☐ Revise
5. **Founder headshot will be supplied?** Owner to provide. ☐ Will provide ☐ Skip
6. **Legal copy (Privacy + Terms): owner-supplied or AI-drafted with disclaimer?** ☐ Owner-supplied ☐ AI-drafted
7. **Newsletter / blog-subscribe: post-launch only?** ☐ Confirmed ☐ Add at launch
8. **Cookie consent banner: required at launch?** ☐ Yes ☐ Defer (analytics-only, low risk)
9. **Industry list confirmed as 6 (Healthcare, Legal, Retail, Manufacturing, Finance, Non-profit/Education)?** ☐ Confirmed ☐ Revise
10. **Persona priority order (Owner-Operator → QuickBooks → Strategic CFO) correct?** ☐ Confirmed ☐ Revise

---

## 20. Sign-off

| Role | Name | Status | Date |
|---|---|---|---|
| Owner / Founder | Hassan Sadiq | ☐ Pending review | — |
| Author (Agent) | Replit Task Agent | ✅ Drafted | 2026-04-17 |

Once §19 is resolved and this section signed, this PRD becomes the locked source of truth for the build task.
