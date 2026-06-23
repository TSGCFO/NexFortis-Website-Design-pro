import type { ReactNode } from "react";
import {
  Search,
  FileText,
  Gauge,
  PenTool,
  Link2,
  BarChart3,
  Building2,
  MapPin,
  Star,
  Map,
  Users,
  LineChart,
  Sparkles,
  FileCode,
  Share2,
  Bot,
} from "lucide-react";
import { InlineLink } from "@/components/content/InlineLink";
import { CalloutBox } from "@/components/content/CalloutBox";
import { DM_PILLAR_HREF, DM_PILLAR_LINK_TEXT, getDmSpoke } from "@/lib/internal-links";
import type {
  SourcedStat,
  FeatureItem,
  ProcessStep,
  ComparisonRow,
  FaqItem,
  TestimonialData,
} from "@/components/content/types";
import type { DmSpokeSlug } from "@/lib/internal-links";

// Author identity for the EEAT byline + Person schema. NOTE: title/credibility
// line is a sensible factual default for a founder-led firm — confirm/refine
// with Hassan's exact title and any certifications before scaling further.
export const DM_AUTHOR = {
  name: "Hassan Sadiq",
  title: "Founder & CEO, NexFortis IT Solutions",
};

export type DmSpokeContent = {
  // meta (drives SEO + INV-002/003/004)
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  // schema
  serviceType: string;
  serviceSchemaName: string;
  serviceSchemaDescription: string;
  // body
  introHeading: string;
  intro: ReactNode;
  introCallout?: ReactNode;
  stats: readonly SourcedStat[];
  featuresHeading: string;
  featuresSubtitle?: string;
  features: readonly FeatureItem[];
  processHeading?: string;
  process?: readonly ProcessStep[];
  comparisonHeading?: string;
  comparison?: readonly ComparisonRow[];
  pricingHeading?: string;
  pricing?: { fromLabel: string; note: ReactNode };
  faq: readonly FaqItem[];
  testimonial?: TestimonialData;
  authorNote: ReactNode;
  ctaHeading: string;
  ctaSubtext: string;
};

// Canonical sibling links (published spokes only) reused inside prose so anchor
// text always matches the registry.
const localSeo = getDmSpoke("local-seo");
const seo = getDmSpoke("seo");
const geo = getDmSpoke("geo-ai-search");
const linkBuilding = getDmSpoke("link-building");
const contentMarketing = getDmSpoke("content-marketing");

// Partial: only published spokes have content + a page yet. The template guards
// against a missing entry, and getPublishedSpokes() keeps the cluster from ever
// linking a slug that has no content.
export const DM_SPOKE_CONTENT: Partial<Record<DmSpokeSlug, DmSpokeContent>> = {
  // ---------------------------------------------------------------- SEO ----
  seo: {
    metaTitle: "SEO Services in Canada",
    metaDescription:
      "Canadian SEO company: technical SEO, on-page, content, and link building. Founder-led, month-to-month, built to rank and convert. Free SEO audit.",
    h1: "SEO Services for Canadian Businesses",
    heroSubtitle:
      "A Canadian SEO company that turns organic search into a dependable source of leads and revenue — technical SEO, on-page, content, and link building, run as one senior-led campaign.",
    serviceType: "Search Engine Optimization",
    serviceSchemaName: "SEO Services",
    serviceSchemaDescription:
      "Search engine optimization for Canadian businesses — keyword research, technical SEO, on-page optimization, content, and link building, delivered as one founder-led campaign.",
    introHeading: "What NexFortis SEO services include",
    intro: (
      <>
        <p>
          NexFortis is a Canadian <strong>SEO company</strong> that helps business owners turn
          organic search into a dependable source of leads and revenue. Our SEO services cover the
          full picture &mdash; technical SEO, on-page SEO, keyword research, content, and{" "}
          <InlineLink href={linkBuilding.href}>{linkBuilding.linkText}</InlineLink> &mdash; run as one
          ongoing campaign and the engine under our{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>, not a checklist of
          one-off fixes.
        </p>
        <p>
          Search engine optimization earns visibility in Google and Bing for the terms your customers
          actually search, and ranking near the top is where the leads are. Professional SEO services
          are not a one-off task: search results shift, competitors keep publishing, and Google keeps
          refining how it ranks pages. As a full-service SEO agency, we run these components as one
          connected SEO service so every part reinforces the others instead of working in isolation.
        </p>
        <p>
          As a Canadian-based SEO company, we understand how Canadian buyers search, how the Greater
          Toronto Area market behaves, and where the real competition sits in your industry. Every
          engagement is led by a senior consultant &mdash; never handed off to a junior &mdash; and
          judged on the metrics that move your business: organic traffic, conversions, and revenue,
          not vanity numbers. If you also serve a defined area, we run{" "}
          <InlineLink href={localSeo.href}>{localSeo.linkText}</InlineLink> alongside it so you win
          the map results too.
        </p>
      </>
    ),
    introCallout: (
      <CalloutBox>
        Our SEO services fit Canadian businesses ready to invest in sustainable organic growth
        &mdash; small and mid-sized firms competing with larger brands, ecommerce retailers whose
        revenue depends on organic traffic, service businesses that want to win local search, and
        in-house teams that want an experienced SEO consultant to accelerate what they have started.
      </CalloutBox>
    ),
    stats: [
      {
        value: "≈86%",
        label: "of Canadian search happens on Google — the board you have to win.",
        sourceName: "Statcounter Global Stats (Canada)",
        sourceUrl: "https://gs.statcounter.com/search-engine-market-share/all/canada",
      },
      {
        value: "≈40%",
        label: "of clicks go to the #1 organic result, dropping sharply down the page.",
        sourceName: "FirstPageSage, 2026 Google CTR study",
        sourceUrl:
          "https://firstpagesage.com/reports/google-click-through-rates-ctrs-by-ranking-position/",
      },
      {
        value: "48%",
        label: "of mobile sites pass all three Core Web Vitals — so speed is still an edge.",
        sourceName: "2025 Web Almanac, HTTP Archive",
        sourceUrl: "https://almanac.httparchive.org/en/2025/performance",
      },
    ],
    featuresHeading: "Our SEO services",
    featuresSubtitle:
      "We deliver the complete range of SEO services under one roof — not just a handful of title tags.",
    features: [
      {
        icon: Search,
        title: "Keyword research & strategy",
        description:
          "We identify the high-intent terms your customers use, map each to the right page, and prioritize the searches with real commercial intent — grounded in real Canadian search data, not guesswork.",
      },
      {
        icon: FileText,
        title: "On-page SEO",
        description:
          "Titles, meta descriptions, heading structure, internal linking, and content optimized so each page sends Google one clear signal about what it answers — and reads well for people.",
      },
      {
        icon: Gauge,
        title: "Technical SEO",
        description:
          "Our technical SEO services start with a thorough technical SEO audit — crawlability, indexing, site speed, schema, and mobile usability — then fix the foundational issues that cap rankings regardless of content quality.",
      },
      {
        icon: PenTool,
        title: "Content that earns rankings",
        description: (
          <>
            Search-driven{" "}
            <InlineLink href={contentMarketing.href}>{contentMarketing.linkText}</InlineLink> that
            targets buyer-intent topics and builds topical authority — and we revive existing pages
            that have lost ground.
          </>
        ),
      },
      {
        icon: Link2,
        title: "Link building & off-page SEO",
        description: (
          <>
            White-hat{" "}
            <InlineLink href={linkBuilding.href}>{linkBuilding.linkText}</InlineLink> that earns
            quality, relevant backlinks and audits your profile to disavow toxic links — never bought
            links or shortcuts that risk a penalty.
          </>
        ),
      },
      {
        icon: BarChart3,
        title: "Ecommerce SEO",
        description:
          "As an ecommerce SEO agency, we optimize product pages, category architecture, and structured data so online retailers capture high-converting search traffic at scale.",
      },
    ],
    processHeading: "Our SEO process",
    process: [
      {
        step: "01",
        title: "Free SEO audit",
        description:
          "Every engagement begins with a no-obligation review of your rankings, technical SEO health, on-page gaps, backlink profile, and keyword positioning to set a clear baseline.",
      },
      {
        step: "02",
        title: "Strategy",
        description:
          "The audit informs a custom strategy — target keywords, content priorities, technical fixes, and link opportunities — mapped to your business goals on a realistic roadmap.",
      },
      {
        step: "03",
        title: "Execution",
        description:
          "We implement in priority order: on-page optimization, technical corrections, content, and link building — early wins first, durable authority over time.",
      },
      {
        step: "04",
        title: "Reporting & optimization",
        description:
          "Transparent monthly reporting on organic traffic, keyword movement, and conversions, with the plan adjusted as search results and algorithms change. The same senior team does the work end-to-end.",
      },
    ],
    comparisonHeading: "Why choose NexFortis for SEO",
    comparison: [
      { feature: "Who does the work", us: "A senior SEO consultant, founder-led end-to-end", them: "A rotating junior account manager" },
      { feature: "Keyword targeting", us: "Mapped to buyer intent and revenue", them: "Chased by search volume alone" },
      { feature: "Technical SEO", us: "Core Web Vitals and indexing fixed", them: "Frequently out of scope" },
      { feature: "Content & links", us: "Research-led content and white-hat links", them: "Thin filler and risky link buys" },
      { feature: "Reporting", us: "Tied to leads and revenue", them: "Ranking screenshots" },
      { feature: "Commitment", us: "Month-to-month — no lock-in", them: "Locked 6–12 month contracts" },
    ],
    pricingHeading: "SEO pricing after a free audit",
    pricing: {
      fromLabel: "Retainers scaled to your market",
      note: (
        <>
          <p className="mb-4">
            We don&rsquo;t publish fixed SEO prices, because no two websites or markets are the same.
            After your free SEO audit we scope the work to your site &mdash; its current health, the
            number and competitiveness of your target keywords, the technical work required, and the
            volume of content and link building involved.
          </p>
          <p>
            Most SEO engagements run as a monthly retainer, reflecting the ongoing nature of search
            engine optimization. You get a fixed monthly scope, transparent reporting, and no
            long-term lock-in &mdash; and you&rsquo;ll know exactly what you&rsquo;re paying for, and
            why, before you commit.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "How much do SEO services cost in Canada?",
        answer:
          "SEO pricing in Canada varies widely by competitiveness and scope, which is why we scope every engagement after a free audit rather than quoting a one-size-fits-all price. Like most providers, NexFortis works on a monthly retainer sized to your goals.",
      },
      {
        question: "How long does SEO take to work?",
        answer:
          "SEO is a months-not-weeks discipline. Most sites see meaningful movement within the first several months, depending on competition, your starting technical health, and your backlink profile. We set realistic expectations up front rather than promising overnight results — anyone guaranteeing page one in 30 days is selling a shortcut that tends to end in a penalty.",
      },
      {
        question: "What is the difference between an SEO company and an SEO consultant?",
        answer:
          "An SEO company provides a full team across technical SEO, content, and link building; an SEO consultant typically advises on strategy. NexFortis offers both — a dedicated consultant backed by a senior execution team of SEO specialists.",
      },
      {
        question: "Should I do SEO myself, or hire an SEO company?",
        answer:
          "AI tools and DIY guides can handle the basics, but competitive rankings still need experienced judgement across technical SEO, content, and links — plus the time to do the work consistently. As AI search grows, that strategy work matters more, not less.",
      },
      {
        question: "What does the free SEO audit include?",
        answer:
          "Your technical SEO health, crawlability and indexing, on-page gaps, current keyword rankings, backlink profile, and a competitive overview of your search landscape.",
      },
      {
        question: "Can you help if a Google update hurt my rankings?",
        answer:
          "Yes. Our audit identifies the likely cause of a drop — content quality, backlink issues, or technical SEO problems — and we build a recovery plan accordingly.",
      },
      {
        question: "Do you provide SEO services across Canada?",
        answer:
          "Yes — NexFortis works with businesses across Canada, from local service providers in a single city to national ecommerce brands. We are a Canadian SEO agency, and SEO Canada-wide is exactly what we do.",
      },
    ],
    authorNote: (
      <p>
        Your SEO is led personally by Hassan Sadiq, NexFortis Founder and CEO &mdash; never handed
        off to a junior or an offshore content mill. Hassan brings 15+ years in enterprise
        technology, cloud, and digital transformation for Canadian organizations, and NexFortis is a
        certified Microsoft Solutions Partner. A small senior team of SEO experts and specialists
        owns your campaign end-to-end, so you get direct access to the people accountable for your
        rankings &mdash; every month, with no layers in between.
      </p>
    ),
    ctaHeading: "Ready to rank for the searches that matter?",
    ctaSubtext:
      "Book a free, no-obligation SEO audit — an honest look at where your site stands and what it will take to grow.",
  },

  // ---------------------------------------------------------- LOCAL SEO ----
  "local-seo": {
    metaTitle: "Local SEO Services in Canada",
    metaDescription:
      "Canadian local SEO company — Google Business Profile, the Map Pack, citations, and reviews. Founder-led, month-to-month. Free local SEO audit.",
    h1: "Local SEO Services for Canadian Businesses",
    heroSubtitle:
      "A Canadian local SEO company that gets you found by nearby customers searching right now — Google Business Profile, the Map Pack, citations, and reviews, run as one senior-led campaign.",
    serviceType: "Local Search Engine Optimization",
    serviceSchemaName: "Local SEO Services",
    serviceSchemaDescription:
      "Local SEO for Canadian businesses — Google Business Profile optimization and management, local citations, Map Pack strategy, reviews, and on-page local optimization, delivered as one founder-led campaign.",
    introHeading: "What NexFortis local SEO services include",
    intro: (
      <>
        <p>
          NexFortis is a Canadian <strong>local SEO company</strong> that helps local business owners
          get found by the customers searching right now, in their city, for what they sell. Our local
          SEO services are built around the outcomes that matter to a local business &mdash; more phone
          calls, more direction requests, and more booked jobs, not vanity rankings.
        </p>
        <p>
          As a local SEO agency, we combine Google Business Profile optimization, local citations, Map
          Pack strategy, reviews, and on-page local optimization into one campaign, run by a senior
          consultant rather than handed off to a junior. Local SEO earns visibility in the searches that
          carry local intent &mdash; &ldquo;near me&rdquo; queries, city-specific terms, and the Google
          Map Pack that sits above the regular results.
        </p>
        <p>
          A complete local SEO service is more than a one-off Google Business Profile tweak: Google
          weighs your profile signals, citation consistency, reviews, and your site&rsquo;s local
          relevance together, so we run them as one connected service. Whether you need a local SEO
          consultant to guide your in-house team or a full-service local SEO agency end to end, we scope
          the engagement to your market and goals &mdash; and run it alongside your broader{" "}
          <InlineLink href={seo.href}>{seo.linkText}</InlineLink> and the rest of your{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
      </>
    ),
    introCallout: (
      <CalloutBox>
        Our local SEO services fit Canadian businesses that earn customers locally &mdash; small
        businesses that want competitive local SEO services for small business budgets; brick-and-mortar
        clinics, dental and law offices, restaurants, retailers, and trades; service-area businesses like
        plumbers and electricians; and multi-location brands that need each location ranked and reported
        on independently.
      </CalloutBox>
    ),
    stats: [
      {
        value: "≈46%",
        label: "of all Google searches have local intent — the demand is already there.",
        sourceName: "BrightLocal",
        sourceUrl: "https://www.brightlocal.com/resources/local-seo-statistics/",
      },
      {
        value: "76%",
        label: "of people who search for something nearby visit a business within a day.",
        sourceName: "Backlinko",
        sourceUrl: "https://backlinko.com/local-seo-guide",
      },
      {
        value: "71%",
        label: "of consumers use Google to read local business reviews.",
        sourceName: "BrightLocal Local Consumer Review Survey",
        sourceUrl: "https://www.brightlocal.com/research/local-consumer-review-survey/",
      },
    ],
    featuresHeading: "Our local SEO services",
    featuresSubtitle:
      "The full range of local SEO services under one roof — built to win the Map Pack and the calls behind it.",
    features: [
      {
        icon: Building2,
        title: "Google Business Profile optimization & management",
        description:
          "Your Google Business Profile is the single most influential asset in local search. Our Google Business Profile services cover setup, category selection, and complete optimization — then ongoing Google Business Profile management so it stays accurate, active, and aligned with how Google ranks local results.",
      },
      {
        icon: MapPin,
        title: "Local citations & NAP consistency",
        description:
          "We audit existing citations, correct inconsistent Name, Address, and Phone details across directories and data aggregators, and build authoritative new listings — reducing the conflicting-data issues that suppress rankings.",
      },
      {
        icon: Map,
        title: "Google Map Pack & local rankings",
        description:
          "We build and execute strategies aimed squarely at the Map Pack — the top three local results — through profile signals, citation authority, review velocity, on-page local relevance, and proximity factors, and track your rankings across the areas you serve.",
      },
      {
        icon: Star,
        title: "Reviews & reputation building",
        description: (
          <>
            Reviews are both a ranking signal and a conversion driver. We run compliant review-generation
            strategies and help you monitor and respond, working alongside our{" "}
            <InlineLink href={getDmSpoke("reputation-management").href}>
              {getDmSpoke("reputation-management").linkText}
            </InlineLink>{" "}
            services where a deeper strategy is needed.
          </>
        ),
      },
      {
        icon: Search,
        title: "Near-me & local keyword optimization",
        description:
          "We research the exact local terms your customers use, then optimize your service and location pages, metadata, schema, and internal linking so your site communicates clear geographic relevance — the on-page foundation behind strong local rankings.",
      },
    ],
    processHeading: "Our local SEO process",
    process: [
      {
        step: "01",
        title: "Free local SEO audit",
        description:
          "A no-obligation review of your Google Business Profile, citation health, NAP consistency, current Map Pack rankings, on-page local optimization, and review profile — an honest baseline before any investment.",
      },
      {
        step: "02",
        title: "Strategy",
        description:
          "The audit informs a prioritized plan: profile optimization, a citation plan, target local keywords, content for your service and location pages, and a review-generation framework mapped to your goals.",
      },
      {
        step: "03",
        title: "Execution",
        description:
          "Our in-house team optimizes your profile, corrects and builds citations, updates on-page elements and schema, and launches your review strategy. No outsourcing.",
      },
      {
        step: "04",
        title: "Monthly reporting & ongoing management",
        description:
          "Clear, plain-language reporting on Map Pack movement, profile performance (calls, direction requests, website clicks), citation growth, reviews, and local keyword rankings, with continuous optimization.",
      },
    ],
    comparisonHeading: "Why choose NexFortis for local SEO",
    comparison: [
      { feature: "Who does the work", us: "A senior consultant, founder-led end-to-end", them: "A rotating junior account manager" },
      { feature: "Scope", us: "GBP, citations, Map Pack, reviews, on-page as one campaign", them: "A GBP tweak in isolation" },
      { feature: "Local expertise", us: "Canadian, GTA-savvy market knowledge", them: "A generic national playbook" },
      { feature: "Outcomes", us: "Calls, direction requests, booked jobs", them: "Vanity ranking screenshots" },
      { feature: "Commitment", us: "Month-to-month — no lock-in", them: "Locked 6–12 month contracts" },
    ],
    pricingHeading: "Local SEO pricing after a free audit",
    pricing: {
      fromLabel: "Scoped to your market",
      note: (
        <>
          <p className="mb-4">
            We don&rsquo;t publish fixed local SEO prices, because effective local SEO is scoped to your
            market&rsquo;s competitiveness, your number of locations, your current baseline, and your
            goals &mdash; which is why a free local SEO audit comes first.
          </p>
          <p>
            After it, we present clear options matched to the scope of work, with no hidden fees and no
            long-term lock-in &mdash; from project-based Google Business Profile optimization to ongoing
            monthly local SEO management.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "What is included in NexFortis's local SEO service?",
        answer:
          "Our local SEO service includes Google Business Profile optimization and management, citation building and NAP consistency, Map Pack ranking strategy, review generation and reputation management, local keyword research, and on-page optimization for your service and location pages — all backed by monthly reporting.",
      },
      {
        question: "How much do local SEO services cost?",
        answer:
          "Local SEO pricing varies by market competitiveness, number of locations, and scope, which is why we scope every engagement after a free audit rather than quoting a one-size-fits-all price. We structure plans to work for small businesses and scale to multi-location operations.",
      },
      {
        question: "How is a local SEO agency different from a general SEO agency?",
        answer:
          "A local SEO agency specializes in the ranking factors that drive local and map-based visibility — Google Business Profile signals, proximity, citations, and reviews — which differ from the factors behind broad organic rankings. NexFortis does both and connects the two.",
      },
      {
        question: "How long does local SEO take to show results?",
        answer:
          "Local SEO is a months-not-weeks discipline. Timelines depend on your starting point, your market's competitiveness, and your review and citation profile, so we set realistic expectations up front rather than promising a fixed date.",
      },
      {
        question: "Do you offer local SEO services for small businesses?",
        answer:
          "Yes. We scope local SEO services for small business owners so the work — and the pricing — fits your specific situation, focusing first on the changes that move the needle fastest in your local market.",
      },
      {
        question: "Can you manage local SEO for a business with multiple locations?",
        answer:
          "Yes. We manage multi-location local SEO, including individual Google Business Profile management, location-specific pages, and city-level targeting so each location earns and reports its own visibility.",
      },
    ],
    authorNote: (
      <p>
        Your local SEO is led personally by Hassan Sadiq, NexFortis Founder and CEO &mdash; never handed
        off to a junior. Hassan brings 15+ years in enterprise technology, and NexFortis is a certified
        Microsoft Solutions Partner, so the on-page and schema side of local SEO is handled with genuine
        technical depth. A small senior team owns your campaign end-to-end.
      </p>
    ),
    ctaHeading: "Ready to win the Map Pack in your city?",
    ctaSubtext:
      "Book a free, no-obligation local SEO audit — an honest assessment of where your local presence stands and what it will take to grow.",
  },
  "geo-ai-search": {
    metaTitle: "Generative Engine Optimization Services",
    metaDescription:
      "Canadian AI SEO agency for GEO and answer engine optimization — get cited by ChatGPT, Perplexity, Gemini, and Google AI Overviews. Founder-led. Free GEO audit.",
    h1: "Generative Engine Optimization Services for Canadian Businesses",
    heroSubtitle:
      "A Canadian AI SEO agency that gets your business cited inside the AI answers buyers now rely on — entity and schema work, AI-friendly content, and the technical foundations that make you quotable to ChatGPT, Perplexity, Gemini, and Google AI Overviews.",
    serviceType: "Generative Engine Optimization",
    serviceSchemaName: "Generative Engine Optimization Services",
    serviceSchemaDescription:
      "Generative engine optimization (GEO) and answer engine optimization (AEO) for Canadian businesses — entity and schema work, AI-friendly content structuring, and the technical foundations that earn citations in AI-generated answers, delivered as one founder-led campaign.",
    introHeading: "What NexFortis generative engine optimization services include",
    intro: (
      <>
        <p>
          NexFortis is a Canadian <strong>AI SEO agency</strong> that helps business owners get found
          inside the AI answers their customers now rely on. When someone asks ChatGPT, Perplexity,
          Gemini, or Google&rsquo;s AI Overviews to recommend a provider, those tools name a short list of
          businesses &mdash; and generative engine optimization is the work of making sure yours is on it.
        </p>
        <p>
          Generative engine optimization (often shortened to GEO) and the closely related discipline of
          answer engine optimization (AEO) are an emerging field that most agencies still treat as an
          afterthought to traditional search. We treat AI visibility as its own discipline, led by a
          senior consultant rather than handed off to a junior or an offshore content mill. AI engines do
          not simply rank pages; they read, interpret, and synthesize information, then decide which
          sources are trustworthy enough to cite.
        </p>
        <p>
          As a Canadian AI SEO agency, we combine entity and schema work, AI-friendly content structuring,
          and the technical foundations that make your site quotable to large language models into one
          connected campaign &mdash; run alongside your traditional{" "}
          <InlineLink href={seo.href}>{seo.linkText}</InlineLink>,{" "}
          <InlineLink href={contentMarketing.href}>{contentMarketing.linkText}</InlineLink>, and the rest
          of your <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
      </>
    ),
    introCallout: (
      <CalloutBox>
        Our generative engine optimization services fit Canadian businesses whose buyers research with AI
        before they buy &mdash; companies that rank in Google but never appear in AI Overviews or chat
        recommendations; service providers and B2B firms whose customers ask AI tools for shortlists;
        brands that want to protect visibility as search shifts from blue links to AI answers; and teams
        with real expertise that is not yet structured in a way AI engines can recognize and cite.
      </CalloutBox>
    ),
    stats: [
      {
        value: "800M+",
        label: "weekly ChatGPT users — a discovery surface too large to ignore.",
        sourceName: "OpenAI",
        sourceUrl: "https://openai.com/index/the-state-of-enterprise-ai-2025-report/",
      },
      {
        value: "25%",
        label: "projected drop in traditional search volume by 2026 as buyers shift to AI chatbots.",
        sourceName: "Gartner",
        sourceUrl: "https://www.gartner.com/en/newsroom/press-releases/2024-02-19-gartner-predicts-search-engine-volume-will-drop-25-percent-by-2026-due-to-ai-chatbots-and-other-virtual-agents",
      },
      {
        value: "8% vs 15%",
        label: "click-through when an AI summary appears versus when it doesn't — visibility is moving into the answer.",
        sourceName: "Pew Research Center",
        sourceUrl: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
      },
    ],
    featuresHeading: "Our generative engine optimization services",
    featuresSubtitle:
      "The full range of generative engine optimization services under one roof — GEO and AEO, run as one campaign.",
    features: [
      {
        icon: Sparkles,
        title: "Generative engine optimization (GEO)",
        description:
          "The core discipline: making your brand and content the source AI engines pull from when they generate an answer. We identify the prompts your buyers ask, then structure your content, evidence, and entity signals so generative engines treat you as a credible, quotable source.",
      },
      {
        icon: Bot,
        title: "Answer engine optimization (AEO)",
        description:
          "Closely tied to GEO, answer engine optimization targets the direct-answer surfaces — AI Overviews, featured snippets, and conversational responses — by formatting your content as clear, self-contained answers engines can lift cleanly into a reply.",
      },
      {
        icon: Search,
        title: "Visibility across ChatGPT, Perplexity, Gemini & AI Overviews",
        description:
          "We work across the major AI engines rather than optimizing for one, assess how your brand surfaces in each, identify where competitors are cited instead, and build a plan to close the gap.",
      },
      {
        icon: FileCode,
        title: "Entity & schema optimization",
        description:
          "AI engines reason about entities — your business, your people, your services — not just keywords. We strengthen how your brand is defined and connected across the web, and implement structured data so engines can read and trust what you offer.",
      },
      {
        icon: FileText,
        title: "AI-friendly content structuring",
        description:
          "We restructure and create content AI models can parse and cite: clear question-and-answer formatting, definitive statements, logical hierarchy, and supporting evidence — the patterns generative engines reward when they choose what to quote.",
      },
      {
        icon: LineChart,
        title: "AI SEO & ongoing optimization",
        description:
          "Generative engines change constantly, so our AI SEO services apply ai seo optimization as a continuous practice — monitoring how your visibility evolves across engines and refining entities, content, and structure as the models shift.",
      },
    ],
    processHeading: "Our generative engine optimization process",
    process: [
      {
        step: "01",
        title: "Free GEO audit",
        description:
          "A no-obligation review of how your brand surfaces across ChatGPT, Perplexity, Gemini, and Google AI Overviews, how your entity and schema signals read, and where competitors are cited instead of you.",
      },
      {
        step: "02",
        title: "Strategy",
        description:
          "The audit informs a prioritized plan: the buyer questions and prompts to target, the entity and schema work to do, the content to restructure or create, and the engines to focus on first.",
      },
      {
        step: "03",
        title: "Execution",
        description:
          "Our in-house team strengthens entity and schema signals, structures content for AI readability, and builds the evidence and answers generative engines reward. No outsourcing.",
      },
      {
        step: "04",
        title: "Monthly reporting & optimization",
        description:
          "Clear, plain-language reporting on how your AI visibility is changing across engines, where you are being cited, and what we are optimizing next.",
      },
    ],
    comparisonHeading: "Why choose NexFortis for generative engine optimization",
    comparison: [
      { feature: "Discipline", us: "GEO and AEO with their own strategy and reporting", them: "A line item bolted onto SEO" },
      { feature: "Who does the work", us: "A senior consultant, founder-led end-to-end", them: "A rotating junior or a content mill" },
      { feature: "Engines", us: "ChatGPT, Perplexity, Gemini, and AI Overviews", them: "Optimized for one, blind to the rest" },
      { feature: "Foundations", us: "Entity, schema, and structured-data depth", them: "Keyword tweaks only" },
      { feature: "Honesty", us: "No promise of a fixed spot in any AI answer", them: "Guaranteed-placement claims" },
    ],
    pricingHeading: "Generative engine optimization pricing after a free audit",
    pricing: {
      fromLabel: "Scoped to your AI visibility",
      note: (
        <>
          <p className="mb-4">
            We don&rsquo;t publish fixed generative engine optimization prices, because effective GEO is
            scoped to your current visibility in AI answers, your market&rsquo;s competitiveness, the state
            of your entity and schema signals, and your growth goals &mdash; which is why a meaningful
            audit comes first.
          </p>
          <p>
            After your free GEO audit, we present clear options aligned to the scope of work, with no
            hidden fees and no long-term lock-in &mdash; from a focused entity, schema, and
            content-structuring project to ongoing monthly AI SEO optimization across engines.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "What is generative engine optimization?",
        answer:
          "Generative engine optimization (GEO) is the practice of making your brand and content visible inside AI-generated answers — the responses from ChatGPT, Perplexity, Gemini, and Google's AI Overviews. Instead of competing only for a ranking position, GEO works to make your business the source those engines quote, summarize, and recommend.",
      },
      {
        question: "How is generative engine optimization different from SEO?",
        answer:
          "Traditional SEO earns rankings in a list of links; generative engine optimization earns citations and recommendations inside AI answers. The two work best together, but AI engines read, interpret, and synthesize sources rather than just ranking pages — so GEO emphasizes entity clarity, structured data, and content written as clear, quotable answers.",
      },
      {
        question: "What is answer engine optimization?",
        answer:
          "Answer engine optimization (AEO) is a closely related discipline focused on the direct-answer surfaces — AI Overviews, featured snippets, and conversational replies. It formats your content as self-contained answers so engines can lift it cleanly into a response. We deliver GEO and AEO together as one campaign.",
      },
      {
        question: "How much do generative engine optimization services cost?",
        answer:
          "GEO pricing varies by your current AI visibility, market competitiveness, the state of your entity and schema signals, and scope — which is why we scope every engagement after a free audit rather than quoting a one-size-fits-all price, with month-to-month terms.",
      },
      {
        question: "How long does generative engine optimization take to show results?",
        answer:
          "GEO is a months-not-weeks discipline. Timelines depend on your starting visibility, how well your content and entities are already structured, and how competitive your space is in AI answers, so we set realistic expectations rather than promising a fixed date or a guaranteed spot.",
      },
      {
        question: "Do you offer AI SEO services as well as traditional SEO?",
        answer:
          "Yes. Our AI SEO services cover generative engine optimization and answer engine optimization, and they integrate with our traditional SEO so your visibility is strong across both AI answers and classic search results.",
      },
    ],
    authorNote: (
      <p>
        Your campaign is led personally by Hassan Sadiq, NexFortis Founder and CEO &mdash; never handed
        off to a junior. With 15+ years in enterprise technology and as a certified Microsoft Solutions
        Partner, Hassan brings genuine technical depth to the schema, entity, and structured-data side of
        GEO. A small senior team owns your AI-visibility campaign end-to-end.
      </p>
    ),
    ctaHeading: "Want to be the answer AI engines recommend?",
    ctaSubtext:
      "Book a free, no-obligation generative engine optimization audit — an honest look at how AI engines see your business and what it will take to be cited.",
  },
  "content-marketing": {
    metaTitle: "Content Marketing Services in Canada",
    metaDescription:
      "Canadian content marketing agency — strategy, SEO blog writing, web copy, video, and B2B content that builds authority and demand. Founder-led. Free consultation.",
    h1: "Content Marketing Services for Canadian Businesses",
    heroSubtitle:
      "A Canadian content marketing agency that earns attention the honest way — strategy, SEO writing, web copy, video, and B2B content built around real keyword research and a clear commercial goal.",
    serviceType: "Content Marketing",
    serviceSchemaName: "Content Marketing Services",
    serviceSchemaDescription:
      "Content marketing for Canadian businesses — content strategy, SEO blog and article writing, website and landing-page copy, video, distribution, and B2B content, delivered as one founder-led, research-led program.",
    introHeading: "What NexFortis content marketing services include",
    intro: (
      <>
        <p>
          NexFortis is a Canadian <strong>content marketing agency</strong> that helps businesses get
          noticed the honest way &mdash; by creating content their customers actually search for, trust,
          and act on. Our content marketing services focus on results that matter to a business: qualified
          traffic, leads, and customers, not word counts or vanity page views.
        </p>
        <p>
          Content marketing is the discipline of attracting and keeping customers by publishing genuinely
          useful content &mdash; articles, guides, web copy, and video &mdash; instead of interrupting
          people with ads. Done well, it compounds: a single strong page can earn search traffic, answer
          buyer questions, and support your sales conversations for years. Content only works when it is
          connected to strategy, so we run content strategy, creation, and distribution as one campaign,
          led by a senior team rather than handed to a junior or an offshore content mill.
        </p>
        <p>
          A complete content marketing service is far more than churning out blog posts: search relevance,
          audience intent, your brand voice, and distribution all have to work together. This is where
          content marketing and{" "}
          <InlineLink href={seo.href}>{seo.linkText}</InlineLink> meet, and it is the engine under the
          rest of your <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
      </>
    ),
    introCallout: (
      <CalloutBox>
        Our content marketing services fit Canadian businesses that want to grow through genuine expertise
        rather than ad spend alone &mdash; small and growing businesses without an in-house writing team;
        B2B companies with considered, multi-stakeholder sales cycles; service businesses that want to be
        the obvious expert in their field; and companies that have published before but seen little return
        and want a strategy-led approach.
      </CalloutBox>
    ),
    stats: [
      {
        value: "≈4.5x",
        label: "more leads for businesses that publish 16+ blog posts a month vs. only a few.",
        sourceName: "Semrush",
        sourceUrl: "https://www.semrush.com/blog/content-marketing-statistics/",
      },
      {
        value: "Top 5",
        label: "highest-ROI content formats in 2025 include blog posts, by marketer ranking.",
        sourceName: "HubSpot",
        sourceUrl: "https://www.hubspot.com/marketing-statistics",
      },
      {
        value: "84%",
        label: "of B2B marketers use paid channels to distribute content — publishing is not the finish line.",
        sourceName: "Content Marketing Institute",
        sourceUrl: "https://contentmarketinginstitute.com/content-marketing-strategy/content-marketing-statistics",
      },
    ],
    featuresHeading: "Our content marketing services",
    featuresSubtitle:
      "The full range of content marketing services under one roof — tied to real keyword research, not guesswork.",
    features: [
      {
        icon: LineChart,
        title: "Content strategy & planning",
        description:
          "Strategy comes first. We research the keywords and questions your customers use, study what already ranks, and build a prioritized content plan and editorial calendar so every piece has a purpose before a word is written.",
      },
      {
        icon: FileText,
        title: "SEO blog & article writing",
        description: (
          <>
            Search-optimized blog posts, articles, and long-form guides that target real demand and read
            like they were written by an expert &mdash; because they are reviewed by one. This is where
            content marketing and{" "}
            <InlineLink href={seo.href}>{seo.linkText}</InlineLink> meet, so your content earns rankings as
            well as readers.
          </>
        ),
      },
      {
        icon: PenTool,
        title: "Website & landing-page copy",
        description:
          "We write and refine the pages that carry your message and your conversions — service pages, homepages, and campaign landing pages — so visitors understand what you do and take the next step.",
      },
      {
        icon: Sparkles,
        title: "Video content marketing services",
        description:
          "Buyers increasingly expect video, so our video content marketing services help you plan and script video content that explains, demonstrates, and builds trust, and that can be repurposed across your channels.",
      },
      {
        icon: Share2,
        title: "Content distribution & promotion",
        description: (
          <>
            Publishing is not the finish line. We help distribute and promote your content through your
            owned channels, your{" "}
            <InlineLink href={getDmSpoke("social-media-marketing").href}>
              {getDmSpoke("social-media-marketing").linkText}
            </InlineLink>, and supporting{" "}
            <InlineLink href={linkBuilding.href}>{linkBuilding.linkText}</InlineLink>, so the right people
            actually see it.
          </>
        ),
      },
      {
        icon: Users,
        title: "B2B content marketing",
        description:
          "As a B2B content marketing agency, we produce the in-depth, credibility-building content that longer B2B sales cycles demand — thought-leadership articles, case-style explainers, and resources that help prospects choose you with confidence.",
      },
    ],
    processHeading: "Our content marketing process",
    process: [
      {
        step: "01",
        title: "Free consultation",
        description:
          "A no-obligation conversation about your goals, your audience, and your current content — plus an honest look at where the search opportunities are.",
      },
      {
        step: "02",
        title: "Strategy",
        description:
          "We turn that into a prioritized content plan: target keywords and topics, the page and content types that fit, and an editorial calendar mapped to your goals.",
      },
      {
        step: "03",
        title: "Execution",
        description:
          "Our senior team researches, writes, and edits the content — grounded in real subject expertise and reviewed for accuracy — then prepares it for publishing and distribution. No outsourcing to anonymous freelancers.",
      },
      {
        step: "04",
        title: "Monthly reporting & optimization",
        description:
          "Clear, plain-language reporting on what was published and how it is performing, with the plan refined as results develop.",
      },
    ],
    comparisonHeading: "Why choose NexFortis for content marketing",
    comparison: [
      { feature: "Who does the work", us: "A senior team, founder-led — real expertise", them: "A rotating cast of junior writers" },
      { feature: "Foundation", us: "Real Canadian search data and keyword research", them: "Guesswork and trending topics" },
      { feature: "Quality", us: "Fact-checked, expert-reviewed writing", them: "Generic, unchecked AI output" },
      { feature: "Integration", us: "Tied to SEO, social, and your website", them: "Disconnected one-off articles" },
      { feature: "Commitment", us: "Month-to-month — no lock-in", them: "Locked contracts" },
    ],
    pricingHeading: "Content marketing pricing after a free consultation",
    pricing: {
      fromLabel: "Scoped to your goals",
      note: (
        <>
          <p className="mb-4">
            We don&rsquo;t publish fixed content marketing prices, because effective content is scoped to
            your goals, your market&rsquo;s competitiveness, how much you publish, and the depth each piece
            requires &mdash; a steady stream of blog articles and a full B2B content programme are very
            different.
          </p>
          <p>
            After your free consultation, we present clear options aligned to the scope of work, with no
            hidden fees and no long-term lock-in &mdash; from project-based content to ongoing monthly
            content programmes.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "What is included in NexFortis's content marketing service?",
        answer:
          "Our content marketing service includes content strategy and planning, SEO blog and article writing, website and landing-page copy, video content, content distribution, and B2B content — all tied to real keyword research and backed by monthly reporting.",
      },
      {
        question: "How much do content marketing services cost?",
        answer:
          "The cost of content marketing varies with what you need — how often you publish, how detailed each piece is, and how competitive your market is — which is why we scope every engagement after a free consultation rather than quoting a one-size-fits-all price.",
      },
      {
        question: "Does content marketing help with SEO?",
        answer:
          "Yes — closely. Search engines rank content that genuinely answers what people search for, so strategy-led content is one of the strongest foundations for organic visibility. We plan content and SEO together so they reinforce each other.",
      },
      {
        question: "Do you write the content yourselves, or use AI?",
        answer:
          "Our content is written and reviewed by a senior team grounded in real subject expertise. We use modern tools to work efficiently, but we fact-check everything and never publish generic, unchecked AI output as your brand's voice.",
      },
      {
        question: "How long does content marketing take to show results?",
        answer:
          "Content marketing is a months-not-weeks discipline. Timelines depend on your starting point, your market's competitiveness, and how consistently you publish, so we set realistic expectations up front rather than promising a fixed date.",
      },
      {
        question: "Do you offer content marketing for B2B companies?",
        answer:
          "Yes. As a B2B content marketing agency, we produce the in-depth, trust-building content that longer B2B sales cycles need, mapped to the questions buyers ask at each stage.",
      },
    ],
    authorNote: (
      <p>
        Your content is guided personally by Hassan Sadiq, NexFortis Founder and CEO &mdash; not a rotating
        cast of junior writers. With 15+ years in enterprise technology and as a certified Microsoft
        Solutions Partner, the search and publishing side is handled with genuine technical depth, and the
        expertise behind your content is real. A small senior team owns your program end-to-end.
      </p>
    ),
    ctaHeading: "Ready to grow through content people actually search for?",
    ctaSubtext:
      "Book a free, no-obligation content marketing consultation — an honest assessment of where your content stands and what it will take to grow.",
  },
  "link-building": {
    metaTitle: "Link Building Services in Canada",
    metaDescription:
      "Canadian SEO link building company — white-hat outreach, guest posting, digital PR, and backlink audits that earn durable authority. Founder-led. Free audit.",
    h1: "Link Building Services for Canadian Businesses",
    heroSubtitle:
      "A Canadian SEO link building company that earns the high-authority backlinks search engines use to decide who ranks — manual outreach, guest posting, digital PR, and backlink audits, run as one white-hat campaign.",
    serviceType: "Link Building",
    serviceSchemaName: "Link Building Services",
    serviceSchemaDescription:
      "Link building for Canadian businesses — high-authority backlink acquisition, manual outreach, guest posting, digital PR, niche and editorial links, and backlink audits, delivered as one founder-led, white-hat campaign.",
    introHeading: "What NexFortis link building services include",
    intro: (
      <>
        <p>
          NexFortis is a Canadian <strong>seo link building company</strong> that earns the high-authority
          backlinks search engines rely on to decide which sites deserve to rank. Our link building
          services are built around the outcome that actually matters &mdash; durable authority that lifts
          your rankings and brings in qualified traffic &mdash; not a pile of low-quality links that put
          your site at risk.
        </p>
        <p>
          As an seo link building services provider, we combine manual outreach, guest posting, digital
          PR, and a thorough backlink audit into one connected campaign, led by a senior consultant rather
          than handed off to a junior or an offshore link farm. Those links remain one of the strongest
          signals Google uses to judge authority: a page that earns relevant, trusted links tends to
          outrank a page that has not, all else being equal.
        </p>
        <p>
          A genuine link building service is far more than buying a batch of links. The links that help
          &mdash; and don&rsquo;t get you penalized &mdash; are editorial, relevant, and earned, which is
          why our approach centres on white-hat methods and begins with a backlink audit and toxic-link
          disavow before we build anything new. Link building amplifies your{" "}
          <InlineLink href={seo.href}>{seo.linkText}</InlineLink> and your{" "}
          <InlineLink href={contentMarketing.href}>{contentMarketing.linkText}</InlineLink> across the rest
          of your <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
      </>
    ),
    introCallout: (
      <CalloutBox>
        Our link building services fit Canadian businesses that need to compete on authority &mdash;
        businesses stuck on page two or three with good content but not enough authority to break through;
        companies in competitive industries where rivals are actively earning links; businesses with a
        weak or risky backlink profile that need a clean, white-hat foundation; and agencies or in-house
        teams that need a reliable seo link building services partner for outreach and digital PR.
      </CalloutBox>
    ),
    stats: [
      {
        value: "3.8x",
        label: "more backlinks for the #1 Google result than pages ranking #2–10, in an analysis of 11.8M results.",
        sourceName: "Backlinko",
        sourceUrl: "https://backlinko.com/search-engine-ranking",
      },
      {
        value: "66.31%",
        label: "of all pages have zero backlinks — a strong link profile is the difference between page one and page three.",
        sourceName: "Search Engine Roundtable (Ahrefs study)",
        sourceUrl: "https://www.seroundtable.com/over-65-of-web-pages-have-no-links-31134.html",
      },
      {
        value: "#1 tactic",
        label: "content-led link building remains the most popular and effective tactic among SEO professionals.",
        sourceName: "Aira, State of Link Building Report",
        sourceUrl: "https://aira.net/state-of-link-building/",
      },
    ],
    featuresHeading: "Our link building services",
    featuresSubtitle:
      "The full range of link building services under one roof — editorial, earned, and white-hat only.",
    features: [
      {
        icon: Link2,
        title: "High-authority backlink acquisition",
        description:
          "The goal of every campaign is relevant links from sites with genuine authority and real audiences — the links that move rankings, not volume for its own sake. We prioritize quality and relevance over link counts.",
      },
      {
        icon: Users,
        title: "Manual outreach",
        description:
          "Our link building outreach service is built on real, personalized outreach to publishers, editors, and site owners — never automated spam. We pitch a genuine reason to link and build relationships that produce more than one-off placements.",
      },
      {
        icon: PenTool,
        title: "Guest posting",
        description:
          "We earn placements on relevant, quality sites through guest posting — well-researched, genuinely useful articles that publishers want to run and that carry a contextual link back to you.",
      },
      {
        icon: Sparkles,
        title: "Digital PR",
        description:
          "We create newsworthy angles, data, and stories that earn editorial coverage and links from news sites, industry publications, and blogs — the kind of high-authority links that are hard to buy and easy for Google to trust.",
      },
      {
        icon: FileText,
        title: "Niche & editorial links",
        description:
          "We pursue contextual links from sites in or adjacent to your niche, placed editorially within relevant content, so each link reinforces your topical authority rather than looking out of place.",
      },
      {
        icon: Gauge,
        title: "Backlink audit & toxic-link disavow",
        description:
          "We audit your existing backlink profile, flag spammy or harmful links that could be holding you back, and prepare a disavow where warranted — cleaning up before we build keeps your new links working.",
      },
      {
        icon: BarChart3,
        title: "Link building packages",
        description:
          "We scope clear link building packages to your goals, your competition, and your budget, so you know what each campaign covers and what to expect, with no surprise add-ons.",
      },
      {
        icon: Star,
        title: "White-hat methods",
        description:
          "Everything we do follows Google's guidelines. We do not buy links, run private blog networks, or chase shortcuts that risk a penalty — because authority that lasts is the only kind worth paying for.",
      },
    ],
    processHeading: "Our link building process",
    process: [
      {
        step: "01",
        title: "Free link building audit",
        description:
          "A no-obligation review of your current backlink profile, your toxic-link exposure, your competitors' link profiles, and the gaps between you — an honest baseline before any investment.",
      },
      {
        step: "02",
        title: "Strategy",
        description:
          "The audit informs a prioritized plan: the target sites and publishers worth pursuing, the angles and content that will earn links, the anchor-text mix, and the pace that fits your goals and budget.",
      },
      {
        step: "03",
        title: "Execution",
        description:
          "Our in-house team does the work — outreach, guest posting, digital PR, and editorial placement — vetting every prospect for relevance and authority. No outsourcing to link farms, no automated spam.",
      },
      {
        step: "04",
        title: "Monthly reporting",
        description:
          "Clear, plain-language reporting on the links earned, the authority of the sites they came from, and how your profile is growing against your competitors.",
      },
    ],
    comparisonHeading: "Why choose NexFortis for link building",
    comparison: [
      { feature: "Who does the work", us: "A senior team, founder-led — real accountability", them: "An offshore order desk" },
      { feature: "Method", us: "Editorial, earned, white-hat only", them: "Bought links and private blog networks" },
      { feature: "Safety", us: "Audit and disavow before building", them: "Volume that risks a penalty" },
      { feature: "Local knowledge", us: "Canadian publishers and industry sites", them: "A generic global link list" },
      { feature: "Honesty", us: "No promise of a fixed number or guaranteed rank", them: "Guaranteed-links claims" },
    ],
    pricingHeading: "Link building pricing after a free audit",
    pricing: {
      fromLabel: "Scoped to your competition",
      note: (
        <>
          <p className="mb-4">
            We don&rsquo;t publish fixed link building prices, because a good campaign is tailored to your
            competition, the authority you need to catch up, your current links, and your growth goals
            &mdash; which is why we start with a thorough audit.
          </p>
          <p>
            After your free link building audit, we give you a clear plan that matches the work involved,
            with no surprise costs and no long-term commitment &mdash; from a one-time backlink audit and
            cleanup to ongoing monthly campaigns.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "What is a link building service?",
        answer:
          "A link building service is a managed effort to earn links from other reputable websites back to yours, because those links are a key factor search engines use to decide how to rank pages. Ours combines a backlink audit, manual outreach, guest posting, and digital PR to earn relevant, high-authority links in a way that is safe and follows Google's guidelines.",
      },
      {
        question: "How much do link building services cost?",
        answer:
          "The cost varies with how competitive your market is, the authority you need to build, and your existing backlink profile — which is why we run a free audit first rather than quoting a standard price. After it, we provide clear link building packages so you can see exactly what each campaign includes.",
      },
      {
        question: "What is the purpose of link building?",
        answer:
          "The purpose of link building is to earn authority — the trusted, relevant links that help your pages rank and bring in qualified visitors. Links from credible sites signal to search engines that your content is worth surfacing, and that authority compounds over time, making it one of the most durable investments in SEO.",
      },
      {
        question: "What makes a backlink service worth buying?",
        answer:
          "A backlink service is worth your money when the links are editorial, relevant, and earned through genuine outreach and digital PR — not bought, automated, or placed on private blog networks. Cheap link packages often do more harm than good; white-hat methods protect your site while building authority that lasts.",
      },
      {
        question: "Are your link building methods safe for my site?",
        answer:
          "Yes. We use only white-hat methods — genuine outreach, high-quality guest posts, and digital PR — and we audit and disavow harmful links rather than adding to the problem. We never buy links or use tactics that break Google's guidelines and could hurt your rankings.",
      },
      {
        question: "How long does link building take to show results?",
        answer:
          "Link building is a months-not-weeks discipline. Earning quality links takes real outreach and relationship-building, and their impact on rankings builds over time, so we set realistic expectations up front rather than promising a fixed date or a guaranteed number of links.",
      },
    ],
    authorNote: (
      <p>
        Your campaign is led personally by Hassan Sadiq, NexFortis Founder and CEO &mdash; not an offshore
        order desk. With 15+ years in enterprise technology and as a certified Microsoft Solutions Partner,
        the audit and reporting side is handled with genuine technical depth, and you get real
        accountability for every link. A small senior team owns your campaign end-to-end.
      </p>
    ),
    ctaHeading: "Ready to compete on authority?",
    ctaSubtext:
      "Book a free, no-obligation link building audit — an honest assessment of where your authority stands and what it will take to grow.",
  },
  "google-ads-ppc": {
    metaTitle: "Google Ads & PPC Management in Canada",
    metaDescription:
      "Canadian Google Ads agency and PPC management — search, Shopping, Performance Max, and Local Service Ads. Google Partner, founder-led, no lock-in. Free PPC audit.",
    h1: "Google Ads and PPC Management for Canadian Businesses",
    heroSubtitle:
      "A Canadian Google Ads agency that turns paid search into a predictable source of leads, calls, and sales — strategy, account structure, bids, ad copy, and conversion tracking, run as one accountable campaign by a Google Partner.",
    serviceType: "Google Ads and PPC Management",
    serviceSchemaName: "Google Ads and PPC Management",
    serviceSchemaDescription:
      "Google Ads and PPC management for Canadian businesses — search, Shopping, Performance Max, and Local Service Ads, with account structure, bid management, ad copy, and conversion tracking, run as one founder-led campaign by a Google Partner.",
    introHeading: "What NexFortis Google Ads and PPC services include",
    intro: (
      <>
        <p>
          NexFortis is a Canadian <strong>google ads agency</strong> that helps business owners turn paid
          search into a predictable source of leads, calls, and sales &mdash; instead of a budget that
          quietly disappears. Our google ads management is judged by the clicks that become customers, not
          by impressions or vanity metrics. As a ppc agency, we pull campaign strategy, account structure,
          keyword and bid management, ad copywriting, and conversion tracking into one accountable
          campaign, run by a senior consultant rather than handed to a junior.
        </p>
        <p>
          Pay-per-click advertising puts your business in front of people at the exact moment they search
          for what you sell, and you pay only when they click. That intent is why paid search converts.
          Done poorly, though, it is one of the easiest ways to burn money, which is exactly why
          professional ppc management exists. As a Google Partner, NexFortis runs campaigns to
          Google&rsquo;s own performance and spend standards.
        </p>
        <p>
          A complete Google Ads and PPC service is far more than launching a few ads: Google rewards
          relevance across keywords, ad copy, bids, and the landing page each click arrives on, all tied
          back to accurate conversion tracking. Our google ads services cover the full lifecycle &mdash;
          strategy, build, launch, and optimization &mdash; run alongside the rest of your{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
      </>
    ),
    introCallout: (
      <CalloutBox>
        Our Google Ads and PPC services fit Canadian businesses that need their ad spend to earn its keep
        &mdash; small and growing businesses that want professional ppc services without enterprise agency
        rates; local and service-area businesses that depend on high-intent search and Google Local
        Service Ads; eCommerce and retail that need Shopping and Performance Max built to sell; and
        businesses already running ads that want a ppc management services partner to fix the leaks.
      </CalloutBox>
    ),
    stats: [
      {
        value: "65%",
        label: "of clicks on commercial-intent searches go to paid ads rather than organic listings.",
        sourceName: "WordStream",
        sourceUrl: "https://www.wordstream.com/blog/ws/2023/02/24/digital-advertising",
      },
      {
        value: "$2 per $1",
        label: "average profit businesses earn for every dollar spent on Google Ads.",
        sourceName: "Google Economic Impact",
        sourceUrl: "https://economicimpact.google/methodology/",
      },
      {
        value: "6.64%",
        label: "average Google search-ads click-through rate across industries — tested ads beat it.",
        sourceName: "WordStream PPC benchmarks",
        sourceUrl: "https://www.wordstream.com/ppc-benchmarks",
      },
    ],
    featuresHeading: "Our Google Ads and PPC services",
    featuresSubtitle:
      "The full range of google ads management services under one roof — from a single search campaign to a full multi-channel account.",
    features: [
      {
        icon: Search,
        title: "Google Ads search campaigns",
        description:
          "The core of most accounts: text ads on Google's results that capture high-intent demand. We build and manage search campaigns around the terms your customers actually use, so your budget goes to clicks with real buying intent.",
      },
      {
        icon: Gauge,
        title: "PPC management & optimization",
        description:
          "Ongoing ppc management is where accounts win or lose. We continuously refine targeting, bids, ad copy, and negative keywords, cut wasted spend, and move budget to what converts.",
      },
      {
        icon: Building2,
        title: "Campaign setup & account structure",
        description:
          "A clean account structure is the foundation of performance. We set up campaigns, ad groups, and conversion tracking correctly from the start — or restructure a messy account that is fighting itself.",
      },
      {
        icon: BarChart3,
        title: "Keyword & bid management",
        description:
          "We research and group the keywords worth bidding on, build negative-keyword lists to filter out waste, and manage bids and budgets so you compete where it pays and pull back where it does not.",
      },
      {
        icon: PenTool,
        title: "Ad copywriting & A/B testing",
        description:
          "Relevant, compelling ad copy lifts click-through rates and lowers costs. We write and continuously test headlines, descriptions, and assets so your best variations earn more of your spend.",
      },
      {
        icon: MapPin,
        title: "Google Local Service Ads",
        description:
          "For eligible service businesses, google local service ads put you at the top of results with a pay-per-lead model and a Google Guaranteed badge. We help you qualify for, set up, and manage google local service ads alongside your search campaigns.",
      },
      {
        icon: Sparkles,
        title: "Google Shopping & Performance Max",
        description:
          "For retailers and eCommerce, we set up and manage Shopping and Performance Max campaigns — feed, structure, and bidding — to put your products in front of ready-to-buy shoppers.",
      },
      {
        icon: LineChart,
        title: "Landing-page & conversion optimization",
        description: (
          <>
            Clicks only pay off if the page converts. We make sure your traffic lands on pages built to
            act, working alongside our{" "}
            <InlineLink href={getDmSpoke("conversion-rate-optimization").href}>
              {getDmSpoke("conversion-rate-optimization").linkText}
            </InlineLink>{" "}
            and{" "}
            <InlineLink href={getDmSpoke("web-design").href}>{getDmSpoke("web-design").linkText}</InlineLink>{" "}
            teams where needed.
          </>
        ),
      },
      {
        icon: FileText,
        title: "Transparent reporting",
        description:
          "You see where every dollar goes — spend, clicks, conversions, cost per lead, and return — in clear, plain-language reporting, with no black-box dashboards.",
      },
    ],
    processHeading: "Our Google Ads and PPC process",
    process: [
      {
        step: "01",
        title: "Free Google Ads & PPC audit",
        description:
          "A no-obligation review of your current campaigns (or your opportunity, if you are starting fresh): account structure, keywords, ad copy, conversion tracking, wasted spend, and quick wins.",
      },
      {
        step: "02",
        title: "Strategy",
        description:
          "The audit informs a prioritized plan: the campaigns to run, the keywords and audiences to target, budget allocation, ad messaging, and the conversion tracking that proves what works.",
      },
      {
        step: "03",
        title: "Execution",
        description:
          "Our in-house team builds and launches the work — campaigns, ad groups, ad copy, negative keywords, bids, and tracking — connected to the right landing pages. No outsourcing.",
      },
      {
        step: "04",
        title: "Monthly reporting & optimization",
        description:
          "Clear reporting on spend, clicks, conversions, and cost per result, with continuous optimization — bid adjustments, copy tests, and budget shifts — as the data comes in.",
      },
    ],
    comparisonHeading: "Why choose NexFortis for Google Ads and PPC",
    comparison: [
      { feature: "Who does the work", us: "A senior team, founder-led — a boutique ppc management company", them: "A rotating junior account manager" },
      { feature: "Credentials", us: "Google Partner, run to Google's standards", them: "Unvetted, set-and-forget" },
      { feature: "Accountability", us: "Tied to conversions and cost per lead", them: "Clicks and impressions for their own sake" },
      { feature: "Spend transparency", us: "Every dollar reported; fee separate from ad spend", them: "Black-box dashboards" },
      { feature: "Commitment", us: "Month-to-month — no lock-in", them: "Locked contracts" },
    ],
    pricingHeading: "Google Ads and PPC pricing after a free audit",
    pricing: {
      fromLabel: "Management fee separate from ad spend",
      note: (
        <>
          <p className="mb-4">
            We don&rsquo;t publish fixed Google Ads and PPC prices, because effective paid search is scoped
            to your market&rsquo;s competitiveness, your ad budget, the number of campaigns, your current
            baseline, and your growth goals. Our management fee is separate from the ad spend you pay
            Google.
          </p>
          <p>
            After your free audit we present clear options aligned to the scope of work, with no hidden
            fees and no long-term lock-in &mdash; from a single search campaign to full-account ppc
            management across search, Shopping, and Local Service Ads.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "How much does Google Ads cost in Canada?",
        answer:
          "There are two costs: the ad spend you pay Google (which you set and control), and the management fee for running the account. Ad spend depends on your industry, your competition, and your keywords, so cost per click varies widely. We scope both after a free audit so your budget is matched to realistic results.",
      },
      {
        question: "How much should I pay someone to manage my Google Ads?",
        answer:
          "Management fees vary with the size and complexity of the account and how much ongoing optimization is involved. We scope a transparent management fee after a free audit — separate from your ad spend — so you know exactly what you are paying for, with no long-term lock-in.",
      },
      {
        question: "What is included in NexFortis's Google Ads and PPC service?",
        answer:
          "Our google ads management services include campaign strategy and setup, account structure, keyword and bid management, ad copywriting and A/B testing, negative-keyword management, Google Local Service Ads, Shopping and Performance Max, landing-page and conversion optimization, and transparent monthly reporting.",
      },
      {
        question: "How is a PPC agency different from doing Google Ads myself?",
        answer:
          "A ppc agency brings structure, ongoing optimization, and conversion tracking that most DIY accounts lack — and the difference usually shows up as wasted spend avoided and a lower cost per lead. We find the leaks, fix the foundations, and manage the account so your budget works harder.",
      },
      {
        question: "How long does it take to see results from PPC?",
        answer:
          "Paid search can drive traffic almost immediately once campaigns are live, but a profitable account is a months-not-weeks discipline: it takes time to gather conversion data, cut what does not work, and scale what does. We set realistic expectations up front.",
      },
      {
        question: "Do you manage both Google Ads and other PPC channels?",
        answer:
          "Yes. We focus on Google's ecosystem — search, Shopping, Performance Max, and google local service ads — and can coordinate paid search with the rest of your marketing so your channels reinforce each other instead of competing.",
      },
    ],
    authorNote: (
      <p>
        Your account is managed personally by Hassan Sadiq, NexFortis Founder and CEO &mdash; never handed
        to a junior. NexFortis is a Google Partner and a certified Microsoft Solutions Partner, with 15+
        years in enterprise technology behind the tracking, integrations, and measurement that make paid
        search accountable. A small senior team owns your account end-to-end.
      </p>
    ),
    ctaHeading: "Ready to make every click earn its keep?",
    ctaSubtext:
      "Book a free, no-obligation Google Ads and PPC audit — an honest assessment of where your account stands and what it will take to grow profitably.",
  },
  "social-media-marketing": {
    metaTitle: "Social Media Marketing",
    metaDescription:
      "Social media marketing & management for Canadian businesses: organic social, content, and Meta Ads that build your brand and feed your funnel.",
    h1: "Social Media Marketing That Builds Your Brand",
    heroSubtitle:
      "Organic social and Meta Ads that put your brand where your buyers already spend hours every day — and turn that attention into customers.",
    serviceType: "Social Media Marketing",
    serviceSchemaName: "Social Media Marketing Services",
    serviceSchemaDescription:
      "Social media marketing and management for Canadian businesses — strategy, content creation, organic management, community engagement, and paid social (Meta Ads).",
    introHeading: "Be where your customers already are",
    intro: (
      <>
        <p>
          Your customers spend a couple of hours a day on social platforms whether or not your
          business shows up there. Social media marketing is how you make that time work for you
          &mdash; staying visible, building trust, and feeding your funnel on the channels your
          audience actually uses, instead of shouting into an empty feed or posting at random when
          someone remembers to.
        </p>
        <p>
          We run both sides of it: organic social that builds your brand over time, and paid social
          (Meta Ads) that puts the right message in front of the right people fast. It pairs
          naturally with our{" "}
          <InlineLink href={getDmSpoke("content-marketing").href}>{getDmSpoke("content-marketing").linkText}</InlineLink>{" "}
          and is part of the wider{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
        <p>
          And we are honest about it: not every platform is worth your time. We focus your effort on
          the one or two channels where your buyers actually are, rather than spreading you thin
          across all of them for the sake of looking busy.
        </p>
      </>
    ),
    stats: [
      {
        value: "5.24B",
        label: "active social media user identities worldwide in early 2025.",
        sourceName: "DataReportal, Digital 2025",
        sourceUrl: "https://datareportal.com/reports/digital-2025-sub-section-state-of-social",
      },
      {
        value: "2h 21m",
        label: "the typical internet user spends on social media every day.",
        sourceName: "Meltwater / We Are Social, Digital 2025",
        sourceUrl: "https://www.meltwater.com/en/blog/digital-2025",
      },
      {
        value: "$243B",
        label: "spent on social media advertising in 2024 — up 15% year over year.",
        sourceName: "Digital 2025 report (social ad spend)",
        sourceUrl: "https://www.meltwater.com/en/about/press-releases/digital-2025-ai-accelerates-youtube-tops-user-charts-social-ad-spend-soars-and-more",
      },
    ],
    featuresHeading: "What's included in our social media marketing",
    featuresSubtitle: "Strategy, content, community, and paid social — focused where it counts.",
    features: [
      {
        icon: Search,
        title: "Strategy & platform selection",
        description:
          "We figure out which one or two platforms your buyers actually use and build a strategy around them, instead of stretching your budget across every network for the sake of it.",
      },
      {
        icon: PenTool,
        title: "Content creation",
        description:
          "We plan and produce the posts, graphics, and short-form video that fit each platform and actually get engagement — on a consistent schedule, not in random bursts.",
      },
      {
        icon: Share2,
        title: "Organic management & scheduling",
        description:
          "We manage your profiles end to end — calendar, scheduling, posting, and optimization — so your presence stays active and on-brand without eating up your week.",
      },
      {
        icon: Users,
        title: "Community engagement",
        description:
          "We monitor and respond to comments and messages so followers feel heard and prospects get answers — the part most businesses neglect and the part that actually builds loyalty.",
      },
      {
        icon: BarChart3,
        title: "Paid social & Meta Ads",
        description:
          "We plan and run targeted Meta (Facebook and Instagram) ad campaigns to reach the right audiences fast, with transparent reporting on spend and results — organic builds trust, paid adds reach.",
      },
      {
        icon: LineChart,
        title: "Analytics & reporting",
        description:
          "We track the metrics that tie social to your business — reach, engagement, traffic, and leads — and report in plain language, not a wall of vanity numbers.",
      },
    ],
    processHeading: "How we deliver social media marketing",
    process: [
      {
        step: "01",
        title: "Audit & strategy",
        description:
          "We review your current presence and competitors, pick the platforms worth your time, and set a content and (if it fits) paid-social plan with clear goals.",
      },
      {
        step: "02",
        title: "Create & schedule",
        description:
          "We build a content calendar and produce posts and creative on a steady cadence, with your sign-off, so your feeds stay active and consistent.",
      },
      {
        step: "03",
        title: "Engage & amplify",
        description:
          "We manage community engagement and, where it makes sense, run Meta Ads to put your best content and offers in front of the right audiences.",
      },
      {
        step: "04",
        title: "Measure & refine",
        description:
          "We report on what's working — reach, engagement, traffic, leads — and double down on the content and campaigns that earn results.",
      },
    ],
    comparisonHeading: "NexFortis vs. a typical social media provider",
    comparison: [
      { feature: "Strategy", us: "Focused on the platforms that matter", them: "Posting everywhere for the sake of it" },
      { feature: "Content", us: "Planned, on-brand, consistent", them: "Random posts when someone remembers" },
      { feature: "Paid social", us: "Targeted Meta Ads, transparent spend", them: "Boosted posts with no plan" },
      { feature: "Reporting", us: "Tied to traffic and leads", them: "Follower and like counts" },
      { feature: "Who does the work", us: "A senior consultant you can reach", them: "An intern or a rotating junior" },
      { feature: "Commitment", us: "Month-to-month — we earn the renewal", them: "Locked contracts" },
    ],
    pricingHeading: "What social media marketing costs",
    pricing: {
      fromLabel: "Scaled to platforms, posting volume, and paid spend",
      note: (
        <>
          <p className="mb-4">
            Cost depends on how many platforms you run, how much content you publish, and whether you
            add paid social. Managing one focused channel well is very different from running several
            with an ad budget on top &mdash; so we price by the program, not a fixed package.
          </p>
          <p>
            Paid-social ad spend is separate and goes to the platforms. You get a fixed monthly
            scope, transparent reporting, and no long-term lock-in. Ask for a free social audit and
            we&rsquo;ll recommend where to focus.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "What is social media marketing?",
        answer:
          "Social media marketing is using platforms like Instagram, Facebook, LinkedIn, and TikTok to build your brand, engage your audience, and drive traffic and leads — through a mix of organic content and paid ads. Done well it's a consistent, strategic presence on the channels your buyers use, not just posting whenever you have a spare moment.",
      },
      {
        question: "Why is social media marketing important?",
        answer:
          "Because that's where attention is. Billions of people use social platforms for a couple of hours a day, and it's where a lot of discovery, research, and trust-building now happens before someone buys. If your business isn't visible and credible there, you're invisible at a moment that increasingly shapes the buying decision.",
      },
      {
        question: "How much does social media marketing cost?",
        answer:
          "It depends on how many platforms you run, how much content you publish, and whether you add paid social. Managing one channel well costs far less than running several with an ad budget on top. We price by the program and keep it transparent — and any paid-social ad spend is separate, going directly to the platforms. You'll get a clear number after a free audit.",
      },
      {
        question: "Which platforms should my business be on?",
        answer:
          "Only the ones your buyers actually use — which is usually one or two, not all of them. A B2B firm might live on LinkedIn while a local retailer does better on Instagram and Facebook. We'll recommend where to focus based on your audience and goals rather than spreading you thin trying to be everywhere.",
      },
      {
        question: "How do you measure social media success?",
        answer:
          "By the metrics that connect to your business, not just likes. We track reach and engagement, but more importantly the traffic and leads social sends you, and report it in plain language each month. That way you can see whether the work is building real results, not just a follower count.",
      },
    ],
    authorNote: (
      <p>
        Hassan leads social media strategy at NexFortis, helping Canadian businesses build a focused,
        credible presence on the platforms that matter. As founder and CEO he stays hands-on with
        every engagement &mdash; strategy first, never random posting.
      </p>
    ),
    ctaHeading: "Ready to make social media actually work?",
    ctaSubtext:
      "Get a free social media audit — where your audience really is, what's working, and the fastest path to brand presence that drives leads.",
  },

  // -------------------------------------- WEB DESIGN & DEVELOPMENT ----
  "web-design": {
    metaTitle: "Web Design Services in Canada",
    metaDescription:
      "Canadian web design company — custom, responsive, conversion-focused websites and development built to rank and convert. Founder-led. Free design consultation.",
    h1: "Web Design Services for Canadian Businesses",
    heroSubtitle:
      "A Canadian web design company that builds websites to get results — clean, modern design paired with the development and search foundations that make a site actually perform, run by a senior team.",
    serviceType: "Web Design and Development",
    serviceSchemaName: "Web Design Services",
    serviceSchemaDescription:
      "Web design and development for Canadian businesses — custom UX/UI, responsive builds, eCommerce, CMS, redesigns, landing pages, and maintenance, delivered by a senior team and engineered to rank and convert.",
    introHeading: "What NexFortis web design services include",
    intro: (
      <>
        <p>
          NexFortis is a Canadian <strong>web design company</strong> that builds websites to get results
          for your business &mdash; more leads, more phone calls, more customers. We pair clean, modern
          design with the development and search foundations that make a site actually perform, not just
          look good. As a web design agency, every project is led by a senior team, never handed to a
          junior or an offshore template mill.
        </p>
        <p>
          Good web design is where your brand, your message, and your conversion goals meet. Our web
          design services cover the full build &mdash; strategy, user experience, visual design, and web
          design and development &mdash; so the site that goes live is fast, accessible, search-ready, and
          built around how your customers actually behave. We build for speed, mobile, and search from the
          start, so your site supports your{" "}
          <InlineLink href={seo.href}>{seo.linkText}</InlineLink> and{" "}
          <InlineLink href={getDmSpoke("conversion-rate-optimization").href}>
            {getDmSpoke("conversion-rate-optimization").linkText}
          </InlineLink>{" "}
          instead of working against them.
        </p>
        <p>
          Because we are a Canadian-based company that knows the Greater Toronto Area and works with
          businesses across Ontario and the rest of Canada, we design for Canadian audiences and the way
          they buy &mdash; and connect your site to the rest of your{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
      </>
    ),
    introCallout: (
      <CalloutBox>
        Our web design services fit Canadian businesses that need a site that works as hard as they do
        &mdash; small businesses that need a professional, credible website without enterprise cost; B2B
        and B2C companies that need their site to generate and qualify leads; eCommerce retailers that
        need a store built to sell; and growing or multi-location businesses planning a redesign who want
        to protect their search rankings through the move.
      </CalloutBox>
    ),
    stats: [
      {
        value: "75%",
        label: "of users judge a company's credibility on its website design.",
        sourceName: "Stanford Web Credibility Research",
        sourceUrl: "https://www.kinesisinc.com/the-truth-about-web-design/",
      },
      {
        value: "53%",
        label: "of mobile visits are abandoned when a page takes longer than three seconds to load.",
        sourceName: "Google, 'The Need for Mobile Speed'",
        sourceUrl: "https://www.marketingdive.com/news/google-53-of-mobile-users-abandon-sites-that-take-over-3-seconds-to-load/426070/",
      },
      {
        value: "<50%",
        label: "of mobile sites pass all three Core Web Vitals — so a fast build is still an edge.",
        sourceName: "2025 Web Almanac, HTTP Archive",
        sourceUrl: "https://almanac.httparchive.org/en/2025/performance",
      },
    ],
    featuresHeading: "Our web design services",
    featuresSubtitle:
      "The full range of web design services under one roof — from custom UX to ongoing maintenance.",
    features: [
      {
        icon: PenTool,
        title: "Custom web design & UX/UI",
        description:
          "Every site is custom web design built around your brand and your audience — no recycled themes. We plan the user experience and interface so visitors find what they need and take action.",
      },
      {
        icon: FileCode,
        title: "Web design and development",
        description:
          "Design and build run together: we turn the design into clean, fast, standards-based code, so the finished site performs as well as it looks.",
      },
      {
        icon: Gauge,
        title: "Responsive, mobile-first design",
        description:
          "Every page is built for phones first, then scaled up — because that is where most of your visitors are, and it is the experience Google evaluates first.",
      },
      {
        icon: BarChart3,
        title: "eCommerce & Shopify builds",
        description:
          "We design and build online stores — product pages, category structure, and checkout — built to convert browsers into buyers.",
      },
      {
        icon: FileText,
        title: "WordPress & CMS development",
        description:
          "We build on WordPress and other content systems so your team can update the site easily after launch.",
      },
      {
        icon: Sparkles,
        title: "Website redesign",
        description:
          "If your current site is dated, slow, or underperforming, we redesign it without throwing away the search equity you have already earned.",
      },
      {
        icon: LineChart,
        title: "Conversion-focused landing pages",
        description:
          "Campaign and service landing pages designed around a single action, so you get more from your marketing.",
      },
      {
        icon: Bot,
        title: "Website maintenance services",
        description:
          "After launch, our website maintenance services keep your site secure, updated, and fast — so it keeps performing.",
      },
    ],
    processHeading: "Our web design process",
    process: [
      {
        step: "01",
        title: "Free consultation & quote",
        description:
          "A no-obligation conversation about your goals, your audience, and your current site, then a clear scope and quote.",
      },
      {
        step: "02",
        title: "Discovery & strategy",
        description:
          "We map your content, structure, and conversion goals so the design is built on a plan, not a guess.",
      },
      {
        step: "03",
        title: "Design",
        description:
          "We design the interface and key pages for your review, refining until the look and feel is right.",
      },
      {
        step: "04",
        title: "Development, launch & support",
        description:
          "We build the site — responsive, fast, and search-ready — test it thoroughly, and launch; then we stay on with website maintenance and ongoing improvements. The same senior team does the work end-to-end.",
      },
    ],
    comparisonHeading: "Why choose NexFortis for web design",
    comparison: [
      { feature: "Who does the work", us: "A senior team, founder-led end-to-end", them: "A junior or an offshore template mill" },
      { feature: "Build quality", us: "Custom design, fast, accessible, search-ready", them: "A recycled template, slow on mobile" },
      { feature: "Performance", us: "Built for Core Web Vitals and conversion", them: "Pretty but fragile" },
      { feature: "After launch", us: "Maintenance and ongoing improvements", them: "Handed over and gone" },
      { feature: "Commitment", us: "Honest pricing, month-to-month — no lock-in", them: "Locked contracts" },
    ],
    pricingHeading: "Web design pricing after a free consultation",
    pricing: {
      fromLabel: "Scoped to your build",
      note: (
        <>
          <p className="mb-4">
            We don&rsquo;t publish fixed web design prices, because the right scope depends on your goals,
            the number of pages, the functionality you need &mdash; a brochure site and an eCommerce build
            are very different &mdash; and whether you are starting fresh or redesigning.
          </p>
          <p>
            After your free consultation, we give you a clear quote tied to the work involved, with no
            hidden fees. Ongoing work like website maintenance is offered month-to-month, so you are never
            locked in.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "How much does a website design service cost?",
        answer:
          "It depends on scope — the number of pages, whether you need eCommerce or custom functionality, and whether it is a new build or a redesign. Rather than a one-size-fits-all price, we quote each project after a free consultation so you only pay for what your site actually needs.",
      },
      {
        question: "How long does it take to build a website?",
        answer:
          "Most business websites take from a few weeks to a couple of months, depending on size, functionality, and how quickly content and feedback come together. We set a realistic timeline up front rather than promising an unrealistic launch date.",
      },
      {
        question: "Do you build custom sites, or use WordPress?",
        answer:
          "Both. We do custom web design and also build on WordPress and other content systems when that is the best fit for your team — the goal is a site you can actually run, not one you are locked out of.",
      },
      {
        question: "Will my website work on mobile?",
        answer:
          "Yes. Every site we build is responsive and mobile-first, because most visitors arrive on a phone and Google evaluates the mobile experience first.",
      },
      {
        question: "Can you redesign my existing website?",
        answer:
          "Yes. We redesign dated or underperforming sites and protect the search equity you have already built, so a new look does not cost you rankings.",
      },
      {
        question: "Do you offer website maintenance after launch?",
        answer:
          "Yes. Our website maintenance services keep your site secure, updated, and fast after launch, on month-to-month terms.",
      },
    ],
    authorNote: (
      <p>
        Your project is guided personally by Hassan Sadiq, NexFortis Founder and CEO &mdash; the calibre
        you would want from the best web design company, without the agency overhead. Hassan brings 15+
        years in enterprise technology, and NexFortis is a certified Microsoft Solutions Partner, so the
        build is handled with genuine technical depth. A small senior team owns your project end-to-end.
      </p>
    ),
    ctaHeading: "Ready for a website that works as hard as you do?",
    ctaSubtext:
      "Book a free, no-obligation website design consultation and quote — we'll show you exactly what your site needs to perform.",
  },
  "email-marketing": {
    metaTitle: "Email Marketing",
    metaDescription:
      "Email marketing for Canadian businesses: newsletters, nurture flows, and automations that turn your list into repeat revenue you actually own.",
    h1: "Email Marketing That Turns Lists Into Revenue",
    heroSubtitle:
      "Newsletters, nurture sequences, and automations that turn your email list into repeat revenue — on the one channel you actually own.",
    serviceType: "Email Marketing",
    serviceSchemaName: "Email Marketing Services",
    serviceSchemaDescription:
      "Email marketing for Canadian businesses — strategy, list growth, campaign design, automation and nurture flows, segmentation, deliverability, and reporting.",
    introHeading: "The one audience you actually own",
    intro: (
      <>
        <p>
          Your social followers and ad audiences are rented &mdash; an algorithm change or a rising
          ad cost can cut you off from them overnight. Your email list is the one channel you own
          outright. Used well, it&rsquo;s also the highest-returning one: a direct line to people who
          already raised their hand, that you can reach any time without paying for the privilege.
        </p>
        <p>
          We run email as a revenue channel, not an afterthought &mdash; the strategy, the writing,
          the automations, and the unglamorous deliverability work that keeps you out of the spam
          folder. It pairs naturally with our{" "}
          <InlineLink href={getDmSpoke("content-marketing").href}>{getDmSpoke("content-marketing").linkText}</InlineLink>{" "}
          and is part of the wider{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
        <p>
          Whatever platform you use &mdash; Mailchimp, Klaviyo, or something else &mdash; we handle
          the strategy and the work, so email stops being the thing you mean to get to and starts
          bringing in repeat business on its own.
        </p>
      </>
    ),
    stats: [
      {
        value: "$36",
        label: "in return, on average, for every $1 spent on email marketing.",
        sourceName: "Litmus, Email Marketing ROI",
        sourceUrl: "https://www.litmus.com/roi-calculator",
      },
      {
        value: "≈3,500%",
        label: "average email ROI — among the highest of any marketing channel.",
        sourceName: "EmailTooltester, Email Marketing ROI report",
        sourceUrl: "https://www.emailtooltester.com/en/blog/email-marketing-roi/",
      },
      {
        value: "4.48B",
        label: "email users worldwide in 2024 — nearly everyone you want to reach.",
        sourceName: "Radicati Email Statistics Report",
        sourceUrl: "https://radicati.com/wp/wp-content/uploads/2023/04/Email-Statistics-Report-2023-2027-Executive-Summary.pdf",
      },
    ],
    featuresHeading: "What's included in our email marketing services",
    featuresSubtitle: "Strategy, writing, automation, and deliverability — done for you.",
    features: [
      {
        icon: Users,
        title: "Strategy & list growth",
        description:
          "We build an email strategy around your goals and set up the signup forms, lead magnets, and opt-ins that grow a healthy, permission-based list — quality subscribers, not bought ones that tank your deliverability.",
      },
      {
        icon: PenTool,
        title: "Campaign design & copy",
        description:
          "We design and write newsletters and promotional campaigns that look right in the inbox, sound like you, and are built to get opened, read, and clicked — not deleted on sight.",
      },
      {
        icon: Bot,
        title: "Automation & nurture flows",
        description:
          "We set up the automations that earn the most: welcome series, abandoned-cart and follow-up flows, re-engagement, and post-purchase sequences that sell while you sleep.",
      },
      {
        icon: Sparkles,
        title: "Segmentation & personalization",
        description:
          "We segment your list so the right message reaches the right person — by interest, behaviour, or stage — because a relevant email to a smaller group beats a generic blast to everyone.",
      },
      {
        icon: Gauge,
        title: "Deliverability & compliance",
        description:
          "We handle the technical setup (authentication, list hygiene) that keeps you landing in the inbox, and make sure your email follows Canada's anti-spam law (CASL) and CAN-SPAM — protecting your sender reputation and your business.",
      },
      {
        icon: LineChart,
        title: "Reporting & optimization",
        description:
          "We track opens, clicks, conversions, and revenue per campaign, test subject lines and content, and report in plain language — so email keeps getting better instead of going stale.",
      },
    ],
    processHeading: "How we deliver email marketing",
    process: [
      {
        step: "01",
        title: "Audit & strategy",
        description:
          "We review your list, platform, and past campaigns, then map a strategy: which emails to send, to whom, and which automations will earn the most.",
      },
      {
        step: "02",
        title: "Build & automate",
        description:
          "We set up your templates, signup forms, segments, and the core automated flows, and get deliverability and compliance right from the start.",
      },
      {
        step: "03",
        title: "Send & nurture",
        description:
          "We run your campaigns and newsletters on a consistent schedule and let the automations nurture subscribers toward a purchase in the background.",
      },
      {
        step: "04",
        title: "Measure & improve",
        description:
          "We report on opens, clicks, and revenue, test what moves the numbers, and refine the strategy so each month performs better than the last.",
      },
    ],
    comparisonHeading: "NexFortis vs. a typical email provider",
    comparison: [
      { feature: "Approach", us: "A revenue channel with a strategy", them: "The occasional blast" },
      { feature: "Automation", us: "Welcome, cart, and nurture flows", them: "Manual one-off sends" },
      { feature: "Targeting", us: "Segmented and personalized", them: "One message to the whole list" },
      { feature: "Deliverability", us: "Authenticated, CASL-compliant", them: "Hope it lands in the inbox" },
      { feature: "Reporting", us: "Revenue per campaign", them: "Open rate, maybe" },
      { feature: "Commitment", us: "Month-to-month — we earn the renewal", them: "Locked contracts" },
    ],
    pricingHeading: "What email marketing costs",
    pricing: {
      fromLabel: "Scaled to volume and automation",
      note: (
        <>
          <p className="mb-4">
            Cost depends on how often you send, how many automations you run, and how much design and
            copy each needs &mdash; a monthly newsletter is very different from a full set of
            ecommerce flows. We price by the program, not a per-send rate.
          </p>
          <p>
            Your email platform&rsquo;s own subscription is separate and goes to the provider. You get
            a fixed monthly scope, transparent reporting, and no long-term lock-in. Ask for a free
            email audit and we&rsquo;ll recommend where the quickest revenue is.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "What is email marketing?",
        answer:
          "Email marketing is using email to build relationships and drive sales — newsletters, promotions, and automated sequences sent to people who've opted in to hear from you. Unlike social or ads, your list is an audience you own and can reach any time, which is a big part of why it consistently delivers one of the highest returns in marketing.",
      },
      {
        question: "How effective is email marketing, really?",
        answer:
          "Very — it routinely returns far more per dollar than most channels because you're reaching people who already chose to hear from you. Industry studies put the average return around $36 for every $1 spent. Results depend on your list quality and how well the emails are done, which is exactly the part we handle.",
      },
      {
        question: "Which email platform should I use?",
        answer:
          "It depends on your needs — Mailchimp is fine for simple newsletters, Klaviyo is strong for ecommerce automation, and there are others in between. We work across the major platforms and will recommend the right fit, or work with whatever you already have rather than forcing a migration you don't need.",
      },
      {
        question: "How do you keep emails out of the spam folder?",
        answer:
          "Deliverability is part technical, part discipline. We set up proper authentication, keep your list clean, and follow sending best practices to protect your sender reputation — and we make sure your email complies with Canada's anti-spam law (CASL) and CAN-SPAM, which protects both your inbox placement and your business from penalties.",
      },
      {
        question: "How soon will email marketing pay off?",
        answer:
          "Faster than most channels, because you're emailing people who already know you. A good welcome flow or a re-engagement campaign can produce results within the first few weeks, and the automations keep earning in the background after that. We report from the start so you can see the revenue building.",
      },
    ],
    authorNote: (
      <p>
        Hassan leads email and lifecycle marketing at NexFortis, helping Canadian businesses turn the
        list they own into repeat revenue. As founder and CEO he stays hands-on with every engagement
        &mdash; strategy and deliverability included, not just sending.
      </p>
    ),
    ctaHeading: "Sitting on a list you're not using?",
    ctaSubtext:
      "Get a free email marketing audit — your list, your automations (or lack of them), and the fastest path to revenue from email.",
  },

  // ------------------------------------ CONVERSION RATE OPTIMIZATION ----
  "conversion-rate-optimization": {
    metaTitle: "Conversion Rate Optimization",
    metaDescription:
      "Conversion rate optimization for Canadian businesses: turn more of your traffic into leads with behaviour analysis, testing, and landing-page fixes.",
    h1: "Conversion Rate Optimization That Lifts Revenue",
    heroSubtitle:
      "Turn more of the traffic you already have into leads — with behaviour analysis, testing, and landing-page fixes, not guesswork.",
    serviceType: "Conversion Rate Optimization",
    serviceSchemaName: "Conversion Rate Optimization Services",
    serviceSchemaDescription:
      "Conversion rate optimization for Canadian businesses — analytics review, user-behaviour analysis, A/B testing, and landing-page and funnel optimization.",
    introHeading: "Get more from the traffic you already pay for",
    intro: (
      <>
        <p>
          Most businesses obsess over getting more traffic and ignore what happens once it arrives.
          But if 100 visitors come and two become leads, getting to four leads doubles your results
          without spending a cent more on traffic. That is the whole idea behind conversion rate
          optimization: stop pouring water into a leaky bucket and fix the bucket.
        </p>
        <p>
          The key word is data. We don&rsquo;t redesign on a hunch &mdash; we look at what visitors
          actually do, form a hypothesis, test it, and keep the version that wins. It makes every
          other channel more profitable, because the same clicks from{" "}
          <InlineLink href={seo.href}>{seo.linkText}</InlineLink> or ads suddenly produce more
          enquiries, and it pairs naturally with our{" "}
          <InlineLink href={getDmSpoke("web-design").href}>{getDmSpoke("web-design").linkText}</InlineLink>{" "}
          work. It&rsquo;s part of the wider{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
        <p>
          The opportunity is real: across thousands of accounts, the top quartile of landing pages
          convert more than twice as well as the average. CRO is how you move toward that top group.
        </p>
      </>
    ),
    stats: [
      {
        value: "2.35%",
        label: "average landing-page conversion rate — the top 25% convert at 5.31% or higher.",
        sourceName: "WordStream conversion-rate analysis",
        sourceUrl: "https://www.wordstream.com/blog/ws/2014/03/17/what-is-a-good-conversion-rate",
      },
      {
        value: "53%",
        label: "of mobile visits are abandoned if a page takes over 3 seconds to load.",
        sourceName: "Google, The Need for Mobile Speed",
        sourceUrl: "https://blog.google/products/admanager/the-need-for-mobile-speed/",
      },
      {
        value: "≈90%",
        label: "of search runs on Google — where most of the traffic you're optimizing begins.",
        sourceName: "Statcounter Global Stats",
        sourceUrl: "https://gs.statcounter.com/search-engine-market-share",
      },
    ],
    featuresHeading: "What's included in our conversion rate optimization",
    featuresSubtitle: "A data-driven program, not a one-time redesign on a hunch.",
    features: [
      {
        icon: BarChart3,
        title: "Data & analytics review",
        description:
          "We start in your analytics — GA4, Search Console, and your funnels — to find where visitors drop off and where the biggest, most winnable opportunities actually are.",
      },
      {
        icon: Search,
        title: "User-behaviour analysis",
        description:
          "We use heatmaps, session recordings, and form analytics to see what people actually do on your pages — the friction, confusion, and dead ends that numbers alone don't explain.",
      },
      {
        icon: Sparkles,
        title: "A/B & multivariate testing",
        description:
          "We form clear hypotheses and test them properly, so changes are proven to lift conversions before they ship — no guessing, no redesigning on opinion.",
      },
      {
        icon: FileText,
        title: "Landing-page & funnel optimization",
        description:
          "We sharpen the pages and steps that matter most — headlines, layout, forms, and calls to action — to remove friction and guide more visitors to convert.",
      },
      {
        icon: Users,
        title: "UX & messaging fixes",
        description:
          "We align what your page says with what your visitor wants, clarify the offer, and build the trust signals that turn hesitation into action.",
      },
      {
        icon: LineChart,
        title: "Reporting & iteration",
        description:
          "We report each test's result in plain language — what we tried, what it did to conversions and leads — and keep iterating, because CRO compounds over time.",
      },
    ],
    processHeading: "How we deliver CRO",
    process: [
      {
        step: "01",
        title: "Analyze",
        description:
          "We dig into your analytics and user behaviour to find where you're losing conversions and which fixes carry the most upside.",
      },
      {
        step: "02",
        title: "Hypothesize",
        description:
          "We turn findings into clear, testable hypotheses — specific changes with a reason to believe they'll lift conversions.",
      },
      {
        step: "03",
        title: "Test",
        description:
          "We run controlled A/B tests so we only keep changes that actually win, and discard the ones that don't — evidence over opinion.",
      },
      {
        step: "04",
        title: "Implement & repeat",
        description:
          "We ship the winners, measure the lift, and start the next test — a continuous cycle that keeps improving your conversion rate month over month.",
      },
    ],
    comparisonHeading: "NexFortis vs. a typical 'redesign' approach",
    comparison: [
      { feature: "Decisions", us: "Based on data and tests", them: "Based on opinion and trends" },
      { feature: "Changes", us: "Proven before they ship", them: "Shipped and hoped for" },
      { feature: "Focus", us: "Conversions and leads", them: "How it looks" },
      { feature: "Method", us: "Continuous testing cycle", them: "One big redesign, then nothing" },
      { feature: "Who does the work", us: "A senior consultant you can reach", them: "A rotating junior" },
      { feature: "Commitment", us: "Month-to-month — we earn the renewal", them: "Locked contracts" },
    ],
    pricingHeading: "What CRO costs",
    pricing: {
      fromLabel: "Priced by traffic, testing volume, and scope",
      note: (
        <>
          <p className="mb-4">
            CRO works best when you have enough traffic to run valid tests, so we scope it to your
            volume and how much testing and implementation you need. A low-traffic site may get more
            from a one-time conversion audit and fixes than an ongoing testing program.
          </p>
          <p>
            We&rsquo;ll be honest about which you need. Pricing is transparent with no long-term
            lock-in &mdash; ask for a free conversion audit and we&rsquo;ll show you the biggest wins
            and what they&rsquo;re worth.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "What is conversion rate optimization?",
        answer:
          "CRO is the practice of increasing the percentage of your visitors who take a desired action — filling a form, calling, or buying — without needing more traffic. It combines analytics, user-behaviour research, and controlled testing to find and fix what's stopping people from converting, so you get more results from the visitors you already have.",
      },
      {
        question: "How does CRO actually work?",
        answer:
          "It's a cycle: analyze the data to find where visitors drop off, form a hypothesis about why, test a change against the original, and keep whatever wins. Then repeat. The discipline is what makes it work — decisions come from evidence, not opinion, so you stop guessing and start compounding small, proven gains.",
      },
      {
        question: "Do I have enough traffic for CRO?",
        answer:
          "A/B testing needs a reasonable volume of visitors and conversions to reach statistical confidence, so very low-traffic sites get less from formal testing. But CRO isn't only testing — a conversion audit, analytics review, and UX fixes deliver value at almost any traffic level. We'll tell you honestly which approach fits your situation.",
      },
      {
        question: "How much does CRO cost?",
        answer:
          "It depends on your traffic, how much testing you want, and how much implementation we handle. A one-time conversion audit with prioritised fixes is very different from an ongoing testing program. We scope and price it transparently after a free audit, with no long-term lock-in.",
      },
      {
        question: "How long until I see results from CRO?",
        answer:
          "Some fixes — a clearer call to action, a faster page, a simpler form — can lift conversions almost immediately. Formal A/B tests need to run long enough to reach confidence, usually a few weeks each. CRO is a compounding program: individual wins add up, and the gains stick because they're tied to your real visitors.",
      },
    ],
    authorNote: (
      <p>
        Hassan leads conversion rate optimization at NexFortis, helping Canadian businesses turn more
        of their existing traffic into leads through data and testing rather than guesswork. As
        founder and CEO he stays hands-on with every engagement.
      </p>
    ),
    ctaHeading: "Turning enough of your traffic into leads?",
    ctaSubtext:
      "Get a free conversion audit — where you're losing visitors, the highest-impact fixes, and what lifting your conversion rate would be worth.",
  },

  // -------------------------------------------- ANALYTICS & REPORTING ----
  "reputation-management": {
    metaTitle: "Reputation Management Services in Canada",
    metaDescription:
      "Canadian reputation management company: more genuine reviews, professional responses, and content that outranks unfair results. Founder-led. Free audit.",
    h1: "Reputation Management Services for Canadian Businesses",
    heroSubtitle:
      "A Canadian reputation management company that turns reviews, search results, and brand mentions into an asset that earns trust — review generation, monitoring, and content that outranks unfair results, run as one senior-led program.",
    serviceType: "Online Reputation Management",
    serviceSchemaName: "Reputation Management Services",
    serviceSchemaDescription:
      "Reputation management for Canadian businesses — online reputation management, review generation and management, monitoring and response, content suppression, and brand reputation strategy, delivered as one founder-led program.",
    introHeading: "What NexFortis reputation management services include",
    intro: (
      <>
        <p>
          NexFortis is a Canadian <strong>reputation management company</strong> that helps business
          owners manage what customers find when they search their name. Our reputation management
          services turn search results, reviews, and brand mentions into an asset that builds trust and
          attracts customers, rather than driving them away.
        </p>
        <p>
          As a reputation management agency, we combine online reputation management, review generation,
          monitoring and response, content suppression, and brand reputation strategy into one connected
          program, led by a senior consultant rather than handed off to a junior. Your online reputation
          is the impression a prospective customer forms before they decide whether to call, buy, or move
          on &mdash; and most of it is shaped by sources you do not control: Google reviews, the first
          page of search results for your name, and third-party listings.
        </p>
        <p>
          A complete reputation management service is far more than asking for a few good reviews. Google
          weighs your review profile, your responses, and the content ranking for your brand together, so
          we run them as one connected program. Whether you need an online reputation management agency to
          handle everything end to end or focused help in one area, we scope the work to your situation
          &mdash; and run it alongside your{" "}
          <InlineLink href={localSeo.href}>{localSeo.linkText}</InlineLink> and the rest of your{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
      </>
    ),
    introCallout: (
      <CalloutBox>
        Our reputation management services fit Canadian businesses whose customers research them before
        they buy &mdash; local clinics, dental and law offices, restaurants and trades; professional and
        service firms whose name is the product; businesses recovering from a negative review or a
        damaging search result; and growing brands that want strong reviews and a clean first page before
        a problem ever appears.
      </CalloutBox>
    ),
    stats: [
      {
        value: "97%",
        label: "of consumers read reviews online before they choose a business.",
        sourceName: "BrightLocal Local Consumer Review Survey",
        sourceUrl: "https://www.brightlocal.com/research/local-consumer-review-survey/",
      },
      {
        value: "270%",
        label: "higher purchase likelihood for a product with five reviews than with none.",
        sourceName: "Spiegel Research Center, Northwestern",
        sourceUrl: "https://spiegel.medill.northwestern.edu/how-online-reviews-influence-sales/",
      },
      {
        value: "≈90%",
        label: "of worldwide search runs on Google — so page one for your name is your reputation.",
        sourceName: "Statcounter Global Stats",
        sourceUrl: "https://gs.statcounter.com/search-engine-market-share",
      },
    ],
    featuresHeading: "Our reputation management services",
    featuresSubtitle:
      "The full range of reputation management services under one roof — built to earn trust and protect it.",
    features: [
      {
        icon: Search,
        title: "Online reputation management (ORM)",
        description:
          "Our online reputation management services give you a single, coordinated view of how your business appears across reviews, search results, and social platforms — and a plan to improve it.",
      },
      {
        icon: Star,
        title: "Review generation & management",
        description:
          "We implement compliant, sustainable strategies to earn more genuine reviews from satisfied customers, and help you manage your review profile across the platforms that matter — including ongoing Google review building.",
      },
      {
        icon: Users,
        title: "Review monitoring & response",
        description:
          "We monitor new reviews and brand mentions as they appear and help you respond promptly and professionally — turning a critical review into a visible demonstration that you take customers seriously.",
      },
      {
        icon: FileText,
        title: "Suppression of negative or harmful content",
        description:
          "When unfair, outdated, or harmful content ranks for your name, we push it down with stronger, legitimate content that outranks it over time — an honest, durable approach, never tricks that do not last.",
      },
      {
        icon: Building2,
        title: "Brand reputation strategy",
        description:
          "Beyond fixing problems, we build a proactive brand reputation management plan: the owned profiles, content, and review momentum that make your brand resilient, so a single bad day does not define how you look online.",
      },
    ],
    processHeading: "Our reputation management process",
    process: [
      {
        step: "01",
        title: "Free reputation management audit",
        description:
          "A no-obligation review of your reviews, your branded search results, your social mentions, and any negative or harmful content — an honest baseline before any investment.",
      },
      {
        step: "02",
        title: "Strategy",
        description:
          "The audit informs a prioritized plan: where to generate reviews, what to monitor, how to respond, which negative content to address, and the brand assets to build.",
      },
      {
        step: "03",
        title: "Execution",
        description:
          "Our in-house team launches your review strategy, sets up monitoring and response, and creates the positive content that improves how you appear. No outsourcing.",
      },
      {
        step: "04",
        title: "Monthly reporting",
        description:
          "Clear, plain-language reporting on review volume and ratings, branded search results, mentions handled, and content in progress, with continuous optimization.",
      },
    ],
    comparisonHeading: "Why choose NexFortis for reputation management",
    comparison: [
      { feature: "Who does the work", us: "A senior consultant, founder-led end-to-end", them: "A rotating junior account manager" },
      { feature: "Approach", us: "Genuine reviews and stronger content that lasts", them: "Fake reviews and short-lived tricks" },
      { feature: "Honesty", us: "No promise to delete legitimate content", them: "'Guaranteed removal' claims" },
      { feature: "Integration", us: "Tied to local SEO and your brand voice", them: "An isolated reviews tool" },
      { feature: "Commitment", us: "Month-to-month — no lock-in", them: "Locked contracts" },
    ],
    pricingHeading: "Reputation management pricing after a free audit",
    pricing: {
      fromLabel: "Scoped to your starting point",
      note: (
        <>
          <p className="mb-4">
            We don&rsquo;t publish fixed reputation management prices, because what you need depends on
            where you&rsquo;re starting from &mdash; the state of your reviews, what ranks for your name,
            how much negative content exists, and how much you want to build proactively.
          </p>
          <p>
            After your free audit we present clear options matched to the scope of work, with no hidden
            fees and no long-term lock-in &mdash; from focused review generation to ongoing monthly online
            reputation management.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "What is a reputation management service?",
        answer:
          "A reputation management service monitors and improves how your business appears online — across reviews, search results, and brand mentions. At NexFortis it includes online reputation management, review generation and management, monitoring and response, suppression of negative or harmful content, and a proactive brand reputation strategy, backed by monthly reporting.",
      },
      {
        question: "How much does reputation management cost?",
        answer:
          "Reputation management pricing varies with your starting point — the state of your reviews, what ranks for your name, and how much negative content exists — so we scope every engagement after a free audit rather than quoting a one-size-fits-all price.",
      },
      {
        question: "How much does an ORM campaign typically cost?",
        answer:
          "Online reputation management (ORM) costs depend on scope. A focused review-generation program and a full ORM campaign that also addresses negative search results are very different in effort, so we quote ORM after the free audit shows what your situation requires.",
      },
      {
        question: "How much do reputation management companies charge?",
        answer:
          "It varies widely by what is involved and by the company. Rather than a flat published rate, NexFortis scopes the work after a free audit — transparent pricing, a fixed monthly scope, and month-to-month terms — so you pay for the work your reputation actually needs.",
      },
      {
        question: "Can you remove negative reviews or content?",
        answer:
          "We cannot promise to delete a legitimate review or remove content we do not control, and any company that guarantees it is not being honest. What we can do is respond professionally, earn more genuine positive reviews, and build stronger content that outranks unfair or outdated results over time.",
      },
    ],
    authorNote: (
      <p>
        Your reputation program is led personally by Hassan Sadiq, NexFortis Founder and CEO &mdash;
        never handed off to a junior. Hassan brings 15+ years in enterprise technology, and NexFortis is
        a certified Microsoft Solutions Partner, so the search and content side of brand reputation
        management is handled with genuine technical depth. A small senior team owns your program
        end-to-end.
      </p>
    ),
    ctaHeading: "Want to control what customers find when they search you?",
    ctaSubtext:
      "Book a free, no-obligation reputation management audit — an honest assessment of where your reputation stands and what it will take to strengthen it.",
  },
};
