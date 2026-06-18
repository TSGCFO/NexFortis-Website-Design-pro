// Typed internal-link graph for the digital-marketing hub-and-spoke cluster.
// Single source of truth for spoke routes, card metadata, and the canonical
// in-prose anchor text for each spoke. Centralizing anchors here is what keeps
// the site within INV-015 (an anchor's text must never point at two URLs) and
// INV-017 (no generic anchors): every cross-link uses `linkText`/`title`, which
// are unique per href and never collide with the global nav/footer anchors.
//
// `published` gates whether a spoke is linked anywhere yet. The pillar grid and
// RelatedServices only ever surface published spokes, so the cluster never
// emits a link to a route that has not been built and prerendered.
import {
  Search,
  MapPin,
  Gauge,
  Building2,
  PenTool,
  Link2,
  Sparkles,
  Megaphone,
  Share2,
  LayoutTemplate,
  Mail,
  MousePointerClick,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export const DM_PILLAR_HREF = "/services/digital-marketing";
export const DM_PILLAR_LINK_TEXT = "digital marketing services";

export type DmSpokeSlug =
  | "seo"
  | "technical-seo"
  | "local-seo"
  | "google-business-profile"
  | "content-marketing"
  | "link-building"
  | "generative-engine-optimization"
  | "google-ads"
  | "social-media-marketing"
  | "web-design"
  | "email-marketing"
  | "conversion-rate-optimization"
  | "analytics-reporting";

export type DmSpoke = {
  slug: DmSpokeSlug;
  href: string;
  /** Card title and RelatedServices link text. Unique per href. */
  title: string;
  /** Canonical in-prose anchor text for InlineLink. Unique per href. */
  linkText: string;
  /** One-sentence card blurb. */
  blurb: string;
  icon: LucideIcon;
  /** Competitor-playbook category this spoke consolidates. */
  category: string;
  /** Only published spokes are linked from the pillar grid / RelatedServices. */
  published: boolean;
};

export const DM_SPOKES: readonly DmSpoke[] = [
  {
    slug: "seo",
    href: `${DM_PILLAR_HREF}/seo`,
    title: "SEO Services",
    linkText: "SEO services",
    blurb:
      "Keyword strategy, on-page optimization, and content built to earn rankings that send qualified buyers to your site.",
    icon: Search,
    category: "On-Page & Discovery",
    published: true,
  },
  {
    slug: "local-seo",
    href: `${DM_PILLAR_HREF}/local-seo`,
    title: "Local SEO",
    linkText: "local SEO",
    blurb:
      "Rank in the Google Map Pack and 'near me' searches across the GTA so nearby customers find you first.",
    icon: MapPin,
    category: "Local SEO",
    published: true,
  },
  {
    slug: "generative-engine-optimization",
    href: `${DM_PILLAR_HREF}/generative-engine-optimization`,
    title: "GEO & AI Search",
    linkText: "Generative Engine Optimization",
    blurb:
      "Get cited by ChatGPT, Google AI Overviews, Perplexity, and Gemini — where a growing share of buyers now start.",
    icon: Sparkles,
    category: "GEO / AI Search",
    published: true,
  },
  {
    slug: "technical-seo",
    href: `${DM_PILLAR_HREF}/technical-seo`,
    title: "Technical SEO",
    linkText: "technical SEO",
    blurb:
      "Core Web Vitals, crawlability, structured data, and rendering fixes that let Google index and rank every page.",
    icon: Gauge,
    category: "Technical SEO",
    published: true,
  },
  {
    slug: "google-business-profile",
    href: `${DM_PILLAR_HREF}/google-business-profile`,
    title: "Google Business Profile",
    linkText: "Google Business Profile management",
    blurb:
      "Claim, optimize, and actively manage your Google Business Profile to win the local pack and earn more calls.",
    icon: Building2,
    category: "Google Business Profile",
    published: false,
  },
  {
    slug: "content-marketing",
    href: `${DM_PILLAR_HREF}/content-marketing`,
    title: "Content Marketing",
    linkText: "content marketing",
    blurb:
      "Research-led articles, pillar pages, and topic clusters that build authority and capture demand at every stage.",
    icon: PenTool,
    category: "Content Production",
    published: false,
  },
  {
    slug: "link-building",
    href: `${DM_PILLAR_HREF}/link-building`,
    title: "Link Building & Digital PR",
    linkText: "link building",
    blurb:
      "Earn editorial backlinks from real publications to grow the authority that decides how high you can rank.",
    icon: Link2,
    category: "Link Building / Off-Page",
    published: false,
  },
  {
    slug: "google-ads",
    href: `${DM_PILLAR_HREF}/google-ads`,
    title: "Google Ads Management",
    linkText: "Google Ads management",
    blurb:
      "Profitable search, display, and remarketing campaigns with transparent reporting on every dollar of ad spend.",
    icon: Megaphone,
    category: "Paid Search",
    published: false,
  },
  {
    slug: "social-media-marketing",
    href: `${DM_PILLAR_HREF}/social-media-marketing`,
    title: "Social Media Marketing",
    linkText: "social media marketing",
    blurb:
      "Organic social and Meta Ads that build brand surface area and feed your funnel on the platforms your buyers use.",
    icon: Share2,
    category: "Social / Paid Social",
    published: false,
  },
  {
    slug: "web-design",
    href: `${DM_PILLAR_HREF}/web-design`,
    title: "Web Design & Development",
    linkText: "web design and development",
    blurb:
      "Fast, mobile-first, conversion-focused websites built on modern frameworks and engineered to rank from day one.",
    icon: LayoutTemplate,
    category: "Web Design / Dev",
    published: false,
  },
  {
    slug: "email-marketing",
    href: `${DM_PILLAR_HREF}/email-marketing`,
    title: "Email Marketing",
    linkText: "email marketing",
    blurb:
      "Newsletters, nurture sequences, and automations that turn your list into repeat revenue you actually own.",
    icon: Mail,
    category: "Email / Lifecycle",
    published: false,
  },
  {
    slug: "conversion-rate-optimization",
    href: `${DM_PILLAR_HREF}/conversion-rate-optimization`,
    title: "Conversion Rate Optimization",
    linkText: "conversion rate optimization",
    blurb:
      "Turn more of the traffic you already have into leads with behaviour analysis, testing, and landing-page fixes.",
    icon: MousePointerClick,
    category: "CRO",
    published: false,
  },
  {
    slug: "analytics-reporting",
    href: `${DM_PILLAR_HREF}/analytics-reporting`,
    title: "Analytics & Reporting",
    linkText: "analytics and reporting",
    blurb:
      "GA4, Search Console, and call tracking wired into clear monthly reports that tie marketing to real revenue.",
    icon: BarChart3,
    category: "Analytics / Reporting",
    published: false,
  },
];

// The 4 sibling NexFortis service pillars already live in the nav/footer.
// Spoke pages cross-link back to these so the marketing cluster stays connected
// to the wider IT-services site.
export const SIBLING_SERVICES: readonly { href: string; title: string }[] = [
  { href: "/services/microsoft-365", title: "Microsoft 365 Solutions" },
  { href: "/services/quickbooks", title: "QuickBooks Migration" },
  { href: "/services/it-consulting", title: "IT Consulting" },
  { href: "/services/workflow-automation", title: "Workflow Automation" },
];

const SPOKE_BY_SLUG: Record<DmSpokeSlug, DmSpoke> = Object.fromEntries(
  DM_SPOKES.map((s) => [s.slug, s]),
) as Record<DmSpokeSlug, DmSpoke>;

export function getDmSpoke(slug: DmSpokeSlug): DmSpoke {
  const spoke = SPOKE_BY_SLUG[slug];
  if (!spoke) throw new Error(`Unknown digital-marketing spoke: ${slug}`);
  return spoke;
}

/** Published spokes only — safe to link from the pillar grid. */
export function getPublishedSpokes(): readonly DmSpoke[] {
  return DM_SPOKES.filter((s) => s.published);
}

/**
 * Up to `n` published sibling spokes (excluding `slug`), for the RelatedServices
 * block at the foot of each spoke page. Guarantees the internal-link minimum.
 */
export function getRelatedSpokes(slug: DmSpokeSlug, n = 3): readonly DmSpoke[] {
  return DM_SPOKES.filter((s) => s.published && s.slug !== slug).slice(0, n);
}
