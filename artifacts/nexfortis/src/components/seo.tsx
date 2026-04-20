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
  const siteUrl = SITE_URL;
  const fullTitle =
    path === "/"
      ? `${SITE_NAME} — Complexity Decoded. Advantage.`
      : title.includes("NexFortis")
        ? title
        : `${title} | ${SITE_NAME}`;
  const fullUrl = `${siteUrl}${path}`;
  const ogImage = image || `${siteUrl}${DEFAULT_IMAGE}`;

  return (
    <Helmet>
      <html lang="en-CA" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      <link rel="alternate" hrefLang="en-CA" href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_CA" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <meta name="geo.region" content="CA-ON" />
      <meta name="geo.placename" content="Nobleton" />
    </Helmet>
  );
}

export function OrganizationSchema() {
  const siteUrl = SITE_URL;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "NexFortis IT Solutions",
    legalName: "17756968 Canada Inc.",
    url: siteUrl,
    logo: `${siteUrl}/images/logo-512.png`,
    description: "NexFortis delivers end-to-end IT solutions for Canadian businesses including managed IT, Microsoft 365, QuickBooks migration, digital marketing, and workflow automation.",
    contactPoint: {
      "@type": "ContactPoint",
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
    sameAs: ["https://www.linkedin.com/company/nexfortis"],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function LocalBusinessSchema() {
  const siteUrl = SITE_URL;
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#localbusiness`,
    name: "NexFortis IT Solutions",
    legalName: "17756968 Canada Inc.",
    url: siteUrl,
    logo: `${siteUrl}/images/logo-512.png`,
    image: `${siteUrl}/opengraph.png`,
    description: "NexFortis delivers end-to-end IT solutions for Canadian businesses including managed IT, Microsoft 365, QuickBooks migration, digital marketing, and workflow automation.",
    email: "contact@nexfortis.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "204 Hill Farm Rd",
      addressLocality: "Nobleton",
      addressRegion: "ON",
      postalCode: "L7B 0A1",
      addressCountry: "CA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.9327,
      longitude: -79.6615,
    },
    areaServed: {
      "@type": "Country",
      name: "Canada",
    },
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
    sameAs: ["https://www.linkedin.com/company/nexfortis"],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function WebSiteSchema() {
  const siteUrl = SITE_URL;
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "NexFortis IT Solutions",
    url: siteUrl,
    inLanguage: "en-CA",
    publisher: { "@id": `${siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function ServiceSchema({ name, description, url }: { name: string; description: string; url?: string }) {
  const siteUrl = SITE_URL;
  const resolvedUrl = url ? (url.startsWith("http") ? url : `${siteUrl}${url}`) : `${siteUrl}/services`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: resolvedUrl,
    provider: {
      "@type": "Organization",
      name: "NexFortis IT Solutions",
      url: siteUrl,
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
  const siteUrl = SITE_URL;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
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

export function ArticleSchema({ title, description, datePublished, dateModified, url, image }: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  image?: string;
}) {
  const siteUrl = SITE_URL;
  const fullUrl = url.startsWith("http") ? url : `${siteUrl}${url}`;
  const resolvedImage = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image.startsWith("/") ? image : `/${image}`}`
    : `${siteUrl}${DEFAULT_IMAGE}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished,
    dateModified: dateModified || datePublished,
    url: fullUrl,
    image: resolvedImage,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "NexFortis IT Solutions",
      logo: { "@type": "ImageObject", url: `${siteUrl}/images/logo-512.png` },
    },
    author: {
      "@type": "Person",
      name: "Hassan Sadiq",
      url: `${siteUrl}/about`,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
