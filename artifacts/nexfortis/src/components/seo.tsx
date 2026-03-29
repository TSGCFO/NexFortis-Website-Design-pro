import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  image?: string;
  noIndex?: boolean;
}

const SITE_NAME = "NexFortis IT Solutions";
const SITE_URL = "https://nexfortis.com";
const DEFAULT_IMAGE = "/opengraph.png";

export function SEO({ title, description, path = "/", type = "website", image, noIndex }: SEOProps) {
  const fullTitle = path === "/" ? `${SITE_NAME} — Your Business. Our Technology. Limitless Growth.` : `${title} | ${SITE_NAME}`;
  const fullUrl = `${SITE_URL}${path}`;
  const ogImage = image || `${SITE_URL}${DEFAULT_IMAGE}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_CA" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NexFortis IT Solutions",
    legalName: "17756968 Canada Inc.",
    url: "https://nexfortis.com",
    logo: "https://nexfortis.com/images/logo-original.png",
    description: "NexFortis delivers end-to-end IT solutions for Canadian businesses including managed IT, Microsoft 365, QuickBooks migration, digital marketing, and workflow automation.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-800-555-0199",
      contactType: "customer service",
      email: "contact@nexfortis.com",
      areaServed: "CA",
      availableLanguage: ["English"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "204 Hill Farm Rd",
      addressLocality: "Nobleton",
      addressRegion: "ON",
      postalCode: "L7B 0A1",
      addressCountry: "CA",
    },
    sameAs: [],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function ServiceSchema({ name, description, url }: { name: string; description: string; url?: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: url || "https://nexfortis.com/services",
    provider: {
      "@type": "Organization",
      name: "NexFortis IT Solutions",
      url: "https://nexfortis.com",
    },
    areaServed: {
      "@type": "Country",
      name: "Canada",
    },
    serviceType: "IT Services",
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function ArticleSchema({ title, description, datePublished, dateModified, url }: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished,
    dateModified: dateModified || datePublished,
    url,
    publisher: {
      "@type": "Organization",
      name: "NexFortis IT Solutions",
      logo: { "@type": "ImageObject", url: "https://nexfortis.com/images/logo-original.png" },
    },
    author: {
      "@type": "Organization",
      name: "NexFortis IT Solutions",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
