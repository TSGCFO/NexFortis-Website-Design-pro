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
    metaTitle: "Content Marketing Services",
    metaDescription:
      "Content marketing services for Canadian businesses: research-led articles, pillar pages, and topic clusters that rank, build authority, and get cited by AI.",
    h1: "Content Marketing Services That Earn Demand",
    heroSubtitle:
      "Research-led content that ranks, builds authority, and gets cited — not filler churned out to hit a word count.",
    serviceType: "Content Marketing",
    serviceSchemaName: "Content Marketing Services",
    serviceSchemaDescription:
      "Content marketing for Canadian businesses — content strategy, SEO articles, pillar pages and topic clusters, and content built to rank and earn AI citations.",
    introHeading: "Content that does a job, not content for its own sake",
    intro: (
      <>
        <p>
          Most content marketing fails for a boring reason: it is published to fill a calendar, not
          to answer a real question a buyer is asking. The internet is already drowning in that
          stuff, and AI can generate more of it by the second. What actually moves the needle is
          content thorough and useful enough that Google ranks it, readers trust it, and &mdash;
          increasingly &mdash; AI engines quote it.
        </p>
        <p>
          That is what we build. We start from what your customers are searching and the questions
          they ask before they buy, then produce the articles, pillar pages, and topic clusters that
          own those topics. It is the engine that makes{" "}
          <InlineLink href={seo.href}>{seo.linkText}</InlineLink> work &mdash; rankings need
          something worth ranking &mdash; and a core part of our{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
        <p>
          Every piece is tied to a goal: a keyword to win, a question to own, a stage of the buying
          journey to support. We would rather publish one page that ranks and converts than ten that
          quietly sink.
        </p>
      </>
    ),
    stats: [
      {
        value: "≈90%",
        label: "of global search runs on Google — where good content gets found.",
        sourceName: "Statcounter Global Stats",
        sourceUrl: "https://gs.statcounter.com/search-engine-market-share",
      },
      {
        value: "27.6%",
        label: "average click-through rate of the #1 organic result — the prize for content that ranks.",
        sourceName: "Backlinko, 4M-result CTR study",
        sourceUrl: "https://backlinko.com/google-ctr-stats",
      },
      {
        value: "≈16%",
        label: "of Google searches showed an AI Overview by late 2025 — and AI cites real content.",
        sourceName: "Semrush study, via Search Engine Land",
        sourceUrl: "https://searchengineland.com/google-ai-overviews-surge-pullback-data-466314",
      },
    ],
    featuresHeading: "What's included in our content marketing services",
    featuresSubtitle: "Strategy, production, and distribution — built around what your buyers search.",
    features: [
      {
        icon: Search,
        title: "Content strategy & topic clusters",
        description:
          "We map the topics your buyers search, group them into pillar-and-cluster structures, and prioritise by what you can realistically win — so every piece has a job instead of guessing at ideas.",
      },
      {
        icon: FileText,
        title: "SEO articles & guides",
        description:
          "We write research-led articles and guides that cover a topic thoroughly enough to outrank thinner competitors and stay useful for years, not weeks — the opposite of AI-spun filler.",
      },
      {
        icon: FileCode,
        title: "Pillar pages",
        description:
          "We build comprehensive pillar pages that establish your authority on a core topic and tie your cluster together with internal links — the structure Google and AI engines both reward.",
      },
      {
        icon: PenTool,
        title: "Blog & ongoing writing",
        description:
          "We keep a steady, planned cadence of posts going so your site keeps earning new rankings and gives returning visitors a reason to come back — consistency without the filler.",
      },
      {
        icon: Bot,
        title: "Content built for AI search",
        description:
          "We structure content into clear, self-contained passages with the right schema, so it is easy for AI engines to lift and cite — the content layer beneath strong Generative Engine Optimization.",
      },
      {
        icon: Share2,
        title: "Distribution & repurposing",
        description:
          "Good content is wasted if nobody sees it. We repurpose each piece across the channels your audience uses and feed it into email and social so one article works in several places.",
      },
    ],
    processHeading: "How we deliver content marketing",
    process: [
      {
        step: "01",
        title: "Strategy & research",
        description:
          "We research what your buyers search and ask, audit what you already have, and build a prioritised content plan mapped to real keywords and buying stages.",
      },
      {
        step: "02",
        title: "Create",
        description:
          "We produce research-led, genuinely useful pieces — drafted, edited, and fact-checked — with your review before anything publishes. No filler, no spun AI copy.",
      },
      {
        step: "03",
        title: "Optimize & publish",
        description:
          "We optimize each piece for search and AI, wire up internal links, and publish on a cadence you can sustain, so the library compounds over time.",
      },
      {
        step: "04",
        title: "Measure & refresh",
        description:
          "We track rankings, traffic, and leads per piece, refresh content that's slipping, and double down on the topics that are working.",
      },
    ],
    comparisonHeading: "NexFortis vs. a typical content shop",
    comparison: [
      { feature: "Content", us: "Research-led and genuinely useful", them: "AI-spun filler to hit a quota" },
      { feature: "Strategy", us: "Topic clusters mapped to keywords", them: "A random list of post ideas" },
      { feature: "Built for", us: "Search and AI citation", them: "A word count" },
      { feature: "Fact-checking", us: "Every claim verified or cut", them: "Whatever the AI wrote" },
      { feature: "Who does the work", us: "A senior consultant you can reach", them: "A rotating junior or offshore mill" },
      { feature: "Commitment", us: "Month-to-month — we earn the renewal", them: "Locked contracts" },
    ],
    pricingHeading: "What content marketing costs",
    pricing: {
      fromLabel: "Scaled to volume and depth",
      note: (
        <>
          <p className="mb-4">
            Cost depends on how much you publish and how deep each piece needs to be &mdash; a
            steady stream of focused articles is very different from a few comprehensive pillar
            pages. We price by the program, not by a per-word rate that rewards padding.
          </p>
          <p>
            You get a fixed monthly scope, transparent pricing, and no long-term lock-in. Ask for a
            free content assessment and we&rsquo;ll recommend the cadence and depth that fit your
            goals.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "What is content marketing?",
        answer:
          "Content marketing is the practice of earning customers by publishing genuinely useful content — articles, guides, pillar pages — instead of just buying their attention with ads. Done well, it ranks in search, builds trust over time, and increasingly gets cited by AI engines. It's a long-term asset: a good page keeps bringing in readers and leads for years.",
      },
      {
        question: "Why is content marketing important?",
        answer:
          "Because rankings need something worth ranking, and buyers research before they buy. Content is what answers their questions, earns their trust, and gives Google and AI engines a reason to point to you instead of a competitor. It also compounds — unlike ads, the work keeps paying off long after it's published.",
      },
      {
        question: "Does content marketing help my SEO and AI visibility?",
        answer:
          "Directly. Strong, well-structured content is the raw material SEO ranks and AI engines cite. We build content with both in mind — thorough enough to rank, and structured into clear passages with the right schema so AI tools can lift and quote it. It works hand in hand with our SEO and Generative Engine Optimization services.",
      },
      {
        question: "Do you write the content yourselves?",
        answer:
          "Yes. We research, draft, edit, and fact-check each piece, with your review before it publishes. We use AI as a tool where it helps, but we don't ship spun, unverified copy — every claim is checked against a real source or cut, because thin AI filler is exactly what Google's helpful-content system penalises.",
      },
      {
        question: "How long until content marketing works?",
        answer:
          "Like SEO, it's a compounding play rather than an instant one. Expect early traction on lower-competition topics within a few months and meaningful momentum around the six-month mark, building from there. We report rankings, traffic, and leads per piece so you can see it working along the way.",
      },
    ],
    authorNote: (
      <p>
        Hassan leads content strategy at NexFortis, helping Canadian businesses turn research-led
        content into rankings, trust, and leads. As founder and CEO he stays hands-on with every
        engagement &mdash; no spun copy, no hand-off to a junior.
      </p>
    ),
    ctaHeading: "Ready for content that actually earns its keep?",
    ctaSubtext:
      "Get a free content assessment — what's worth keeping, the gaps your competitors are filling, and the topics you can own.",
  },

  // ----------------------------------- LINK BUILDING & DIGITAL PR ----
  "link-building": {
    metaTitle: "Link Building & Digital PR",
    metaDescription:
      "White-hat link building and digital PR for Canadian businesses: earned editorial backlinks from real publications that build the authority behind your rankings.",
    h1: "Link Building & Digital PR Services",
    heroSubtitle:
      "Earn editorial backlinks from real publications — the off-site authority that still decides how high you can realistically rank.",
    serviceType: "Link Building",
    serviceSchemaName: "Link Building & Digital PR Services",
    serviceSchemaDescription:
      "White-hat link building and digital PR for Canadian businesses — backlink audits, editorial outreach, guest posting, and authority building that lifts rankings.",
    introHeading: "Authority is still earned through links",
    intro: (
      <>
        <p>
          Google has spent two decades treating links as votes. Despite every algorithm change, a
          page&rsquo;s backlink profile is still one of the clearest signals of how much authority it
          deserves &mdash; which is why the pages sitting at the top of competitive results almost
          always have more, and better, links behind them. If your content is strong but stuck on
          page two, a thin link profile is usually why.
        </p>
        <p>
          The catch is that the wrong kind of links &mdash; bought, spun, or farmed from private
          networks &mdash; now do more harm than good. We only build the kind that lasts: earned,
          editorial links from real publications and relevant sites, through digital PR, genuine
          outreach, and content worth linking to. It is the off-page half of{" "}
          <InlineLink href={seo.href}>{seo.linkText}</InlineLink> and part of our{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
        <p>
          Every campaign starts with an honest audit of your current profile and your competitors&rsquo;,
          so the links we pursue are the ones that will actually move your rankings &mdash; not vanity
          metrics that look good in a report.
        </p>
      </>
    ),
    stats: [
      {
        value: "3.8×",
        label: "more backlinks the #1 result has than positions #2–#10, on average.",
        sourceName: "Backlinko, 11.8M-result ranking study",
        sourceUrl: "https://backlinko.com/search-engine-ranking",
      },
      {
        value: "66%",
        label: "of pages have zero backlinks — most sites never earn a single one.",
        sourceName: "Ahrefs, 1-billion-page study",
        sourceUrl: "https://ahrefs.com/blog/search-traffic-study/",
      },
      {
        value: "≈90%",
        label: "of global search runs on Google — where link authority pays off.",
        sourceName: "Statcounter Global Stats",
        sourceUrl: "https://gs.statcounter.com/search-engine-market-share",
      },
    ],
    featuresHeading: "What's included in our link building & digital PR",
    featuresSubtitle: "Earned, editorial links — never bought, spun, or farmed.",
    features: [
      {
        icon: Search,
        title: "Backlink audit & strategy",
        description:
          "We benchmark your link profile against the competitors outranking you, find the gaps, and build a target list of the publications and pages worth earning links from — so effort goes where it moves rankings.",
      },
      {
        icon: Sparkles,
        title: "Digital PR & editorial links",
        description:
          "We pitch genuinely newsworthy angles, data, and commentary to real publications and journalists, earning the high-authority editorial links that matter most and can't be bought safely.",
      },
      {
        icon: FileText,
        title: "Guest posting on relevant sites",
        description:
          "We place well-written, genuinely useful guest articles on relevant, real sites in your space — not link farms — so each placement carries actual authority and referral value.",
      },
      {
        icon: Users,
        title: "Niche & blogger outreach",
        description:
          "We build relationships with the bloggers, creators, and site owners your audience already trusts, earning contextual links and mentions that send relevant traffic, not just SEO value.",
      },
      {
        icon: Link2,
        title: "Broken-link & reclamation",
        description:
          "We find unlinked mentions of your brand and broken links pointing at competitors or dead pages, and turn them into links to you — some of the lowest-risk, highest-return links available.",
      },
      {
        icon: LineChart,
        title: "Reporting on links & authority",
        description:
          "You get a clear monthly report of the links earned, where they came from, and how your domain authority and rankings are moving — real placements you can click, not a spreadsheet of junk.",
      },
    ],
    processHeading: "How we deliver link building",
    process: [
      {
        step: "01",
        title: "Audit & target",
        description:
          "We analyze your backlink profile and your competitors', identify the gap, and build a vetted target list of real, relevant sites and angles worth pursuing.",
      },
      {
        step: "02",
        title: "Create link-worthy assets",
        description:
          "Links are earned, not asked for. We develop the data, content, and PR angles that give real publications a genuine reason to link to you.",
      },
      {
        step: "03",
        title: "Outreach & earn",
        description:
          "We run personalised outreach and digital PR to earn editorial placements, guest posts, and mentions on relevant, authoritative sites — every link vetted for quality.",
      },
      {
        step: "04",
        title: "Report & build",
        description:
          "We report every link earned and track authority and rankings month over month, then keep building on the angles and relationships that are working.",
      },
    ],
    comparisonHeading: "NexFortis vs. a typical link vendor",
    comparison: [
      { feature: "Link type", us: "Earned editorial & relevant", them: "Bought, spun, or PBN links" },
      { feature: "Risk", us: "White-hat, penalty-safe", them: "Risks a Google penalty" },
      { feature: "Relevance", us: "Real sites in your space", them: "Any site that'll take the link" },
      { feature: "Reporting", us: "Real placements you can click", them: "A list of low-quality URLs" },
      { feature: "Who does the work", us: "A senior consultant you can reach", them: "An offshore link mill" },
      { feature: "Commitment", us: "Month-to-month — we earn the renewal", them: "Locked contracts" },
    ],
    pricingHeading: "What link building costs",
    pricing: {
      fromLabel: "Priced by authority and competition",
      note: (
        <>
          <p className="mb-4">
            Earned editorial links cost more than farmed ones for a reason &mdash; they take real
            outreach and real content, and they actually work. We price by how competitive your
            space is and the quality of links you need, never by churning out cheap, risky volume.
          </p>
          <p>
            You get a fixed monthly scope, transparent reporting, and no long-term lock-in. Ask for a
            free backlink audit and we&rsquo;ll show you the gap and what it takes to close it.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "What is link building?",
        answer:
          "Link building is the work of earning links from other websites to yours. Search engines treat those links as votes of confidence, so a strong, relevant backlink profile is one of the biggest factors in how high you can rank. The key word is earned — links have to come from real, relevant sites to help rather than hurt.",
      },
      {
        question: "Why is link building important?",
        answer:
          "Because authority is still largely decided by links. Top-ranking pages consistently have more and better backlinks than the pages below them, yet most pages on the web have none at all. If your content is good but isn't ranking, a weak link profile is usually the reason — and it's the gap link building closes.",
      },
      {
        question: "Is link building safe? What about Google penalties?",
        answer:
          "It's safe when it's done right and risky when it isn't. Bought links, spun content, and private blog networks can trigger a Google penalty that's expensive to recover from. We only build white-hat, editorial links from real, relevant sites — the kind Google wants you to earn — so you get the ranking benefit without the risk.",
      },
      {
        question: "What's the difference between digital PR and guest posting?",
        answer:
          "Digital PR earns links by pitching genuinely newsworthy stories, data, or commentary to journalists and publications — high-authority, editorial links you can't buy. Guest posting places a useful article you've written on a relevant site. Both are legitimate when done with real sites; we use the mix that fits your industry and goals.",
      },
      {
        question: "How many links will I get, and how fast?",
        answer:
          "We don't promise a number, because earned links depend on outreach and what's link-worthy — and anyone guaranteeing X links a month is usually selling the risky kind. We focus on quality and relevance over volume, report every placement, and build steadily. A few strong editorial links beat dozens of junk ones every time.",
      },
    ],
    authorNote: (
      <p>
        Hassan leads link building and digital PR at NexFortis, focused on the earned, editorial
        links that lift authority safely. As founder and CEO he stays hands-on with every engagement
        &mdash; no link mills, no risky shortcuts.
      </p>
    ),
    ctaHeading: "Want the authority to finally rank?",
    ctaSubtext:
      "Get a free backlink audit — see the gap between your link profile and the competitors outranking you, and how to close it safely.",
  },

  // ------------------------------------------- GOOGLE ADS / PPC ----
  "google-ads-ppc": {
    metaTitle: "Google Ads Management",
    metaDescription:
      "Google Ads & PPC management by a certified Google Partner: profitable search and remarketing campaigns with transparent reporting on every ad dollar.",
    h1: "Google Ads Management That Pays for Itself",
    heroSubtitle:
      "Profitable search, shopping, and remarketing campaigns managed by a certified Google Partner — with transparent reporting on every dollar of ad spend.",
    serviceType: "Google Ads Management",
    serviceSchemaName: "Google Ads Management",
    serviceSchemaDescription:
      "Google Ads and PPC management for Canadian businesses — campaign strategy, keyword and audience targeting, bid management, conversion tracking, and transparent reporting.",
    introHeading: "Visibility today — without lighting money on fire",
    intro: (
      <>
        <p>
          Done right, Google Ads is the fastest way to put your business in front of someone the
          moment they search for what you sell. Done wrong, it is one of the easiest ways to burn a
          budget &mdash; broad keywords, weak landing pages, and bids nobody is watching can drain a
          month&rsquo;s spend with little to show for it. The difference is management, not the
          platform.
        </p>
        <p>
          We are a certified <strong>Google Partner</strong>, and we run paid search the way we
          would spend our own money: tight targeting, honest tracking, and a relentless focus on
          cost per lead rather than clicks. It is the fast-results complement to{" "}
          <InlineLink href={seo.href}>{seo.linkText}</InlineLink> &mdash; ads bring traffic today
          while SEO compounds underneath &mdash; and part of our{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
        <p>
          Every account starts with an audit. If you are already running ads, we will show you
          exactly where the budget is leaking before you spend another dollar with us.
        </p>
      </>
    ),
    stats: [
      {
        value: "$2",
        label: "in revenue, on average, for every $1 spent on Google Ads (Google's own estimate).",
        sourceName: "Google Economic Impact",
        sourceUrl: "https://economicimpact.google/methodology/",
      },
      {
        value: "6.96%",
        label: "average Google Ads conversion rate across industries in 2024.",
        sourceName: "WordStream / LocaliQ Search Advertising Benchmarks 2024",
        sourceUrl: "https://www.wordstream.com/wp-content/uploads/2024/05/ws-guide-google-ads-benchmarks-2024.pdf",
      },
      {
        value: "≈90%",
        label: "of global search runs on Google — the reach behind every search campaign.",
        sourceName: "Statcounter Global Stats",
        sourceUrl: "https://gs.statcounter.com/search-engine-market-share",
      },
    ],
    featuresHeading: "What's included in our Google Ads management",
    featuresSubtitle: "Strategy, build, and ongoing optimization — managed by a Google Partner.",
    features: [
      {
        icon: Search,
        title: "Campaign strategy & setup",
        description:
          "We build your account structure around how people actually search and buy — campaigns, ad groups, and match types organised so budget flows to the terms that convert, not the ones that just spend.",
      },
      {
        icon: Users,
        title: "Keyword & audience targeting",
        description:
          "We target the high-intent searches and audiences worth paying for, and add the negative keywords that stop your budget bleeding into irrelevant clicks — the single biggest source of wasted spend.",
      },
      {
        icon: FileText,
        title: "Ad copy & creative",
        description:
          "We write and test ad copy and assets that earn the click and set the right expectation, so the traffic you pay for is traffic that's likely to convert once it lands.",
      },
      {
        icon: Gauge,
        title: "Bid & budget management",
        description:
          "We manage bids and budgets actively — guiding Google's automation rather than handing it a blank cheque — to keep your cost per lead down as competition and the auction shift.",
      },
      {
        icon: LineChart,
        title: "Conversion tracking & landing pages",
        description:
          "We set up proper conversion tracking so we optimise to real leads, not clicks, and flag the landing-page fixes that turn more of your paid traffic into enquiries.",
      },
      {
        icon: BarChart3,
        title: "Transparent reporting",
        description:
          "You get a clear monthly report showing spend, leads, and cost per lead — what's working, what we changed, and what's next. Your ad account stays yours, always.",
      },
    ],
    processHeading: "How we manage your Google Ads",
    process: [
      {
        step: "01",
        title: "Audit & plan",
        description:
          "We review your account (or build from scratch), research the market and competitors, and set a plan with clear targets for cost per lead and return.",
      },
      {
        step: "02",
        title: "Build & launch",
        description:
          "We structure campaigns, write the ads, set up conversion tracking, and launch — with negative keywords and budgets in place from day one so nothing leaks.",
      },
      {
        step: "03",
        title: "Optimize",
        description:
          "We watch the data and tune continuously: pause what's not converting, scale what is, refine bids and copy, and tighten targeting week over week.",
      },
      {
        step: "04",
        title: "Report & scale",
        description:
          "We report in plain language on spend and leads, then reinvest in the campaigns earning the best return so the account gets more efficient over time.",
      },
    ],
    comparisonHeading: "NexFortis vs. a typical PPC provider",
    comparison: [
      { feature: "Certification", us: "Certified Google Partner", them: "Often uncertified" },
      { feature: "Optimised for", us: "Cost per lead and revenue", them: "Clicks and impressions" },
      { feature: "Ad spend", us: "Transparent — every dollar reported", them: "Opaque, bundled with fees" },
      { feature: "Account ownership", us: "You own your account", them: "Held hostage by the agency" },
      { feature: "Who does the work", us: "A senior consultant you can reach", them: "A rotating junior" },
      { feature: "Commitment", us: "Month-to-month — we earn the renewal", them: "Locked contracts" },
    ],
    pricingHeading: "What Google Ads management costs",
    pricing: {
      fromLabel: "A management fee on top of your ad spend",
      note: (
        <>
          <p className="mb-4">
            Two things to budget for: your ad spend (which goes to Google) and our management fee
            (which is separate and fully transparent). We scale the fee to the size and complexity
            of the account, never bundle it into your spend, and never mark up your media.
          </p>
          <p>
            You keep ownership of your account and there&rsquo;s no long-term lock-in. Ask for a free
            ad-account audit and we&rsquo;ll recommend a realistic budget and what management it needs.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "How much does Google Ads management cost?",
        answer:
          "There are two parts: the ad spend that goes to Google, and a separate management fee for running the account. We scale the fee to the account's size and complexity and keep it fully transparent — we don't bundle it into your spend or mark up your media. You'll get a clear number after a free audit of your situation.",
      },
      {
        question: "What does a Google Ads manager actually do?",
        answer:
          "A lot that isn't visible from the outside: structuring the account, choosing and refining keywords, writing and testing ads, adding negative keywords, managing bids and budgets, setting up conversion tracking, and optimizing continuously toward cost per lead. The platform makes it easy to spend money; management is what makes that money produce customers.",
      },
      {
        question: "Should I hire an agency or run ads in-house?",
        answer:
          "If you have the time and expertise in-house, you can absolutely run your own ads. Most owners don't — and Google's auction punishes neglected accounts quickly. A good manager usually pays for itself by cutting wasted spend and improving conversion rates. We're happy to tell you honestly if your account is simple enough to run yourself.",
      },
      {
        question: "How much should I budget for ad spend?",
        answer:
          "It depends on your industry's cost per click and how many leads you want. Some competitive categories cost several dollars per click; others are far cheaper. We'll model a realistic budget against your goals during the audit so you start with a number based on your market, not a guess — and scale it as the data comes in.",
      },
      {
        question: "How soon will I see results from Google Ads?",
        answer:
          "Faster than SEO — ads can start driving clicks and enquiries within days of launch. The first few weeks are a learning period while we gather conversion data and optimize, so performance typically improves month over month as the account matures. We report from the start so you can see it developing.",
      },
    ],
    authorNote: (
      <p>
        Hassan leads paid search at NexFortis, a certified Google Partner, helping Canadian
        businesses turn ad spend into measurable leads instead of wasted budget. As founder and CEO
        he stays hands-on with every account.
      </p>
    ),
    ctaHeading: "Want ads that bring leads, not just clicks?",
    ctaSubtext:
      "Get a free Google Ads account audit — we'll show you where the budget is leaking and what a profitable campaign would look like.",
  },

  // ----------------------------------------- SOCIAL MEDIA MARKETING ----
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
