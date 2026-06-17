import { useState } from "react";
import {
  SEO,
  ServiceSchema,
  BreadcrumbSchema,
  FAQSchema,
  PersonSchema,
} from "@/components/seo";
import {
  Section,
  SectionHeader,
  PageHero,
  PageBreadcrumbs,
  FAQItem,
} from "@/components/ui-elements";
import { StatBand } from "@/components/content/StatBand";
import { StepsTimeline } from "@/components/content/StepsTimeline";
import { FeatureComparison } from "@/components/content/FeatureComparison";
import { RelatedServices } from "@/components/content/RelatedServices";
import { FeatureGrid } from "@/components/content/FeatureGrid";
import { CTAStrip } from "@/components/content/CTAStrip";
import { AuthorBio } from "@/components/content/AuthorBio";
import { InlineLink } from "@/components/content/InlineLink";
import {
  getPublishedSpokes,
  getDmSpoke,
  DM_SPOKES,
  DM_PILLAR_HREF,
} from "@/lib/internal-links";
import { DM_AUTHOR } from "./digital-marketing/_dmContent";
import type { SourcedStat } from "@/components/content/types";

const seo = getDmSpoke("seo");
const localSeo = getDmSpoke("local-seo");
const geo = getDmSpoke("generative-engine-optimization");

// The remaining (not-yet-published) capabilities, rendered as descriptive
// (non-linked) cards so the hub shows its full breadth without linking an
// unbuilt spoke or repeating the published cards shown above.
const FULL_MENU = DM_SPOKES.filter((s) => !s.published).map((s) => ({
  icon: s.icon,
  title: s.title,
  description: s.blurb,
}));

const STATS: readonly SourcedStat[] = [
  {
    value: "≈90%",
    label: "of global search runs on Google — still the centre of demand.",
    sourceName: "Statcounter Global Stats",
    sourceUrl: "https://gs.statcounter.com/search-engine-market-share",
  },
  {
    value: "≈16%",
    label: "of Google searches showed an AI Overview by late 2025 — search is changing fast.",
    sourceName: "Semrush study, via Search Engine Land",
    sourceUrl: "https://searchengineland.com/google-ai-overviews-surge-pullback-data-466314",
  },
  {
    value: "81%",
    label: "of consumers used Google to evaluate local businesses in 2024.",
    sourceName: "BrightLocal Local Consumer Review Survey 2024",
    sourceUrl: "https://www.brightlocal.com/research/local-consumer-review-survey-2024/",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Discovery & strategy",
    description:
      "We learn your business, your best customers, and your numbers — then research the market and competitors to build a prioritized plan you can actually see.",
  },
  {
    step: "02",
    title: "Build & launch",
    description:
      "We execute the highest-impact work first, whether that's fixing technical SEO, launching campaigns, or shipping new pages — with your sign-off before anything goes live.",
  },
  {
    step: "03",
    title: "Measure & optimize",
    description:
      "We track leads and revenue, not vanity metrics, and refine continuously: cut what isn't working, double down on what is, and report it all in plain language.",
  },
  {
    step: "04",
    title: "Scale what works",
    description:
      "Once a channel is profitable, we reinvest to grow it and add the next one — so your marketing compounds instead of stalling after the first quarter.",
  },
];

const COMPARISON = [
  { feature: "Who does your work", us: "A senior consultant you can reach directly", them: "A rotating junior account manager" },
  { feature: "Scope", us: "SEO, local, AI search, ads, web, and analytics under one roof", them: "One channel, siloed from the rest" },
  { feature: "AI search (GEO)", us: "Built in — few competitors offer it", them: "Not on the menu" },
  { feature: "Reporting", us: "Tied to leads and revenue", them: "Traffic charts and rank screenshots" },
  { feature: "Pricing", us: "Transparent ranges, month-to-month", them: "Opaque quotes, locked contracts" },
  { feature: "Data", us: "Real Canadian search data behind every plan", them: "Generic, off-the-shelf playbooks" },
];

const FAQS = [
  {
    question: "What does a digital marketing agency actually do?",
    answer:
      "A good one grows the number of qualified customers finding and choosing your business online. That spans search engine optimization, local search, paid ads, content, web design, and analytics. At NexFortis we run these as one connected strategy rather than disconnected services, so every channel reinforces the others instead of competing for budget.",
  },
  {
    question: "How much does digital marketing cost?",
    answer:
      "It depends on your market and goals, which is why we price in transparent ranges rather than one-size packages. Most small and mid-sized Canadian businesses invest somewhere between a maintainer budget for steady local visibility and a growth budget for competitive markets. You get a fixed monthly scope, clear reporting, and no long-term lock-in, so you can scale up or down as results come in.",
  },
  {
    question: "How is NexFortis different from a typical agency?",
    answer:
      "Three ways. You work directly with a senior consultant instead of being handed to a junior. Every plan is built on real Canadian search data, not a generic playbook. And we include AI search optimization — getting you cited by ChatGPT and Google's AI Overviews — which almost no local competitor offers yet.",
  },
  {
    question: "Do I need SEO, ads, or both?",
    answer:
      "It depends on your timeline and margins. Ads buy visibility immediately but stop the moment you stop paying. SEO and local search take a few months but compound into traffic you don't rent. Most businesses start with one and layer in the other; we'll recommend the mix that fits your goals rather than selling you everything at once.",
  },
  {
    question: "How quickly will I see results?",
    answer:
      "Paid ads and Google Business Profile improvements can drive enquiries within weeks. SEO and content typically show meaningful gains around the three-to-six-month mark and keep compounding from there. We set realistic expectations against your specific market up front, and we report progress every month so you're never guessing.",
  },
  {
    question: "Do you work with businesses outside the GTA?",
    answer:
      "Yes. We're based in Nobleton and know the Greater Toronto Area well, but search marketing works anywhere. We serve clients across Ontario and the rest of Canada, and our local SEO work simply targets whichever cities and service areas matter to you.",
  },
  {
    question: "What is GEO or AI search, and do I need it?",
    answer:
      "GEO — Generative Engine Optimization — is the work that gets your brand cited by AI engines like ChatGPT, Google's AI Overviews, Perplexity, and Gemini, where a fast-growing share of buyers now start. If your customers are researching online, you'll want to be in those answers before your competitors are. It's a forward-looking add-on we build on top of solid SEO foundations.",
  },
  {
    question: "Can you take over marketing we've already started?",
    answer:
      "Yes, and most of our clients come to us that way. We start by auditing what's already in place — your website, any past SEO work, ad accounts, and analytics — then keep what's working and fix or replace what isn't. You won't pay us to redo good work, and we'll be straight with you about what a previous provider got right and where the gaps are.",
  },
];

export default function DigitalMarketing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const spokes = getPublishedSpokes();

  return (
    <div>
      <SEO
        title="Digital Marketing Services"
        description="Digital marketing for Canadian businesses: SEO, local search, AI search (GEO), Google Ads, web design, and analytics — one connected strategy."
        path={DM_PILLAR_HREF}
      />
      <ServiceSchema
        name="Digital Marketing Services"
        description="Full-service digital marketing for Canadian businesses — SEO, local SEO, AI search optimization, paid media, web design, and analytics."
        url={DM_PILLAR_HREF}
        serviceType="Digital Marketing"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "Digital Marketing", url: DM_PILLAR_HREF },
        ]}
      />
      <FAQSchema faqs={FAQS} />
      <PersonSchema name={DM_AUTHOR.name} jobTitle={DM_AUTHOR.title} url="/about" />

      <PageHero
        title="Digital Marketing Services for Canadian Businesses"
        subtitle="One partner for everything that brings you customers online — search, AI search, ads, content, and the website that ties it together."
      />
      <PageBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Digital Marketing" },
        ]}
      />

      {/* Intro + market stats */}
      <Section bg="brand-light">
        <div className="max-w-3xl mx-auto">
          <SectionHeader title="Marketing that brings you customers, not just clicks" />
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
            <p>
              Most Canadian businesses don&rsquo;t need more marketing noise &mdash; they need more
              of the right customers finding them at the moment they&rsquo;re ready to buy. That
              means showing up in Google&rsquo;s results, in the local map pack, and now in the AI
              answers that are reshaping how people search.
            </p>
            <p>
              NexFortis runs all of it as one connected strategy. We start with{" "}
              <InlineLink href={seo.href}>{seo.linkText}</InlineLink> as the foundation, add{" "}
              <InlineLink href={localSeo.href}>{localSeo.linkText}</InlineLink> for businesses that
              serve a specific area, and layer on{" "}
              <InlineLink href={geo.href}>{geo.linkText}</InlineLink> so you&rsquo;re cited where
              buyers increasingly start: ChatGPT and Google&rsquo;s AI Overviews. Paid ads, content,
              web design, and analytics round out the picture.
            </p>
            <p>
              You work directly with a senior consultant, every plan is built on real Canadian
              search data, and every report ties back to leads and revenue &mdash; not vanity
              metrics.
            </p>
          </div>
        </div>
        <div className="mt-16">
          <StatBand stats={STATS} />
        </div>
      </Section>

      {/* The services (published spokes) */}
      <Section bg="white">
        <SectionHeader
          title="Our digital marketing services"
          subtitle="Each is a deep capability in its own right — explore the ones live today, with more rolling out across the cluster."
          centered
        />
        <div className="mt-12">
          <RelatedServices spokes={spokes} />
        </div>
      </Section>

      {/* Remaining capabilities (not yet on their own page) */}
      <Section bg="secondary">
        <SectionHeader
          title="Also available across the cluster"
          subtitle="These capabilities are live too — ask us about any of them while we publish their dedicated pages."
          centered
        />
        <div className="mt-12">
          <FeatureGrid items={FULL_MENU} />
        </div>
      </Section>

      {/* Coverage: search */}
      <Section bg="brand-light">
        <div className="max-w-3xl mx-auto">
          <SectionHeader title="Search: the foundation of everything" />
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
            <p>
              Search is where buying decisions still begin, and it&rsquo;s the highest-return
              channel we run because the traffic compounds. Our{" "}
              <InlineLink href={seo.href}>{seo.linkText}</InlineLink> work covers keyword and intent
              research, on-page optimization, the technical foundations that let Google crawl and
              rank your site, and the content that earns positions you keep for years.
            </p>
            <p>
              For businesses that serve customers in a specific place, <InlineLink href={localSeo.href}>{localSeo.linkText}</InlineLink>{" "}
              puts you in the Google map pack and &ldquo;near me&rdquo; results through an optimized
              Google Business Profile, consistent listings, genuine reviews, and location pages.
              Most local businesses need both, and we run them together so the map and the organic
              results reinforce each other.
            </p>
          </div>
        </div>
      </Section>

      {/* Coverage: AI search */}
      <Section bg="white">
        <div className="max-w-3xl mx-auto">
          <SectionHeader title="AI search: the shift most agencies are missing" />
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
            <p>
              A growing share of searches now end with an AI-generated answer instead of a list of
              links. These engines cite only a handful of sources, so being one of them is the new
              version of ranking first. Our{" "}
              <InlineLink href={geo.href}>{geo.linkText}</InlineLink> service earns those citations
              through passage-level content structure, the right schema, and brand mentions across
              the sources language models trust.
            </p>
            <p>
              It&rsquo;s the most forward-looking part of what we do, and almost no GTA competitor
              offers it yet &mdash; which is exactly why the businesses that move now will be hard
              to displace later.
            </p>
          </div>
        </div>
      </Section>

      {/* Coverage: the rest */}
      <Section bg="brand-light">
        <div className="max-w-3xl mx-auto">
          <SectionHeader title="Ads, content, web, and the data behind it" />
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
            <p>
              When you need visibility now, paid media delivers it. We plan and manage Google Ads
              and paid social campaigns built around real buyer intent, with transparent reporting
              on every dollar of ad spend and a clear view of your cost per lead.
            </p>
            <p>
              Content marketing and digital PR build the authority that makes search work, turning
              research-led articles and earned mentions into rankings and trust. Web design and
              conversion optimization make sure the traffic you earn actually becomes enquiries
              &mdash; a fast, mobile-first site that&rsquo;s built to rank and built to convert.
            </p>
            <p>
              Underpinning all of it, we wire up analytics and reporting &mdash; GA4, Search
              Console, and call tracking &mdash; so every channel is measured against the only
              metric that matters: customers. These capabilities are rolling out as dedicated pages
              across the cluster; ask us about any of them today.
            </p>
          </div>
        </div>
      </Section>

      {/* How we work */}
      <Section bg="white">
        <SectionHeader title="How we work" centered />
        <div className="mt-12">
          <StepsTimeline steps={PROCESS} />
        </div>
      </Section>

      {/* Why NexFortis */}
      <Section bg="brand-light">
        <SectionHeader title="Why businesses choose NexFortis" centered />
        <div className="mt-12 max-w-4xl mx-auto">
          <FeatureComparison rows={COMPARISON} />
        </div>
      </Section>

      {/* FAQ */}
      <Section bg="white">
        <SectionHeader title="Frequently Asked Questions" centered />
        <div className="max-w-3xl mx-auto border-t border-border mt-8">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>
      </Section>

      {/* Author / EEAT */}
      <Section bg="brand-light">
        <AuthorBio name={DM_AUTHOR.name} title={DM_AUTHOR.title}>
          <p>
            Hassan leads digital marketing and IT strategy at NexFortis, helping Canadian businesses
            turn search, local, and AI discovery into a predictable flow of customers &mdash;
            working directly with every client, with no hand-off to a junior team.
          </p>
        </AuthorBio>
      </Section>

      {/* CTA */}
      <Section bg="brand-navy">
        <CTAStrip
          heading="Ready to grow your online presence?"
          subtext="Get a free, no-obligation assessment of your digital marketing — your search visibility, your competitors, and the fastest path to more customers."
        />
      </Section>
    </div>
  );
}
