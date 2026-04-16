import type { Product } from "./products";
import { BASE_URL } from "@/components/seo";

export const COMPANY_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "204 Hill Farm Rd",
  addressLocality: "Nobleton",
  addressRegion: "ON",
  postalCode: "L7B 0A1",
  addressCountry: "CA",
} as const;

export const COMPANY_NAME = "NexFortis";
export const COMPANY_EMAIL = "support@nexfortis.com";
export const COMPANY_LOGO = `${BASE_URL}/images/logo-original.svg`;
export const AREA_SERVED = ["CA", "US", "GB", "AU"];

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_NAME,
    url: BASE_URL,
    logo: COMPANY_LOGO,
    email: COMPANY_EMAIL,
    address: COMPANY_ADDRESS,
    sameAs: [] as string[],
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NexFortis QuickBooks Portal",
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

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: COMPANY_NAME,
    url: BASE_URL,
    logo: COMPANY_LOGO,
    email: COMPANY_EMAIL,
    address: COMPANY_ADDRESS,
    priceRange: "$$",
    areaServed: AREA_SERVED,
  };
}

export interface LandingPageSchemaInput {
  name: string;
  description: string;
  slug: string;
  primaryKeyword: string;
}

export function generateServiceSchema(page: LandingPageSchemaInput, product: Product | null) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.name,
    description: page.description,
    url: `${BASE_URL}/landing/${page.slug}`,
    serviceType: page.primaryKeyword,
    provider: {
      "@type": "ProfessionalService",
      name: COMPANY_NAME,
      url: BASE_URL,
      email: COMPANY_EMAIL,
      address: COMPANY_ADDRESS,
    },
    areaServed: AREA_SERVED,
  };

  if (product) {
    schema.offers = {
      "@type": "Offer",
      price: (product.launch_price_cad / 100).toFixed(2),
      priceCurrency: "CAD",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/service/${product.slug}`,
    };
  }

  return schema;
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

export function generateBreadcrumbSchema(breadcrumbs: { name: string; path: string }[]) {
  const items = [{ name: "Home", path: "/" }, ...breadcrumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((b, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: b.name,
      item: `${BASE_URL}${b.path}`,
    })),
  };
}
