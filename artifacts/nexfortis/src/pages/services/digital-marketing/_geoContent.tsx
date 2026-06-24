// Typed content for geo [service]+[city] pages — parallel to _dmContent.tsx.
// Each entry is GENUINELY local (real neighbourhoods, districts, market context, local
// proof) — never a templated city-name swap — which is what defeats Google's doorway-page
// penalty and the cross-page paragraph-dedup gate. The "what is <service>" definition is
// inherited from the national spoke and must NOT be re-authored here.
//
// Authored per page via the run book (Step 5), keyed "<parentSlug>/<citySlug>".
import type { ReactNode } from "react";
import { MapPin, FileText, PenTool, Star, Link2, Map } from "lucide-react";
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
};
