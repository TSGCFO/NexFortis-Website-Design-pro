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
          Most of the Canadian businesses we talk to do not actually have a traffic problem. They
          have a visibility problem. Their customers are out there searching every day; the site
          just is not the one Google decides to show. SEO is how you close that gap &mdash; you line
          your pages up with what people genuinely type, then earn the technical health and
          authority that let Google trust those pages enough to rank them.
        </p>
        <p>
          At NexFortis this is the engine under our{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>. You get the company
          and the strategist in one person, not a logo that quietly passes you to a junior the day
          the contract is signed. We start from the searches that smell like money &mdash; someone
          ready to buy, not just browsing &mdash; map each one to the page that should answer it, and
          then do the on-page, technical, and content work it takes to win the spot. If you also
          serve a defined area, we run{" "}
          <InlineLink href={localSeo.href}>{localSeo.linkText}</InlineLink> alongside it so you take
          the map results too.
        </p>
        <p>
          And every change we make has to earn its place against a number you actually care about:
          qualified visits, leads, revenue. Ranking first for a phrase nobody buys from is a vanity
          metric, and we are not interested in those.
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
          "You will usually see the first movement on the easier, lower-competition terms inside two to three months, with traffic you can actually feel around the six-month mark. The reason SEO is worth the wait is that it compounds — what you publish in month one is still earning in month twelve, which is exactly how it overtakes paid ads over time. If someone promises you page one in 30 days, they are selling a shortcut that tends to end in a penalty.",
      },
      {
        question: "Do you guarantee #1 rankings?",
        answer:
          "No, and be wary of anyone who does — Google's results hinge on things no agency controls. What we will guarantee is the work itself: the audit, the fixes, the content, the links, all reported openly. We aim at the rankings that bring revenue and at the leads those rankings actually produce, not a screenshot of position one for a term nobody searches.",
      },
      {
        question: "What is the difference between SEO and local SEO?",
        answer:
          "Plain SEO is about ranking in the normal organic results for anyone, anywhere. Local SEO is the narrower game of winning the Google map pack and 'near me' searches when someone is looking for a business in a specific area. Most local businesses genuinely need both, so we run them together and let the map listing and the organic ranking back each other up.",
      },
      {
        question: "Will you need to change my website?",
        answer:
          "Almost always a little. SEO touches page content, structure, internal links, and technical settings under the hood. We work with the site and the developers you already have wherever we can, and anything that needs a real build change gets flagged and explained before we touch it. Nothing ships without your sign-off.",
      },
      {
        question: "How do you report results?",
        answer:
          "Once a month, in plain English: which keywords moved, what happened to organic traffic and leads, what we shipped, and what is next. We pull the numbers straight from GA4 and Google Search Console, so you are looking at Google's own data, not a figure we massaged in a dashboard.",
      },
      {
        question: "Is SEO still worth it now that AI answers questions directly?",
        answer:
          "Arguably more than before. The same well-structured, genuinely useful content that ranks in Google is what ChatGPT and Google's AI Overviews reach for when they write an answer. We build for both at once, and our Generative Engine Optimization service adds the AI-specific layer on top of solid SEO foundations.",
      },
    ],
    authorNote: (
      <p>
        Hassan leads SEO and digital strategy at NexFortis, where he has built the practice around a
        simple idea: turn search into a lead source a business owner can actually count on. As
        founder and CEO he stays on every engagement himself, so the person setting your strategy is
        the same one who picks up when you call &mdash; no hand-off to a junior team.
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
          Picture someone in Vaughan whose server just died, thumbing &ldquo;IT support near
          me&rdquo; into their phone. Google hands them a little map with three businesses pinned to
          it, and almost nobody scrolls past those three. If your name is not one of them, that
          customer never knows you exist &mdash; even if you are the better choice and half a
          kilometre closer.
        </p>
        <p>
          Getting into that map pack is what local SEO is for. There is no single switch; it is the
          sum of a properly built Google Business Profile, business details that match everywhere
          they appear online, a steady trickle of real reviews, and pages that speak to the specific
          places you serve. Together those tell Google you are a real, trusted option in the area.
          It is one slice of our wider{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>, and it works hand in
          glove with <InlineLink href={seo.href}>{seo.linkText}</InlineLink> when you want both the
          map and the regular results working for you.
        </p>
        <p>
          The reason it is worth the effort is simple: people searching locally are usually ready to
          act. They call, they ask for directions, they show up &mdash; and the businesses sitting
          in the map pack get first crack at all of it.
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
        label: "of consumers read online reviews for local businesses.",
        sourceName: "BrightLocal Online Review Statistics",
        sourceUrl: "https://www.brightlocal.com/resources/online-reviews-statistics/",
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
          "Local SEO is the work that puts your business in front of people searching nearby — the Google map pack, 'near me' searches, and Google Maps. Most of it comes down to four things: your Google Business Profile, business details that stay consistent everywhere online, your reviews, and content that actually speaks to the area you serve.",
      },
      {
        question: "Do I need a storefront to do local SEO?",
        answer:
          "Not at all. Plenty of our clients go to the customer rather than the other way around — IT support, trades, consultants, home services. Google lets you set a service area instead of a public address, and as long as it is configured properly you show up for the places you actually cover. We set that up so you are not accidentally invisible or, worse, ranking for towns you don't serve.",
      },
      {
        question: "How important are Google reviews?",
        answer:
          "Hugely, and on two fronts. Reviews feed into where you land in the map pack, and they are usually the deciding factor when a searcher is choosing between you and the business listed right beside you. A slow, steady stream of genuine reviews — and a reply to every one — is one of the highest-return things a local business can do, so we put a simple system in place to keep them coming.",
      },
      {
        question: "How long does local SEO take?",
        answer:
          "Some of it moves quickly. Tidying up and optimising a Google Business Profile can shift the map pack within a few weeks. The slower-burning pieces — citations, reviews, location pages — tend to build over two to four months. A busy downtown market takes longer than a quieter suburb, and we will tell you honestly which one you are in before we start.",
      },
      {
        question: "Can you handle multiple locations?",
        answer:
          "Yes. Each branch or service area gets its own profile, its own citations, and its own location page, all kept consistent with each other while the content stays specific to each place. We do this for businesses running anything from two locations to a dozen.",
      },
    ],
    authorNote: (
      <p>
        Hassan helps businesses across the GTA win the local search moments that actually turn into
        calls &mdash; the map pack, the Google Business Profile, the &ldquo;near me&rdquo; searches.
        As founder and CEO of NexFortis he stays hands-on with every engagement, so the person
        planning your local strategy is the same one you can pick up the phone and reach.
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
          Search is quietly splitting into two. There are still the familiar blue links, but next to
          them a fast-growing slice of answers now comes straight from an AI &mdash; Google&rsquo;s
          AI Overviews, ChatGPT, Perplexity, Gemini. These engines do not hand back ten options.
          They write one answer and name a few sources. If your brand is not one of them, you are
          simply not in the room at the moment someone is making up their mind.
        </p>
        <p>
          Generative Engine Optimization is how you get into that answer. It stands on the same
          foundations as <InlineLink href={seo.href}>{seo.linkText}</InlineLink>, then adds the
          structure, the sourcing, and the brand signals that language models actually reward. It is
          the most forward-looking piece of our{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>, and it is still rare
          among GTA agencies &mdash; which, frankly, is the whole opportunity. The brands that teach
          these engines to trust them now will be the default answers later.
        </p>
      </>
    ),
    introCallout: (
      <CalloutBox title="What is Generative Engine Optimization (GEO)?">
        GEO &mdash; you will also hear it called AI search optimization or answer engine optimization
        &mdash; is the work of structuring your content and building your brand so that generative AI
        engines quote you in the answers they write. Put simply: SEO competes for a ranking, GEO
        competes for a citation inside the answer itself.
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
          "GEO is the work of optimizing your content and brand so that generative AI engines — ChatGPT, Google's AI Overviews, Perplexity, Gemini — cite you when they answer a buyer's question. You will also see it called AI search optimization or answer engine optimization. The simplest way to think about it: SEO is a fight for a ranking, GEO is a fight for a mention inside the answer the AI writes.",
      },
      {
        question: "Is GEO different from SEO?",
        answer:
          "It grows out of SEO but it is not the same job. Strong, well-organised content helps with both, true, but GEO adds its own layer on top: passage-level structure an engine can lift cleanly, entity and Q&A schema, and brand mentions across the places these models learn to trust. So we run GEO on top of solid SEO, never instead of it.",
      },
      {
        question: "Which AI engines do you optimize for?",
        answer:
          "Whichever ones your buyers are actually using — in practice that means Google's AI Overviews and AI Mode, ChatGPT, Perplexity, and Gemini. We run your priority prompts through each, see who is getting cited today, and put the effort where your audience and the opportunity line up.",
      },
      {
        question: "Can you guarantee my brand gets cited?",
        answer:
          "No, and the same caveat applies as with a Google ranking — the engine makes the call, not us. What we can genuinely do is move the odds: build the structure, schema, and brand signals these engines reward, then track your citations over time so you can watch the trend rather than take it on faith.",
      },
      {
        question: "How do you measure GEO results?",
        answer:
          "We run your target prompts across each engine on a regular schedule and record how often — and how prominently — your brand turns up. That gives you a month-over-month trend per engine instead of a single snapshot, so you can actually see whether the work is landing.",
      },
      {
        question: "Is it too early to invest in GEO?",
        answer:
          "Honestly, early is the whole point. AI answers already show up on a large share of searches and more buyers start with ChatGPT every month, yet hardly any local competitors are optimising for it. Earning these engines' trust now is far cheaper than trying to claw your way in once everyone else has noticed.",
      },
    ],
    authorNote: (
      <p>
        Hassan leads NexFortis&rsquo;s work on AI search, helping Canadian businesses earn a place in
        ChatGPT, Google&rsquo;s AI Overviews, and the other generative engines before their
        competitors think to try. As founder and CEO he treats GEO as the firm&rsquo;s bet on where
        search is heading &mdash; and works on it directly with every client.
      </p>
    ),
    ctaHeading: "Want to be the answer AI gives?",
    ctaSubtext:
      "Get a free AI visibility check — see which engines cite you today, where your competitors lead, and the fastest way to close the gap.",
  },

  // ------------------------------------------------ TECHNICAL SEO ----
  "technical-seo": {
    metaTitle: "Technical SEO Services",
    metaDescription:
      "Technical SEO services for Canadian businesses: crawlability, indexation, Core Web Vitals, structured data, and rendering fixes that let Google rank you.",
    h1: "Technical SEO Services That Unblock Rankings",
    heroSubtitle:
      "Fix the crawl, indexation, speed, and structured-data problems quietly holding your site back — so the rest of your SEO can finally work.",
    serviceType: "Technical SEO",
    serviceSchemaName: "Technical SEO Services",
    serviceSchemaDescription:
      "Technical search engine optimization for Canadian businesses — site audits, crawlability and indexation, Core Web Vitals, structured data, and rendering fixes.",
    introHeading: "The work that decides whether your other SEO pays off",
    intro: (
      <>
        <p>
          You can write the best page on the internet, but if Google cannot crawl it, render it, or
          load it before a visitor gives up, none of that effort lands. That is the quiet trap most
          sites fall into: the content and the links are fine, yet rankings stall because something
          under the hood is broken. Technical SEO is the unglamorous job of finding and fixing those
          things.
        </p>
        <p>
          It is the foundation beneath every other part of our{" "}
          <InlineLink href={seo.href}>{seo.linkText}</InlineLink> work &mdash; crawl paths, how your
          pages get indexed, Core Web Vitals and load speed, structured data, site architecture, and
          the JavaScript-rendering issues that trip up modern sites. Get these right and the keyword
          work, the content, and the links you invest in actually have a chance to rank. It is part
          of our broader{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
        <p>
          We start every engagement with an audit, because guessing at technical problems wastes
          money. You get a prioritised list of what is actually costing you rankings, in plain
          language, with the high-impact fixes first.
        </p>
      </>
    ),
    stats: [
      {
        value: "≈90%",
        label: "of global search runs on Google — the crawler you have to satisfy.",
        sourceName: "Statcounter Global Stats",
        sourceUrl: "https://gs.statcounter.com/search-engine-market-share",
      },
      {
        value: "43%",
        label: "of mobile sites pass all three Core Web Vitals — so speed is still an edge.",
        sourceName: "2024 Web Almanac, HTTP Archive",
        sourceUrl: "https://almanac.httparchive.org/en/2024/performance",
      },
      {
        value: "53%",
        label: "of mobile visits are abandoned if a page takes over 3 seconds to load.",
        sourceName: "Google, The Need for Mobile Speed",
        sourceUrl: "https://blog.google/products/admanager/the-need-for-mobile-speed/",
      },
    ],
    featuresHeading: "What's included in our technical SEO services",
    featuresSubtitle:
      "Everything that controls whether Google can crawl, index, and rank your site.",
    features: [
      {
        icon: Gauge,
        title: "Technical SEO audit",
        description:
          "We crawl your site the way Google does and surface what's actually capping rankings — then hand you a prioritised, plain-language fix list with the highest-impact items first, not a 200-row spreadsheet nobody reads.",
      },
      {
        icon: Bot,
        title: "Crawlability & indexation",
        description:
          "We make sure Google can reach and index the pages you want ranked — robots.txt, XML sitemaps, canonical tags, redirect chains, and the crawl-budget waste that quietly buries your important pages.",
      },
      {
        icon: LineChart,
        title: "Core Web Vitals & speed",
        description:
          "We diagnose and fix the loading, interactivity, and layout-shift problems behind poor Core Web Vitals — the field-measured scores Google uses and the ones that decide whether a visitor stays or bounces.",
      },
      {
        icon: FileCode,
        title: "Structured data & schema",
        description:
          "We implement and validate the schema that helps Google understand your pages and earn rich results — and the same markup increasingly helps AI engines trust and cite your content.",
      },
      {
        icon: Search,
        title: "Site architecture & internal links",
        description:
          "We organise your URLs and internal links so authority flows to the pages that matter and Google can understand how your site fits together — the structure that makes everything else rank more easily.",
      },
      {
        icon: FileText,
        title: "Rendering, JavaScript & migrations",
        description:
          "We catch the JavaScript-rendering issues that hide content from crawlers, and we plan and protect site migrations so a redesign or replatform doesn't quietly erase years of rankings.",
      },
    ],
    processHeading: "How we deliver technical SEO",
    process: [
      {
        step: "01",
        title: "Crawl & audit",
        description:
          "We crawl your site, pull Search Console and Core Web Vitals data, and find what's actually blocking rankings — then turn it into a prioritised plan you can see.",
      },
      {
        step: "02",
        title: "Fix the blockers",
        description:
          "We work top-down by impact: crawl and indexation issues first, then speed and structured data, with your sign-off before anything touches the live site.",
      },
      {
        step: "03",
        title: "Validate & monitor",
        description:
          "We confirm each fix in the field — re-crawl, re-test Core Web Vitals, watch indexation — so we know a change actually worked, not just that it shipped.",
      },
      {
        step: "04",
        title: "Keep it healthy",
        description:
          "Technical debt creeps back as a site grows. We monitor for new errors, regressions, and crawl waste, and fix them before they cost you rankings.",
      },
    ],
    comparisonHeading: "NexFortis vs. a typical SEO provider",
    comparison: [
      { feature: "Technical SEO", us: "A core service, audited and fixed", them: "Often out of scope or skipped" },
      { feature: "Audit output", us: "Prioritised, plain-language fix list", them: "A raw 200-row export" },
      { feature: "Core Web Vitals", us: "Diagnosed and fixed in the field", them: "A Lighthouse screenshot" },
      { feature: "Fixes", us: "Validated after they ship", them: "Marked done and forgotten" },
      { feature: "Who does the work", us: "A senior consultant you can reach", them: "A rotating junior" },
      { feature: "Commitment", us: "Month-to-month — we earn the renewal", them: "Locked contracts" },
    ],
    pricingHeading: "What technical SEO costs",
    pricing: {
      fromLabel: "Audit first, then scoped to what's broken",
      note: (
        <>
          <p className="mb-4">
            A clean, modern site needs far less than a large or aging one carrying years of technical
            debt, so we don&rsquo;t quote a flat package blind. We start with an audit, show you
            what&rsquo;s actually costing you rankings, and scope the fixes from there.
          </p>
          <p>
            You get transparent pricing, a fixed scope, and no long-term lock-in. Ask for a free
            technical assessment and we&rsquo;ll tell you what&rsquo;s worth fixing first.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "What is technical SEO?",
        answer:
          "Technical SEO is the work that makes sure search engines can crawl, render, index, and trust your site. It covers things like site speed and Core Web Vitals, crawlability, indexation, structured data, site architecture, and JavaScript rendering. It's the layer underneath your content and links — when it's broken, the rest of your SEO underperforms no matter how good it is.",
      },
      {
        question: "What is a technical SEO audit?",
        answer:
          "It's a structured review of everything that affects how search engines access and understand your site. We crawl it the way Google does, pull data from Search Console and Core Web Vitals, and produce a prioritised list of issues with the highest-impact fixes first. It's the starting point for every technical engagement, because guessing at problems wastes money.",
      },
      {
        question: "What's the difference between on-page and technical SEO?",
        answer:
          "On-page SEO is about the content of a page — titles, headings, copy, and keywords. Technical SEO is about the plumbing that lets Google reach and process that page at all — speed, crawling, indexing, structured data, and rendering. You need both, and we handle them together as part of a full SEO engagement.",
      },
      {
        question: "How do I know if I need technical SEO?",
        answer:
          "Common signs: pages that won't rank despite good content, traffic that dropped after a redesign or migration, slow load times, pages missing from Google, or a Search Console full of coverage and Core Web Vitals warnings. If any of those sound familiar, a technical audit will tell you what's wrong and what it's costing you.",
      },
      {
        question: "Will you work with my existing developers?",
        answer:
          "Yes. We can either implement fixes directly or hand your team clear, prioritised specifications they can ship — whatever fits how you work. Either way, nothing goes live without your sign-off, and we validate each change afterward so you know it actually worked.",
      },
    ],
    authorNote: (
      <p>
        Hassan leads technical SEO at NexFortis, bringing an IT and engineering background to the
        crawl, indexation, speed, and rendering work that decides whether a site can rank at all. As
        founder and CEO he stays hands-on with every engagement.
      </p>
    ),
    ctaHeading: "Is something under the hood holding you back?",
    ctaSubtext:
      "Get a free technical SEO assessment — we'll crawl your site, find what's capping your rankings, and show you the fixes that matter most.",
  },

  // ------------------------------------- GOOGLE BUSINESS PROFILE ----
  "google-business-profile": {
    metaTitle: "Google Business Profile",
    metaDescription:
      "Google Business Profile management for GTA businesses: optimization, posts, reviews, and listing consistency to win the Map Pack and earn more calls.",
    h1: "Google Business Profile Management & Optimization",
    heroSubtitle:
      "Claim, optimize, and actively manage the profile that decides whether you show up in the Google Map Pack — and turn that visibility into calls.",
    serviceType: "Google Business Profile Management",
    serviceSchemaName: "Google Business Profile Management",
    serviceSchemaDescription:
      "Google Business Profile optimization and management for businesses across the Greater Toronto Area — profile build-out, posts, reviews, photos, and listing consistency.",
    introHeading: "Your profile is the single biggest lever on the map pack",
    intro: (
      <>
        <p>
          For a local business, your Google Business Profile is doing more work than your website on
          most days. It is the box with your map pin, hours, reviews, and call button that shows up
          the moment someone searches for what you do nearby &mdash; often before they ever reach a
          website. Get it right and you are in the running for the Map Pack; leave it half-finished
          and you are handing those calls to the business listed above you.
        </p>
        <p>
          The profile itself is free to set up. The hard part is everything after that: keeping it
          complete and accurate, posting, earning and answering reviews, fixing duplicate or
          inconsistent listings, and reading the insights to see what is actually driving calls. We
          manage that end to end. It is one of the strongest levers in our{" "}
          <InlineLink href={localSeo.href}>{localSeo.linkText}</InlineLink> work and part of the
          wider <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
        <p>
          Most providers optimize a profile once and never touch it again. Google rewards active,
          accurate profiles, so we treat it as an ongoing program &mdash; which is what actually
          moves and holds map-pack position.
        </p>
      </>
    ),
    stats: [
      {
        value: "2.7×",
        label: "more likely customers consider a business reputable with a complete profile.",
        sourceName: "Google (via BrightLocal Local SEO Statistics)",
        sourceUrl: "https://www.brightlocal.com/resources/local-seo-statistics/",
      },
      {
        value: "81%",
        label: "of consumers used Google to evaluate local businesses in 2024.",
        sourceName: "BrightLocal Local Consumer Review Survey 2024",
        sourceUrl: "https://www.brightlocal.com/research/local-consumer-review-survey-2024/",
      },
      {
        value: "≈90%",
        label: "of search runs on Google — where your Business Profile lives.",
        sourceName: "Statcounter Global Stats",
        sourceUrl: "https://gs.statcounter.com/search-engine-market-share",
      },
    ],
    featuresHeading: "What's included in our Google Business Profile management",
    featuresSubtitle: "Everything it takes to win and hold the map pack — not a one-time tidy-up.",
    features: [
      {
        icon: Building2,
        title: "Full profile build-out & optimization",
        description:
          "We complete every field that matters — categories, services, hours, attributes, and a keyword-aware description — because a complete profile is what Google rewards and what makes a searcher choose you.",
      },
      {
        icon: MapPin,
        title: "Ongoing management & posts",
        description:
          "We keep the profile active with regular posts, offers, and updates, and fix issues as they appear. Active profiles hold map-pack position; neglected ones quietly slide.",
      },
      {
        icon: Star,
        title: "Review generation & response",
        description:
          "We set up a simple system to earn steady, genuine reviews and respond to every one — a direct ranking signal and the first thing a nearby buyer reads before they call.",
      },
      {
        icon: Map,
        title: "Photos, products & services",
        description:
          "We add and refresh the photos, products, and service listings that make your profile richer and more clickable — the details that turn a listing view into a visit or a call.",
      },
      {
        icon: Users,
        title: "Listing consistency & duplicates",
        description:
          "We make sure your name, address, and phone match across Google and the directories that feed it, and clean up duplicate or out-of-date listings that confuse Google and customers alike.",
      },
      {
        icon: LineChart,
        title: "Insights & call tracking",
        description:
          "We track profile views, searches, calls, and direction requests so you can see exactly what the profile is returning — not just that it exists.",
      },
    ],
    processHeading: "How we manage your Google Business Profile",
    process: [
      {
        step: "01",
        title: "Audit & claim",
        description:
          "We review (or claim and verify) your profile, benchmark it against the competitors winning your map pack, and flag every gap and inconsistency.",
      },
      {
        step: "02",
        title: "Optimize",
        description:
          "We complete and optimize every field, sort out categories and services, fix listing inconsistencies, and load the photos and details that make the profile compete.",
      },
      {
        step: "03",
        title: "Activate",
        description:
          "We turn on review generation, start a posting cadence, and keep the profile fresh — the ongoing activity Google rewards with map-pack visibility.",
      },
      {
        step: "04",
        title: "Track & refine",
        description:
          "We monitor insights and map-pack position, respond to reviews, and refine the profile month over month so the results compound.",
      },
    ],
    comparisonHeading: "NexFortis vs. a set-and-forget provider",
    comparison: [
      { feature: "Profile", us: "Actively managed every month", them: "Optimized once, then ignored" },
      { feature: "Reviews", us: "A system that earns and responds", them: "Left to chance" },
      { feature: "Listings", us: "Audited and kept consistent", them: "Never revisited" },
      { feature: "Reporting", us: "Profile insights tied to calls", them: "None" },
      { feature: "Who does the work", us: "A senior consultant you can reach", them: "A rotating junior" },
      { feature: "Commitment", us: "Month-to-month — we earn the renewal", them: "Locked contracts" },
    ],
    pricingHeading: "What Google Business Profile management costs",
    pricing: {
      fromLabel: "Priced by competition and number of locations",
      note: (
        <>
          <p className="mb-4">
            Setting up the profile is free &mdash; the value is in the ongoing management, and that
            scales with how competitive your area is and how many locations you run. A single quiet
            niche needs far less than a multi-location business fighting for a busy map pack.
          </p>
          <p>
            You get a fixed monthly scope, transparent pricing, and no long-term lock-in. Ask for a
            free profile audit and we&rsquo;ll quote it against your area and your competition.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "Is a Google Business Profile free?",
        answer:
          "Yes — creating and managing your own Google Business Profile costs nothing; Google doesn't charge for it. What you're paying for with a service like ours is the expertise and the ongoing work: optimizing every field correctly, earning reviews, posting, fixing listing inconsistencies, and tracking what's actually driving calls. The profile is free; getting it to win the map pack is the job.",
      },
      {
        question: "Can I rank without a storefront or public address?",
        answer:
          "Yes. Service-area businesses that travel to customers can set a service area instead of showing a public address. We configure it correctly so you appear for the areas you actually serve without breaking Google's guidelines — a common mistake that gets profiles suspended.",
      },
      {
        question: "What's the difference between setup and ongoing management?",
        answer:
          "Setup is a one-time optimization — completing the profile, sorting categories, adding photos. Management is the ongoing work that actually holds and grows your position: posting, earning and answering reviews, keeping information current, and fixing problems as they appear. Google rewards active profiles, so management is where most of the long-term value is.",
      },
      {
        question: "How important are reviews to my profile?",
        answer:
          "Very. Reviews influence both your map-pack ranking and whether a searcher picks you over the business beside you. A steady stream of genuine reviews and a prompt response to each is one of the highest-return things you can do, so we build a simple system to keep them coming.",
      },
      {
        question: "How quickly will I see results?",
        answer:
          "Profile improvements can move the map pack within a few weeks — faster than most SEO. Reviews and listing cleanup compound over the following months. Competitive urban areas take longer than quieter suburbs, and we set honest expectations against your specific market up front.",
      },
    ],
    authorNote: (
      <p>
        Hassan helps GTA businesses turn their Google Business Profile into a steady source of calls
        and visits. As founder and CEO of NexFortis he works hands-on with every engagement, so the
        person managing your profile is the same one you can reach directly.
      </p>
    ),
    ctaHeading: "Want to win your local map pack?",
    ctaSubtext:
      "Get a free Google Business Profile audit — your gaps, your competitors' edge, and the fastest path to more calls from nearby searches.",
  },

  // -------------------------------------------- CONTENT MARKETING ----
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
  "google-ads": {
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
    metaTitle: "Web Design & Development",
    metaDescription:
      "Web design & development for Canadian businesses: fast, mobile-first websites built on modern frameworks and engineered to rank and convert.",
    h1: "Web Design & Development That Converts",
    heroSubtitle:
      "Fast, mobile-first websites built on modern frameworks — engineered to rank in search and turn visitors into customers, not just look good.",
    serviceType: "Web Design and Development",
    serviceSchemaName: "Web Design & Development Services",
    serviceSchemaDescription:
      "Web design and development for Canadian businesses — custom, responsive, conversion-focused websites built on modern frameworks and engineered to rank and perform.",
    introHeading: "A website should earn its keep, not just look nice",
    intro: (
      <>
        <p>
          A beautiful website that loads slowly, can&rsquo;t be found in Google, or doesn&rsquo;t
          turn visitors into enquiries is an expensive brochure. Plenty of businesses pay for the
          first part and quietly lose on the other three. We build sites that do all four: look the
          part, load fast, rank, and convert.
        </p>
        <p>
          That comes from treating a website as engineering, not just decoration. We build on modern
          frameworks, design mobile-first, and bake in the technical foundations search engines
          reward &mdash; so your new site is set up to win from launch. It works hand in hand with
          our <InlineLink href={getDmSpoke("technical-seo").href}>{getDmSpoke("technical-seo").linkText}</InlineLink>{" "}
          work and is part of the wider{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>.
        </p>
        <p>
          We are an IT and engineering firm at heart, so &ldquo;built to rank and convert&rdquo;
          isn&rsquo;t a slogan &mdash; it&rsquo;s how we approach every build, down to the speed and
          structure most agencies leave as an afterthought.
        </p>
      </>
    ),
    stats: [
      {
        value: "53%",
        label: "of mobile visits are abandoned if a page takes over 3 seconds to load.",
        sourceName: "Google, The Need for Mobile Speed",
        sourceUrl: "https://blog.google/products/admanager/the-need-for-mobile-speed/",
      },
      {
        value: "43%",
        label: "of mobile sites pass all three Core Web Vitals — most don't.",
        sourceName: "2024 Web Almanac, HTTP Archive",
        sourceUrl: "https://almanac.httparchive.org/en/2024/performance",
      },
      {
        value: "≈90%",
        label: "of global search runs on Google — so a site has to be built to rank there.",
        sourceName: "Statcounter Global Stats",
        sourceUrl: "https://gs.statcounter.com/search-engine-market-share",
      },
    ],
    featuresHeading: "What's included in our web design & development",
    featuresSubtitle: "Design, build, and the engineering that makes a site fast and findable.",
    features: [
      {
        icon: PenTool,
        title: "Custom design",
        description:
          "We design a site around your brand and your customers, not a recycled template — clean, modern, and built to guide visitors toward the action you want them to take.",
      },
      {
        icon: Gauge,
        title: "Responsive & mobile-first",
        description:
          "Most of your visitors are on a phone, so we design for that screen first and scale up — your site looks and works right on every device, not just a designer's desktop.",
      },
      {
        icon: FileCode,
        title: "Built on modern frameworks",
        description:
          "We build on current, well-supported frameworks, so your site is fast, secure, and maintainable — not a fragile pile of plugins that breaks the next time something updates.",
      },
      {
        icon: Search,
        title: "SEO-ready foundations",
        description:
          "We bake in the crawlability, structure, and metadata search engines need from day one, so your new site can rank instead of starting life invisible to Google.",
      },
      {
        icon: Users,
        title: "Conversion-focused UX",
        description:
          "We design the layout, calls to action, and page flow around turning visitors into enquiries — because traffic that doesn't convert is just a number on a chart.",
      },
      {
        icon: LineChart,
        title: "Speed & Core Web Vitals",
        description:
          "We optimise load time and Core Web Vitals as we build, not as a bolt-on later — because speed affects both your rankings and whether a visitor sticks around at all.",
      },
    ],
    processHeading: "How we design & build your site",
    process: [
      {
        step: "01",
        title: "Discover & plan",
        description:
          "We learn your business, your customers, and your goals, map the pages and content you need, and plan a site structured to rank and convert.",
      },
      {
        step: "02",
        title: "Design",
        description:
          "We design the look and feel and the page layouts, mobile-first, and refine with you until it represents your brand and guides visitors to act.",
      },
      {
        step: "03",
        title: "Build & optimize",
        description:
          "We develop the site on a modern framework with SEO foundations, speed, and accessibility built in — then test it across devices before anything goes live.",
      },
      {
        step: "04",
        title: "Launch & support",
        description:
          "We launch carefully (protecting any existing rankings), confirm everything works, and can keep the site updated, secure, and fast afterward.",
      },
    ],
    comparisonHeading: "NexFortis vs. a typical web shop",
    comparison: [
      { feature: "Built for", us: "Speed, search, and conversion", them: "Looks alone" },
      { feature: "Foundation", us: "Modern framework, maintainable", them: "Plugin-heavy and fragile" },
      { feature: "SEO", us: "Baked in from day one", them: "An afterthought or upsell" },
      { feature: "Mobile", us: "Designed mobile-first", them: "Desktop design squeezed down" },
      { feature: "Who does the work", us: "A senior consultant you can reach", them: "A rotating junior" },
      { feature: "After launch", us: "Support and optimization available", them: "Handed over and gone" },
    ],
    pricingHeading: "What a website costs",
    pricing: {
      fromLabel: "Scoped to pages, features, and complexity",
      note: (
        <>
          <p className="mb-4">
            A simple, polished brochure site is a very different project from a large or
            e-commerce build, so we scope and quote each one rather than quoting a flat package
            blind. You&rsquo;ll know exactly what&rsquo;s included before any work starts.
          </p>
          <p>
            Pricing is transparent, with no surprise add-ons, and we can bundle ongoing support if
            you want it. Ask for a free website review and we&rsquo;ll recommend the right scope for
            your goals and budget.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "How much does a website cost?",
        answer:
          "It depends on the scope — number of pages, features, and whether you need e-commerce or custom functionality. A clean brochure site is far less than a large or transactional build, so we scope and quote each project rather than quoting blind. Whatever the number, you'll know exactly what's included before we start, with no surprise add-ons.",
      },
      {
        question: "How long does it take to build a website?",
        answer:
          "Most small-business sites take a few weeks from kickoff to launch; larger or e-commerce builds take longer. The biggest variable is usually how quickly content and feedback come back from your side. We'll give you a realistic timeline up front and keep the project moving against it.",
      },
      {
        question: "Custom design or a template/builder?",
        answer:
          "Builders like Wix or Squarespace can work for a very simple site, but they trade away speed, flexibility, and SEO control as you grow. We build custom on modern frameworks so your site is faster, more maintainable, and genuinely yours — without the limits and bloat that hold template sites back. We'll be honest if a simple builder is genuinely all you need.",
      },
      {
        question: "Will my site be mobile-friendly and SEO-ready?",
        answer:
          "Always. We design mobile-first because that's where most of your visitors are, and we build in the crawlability, structure, speed, and metadata search engines need from day one. The goal is a site that can rank from launch instead of needing an SEO rescue six months later.",
      },
      {
        question: "Do you handle hosting and maintenance?",
        answer:
          "We can. A website isn't finished at launch — it needs updates, security, backups, and the occasional fix. We offer ongoing support and maintenance so your site stays fast, secure, and current, or we can hand it over cleanly if you'd rather manage it yourself.",
      },
    ],
    authorNote: (
      <p>
        Hassan leads web design and development at NexFortis, bringing an IT and engineering
        background to sites built for speed, search, and conversion. As founder and CEO he stays
        hands-on with every build.
      </p>
    ),
    ctaHeading: "Want a website that works as hard as you do?",
    ctaSubtext:
      "Get a free website review — what's helping, what's holding you back, and what a fast, ranking, converting site would look like for your business.",
  },
};
