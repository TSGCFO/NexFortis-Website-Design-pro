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
const geo = getDmSpoke("geo-ai-search");

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
      "First we get to know your business, your best customers, and your numbers. Then we dig into the market and your competitors and turn it into a prioritized plan you can actually read — not a 40-page deck nobody opens.",
  },
  {
    step: "02",
    title: "Build & launch",
    description:
      "We tackle the highest-impact work first, whether that is clearing technical SEO problems, getting campaigns live, or shipping new pages. Nothing goes out the door without your sign-off.",
  },
  {
    step: "03",
    title: "Measure & optimize",
    description:
      "Every month we look at leads and revenue, not vanity numbers. We cut what is not earning its keep, put more behind what is, and explain the whole thing in plain English.",
  },
  {
    step: "04",
    title: "Scale what works",
    description:
      "Once a channel is paying for itself, we reinvest to grow it and add the next one. That is how marketing compounds instead of stalling out after the first quarter.",
  },
];

const COMPARISON = [
  { feature: "Who does your work", us: "A senior consultant you can reach directly", them: "A rotating junior account manager" },
  { feature: "Scope", us: "SEO, local, AI search, ads, web, and analytics under one roof", them: "One channel, siloed from the rest" },
  { feature: "AI search (GEO)", us: "Built in — still rare among local agencies", them: "Not on the menu" },
  { feature: "Reporting", us: "Tied to leads and revenue", them: "Traffic charts and rank screenshots" },
  { feature: "Pricing", us: "Transparent ranges, month-to-month", them: "Opaque quotes, locked contracts" },
  { feature: "Data", us: "Real Canadian search data behind every plan", them: "Generic, off-the-shelf playbooks" },
];

const FAQS = [
  {
    question: "What does a digital marketing agency actually do?",
    answer:
      "Strip away the jargon and the job is simple: get more of the right people to find you and choose you online. In practice that means SEO, local search, paid ads, content, your website, and the analytics that tell you what is working. The difference at NexFortis is that we run those as one plan, not five invoices from five teams who never talk to each other. When the channels point the same direction, your budget goes a lot further.",
  },
  {
    question: "How much does digital marketing cost?",
    answer:
      "Honestly, it depends on your market and what you are trying to do, which is why we quote a real range instead of a one-price-fits-all package. A single-location business holding steady needs far less than a company fighting for competitive keywords. Whatever the number, you get a fixed monthly scope, plain-language reporting, and no long-term lock-in — so you can scale up when it is working or step back if your priorities change. We share specifics after a quick, free audit of your situation.",
  },
  {
    question: "How is NexFortis different from a typical agency?",
    answer:
      "Three things, mainly. You work with a senior person who knows your account, not a junior who churns through ten others. Your plan comes from real Canadian search data, not a recycled template. And we build in AI search — getting you cited by ChatGPT and Google's AI Overviews — which is still rare among local agencies.",
  },
  {
    question: "Do I need SEO, ads, or both?",
    answer:
      "It comes down to your timeline and your margins. Ads switch on visibility today, but the leads stop the day you stop paying. SEO and local search take a few months to build, then keep delivering traffic you are not renting. Plenty of clients start with ads for cash flow and let SEO compound underneath. We will tell you the mix that fits your goals rather than trying to sell you the whole menu on day one.",
  },
  {
    question: "How quickly will I see results?",
    answer:
      "Some of it is fast. Paid ads and a tuned-up Google Business Profile can bring enquiries within a few weeks. SEO and content are the slower burn — usually three to six months before the gains are obvious, and then they keep building. We set honest expectations against your specific market up front, and we report every month so you are never left guessing.",
  },
  {
    question: "Do you work with businesses outside the GTA?",
    answer:
      "Yes. We are based in Nobleton and we know the Greater Toronto Area inside out, but search marketing is not bound by geography. We work with clients across Ontario and the rest of Canada, and the local SEO side simply targets whichever cities and service areas actually matter to your business.",
  },
  {
    question: "What is GEO or AI search, and do I need it?",
    answer:
      "GEO stands for Generative Engine Optimization — the work that gets your brand quoted by AI tools like ChatGPT, Google's AI Overviews, Perplexity, and Gemini. A growing slice of buyers now start their research there instead of on a search page. If that describes your customers, you want to be in those answers before your competitors figure it out. We build it on top of solid SEO rather than as a gimmick on its own.",
  },
  {
    question: "Can you take over marketing we've already started?",
    answer:
      "Almost everyone comes to us mid-stream, so yes. We start by looking at what you already have — the website, any past SEO, the ad accounts, the analytics — and we keep what is pulling its weight before changing anything. You will not pay us to redo good work, and we will be straight with you about what the last provider got right and where the gaps are.",
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
              Here is the uncomfortable truth most agencies won&rsquo;t tell you: more marketing
              rarely fixes a slow month. The customers you want are already searching for what you
              sell. The question is whether they find you or the company three spots above you. Win
              that moment in Google&rsquo;s results, in the local map, and now inside the AI answers
              people read instead of clicking, and the phone starts ringing on its own.
            </p>
            <p>
              We handle the whole picture rather than one slice of it. Most engagements start with{" "}
              <InlineLink href={seo.href}>{seo.linkText}</InlineLink>, because organic rankings keep
              paying off long after the work is done. If you serve a city or a few neighbourhoods, we
              add <InlineLink href={localSeo.href}>{localSeo.linkText}</InlineLink>. And because a
              real share of buyers now ask ChatGPT or read Google&rsquo;s AI Overviews before they
              ever visit a website, we layer on{" "}
              <InlineLink href={geo.href}>{geo.linkText}</InlineLink> so your name shows up in those
              answers too. Paid ads, content, web design, and the analytics behind them fill in the
              rest as you need them.
            </p>
            <p>
              One more thing that matters: you deal with a senior person who actually knows your
              account, not a junior who rotates off in three months. Every plan is built on real
              Canadian search data, and every report we send answers the only question you care
              about &mdash; how many leads did this bring in.
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
              Buying decisions still start with a search, and search is the channel we lean on
              hardest because the results stack up over time instead of vanishing when you stop
              paying. Our <InlineLink href={seo.href}>{seo.linkText}</InlineLink> work is the
              unglamorous stuff that actually moves rankings: finding the terms your buyers really
              type, fixing the technical issues that quietly hold a site back, and writing pages
              thorough enough that Google has no reason to rank a competitor ahead of you.
            </p>
            <p>
              Got a storefront or a service area? Then{" "}
              <InlineLink href={localSeo.href}>{localSeo.linkText}</InlineLink> is where the fast
              wins live. We get you into the Google map pack and the &ldquo;near me&rdquo; results
              with a properly built Google Business Profile, listings that all say the same thing,
              real reviews, and pages written for each place you serve. Most local businesses want
              both, and they work better together &mdash; the map listing earns trust, the organic
              ranking backs it up.
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
              More and more searches end with a written answer, not ten blue links. The catch is
              that an AI answer names only a few sources, so the game has shifted from ranking first
              to being one of the handful it decides to quote. That is what our{" "}
              <InlineLink href={geo.href}>{geo.linkText}</InlineLink> work is for: structuring your
              pages so a model can lift a clean answer from them, adding the schema that tells it
              what you are, and building the mentions across the web that teach it to trust you.
            </p>
            <p>
              It is the newest thing we do and still rare among GTA agencies. We think that window
              matters. The companies that earn an AI engine&rsquo;s trust now will be a lot harder to
              dislodge once everyone else catches on.
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
              SEO is patient work. Sometimes you need leads this week, and that is what paid media
              is for. We plan and run Google Ads and paid social around genuine buyer intent, and we
              show you exactly what each dollar bought &mdash; right down to the cost of a single
              lead, so you always know whether to spend more or pull back.
            </p>
            <p>
              The rest of the stack supports those two engines. Content marketing and digital PR
              earn the authority that makes ranking possible in the first place. A fast,
              mobile-first website &mdash; and the conversion work that goes with it &mdash; makes
              sure the visitors you fought for actually pick up the phone instead of bouncing.
            </p>
            <p>
              And none of it is worth much if you cannot see what is working. We wire up GA4, Search
              Console, and call tracking so every channel is judged on customers, not clicks. Each
              of these is becoming its own dedicated page across the cluster; until then, just ask
              and we will walk you through how we handle it.
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
            Hassan runs digital marketing and IT strategy at NexFortis. He started the firm to give
            Canadian small and mid-sized businesses the kind of senior attention they usually only
            get from an in-house hire &mdash; helping them turn search, local, and AI discovery into
            a steady flow of customers. When you work with NexFortis, you work with him and his team
            directly. Nobody gets handed off to a junior.
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
