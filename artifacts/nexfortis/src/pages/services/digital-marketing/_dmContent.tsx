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
  title: "Founder & Principal Consultant, NexFortis IT Solutions",
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
const geo = getDmSpoke("generative-engine-optimization");

// Partial: only published spokes have content + a page yet. The template guards
// against a missing entry, and getPublishedSpokes() keeps the cluster from ever
// linking a slug that has no content.
export const DM_SPOKE_CONTENT: Partial<Record<DmSpokeSlug, DmSpokeContent>> = {
  // ---------------------------------------------------------------- SEO ----
  seo: {
    metaTitle: "SEO Services in Canada",
    metaDescription:
      "SEO services for Canadian businesses: keyword strategy, on-page and technical optimization, and content that ranks for the searches that bring real buyers.",
    h1: "SEO Services That Rank Canadian Businesses",
    heroSubtitle:
      "We earn the rankings that send qualified buyers to your website — with keyword strategy, on-page and technical fixes, and content built to last.",
    serviceType: "Search Engine Optimization",
    serviceSchemaName: "SEO Services",
    serviceSchemaDescription:
      "Search engine optimization for Canadian businesses — keyword strategy, on-page and technical SEO, content, and authority building.",
    introHeading: "Rankings that actually grow revenue",
    intro: (
      <>
        <p>
          Most Canadian businesses don&rsquo;t have a traffic problem &mdash; they have a
          visibility problem. Your customers are already searching; your site just isn&rsquo;t
          where Google shows the answer. SEO closes that gap by aligning your pages with what
          people actually type, then earning the authority and technical health that let those
          pages rank.
        </p>
        <p>
          At NexFortis, SEO is the engine of our{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>. You get an SEO
          company and strategist in one &mdash; not a faceless agency that hands you to a junior. We
          start with the searches that signal buying intent, map each one to the right page, and
          build out the on-page, technical, and content work needed to compete. For businesses that
          serve a specific area, we pair it with{" "}
          <InlineLink href={localSeo.href}>{localSeo.linkText}</InlineLink> so you win the map
          results too.
        </p>
        <p>
          Every change ties back to a number you care about &mdash; qualified traffic, leads, and
          revenue &mdash; not vanity rankings on terms nobody buys from.
        </p>
      </>
    ),
    stats: [
      {
        value: "≈90%",
        label: "of global search happens on Google — the board you have to win.",
        sourceName: "Statcounter Global Stats",
        sourceUrl: "https://gs.statcounter.com/search-engine-market-share",
      },
      {
        value: "27.6%",
        label: "average click-through rate of the #1 organic result.",
        sourceName: "Backlinko, 4M-result CTR study",
        sourceUrl: "https://backlinko.com/google-ctr-stats",
      },
      {
        value: "43%",
        label: "of mobile sites pass all three Core Web Vitals — so speed is still an edge.",
        sourceName: "2024 Web Almanac, HTTP Archive",
        sourceUrl: "https://almanac.httparchive.org/en/2024/performance",
      },
    ],
    featuresHeading: "What's included in our SEO services",
    featuresSubtitle:
      "Every engagement covers the full picture — not just a handful of title tags.",
    features: [
      {
        icon: Search,
        title: "Keyword & intent research",
        description:
          "We identify the exact searches your buyers use, map each to the right page, and prioritize the terms with real commercial intent — so effort goes where it converts, not just where volume looks big.",
      },
      {
        icon: FileText,
        title: "On-page optimization",
        description:
          "Titles, meta descriptions, headings, internal links, and body content optimized against what already ranks, so each page sends Google one clear, consistent signal about what it answers.",
      },
      {
        icon: Gauge,
        title: "Technical foundations",
        description:
          "We fix the crawl, indexation, structured-data, and speed issues that quietly cap your rankings — including Core Web Vitals, where more than half of sites still fall short.",
      },
      {
        icon: PenTool,
        title: "Content that earns rankings",
        description:
          "Research-led pages and articles that cover a topic thoroughly enough to outrank thinner competitors — and stay useful for years instead of months.",
      },
      {
        icon: Link2,
        title: "Authority building",
        description:
          "Earned links and brand mentions from real, relevant sources — the off-site signal that still decides how high you can realistically rank in a competitive market.",
      },
      {
        icon: BarChart3,
        title: "Measurement & reporting",
        description:
          "GA4, Search Console, and rank tracking wired into a plain-language monthly report that ties movement to leads and revenue — not just positions on a screenshot.",
      },
    ],
    processHeading: "How we deliver SEO",
    process: [
      {
        step: "01",
        title: "Audit & strategy",
        description:
          "We benchmark where you stand today — rankings, traffic, technical health, and competitors — and turn it into a prioritized 90-day plan you can see.",
      },
      {
        step: "02",
        title: "Fix & optimize",
        description:
          "We work top-down by impact: technical blockers first, then on-page optimization for your money pages, then the content gaps your competitors are quietly winning.",
      },
      {
        step: "03",
        title: "Build authority",
        description:
          "We publish new pages against the keywords you can realistically win and earn the links and mentions that lift the authority of your whole domain.",
      },
      {
        step: "04",
        title: "Measure & compound",
        description:
          "Each month we report what moved, refresh pages that are slipping, and reinvest in what's working — so results compound instead of plateauing.",
      },
    ],
    comparisonHeading: "NexFortis vs. a typical SEO agency",
    comparison: [
      { feature: "Keyword targeting", us: "Mapped to buyer intent and revenue", them: "Chased by search volume alone" },
      { feature: "Technical SEO", us: "Core Web Vitals and indexation fixed", them: "Frequently out of scope" },
      { feature: "Content", us: "Research-led and genuinely comprehensive", them: "Thin, AI-spun filler" },
      { feature: "Reporting", us: "Tied to leads and revenue", them: "Ranking screenshots" },
      { feature: "Who does the work", us: "A senior consultant you can reach", them: "A rotating junior account manager" },
      { feature: "Commitment", us: "Month-to-month — we earn the renewal", them: "Locked 6–12 month contracts" },
    ],
    pricingHeading: "What SEO costs",
    pricing: {
      fromLabel: "Retainers scaled to your market",
      note: (
        <>
          <p className="mb-4">
            We price by how competitive your market is and how much ground there is to make up
            &mdash; not by a rigid feature checklist. Most local and small-business campaigns sit
            in the range that GTA agencies bracket as &ldquo;growth&rdquo; work, and we deliver
            that tier with the efficiency of a lean, senior team rather than a layer of account
            managers.
          </p>
          <p>
            You get a fixed monthly scope, transparent reporting, and no long-term lock-in. Ask
            for a quote and we&rsquo;ll give you a number tied to your actual market and goals.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "How long does SEO take to work?",
        answer:
          "Most campaigns see early movement on lower-competition terms within two to three months, with meaningful traffic gains around the six-month mark. SEO compounds — the work you do in month one keeps paying off in month twelve, which is why it outperforms ads over the long run. Anyone promising page-one rankings in 30 days is selling a shortcut that risks a penalty.",
      },
      {
        question: "Do you guarantee #1 rankings?",
        answer:
          "No reputable SEO can, because Google's results depend on factors no agency controls. What we guarantee is the work: the audit, the fixes, the content, and the links, all reported transparently. We focus on rankings for the terms that drive revenue and on the leads those rankings produce.",
      },
      {
        question: "What is the difference between SEO and local SEO?",
        answer:
          "SEO earns rankings in the standard organic results for any searcher. Local SEO focuses on the Google map pack and 'near me' searches for businesses that serve a specific area. Most local businesses need both, and we run them together so the map and the organic results reinforce each other.",
      },
      {
        question: "Will you need to change my website?",
        answer:
          "Usually some. SEO touches page content, structure, internal links, and technical settings. We work with your existing site and developers wherever possible, and we flag anything that needs a build change before we touch it — nothing ships without your sign-off.",
      },
      {
        question: "How do you report results?",
        answer:
          "You get a monthly report in plain language: which keywords moved, how organic traffic and leads changed, what we shipped, and what's next. We connect GA4 and Google Search Console so the numbers come straight from Google, not a black box.",
      },
      {
        question: "Is SEO still worth it now that AI answers questions directly?",
        answer:
          "More than ever. The same strong, well-structured content that ranks in Google is what AI engines such as ChatGPT and Google's AI Overviews cite when they answer. We build for both, and our Generative Engine Optimization service adds the AI-specific layer on top of solid SEO foundations.",
      },
    ],
    authorNote: (
      <p>
        Hassan leads SEO and digital strategy at NexFortis, helping Canadian businesses turn
        search into a predictable source of leads. He works directly with every client &mdash; no
        hand-off to a junior team.
      </p>
    ),
    ctaHeading: "Ready to rank for the searches that matter?",
    ctaSubtext:
      "Get a free, no-obligation assessment of your site and your market — and a clear view of what it would take to win.",
  },

  // ---------------------------------------------------------- LOCAL SEO ----
  "local-seo": {
    metaTitle: "Local SEO Services",
    metaDescription:
      "Local SEO for GTA businesses: rank in the Google Map Pack and 'near me' searches, win your Google Business Profile, and turn nearby searches into calls.",
    h1: "Local SEO That Puts You on the Map",
    heroSubtitle:
      "Show up when nearby customers search for what you do — in the Google map results, on 'near me' queries, and across the GTA.",
    serviceType: "Local SEO",
    serviceSchemaName: "Local SEO Services",
    serviceSchemaDescription:
      "Local search optimization for businesses across the Greater Toronto Area — Google Business Profile, citations, reviews, and location pages.",
    introHeading: "Get found by customers down the street",
    intro: (
      <>
        <p>
          When someone searches &ldquo;IT support near me&rdquo; or &ldquo;bookkeeper in
          Vaughan,&rdquo; Google shows a map with three local results above almost everything else.
          If you&rsquo;re not in that pack, you&rsquo;re effectively invisible to buyers who are
          ready to call right now.
        </p>
        <p>
          Local SEO is how you earn that spot. It combines an optimized Google Business Profile,
          consistent business information across the web, genuine local reviews, and
          location-specific pages into a signal Google trusts for your area. It&rsquo;s part of our
          broader <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>, and it
          pairs naturally with <InlineLink href={seo.href}>{seo.linkText}</InlineLink> for
          businesses that want to win both the map and the standard results.
        </p>
        <p>
          The payoff is direct: local searches are high-intent, and the businesses in the map pack
          capture the calls, directions, and visits before anyone scrolls.
        </p>
      </>
    ),
    stats: [
      {
        value: "81%",
        label: "of consumers used Google to evaluate local businesses in 2024.",
        sourceName: "BrightLocal Local Consumer Review Survey 2024",
        sourceUrl: "https://www.brightlocal.com/research/local-consumer-review-survey-2024/",
      },
      {
        value: "98%",
        label: "of people used the internet to find information about a local business.",
        sourceName: "BrightLocal Local SEO Statistics",
        sourceUrl: "https://www.brightlocal.com/resources/local-seo-statistics/",
      },
      {
        value: "≈90%",
        label: "of search runs on Google — where the local map pack lives.",
        sourceName: "Statcounter Global Stats",
        sourceUrl: "https://gs.statcounter.com/search-engine-market-share",
      },
    ],
    featuresHeading: "What's included in local SEO",
    featuresSubtitle: "Everything it takes to own your area in Google — not just one listing.",
    features: [
      {
        icon: Building2,
        title: "Google Business Profile optimization",
        description:
          "We claim and fully build out your profile — categories, services, hours, description, and photos — and keep it active with posts, because the profile is the single biggest lever on map-pack rankings.",
      },
      {
        icon: MapPin,
        title: "Citations & NAP consistency",
        description:
          "We make sure your name, address, and phone number match exactly across Google, Bing, Apple Maps, and the directories that matter in Canada — inconsistencies quietly erode local trust.",
      },
      {
        icon: Star,
        title: "Review generation & response",
        description:
          "We set up a simple system to earn steady, genuine reviews and respond to every one — a ranking signal and the first thing a nearby buyer reads before they call.",
      },
      {
        icon: Map,
        title: "Location & service-area pages",
        description:
          "We build genuinely useful pages for the cities and neighbourhoods you serve — real local detail, not thin duplicates — so you rank for each area without tripping Google's doorway-page rules.",
      },
      {
        icon: Users,
        title: "Local content & link building",
        description:
          "We earn mentions and links from local publications, partners, and community sites — the regional signals that move the map pack more than national links ever will.",
      },
      {
        icon: LineChart,
        title: "Local rank & call tracking",
        description:
          "We track your position in the map pack by location and tie calls and direction requests back to the work, so you can see exactly what local SEO is returning.",
      },
    ],
    processHeading: "How we deliver local SEO",
    process: [
      {
        step: "01",
        title: "Local audit",
        description:
          "We check your Google Business Profile, citations, reviews, and current map-pack rankings against the competitors already winning in your area.",
      },
      {
        step: "02",
        title: "Profile & citations",
        description:
          "We optimize your profile end to end and clean up every inconsistent listing so Google has one trusted record of your business.",
      },
      {
        step: "03",
        title: "Reviews & local pages",
        description:
          "We turn on review generation and publish the location pages and local content that earn rankings for each area you serve.",
      },
      {
        step: "04",
        title: "Track & grow",
        description:
          "We monitor map-pack positions by location, respond to reviews, and keep the profile active — then expand into new neighbourhoods as you win.",
      },
    ],
    comparisonHeading: "NexFortis vs. a typical local SEO provider",
    comparison: [
      { feature: "Google Business Profile", us: "Actively managed every month", them: "Set once and forgotten" },
      { feature: "Citations", us: "Audited and corrected by hand", them: "Bulk-submitted and left alone" },
      { feature: "Location pages", us: "Real local content, penalty-safe", them: "Thin city-name duplicates" },
      { feature: "Reviews", us: "A system that earns and responds", them: "Left entirely to chance" },
      { feature: "Reporting", us: "Map rank by location plus calls", them: "A generic traffic chart" },
      { feature: "Commitment", us: "Month-to-month — we earn the renewal", them: "Locked annual contracts" },
    ],
    pricingHeading: "What local SEO costs",
    pricing: {
      fromLabel: "Priced by area and competition",
      note: (
        <>
          <p className="mb-4">
            A single-location service business in a quiet niche needs far less than a multi-area
            firm fighting established competitors, so we price by how competitive your area is and
            how many locations you serve &mdash; not a one-size checklist.
          </p>
          <p>
            Most local campaigns sit comfortably in the maintainer-to-growth range, with a fixed
            monthly scope and no long-term lock-in. Ask for a quote tied to your city and your
            competition.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "What is local SEO?",
        answer:
          "Local SEO is the work that gets your business shown to people searching nearby — in the Google map pack, on 'near me' queries, and on Google Maps. It's driven mostly by your Google Business Profile, consistent business information across the web, reviews, and location-relevant content.",
      },
      {
        question: "Do I need a storefront to do local SEO?",
        answer:
          "No. Service-area businesses that travel to customers — IT support, trades, consultants, home services — can rank locally without a public address by setting a service area on the Google Business Profile. We configure it correctly so you appear for the areas you actually serve.",
      },
      {
        question: "How important are Google reviews?",
        answer:
          "Very. Reviews influence both your map-pack ranking and whether a searcher chooses you over the business listed next to you. Steady, genuine reviews and prompt responses are one of the highest-return activities in local SEO, so we build a simple system to earn them.",
      },
      {
        question: "How long does local SEO take?",
        answer:
          "Google Business Profile improvements can move the map pack within weeks, faster than standard SEO. Citations, reviews, and location pages compound over two to four months. Competitive urban areas take longer than quieter suburbs, and we set expectations against your specific market up front.",
      },
      {
        question: "Can you handle multiple locations?",
        answer:
          "Yes. We manage separate profiles, citations, and location pages for each branch or service area, keeping the business information consistent across all of them while tailoring the local content to each place you operate.",
      },
    ],
    authorNote: (
      <p>
        Hassan helps GTA businesses win local search — the map pack, Google Business Profile, and
        the 'near me' moments that turn into calls. He works hands-on with every client engagement
        at NexFortis.
      </p>
    ),
    ctaHeading: "Want to own your local search results?",
    ctaSubtext:
      "Get a free local visibility check for your area — your map-pack standing, profile gaps, and the fastest path to more nearby calls.",
  },

  // -------------------------------------------- GENERATIVE ENGINE OPT ----
  "generative-engine-optimization": {
    metaTitle: "AI Search Optimization (GEO)",
    metaDescription:
      "Generative Engine Optimization (GEO): get cited by ChatGPT, Google AI Overviews, Perplexity, and Gemini — where a growing share of buyers now start.",
    h1: "Generative Engine Optimization (GEO) Services",
    heroSubtitle:
      "Get found when buyers ask ChatGPT, Google's AI Overviews, Perplexity, and Gemini — the new front page of search.",
    serviceType: "Generative Engine Optimization",
    serviceSchemaName: "Generative Engine Optimization (GEO)",
    serviceSchemaDescription:
      "AI search optimization for Canadian businesses — earning citations in ChatGPT, Google AI Overviews, Perplexity, and Gemini through structured content and brand signals.",
    introHeading: "When AI answers the question, are you in it?",
    intro: (
      <>
        <p>
          Search is splitting in two. Alongside the familiar blue links, a fast-growing share of
          answers now come straight from AI &mdash; Google&rsquo;s AI Overviews, ChatGPT,
          Perplexity, and Gemini. These engines don&rsquo;t show ten results; they synthesize one
          answer and cite a handful of sources. If your brand isn&rsquo;t among them, you&rsquo;re
          invisible at the exact moment a buyer is deciding.
        </p>
        <p>
          Generative Engine Optimization is how you earn those citations. It builds on the same
          foundations as <InlineLink href={seo.href}>{seo.linkText}</InlineLink> but adds the
          structure, sourcing, and brand signals that language models reward. It&rsquo;s the most
          forward-looking part of our{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink> &mdash; and almost no
          GTA competitor offers it yet, which is exactly why the window to lead is open now.
        </p>
      </>
    ),
    introCallout: (
      <CalloutBox title="What is Generative Engine Optimization (GEO)?">
        GEO — also called AI search optimization or answer engine optimization — is the practice of
        structuring your content and building your brand so generative AI engines cite you in their
        answers. Where SEO competes for rankings, GEO competes for citations.
      </CalloutBox>
    ),
    stats: [
      {
        value: "≈16%",
        label: "of Google searches showed an AI Overview by late 2025, up from about 6% in January.",
        sourceName: "Semrush study, via Search Engine Land",
        sourceUrl: "https://searchengineland.com/google-ai-overviews-surge-pullback-data-466314",
      },
      {
        value: "58.5%",
        label: "of US Google searches ended without a click to the open web in 2024.",
        sourceName: "SparkToro 2024 Zero-Click Study",
        sourceUrl:
          "https://sparktoro.com/blog/2024-zero-click-search-study-for-every-1000-us-google-searches-only-374-clicks-go-to-the-open-web-in-the-eu-its-360/",
      },
      {
        value: "47%",
        label: "of Gen Z consumers discovered a new product or brand through ChatGPT.",
        sourceName: "Adobe, 2025 consumer survey",
        sourceUrl: "https://www.adobe.com/express/learn/blog/chatgpt-as-a-search-engine",
      },
    ],
    featuresHeading: "What's included in GEO",
    featuresSubtitle: "The AI-search layer most agencies haven't built yet.",
    features: [
      {
        icon: Sparkles,
        title: "AI visibility audit",
        description:
          "We test the prompts your buyers actually ask across ChatGPT, Google AI Overviews, Perplexity, and Gemini, and record who gets cited today — your baseline and your competitors' head start.",
      },
      {
        icon: FileText,
        title: "Passage-optimized content",
        description:
          "We restructure pages so each passage answers a question on its own — direct answers, clear definitions, and self-contained facts that retrieval-based AI can lift cleanly into a response.",
      },
      {
        icon: FileCode,
        title: "Schema & structured data for AI",
        description:
          "We implement the FAQ, How-To, Article, and entity schema that helps engines understand and trust your content — the infrastructure that increasingly decides who gets cited.",
      },
      {
        icon: Share2,
        title: "Brand surface area",
        description:
          "Language models weigh mentions across high-authority sources, so we build your presence on the sites they lean on — Reddit, LinkedIn, YouTube, and reputable industry listings and reviews.",
      },
      {
        icon: Bot,
        title: "AI crawler access & llms.txt",
        description:
          "We make sure the major AI crawlers can reach your content and add an llms.txt file that points them at the pages you most want surfaced and cited.",
      },
      {
        icon: LineChart,
        title: "Citation monitoring",
        description:
          "We track how often each engine cites you for your target prompts over time, so GEO becomes a measured program with a clear trend — not a one-off experiment.",
      },
    ],
    processHeading: "How we deliver GEO",
    process: [
      {
        step: "01",
        title: "Baseline AI visibility",
        description:
          "We run your priority prompts across the major AI engines and document exactly where you are — and aren't — cited today.",
      },
      {
        step: "02",
        title: "Structure for retrieval",
        description:
          "We rework key pages into clear, self-contained passages and add the schema that helps AI engines understand and quote them.",
      },
      {
        step: "03",
        title: "Build brand signals",
        description:
          "We grow your mentions across the high-authority sources LLMs lean on, so the models see your brand as a credible answer to cite.",
      },
      {
        step: "04",
        title: "Monitor & refine",
        description:
          "We track citations across engines month over month and double down on the topics and formats that are winning you answers.",
      },
    ],
    comparisonHeading: "GEO vs. SEO alone",
    comparison: [
      { feature: "What you compete for", us: "Citations in AI answers", them: "Blue-link rankings only" },
      { feature: "Content structure", us: "Self-contained, quotable passages", them: "Long pages built only for scanning" },
      { feature: "Schema", us: "Entity and Q&A markup for AI", them: "Basic or none" },
      { feature: "Brand signals", us: "Reddit, LinkedIn, YouTube, reviews", them: "Backlinks only" },
      { feature: "Measurement", us: "Tracked AI citations by engine", them: "Rankings and traffic only" },
      { feature: "Market timing", us: "Few GTA competitors offer it", them: "Crowded and commoditized" },
    ],
    pricingHeading: "What GEO costs",
    pricing: {
      fromLabel: "A premium add-on while the window is open",
      note: (
        <>
          <p className="mb-4">
            GEO works best layered on solid SEO foundations, so we usually run it as an add-on to a
            search engagement rather than a standalone line item. Scope depends on how many prompts
            and topics you want to win and how much brand-building the engines require in your
            category.
          </p>
          <p>
            Because few competitors offer this yet, early movers gain an advantage that&rsquo;s
            hard to unwind later. Ask for a quote and we&rsquo;ll scope a program against your
            market and your priority questions.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "What is Generative Engine Optimization (GEO)?",
        answer:
          "GEO is the practice of optimizing your content and brand so generative AI engines — ChatGPT, Google AI Overviews, Perplexity, and Gemini — cite you when they answer a buyer's question. It's also called AI search optimization or answer engine optimization. Where SEO competes for rankings, GEO competes for citations in the AI answer itself.",
      },
      {
        question: "Is GEO different from SEO?",
        answer:
          "It builds on SEO but isn't the same. Strong, well-structured content helps with both, but GEO adds an extra layer: passage-level structure, entity and Q&A schema, and brand mentions across the sources language models trust. We run GEO on top of solid SEO foundations rather than instead of them.",
      },
      {
        question: "Which AI engines do you optimize for?",
        answer:
          "The ones your buyers actually use: Google's AI Overviews and AI Mode, ChatGPT, Perplexity, and Gemini. We test your priority prompts across all of them, see who's being cited, and focus the work where the opportunity and the audience overlap.",
      },
      {
        question: "Can you guarantee my brand gets cited?",
        answer:
          "No one can guarantee a specific AI citation any more than a specific Google ranking — the engines decide. What we can do is measurably improve the odds by building the content structure, schema, and brand signals these engines reward, and then track citations over time so you can see the trend.",
      },
      {
        question: "How do you measure GEO results?",
        answer:
          "We run your target prompts across each engine on a regular cadence and record how often, and how prominently, your brand is cited. That gives you a clear month-over-month trend by engine, instead of a one-time snapshot, so you can see GEO working.",
      },
      {
        question: "Is it too early to invest in GEO?",
        answer:
          "The opposite — early is the advantage. AI answers already appear on a large share of searches and a growing share of buyers start with ChatGPT, yet almost no local competitors optimize for it. Building credibility with these engines now is far cheaper than trying to catch up once everyone is doing it.",
      },
    ],
    authorNote: (
      <p>
        Hassan leads NexFortis's work on AI search, helping Canadian businesses earn visibility in
        ChatGPT, Google's AI Overviews, and other generative engines before their competitors do.
      </p>
    ),
    ctaHeading: "Want to be the answer AI gives?",
    ctaSubtext:
      "Get a free AI visibility check — see which engines cite you today, where your competitors lead, and the fastest way to close the gap.",
  },
};
