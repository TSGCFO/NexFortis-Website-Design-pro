# NexFortis Local SEO & Topical Authority — Brainstorm Pin

**Status:** Pinned (resume after Render launch + GBP verification)
**Date opened:** 2026-04-20
**Owner:** Hassan
**Related work:** Tasks #160–#162 (sprint-1 SEO hardening, prerender hardening, automated SEO tests)

---

## TL;DR

A third-party SEO audit produced a mostly-wrong report (they audited the legacy GoDaddy parking page at `nexfortis.com`, not our app) but surfaced two genuinely high-impact gaps in our SEO posture:

1. **No local-geography landing pages.** Despite being a regional services business, we have zero pages targeting "managed IT services Vaughan," "QuickBooks bookkeeping Toronto," etc.
2. **Topical authority is thin.** Five blog posts is far below the threshold (~15–25+ posts per cluster) Google needs to treat us as an authority on any specific topic.

A third item — adding `Content-Security-Policy` and `Permissions-Policy` headers to `render.yaml` — is a small housekeeping item and will be handled as part of the launch sprint, not this work.

This document captures all decisions made during the brainstorm so we can resume cleanly after launch.

---

## Why this is pinned (not done now)

1. **Google Business Profile is not yet verified.** GBP was submitted ~2026-04-20; verification typically takes 5–15 days for service-area businesses. Local-geography pages depend on a verified, consistent GBP entity to earn map-pack lift. Building the pages before verification means under-performance and a near-certain second-pass rework.
2. **The current site is launch-quality.** Prerendering, schemas, security headers, sitemap, and 27 automated SEO tests are all in place. The local + topical work is a *growth* gap, not a *quality* gap.
3. **The work needs sustained focus.** A 5-page local cluster + a multi-month editorial calendar is a 2–3 week sprint. Mixing it with the Render cutover would harm both.

**Resume trigger:** GBP verification email confirms the listing is live. Until then, do not begin implementation.

---

## Background — what the auditor got wrong (so we don't relitigate it)

The auditor's original report claimed:
- "Zero JSON-LD schema markup" — **false** (they audited the GoDaddy site at `nexfortis.com`, which is still pointing at the legacy DPS website builder, not our Render-bound React app)
- "Missing security headers" — **false** for production (they checked Replit dev URL headers, not `render.yaml` config)
- "Add `WebSite` with `SearchAction`" — **actively bad** advice (we have no `/search` endpoint; this would have generated Search Console errors — we removed it in PR #35)
- "Weak raw `<title>` fallback" — described GoDaddy's title, not ours

The auditor acknowledged all of these as methodology errors (curl-based audit on a JS-framework site, plus checking the wrong URL).

**What the auditor was right about** (and what this spec addresses):
- Local geography pages — gap is real
- Blog depth / topical authority — gap is real

Items consciously deferred or rejected:
- Review/AggregateRating schema — defer until we have verifiable customer reviews to cite (penalty risk if faked)
- More security headers (CSP, Permissions-Policy) — handle in launch sprint, not this work
- QB portal robots.txt "less sophisticated" — rejected; it's an authenticated app portal and `Disallow: /` is correct

---

## Decisions captured

### Geographic strategy (confirmed)

**Tier model:**

| Tier | Coverage | Schema type | Examples |
|---|---|---|---|
| **Tier 1 — Local (in-person, primary)** | GTA — wherever Hassan can travel for in-person work | `LocalBusiness` (or `ProfessionalService`) anchored to the GBP service area | Vaughan (HQ), Toronto, Mississauga, Brampton, Markham, Richmond Hill, Woodbridge, etc. |
| **Tier 2 — Canada-wide remote** | All of Canada for remote-friendly services (QB, automation, M365) | `Service` with `areaServed: Country` | "QuickBooks services across Canada", "Microsoft 365 deployment for Canadian SMBs" |
| **Tier 3 — Canada-wide on-site (select)** | Anywhere in Canada for select clients | Mention in copy; do not create per-city pages outside GTA | One-off mentions on case studies / about page |

**Implication:** Build Tier 1 and Tier 2 pages. Do NOT build "IT services Vancouver" / "IT services Calgary" — that would be doorway-page territory because we don't have a local presence there.

### Microsoft credentials (confirmed)

NexFortis holds the following verifiable Microsoft credentials, which are gold for both SEO and conversion trust:

- **Microsoft AI Cloud Partner** (already shown on site)
- **Certified Authorized Cloud Solution Provider (CSP)** — direct Microsoft authorization
- **Partnership with a Microsoft authorized distributor** — primary licensing channel for client M365 / Azure procurement

**Implications:**
- These should appear as a credential block on `/services/microsoft-365`, the home page, and every Microsoft-related blog post and location page
- Add `hasCredential` properties to the `Organization` schema citing each credential
- This is a real differentiator vs. generic local IT shops; lean into it in copy

### MSP gap (newly identified)

Current services pages: `quickbooks / automation / microsoft-365 / digital-marketing / it-consulting`.

There is **no dedicated `/services/managed-it-services` page**, despite MSP being a stated core service. "Managed IT services [city]" is one of the highest-volume, highest-intent keyword sets in this entire industry — far larger than "IT consulting."

**Decision:** Build `/services/managed-it-services` as a new dedicated service page **before** the location pages, because every location page will want to link to a real MSP service page (e.g., "Managed IT Services Vaughan" → links to the canonical MSP service page).

This is now part of the implementation scope when we resume.

### Google Business Profile (in progress)

- **Created:** ~2026-04-20
- **Status:** Submitted for verification, awaiting Google approval
- **Type:** Service-area business (no public address shown)
- **Service area:** 12–16 GTA cities (exact list pending — capture below when we resume)
- **Implication:** Service-area listings can rank in the local map pack within their listed cities once verified. Address itself stays hidden.

---

## Open questions (to resolve when resuming)

These were in flight when we paused. Resume with these in order:

### Q1 — Lock in canonical NAP
"NAP" = Name, Address, Phone. Single source of truth used everywhere (footer, schemas, GBP, every directory). Inconsistencies split Google's entity signal.

Capture exactly as entered in GBP:
- [ ] **Business name** (trade name confirmed: "NexFortis"; legal: numbered Canada Inc.)
- [ ] **Phone number** (with exact formatting — parens, dashes, spaces, country code)
- [ ] **Public-facing email**
- [ ] **Full list of service-area cities** (the 12–16 in GBP)
- [ ] **Canonical website URL** (https vs http, www vs non-www, trailing slash policy)

### Q2 — Page template structure for location pages
- Hand-crafted or programmatic-SEO templated?
- Required sections per page (hero, services-in-this-city, local credentials, FAQ, CTA, NAP block, schema)
- Internal linking: each location page links to all service pages and to the city's neighbors
- Recommendation lean: **hand-crafted** for the first 5 (Vaughan, Toronto, Mississauga, Brampton, Markham), then evaluate before scaling — Google penalizes templated location pages with thin content

### Q3 — Topical authority pillar selection
Three to five content pillars to own. Likely candidates:
- **Microsoft 365 / Copilot for Canadian SMBs** (leverages CSP credential)
- **QuickBooks Desktop migration & support** (Hassan's strongest existing expertise)
- **Managed IT for small Canadian businesses** (PIPEDA, compliance, hybrid work)
- **Workflow automation for non-technical teams**
- (Decide which to drop — pillar count should match production capacity)

### Q4 — Blog production model
- Who writes? (Hassan / outsourced / AI-assisted human edit)
- Cadence? (1/wk, 2/wk, 1/month — drives whether 25 posts is a 6-month or 2-year goal)
- Editorial review process before publishing
- Per-post checklist (target keyword, internal links, schema, related posts block)

### Q5 — Hub-and-spoke architecture
Per pillar:
- One hub page (comprehensive 3000–5000 word guide)
- 8–15 spoke posts linking back to hub
- URL pattern: `/blog/<slug>` for spokes, possibly `/guides/<pillar>` for hubs (decide later)

---

## Implementation outline (placeholder — fill in when resuming)

### Phase A — Pre-flight (after GBP verification)
1. Capture canonical NAP (Q1 above)
2. Audit current site footer + Organization schema for NAP consistency; fix any mismatches
3. Add Microsoft credentials block to `/services/microsoft-365` and update Organization schema with `hasCredential`
4. Build `/services/managed-it-services` (canonical MSP service page) — hand-crafted, comprehensive

### Phase B — Local geography pages (5 cities, hand-crafted)
1. Vaughan (HQ — full LocalBusiness schema)
2. Toronto
3. Mississauga
4. Brampton
5. Markham

Each page includes: hero with city name, services offered locally, local credentials, FAQ specific to that city's market, NAP block, ServiceArea schema scoped to that city.

Sitemap regeneration + internal links from home and services index.

### Phase C — Blog topical authority sprint
1. Pick 3 pillars (not 5 — focus beats spread)
2. Write 1 hub per pillar (3 hubs total)
3. Write 8–10 spokes per pillar over 8–12 weeks
4. Internal-link every spoke back to hub; cross-link spokes within pillar
5. Optional later: per-pillar hub URL structure (`/guides/<pillar>`)

### Phase D — Verification & monitoring
- Run Lighthouse + Screaming Frog (JS mode) against production after every batch
- Track ranking for target keywords in GSC
- Monitor GBP insights for impression/call growth
- Re-run automated SEO test suite to confirm no regressions

---

## What to NOT do (guardrails)

- ❌ Do not build location pages for cities outside the GTA (no "IT services Vancouver", "Calgary IT", etc.) — would be doorway pages
- ❌ Do not use templated/programmatic generation for location pages without unique content per page
- ❌ Do not add Review/AggregateRating schema until we have verifiable, citable reviews (Google penalty risk)
- ❌ Do not begin Phase B (local pages) until GBP is verified
- ❌ Do not add `WebSite` `SearchAction` schema (no on-site search endpoint exists)
- ❌ Do not change the canonical business name, phone, or email casually after launch — every change is a coordinated update across site, GBP, and every directory listing

---

## Resume checklist

When GBP verification email arrives:

- [ ] Confirm verified entity name, exact phone format, service-area cities
- [ ] Reopen this spec
- [ ] Resume from Q1 (capture canonical NAP)
- [ ] Walk through Q2–Q5 in order
- [ ] Convert this spec into a project task per the project_tasks workflow
- [ ] Begin Phase A
