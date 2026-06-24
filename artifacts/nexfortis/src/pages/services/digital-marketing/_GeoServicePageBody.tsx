import { useState } from "react";
import { SEO, ServiceSchema, BreadcrumbSchema, FAQSchema, PersonSchema } from "@/components/seo";
import { Section, SectionHeader, PageHero, PageBreadcrumbs, FAQItem } from "@/components/ui-elements";
import { StatBand } from "@/components/content/StatBand";
import { FeatureGrid } from "@/components/content/FeatureGrid";
import { CTAStrip } from "@/components/content/CTAStrip";
import { AuthorBio } from "@/components/content/AuthorBio";
import { Testimonial } from "@/components/content/Testimonial";
import { InlineLink } from "@/components/content/InlineLink";
import { LocalContextSection } from "@/components/content/LocalContextSection";
import { LocalProofSection } from "@/components/content/LocalProofSection";
import { GeoLinkList } from "@/components/content/GeoLinkList";
import { getDmSpoke, DM_PILLAR_HREF, type DmSpokeSlug } from "@/lib/internal-links";
import { geoHref, getNearbyCityPages, getSameCityServices } from "@/lib/geo-links";
import { GEO_PAGE_CONTENT } from "./_geoContent";
import { DM_AUTHOR } from "./_dmContent";

// Shared template for every geo [service]+[city] page. Reads typed local content from
// _geoContent.tsx and the parent spoke metadata from internal-links.ts. Relates UP to the
// national spoke (canonical neighbour + in-prose link), ACROSS to sibling city pages, and
// renders the genuinely-local sections that keep the page out of doorway-page territory.
export function GeoServicePageBody({ service, city }: { service: DmSpokeSlug; city: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const c = GEO_PAGE_CONTENT[`${service}/${city}`];
  if (!c) {
    throw new Error(`No geo content defined for: ${service}/${city}`);
  }
  const spoke = getDmSpoke(service);
  const url = `${spoke.href}/${city}`;
  const serviceLabel = spoke.linkText; // e.g. "Local SEO"
  const nearby = getNearbyCityPages(service, city);
  const sameCity = getSameCityServices(city, service);

  const areaServed = {
    "@type": "City",
    name: c.cityName,
    containedInPlace: { "@type": "AdministrativeArea", name: c.region },
  };

  return (
    <div>
      <SEO
        title={c.metaTitle}
        description={c.metaDescription}
        path={url}
        geoRegion={`CA-${c.region}`}
        geoPlacename={c.cityName}
      />
      <ServiceSchema
        name={c.serviceSchemaName}
        description={c.serviceSchemaDescription}
        url={url}
        serviceType={c.serviceType}
        areaServed={areaServed}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "Digital Marketing", url: DM_PILLAR_HREF },
          { name: spoke.title, url: spoke.href },
          { name: c.cityName, url },
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
          { label: spoke.title, href: spoke.href },
          { label: c.cityName },
        ]}
      />

      {/* Intro + sourced stats + UP link to the national spoke */}
      <Section bg="brand-light">
        <div className="max-w-3xl mx-auto">
          <SectionHeader title={c.introHeading} />
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">{c.intro}</div>
          <p className="mt-6 text-muted-foreground">
            This page covers {c.cityName} specifically — for the full picture, see our city-wide{" "}
            <InlineLink href={spoke.href}>{serviceLabel}</InlineLink>.
          </p>
        </div>
        <div className="mt-16">
          <StatBand stats={[...c.stats]} />
        </div>
      </Section>

      {/* Genuinely-local context + areas served (anti-doorway) */}
      <LocalContextSection
        heading={c.localContextHeading}
        areas={c.serviceAreas}
        areasHeading={`Neighbourhoods and areas we serve in ${c.cityName}`}
      >
        {c.localContext}
      </LocalContextSection>

      {/* Features (city-flavoured) */}
      <Section bg="white">
        <SectionHeader title={c.featuresHeading ?? `Our ${serviceLabel.toLowerCase()} work in ${c.cityName}`} centered />
        <div className="mt-12">
          <FeatureGrid items={[...c.features]} />
        </div>
      </Section>

      {/* Local proof — real result or cited market stat, never invented */}
      <LocalProofSection heading={`Why ${c.cityName} businesses choose NexFortis`} items={c.localProof} />

      {/* Genuine testimonial — only renders when real data exists */}
      {c.testimonial && (
        <Section bg="white">
          <SectionHeader title="What clients say" centered />
          <div className="mt-12">
            <Testimonial data={c.testimonial} />
          </div>
        </Section>
      )}

      {/* ACROSS: same service, nearby cities */}
      <GeoLinkList
        title={c.nearbyHeading ?? `${serviceLabel} in nearby cities`}
        bg="brand-light"
        links={nearby.map((p) => ({ href: geoHref(p), label: `${serviceLabel} ${p.cityName}` }))}
      />

      {/* Same city, other services */}
      <GeoLinkList
        title={`Other digital marketing services in ${c.cityName}`}
        bg="white"
        links={sameCity.map((p) => ({ href: geoHref(p), label: `${getDmSpoke(p.parentSlug).linkText} ${c.cityName}` }))}
      />

      {/* FAQ */}
      <Section bg="brand-light">
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
      <Section bg="white">
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

// Default export so the codegen can lazy-load it as a single shared geo page component.
export default GeoServicePageBody;
