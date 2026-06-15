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
import { FeatureGrid } from "@/components/content/FeatureGrid";
import { StepsTimeline } from "@/components/content/StepsTimeline";
import { FeatureComparison } from "@/components/content/FeatureComparison";
import { PricingReference } from "@/components/content/PricingReference";
import { RelatedServices } from "@/components/content/RelatedServices";
import { CTAStrip } from "@/components/content/CTAStrip";
import { AuthorBio } from "@/components/content/AuthorBio";
import { Testimonial } from "@/components/content/Testimonial";
import {
  getDmSpoke,
  getRelatedSpokes,
  DM_PILLAR_HREF,
  type DmSpokeSlug,
} from "@/lib/internal-links";
import { DM_SPOKE_CONTENT, DM_AUTHOR } from "./_dmContent";

// Shared template for every digital-marketing spoke page. Reads typed content
// from _dmContent.tsx and the link metadata from internal-links.ts, then
// composes the head schema (Service + Breadcrumb + FAQPage + Person — the global
// Organization/LocalBusiness/WebSite come from Layout) and the page sections.
// Heading order is strictly h1 (hero) → h2 (every SectionHeader / CTAStrip) →
// h3 (cards / steps), so the only heading-hierarchy exceptions are the
// pre-existing global footer/noscript ones already allowlisted site-wide.
export function DmSpokePageBody({ slug }: { slug: DmSpokeSlug }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const spoke = getDmSpoke(slug);
  const c = DM_SPOKE_CONTENT[slug];
  if (!c) {
    throw new Error(`No content defined for digital-marketing spoke: ${slug}`);
  }
  const related = getRelatedSpokes(slug, 3);
  const url = spoke.href;

  return (
    <div>
      <SEO title={c.metaTitle} description={c.metaDescription} path={url} />
      <ServiceSchema
        name={c.serviceSchemaName}
        description={c.serviceSchemaDescription}
        url={url}
        serviceType={c.serviceType}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "Digital Marketing", url: DM_PILLAR_HREF },
          { name: spoke.title, url },
        ]}
      />
      <FAQSchema faqs={[...c.faq]} />
      <PersonSchema name={DM_AUTHOR.name} jobTitle={DM_AUTHOR.title} url="/about" />

      <PageHero title={c.h1} subtitle={c.heroSubtitle} />
      <PageBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Digital Marketing", href: DM_PILLAR_HREF },
          { label: spoke.title },
        ]}
      />

      {/* Intro + sourced stats */}
      <Section bg="brand-light">
        <div className="max-w-3xl mx-auto">
          <SectionHeader title={c.introHeading} />
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
            {c.intro}
          </div>
          {c.introCallout && <div className="mt-8">{c.introCallout}</div>}
        </div>
        <div className="mt-16">
          <StatBand stats={c.stats} />
        </div>
      </Section>

      {/* What's included */}
      <Section bg="white">
        <SectionHeader title={c.featuresHeading} subtitle={c.featuresSubtitle} centered />
        <div className="mt-12">
          <FeatureGrid items={c.features} />
        </div>
      </Section>

      {/* How we work */}
      {c.process && c.processHeading && (
        <Section bg="brand-light">
          <SectionHeader title={c.processHeading} centered />
          <div className="mt-12">
            <StepsTimeline steps={c.process} />
          </div>
        </Section>
      )}

      {/* Differentiator comparison */}
      {c.comparison && c.comparisonHeading && (
        <Section bg="white">
          <SectionHeader title={c.comparisonHeading} centered />
          <div className="mt-12 max-w-4xl mx-auto">
            <FeatureComparison rows={c.comparison} />
          </div>
        </Section>
      )}

      {/* Pricing reference */}
      {c.pricing && c.pricingHeading && (
        <Section bg="brand-light">
          <SectionHeader title={c.pricingHeading} centered />
          <div className="mt-12">
            <PricingReference fromLabel={c.pricing.fromLabel} note={c.pricing.note} />
          </div>
        </Section>
      )}

      {/* Real client testimonial — only renders when genuine data exists */}
      {c.testimonial && (
        <Section bg="white">
          <SectionHeader title="What clients say" centered />
          <div className="mt-12">
            <Testimonial data={c.testimonial} />
          </div>
        </Section>
      )}

      {/* Related spoke services */}
      {related.length > 0 && (
        <Section bg="brand-light">
          <SectionHeader
            title="Related services"
            subtitle="Part of our full digital marketing offering."
            centered
          />
          <div className="mt-12">
            <RelatedServices spokes={related} />
          </div>
        </Section>
      )}

      {/* FAQ */}
      <Section bg="white">
        <SectionHeader title="Frequently Asked Questions" centered />
        <div className="max-w-3xl mx-auto border-t border-border mt-8">
          {c.faq.map((faq, i) => (
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
          {c.authorNote}
        </AuthorBio>
      </Section>

      {/* CTA */}
      <Section bg="brand-navy">
        <CTAStrip heading={c.ctaHeading} subtext={c.ctaSubtext} />
      </Section>
    </div>
  );
}
