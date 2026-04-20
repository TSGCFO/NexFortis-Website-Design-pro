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

export const ORG_NAME = "NexFortis";
export const SUPPORT_EMAIL = "support@nexfortis.com";
export const SITE_NAME = "NexFortis QuickBooks Portal";
export const AREA_SERVED = ["CA", "US", "GB", "AU"];

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo-original.png`,
    email: SUPPORT_EMAIL,
    address: COMPANY_ADDRESS,
    sameAs: ["https://www.linkedin.com/company/nexfortis"],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/catalog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: ORG_NAME,
    url: BASE_URL,
    email: SUPPORT_EMAIL,
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
    // Default to the landing-page URL for backwards compatibility with
    // landing-page-layout callers. Service-detail pages pass an override
    // pointing at /service/<slug> so the schema's top-level `url` matches
    // the inner `offers.url` and the page's canonical (otherwise Google
    // would see two conflicting URLs in one Service block).
    url: urlOverride ?? `${BASE_URL}/landing/${pageData.slug}`,
    provider: {
      "@type": "Organization",
      name: ORG_NAME,
      url: BASE_URL,
      email: SUPPORT_EMAIL,
      address: COMPANY_ADDRESS,
    },
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
