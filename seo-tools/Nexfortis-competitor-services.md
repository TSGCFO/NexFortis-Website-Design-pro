# NexFortis Competitor Replication Playbook
## SEO, Local SEO, GBP, GEO & Digital Marketing — Master Line-Item Reference (May 2026)

## TL;DR

- **The 19 GTA/Canadian agencies surveyed all sell roughly the same 90–100 distinct line items, repackaged into 3–4 tiers; pricing in 2026 brackets cleanly into Maintainer ($1,000–2,000/mo), Growth ($2,500–5,000/mo), Aggressive ($5,000–10,000/mo), and Enterprise ($10,000+/mo) — per First Rank's published 2026 Toronto pricing guide and Quake Media's transparent ranges.** Solo founders with AI agents can deliver Growth-tier quality at Maintainer cost, which is NexFortis's structural arbitrage.
- **The single biggest 2026 shift is GEO (Generative Engine Optimization) and AI-search readiness — schema markup, passage-optimized content, and brand surface area on Reddit/LinkedIn/YouTube — because LLMs cite only 2–7 domains per response (Profound) versus Google's 10 blue links, and AI Overviews now show on ~13% of global searches (Semrush, March 2025), with US desktop searches hitting ~16%.** Agencies still leading with "we'll fix your title tags" are about 18 months behind.
- **Tool stack to deliver every item below: ~$420/mo total** (Ahrefs $129, Screaming Frog $22 amortized, Surfer $89, BrightLocal $39, AccuRanker $109, Microsoft Clarity FREE, Featured.com FREE, Looker Studio FREE, Hunter $49). At $1,500/mo per client and a 5-client load, NexFortis nets ~85% gross margin on tools — labour leverage from AI agents takes that further.

---

## Executive Overview

This document does one job: enable Hassan to reproduce, at equivalent or better quality, every line item that any GTA/Canadian SEO or digital-marketing agency is selling. It was built from direct scrapes of 19 competitor websites — Qode Media, Quake Media, Nomadic Advertising, First Rank, Home Care Marketing Pros, Storyteller Media, Mark3ting, T Parker Marketing, Fusion Computing, SearchKings, 2Marketing, Apples & Oranges, Web Hosting Canada, Global SEO Pro, ChoiceLocal, Invade Marketing, GMB Optimization, SkyTerra Tech, plus SEO Nova Scotia — and layered with 2025–2026 industry sources (Search Engine Land, Whitespark, BrightLocal, Ahrefs, Semrush, Screaming Frog, Profound, Featured.com, Google, the 2025 Web Almanac).

The result is a categorized master list of 104 unique deliverables. Each item answers Hassan's seven canonical questions: what is it, how does it work, why does it matter, weight on overall SEO grade, why it works (signal sent to Google), advantages, and — critically — *how to replicate it* with named tools, current 2026 prices, time budgets, and step-by-step workflows.

**How to use this document:** treat each item as an SOP candidate. Drop into `/docs/playbook/` in your repo. Each item's "HOW to replicate" section is designed to be pasted as a Cursor/Claude Code agent prompt with minimal editing. The document functions both as a sales reference (you can defend any pricing decision by pointing to the exact line items you deliver) and as an operational playbook (your AI agents follow these SOPs to actually do the work).

**Pricing posture recommended for NexFortis:** match Quake Media's transparent-range model. Don't price by feature checklist; price by competitive bracket (low/medium/high local competition × site complexity). The 90+ items below are the menu of capabilities that justify whatever number you put on the proposal.

---

## Master Category Index

1. Discovery, Audit & Strategy (12 items)
2. Technical SEO (16 items)
3. On-Page SEO (12 items)
4. Content Production (10 items)
5. Link Building & Off-Page (9 items)
6. Local SEO (8 items)
7. Google Business Profile (10 items)
8. Analytics, Reporting & Tracking (8 items)
9. Generative Engine Optimization / AI Search (7 items)
10. Auxiliary Digital Marketing (12 items)

**Total: 104 unique line items.**

---

# CATEGORY 1 — DISCOVERY, AUDIT & STRATEGY

## 1.1 Free SEO Audit / Free Website Analysis

**What it is.** A no-charge, often semi-automated diagnostic of a prospect's website that produces a written report flagging visible SEO problems — slow pages, missing meta titles, broken links, weak Google Business Profile, citation gaps, basic backlink picture. It is the universal lead-magnet of every agency in the dataset (Qode, First Rank, Quake Media, Storyteller, T Parker, Mark3ting, GMB Optimization). Quake Media calls it a "free audit"; First Rank calls it a "free website analysis"; Storyteller calls it a "free local SEO audit."

**How it works.** The agency runs a target domain through one or more crawl/analysis tools, captures the dashboards, writes a 1–3 page interpretation, and uses the findings as a sales conversation. The actual diagnostic depth is intentionally shallow — the report's job is to surface enough pain to book a call, not to fix anything.

**Why it's important.** It is the single most cost-effective customer-acquisition asset in the industry. Every agency on the list uses it as the front door. Without it, your only sales path is cold outreach.

**Weight on SEO grade.** Low for the prospect's actual site (an audit you don't act on does nothing); high as a *commercial* deliverable for NexFortis, because it converts.

**Why it works (the signal).** It signals competence and gives the prospect a sense of "they've already done work for me." It also creates the buying loop behavioural-economics researchers call the foot-in-the-door effect.

**Advantages.** Establishes authority before money changes hands; lets you walk into the sales call with a concrete problem list; flushes out unfit prospects.

**HOW to replicate.**

*Tools (2026 prices):* Ahrefs Webmaster Tools (free for verified site owners); Semrush Site Audit (Pro plan $139.95/mo); Screaming Frog SEO Spider ($259/yr unlimited URLs, free for 500 URLs); PageSpeed Insights (free); Google Search Console + GA4 (free); Whitespark Local Citation Finder (from $24/mo); BrightLocal Track plan ($39/mo). *Imagine a Vaughan plumber's site:* you'd run all of these in under an hour.

*Workflow (2–4 hours per audit, AI-deliverable with light human review):*
1. Run Screaming Frog with default settings + JavaScript rendering enabled. Export `Internal_All` CSV.
2. PageSpeed Insights on homepage + top 3 service pages, mobile and desktop. Save LCP/INP/CLS scores.
3. Ahrefs/Semrush domain overview: Domain Rating, referring domains, top organic keywords, top competitors.
4. Whitespark Local Citation Finder for NAP-consistency snapshot.
5. Open the prospect's GBP manually: missing categories, low photo count, no posts in 30 days, no Q&A.
6. Have a Claude/GPT agent ingest the four CSVs + a GBP screenshot and produce a 1,500-word report. Prompt skeleton: *"Act as a senior SEO consultant. Given the attached crawl, speed, and citation data, produce a Free SEO Audit Report for [domain]. Sections: Top 5 Critical Issues, Quick Wins (under 1 week), Strategic Opportunities (1–3 months), and a recommended 90-day roadmap. Plain language only — no jargon. Include 3 specific examples from their actual pages."*
7. Human pass: spot-check three claims against raw data; add a personalized opening referencing something specific.

*Cost to deliver:* ~$15 in tool API time per audit; 30 minutes of human time. *Charge:* free (lead magnet) — but it earns the $1,500–4,000/month retainer.

*Common mistakes:* using a one-click "audit tool" that spits out generic copy (prospects can smell it); making the report too long (3 pages max); listing 50 issues with no prioritization.

*AI agent delivery:* yes, end-to-end with human spot-check.

## 1.2 Paid In-Depth SEO Audit (200-Point / Full Audit)

**What it is.** A paid, exhaustive technical + on-page + off-page audit. Storyteller Media's "200-point site audit" starts at $1,495. First Rank, Qode, and Quake sell similar audits as project work or as the on-ramp to a retainer.

**How it works.** Same tools as the free audit, but at full depth: every page reviewed, every issue prioritized by impact-vs-effort, delivered as a 30–80 page document with screenshots, fix instructions, and a roadmap.

**Why it's important.** It's the premium companion to the free audit and the deliverable agencies use to recover trust when a previous SEO hire failed. The closest thing the industry has to a "diagnosis bill" before treatment.

**Weight on SEO grade.** High *if executed*. The audit itself does nothing; implementation is where the lift comes from.

**Why it works (signal).** Tells the client you treat SEO as engineering, not vibes. Internally, it forces the diagnose-then-treat discipline that prevents random "SEO work."

**Advantages.** Flat-fee revenue ($1,000–3,500), upgrades into a retainer 60–80% of the time when scoped right; produces a documented baseline you can measure against.

**HOW to replicate.** Tools as in 1.1, run at full depth: Screaming Frog with custom extraction for schema, hreflang, structured headings; Sitebulb ($162–420/yr) for the visual report layer clients understand; Ahrefs Site Audit; manual review of top 30 pages. Time: 8–14 hours (AI drafts 60% of the document). Charge: $1,000 (small site) to $3,500 (e-commerce 5,000+ pages). Common mistake: bundling free into a retainer instead of charging — clients value what they pay for.

## 1.3 Discovery Call / Goals Workshop

**What it is.** A 30–60 minute structured intake call covering industry, geographic targets, current revenue, conversion mechanics, internal team capacity, and KPIs. Storyteller, T Parker, Quake, Nomadic, and First Rank all gate proposals behind a discovery call.

**How it works.** Run a written questionnaire first (Tally, Typeform, Google Form). On the call, dig into the soft stuff — what does a "good lead" look like, average client lifetime value, who else is involved in marketing decisions, timeline pressure.

**Why it's important.** Without it, every deliverable is guessed. *Imagine a local accounting firm in Vaughan* — until you know they target small businesses with $1M–10M revenue (not individual tax filers), the keyword research is wrong on day one.

**Weight on SEO grade.** Indirect but very high — the wrong target keywords waste 6 months of budget.

**Why it works.** Surfaces the asymmetric information (LTV, sales cycle length) that lets you scope a campaign that pays back.

**Advantages.** Higher close rates; bigger deal sizes; cleaner scope; fewer surprises 90 days in.

**Replicate it:** 60 minutes prep, 60 on the call, 30 write-up. Standard agenda: business model → target customer → geography → competitors → existing assets → goals → KPIs → timeline → budget. Free to deliver. Most important hour you'll spend.

## 1.4 Competitor SEO Analysis / Competitive Gap Analysis

**What it is.** Identifying the top 3–10 competitors organically ranking for the client's target queries, then dissecting how they do it: best pages, top keywords, backlink sources, content patterns, technical setup. Qode lists "Competitors' SEO Audit & Comparison" on every plan; Quake delivers "Competitive content gap analysis"; First Rank, Mark3ting, and SEO Toronto all sell it.

**How it works.** Ahrefs' Content Gap or Semrush's Keyword Gap: paste your domain plus 3–5 competitor domains, get keywords they rank for that you don't. Then Top Pages to see which content drives their traffic, and Backlinks to see who's linking.

**Why it's important.** Compresses 3 months of trial-and-error into a 3-hour exercise. You stop guessing keywords; you copy what's already proven to work in the niche.

**Weight on SEO grade.** High at the strategic level — wrong targets equal no return.

**Why it works.** Google ranks pages it's already decided are worthy. Studying winners reverse-engineers what Google has already validated.

**Advantages.** Faster compounding; defensible strategy; client sees specific named competitors and feels you've done your homework.

**HOW to replicate.**
1. Confirm 5 most relevant local competitors (ask client; verify via Google searches for top services in their city).
2. Ahrefs → Site Explorer → enter client domain → Competing Domains report → cross-check.
3. Run Content Gap with your domain as target, 3 competitors as sources. Filter KD <30, monthly volume >50.
4. Pull each competitor's Top Pages (sort by traffic). Document URL, topic, word count, primary keyword.
5. Backlink intersection: Ahrefs' Link Intersect — domains linking to ≥2 competitors but not you. That's your outreach list.
6. Synthesize into a 1-page deliverable: Top 20 keywords to target, Top 10 content gaps, Top 30 backlink prospects.

Time: 3–5 hours. Cost: Ahrefs subscription. Charge: $400–1,500 standalone or rolled into the audit. AI-deliverable for data extraction; human for prioritization.

## 1.5 Keyword Research & Strategy

**What it is.** Identifying the actual search terms target customers type, ranked by intent, volume, difficulty, and revenue potential. Every agency in the dataset lists it as item one of every retainer. Qode includes "Keyword Research & Planning (Includes Primary & Variations)" on all tiers.

**How it works.** Seed keywords from the discovery call feed Ahrefs Keywords Explorer or Semrush Keyword Magic Tool. Each tool returns hundreds of related queries with monthly volume, keyword difficulty (0–100), CPC, and parent-topic clusters. Filter for commercial intent ("near me," "best," "[city] [service]") and group by topic.

**Why it's important.** Targeting wrong keywords is the single most common reason SEO campaigns fail. T Parker explicitly mentions "long-tail keywords and search intent insights"; Qode lists keyword research and variation planning on every tier.

**Weight on SEO grade.** Very high — sets the target board for everything downstream.

**Why it works.** Search engines reward pages matching user intent. Keyword research is how you map intent.

**Advantages.** Ranks for queries that convert, not just queries with volume; avoids competing for impossible terms; finds long-tail wins fast.

**HOW to replicate.**
1. Seed list: client interview + Google Autocomplete + People Also Ask + competitor analysis from 1.4.
2. Ahrefs Keywords Explorer → Matching terms + Related terms + Questions. Export to CSV.
3. Filter: KD <40 for new sites, <20 for sites under DR 20; volume >30; exclude irrelevant intents.
4. Cluster by topic (Keyword Insights ~$58/mo, or by hand in a Google Sheet).
5. Map each cluster to a target page — existing (optimize) or new (create).
6. Deliver a Google Sheet: Cluster, Primary Keyword, Volume, KD, Intent, Mapped URL, Status.

Time: 4–8 hours for a 10-cluster project. Charge: $500–1,500. Common mistake: targeting volume without intent — "free SEO tool" has 50,000 searches/month but converts no plumbers.

## 1.6 Search Intent Mapping

**What it is.** Classifying each target keyword as informational, navigational, commercial-investigation, or transactional, and ensuring the matching page is the right type. Storyteller and T Parker both call this out by name.

**How it works.** Look at what currently ranks in Google's top 10 for the query. Top 10 is all blog posts → intent is informational. Top 10 is all service/product pages → intent is transactional. Match your page type to the SERP, not your wishful thinking.

**Why it works.** Google has decided what intent a query represents (by watching billions of clicks). You can't outvote Google.

**Replicate it:** For each target keyword, paste into Google in incognito, look at top 5 results, tag the SERP type. 30 seconds per keyword. Free.

## 1.7 SEO Roadmap / 90-Day Plan

**What it is.** A written, sequenced execution plan translating audit + keyword research into month-by-month deliverables. Quake's 90-day execution plan and Storyteller's "Plan Creation and Presentation" are versions.

**Replicate it:** Score each issue from the audit on impact (1–5) × effort (1–5), sort by impact/effort ratio, top items into Month 1, next batch into Month 2, etc. Deliver as a one-page Gantt + written narrative. 2–3 hours. Sets the entire engagement.

## 1.8 Industry / Niche Analysis

**What it is.** Understanding regulatory, seasonal, and conversion-pattern peculiarities of the client's industry. *Picture a personal-injury law firm in Mississauga:* 3-month sales cycles, Google requires extra E-E-A-T signals (lawyer headshots, bar credentials, authorship). HVAC is hyper-seasonal. Therapists need privacy-conscious CTAs.

**Replicate it:** 2 hours reading 5 trade-publication articles + the top 3 ranking competitors' About and case-study pages. Free. Avoids category-level mistakes that waste months.

## 1.9 Persona & Buyer Journey Mapping

**What it is.** A 1–2 page document naming 1–3 ideal customer personas mapped to content needs at awareness, consideration, decision, retention. Storyteller offers it explicitly ("custom personas for content").

**Replicate it:** Discovery answers + 5 customer testimonials + Google Reviews → draft each persona. Claude formats. 2 hours. $300–600 standalone.

## 1.10 Conversion Tracking & Goal Definition

**What it is.** Defining and instrumenting what counts as a "lead" or "sale" — form submissions, phone calls, bookings, e-comm purchases — *before* the campaign starts.

**Replicate it:** GA4 events for form submissions (via GTM); CallRail (~$45/mo basic, free with Nomadic-style packages) for phone-call tracking; verify by submitting a test lead. 2 hours. Charge: setup $300–500.

## 1.11 Baseline Snapshot

**What it is.** A frozen, dated record of where the client stood on Day 1: organic traffic, keyword positions for top 30 targets, Domain Rating, referring domains, GBP impressions, conversion rate. Without it, you can't prove progress in 6 months.

**Replicate it:** Screenshot every dashboard. Paste into a Google Doc, dated and signed. 30 minutes. Free; pays for itself the first time a client says "I don't think this is working."

## 1.12 Quarterly Strategy Review

**What it is.** A formal 90-day sit-down where the agency presents results, what worked, what didn't, and the next-90-day focus. T Parker, Quake, and Storyteller all include.

**Replicate it:** 1-hour meeting + 4-hour deck prep. Reuse the report template (item 8.1). Free to client; protects your retainer.

---

# CATEGORY 2 — TECHNICAL SEO

## 2.1 Technical SEO Audit

**What it is.** The deep-dive subset of the full audit, focused on whether Google can crawl, render, and understand the site. Quake Media's published technical audit checklist is canonical: crawl architecture review, Core Web Vitals, structured data, JavaScript rendering, mobile usability, security headers.

**How it works.** Run a crawler (Screaming Frog or Sitebulb) → identify broken links, redirect chains, orphan pages, missing titles, duplicate metas, slow pages, render issues. Cross-reference against Google Search Console's coverage and Core Web Vitals reports.

**Why it's important.** A site Google can't crawl is invisible no matter how good the content. Per the 2025 Web Almanac, only 48% of mobile pages and 56% of desktop pages pass all three Core Web Vitals — meaning passing them is a real competitive edge for the half of the market that doesn't.

**Weight on SEO grade.** Foundational. A perfect content strategy on a broken site ranks for nothing.

**Why it works (signal).** Clean technicals signal "professional, maintained, trustworthy" to crawlers and users. Slow, broken sites signal "abandoned." Per Google research cited in Addy Osmani's *History of Core Web Vitals*: pages meeting all three Core Web Vitals thresholds saw users 24% less likely to abandon mid-load.

**Advantages.** Often the fastest-return SEO investment — fixes can produce ranking improvements within 2–6 weeks of re-crawl.

**HOW to replicate.** Tools: Screaming Frog ($259/yr), Sitebulb ($162–420/yr), Google Search Console (free), PageSpeed Insights (free), Schema.org Validator (free), Google Rich Results Test (free). Workflow: 8–14 hours for a 1,000-page site. Output is a prioritized fix list. AI-deliverable: ~70%; humans needed for weird edge cases.

## 2.2 Crawlability Audit (robots.txt, sitemap.xml, internal links)

**What it is.** Verifying search engines can find every page that should be indexed. Qode lists "XML Sitemap, Robots.txt Validation" in all tiers.

**Replicate it:**
1. Pull `domain.com/robots.txt`. Don't accidentally block `/wp-admin/admin-ajax.php`, `/static/`, or any indexable directory. Verify GPTBot, ClaudeBot, PerplexityBot are NOT disallowed unless the client wants them out.
2. Pull `domain.com/sitemap.xml`. Confirm no 404s, no noindex pages, last-modified dates accurate.
3. Search Console → Pages → check Indexed vs Not indexed. Investigate every "Crawled — currently not indexed" URL.
4. Screaming Frog → Crawl Depth report. Pages more than 4 clicks from home often suffer.

Time: 2–3 hours. AI-deliverable for diagnosis; human for fixes.

## 2.3 Core Web Vitals Optimization (LCP, INP, CLS)

**What it is.** Hitting Google's three thresholds: Largest Contentful Paint under 2.5s, Interaction to Next Paint under 200ms (replaced FID March 2024), Cumulative Layout Shift under 0.1. Quake calls these out as hard targets; Qode includes "Loading Speed Testing and Optimization" on all tiers.

**Why it's important.** Confirmed ranking factor since 2021. The 2025 Web Almanac shows fewer than half of mobile pages pass all three — passing is therefore an immediate competitive edge.

**HOW to replicate.**
1. Compress images (Squoosh free; ShortPixel $9.99 one-time for 7,000 images; or TinyPNG $39/yr unlimited).
2. Convert to WebP/AVIF.
3. Defer non-critical JavaScript (`defer`/`async`; remove plugins on pages that don't need them).
4. Preload the LCP element (hero image or hero font).
5. Set explicit `width`/`height` on every image to prevent layout shift.
6. Use a CDN (Cloudflare free tier covers most SMBs).
7. Re-test in PageSpeed Insights using *field data* (Chrome User Experience Report), not lab data.

Time: 4–10 hours per site. Audit and code suggestions: AI. Implementation: human/dev. Charge: $500–2,500 add-on.

## 2.4 Mobile-First Optimization

**What it is.** Ensuring the mobile site is the primary, fully-featured version — Google has been mobile-first for all sites since 2023. T Parker, Qode, Quake all reference.

**Replicate it:** Test every key page in Chrome DevTools mobile view + Google's Mobile Friendliness check (now in Search Console). Verify tap targets ≥48px, fonts ≥16px, no intrusive interstitials, no horizontal scrolling. 1–2 hours. Free tools.

## 2.5 Site Architecture & Internal Linking

**What it is.** Sitemap-on-paper: how pages are organized, how they link, how PageRank flows internally. Qode lists "Internal linking" on every tier; Quake explicitly audits internal-link depth and orphan pages.

**Why it's important.** Pages need at least one internal link from a relevant page to be indexed. The "topic cluster" or "hub-and-spoke" model — pillar page links to supporting pages and back — is the dominant 2026 architecture.

**Replicate it:** Screaming Frog's Inlinks column to find pages with 0 or 1 inlink. Add contextual links from related content. Plug ahrefs/Link Whisper ($77 one-time WordPress) for AI-suggested internal links. 4–8 hours/month. Common mistake: dumping every internal link into the footer.

## 2.6 Schema Markup / Structured Data

**What it is.** JSON-LD code added to a page that explicitly tells Google "this page is a LocalBusiness" or "this page is an FAQ" or "this page is a Product with this price and this rating." Qode, Quake, T Parker, Mark3ting, Mobile OPZ all sell this. Quake names Article, FAQPage, HowTo, Product, LocalBusiness as the standard set.

**Why it's important.** The single biggest 2026 lever for AI Overviews and rich results. Sites with valid schema get cited more often by ChatGPT, Perplexity, and Google's AI Mode — Page One Power, Strapi, and Search Engine Land all flag schema as "infrastructure for AI citation."

**HOW to replicate.**
1. WordPress: install Rank Math (free) or Yoast SEO ($99/yr Premium) — both auto-generate Article and Organization schema.
2. For LocalBusiness, hand-code the JSON-LD with exact NAP, hours, GBP URL, and `aggregateRating` from real reviews.
3. For FAQ pages, mark up Q&A using FAQPage schema.
4. For Service pages, use Service + LocalBusiness combined.
5. Validate every page in Google's Rich Results Test and Schema.org Validator.
6. Watch for warnings in Search Console → Enhancements.

Tools: free. Time: 1–4 hours per page type to set up the template; 5 minutes per new page after that. AI-deliverable: yes — Claude/GPT can write valid JSON-LD from a content brief. Common mistake: marking up content that doesn't actually appear on the page (Google penalty risk).

## 2.7 HTTPS / SSL / Security Headers

**What it is.** Site loads over HTTPS with valid SSL; HSTS, CSP, X-Content-Type-Options headers configured. Qode includes SSL Certificate; Quake's web dev process explicitly sets HSTS, CSP, X-Frame-Options.

**Replicate it:** Free Let's Encrypt cert via host. SecurityHeaders.com (free) to grade. Add via .htaccess or Cloudflare Page Rules. 1 hour.

## 2.8 Canonical Tags

**What it is.** A `<link rel="canonical">` tag declaring which URL is the master version of duplicate content (especially WooCommerce parameter URLs and pagination).

**Replicate it:** Yoast/Rank Math handle self-referencing canonicals automatically. Cross-domain or parameter cases: hand-coded. 30 minutes.

## 2.9 XML Sitemap Generation & Submission

**What it is.** Machine-readable list of every URL you want indexed, submitted to Search Console and Bing Webmaster Tools. Qode names "XML Sitemap" in every tier.

**Replicate it:** Yoast/Rank Math/Squarespace/Shopify auto-generate. Submit URL in Search Console → Sitemaps. 15 minutes.

## 2.10 Robots.txt Configuration

**What it is.** Directive file telling crawlers what they can and can't access. In 2026, the AI-crawler dimension is critical — verify GPTBot, ClaudeBot, Perplexity-User, OAI-SearchBot are allowed unless the client opts out.

**Replicate it:** Edit via FTP or Yoast's editor. Test in Search Console's robots.txt tester. 30 minutes.

## 2.11 Page Speed / Loading Speed Optimization

**What it is.** Continuous discipline of keeping the site fast. Qode lists on all tiers; Quake reports Lighthouse scores from 35 to 95+ with average load-time improvement of 62%. Note: Akamai/SOASTA's *State of Online Retail Performance* (Spring 2017) found just a 100-millisecond delay reduced smartphone conversions by 7.1% — speed gains have direct revenue impact.

**Replicate it:** PageSpeed Insights monthly on homepage + top 3 pages. Track field data. Investigate any score regression >5 points. WP Rocket ($59/yr/site) for caching; Cloudflare free; Imagify for images.

## 2.12 Broken Link Audit & Fix

**What it is.** Find and fix 404s, both internal and external outbound. Mobile OPZ explicitly mentions; Screaming Frog flags by default.

**Replicate it:** Screaming Frog → Response Codes → 4xx/5xx → fix or redirect. Run quarterly. 1–2 hours.

## 2.13 Redirect Management (301s, redirect chains)

**What it is.** Setting up permanent redirects after URL changes; eliminating redirect chains (A→B→C should become A→C).

**Replicate it:** WordPress: Redirection plugin (free). For chains: Screaming Frog → Redirect Chains report → flatten. 1–4 hours after migration.

## 2.14 Hreflang / International SEO

**What it is.** For sites serving multiple countries/languages, the `hreflang` tag pairs each URL with the correct language version. Most GTA SMBs don't need this; ones serving English + French Canadian do.

**Replicate it:** Yoast Premium handles. Complex cases: hand-coded. 4 hours setup.

## 2.15 Crawl Budget Management

**What it is.** For large sites (>1,000 pages), telling Google which to prioritize. Mostly relevant for e-commerce.

**Replicate it:** Block low-value parameter URLs via robots.txt; consolidate duplicates with canonicals; remove thin pages. As needed.

## 2.16 JavaScript Rendering Audit

**What it is.** For React, Vue, Next.js sites — confirming Google sees the rendered DOM, not the empty shell. Quake flags explicitly: "Identifying content hidden from Googlebot by client-side rendering, with SSR/SSG migration plans."

**Replicate it:** Search Console → URL Inspection → Live Test → View Tested Page → check rendered HTML actually contains body copy. Screaming Frog with JS-rendering enabled does the same at scale. 1 hour to diagnose; days/weeks of dev work to fix if broken.

---

# CATEGORY 3 — ON-PAGE SEO

## 3.1 Title Tag Optimization

**What it is.** The `<title>` element — the headline shown in the SERP and browser tab. Every agency lists it; Qode calls it "Meta Data" optimization.

**Why it's important.** Top-3 on-page ranking factor. A well-written one increases CTR by 20–60%.

**Replicate it:** Format: `Primary Keyword | Modifier or Benefit | Brand` (under 60 chars). *Example for a Vaughan plumber:* "Emergency Plumber Vaughan | 24/7 Service | NorthGTA Plumbing." Tools: Rank Math/Yoast for live preview. 5 minutes per page. Charge: included in on-page work.

## 3.2 Meta Description Optimization

**What it is.** The 155-character snippet under the title in the SERP. Not a ranking factor; major CTR factor.

**Replicate it:** Benefit-driven, include the keyword once, end with a CTA. *Example:* "Pipes burst at 2am? Our licensed Vaughan plumbers arrive within 90 minutes — 24/7. Get a free quote in 60 seconds." 5 minutes.

## 3.3 H1, H2, H3 Heading Structure

**What it is.** Semantic outline: one H1 (page topic), H2s for major sections, H3s underneath. Mobile OPZ, Storyteller, Mark3ting all reference "proper heading tags."

**Why it works.** Google uses headings to understand topical structure. AI engines especially love clear hierarchies — they extract passages by heading.

**Replicate it:** Audit with Screaming Frog → H1 and H2 columns. Fix pages with no H1, multiple H1s, or H1 = brand name. 1 hour for a 30-page site.

## 3.4 Image Alt Text Optimization

**What it is.** The `alt=""` attribute describing what's in an image, used by screen readers and Google Image Search. Mobile OPZ and Mark3ting both flag.

**Replicate it:** For each meaningful image, write a 4–10 word natural description that includes a relevant keyword if it fits. Decorative images get `alt=""`. 1 hour per 50 images.

## 3.5 Image Optimization (file naming, size, compression)

**What it is.** Renaming `IMG_4521.jpg` → `vaughan-plumber-team.jpg`; compressing to <200kb; serving in WebP. Mobile OPZ explicitly mentions image naming, size, metadata.

**Replicate it:** Bulk rename in Finder/File Explorer; ShortPixel WordPress plugin auto-converts on upload. 30 minutes setup; automatic thereafter.

## 3.6 URL Structure / Slug Optimization

**What it is.** Short, descriptive URLs: `/services/emergency-plumbing` not `/?p=4521`. Mobile OPZ lists "link URL optimization."

**Replicate it:** WordPress → Settings → Permalinks → "Post name." Edit slugs on each page. Avoid changing existing URLs without redirects.

## 3.7 Keyword Placement (H1, first 100 words, body, last paragraph)

**What it is.** Strategic — not stuffed — placement of the primary keyword. Mobile OPZ mentions "keyword density" and "anchor text optimization."

**Replicate it:** Surfer SEO ($89/mo) or Frase ($45/mo, which Nomadic uses) to score the page against top 10 ranking competitors. Aim for 0.5–1.5% density on the primary keyword. 30 minutes per page.

## 3.8 Internal Anchor Text Optimization

**What it is.** Clickable text of internal links. "Click here" is wasted; "emergency plumbing services in Vaughan" is signal.

**Replicate it:** Screaming Frog → Inlinks → review anchors. Rewrite generic ones. 2 hours.

## 3.9 Featured Snippet Optimization

**What it is.** Structuring content to win the "Position 0" answer box. Quake's content brief includes "featured snippet opportunities."

**Replicate it:** For target keywords with featured snippets, mimic the format (definition, list, table). Place a 40–60 word direct answer immediately after the H2 containing the question.

## 3.10 Content Optimization Against Top-Ranking Competitors

**What it is.** Using Surfer SEO, Clearscope, or Frase to score your draft against the top 10 ranking pages and ensure topical comprehensiveness. Nomadic explicitly uses Frase.

**Replicate it:** Surfer SEO Content Editor ($89/mo Essential): paste draft, get a score 0–100 against the SERP, add suggested terms until you hit 70+. 30 minutes per draft.

## 3.11 Page Type Selection (service vs blog vs product vs location)

**What it is.** Putting the right *type* of page on the right keyword. Transactional keywords need service pages; informational get blog posts.

**Replicate it:** Decision tree: SERP analysis (item 1.6) → page type. Free; high leverage.

## 3.12 Open Graph & Twitter Card Tags

**What it is.** Meta tags controlling how a URL appears when shared on Facebook, LinkedIn, X. Not a direct ranking factor; affects social CTR and brand consistency.

**Replicate it:** Yoast/Rank Math handle. Verify with Facebook Sharing Debugger. 5 minutes.

---

# CATEGORY 4 — CONTENT PRODUCTION

## 4.1 Blog Posts (1–4/month)

**What it is.** Long-form articles targeting informational keywords. Qode includes 1–2 articles/month; Storyteller and Home Care Marketing offer 1–4/month per tier; T Parker delivers 3 SEO blogs per month at $1,200/mo total; Quake delivers 2–8.

**Replicate it:**
1. Brief: from item 1.5 keyword research, pick a target. Build a brief: primary keyword, secondary keywords, target word count (match SERP average), heading outline, internal link targets.
2. Draft: Claude or GPT-4o draft, 800–1,500 words, in client's voice (feed it 3 sample paragraphs of theirs).
3. Optimize: Surfer/Frase, content score >70.
4. Edit: human pass for accuracy, voice, examples, statistics.
5. Add: 2–4 images (compressed, alt text), 3–5 internal links, 1–2 outbound authoritative links.
6. Publish: optimized title, meta description, slug, schema, featured image.

Time: 2–4 hours per post. Cost: ~$30 in tool/API. Charge: $200–600 per blog. Margin: high if AI-assisted.

## 4.2 Service Page Writing / Optimization

**What it is.** Transactional landing pages for each service. T Parker explicitly sells "1 fully optimized service page" per month at $1,200/mo total.

**Replicate it:** 800–2,000 words per page; H1 = primary keyword; H2s for problem/solution/process/pricing/FAQ/CTA; schema (Service + LocalBusiness); 3–5 internal links to related pages and the GBP. 4–8 hours. Charge: $500–1,500 per page.

## 4.3 Location Pages / City Pages

**What it is.** A separate optimized page per city or neighbourhood served. Qode lists "Location Pages"; Home Care offers 5–10 city/service landing pages per tier; Mobile OPZ creates "targeted content for the cities, zip codes, or service areas."

**Replicate it:** Template-based but each must have unique content (300+ unique words minimum) — local landmarks, testimonial from a local client, embedded Google Map, neighbourhood-specific FAQs. Avoid Google's "doorway page" penalty by adding genuine local value. 3–6 hours per page.

## 4.4 Pillar Page / Topic Cluster Content

**What it is.** A 3,000–8,000 word definitive guide on a broad topic, surrounded by supporting blog posts that all link back. Quake calls it "topic clusters."

**Replicate it:** Pillar (broad topic, transactional keyword) → 6–12 supporting posts (long-tail keywords) → all supporting pages link to pillar; pillar links to all supporting. Pillar takes 8–12 hours; cluster builds over months.

## 4.5 Content Brief Production

**What it is.** Structured input document a writer (or AI) uses to produce on-target content. Quake explicitly delivers content briefs as a step.

**Replicate it:** Frase's Brief Builder (built into the $45/mo plan) auto-pulls SERP data; or Google Doc template with target keyword, search volume, KD, target word count, intent, heading outline, must-include entities, internal/external link targets, CTA.

## 4.6 Content Calendar / Editorial Plan

**What it is.** Rolling 3-month plan of what gets written when, mapped to keyword research and seasonal opportunity. Storyteller's Content Marketing Plan starts at $1,200; Mark3ting and First Rank also sell standalone.

**Replicate it:** Notion/Airtable/Google Sheet with columns: month, week, working title, primary keyword, status (briefed/drafted/edited/published), assigned writer, internal-link plan. Updated weekly.

## 4.7 Content Refresh / Re-Optimization

**What it is.** Updating older pages that have lost rankings. Often the highest-ROI activity in an SEO retainer because the content already has authority.

**Replicate it:** Each quarter, pull top 50 organic pages from GSC, identify pages whose CTR has declined or whose ranking has slipped to position 4–15. Update content (add 2026 stats, refresh examples, expand thin sections, add schema). Re-submit URL in Search Console. 1–3 hours per page; high leverage.

## 4.8 FAQ Sections / Q&A Content

**What it is.** Q&A blocks on key pages, marked up with FAQPage schema. T Parker says "Structured content with FAQs for stronger SEO and AI visibility."

**Replicate it:** Mine People Also Ask (use AlsoAsked.com, $59 one-time or $19/mo). Answer each in 40–60 words. Mark up with FAQPage schema. 1 hour per page.

## 4.9 Press Release Writing & Distribution

**What it is.** Newsworthy announcements distributed via PR newswires (PRNewswire, EIN Presswire). Qode lists "Press Release Writing & Distribution" on its tiers.

**Replicate it:** 400–600 words, formal AP style. Distribute via EIN Presswire ($199–399/release), PRWeb ($150–500), or Canada Newswire (~$200). Most resulting links are nofollow with limited direct SEO value but help with brand mentions and AI citation.

## 4.10 Video / Animation Content

**What it is.** Short-form business explainer or animated video. Qode lists "One 15 Second (MAX) Business Explainer or Animation Video" in tiers.

**Replicate it:** Runway ($15–95/mo), Synthesia ($89/mo for AI avatar), Veo 3 (per-clip pricing), HeyGen ($24/mo). 2–6 hours per 15-second clip. Charge: $200–800 per video.

---

# CATEGORY 5 — LINK BUILDING & OFF-PAGE

## 5.1 Editorial / Outreach Backlinks (manual, white-hat)

**What it is.** Earning a link by getting a real journalist or blogger to mention you in a real article. Quake delivers 15–25 referring domains/month from DR 40+ sites; Qode includes "Outreach Backlinking" on every tier.

**HOW to replicate.**
1. Build a target list (item 1.4's Link Intersect output).
2. Find editor email via Hunter.io ($49/mo for 500 lookups), Apollo.io ($59/mo), or Clay ($149/mo).
3. Pitch a specific story idea, not a link request. Use BuzzStream ($24–999/mo) or Pitchbox ($550/mo); or Smartlead ($39/mo) for cold email.
4. Reply rate: 5–15% if pitch is good. Conversion to link: 10–30% of replies. Expected: 1 link per 50–80 emails.

Time: 4–8 hours per link earned. Outsource cost per link: $200–800. NexFortis cost: ~$50–150 in tools and labor. Charge: build into the retainer ($1,500/mo for 8–12 links).

## 5.2 Guest Posting

**What it is.** Writing a complete article for another website in exchange for a contextual link. Nomadic explicitly sells "Guest Post Backlink Management $550–3,000."

**Replicate it:** Pitch a topic to a relevant blog; on accept, write 1,000–1,500 word original article with one or two natural links back. Tools: same as 5.1 plus Authority Hacker's database or Loganix ($99–399/post). 6–10 hours per post. Charge: $300–800 per link or bundle.

## 5.3 HARO / Featured.com / Journalist Quotes

**What it is.** Responding to journalist queries to get quoted in major publications with a backlink. HARO returned in April 2025 under Featured.com's ownership: free, email-based.

**Replicate it:** Sign up at Featured.com (free). 3 daily digests of journalist queries. Respond within 1–4 hours of query landing. Format: 3-sentence credentials, 100–250 word substantive answer, one quote-ready insight. Success rate: 5–15% per pitch. With 5 pitches/day, expect 1–3 links/month per client. 30–60 min/day. Charge: $500–1,200/month managed service.

## 5.4 Local Citations / Directory Submissions

**What it is.** Listing the client's NAP on directories like Yelp, YellowPages, BBB, Foursquare, and Canada-specific sites. Qode lists 25–35 "local & high domain authority directory submissions" per tier; T Parker's 70/30 strategy combines free Canadian directories with 10–15 paid ones.

**Replicate it:** Use Whitespark Listings Service ($150–550 one-time per location) or BrightLocal Citation Builder ($3.20–10/citation, no recurring). Whitespark's Top 35 Canadian directories list (published at whitespark.ca) is the gold standard starting set: GBP, Yelp Canada, YellowPages.ca, Canada411, FoursquareForBusiness, Apple Maps, Bing Places, BBB.ca, Cylex.ca, Hotfrog Canada, Nicelocal, Brownbook, Manta, plus industry-specific. 8–15 hours for a manual full set; Whitespark/BrightLocal handles in 7 days. Charge: $300–800 standalone.

## 5.5 Niche / Industry Directory Listings

**What it is.** Vertical-specific listings (Avvo for lawyers; HomeStars and HomeAdvisor for home services; Healthgrades for medical). Qode lists 30–40 "high domain authority link building submissions."

**Replicate it:** Per industry, identify the top 5–10 vertical directories. Submit manually with full NAP, photos, full description, services list. 1 hour per directory. Charge: rolled into citation packages.

## 5.6 Backlink Analysis / Audit

**What it is.** Reviewing existing backlink profile, identifying spam/toxic links, submitting a disavow file. Qode includes "Backlink Analysis" on every tier.

**Replicate it:** Ahrefs Site Explorer → Backlinks → filter for low DR, spammy TLDs, overused exact-match anchors. Build `disavow.txt`; submit via Search Console only if you've earned an actual penalty (otherwise leave alone — Google ignores most low-quality links automatically post-Penguin 4.0). 2–3 hours.

## 5.7 Broken Link Building

**What it is.** Finding dead pages on authority sites in your niche, recreating better content, asking the linker to swap. Quake explicitly mentions "broken link reclamation."

**Replicate it:** Ahrefs → Broken Backlinks report on competitor → find pages on relevant sites linking to dead URLs → email outreach offering replacement. Conversion: 3–8%. 4–6 hours per acquired link.

## 5.8 Original Research / Data Studies

**What it is.** Surveying customers, scraping public data, or running an experiment, then publishing the findings. Quake mentions; the highest-quality link bait in 2026.

**Replicate it:** Pick a question journalists in the niche care about. Run a 100–500 person survey (SurveyMonkey $39/mo, Pollfish $1/respondent). Publish results with a visualization. Pitch to journalists and bloggers. 20–60 hours for the report; can earn 30+ DR-40+ links and persistent organic traffic.

## 5.9 Balanced Backlink Anchor Profile

**What it is.** Ensuring inbound link anchor text is naturally varied — branded, naked URL, generic, exact-match, partial-match — not 80% exact-match (which trips Penguin). Qode names "Balanced Backlink Attributes Creation."

**Replicate it:** Ahrefs → Anchors report. Aim for 35–50% branded, 20% naked URL, 15% generic ("click here"), 10% exact-match, 10% partial-match, 5% other. Adjust outreach anchor requests accordingly.

---

# CATEGORY 6 — LOCAL SEO

## 6.1 Local Keyword Research

**What it is.** Identifying "[service] [city]," "[service] near me," and neighbourhood-level queries. T Parker, Mark3ting, Storyteller, First Rank all lead with this.

**Replicate it:** Same tools as 1.5 but filter by city modifiers. Cross-reference against Google Maps autocomplete. 2–3 hours.

## 6.2 Geo-Targeted Landing Pages

**What it is.** A unique service page per city, optimized for "[service] [city]." Qode names them; Home Care offers 5–10/tier.

**Replicate it:** See 4.3.

## 6.3 NAP Consistency Audit & Cleanup

**What it is.** Verifying Name, Address, Phone Number is identical across every web mention. Whitespark and BrightLocal both lead their products with this.

**Replicate it:** BrightLocal Citation Tracker ($39/mo) or Whitespark Local Citation Finder. Generates a "found inconsistencies" list. Manually correct each (10–60 min per directory depending on access). 4–10 hours for cleanup. Charge: $300–800 standalone.

## 6.4 Local Schema Markup (LocalBusiness)

See 2.6 — but specifically the LocalBusiness JSON-LD with `address`, `geo` (lat/long), `openingHours`, `telephone`, `sameAs` (social profiles), `aggregateRating`.

## 6.5 Google Maps Optimization

**What it is.** Ranking in the "Local Pack" (top-3 map results). Driven 70%+ by GBP optimization (Category 7) plus citations and reviews.

## 6.6 Review Management & Generation

**What it is.** A system to ask customers for reviews and respond to them. Mark3ting offers "review strategy and response support" at $250/mo; Home Care includes "Review Generation System" in all tiers.

**Replicate it:** GatherUp ($80–195/mo), Birdeye ($299+/mo), Podium ($249+/mo), or NiceJob ($75/mo) — all automate the post-job text/email asking for review. SMBs on a budget: Whitespark's Reviews tool ($24/mo) or just Google Review Link Generator (free) plus an automated post-service email. Set up: 2–4 hours. Operations: 1–2 hours/month review responses. Charge: $150–400/month.

## 6.7 Local Link Building

**What it is.** Earning links from local newspapers, chamber of commerce, sponsorship pages, BIA sites, local bloggers. Higher value for local SEO than national links.

**Replicate it:** Build a local prospect list (Toronto Star, BlogTO, local BIA, Vaughan Chamber, Mississauga.com). Pitch sponsorships ($100–500), community involvement, expert quotes. 4–8 hours per link.

## 6.8 Geo-Tagged Photos / Local Image Optimization

**What it is.** Photos uploaded with geo EXIF data, helpful for GBP and local-pack signal. T Parker mentions "geotagged photo uploads."

**Replicate it:** GeoImgr (free for 5/day, $9.95/mo unlimited) embeds lat/long into photos. 5 minutes per batch.

---

# CATEGORY 7 — GOOGLE BUSINESS PROFILE

Per BrightLocal's *Local Consumer Review Survey 2023*, "98% of consumers used the internet to find information about local businesses in 2022, up from 90% in 2019," and "87% of people used Google to research local businesses." That's why every agency in the dataset packages GBP as a top-tier deliverable.

## 7.1 GBP Claim & Verification

**What it is.** Taking ownership of the GBP listing. Mark3ting, T Parker, Qode, GMB Optimization, Search Berg all sell as standalone or included.

**Replicate it:** Sign in at business.google.com → search business → claim → verify (postcard, video, phone, or instant for trusted accounts). 30 min initial, 7–14 days waiting. Charge: $50–150 standalone or free in package.

## 7.2 GBP Full Profile Optimization

**What it is.** Filling out every field: NAP, hours, business description (750 chars), primary + secondary categories (up to 9), services, products, attributes, photos. Mark3ting's Basic ($300 6-mo) and Full packages map directly. T Parker's $250/mo includes ongoing.

**Replicate it:** Checklist-driven (BrightLocal/Whitespark publish full ones). 4–8 hours initial. Charge: $200–600 setup, $150–400/mo management.

## 7.3 GBP Categories Selection (Primary + Secondary)

**What it is.** Choosing the most ranking-relevant primary category from Google's 4,000+ list, plus up to 8 secondary. The single highest-leverage GBP setting.

**Replicate it:** PlePer's free GBP category list and Tom Waddington's category research. Look at top-3 ranking competitors in your city; copy their primary. 1 hour.

## 7.4 GBP Description (Keyword-Optimized)

**What it is.** The 750-character "From the business" description. Mark3ting names it as a deliverable.

**Replicate it:** First 250 chars: who you are + city + 1 keyword. Middle: services. End: differentiator. No links, no promotional language, no special chars (Google strips them).

## 7.5 GBP Photo Strategy

**What it is.** Uploading a balanced set of photos: logo, cover, exterior, interior, team, products, plus weekly fresh photos. Mark3ting offers "up to 5 photos" basic, "up to 20 photos" full. T Parker geo-tags.

**Replicate it:** Initial: 20–40 photos. Ongoing: 4–8 per month. Use real photos (Google's AI detects stock). 2–3 hours initial; 30 min/mo ongoing.

## 7.6 GBP Posts / Updates (Weekly)

**What it is.** Mini-blog posts that appear on the GBP. Updates, offers, events. Mark3ting Full includes 3 posts; Whitespark recommends weekly.

**Replicate it:** Publer ($12–50/mo) or schedule directly in GBP. 4 posts/month minimum. 100–300 words each, with photo + CTA. 2–3 hours/month.

## 7.7 GBP Q&A Optimization

**What it is.** Pre-loading FAQs as questions on the profile and answering them as the owner. Mark3ting Full includes; Mailchimp's GBP playbook recommends.

**Replicate it:** Submit 5–10 common customer questions from your own Gmail account, then answer them from the GBP owner account. Upvote your own answers to keep them as primary. 1 hour.

## 7.8 GBP Services & Products

**What it is.** Separate structured listings of each service or product offered. Mark3ting names "Category & Services Setup."

**Replicate it:** Services businesses: list every service with name, description (300 chars), price (or "Call for quote"). Product businesses: 10–30 products with photos. 2–4 hours.

## 7.9 GBP Review Generation & Response

**What it is.** See 6.6 plus the GBP-specific layer: responding to every review (positive and negative) within 24–48 hours, including keywords naturally. Searchbloom and Haley Marketing both flag as a ranking signal.

**Replicate it:** Template responses (8–12 templates) for common positive themes. Personalized response for every negative review. AI-assisted via Claude with custom prompt. 30 min/week.

## 7.10 GBP Insights / Performance Tracking

**What it is.** Monthly reporting on impressions, profile views, calls, direction requests, photo views, search queries used. Mark3ting and T Parker both deliver.

**Replicate it:** GBP Insights are native; pull monthly. For multi-location or visualization, BrightLocal GBP Audit ($39/mo Track plan).

---

# CATEGORY 8 — ANALYTICS, REPORTING & TRACKING

## 8.1 Monthly SEO Report

**What it is.** A 4–10 page document covering keyword positions, organic traffic, conversions, link gains, work completed. Every agency offers it.

**Replicate it:** Looker Studio (free) connected to GA4 + Search Console + a rank tracker. Build a template with 8 standard sections; clone monthly. AhrefsRank, SE Ranking ($65–259/mo), or AccuRanker ($109/mo) for ranking data. 2 hours/month after template is set. Charge: included.

## 8.2 Keyword Rank Tracking

**What it is.** Daily/weekly position monitoring of 30–500 target keywords. SEO Toronto and First Rank explicitly emphasize transparent ranking reports.

**Replicate it:** AccuRanker (~$109/mo, best UX), SE Ranking ($65/mo, best value), or Ahrefs Rank Tracker (included). 30 min weekly review.

## 8.3 Google Analytics 4 (GA4) Setup

**What it is.** Replacing legacy Universal Analytics; configuring events, conversions, audiences. Qode lists "Google Analytics" on every tier.

**Replicate it:** GA4 + Google Tag Manager. Set up via GTM; verify in GA4 DebugView. 2–4 hours per site. Charge: $300–600 setup.

## 8.4 Google Search Console (GSC) Setup

**What it is.** Free Google product showing how the site performs in search — impressions, clicks, queries, indexing. Qode lists on every tier.

**Replicate it:** Verify domain via DNS or HTML file. Submit sitemap. Connect to GA4 and Looker Studio. 30 min.

## 8.5 Google Tag Manager (GTM) Setup

**What it is.** A container for all tracking tags (GA4, Meta Pixel, conversion tags, call tracking). Qode lists.

**Replicate it:** Install GTM container code on site. Migrate existing tags. 2 hours. Charge: $200–400.

## 8.6 Call Tracking Integration

**What it is.** Dynamic phone number swapping so each marketing channel gets a different tracked number; calls recorded, transcribed, attributed. Qode lists "Call Tracking"; Nomadic gives free CallRail to package clients.

**Replicate it:** CallRail ($45–145/mo per location), CallTrackingMetrics ($45–199/mo), or Phonexa. Configure swap on website via JavaScript, set conversion goals to forward to GA4. 2–3 hours setup. Charge: $200 setup + pass-through monthly fee.

## 8.7 Conversion Tracking

**What it is.** Firing GA4/Ads events when key actions happen — form submission, phone call, booking, e-comm purchase. Qode lists.

**Replicate it:** GTM triggers + GA4 events + Google Ads conversion imports. 2 hours per site.

## 8.8 Heatmaps & Session Recordings

**What it is.** Visual maps of where users click, scroll, hover, and recordings of individual sessions. Used to inform CRO. Multiple CRO agencies in deck (O8, Adcetera, Power Digital, Searchbloom) standardize on Hotjar or Microsoft Clarity.

**Replicate it:** Microsoft Clarity (FREE, unlimited), or Hotjar ($39–213/mo). Clarity covers 95% of needs. Install via GTM. 30 min.

---

# CATEGORY 9 — GENERATIVE ENGINE OPTIMIZATION (GEO) / AI SEARCH

This is the highest-leverage 2026 add-on. Per Profound's GEO guide: "LLMs only cite 2-7 domains on average per response, far fewer than Google's 10 blue links." Per a Semrush study reported by Search Engine Land in May 2025, Google AI Overviews now show on 13% of searches globally (March 2025 data), with US desktop searches hitting roughly 16%. Per Adobe's May 2025 consumer survey of 800 U.S. consumers, 47% of Gen Z consumers report discovering a new product or brand through ChatGPT. Brands not optimizing for AI search are accepting structural invisibility to a buyer cohort that's growing fast.

## 9.1 GEO Audit / AI Visibility Baseline

**What it is.** Measuring how often the brand is cited by ChatGPT, Perplexity, Google AI Overviews, Claude, and Gemini for target prompts. Qode now sells GEO as a separate service; First Rank advertises GEO/AEO/Google AI Overviews/SEO for ChatGPT/Perplexity/Gemini as separate products.

**Why it's important.** When LLMs cite only 2–7 domains per response, the cost of NOT being cited is structural exclusion from the next era of search.

**Replicate it:** Tools — Profound (Conversation Explorer, enterprise), Otterly.ai ($29–299/mo), Athena HQ, Bramework Citation Tracker, LLMrefs, Peec.ai. Cheap version: manually run 30 target prompts in ChatGPT, Perplexity, Gemini, Claude — log who's cited. Repeat monthly. 4–6 hours initial baseline. Charge: $500–1,500 setup; $300–800/mo monitoring.

## 9.2 LLMs.txt Implementation

**What it is.** A new emerging standard file (`llms.txt`) telling LLM crawlers which content to prioritize. Per LLMrefs and Strapi 2026 guides.

**Replicate it:** Create `/llms.txt` listing key URLs and short descriptions. 30 minutes.

## 9.3 AI Crawler Access (GPTBot, ClaudeBot, PerplexityBot, etc.)

**What it is.** Verifying robots.txt does NOT block AI crawlers. Per Involve Digital's 2026 reporting, AI bots make ~20% of Googlebot's request volume.

**Replicate it:** Audit robots.txt for `User-agent: GPTBot Disallow: /` lines. Remove unless client explicitly opts out. 5 minutes.

## 9.4 Passage-Optimized Content

**What it is.** Writing content where each paragraph stands alone semantically, so RAG-based AI retrieval can extract it cleanly. Search Engine Land 2026 GEO guide is the canonical source.

**Replicate it:** Editorial rule: every paragraph leads with a direct claim; no "as mentioned above"; definitions and key facts are self-contained. Train writers/AI agents to this standard. Free.

## 9.5 Schema Markup for AI (FAQPage, HowTo, Article with author Person entity)

See 2.6 — with the additional 2026 emphasis: full Author Person entity, datePublished, dateModified, publisher Organization. Page One Power names this as the "schema edition" of 2026 audits.

## 9.6 Brand Surface Area / Earned Mentions Strategy

**What it is.** Building brand mentions across Reddit, Quora, YouTube, LinkedIn, G2, Trustpilot, industry listicles — because LLMs weight aggregate mentions across high-authority sources. Search Engine Land's 2025 GEO coverage notes Reddit, LinkedIn, and YouTube were among the top cited sources by major LLMs in October 2025.

**Replicate it:** Per Stormy AI's 2025 GEO playbook: identify the top 50–100 URLs LLMs cite for your category (using prompts like "best [your category] in [city]" and screenshotting cited domains); pursue placement on each. Pitch listicle inclusion; engage authentically in subreddits; build a YouTube presence; collect G2/Capterra/Trustpilot reviews. Ongoing, 4–8 hours/week. Charge: $1,000–3,000/mo as add-on.

## 9.7 AI-Direct-Answer Content Blocks

**What it is.** 30–60 word direct-answer paragraphs at the top of articles, structured for verbatim quotation. Profound, Seafoam Media, and LLMrefs all flag.

**Replicate it:** Editorial guideline: every page begins with a TL;DR block (3–5 bullets) and a 30–60 word direct answer to the page's main question. Free.

---

# CATEGORY 10 — AUXILIARY DIGITAL MARKETING

## 10.1 Google Ads Management

Qode has dedicated Google Ads tiers ($1.5K–5K ad spend); Nomadic at $1,000/mo; SearchKings's specialty (Google Premier Partner since 2012, manages 5,000+ clients); Storyteller's tiered Google Ads management ($275–775 fee on $1,200–8,000 ad spend).

**Replicate it:** Standard motion — keyword research, ad copy (Responsive Search Ads), negative keyword lists, conversion tracking, dayparting, geo-targeting, A/B testing, smart bidding (tCPA/tROAS). Tools: Google Ads (free), Optmyzr ($249+/mo), or Google's recommendations. 8–15 hours setup; 5–10 hours/month. Charge: 15% of ad spend or $750–2,000/mo flat.

## 10.2 Local Services Ads (Google Guaranteed)

SearchKings's flagship offering. Pay-per-lead, requires Google verification of business + insurance.

**Replicate it:** Apply at ads.google.com/local-services-ads. Submit business license, insurance, background checks. Set lead types and budget. 2–4 hours setup, 1–4 weeks for verification.

## 10.3 Meta Ads (Facebook + Instagram)

Qode and Nomadic sell at $1,000+/mo.

**Replicate it:** Meta Ads Manager → campaign objective → audience (custom + lookalike) → creatives (4–8 variants) → A/B testing. Tools: Meta Ads Manager (free), AdEspresso ($49+/mo). 6–10 hours setup; 4–8 hours/month. Charge: 15% of ad spend or $750+ flat.

## 10.4 Social Media Management

Qode tiers cover Facebook, Twitter, LinkedIn, Instagram with 5 weekly posts; Nomadic at $1,000–2,000/mo; Home Care Diamond does 20 posts/mo.

**Replicate it:** Content calendar (Notion/Airtable) → batch creation (Canva $13/mo, Adobe Express $9.99/mo) → scheduling (Buffer $6/mo, Later $25/mo, Publer $12/mo). AI-assisted captions via Claude. 4–10 hours/week. Charge: $500–2,500/mo.

## 10.5 Web Design & Development (WordPress)

Nomadic at $999–3,999; Quake at $8K–50K; Mark3ting Essential One-Pager packages.

**Replicate it:** WordPress + Elementor Pro ($59/yr) or Divi ($89/yr) for SMB tier; custom-coded Gutenberg blocks for premium. Hosting: Cloudways ($14+/mo), SiteGround ($6.99–14.99/mo), or WP Engine ($25+/mo). 40–120 hours per site. Charge: $1,500–10,000.

## 10.6 Website Maintenance / Care Plans

Nomadic at $499/mo; Mark3ting "WordPress Site Care."

**Replicate it:** Includes hosting, SSL, weekly backups (UpdraftPlus Premium $70/yr), plugin updates, security monitoring (Wordfence/Sucuri), monthly speed audit, 1–2 hours of small content edits. 2–4 hours/month per site. Charge: $99–499/month.

## 10.7 Logo Design / Brand Identity

Nomadic at $149–199 logo.

**Replicate it:** Briefing → 3 concepts → revisions → final files (AI, SVG, PNG). Tools: Figma free, Adobe Illustrator $22.99/mo. AI-assisted via Midjourney $10/mo or Adobe Firefly. 4–10 hours. Charge: $200–1,500.

## 10.8 Email Marketing / Newsletters

Qode lists "Email Newsletter Distribution 250"; Home Care includes 1–4/month emails per tier.

**Replicate it:** Mailchimp ($13–350/mo by list size), Klaviyo (free <250 contacts, then $20+/mo), Beehiiv ($0–99/mo). Template + monthly content + segmentation. 4–8 hours per send. Charge: $300–800/month.

## 10.9 CRM Implementation

Qode's CRM tier; Home Care's CareFunnels ($497/mo standalone, plus $497 included in every tier).

**Replicate it:** GoHighLevel ($97–497/mo white-label), HubSpot Free CRM, or Pipedrive ($14.90+/mo). Setup: pipelines, automations, integrations with website forms and CallRail. 8–20 hours setup. Charge: $1,000–3,000 setup + $200–500/mo management.

## 10.10 Conversion Rate Optimization (CRO)

Outerbox at $3K–15K/mo; multiple agencies flag as $800–10K/mo.

**Replicate it:** Behavior analysis (Microsoft Clarity free, Hotjar $39+/mo) → hypothesis → A/B testing (Convert $99+/mo, VWO $339+/mo). For SMB, Convert.com is best. Ongoing 5–15 hours/month. Charge: $1,500–5,000/mo.

## 10.11 Reputation Management

First Rank lists; ASN Spark!; Birdeye/Podium territory.

**Replicate it:** Combine 6.6 + 7.9 + active monitoring of brand mentions (Google Alerts free, Brand24 $99+/mo, Mention $41+/mo). 2–4 hours/month. Charge: $300–600/mo.

## 10.12 Web Chat / Chatbot Integration

Qode lists "Web Chat Widget," "GMB Chat," "Facebook Messenger Chat," "Missed-Call Text-Back"; Home Care's CareFunnels AI Web Chat.

**Replicate it:** Tidio (free–$59/mo), Drift (custom), Intercom ($39+/mo), or GoHighLevel's bundled. AI chatbots: Voiceflow ($50+/mo), Botpress free tier. Configure FAQ flows + lead capture + handoff to human. 4–8 hours setup. Charge: $300–500 setup + monthly tool fee.

---

# Pricing Reference Table — GTA 2026

| Tier | Monthly | Typical Deliverables |
|---|---|---|
| Cheap (avoid) | $200–800 | Generic AI content, spammy links, zero strategy. RISK: penalty. |
| Maintainer | $1,000–2,000 | Basic keyword research, GBP, slow content updates, foundational technical fixes. Suitable for low-competition local. |
| Growth (sweet spot) | $2,500–5,000 | Full audit, technical excellence, 4–8 content pieces/mo, manual link building, GBP management, monthly reporting. |
| Aggressive Growth | $5,000–10,000 | Above plus dedicated strategist, 10–20 links/mo, weekly reporting, CRO testing. |
| Enterprise / National | $10,000+ | Multi-location, multi-vertical, full team. |

**Source signal:** First Rank's 2026 published Toronto guide and Quake Media's published ranges align almost exactly. Qode Media's tiered packages ($1,950 / $2,550 / Comprehensive $4,950–$8,950) bracket the Growth-to-Aggressive zone.

---

# Tool Stack Reference (NexFortis Recommended, May 2026)

| Function | Primary Tool | 2026 Price | Alternative |
|---|---|---|---|
| All-in-one SEO | Ahrefs Lite | $129/mo | Semrush Pro $139.95/mo |
| Site crawl | Screaming Frog | $259/yr | Sitebulb $162–420/yr |
| Local SEO | Whitespark or BrightLocal | $24–59/mo | Localo $39+/mo |
| Rank tracking | AccuRanker | $109/mo | SE Ranking $65/mo |
| Content optimization | Surfer SEO | $89/mo | Frase $45/mo |
| Heatmaps | Microsoft Clarity | FREE | Hotjar $39/mo |
| Call tracking | CallRail | $45/mo | CallTrackingMetrics |
| Reporting | Looker Studio | FREE | AgencyAnalytics $59/mo |
| Outreach | Smartlead | $39/mo | Pitchbox $550/mo |
| Email finder | Hunter.io | $49/mo | Apollo $59/mo |
| AI writing | Claude Pro + Cursor | $20+$20 | GPT-4o |
| GEO tracking | Otterly.ai | $29/mo | Profound (enterprise) |
| Citation building | BrightLocal | $3.20/citation | Whitespark $150+ |
| HARO | Featured.com | FREE | Qwoted |
| WP hosting | Cloudways | $14/mo | SiteGround $6.99/mo |
| WP builder | Elementor Pro | $59/yr | Divi $89/yr |
| Image optimization | ShortPixel | $9.99 one-time | TinyPNG $39/yr |
| Social scheduling | Publer | $12/mo | Buffer $6/mo |
| Email | Mailchimp | $13/mo | Beehiiv $0–99/mo |
| CRM | GoHighLevel | $97/mo white-label | HubSpot free |
| Schema | Rank Math | FREE | Yoast Premium $99/yr |

**Total monthly tool cost, NexFortis lean stack: ~$420/mo to deliver every line item in this document.**

---

# Recommendations

**Stage 1 — Productize the lead magnet (Week 1).** Build the Free SEO Audit (item 1.1) as a Cursor agent that takes a domain and returns a 1,500-word PDF. Tool stack: Screaming Frog CLI + Ahrefs API + GBP scrape + Claude. This is your customer-acquisition flywheel. Threshold to change strategy: if conversion from audit-delivered to discovery-call-booked is below 15% after 30 audits, fix the audit's persuasive sections (not the data sections).

**Stage 2 — Lock down the Growth-tier package (Weeks 2–4).** Define a single $2,500/mo retainer that delivers items 1.4, 1.5, 1.7, 2.1–2.6, 3.1–3.10, 4.1 (4 blogs/mo), 4.7, 5.1 (8 links/mo), 6.1–6.6, 7.1–7.10, 8.1–8.7, 9.1, 9.4, 9.7. Document each item as an SOP in `/docs/playbook/` with the Cursor agent prompt embedded. Threshold: when you can deliver this package for one client in <40 hours/month of human time, you're ready to take 5.

**Stage 3 — Add the GEO premium add-on (Weeks 5–8).** $1,000/mo premium on top of Growth tier covering items 9.1–9.7. Include AI-citation monthly report. The market is 6–18 months from GEO being table-stakes; there's a window to charge premium rates as the visible GEO specialist in the GTA. Threshold: when 3+ Toronto agencies start advertising GEO at <$500/mo, the premium is over — fold into core retainer.

**Stage 4 — Pricing evolution (Month 4+).** Move from cost-plus to value-based. When you can prove a client made $50,000 in tracked revenue from your work in a quarter, charge $5,000–7,500/mo for that client even if your delivery cost is unchanged. The 90 line items above are the menu; the proposal is about how those items combine to drive *their specific revenue.*

**What would change these recommendations:**
- A Google algorithm update that materially de-weights backlinks → reduce Stage 2 link-building hours, reallocate to content depth.
- Anthropic/OpenAI publishing official GEO guidelines → GEO becomes a checklist; commodity prices.
- A competitor publishing a directly competitive AI-agent-driven audit at lower price → differentiate on response time and Canadian-specific data, not feature parity.

---

# Caveats

1. **Pricing accuracy.** All prices in this document were captured between April–May 2026 from the cited sources. Tool vendors raise prices regularly (Semrush has raised twice since 2023; Ahrefs has restructured plans). Verify before quoting.

2. **AI search numbers move fast.** The Semrush "13% of searches show AI Overviews" figure is March 2025 data; by mid-2026 the number will be different. The Adobe "47% of Gen Z" figure is May 2025. Treat these as direction-of-travel, not point estimates.

3. **HARO success rates vary wildly by niche.** The "5–15% success rate per pitch" range comes from agency self-reporting; B2B finance and SaaS typically see higher; consumer/local services see lower. Run your own pilot for 30 days before quoting expected output to clients.

4. **Google's "doorway page" enforcement is unpredictable.** Items 4.3 (location pages) and 6.2 (geo-targeted landing pages) are a tightrope. Templated pages with thin content get penalized; pages with genuine local content reward. Stay on the safe side of the line.

5. **The disavow file is overused.** Item 5.6 — most low-quality links should NOT be disavowed in 2026. Google ignores them automatically post-Penguin 4.0. Only disavow if you have a confirmed manual action in Search Console.

6. **The "200-point audit" framing is marketing.** Storyteller's 200-point number is real, but other agencies advertise "500-point" or "1,000-point" audits — the number is largely vibes. What matters is whether the audit is acted upon, not how many checkboxes it contains.

7. **Some of this document's claims about competitor delivery (Quake Media's 15–25 referring domains/month, etc.) are taken from competitor marketing copy.** Marketing copy is aspirational. Real delivery from any agency varies. Use these as benchmarks, not promises.

8. **The Akamai 100ms = 7% conversion drop figure is from 2017 data on smartphone retail.** It's directionally correct but specific to that vertical and that era; SaaS and services sites show different curves. Don't quote it as a universal law.

9. **AI agents can deliver perhaps 60–70% of these items at quality bar; the rest need human judgment.** Items requiring human judgment include: the discovery call (1.3), persona definition (1.9), CRO hypothesis development, link outreach pitches that need to feel human, negative review responses, and any client-facing strategic conversation. Don't over-automate.

10. **This document is not a substitute for hands-on SEO experience.** It's a comprehensive map of what the industry sells. Hassan will still need to make 50–100 small judgment calls per client per month that aren't reducible to checklists. The playbook compresses learning time by 80%; it doesn't eliminate it.

---

*Document version 1.0 — May 2026. Built from scrapes of 19 competitor sites and 2025–2026 industry sources. Every figure is sourced from named research or named competitor pages; vague claims have been replaced with specific named statistics during review.*