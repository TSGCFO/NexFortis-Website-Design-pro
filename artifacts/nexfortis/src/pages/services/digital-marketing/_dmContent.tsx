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
      "Canadian content marketing agency — strategy, SEO blog writing, web copy, video, and B2B content that builds authority. Founder-led. Free consultation.",
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
        accountability for every link — the calibre you want from the best link building service. A small senior team owns your campaign end-to-end.
      </p>
    ),
    ctaHeading: "Ready to compete on authority?",
    ctaSubtext:
      "Book a free, no-obligation link building audit — an honest assessment of where your authority stands and what it will take to grow.",
  },
  "google-ads-ppc": {
    metaTitle: "Google Ads & PPC Management in Canada",
    metaDescription:
      "Canadian Google Ads agency and PPC management — search, Shopping, Performance Max, Local Service Ads. Google Partner, founder-led. Free PPC audit.",
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
        businesses already running ads that want a ppc management services partner to fix the leaks, plus companies that want one accountable ppc company managing paid search.
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
      "The full range of google ads management services under one roof — these google ppc services scale from a single search campaign to a full multi-channel account.",
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
      { feature: "Credentials", us: "Google Partner — a ppc advertising agency run to Google's standards", them: "Unvetted, set-and-forget" },
      { feature: "Accountability", us: "A results-focused ppc marketing agency tied to conversions, not clicks", them: "Clicks and impressions for their own sake" },
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
    metaTitle: "Social Media Marketing Services in Canada",
    metaDescription:
      "Canadian social media marketing agency — strategy, content, community management, and paid social on Instagram, Facebook, LinkedIn & TikTok. Free consultation.",
    h1: "Social Media Marketing Services for Canadian Businesses",
    heroSubtitle:
      "A Canadian social media marketing company that turns your channels into real brand awareness, engagement, and leads — strategy, content, community management, and paid social, run as one senior-led campaign.",
    serviceType: "Social Media Marketing",
    serviceSchemaName: "Social Media Marketing Services",
    serviceSchemaDescription:
      "Social media marketing for Canadian businesses — strategy, content creation, community management, paid social advertising, platform management, and analytics, delivered as one founder-led campaign.",
    introHeading: "What NexFortis social media marketing services include",
    intro: (
      <>
        <p>
          NexFortis is a Canadian <strong>social media marketing company</strong> that helps business
          owners turn their social channels into a real source of brand awareness, engagement, and leads
          &mdash; not just a feed that goes quiet for weeks at a time. Our social media marketing services
          bring strategy, content, community management, and paid social advertising together into one
          campaign, led by a senior consultant rather than handed off to a junior.
        </p>
        <p>
          The reach is enormous, and done well, social media marketing does two jobs at once: it keeps
          your brand visible to people who are not ready to buy yet, and it drives action from those who
          are. As a social media marketing agency, we focus on the platforms where your customers actually
          spend their time and on outcomes that matter &mdash; followers who become enquiries, posts that
          earn engagement, and ad spend that produces a return.
        </p>
        <p>
          A complete social media marketing service is more than scheduling a few posts: it connects
          strategy, a consistent content stream, active community management, and measurement that ties
          activity back to results. As a Canadian-based company that knows the GTA and serves businesses
          across Ontario and the rest of Canada, we understand how Canadian audiences engage &mdash; part
          of why owners choose NexFortis over generic, far-removed social media marketing companies. It
          runs alongside the rest of your{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
      </>
    ),
    introCallout: (
      <CalloutBox>
        Our social media marketing services fit Canadian businesses that want their social channels to do
        real work &mdash; small businesses that want professional management without a full in-house team;
        B2B companies that need a credible, consistent presence (often on LinkedIn); local and service
        businesses that want to stay visible in their community; eCommerce and consumer brands that need
        content plus paid social; and businesses whose accounts have gone quiet and need a partner to bring
        them back to life.
      </CalloutBox>
    ),
    stats: [
      {
        value: "5.79B",
        label: "social media user identities worldwide — more than two in three people on Earth.",
        sourceName: "DataReportal / Kepios",
        sourceUrl: "https://datareportal.com/social-media-users",
      },
      {
        value: "18h 36m",
        label: "the typical user spends on social media each week — your audience is already there.",
        sourceName: "DataReportal, Digital 2026 Global Overview",
        sourceUrl: "https://datareportal.com/reports/digital-2026-global-overview-report",
      },
      {
        value: "29.7%",
        label: "of internet users discover new brands and products through social media ads.",
        sourceName: "DataReportal / GWI",
        sourceUrl: "https://datareportal.com/reports/digital-2025-sub-section-brand-discovery",
      },
    ],
    featuresHeading: "Our social media marketing services",
    featuresSubtitle:
      "The full range of social media marketing services under one roof — strategy through paid social.",
    features: [
      {
        icon: Sparkles,
        title: "Social media strategy",
        description:
          "Every engagement starts with a plan, not a posting schedule. We define your goals, audience, and positioning, choose the right platforms, and set the content themes and cadence that fit your customers — so the work has direction.",
      },
      {
        icon: PenTool,
        title: "Content creation",
        description: (
          <>
            We plan, write, and design the posts, graphics, and short-form content that carry your brand —
            built for each platform rather than copy-pasted across all of them. Strong social content also
            feeds your{" "}
            <InlineLink href={contentMarketing.href}>{contentMarketing.linkText}</InlineLink>.
          </>
        ),
      },
      {
        icon: Users,
        title: "Account & community management",
        description: (
          <>
            We manage your accounts day to day — publishing on schedule, responding to comments and
            messages, and engaging your audience so your channels feel active and human. It is also where
            brand reputation is built or lost, which connects to our{" "}
            <InlineLink href={getDmSpoke("reputation-management").href}>
              {getDmSpoke("reputation-management").linkText}
            </InlineLink>{" "}
            work.
          </>
        ),
      },
      {
        icon: LineChart,
        title: "Paid social advertising",
        description: (
          <>
            Organic reach only goes so far, so we plan and manage paid social advertising — targeting,
            creative, and budget — to put your best content in front of the right people. If search ads are
            also part of your mix, we run them through our{" "}
            <InlineLink href={getDmSpoke("google-ads-ppc").href}>
              {getDmSpoke("google-ads-ppc").linkText}
            </InlineLink>{" "}
            service.
          </>
        ),
      },
      {
        icon: Share2,
        title: "Platform management (Instagram, Facebook, LinkedIn, TikTok)",
        description:
          "We manage the platforms that fit your business — Instagram, Facebook, LinkedIn, and TikTok among them — and we are honest about which are worth your time. We would rather you do two platforms well than spread thin across six.",
      },
      {
        icon: BarChart3,
        title: "Analytics & reporting",
        description:
          "We track the metrics that matter — reach, engagement, audience growth, and the actions that follow — and report them in plain language each month, so you always know what is working.",
      },
    ],
    processHeading: "Our social media marketing process",
    process: [
      {
        step: "01",
        title: "Free consultation",
        description:
          "A no-obligation review of your channels, content, audience, and competitors — an honest baseline before any investment.",
      },
      {
        step: "02",
        title: "Strategy",
        description:
          "The consultation informs a prioritized plan: the right platforms, content themes and cadence, community-management approach, and where (and whether) paid social fits your goals and budget.",
      },
      {
        step: "03",
        title: "Execution",
        description:
          "Our in-house team creates content, publishes on schedule, manages your community, and runs any paid campaigns. No outsourcing, no hand-off.",
      },
      {
        step: "04",
        title: "Monthly reporting",
        description:
          "Clear, plain-language reporting on reach, engagement, audience growth, and the actions that follow, with continuous optimization as results develop.",
      },
    ],
    comparisonHeading: "Why choose NexFortis for social media marketing",
    comparison: [
      { feature: "Who does the work", us: "A senior team, founder-led — real attention", them: "A rotating cast of generalists" },
      { feature: "Approach", us: "Every channel on a plan tied to your goals", them: "Posting for its own sake" },
      { feature: "Focus", us: "Two platforms done well", them: "Spread thin across six" },
      { feature: "Integration", us: "Tied to content, ads, and reputation", them: "An isolated posting tool" },
      { feature: "Commitment", us: "Month-to-month — no lock-in", them: "Locked contracts" },
    ],
    pricingHeading: "Social media marketing pricing after a free consultation",
    pricing: {
      fromLabel: "Scoped to your platforms",
      note: (
        <>
          <p className="mb-4">
            We don&rsquo;t publish fixed social media marketing prices, because effective social is scoped
            to the platforms you need, the volume of content, whether paid social is involved, and your
            growth goals &mdash; which is why a consultation comes first. Any paid social ad budget is
            separate and goes directly to the platforms.
          </p>
          <p>
            After your free consultation, we present clear options aligned to the scope of work, with no
            hidden fees and no long-term lock-in &mdash; from organic-only content and community management
            to full programs that add paid social advertising.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "What are social media marketing services?",
        answer:
          "They cover the strategy, content creation, community management, paid social advertising, and analytics needed to build and run your presence on platforms like Instagram, Facebook, LinkedIn, and TikTok. NexFortis delivers all of it as one connected service, backed by monthly reporting.",
      },
      {
        question: "How much does social media marketing cost?",
        answer:
          "Pricing varies by the number of platforms, the volume of content, whether paid social is involved, and your goals — which is why we scope every engagement after a free consultation rather than quoting a one-size-fits-all price. Any ad spend is separate and goes directly to the platforms.",
      },
      {
        question: "Is it worth paying for social media marketing?",
        answer:
          "For most businesses, yes — when it is done with a strategy. Consistent, on-brand content and active community management build visibility and trust over time, and paid social can accelerate results — but only if the work is planned and measured rather than posted at random.",
      },
      {
        question: "How is a social media marketing agency different from doing it in-house?",
        answer:
          "An agency brings strategy, consistent execution, and measurement an overstretched in-house team often cannot sustain. NexFortis can run your social entirely or support an existing team — and either way, a senior consultant stays on your account end to end.",
      },
      {
        question: "Which social media platforms should my business be on?",
        answer:
          "It depends on where your customers are and what you sell. Rather than spreading you across every network, we focus on the platforms — Instagram, Facebook, LinkedIn, or TikTok — that fit your audience, then expand when it makes sense.",
      },
      {
        question: "How long does social media marketing take to show results?",
        answer:
          "Social media marketing is a months-not-weeks discipline. Building an engaged audience takes consistency over time, so we set realistic expectations up front rather than promising a fixed number of followers or sales by a fixed date.",
      },
    ],
    authorNote: (
      <p>
        Your campaign is guided personally by Hassan Sadiq, NexFortis Founder and CEO, with a small senior
        team &mdash; the attention larger social media marketing companies rarely give a small or mid-sized
        account. With 15+ years in enterprise technology and as a certified Microsoft Solutions Partner, the
        measurement and tooling behind your campaigns is handled with genuine technical depth.
      </p>
    ),
    ctaHeading: "Ready for social channels that do real work?",
    ctaSubtext:
      "Book a free, no-obligation social media marketing consultation — an honest assessment of where your social presence stands and what it will take to grow.",
  },
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
    metaTitle: "Email Marketing Services in Canada",
    metaDescription:
      "Canadian email marketing company — campaigns, automation, list growth, and deliverability that turn your list into revenue. Founder-led. Free email audit.",
    h1: "Email Marketing Services for Canadian Businesses",
    heroSubtitle:
      "A Canadian email marketing company that turns your list into a dependable channel for leads, repeat sales, and loyalty — campaign management, automation, list growth, and deliverability, run as one senior-led programme.",
    serviceType: "Email Marketing",
    serviceSchemaName: "Email Marketing Services",
    serviceSchemaDescription:
      "Email marketing for Canadian businesses — campaign management, automation and lifecycle flows, list building and segmentation, deliverability, and eCommerce email, delivered as one founder-led programme.",
    introHeading: "What NexFortis email marketing services include",
    intro: (
      <>
        <p>
          NexFortis is a Canadian <strong>email marketing company</strong> that helps business owners turn
          their list into a dependable channel for leads, repeat sales, and customer loyalty. Our email
          marketing services are built around outcomes that matter &mdash; clicks that turn into revenue
          and a list that grows in value over time, not vanity metrics.
        </p>
        <p>
          Email is still one of the highest-return channels a Canadian business can own &mdash; because
          you control it outright, with no algorithm between you and your customers. As an email marketing
          agency, we combine campaign management, automation, list growth, deliverability, and reporting
          into one connected programme, led by a senior consultant rather than handed to a junior or an
          offshore template mill.
        </p>
        <p>
          A complete email marketing service is far more than blasting a monthly newsletter to the whole
          list: strategy, list health, segmentation, automation, copy, and deliverability all work
          together, so we run them as one connected programme. As a Canadian-based company, we build
          programmes that respect Canadian anti-spam expectations and treat subscriber data with a
          privacy-first approach &mdash; part of the rest of your{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
      </>
    ),
    introCallout: (
      <CalloutBox>
        Our email marketing services fit Canadian businesses that want more from a channel they already
        own &mdash; small businesses that want effective small business email marketing without enterprise
        rates; eCommerce stores that need automated flows (abandoned cart, welcome, post-purchase); service
        and B2B firms that nurture leads over weeks; businesses sitting on a list they have never properly
        used; and companies whose email keeps landing in spam.
      </CalloutBox>
    ),
    stats: [
      {
        value: "$36 per $1",
        label: "average ROI of email — higher than any other channel.",
        sourceName: "Litmus",
        sourceUrl: "https://www.litmus.com/resources/email-marketing-roi",
      },
      {
        value: "4.59B",
        label: "email users worldwide — almost everyone you want to reach has an inbox.",
        sourceName: "Statista",
        sourceUrl: "https://www.statista.com/topics/1446/e-mail-marketing/",
      },
      {
        value: "+114%",
        label: "higher click-through (and +75% opens) for automated campaigns vs. manual sends.",
        sourceName: "EmailTooltester",
        sourceUrl: "https://www.emailtooltester.com/en/blog/email-marketing-roi/",
      },
    ],
    featuresHeading: "Our email marketing services",
    featuresSubtitle:
      "The full range of email marketing services under one roof — from one-time automation builds to ongoing programmes.",
    features: [
      {
        icon: Sparkles,
        title: "Email campaign management",
        description:
          "We plan, write, design, build, schedule, and send your campaigns — promotions, announcements, and seasonal pushes — then report on what each one earned, so every send has a purpose.",
      },
      {
        icon: Bot,
        title: "Email marketing automation & lifecycle flows",
        description:
          "This is where email earns its keep. We design and build the email marketing automation that works while you sleep — welcome series, abandoned-cart recovery, post-purchase follow-ups, and re-engagement flows triggered by what each subscriber does.",
      },
      {
        icon: Users,
        title: "List building & segmentation",
        description:
          "A list is only as valuable as it is healthy and well-organized. We help you grow it with compliant opt-in capture, clean and de-duplicate it, and segment it by behaviour, interest, and purchase history.",
      },
      {
        icon: PenTool,
        title: "Newsletters & broadcasts",
        description: (
          <>
            We turn the recurring newsletter from a chore into a relationship-builder — consistent,
            on-brand broadcasts that keep you top of mind and drive traffic back to your offers and{" "}
            <InlineLink href={contentMarketing.href}>{contentMarketing.linkText}</InlineLink>.
          </>
        ),
      },
      {
        icon: Gauge,
        title: "Deliverability optimization",
        description:
          "None of it matters if your email lands in spam. We handle the technical foundation behind the inbox — authentication (SPF, DKIM, DMARC), sender reputation, and list hygiene — so more of your email reaches the inbox.",
      },
      {
        icon: BarChart3,
        title: "eCommerce email",
        description:
          "For online stores, we connect email to your store and catalogue — automated flows, product recommendations, and segmented campaigns built to recover carts and turn buyers into repeat customers.",
      },
    ],
    processHeading: "Our email marketing process",
    process: [
      {
        step: "01",
        title: "Free email marketing audit",
        description:
          "A no-obligation review of your list health, current campaign and automation performance, segmentation, deliverability, and platform — an honest baseline before any investment.",
      },
      {
        step: "02",
        title: "Strategy",
        description:
          "The audit informs a prioritized plan: the segments to build, the automation flows that will earn the most, the campaign calendar, and the deliverability fixes to make first.",
      },
      {
        step: "03",
        title: "Execution",
        description:
          "Our in-house team builds campaigns, automation flows, segmentation, and the deliverability foundation. No outsourcing.",
      },
      {
        step: "04",
        title: "Monthly reporting & optimization",
        description:
          "Clear, plain-language reporting on the metrics that matter — list growth, deliverability, opens, clicks, and revenue per send — with continuous testing as the programme matures.",
      },
    ],
    comparisonHeading: "Why choose NexFortis for email marketing",
    comparison: [
      { feature: "Who does the work", us: "A senior team, founder-led end-to-end", them: "A rotating cast of generalists" },
      { feature: "Deliverability", us: "SPF, DKIM, DMARC, and sender reputation handled", them: "Send and hope" },
      { feature: "Compliance", us: "Canadian anti-spam, privacy-first data handling", them: "Generic global blasts" },
      { feature: "Automation", us: "Lifecycle flows that earn while you sleep", them: "Manual one-off newsletters" },
      { feature: "Commitment", us: "Month-to-month — no lock-in", them: "Locked contracts" },
    ],
    pricingHeading: "Email marketing pricing after a free audit",
    pricing: {
      fromLabel: "Scoped to your list",
      note: (
        <>
          <p className="mb-4">
            We don&rsquo;t publish fixed email marketing prices, because effective email is scoped to your
            list size, the number of automation flows and campaigns you need, your platform, and your
            growth goals &mdash; which is why a meaningful audit comes first.
          </p>
          <p>
            After your free audit we present clear options aligned to the scope of work, with no hidden
            fees and no long-term lock-in &mdash; from a one-time automation build or deliverability fix to
            an ongoing monthly programme.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "How much do email marketing services cost?",
        answer:
          "Email marketing pricing varies by list size, the number of automation flows and campaigns, your platform, and scope — which is why we scope every engagement after a free audit rather than quoting a one-size-fits-all price. We structure plans to be accessible for small businesses and scalable as your list grows.",
      },
      {
        question: "What is the best email marketing service?",
        answer:
          "The best service for your business depends on your list size, your goals, and whether you sell online or generate leads — there is no single right answer for everyone. We are platform-agnostic: in the free audit we assess what you use today and recommend the right fit.",
      },
      {
        question: "How much does it cost to send 10,000 emails?",
        answer:
          "Sending cost depends almost entirely on your email platform's pricing, which is usually tied to your number of subscribers rather than charged per send. The bigger driver of value is not the cost to send but the quality of the list, the segmentation, and the automation behind each send.",
      },
      {
        question: "How much is a 1,000-person email list worth?",
        answer:
          "A list's value is not fixed — it depends on how engaged, well-segmented, and deliverable it is, and on how well your campaigns convert it. A small, engaged list of buyers can outperform a large, neglected one, which is what list building and segmentation improve.",
      },
      {
        question: "What is the 80/20 rule in email marketing?",
        answer:
          "A common guideline is to keep roughly 80% of your email genuinely useful to the reader — helpful content and relevant offers — and reserve about 20% for direct selling. We build campaign calendars around that balance so your audience stays engaged.",
      },
      {
        question: "Do you offer email marketing for small businesses?",
        answer:
          "Yes. We scope small business email marketing so the work — and the pricing — fits a smaller list and budget, focusing first on the automation and clean-up that deliver the fastest return.",
      },
    ],
    authorNote: (
      <p>
        Your programme is led personally by Hassan Sadiq, NexFortis Founder and CEO &mdash; not a rotating
        cast of generalists. Deliverability is a technical problem as much as a creative one, and as a
        certified Microsoft Solutions Partner with 15+ years in enterprise technology, Hassan brings
        genuine depth to authentication, sender reputation, and the integration between your email
        platform, store, and CRM. A small senior team owns your programme end-to-end.
      </p>
    ),
    ctaHeading: "Ready to make your list pull its weight?",
    ctaSubtext:
      "Book a free, no-obligation email marketing audit — an honest assessment of where your email programme stands and what it will take to grow.",
  },
  "conversion-rate-optimization": {
    metaTitle: "Conversion Rate Optimization Services",
    metaDescription:
      "Canadian CRO company — data analysis, A/B testing, and conversion-centred design that turn more of your traffic into leads and sales. Free conversion audit.",
    h1: "Conversion Rate Optimization Services for Canadian Businesses",
    heroSubtitle:
      "A Canadian conversion rate optimization company that gets more from the traffic you already have — data analysis, A/B testing, conversion-centred design, and user-behaviour insight, run as one disciplined, evidence-led programme.",
    serviceType: "Conversion Rate Optimization",
    serviceSchemaName: "Conversion Rate Optimization Services",
    serviceSchemaDescription:
      "Conversion rate optimization for Canadian businesses — conversion audits and data analysis, A/B and multivariate testing, conversion-centred design, UX and funnel analysis, heatmaps, personalization, and eCommerce CRO, delivered as one founder-led programme.",
    introHeading: "What NexFortis conversion rate optimization services include",
    intro: (
      <>
        <p>
          NexFortis is a Canadian <strong>conversion rate optimization company</strong> that helps
          businesses get more from the traffic they already have &mdash; turning visitors into leads,
          calls, and sales instead of paying for more clicks to plug the same leaks. As a conversion rate
          optimization agency, we combine data analysis, A/B testing, conversion-centred design, and
          user-behaviour insight into one disciplined programme, led by a senior consultant rather than
          handed off to a junior.
        </p>
        <p>
          Conversion rate optimization is a data-driven discipline, not a redesign on a hunch. Instead of
          asking how to get more traffic, CRO asks a sharper question: of the people already arriving, why
          aren&rsquo;t more of them converting? We study how real people move through your site, form clear
          hypotheses about what is holding them back, test the changes, and keep what wins. Whether you
          need a conversion rate optimization consultant to guide your in-house team or a full-service
          partner end to end, we scope the work to where your funnel is actually losing people.
        </p>
        <p>
          A complete conversion rate optimization service connects your analytics, user-behaviour data,
          testing programme, and page design into one feedback loop. As a Canadian-based company that
          knows the GTA, we tie CRO to the rest of your funnel &mdash; from the{" "}
          <InlineLink href={seo.href}>{seo.linkText}</InlineLink> and{" "}
          <InlineLink href={getDmSpoke("google-ads-ppc").href}>
            {getDmSpoke("google-ads-ppc").linkText}
          </InlineLink>{" "}
          that bring visitors in to the{" "}
          <InlineLink href={getDmSpoke("web-design").href}>{getDmSpoke("web-design").linkText}</InlineLink>{" "}
          that frames it &mdash; across your{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
      </>
    ),
    introCallout: (
      <CalloutBox>
        Our conversion rate optimization services fit Canadian businesses that want more from the visitors
        they already attract &mdash; businesses investing in SEO or paid ads that want to convert more of
        that traffic; eCommerce stores losing sales to cart and checkout abandonment; lead-gen and service
        businesses whose forms or booking flows underperform; B2B companies with longer funnels; and
        businesses with enough traffic to test but no disciplined programme to act on it.
      </CalloutBox>
    ),
    stats: [
      {
        value: "6.6%",
        label: "median landing-page conversion rate — most of the traffic you pay for never converts.",
        sourceName: "Unbounce, Conversion Benchmark (Q4 2024)",
        sourceUrl: "https://unbounce.com/average-conversion-rates-landing-pages/",
      },
      {
        value: "67.6%",
        label: "of all CRO experiments practitioners run are A/B tests — the workhorse of the discipline.",
        sourceName: "Convert, 2026",
        sourceUrl: "https://www.convert.com/blog/a-b-testing/ab-testing-stats/",
      },
      {
        value: "70.22%",
        label: "average online cart abandonment — recovering a fraction beats chasing new traffic.",
        sourceName: "Baymard Institute",
        sourceUrl: "https://baymard.com/lists/cart-abandonment-rate",
      },
    ],
    featuresHeading: "Our conversion rate optimization services",
    featuresSubtitle:
      "The full range of conversion rate optimization services under one roof — evidence-led, not opinion-led.",
    features: [
      {
        icon: BarChart3,
        title: "Conversion audit & data analysis",
        description:
          "Every programme starts with the data. We dig into your analytics to find where visitors enter, stall, and abandon — quantifying the gap between the traffic you have and the conversions you are getting, so the work targets your biggest opportunities first.",
      },
      {
        icon: LineChart,
        title: "A/B & multivariate testing",
        description:
          "We design, run, and measure controlled experiments so changes are validated against real visitor behaviour rather than opinion. Winners get rolled out; losers inform the next test.",
      },
      {
        icon: PenTool,
        title: "Conversion-centred design",
        description:
          "We redesign pages, calls to action, and layouts around a single goal: making the next step obvious and frictionless. Every element earns its place by helping the visitor convert.",
      },
      {
        icon: Gauge,
        title: "UX & funnel analysis",
        description:
          "We map the full path from arrival to conversion, find the steps that lose the most people, and remove the friction — confusing navigation, unclear messaging, overlong forms, slow pages — that quietly costs you customers.",
      },
      {
        icon: Search,
        title: "Heatmaps & user-behaviour analytics",
        description:
          "Click maps, scroll maps, and session recordings show what visitors actually do — where they look, where they get stuck, and where they give up — turning guesses into evidence we can act on.",
      },
      {
        icon: Users,
        title: "Personalization",
        description:
          "Where the data supports it, we tailor messaging and offers to different audiences and intents, so more visitors see the version most likely to convert them.",
      },
      {
        icon: Sparkles,
        title: "eCommerce CRO",
        description:
          "For online stores, we optimize product pages, cart, and checkout to reduce abandonment and lift completed purchases — connecting the on-page experience to the rest of your store.",
      },
    ],
    processHeading: "Our conversion rate optimization process",
    process: [
      {
        step: "01",
        title: "Free conversion rate optimization audit",
        description:
          "A no-obligation review of your analytics, funnel, key conversion paths, and current performance — an honest baseline that identifies where the biggest gains likely are before any investment.",
      },
      {
        step: "02",
        title: "Strategy",
        description:
          "The audit informs a prioritized plan: the pages and steps to tackle first, the hypotheses worth testing, the metrics that define success, and a realistic view of what your traffic can validate.",
      },
      {
        step: "03",
        title: "Execution",
        description:
          "Our in-house team builds experiments, redesigns pages around conversion, fixes funnel friction, and instruments the tracking needed to measure it. No outsourcing.",
      },
      {
        step: "04",
        title: "Monthly reporting & ongoing optimization",
        description:
          "Clear reporting on what we tested, what won, and what it meant for your conversion rate — then we feed those learnings into the next round, because CRO is a cycle, not a one-time project.",
      },
    ],
    comparisonHeading: "Why choose NexFortis for conversion rate optimization",
    comparison: [
      { feature: "Who does the work", us: "A dedicated CRO consultant, founder-led end-to-end", them: "A rotating junior account manager" },
      { feature: "Decisions", us: "Data and controlled testing — if it can't be measured, it doesn't ship", them: "Redesigns based on a hunch" },
      { feature: "Honesty", us: "No invented uplift percentages or guaranteed rates", them: "Guaranteed-conversion claims" },
      { feature: "Integration", us: "Tied to SEO, Google Ads, and web design", them: "An isolated testing tool" },
      { feature: "Commitment", us: "Month-to-month — no lock-in", them: "Locked contracts" },
    ],
    pricingHeading: "Conversion rate optimization pricing after a free audit",
    pricing: {
      fromLabel: "Scoped to your traffic",
      note: (
        <>
          <p className="mb-4">
            We don&rsquo;t publish fixed conversion rate optimization prices, because effective CRO is
            scoped to your traffic volume, the complexity of your funnel, the testing programme involved,
            and your goals &mdash; which is why a meaningful audit comes first.
          </p>
          <p>
            After your free audit, we present clear options aligned to the scope of work, with no hidden
            fees and no long-term lock-in &mdash; from a focused conversion audit to an ongoing monthly
            testing programme.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "What is conversion rate optimization?",
        answer:
          "Conversion rate optimization is the data-driven practice of increasing the percentage of your website visitors who complete a desired action — a purchase, a form submission, a call, or a sign-up. Rather than chasing more traffic, it improves how much of your existing traffic converts, using analytics, user-behaviour data, and controlled testing.",
      },
      {
        question: "How much do conversion rate optimization services cost?",
        answer:
          "CRO pricing varies by your traffic volume, the complexity of your funnel, and the scope of testing involved, which is why we scope every engagement after a free audit rather than quoting a one-size-fits-all price. You can start with a focused audit or move into an ongoing monthly programme.",
      },
      {
        question: "What is A/B testing, and how does it work?",
        answer:
          "A/B testing compares two versions of a page or element — an original and a variation — by splitting your traffic between them and measuring which drives more conversions. For example, you might test two headlines or call-to-action buttons; the version that converts more visitors wins, based on real behaviour rather than opinion.",
      },
      {
        question: "Do I need a lot of traffic for CRO to work?",
        answer:
          "CRO works best when there is enough traffic for tests to reach reliable results, but lower-traffic sites can still benefit from audit-driven fixes, funnel analysis, and qualitative tools like heatmaps and session recordings. Part of our job is being honest about what your current volume can prove and sequencing the work accordingly.",
      },
      {
        question: "How long does conversion rate optimization take to show results?",
        answer:
          "CRO is an ongoing, months-not-weeks discipline. Some quick fixes can help early, but durable gains come from running a steady cycle of tests, so we set realistic expectations up front rather than promising a fixed result by a specific date.",
      },
      {
        question: "How is a conversion rate optimization agency different from a web design agency?",
        answer:
          "A conversion rate optimization agency focuses on measuring and improving how well your existing pages convert, using analytics and testing to validate every change; a web design agency focuses on building the site. NexFortis does both and connects them, so your design decisions are backed by conversion data.",
      },
    ],
    authorNote: (
      <p>
        Your programme is guided personally by Hassan Sadiq, NexFortis Founder and CEO, with a small senior
        team &mdash; a dedicated CRO consultant who stays with your account end to end. With 15+ years in
        enterprise technology and as a certified Microsoft Solutions Partner, the analytics, testing, and
        implementation side of CRO is handled with genuine technical depth. Decisions are made with
        evidence, not opinion.
      </p>
    ),
    ctaHeading: "Ready to convert more of the traffic you already have?",
    ctaSubtext:
      "Book a free, no-obligation conversion rate optimization audit — an honest assessment of where your conversions stand and what it will take to grow them.",
  },
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
