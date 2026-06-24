// Typed content for geo [service]+[city] pages — parallel to _dmContent.tsx.
// Each entry is GENUINELY local (real neighbourhoods, districts, market context, local
// proof) — never a templated city-name swap — which is what defeats Google's doorway-page
// penalty and the cross-page paragraph-dedup gate. The "what is <service>" definition is
// inherited from the national spoke and must NOT be re-authored here.
//
// Authored per page via the run book (Step 5), keyed "<parentSlug>/<citySlug>".
import type { ReactNode } from "react";
import { MapPin, FileText, PenTool, Star, Link2, Map, Code2, BarChart3, Palette, Smartphone, ShoppingCart, LayoutGrid, Gauge } from "lucide-react";
import type { SourcedStat, FeatureItem, FaqItem, TestimonialData } from "@/components/content/types";
import { InlineLink } from "@/components/content/InlineLink";
import { getDmSpoke, DM_PILLAR_HREF, type DmSpokeSlug } from "@/lib/internal-links";

/** A real district / neighbourhood / area the service is delivered in. */
export type GeoServiceArea = { name: string; note?: string };

/** A genuinely-local proof point. Real result/engagement OR a cited local market stat —
 *  NEVER an invented testimonial or client (per _facts.md). */
export type LocalProofPoint = { label: string; detail: ReactNode };

export type GeoPageContent = {
  // ---- identity (relates UP to the national spoke; do NOT re-author the service definition) ----
  parentSlug: DmSpokeSlug;
  citySlug: string;
  cityName: string;
  region: string; // "ON" | "AB" | "BC" | ...
  serviceType: string; // reuse the spoke's serviceType verbatim (schema)

  // ---- SEO meta (city-UNIQUE; cannibalization + INV-002/003/004 driver) ----
  metaTitle: string; // <=60 chars; include "NexFortis" or the suffix auto-appends
  metaDescription: string; // <=160 chars, city-specific (name a real local anchor)
  h1: string; // 25-70 chars — use "<Service> Services in <City>", never the bare 17-char form
  heroSubtitle: string;

  // ---- Service schema (city-aware) ----
  serviceSchemaName: string;
  serviceSchemaDescription: string;
  geoCoordinates?: { lat: number; lng: number };

  // ---- local body (the doorway-safe core; ALL city-unique prose) ----
  introHeading: string;
  intro: ReactNode;
  localContextHeading: string;
  localContext: ReactNode; // REQUIRED: real neighbourhoods, districts, landmarks, local market dynamics
  serviceAreas: readonly GeoServiceArea[]; // REQUIRED >=6 real districts/areas served
  localProof: readonly LocalProofPoint[]; // REQUIRED >=2 (real result or cited market stat — never invented)
  stats: readonly SourcedStat[]; // >=3 external sourced citations (content gate)
  features: readonly FeatureItem[]; // service-in-this-city specifics
  /** Override for the features-section heading (default "Our <service> work in <city>"). Use on
   *  web-design etc. where "work" wrongly implies a delivered portfolio we cannot show. */
  featuresHeading?: string;

  // ---- cross-link copy ----
  nearbyHeading?: string;

  // ---- FAQ (>=4; at least one CITY-specific question) ----
  faq: readonly FaqItem[];

  // ---- optional genuine city testimonial (real only) ----
  testimonial?: TestimonialData;

  authorNote: ReactNode;
  ctaHeading: string;
  ctaSubtext: string;
};

// Keyed "<parentSlug>/<citySlug>". Entries authored via the run book (Step 5), genuinely
// local — no templated swaps — and added as each page's content passes the gates and the
// matching GEO_PAGES entry flips published:true.
export const GEO_PAGE_CONTENT: Partial<Record<string, GeoPageContent>> = {
  "local-seo/toronto": {
    parentSlug: "local-seo",
    citySlug: "toronto",
    cityName: "Toronto",
    region: "ON",
    serviceType: "Local SEO",
    metaTitle: "Local SEO Toronto",
    metaDescription:
      "Local SEO for Toronto businesses — Google Business Profile, citations, reviews, and Map Pack rankings across Toronto neighbourhoods. Free local SEO audit.",
    h1: "Local SEO Services in Toronto",
    heroSubtitle:
      "Get found by Toronto customers searching for what you offer — senior-led local SEO that wins the Google Map Pack across the city's neighbourhoods.",
    serviceSchemaName: "Local SEO — Toronto",
    serviceSchemaDescription:
      "Local SEO for Toronto businesses — Google Business Profile optimization, local citations and NAP consistency, localized content, review generation, local link building, and Google Map Pack strategy, delivered by a senior-led Canadian team.",
    introHeading: "Local SEO for Toronto businesses",
    intro: (
      <>
        <p>
          NexFortis helps Toronto businesses get found by the customers searching for their services
          right now &mdash; in the Google Map Pack (the top three local listings Google shows with a
          map), the local results, and the &ldquo;near me&rdquo; searches that turn into real calls and
          visits.
        </p>
        <p>
          <strong>Local SEO Toronto</strong> is how a Toronto plumber, dental clinic, or law firm shows
          up the moment someone nearby searches, and in a market this competitive it is the most
          cost-effective way to capture demand you are otherwise losing to the business down the street.
        </p>
      </>
    ),
    localContextHeading: "Toronto's local search landscape",
    localContext: (
      <>
        <p>
          Toronto is not one market &mdash; it is dozens. Search behaviour in Liberty Village looks
          nothing like Scarborough or North York, and Google&rsquo;s proximity signals mean your
          visibility shifts neighbourhood by neighbourhood. People here search with location qualifiers
          &mdash; &ldquo;plumber Liberty Village,&rdquo; &ldquo;dentist North York,&rdquo;
          &ldquo;accountant Etobicoke&rdquo; &mdash; so a generic, national{" "}
          <InlineLink href={getDmSpoke("seo").href}>SEO</InlineLink> approach that ignores district-level
          intent simply does not rank.
        </p>
        <p>
          Toronto is also one of Canada&rsquo;s most competitive local markets. In legal, dental, home
          services, real estate, and hospitality you are up against dozens of local competitors fighting
          for the same three Map Pack spots, and they are actively investing in their Google Business
          Profiles, citations, and reviews. Winning here takes the local SEO services Toronto businesses
          rely on, built around the specific neighbourhoods you serve &mdash; part of your wider{" "}
          <InlineLink href={DM_PILLAR_HREF}>digital marketing</InlineLink>.
        </p>
      </>
    ),
    serviceAreas: [
      { name: "Downtown Core" },
      { name: "Midtown" },
      { name: "North York" },
      { name: "Scarborough" },
      { name: "Etobicoke" },
      { name: "East York" },
      { name: "Liberty Village" },
      { name: "Yorkville" },
      { name: "The Annex" },
      { name: "Leslieville" },
      { name: "the Beaches" },
      { name: "Junction" },
    ],
    stats: [
      {
        value: "≈46%",
        label: "of all Google searches have local intent.",
        sourceName: "BrightLocal",
        sourceUrl: "https://www.brightlocal.com/resources/local-seo-statistics/",
      },
      {
        value: "76%",
        label: "of people who search for something nearby visit a related business within a day.",
        sourceName: "Backlinko",
        sourceUrl: "https://backlinko.com/local-seo-guide",
      },
      {
        value: "71%",
        label: "of consumers use Google to read local business reviews.",
        sourceName: "BrightLocal Local Consumer Review Survey (2026)",
        sourceUrl: "https://www.brightlocal.com/research/local-consumer-review-survey/",
      },
    ],
    features: [
      {
        icon: MapPin,
        title: "Google Business Profile optimisation",
        description:
          "Complete setup, verification, category selection, accurate NAP, posts, and photos, with service-area configuration tuned to the Toronto neighbourhoods you serve.",
      },
      {
        icon: FileText,
        title: "Local citations and NAP consistency",
        description:
          "Listings across Yelp Canada, Yellow Pages Canada, and Toronto-specific and industry directories, plus an audit and clean-up of the inconsistent NAP data that quietly suppresses local rankings.",
      },
      {
        icon: PenTool,
        title: "Localised content",
        description:
          "Pages and on-page content built around Toronto neighbourhoods, landmarks, and real local search intent — not generic national topics.",
      },
      {
        icon: Star,
        title: "Review generation and reputation management",
        description:
          "A systematic process for earning authentic Google reviews from your Toronto customers, plus a response strategy that signals trust to both Google and prospects.",
      },
      {
        icon: Link2,
        title: "Local link building",
        description:
          "Outreach to Toronto websites, business associations, local media, and community organisations for relevant, authoritative local links — relevance over volume.",
      },
      {
        icon: Map,
        title: "Map Pack ranking strategy",
        description:
          "Targeting the top three local results by optimising the three signals Google weighs: relevance, proximity, and prominence.",
      },
    ],
    localProof: [
      {
        label: "The demand is already local",
        detail:
          "Roughly 46% of Google searches carry local intent (BrightLocal), and the businesses that win the Map Pack capture the bulk of those high-intent clicks before anyone scrolls to the organic results.",
      },
      {
        label: "Reviews decide the click",
        detail:
          "71% of consumers use Google to read local business reviews (BrightLocal) — which is why review generation is built into every Toronto local SEO campaign, not bolted on.",
      },
    ],
    faq: [
      {
        question: "How long does local SEO take in Toronto?",
        answer:
          "Most Toronto businesses begin seeing measurable movement in local rankings within a few months; competitive categories and dense downtown districts take longer. Google Business Profile work often delivers the earliest wins. These are general expectations, not guarantees.",
      },
      {
        question: "What does local SEO cost in Toronto?",
        answer:
          "It depends on your competition, the number of neighbourhoods you target, and the scope of work — which is why we scope every engagement after a free audit rather than quoting a one-size-fits-all price. Transparent pricing, no hidden fees, no lock-in.",
      },
      {
        question: "What is the Map Pack and why does it matter?",
        answer:
          "The Map Pack is the block of three local business listings Google shows at the top of local searches, alongside a map. It captures the majority of clicks for near-me and location-based queries, so ranking there is the primary goal of a local SEO campaign.",
      },
      {
        question: "Which Toronto industries does NexFortis serve?",
        answer:
          "Any Toronto business that relies on local customers finding it through Google — home services, legal, dental and medical, real estate, professional services, hospitality, and retail among them.",
      },
    ],
    authorNote: (
      <p>
        NexFortis is the local SEO company Toronto businesses turn to for senior attention &mdash; your
        campaign is led personally by Hassan Sadiq, NexFortis Founder and CEO, with a small senior team,
        and as a local SEO agency Toronto owners can rely on, the same people stay on your account end to
        end. With 15+ years in enterprise technology and as a certified Microsoft Solutions Partner, the
        technical side of local SEO &mdash; Google Business Profile, citations, and local schema &mdash;
        is handled with genuine depth. We work month to month with no lock-in: no junior hand-offs, no
        offshore execution.
      </p>
    ),
    ctaHeading: "Ready to win local search in Toronto?",
    ctaSubtext:
      "Book a free, no-obligation local SEO audit — an honest look at your Google Business Profile, citations, reviews, and Map Pack position, and exactly where the gaps are.",
  },
  "seo/mississauga": {
    parentSlug: "seo",
    citySlug: "mississauga",
    cityName: "Mississauga",
    region: "ON",
    serviceType: "SEO",
    metaTitle: "SEO Services Mississauga",
    metaDescription:
      "SEO services for Mississauga businesses — technical SEO, on-page, content, and link building to grow your organic rankings across the GTA. Free SEO audit.",
    h1: "SEO Services in Mississauga",
    heroSubtitle:
      "Help Mississauga customers find your business in Google's organic results — senior-led SEO that builds durable rankings, not quick tricks.",
    serviceSchemaName: "SEO — Mississauga",
    serviceSchemaDescription:
      "SEO services for Mississauga businesses — technical SEO, on-page optimization, content, link building, and analytics to grow organic search visibility, delivered by a senior-led Canadian team.",
    introHeading: "SEO services for Mississauga businesses",
    intro: (
      <>
        <p>
          NexFortis helps Mississauga businesses earn the organic Google rankings that bring in steady,
          qualified traffic &mdash; the searches happening across the GTA right now for what you sell. The{" "}
          <strong>SEO services Mississauga</strong> companies can rely on are not a one-time fix; they are
          the compounding work of making your site technically sound, genuinely useful, and trusted, so you
          climb past competitors and stay there.
        </p>
        <p>
          <strong>SEO Mississauga</strong> businesses invest in is the most durable channel they have:
          unlike paid ads, the visibility keeps working after the budget stops.
        </p>
      </>
    ),
    localContextHeading: "Competing for organic visibility in Mississauga",
    localContext: (
      <>
        <p>
          Mississauga is Ontario&rsquo;s third-largest city and one of the most competitive business
          markets in the GTA. Search behaviour differs across its districts &mdash; a contractor in
          Streetsville, a clinic near Square One, and a manufacturer in Malton each compete for different
          queries &mdash; and ranking organically means earning relevance and authority for the terms your
          Mississauga customers actually use.
        </p>
        <p>
          You are also up against Toronto and GTA-wide agencies chasing the same organic real estate, so a
          generic, templated approach does not cut through. Winning here takes{" "}
          <strong>Mississauga SEO</strong> built on technical excellence, local relevance, and content that
          answers real buyer questions &mdash; part of your wider{" "}
          <InlineLink href={DM_PILLAR_HREF}>digital marketing</InlineLink>, and complemented by dedicated{" "}
          <InlineLink href={getDmSpoke("local-seo").href}>local SEO</InlineLink> when the Map Pack matters.
        </p>
      </>
    ),
    serviceAreas: [
      { name: "City Centre (Square One)" },
      { name: "Port Credit" },
      { name: "Streetsville" },
      { name: "Meadowvale" },
      { name: "Erin Mills" },
      { name: "Cooksville" },
      { name: "Malton" },
      { name: "Clarkson" },
      { name: "Lakeview" },
      { name: "Lorne Park" },
      { name: "Mississauga Valley" },
      { name: "Hurontario" },
    ],
    stats: [
      {
        value: "≈86%",
        label: "of all searches in Canada run on Google.",
        sourceName: "Statcounter Global Stats (Canada)",
        sourceUrl: "https://gs.statcounter.com/search-engine-market-share/all/canada",
      },
      {
        value: "≈40%",
        label: "of clicks go to the #1 organic result.",
        sourceName: "FirstPageSage, 2026 Google CTR study",
        sourceUrl: "https://firstpagesage.com/reports/google-click-through-rates-ctrs-by-ranking-position/",
      },
      {
        value: "48%",
        label: "of mobile sites pass all three Core Web Vitals — so speed is still an edge.",
        sourceName: "2025 Web Almanac, HTTP Archive",
        sourceUrl: "https://almanac.httparchive.org/en/2025/performance",
      },
    ],
    features: [
      {
        icon: Code2,
        title: "Technical SEO",
        description:
          "Site speed, crawlability, indexation, structured data, and Core Web Vitals — so Google can find, understand, and trust your Mississauga site.",
      },
      {
        icon: FileText,
        title: "On-page optimisation",
        description:
          "Titles, headings, content, and internal links tuned to the keywords your Mississauga customers actually search.",
      },
      {
        icon: PenTool,
        title: "Content",
        description:
          "Pages and articles built around real buyer intent and local relevance — not keyword stuffing.",
      },
      {
        icon: Link2,
        title: "Link building",
        description:
          "Earning relevant, authoritative links that build the domain authority organic rankings depend on.",
      },
      {
        icon: MapPin,
        title: "Local SEO",
        description:
          "Google Business Profile and local signals as one component of a full SEO program — for a dedicated local and Map-Pack focus, see our local SEO page.",
      },
      {
        icon: BarChart3,
        title: "Analytics and reporting",
        description:
          "Transparent tracking of rankings, traffic, and the leads that actually matter, so you can see the ROI.",
      },
    ],
    localProof: [
      {
        label: "Organic is where the demand is",
        detail:
          "Google handles roughly 86% of all searches in Canada (Statcounter), and the #1 organic result earns about 40% of the clicks (FirstPageSage) — durable rankings, not ads alone, compound into real growth.",
      },
      {
        label: "Most sites leave technical wins on the table",
        detail:
          "Only 48% of mobile sites pass all three Core Web Vitals (Web Almanac) — the technical fixes that move rankings are exactly where a senior-led audit starts.",
      },
    ],
    faq: [
      {
        question: "How much do SEO services cost in Mississauga?",
        answer:
          "It depends on your competition, your starting point, and the scope of work — which is why we scope every engagement after a free audit rather than quoting a one-size-fits-all price. Transparent pricing, no hidden fees, no lock-in.",
      },
      {
        question: "How long does SEO take to show results in Mississauga?",
        answer:
          "Most businesses begin seeing measurable movement within a few months, with competitive terms taking longer. SEO compounds, so the gains build over time. These are general expectations, not guarantees.",
      },
      {
        question: "Is SEO worth it for Mississauga businesses?",
        answer:
          "For most local and GTA-serving businesses, yes — organic search is the most cost-effective long-term channel, because the visibility keeps working after the spend stops, unlike paid ads.",
      },
      {
        question: "What industries does NexFortis serve in Mississauga?",
        answer:
          "Any Mississauga business that relies on being found in Google — professional services, home services, healthcare, trades, retail, and B2B among them.",
      },
    ],
    authorNote: (
      <p>
        NexFortis is the SEO company Mississauga businesses turn to for senior attention &mdash; your
        campaign is led personally by Hassan Sadiq, NexFortis Founder and CEO, with a small senior team, and
        as an SEO agency Mississauga owners can rely on, the same people stay on your account end to end.
        With 15+ years in enterprise technology and as a certified Microsoft Solutions Partner, the technical
        side of SEO &mdash; site architecture, Core Web Vitals, and schema &mdash; is handled with genuine
        depth. We work month to month with no lock-in: no junior hand-offs, no offshore execution.
      </p>
    ),
    ctaHeading: "Ready to grow your organic search in Mississauga?",
    ctaSubtext:
      "Book a free, no-obligation SEO audit — an honest look at your technical health, on-page gaps, backlink profile, and the keyword opportunities specific to your Mississauga business.",
  },
  "seo/markham": {
    parentSlug: "seo",
    citySlug: "markham",
    cityName: "Markham",
    region: "ON",
    serviceType: "SEO",
    metaTitle: "SEO Company Markham",
    metaDescription:
      "SEO services for Markham businesses — technical SEO, on-page, content, and link building to grow your organic rankings across the GTA. Free SEO audit.",
    h1: "SEO Services in Markham",
    heroSubtitle:
      "Help Markham customers find your business in Google's organic results — senior-led SEO that builds durable rankings, not quick tricks.",
    serviceSchemaName: "SEO — Markham",
    serviceSchemaDescription:
      "SEO services for Markham businesses — technical SEO, on-page optimization, content, link building, and analytics to grow organic search visibility, delivered by a senior-led Canadian team.",
    introHeading: "SEO services for Markham businesses",
    intro: (
      <>
        <p>
          NexFortis helps Markham businesses earn the organic Google rankings that bring in steady,
          qualified traffic &mdash; the searches happening across the GTA right now for what you sell. As an{" "}
          <strong>SEO company Markham</strong> businesses can rely on, we treat SEO as the compounding work
          of making your site technically sound, genuinely useful, and trusted, so you climb past
          competitors and stay there.
        </p>
        <p>
          <strong>SEO Markham</strong> businesses invest in is the most durable channel they have: unlike
          paid ads, the visibility keeps working after the budget stops.
        </p>
      </>
    ),
    localContextHeading: "Competing for organic visibility in Markham",
    localContext: (
      <>
        <p>
          Markham is one of Canada&rsquo;s largest technology and business hubs &mdash; home to major tech
          employers and a dense, competitive market across Unionville, Markham Village, Cornell, Berczy,
          Cathedraltown, Milliken, Thornhill, and Downtown Markham. Ranking organically here means earning
          relevance and authority for the terms your Markham customers actually use, in a market where
          well-funded competitors invest heavily in search.
        </p>
        <p>
          You are also up against Toronto and GTA-wide agencies chasing the same organic real estate, so a
          generic, templated approach does not cut through. Winning here takes the SEO services Markham
          businesses rely on &mdash; <strong>Markham SEO</strong> built on technical excellence, local
          relevance, and content that answers real buyer questions
          &mdash; part of your wider <InlineLink href={DM_PILLAR_HREF}>digital marketing</InlineLink>, and
          complemented by dedicated <InlineLink href={getDmSpoke("local-seo").href}>local SEO</InlineLink>{" "}
          when the Map Pack matters.
        </p>
      </>
    ),
    serviceAreas: [
      { name: "Unionville" },
      { name: "Markham Village" },
      { name: "Cornell" },
      { name: "Berczy" },
      { name: "Cathedraltown" },
      { name: "Milliken" },
      { name: "Thornhill" },
      { name: "Downtown Markham" },
      { name: "Box Grove" },
      { name: "Greensborough" },
      { name: "Wismer" },
      { name: "Angus Glen" },
    ],
    stats: [
      {
        value: "≈86%",
        label: "of all searches in Canada run on Google.",
        sourceName: "Statcounter Global Stats (Canada)",
        sourceUrl: "https://gs.statcounter.com/search-engine-market-share/all/canada",
      },
      {
        value: "≈40%",
        label: "of clicks go to the #1 organic result.",
        sourceName: "FirstPageSage, 2026 Google CTR study",
        sourceUrl: "https://firstpagesage.com/reports/google-click-through-rates-ctrs-by-ranking-position/",
      },
      {
        value: "48%",
        label: "of mobile sites pass all three Core Web Vitals — so speed is still an edge.",
        sourceName: "2025 Web Almanac, HTTP Archive",
        sourceUrl: "https://almanac.httparchive.org/en/2025/performance",
      },
    ],
    features: [
      {
        icon: Code2,
        title: "Technical SEO",
        description:
          "Site speed, crawlability, indexation, structured data, and Core Web Vitals — so Google can find, understand, and trust your Markham site.",
      },
      {
        icon: FileText,
        title: "On-page optimisation",
        description:
          "Titles, headings, content, and internal links tuned to the keywords your Markham customers actually search.",
      },
      {
        icon: PenTool,
        title: "Content",
        description:
          "Pages and articles built around real buyer intent and local relevance — not keyword stuffing.",
      },
      {
        icon: Link2,
        title: "Link building",
        description:
          "Earning relevant, authoritative links that build the domain authority organic rankings depend on.",
      },
      {
        icon: MapPin,
        title: "Local SEO",
        description:
          "Google Business Profile and local signals as one component of a full SEO program — for a dedicated local and Map-Pack focus, see our local SEO page.",
      },
      {
        icon: BarChart3,
        title: "Analytics and reporting",
        description:
          "Transparent tracking of rankings, traffic, and the leads that actually matter, so you can see the ROI.",
      },
    ],
    localProof: [
      {
        label: "Organic is where the demand is",
        detail:
          "Google handles roughly 86% of all searches in Canada (Statcounter), and the #1 organic result earns about 40% of the clicks (FirstPageSage) — durable rankings, not ads alone, compound into real growth.",
      },
      {
        label: "Most sites leave technical wins on the table",
        detail:
          "Only 48% of mobile sites pass all three Core Web Vitals (Web Almanac) — the technical fixes that move rankings are exactly where a senior-led audit starts.",
      },
    ],
    faq: [
      {
        question: "How much does an SEO company in Markham cost?",
        answer:
          "It depends on your competition, your starting point, and the scope of work — which is why we scope every engagement after a free audit rather than quoting a one-size-fits-all price. Transparent pricing, no hidden fees, no lock-in.",
      },
      {
        question: "How long does SEO take for a Markham business?",
        answer:
          "Most businesses begin seeing measurable movement within a few months, with competitive terms taking longer. SEO compounds, so the gains build over time. These are general expectations, not guarantees.",
      },
      {
        question: "Is SEO worth it for a Markham business?",
        answer:
          "For most Markham and GTA-serving businesses, yes — organic search is the most cost-effective long-term channel, because the visibility keeps working after the spend stops, unlike paid ads.",
      },
      {
        question: "What industries does NexFortis serve in Markham?",
        answer:
          "Any Markham business that relies on being found in Google — technology and B2B, professional services, home services, healthcare, and retail among them.",
      },
    ],
    authorNote: (
      <p>
        NexFortis is the SEO company Markham businesses turn to for senior attention &mdash; your campaign
        is led personally by Hassan Sadiq, NexFortis Founder and CEO, with a small senior team, and as an
        SEO agency Markham owners can rely on, the same people stay on your account end to end. With 15+
        years in enterprise technology and as a certified Microsoft Solutions Partner, the technical side of
        SEO &mdash; site architecture, Core Web Vitals, and schema &mdash; is handled with genuine depth. We
        work month to month with no lock-in: no junior hand-offs, no offshore execution.
      </p>
    ),
    ctaHeading: "Ready to grow your organic search in Markham?",
    ctaSubtext:
      "Book a free, no-obligation SEO audit — an honest look at your technical health, on-page gaps, backlink profile, and the keyword opportunities specific to your Markham business.",
  },
  "local-seo/edmonton": {
    parentSlug: "local-seo",
    citySlug: "edmonton",
    cityName: "Edmonton",
    region: "AB",
    serviceType: "Local SEO",
    metaTitle: "Local SEO Edmonton",
    metaDescription:
      "Local SEO for Edmonton businesses — Google Business Profile, citations, reviews, and Map Pack rankings across Edmonton's neighbourhoods. Free local SEO audit.",
    h1: "Local SEO Services in Edmonton",
    heroSubtitle:
      "Get found by Edmonton customers searching for what you offer — senior-led local SEO that wins the Google Map Pack across the city's neighbourhoods.",
    serviceSchemaName: "Local SEO — Edmonton",
    serviceSchemaDescription:
      "Local SEO for Edmonton businesses — Google Business Profile optimization, local citations and NAP consistency, localized content, review generation, local link building, and Google Map Pack strategy, delivered by a senior-led Canadian team.",
    introHeading: "Local SEO for Edmonton businesses",
    intro: (
      <>
        <p>
          NexFortis helps Edmonton businesses get found by the customers searching for their services right
          now &mdash; in the Google Map Pack (the top three local listings Google shows with a map), the
          local results, and the &ldquo;near me&rdquo; searches that turn into real calls and visits.
        </p>
        <p>
          <strong>Local SEO Edmonton</strong> is how an Edmonton plumber, dental clinic, or law firm shows up
          the moment someone nearby searches, and in a competitive market it is the most cost-effective way
          to capture demand you are otherwise losing to the business down the street.
        </p>
      </>
    ),
    localContextHeading: "Edmonton's local search landscape",
    localContext: (
      <>
        <p>
          Edmonton is Alberta&rsquo;s capital and one of Canada&rsquo;s largest cities &mdash; a spread-out
          market where search behaviour shifts from Downtown to Old Strathcona to Windermere to Mill Woods,
          and Google&rsquo;s proximity signals mean your visibility changes neighbourhood by neighbourhood.
          People here search with location qualifiers &mdash; &ldquo;plumber Old Strathcona,&rdquo;
          &ldquo;dentist Windermere,&rdquo; &ldquo;accountant Mill Woods&rdquo; &mdash; so a generic, national{" "}
          <InlineLink href={DM_PILLAR_HREF}>digital marketing</InlineLink> approach that ignores
          district-level intent simply does not rank.
        </p>
        <p>
          Edmonton is also a genuinely competitive local market: in home services, legal, dental, and the
          trades you are up against established local competitors investing in their Google Business Profiles,
          citations, and reviews. Winning here takes the local SEO services Edmonton businesses rely on
          &mdash; <strong>Edmonton local SEO</strong> built around the specific neighbourhoods you serve.
        </p>
      </>
    ),
    serviceAreas: [
      { name: "Downtown" },
      { name: "Old Strathcona (Whyte Avenue)" },
      { name: "Oliver" },
      { name: "Windermere" },
      { name: "West Edmonton" },
      { name: "South Edmonton Common" },
      { name: "Jasper Avenue" },
      { name: "124 Street" },
      { name: "Mill Woods" },
      { name: "Ellerslie" },
      { name: "Summerside" },
      { name: "Terwillegar" },
    ],
    stats: [
      {
        value: "≈46%",
        label: "of all Google searches have local intent.",
        sourceName: "BrightLocal",
        sourceUrl: "https://www.brightlocal.com/resources/local-seo-statistics/",
      },
      {
        value: "76%",
        label: "of people who search for something nearby visit a related business within a day.",
        sourceName: "Backlinko",
        sourceUrl: "https://backlinko.com/local-seo-guide",
      },
      {
        value: "71%",
        label: "of consumers use Google to read local business reviews.",
        sourceName: "BrightLocal Local Consumer Review Survey (2026)",
        sourceUrl: "https://www.brightlocal.com/research/local-consumer-review-survey/",
      },
    ],
    features: [
      {
        icon: MapPin,
        title: "Google Business Profile optimisation",
        description:
          "Complete setup, verification, category selection, accurate NAP, posts, and photos, with service-area configuration tuned to the Edmonton neighbourhoods you serve.",
      },
      {
        icon: FileText,
        title: "Local citations and NAP consistency",
        description:
          "Listings across Yelp Canada, Yellow Pages Canada, and Edmonton-specific and industry directories, plus an audit and clean-up of the inconsistent NAP data that quietly suppresses local rankings.",
      },
      {
        icon: PenTool,
        title: "Localised content",
        description:
          "Pages and on-page content built around Edmonton neighbourhoods, landmarks, and real local search intent — not generic national topics.",
      },
      {
        icon: Star,
        title: "Review generation and reputation management",
        description:
          "A systematic process for earning authentic Google reviews from your Edmonton customers, plus a response strategy that signals trust to both Google and prospects.",
      },
      {
        icon: Link2,
        title: "Local link building",
        description:
          "Outreach to Edmonton websites, business associations, local media, and community organisations for relevant, authoritative local links — relevance over volume.",
      },
      {
        icon: Map,
        title: "Map Pack ranking strategy",
        description:
          "Targeting the top three local results by optimising the three signals Google weighs: relevance, proximity, and prominence.",
      },
    ],
    localProof: [
      {
        label: "The demand is already local",
        detail:
          "Roughly 46% of Google searches carry local intent (BrightLocal), and the businesses that win the Map Pack capture the bulk of those high-intent clicks before anyone scrolls to the organic results.",
      },
      {
        label: "Reviews decide the click",
        detail:
          "71% of consumers use Google to read local business reviews (BrightLocal) — which is why review generation is built into every Edmonton local SEO campaign, not bolted on.",
      },
    ],
    faq: [
      {
        question: "How long does local SEO take in Edmonton?",
        answer:
          "Most Edmonton businesses begin seeing measurable movement in local rankings within a few months; competitive categories take longer. Google Business Profile work often delivers the earliest wins. These are general expectations, not guarantees.",
      },
      {
        question: "What does local SEO cost in Edmonton?",
        answer:
          "It depends on your competition, the number of neighbourhoods you target, and the scope of work — which is why we scope every engagement after a free audit rather than quoting a one-size-fits-all price. Transparent pricing, no hidden fees, no lock-in.",
      },
      {
        question: "What is the Map Pack and why does it matter?",
        answer:
          "The Map Pack is the block of three local business listings Google shows at the top of local searches, alongside a map. It captures the majority of clicks for near-me and location-based queries, so ranking there is the primary goal of a local SEO campaign.",
      },
      {
        question: "Which Edmonton industries does NexFortis serve?",
        answer:
          "Any Edmonton business that relies on local customers finding it through Google — home services and trades, legal, dental and medical, real estate, professional services, and retail among them.",
      },
    ],
    authorNote: (
      <p>
        Your campaign is led personally by Hassan Sadiq, NexFortis Founder and CEO, with a small senior team.
        With 15+ years in enterprise technology and as a certified Microsoft Solutions Partner, the technical
        side of local SEO &mdash; Google Business Profile, citations, and local schema &mdash; is handled with
        genuine depth. As a local SEO company Edmonton businesses can rely on &mdash; and a local SEO agency
        Edmonton owners can trust for the long haul &mdash; we keep the same small senior team on your account
        end to end: no junior hand-offs, no offshore execution, month to month with no lock-in.
      </p>
    ),
    ctaHeading: "Ready to win local search in Edmonton?",
    ctaSubtext:
      "Book a free, no-obligation local SEO audit — an honest look at your Google Business Profile, citations, reviews, and Map Pack position, and exactly where the gaps are.",
  },
  "web-design/hamilton": {
    parentSlug: "web-design",
    citySlug: "hamilton",
    cityName: "Hamilton",
    region: "ON",
    serviceType: "Web Design",
    metaTitle: "Web Design Hamilton",
    metaDescription:
      "Web design for Hamilton businesses — custom, responsive, fast websites on WordPress or Shopify, including eCommerce. Senior-led, Canadian. Free consultation.",
    h1: "Web Design Services in Hamilton",
    heroSubtitle:
      "Custom, fast, mobile-first websites for Hamilton businesses — designed to build trust and turn visitors into customers.",
    serviceSchemaName: "Web Design — Hamilton",
    serviceSchemaDescription:
      "Web design and development for Hamilton businesses — custom responsive websites, eCommerce, WordPress and CMS builds, and performance optimisation, delivered by a senior-led Canadian team.",
    introHeading: "Web design for Hamilton businesses",
    intro: (
      <>
        <p>
          NexFortis designs and builds custom websites for Hamilton businesses &mdash; fast, mobile-first,
          and built to convert visitors into customers. <strong>Web design Hamilton</strong> companies can
          rely on is not a template you outgrow in a year; it is a site engineered to load quickly, look
          credible, and earn trust the moment someone lands on it.
        </p>
        <p>
          Your website is often the first impression a Hamilton customer gets &mdash; and design drives most
          of that judgement.
        </p>
      </>
    ),
    localContextHeading: "Designing for Hamilton's market",
    localContext: (
      <>
        <p>
          Hamilton is one of Ontario&rsquo;s fastest-changing business markets &mdash; a growing, diverse
          economy spanning Downtown, Westdale, Dundas, Ancaster, Stoney Creek, and Waterdown, from
          independent shops on James Street North to professional firms and trades across the Mountain.
          Standing out here means a website that loads fast on mobile, looks credible, and turns local
          interest into enquiries.
        </p>
        <p>
          You are also competing with Toronto and GTA-wide agencies, so an off-the-shelf, slow template does
          not cut it. Winning here takes <strong>Hamilton web design</strong> built for performance and
          conversion &mdash; <strong>website design Hamilton</strong> businesses can actually grow with, as
          part of your wider <InlineLink href={DM_PILLAR_HREF}>digital marketing</InlineLink> and built to
          support your <InlineLink href={getDmSpoke("seo").href}>SEO</InlineLink>.
        </p>
      </>
    ),
    serviceAreas: [
      { name: "Downtown" },
      { name: "Westdale" },
      { name: "Dundas" },
      { name: "Ancaster" },
      { name: "Stoney Creek" },
      { name: "Waterdown" },
      { name: "Hamilton Mountain" },
      { name: "James Street North" },
      { name: "Locke Street" },
      { name: "Concession Street" },
      { name: "Binbrook" },
      { name: "Glanbrook" },
    ],
    stats: [
      {
        value: "75%",
        label: "of users judge a business's credibility on its web design.",
        sourceName: "Stanford Web Credibility Research",
        sourceUrl: "https://www.kinesisinc.com/the-truth-about-web-design/",
      },
      {
        value: "53%",
        label: "of mobile visitors abandon a site that takes over 3 seconds to load.",
        sourceName: 'Google, "The Need for Mobile Speed"',
        sourceUrl: "https://www.marketingdive.com/news/google-53-of-mobile-users-abandon-sites-that-take-over-3-seconds-to-load/426070/",
      },
      {
        value: "<50%",
        label: "of mobile sites pass all three Core Web Vitals — so speed is an edge.",
        sourceName: "2025 Web Almanac, HTTP Archive",
        sourceUrl: "https://almanac.httparchive.org/en/2025/performance",
      },
    ],
    featuresHeading: "What our Hamilton web design includes",
    features: [
      {
        icon: Palette,
        title: "Custom website design",
        description:
          "Designed around your brand and your Hamilton customers — not a recycled template.",
      },
      {
        icon: Smartphone,
        title: "Responsive, mobile-first design",
        description:
          "Built to look and work perfectly on the phones most of your traffic actually uses.",
      },
      {
        icon: Code2,
        title: "Web development",
        description:
          "Clean, fast, maintainable builds — including redesigns and migrations from an ageing site.",
      },
      {
        icon: ShoppingCart,
        title: "eCommerce",
        description:
          "Shopify and WooCommerce stores built to sell, with secure checkout and easy product management.",
      },
      {
        icon: LayoutGrid,
        title: "WordPress and CMS",
        description:
          "Sites your team can update without a developer — on WordPress or a headless CMS.",
      },
      {
        icon: Gauge,
        title: "SEO-ready, performance-optimised",
        description:
          "Core Web Vitals, clean markup, and structure so the site can rank, not just look good.",
      },
    ],
    localProof: [
      {
        label: "First impressions are visual",
        detail:
          "75% of users judge a business's credibility on its web design (Stanford) — a dated or slow site quietly costs you customers before they read a word.",
      },
      {
        label: "Speed is conversion",
        detail:
          "53% of mobile visitors abandon a site that takes more than three seconds to load (Google) — which is why every build we ship is performance-first.",
      },
    ],
    faq: [
      {
        question: "How much does a website cost in Hamilton?",
        answer:
          "It depends on the size, the features, and whether you need eCommerce — which is why we scope every project after a free consultation rather than quoting a one-size-fits-all price. Transparent pricing, no hidden fees.",
      },
      {
        question: "How long does it take to build a website in Hamilton?",
        answer:
          "Most business sites take a few weeks depending on scope and how ready your content is; eCommerce and custom builds take longer. We give you a clear timeline up front. These are general expectations, not guarantees.",
      },
      {
        question: "Do you build on WordPress or Shopify?",
        answer:
          "Both — we build on WordPress, Shopify, WooCommerce, or a headless/custom stack, whatever fits how your Hamilton business needs to run and update the site.",
      },
      {
        question: "Do you build eCommerce websites for Hamilton businesses?",
        answer:
          "Yes — Shopify and WooCommerce stores with secure checkout, product management, and a design built to convert browsers into buyers.",
      },
    ],
    authorNote: (
      <p>
        NexFortis is the web design company Hamilton businesses turn to for senior attention &mdash; your
        site is built by an experienced team, not a junior or an offshore template shop, and as a web design
        agency Hamilton owners can rely on, the same people who design your site build and support it. Your
        project is led personally by Hassan Sadiq, NexFortis Founder and CEO; with 15+ years in enterprise
        technology and as a certified Microsoft Solutions Partner, the technical side &mdash; performance,
        security, Core Web Vitals, and clean code &mdash; is handled with genuine depth. We work
        transparently, month to month with no lock-in.
      </p>
    ),
    ctaHeading: "Ready for a website that works as hard as you do?",
    ctaSubtext:
      "Book a free, no-obligation consultation — we will review your current site, your goals, and exactly what a fast, modern Hamilton website would take.",
  },
  "local-seo/calgary": {
    parentSlug: "local-seo",
    citySlug: "calgary",
    cityName: "Calgary",
    region: "AB",
    serviceType: "Local SEO",
    metaTitle: "Local SEO Calgary",
    metaDescription:
      "Local SEO for Calgary businesses — Google Business Profile, citations, reviews, and Map Pack rankings across Calgary's neighbourhoods. Free local SEO audit.",
    h1: "Local SEO Services in Calgary",
    heroSubtitle:
      "Get found by Calgary customers searching for what you offer — senior-led local SEO that wins the Google Map Pack across the city's neighbourhoods.",
    serviceSchemaName: "Local SEO — Calgary",
    serviceSchemaDescription:
      "Local SEO for Calgary businesses — Google Business Profile optimization, local citations and NAP consistency, localized content, review generation, local link building, and Google Map Pack strategy, delivered by a senior-led Canadian team.",
    introHeading: "Local SEO for Calgary businesses",
    intro: (
      <>
        <p>
          NexFortis helps Calgary businesses get found by the customers searching for their services right
          now &mdash; in the Google Map Pack (the top three local listings Google shows with a map), the
          local results, and the &ldquo;near me&rdquo; searches that turn into real calls and visits.
        </p>
        <p>
          <strong>Local SEO Calgary</strong> is how a Calgary plumber, dental clinic, or law firm shows up
          the moment someone nearby searches, and in a city this large and competitive it is the most
          cost-effective way to capture demand you are otherwise losing to the business down the street.
        </p>
      </>
    ),
    localContextHeading: "Calgary's local search landscape",
    localContext: (
      <>
        <p>
          Calgary is Alberta&rsquo;s largest city and one of Canada&rsquo;s biggest business markets &mdash;
          a sprawling, quadrant-divided metro where a customer in the Beltline, a contractor in the NW, and a
          clinic in McKenzie Towne each search and convert differently. Google&rsquo;s proximity signals mean
          your visibility shifts neighbourhood by neighbourhood, so ranking in Calgary is really about
          ranking in the specific areas you serve, from Kensington and Inglewood to Bowness.
        </p>
        <p>
          People here search with location qualifiers &mdash; &ldquo;plumber Kensington,&rdquo; &ldquo;dentist
          Mission,&rdquo; &ldquo;accountant Bridgeland&rdquo; &mdash; and a generic, national{" "}
          <InlineLink href={DM_PILLAR_HREF}>digital marketing</InlineLink> approach that ignores
          Calgary&rsquo;s districts and quadrants simply does not rank. Winning here takes the local SEO
          services Calgary businesses rely on &mdash; <strong>Calgary local SEO</strong> built around the
          specific neighbourhoods and quadrants you serve, not a one-size-fits-all package.
        </p>
        <p>
          Calgary is also a genuinely competitive local market: in home services, energy services, legal,
          dental, and the trades, you are up against established local competitors and agencies investing
          heavily in their Google Business Profiles, citations, and reviews.
        </p>
      </>
    ),
    serviceAreas: [
      { name: "Downtown" },
      { name: "Beltline" },
      { name: "Kensington" },
      { name: "Inglewood" },
      { name: "Bridgeland" },
      { name: "Mission" },
      { name: "Marda Loop" },
      { name: "Bowness" },
      { name: "McKenzie Towne" },
      { name: "NW Calgary" },
      { name: "NE Calgary" },
      { name: "SW Calgary" },
      { name: "SE Calgary" },
    ],
    stats: [
      {
        value: "≈46%",
        label: "of all Google searches have local intent.",
        sourceName: "BrightLocal",
        sourceUrl: "https://www.brightlocal.com/resources/local-seo-statistics/",
      },
      {
        value: "76%",
        label: "of people who search for something nearby visit a related business within a day.",
        sourceName: "Backlinko",
        sourceUrl: "https://backlinko.com/local-seo-guide",
      },
      {
        value: "71%",
        label: "of consumers use Google to read local business reviews.",
        sourceName: "BrightLocal Local Consumer Review Survey (2026)",
        sourceUrl: "https://www.brightlocal.com/research/local-consumer-review-survey/",
      },
    ],
    features: [
      {
        icon: MapPin,
        title: "Google Business Profile optimisation",
        description:
          "Complete setup, verification, category selection, accurate NAP, posts, and photos, with service-area configuration tuned to the Calgary neighbourhoods and quadrants you serve.",
      },
      {
        icon: FileText,
        title: "Local citations and NAP consistency",
        description:
          "Listings across Yelp Canada, Yellow Pages Canada, and Calgary-specific and industry directories, plus an audit and clean-up of the inconsistent NAP data that quietly suppresses local rankings.",
      },
      {
        icon: PenTool,
        title: "Localised content",
        description:
          "Pages and on-page content built around Calgary neighbourhoods, quadrants, landmarks, and real local search intent — not generic national topics.",
      },
      {
        icon: Star,
        title: "Review generation and reputation management",
        description:
          "A systematic process for earning authentic Google reviews from your Calgary customers, plus a response strategy that signals trust to both Google and prospects.",
      },
      {
        icon: Link2,
        title: "Local link building",
        description:
          "Outreach to Calgary websites, business associations, local media, and community organisations for relevant, authoritative local links — relevance over volume.",
      },
      {
        icon: Map,
        title: "Map Pack ranking strategy",
        description:
          "Targeting the top three local results by optimising the three signals Google weighs: relevance, proximity, and prominence.",
      },
    ],
    localProof: [
      {
        label: "The demand is already local",
        detail:
          "Roughly 46% of Google searches carry local intent (BrightLocal), and the businesses that win the Map Pack capture the bulk of those high-intent clicks before anyone scrolls to the organic results.",
      },
      {
        label: "Reviews decide the click",
        detail:
          "71% of consumers use Google to read local business reviews (BrightLocal) — which is why review generation is built into every Calgary local SEO campaign, not bolted on.",
      },
    ],
    faq: [
      {
        question: "How long does local SEO take in Calgary?",
        answer:
          "Most Calgary businesses begin seeing measurable movement in local rankings within a few months; competitive categories and dense districts take longer. Google Business Profile work often delivers the earliest wins. These are general expectations, not guarantees.",
      },
      {
        question: "What does local SEO cost in Calgary?",
        answer:
          "It depends on your competition, the number of neighbourhoods and quadrants you target, and the scope of work — which is why we scope every engagement after a free audit rather than quoting a one-size-fits-all price. Transparent pricing, no hidden fees, no lock-in.",
      },
      {
        question: "What is the Map Pack and why does it matter?",
        answer:
          "The Map Pack is the block of three local business listings Google shows at the top of local searches, alongside a map. It captures the majority of clicks for near-me and location-based queries, so ranking there is the primary goal of a local SEO campaign.",
      },
      {
        question: "Which Calgary industries benefit most from local SEO?",
        answer:
          "Any Calgary business that relies on local customers finding it through Google — home services and trades, legal, dental and medical, real estate, professional and energy services, and retail among them.",
      },
      {
        question: "Is local SEO worth it for Calgary businesses?",
        answer:
          "For most local and Alberta-serving businesses, yes — local search is the most cost-effective long-term channel, because the visibility compounds and keeps working after the spend stops, unlike paid ads.",
      },
    ],
    authorNote: (
      <p>
        Your campaign is led personally by Hassan Sadiq, NexFortis Founder and CEO, with a small senior team.
        With 15+ years in enterprise technology and as a certified Microsoft Solutions Partner, the technical
        side of local SEO &mdash; Google Business Profile, citations, and local schema &mdash; is handled with
        genuine depth. As a local SEO company Calgary businesses can rely on &mdash; and a local SEO agency
        Calgary owners can trust for the long haul &mdash; the same small senior team stays on your account
        end to end, in Canada, month to month with no lock-in.
      </p>
    ),
    ctaHeading: "Ready to win local search in Calgary?",
    ctaSubtext:
      "Book a free, no-obligation local SEO audit — an honest look at your Google Business Profile, citations, reviews, and Map Pack position, and exactly where the gaps are.",
  },
  "web-design/london-ontario": {
    parentSlug: "web-design",
    citySlug: "london-ontario",
    cityName: "London",
    region: "ON",
    serviceType: "Web Design",
    metaTitle: "Web Design London Ontario",
    metaDescription:
      "Web design for London, Ontario businesses — custom, responsive, fast websites on WordPress or Shopify, including eCommerce. Free consultation.",
    h1: "Web Design Services in London, Ontario",
    heroSubtitle:
      "Custom, fast, mobile-first websites for London, Ontario businesses — designed to build trust and turn visitors into customers.",
    serviceSchemaName: "Web Design — London, Ontario",
    serviceSchemaDescription:
      "Web design and development for London, Ontario businesses — custom responsive websites, eCommerce, WordPress and CMS builds, and performance optimisation, delivered by a senior-led Canadian team.",
    introHeading: "Web design for London, Ontario businesses",
    intro: (
      <>
        <p>
          NexFortis designs and builds custom websites for London, Ontario businesses &mdash; fast,
          mobile-first, and built to convert visitors into customers. <strong>Web design London Ontario</strong>{" "}
          companies can rely on is not a template you outgrow in a year; it is a site engineered to load
          quickly, look credible, and earn trust the moment someone lands on it.
        </p>
        <p>
          Your website is often the first impression a London customer gets &mdash; and design drives most of
          that judgement.
        </p>
      </>
    ),
    localContextHeading: "Designing for London, Ontario's market",
    localContext: (
      <>
        <p>
          London, Ontario is one of the province&rsquo;s largest and fastest-growing cities &mdash; a diverse
          economy spanning Downtown, Old North, Wortley Village, Masonville, Byron, and Hyde Park, with a
          strong base in healthcare, education, and a growing tech sector. Standing out here means a website
          that loads fast on mobile, looks credible, and turns local interest into enquiries.
        </p>
        <p>
          You are also competing with Toronto and national agencies, so an off-the-shelf, slow template does
          not cut it. Winning here takes <strong>London Ontario web design</strong> built for performance and
          conversion &mdash; <strong>website design London Ontario</strong> businesses can actually grow with,
          as part of your wider <InlineLink href={DM_PILLAR_HREF}>digital marketing</InlineLink> and built to
          support your <InlineLink href={getDmSpoke("seo").href}>SEO</InlineLink>.
        </p>
      </>
    ),
    serviceAreas: [
      { name: "Downtown" },
      { name: "Old North" },
      { name: "Wortley Village (Old South)" },
      { name: "Masonville" },
      { name: "Byron" },
      { name: "Hyde Park" },
      { name: "White Oaks" },
      { name: "Westmount" },
      { name: "Oakridge" },
      { name: "Lambeth" },
      { name: "Sunningdale" },
      { name: "Pond Mills" },
    ],
    stats: [
      {
        value: "75%",
        label: "of users judge a business's credibility on its web design.",
        sourceName: "Stanford Web Credibility Research",
        sourceUrl: "https://www.kinesisinc.com/the-truth-about-web-design/",
      },
      {
        value: "53%",
        label: "of mobile visitors abandon a site that takes over 3 seconds to load.",
        sourceName: 'Google, "The Need for Mobile Speed"',
        sourceUrl: "https://www.marketingdive.com/news/google-53-of-mobile-users-abandon-sites-that-take-over-3-seconds-to-load/426070/",
      },
      {
        value: "<50%",
        label: "of mobile sites pass all three Core Web Vitals — so speed is an edge.",
        sourceName: "2025 Web Almanac, HTTP Archive",
        sourceUrl: "https://almanac.httparchive.org/en/2025/performance",
      },
    ],
    featuresHeading: "What our London, Ontario web design includes",
    features: [
      {
        icon: Palette,
        title: "Custom website design",
        description:
          "Designed around your brand and your London customers — not a recycled template.",
      },
      {
        icon: Smartphone,
        title: "Responsive, mobile-first design",
        description:
          "Built to look and work perfectly on the phones most of your traffic actually uses.",
      },
      {
        icon: Code2,
        title: "Web development",
        description:
          "Clean, fast, maintainable builds — including redesigns and migrations from an ageing site.",
      },
      {
        icon: ShoppingCart,
        title: "eCommerce",
        description:
          "Shopify and WooCommerce stores built to sell, with secure checkout and easy product management.",
      },
      {
        icon: LayoutGrid,
        title: "WordPress and CMS",
        description:
          "Sites your team can update without a developer — on WordPress or a headless CMS.",
      },
      {
        icon: Gauge,
        title: "SEO-ready, performance-optimised",
        description:
          "Core Web Vitals, clean markup, and structure so the site can rank, not just look good.",
      },
    ],
    localProof: [
      {
        label: "First impressions are visual",
        detail:
          "75% of users judge a business's credibility on its web design (Stanford) — a dated or slow site quietly costs you customers before they read a word.",
      },
      {
        label: "Speed is conversion",
        detail:
          "53% of mobile visitors abandon a site that takes more than three seconds to load (Google) — which is why every build we ship is performance-first.",
      },
    ],
    faq: [
      {
        question: "How much does web design cost in London, Ontario?",
        answer:
          "It depends on the size, the features, and whether you need eCommerce — which is why we scope every project after a free consultation rather than quoting a one-size-fits-all price. Transparent pricing, no hidden fees.",
      },
      {
        question: "How long does a web design project take in London, Ontario?",
        answer:
          "Most business sites take a few weeks depending on scope and how ready your content is; eCommerce and custom builds take longer. We give you a clear timeline up front. These are general expectations, not guarantees.",
      },
      {
        question: "Should my London, Ontario business use WordPress or Shopify?",
        answer:
          "It depends on what you sell and how you work — we build on WordPress, Shopify, WooCommerce, or a headless/custom stack, and recommend the right fit after understanding your goals.",
      },
      {
        question: "Do you build eCommerce websites for London, Ontario businesses?",
        answer:
          "Yes — Shopify and WooCommerce stores with secure checkout, product management, and a design built to convert browsers into buyers.",
      },
    ],
    authorNote: (
      <p>
        NexFortis is the web design company London Ontario businesses turn to for senior attention &mdash;
        your site is built by an experienced team, not a junior or an offshore template shop, and as a web
        design agency London Ontario owners can rely on, the same people who design your site build and
        support it. Your project is led personally by Hassan Sadiq, NexFortis Founder and CEO; with 15+ years
        in enterprise technology and as a certified Microsoft Solutions Partner, the technical side &mdash;
        performance, security, Core Web Vitals, and clean code &mdash; is handled with genuine depth, and your
        account stays with the same senior team in Canada, month to month with no lock-in.
      </p>
    ),
    ctaHeading: "Ready for a website that works as hard as you do?",
    ctaSubtext:
      "Book a free, no-obligation consultation — we will review your current site, your goals, and exactly what a fast, modern London, Ontario website would take.",
  },
  "seo/brampton": {
    parentSlug: "seo",
    citySlug: "brampton",
    cityName: "Brampton",
    region: "ON",
    serviceType: "SEO",
    metaTitle: "SEO Company Brampton",
    metaDescription:
      "SEO services for Brampton businesses — technical SEO, on-page, content, and link building to grow your organic rankings across the GTA. Free SEO audit.",
    h1: "SEO Services in Brampton",
    heroSubtitle:
      "Help Brampton customers find your business in Google's organic results — senior-led SEO that builds durable rankings, not quick tricks.",
    serviceSchemaName: "SEO — Brampton",
    serviceSchemaDescription:
      "SEO services for Brampton businesses — technical SEO, on-page optimization, content, link building, and analytics to grow organic search visibility, delivered by a senior-led Canadian team.",
    introHeading: "SEO services for Brampton businesses",
    intro: (
      <>
        <p>
          NexFortis helps Brampton businesses earn the organic Google rankings that bring in steady,
          qualified traffic &mdash; the searches happening across the GTA right now for what you sell. As an{" "}
          <strong>SEO company Brampton</strong> businesses can rely on, we treat SEO as the compounding work
          of making your site technically sound, genuinely useful, and trusted, so you climb past competitors
          and stay there.
        </p>
        <p>
          <strong>SEO Brampton</strong> businesses invest in is the most durable channel they have: unlike
          paid ads, the visibility keeps working after the budget stops.
        </p>
      </>
    ),
    localContextHeading: "Competing for organic visibility in Brampton",
    localContext: (
      <>
        <p>
          Brampton is one of Canada&rsquo;s fastest-growing cities &mdash; a young, diverse market spanning
          Downtown Brampton, Bramalea, Heart Lake, Springdale, Mount Pleasant, Castlemore, and Fletcher&rsquo;s
          Meadow, with a fast-expanding base of trades, logistics, healthcare, and professional services.
          Ranking organically here means earning relevance and authority for the terms your Brampton customers
          actually use.
        </p>
        <p>
          You are also up against Toronto and GTA-wide agencies chasing the same organic real estate, so a
          generic, templated approach does not cut through. Winning here takes the SEO services Brampton
          businesses rely on &mdash; <strong>Brampton SEO</strong> built on technical excellence, local
          relevance, and content that answers real buyer questions, as part of your wider{" "}
          <InlineLink href={DM_PILLAR_HREF}>digital marketing</InlineLink> and complemented by dedicated{" "}
          <InlineLink href={getDmSpoke("local-seo").href}>local SEO</InlineLink> when the Map Pack matters.
        </p>
      </>
    ),
    serviceAreas: [
      { name: "Downtown Brampton" },
      { name: "Bramalea" },
      { name: "Heart Lake" },
      { name: "Springdale" },
      { name: "Mount Pleasant" },
      { name: "Castlemore" },
      { name: "Sandalwood" },
      { name: "Fletcher's Meadow" },
      { name: "Gore Meadows" },
      { name: "Churchville" },
      { name: "Snelgrove" },
      { name: "Credit Valley" },
    ],
    stats: [
      {
        value: "≈86%",
        label: "of all searches in Canada run on Google.",
        sourceName: "Statcounter Global Stats (Canada)",
        sourceUrl: "https://gs.statcounter.com/search-engine-market-share/all/canada",
      },
      {
        value: "≈40%",
        label: "of clicks go to the #1 organic result.",
        sourceName: "FirstPageSage, 2026 Google CTR study",
        sourceUrl: "https://firstpagesage.com/reports/google-click-through-rates-ctrs-by-ranking-position/",
      },
      {
        value: "48%",
        label: "of mobile sites pass all three Core Web Vitals — so speed is still an edge.",
        sourceName: "2025 Web Almanac, HTTP Archive",
        sourceUrl: "https://almanac.httparchive.org/en/2025/performance",
      },
    ],
    features: [
      {
        icon: Code2,
        title: "Technical SEO",
        description:
          "Site speed, crawlability, indexation, structured data, and Core Web Vitals — so Google can find, understand, and trust your Brampton site.",
      },
      {
        icon: FileText,
        title: "On-page optimisation",
        description:
          "Titles, headings, content, and internal links tuned to the keywords your Brampton customers actually search.",
      },
      {
        icon: PenTool,
        title: "Content",
        description:
          "Pages and articles built around real buyer intent and local relevance — not keyword stuffing.",
      },
      {
        icon: Link2,
        title: "Link building",
        description:
          "Earning relevant, authoritative links that build the domain authority organic rankings depend on.",
      },
      {
        icon: MapPin,
        title: "Local SEO",
        description:
          "Google Business Profile and local signals as one component of a full SEO program — for a dedicated local and Map-Pack focus, see our local SEO page.",
      },
      {
        icon: BarChart3,
        title: "Analytics and reporting",
        description:
          "Transparent tracking of rankings, traffic, and the leads that actually matter, so you can see the ROI.",
      },
    ],
    localProof: [
      {
        label: "Organic is where the demand is",
        detail:
          "Google handles roughly 86% of all searches in Canada (Statcounter), and the #1 organic result earns about 40% of the clicks (FirstPageSage) — durable rankings, not ads alone, compound into real growth.",
      },
      {
        label: "Most sites leave technical wins on the table",
        detail:
          "Only 48% of mobile sites pass all three Core Web Vitals (Web Almanac) — the technical fixes that move rankings are exactly where a senior-led audit starts.",
      },
    ],
    faq: [
      {
        question: "How much does an SEO company in Brampton cost?",
        answer:
          "It depends on your competition, your starting point, and the scope of work — which is why we scope every engagement after a free audit rather than quoting a one-size-fits-all price. Transparent pricing, no hidden fees, no lock-in.",
      },
      {
        question: "How long does SEO take for a Brampton business?",
        answer:
          "Most businesses begin seeing measurable movement within a few months, with competitive terms taking longer. SEO compounds, so the gains build over time. These are general expectations, not guarantees.",
      },
      {
        question: "Is SEO worth it for a Brampton business?",
        answer:
          "For most Brampton and GTA-serving businesses, yes — organic search is the most cost-effective long-term channel, because the visibility keeps working after the spend stops, unlike paid ads.",
      },
      {
        question: "Which industries does NexFortis serve in Brampton?",
        answer:
          "Any Brampton business that relies on being found in Google — trades and home services, logistics, healthcare, professional services, real estate, and retail among them.",
      },
    ],
    authorNote: (
      <p>
        NexFortis is the SEO company Brampton businesses turn to for senior attention &mdash; your campaign is
        led personally by Hassan Sadiq, NexFortis Founder and CEO, with a small senior team, and as an SEO
        agency Brampton owners can rely on, the same people stay on your account end to end. With 15+ years in
        enterprise technology and as a certified Microsoft Solutions Partner, the technical side of SEO &mdash;
        site architecture, Core Web Vitals, and schema &mdash; is handled with genuine depth, in Canada, month
        to month with no lock-in.
      </p>
    ),
    ctaHeading: "Ready to grow your organic search in Brampton?",
    ctaSubtext:
      "Book a free, no-obligation SEO audit — an honest look at your technical health, on-page gaps, backlink profile, and the keyword opportunities specific to your Brampton business.",
  },
  "seo/calgary": {
    parentSlug: "seo",
    citySlug: "calgary",
    cityName: "Calgary",
    region: "AB",
    serviceType: "SEO",
    metaTitle: "SEO Services Calgary",
    metaDescription:
      "SEO services for Calgary businesses — technical SEO, on-page, content, and link building to grow your organic rankings across Alberta. Free SEO audit.",
    h1: "SEO Services in Calgary",
    heroSubtitle:
      "Help Calgary customers find your business in Google's organic results — senior-led SEO that builds durable rankings, not quick tricks.",
    serviceSchemaName: "SEO — Calgary",
    serviceSchemaDescription:
      "SEO services for Calgary businesses — technical SEO, on-page optimization, content, link building, and analytics to grow organic search visibility, delivered by a senior-led Canadian team.",
    introHeading: "SEO services for Calgary businesses",
    intro: (
      <>
        <p>
          NexFortis helps Calgary businesses earn the organic Google rankings that bring in steady,
          qualified traffic &mdash; the searches happening across Alberta right now for what you sell. The{" "}
          <strong>SEO services Calgary</strong> companies can rely on are not a one-time fix; they are the
          compounding work of making your site technically sound, genuinely useful, and trusted, so you climb
          past competitors and stay there.
        </p>
        <p>
          <strong>SEO Calgary</strong> businesses invest in is the most durable channel they have: unlike
          paid ads, the visibility keeps working after the budget stops.
        </p>
      </>
    ),
    localContextHeading: "Competing for organic visibility in Calgary",
    localContext: (
      <>
        <p>
          Calgary is Alberta&rsquo;s largest city and one of Canada&rsquo;s most competitive business markets
          &mdash; a sprawling, quadrant-divided metro spanning Downtown, the Beltline, Kensington, Inglewood,
          and Bridgeland, out to the NW, NE, SW, and SE communities. Ranking organically here means earning
          relevance and authority for the terms your Calgary customers actually use, across a market where
          established agencies and in-house teams compete hard for the same first page.
        </p>
        <p>
          You are also up against national agencies chasing the same organic real estate, so a generic,
          templated approach does not cut through. Winning here takes <strong>Calgary SEO</strong> built on
          technical excellence, local relevance, and content that answers real buyer questions &mdash; part of
          your wider <InlineLink href={DM_PILLAR_HREF}>digital marketing</InlineLink> and complemented by
          dedicated <InlineLink href={getDmSpoke("local-seo").href}>local SEO</InlineLink> when the Map Pack
          matters.
        </p>
        <p>
          In sectors from energy services and professional firms to home services and trades, the businesses
          that own organic search capture demand their competitors are paying for. Standing still means losing
          ground.
        </p>
      </>
    ),
    serviceAreas: [
      { name: "Downtown" },
      { name: "Beltline" },
      { name: "Kensington" },
      { name: "Inglewood" },
      { name: "Bridgeland" },
      { name: "Mission" },
      { name: "Marda Loop" },
      { name: "Bowness" },
      { name: "McKenzie Towne" },
      { name: "NW Calgary" },
      { name: "NE Calgary" },
      { name: "SW Calgary" },
      { name: "SE Calgary" },
    ],
    stats: [
      {
        value: "≈86%",
        label: "of all searches in Canada run on Google.",
        sourceName: "Statcounter Global Stats (Canada)",
        sourceUrl: "https://gs.statcounter.com/search-engine-market-share/all/canada",
      },
      {
        value: "≈40%",
        label: "of clicks go to the #1 organic result.",
        sourceName: "FirstPageSage, 2026 Google CTR study",
        sourceUrl: "https://firstpagesage.com/reports/google-click-through-rates-ctrs-by-ranking-position/",
      },
      {
        value: "48%",
        label: "of mobile sites pass all three Core Web Vitals — so speed is still an edge.",
        sourceName: "2025 Web Almanac, HTTP Archive",
        sourceUrl: "https://almanac.httparchive.org/en/2025/performance",
      },
    ],
    features: [
      {
        icon: Code2,
        title: "Technical SEO",
        description:
          "Site speed, crawlability, indexation, structured data, and Core Web Vitals — so Google can find, understand, and trust your Calgary site.",
      },
      {
        icon: FileText,
        title: "On-page optimisation",
        description:
          "Titles, headings, content, and internal links tuned to the keywords your Calgary customers actually search.",
      },
      {
        icon: PenTool,
        title: "Content",
        description:
          "Pages and articles built around real buyer intent and local relevance — not keyword stuffing.",
      },
      {
        icon: Link2,
        title: "Link building",
        description:
          "Earning relevant, authoritative links that build the domain authority organic rankings depend on.",
      },
      {
        icon: MapPin,
        title: "Local SEO",
        description:
          "Google Business Profile and local signals as one component of a full SEO program — for a dedicated local and Map-Pack focus, see our local SEO page.",
      },
      {
        icon: BarChart3,
        title: "Analytics and reporting",
        description:
          "Transparent tracking of rankings, traffic, and the leads that actually matter, so you can see the ROI.",
      },
    ],
    localProof: [
      {
        label: "Organic is where the demand is",
        detail:
          "Google handles roughly 86% of all searches in Canada (Statcounter), and the #1 organic result earns about 40% of the clicks (FirstPageSage) — durable rankings, not ads alone, compound into real growth.",
      },
      {
        label: "Most sites leave technical wins on the table",
        detail:
          "Only 48% of mobile sites pass all three Core Web Vitals (Web Almanac) — the technical fixes that move rankings are exactly where a senior-led audit starts.",
      },
    ],
    faq: [
      {
        question: "How much do SEO services cost in Calgary?",
        answer:
          "It depends on your competition, your starting point, and the scope of work — which is why we scope every engagement after a free audit rather than quoting a one-size-fits-all price. Transparent pricing, no hidden fees, no lock-in.",
      },
      {
        question: "How long does SEO take to show results in Calgary?",
        answer:
          "Most businesses begin seeing measurable movement within a few months, with competitive terms taking longer. SEO compounds, so the gains build over time. These are general expectations, not guarantees.",
      },
      {
        question: "Is SEO worth it for a Calgary business?",
        answer:
          "For most Calgary and Alberta-serving businesses, yes — organic search is the most cost-effective long-term channel, because the visibility keeps working after the spend stops, unlike paid ads.",
      },
      {
        question: "What industries does NexFortis serve with Calgary SEO?",
        answer:
          "Any Calgary business that relies on being found in Google — energy and professional services, home services and trades, healthcare, real estate, B2B, and retail among them.",
      },
    ],
    authorNote: (
      <p>
        Your campaign is led personally by Hassan Sadiq, NexFortis Founder and CEO, with a small senior team.
        With 15+ years in enterprise technology and as a certified Microsoft Solutions Partner, the technical
        side of SEO &mdash; site architecture, Core Web Vitals, and schema &mdash; is handled with genuine
        depth. As the SEO company Calgary businesses turn to for senior attention &mdash; and an SEO agency
        Calgary owners can rely on &mdash; your account stays with the same senior team in Canada, month to
        month with no lock-in.
      </p>
    ),
    ctaHeading: "Ready to grow your organic search in Calgary?",
    ctaSubtext:
      "Book a free, no-obligation SEO audit — an honest look at your technical health, on-page gaps, backlink profile, and the keyword opportunities specific to your Calgary business.",
  },
};
