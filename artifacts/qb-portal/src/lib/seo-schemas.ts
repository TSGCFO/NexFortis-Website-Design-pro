import { BASE_URL } from "@/components/seo";
import type { Product } from "@/lib/products";

export const COMPANY_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "204 Hill Farm Rd",
  addressLocality: "Nobleton",
  addressRegion: "ON",
  postalCode: "L7B 0A1",
  addressCountry: "CA",
};

// Brand name is kept consistent with the marketing site (nexfortis.com) so AI
// engines and Google's entity dedupe logic treat both hosts as the same
// organization. The marketing site emits "NexFortis IT Solutions" — we match.
export const ORG_NAME = "NexFortis IT Solutions";
export const SUPPORT_EMAIL = "support@nexfortis.com";
export const SITE_NAME = "NexFortis QuickBooks Portal";
export const AREA_SERVED = ["CA", "US", "GB", "AU"];
// E.164 format is what Google recommends for the `telephone` property on
// Organization and LocalBusiness schema. Google accepts hyphenated forms too,
// but the leading +1 country code is required for the Knowledge Graph to
// reliably associate the number with the business entity.
export const SUPPORT_PHONE = "+1-416-317-0051";

// Stable @id URIs for the core entity graph. These are NOT navigable URLs —
// they're fragment identifiers that let Service/BreadcrumbList nodes point
// back at the canonical Organization/WebSite/LocalBusiness node instead of
// inlining a duplicate copy. Matches the pattern used on nexfortis.com.
export const ORG_ID = `${BASE_URL}/#organization`;
export const WEBSITE_ID = `${BASE_URL}/#website`;
export const LOCAL_BUSINESS_ID = `${BASE_URL}/#localbusiness`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: ORG_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo-512.png`,
    email: SUPPORT_EMAIL,
    telephone: SUPPORT_PHONE,
    address: COMPANY_ADDRESS,
    sameAs: ["https://www.linkedin.com/company/nexfortis"],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: BASE_URL,
    publisher: { "@id": ORG_ID },
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": LOCAL_BUSINESS_ID,
    name: ORG_NAME,
    url: BASE_URL,
    email: SUPPORT_EMAIL,
    telephone: SUPPORT_PHONE,
    address: COMPANY_ADDRESS,
    priceRange: "$$",
    areaServed: AREA_SERVED,
  };
}

export interface PageBreadcrumb {
  name: string;
  path: string;
}

export function generateBreadcrumbSchema(breadcrumbs: PageBreadcrumb[]) {
  const items = [{ name: "Home", path: "/" }, ...breadcrumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: `${BASE_URL}${b.path}`,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function generateHowToSchema(pageData: {
  h1: string;
  metaDescription: string;
  slug: string;
  process: { title: string; body: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: pageData.h1,
    description: pageData.metaDescription,
    url: `${BASE_URL}/landing/${pageData.slug}`,
    step: pageData.process.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  };
}

export function generateServiceSchema(
  pageData: { h1: string; metaDescription: string; slug: string; primaryKeyword: string },
  product: Product | undefined,
  urlOverride?: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: pageData.h1,
    description: pageData.metaDescription,
    serviceType: pageData.primaryKeyword,
    url: urlOverride || `${BASE_URL}/landing/${pageData.slug}`,
    // Reference the canonical Organization node by @id rather than inlining
    // a duplicate. This lets Google / AI engines treat the provider as the
    // same entity across every Service emission on the site.
    provider: { "@id": ORG_ID },
    areaServed: AREA_SERVED,
    ...(product && {
      offers: {
        "@type": "Offer",
        priceCurrency: "CAD",
        price: (product.launch_price_cad / 100).toFixed(2),
        availability: "https://schema.org/InStock",
        url: `${BASE_URL}/service/${product.slug}`,
      },
    }),
  };
}
