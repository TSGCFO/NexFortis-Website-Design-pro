import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  canonical?: string;
  noIndex?: boolean;
  ogType?: "website" | "article" | "product";
  ogImage?: string;
  jsonLd?: object | object[];
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
}

export const BASE_URL = "https://qb.nexfortis.com";
const SITE_NAME = "NexFortis QuickBooks Portal";
const DEFAULT_OG_IMAGE = `${BASE_URL}/opengraph.jpg`;

export function SEO({
  title,
  description,
  path,
  canonical,
  noIndex,
  ogType = "website",
  ogImage,
  jsonLd,
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
}: SEOProps) {
  const fullTitle = title.includes("NexFortis") ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical || (path ? `${BASE_URL}${path}` : undefined);
  const image = ogImage || DEFAULT_OG_IMAGE;

  const schemas = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {canonicalUrl && (
        <link rel="alternate" hrefLang="en-CA" href={canonicalUrl} />
      )}
      {canonicalUrl && (
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      )}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_CA" />

      {ogType === "article" && articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {ogType === "article" && articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}
      {ogType === "article" && articleAuthor && (
        <meta property="article:author" content={articleAuthor} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta name="geo.region" content="CA-ON" />
      <meta name="geo.placename" content="Nobleton" />

      {noIndex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      )}

      {schemas.map((schema, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
