import { Link } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SEO, BASE_URL } from "@/components/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FAQAccordion } from "@/components/faq-accordion";
import { TrustSignals } from "@/components/trust-signals";
import { RelatedServices } from "@/components/related-services";
import { HeroIllustration } from "@/components/hero-illustration";
import { Button } from "@/components/ui/button";
import type { LandingPageData } from "@/data/landingPages";
import type { Product, ProductCatalog } from "@/lib/products";
import { getProductBySlug, formatPriceCAD } from "@/lib/products";
import {
  generateServiceSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateHowToSchema,
} from "@/lib/seo-schemas";

function resolveTokens(
  text: string,
  product: Product | undefined
): string {
  let resolved = text;
  if (product) {
    resolved = resolved
      .replace(/\{launchPrice\}/g, formatPriceCAD(product.launch_price_cad))
      .replace(/\{basePrice\}/g, formatPriceCAD(product.base_price_cad));
  }
  return resolved
    .replace(/\{[a-zA-Z]+\}/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function LandingPageLayout({
  page,
  catalog,
}: {
  page: LandingPageData;
  catalog: ProductCatalog | null;
}) {
  const product = catalog && page.productSlug
    ? getProductBySlug(catalog, page.productSlug)
    : undefined;

  const metaDescription = resolveTokens(page.metaDescription, product);
  const ctaLabel = resolveTokens(page.ctaLabel, product);

  const jsonLd: object[] = [
    generateFAQSchema(page.faqs),
    generateBreadcrumbSchema(page.breadcrumbs),
  ];
  if (page.category === "service") {
    jsonLd.unshift(
      generateServiceSchema({ ...page, metaDescription }, product)
    );
  } else if (
    // Emit HowTo schema for any non-service landing category that ships an
    // ordered process — educational pages have always done this, but PR #51
    // extends the same treatment to "problem" (e.g. quickbooks-running-slow)
    // and "comparison" (e.g. etech-alternative) pages so Google can surface
    // their step-by-step guidance as a rich result.
    (page.category === "educational" ||
      page.category === "problem" ||
      page.category === "comparison") &&
    page.process.length > 0
  ) {
    jsonLd.unshift(
      generateHowToSchema({ ...page, metaDescription })
    );
  }

  return (
    <div className="bg-background overflow-x-hidden max-w-full">
      <SEO
        title={page.metaTitle}
        description={metaDescription}
        path={`/landing/${page.slug}`}
        ogImage={`${BASE_URL}/og/${page.slug}.jpg`}
        ogType="product"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="section-brand-navy py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-5 text-white/70">
            <Breadcrumbs items={page.breadcrumbs} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display tracking-tight text-white leading-tight mb-5">
                {page.h1}
              </h1>
              <p className="text-lg text-white/85 mb-8 leading-relaxed">
                {page.hero.intro}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={page.ctaHref}>
                  <Button
                    size="lg"
                    className="bg-rose-gold text-rose-gold-foreground hover:bg-rose-gold-hover font-display font-bold rounded-full px-7"
                  >
                    {ctaLabel}
                  </Button>
                </Link>
                <Link href="/catalog">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white/30 text-white hover:bg-white/10 font-display"
                  >
                    See all services
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-2 hidden lg:block">
              <HeroIllustration page={page} />
            </div>
          </div>
        </div>
      </section>

      {/* Main content + sidebar */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-10">
          <div className="lg:col-span-7 space-y-10">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mt-0">
                Overview
              </h2>
              {page.overview.map((para, i) => (
                <p key={i} className="text-foreground/85 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {page.benefits && page.benefits.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-2xl md:text-3xl mb-5 text-foreground">
                  Why NexFortis
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {page.benefits.map((b) => (
                    <div
                      key={b.title}
                      className="rounded-xl border border-border bg-card p-5"
                    >
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-display font-semibold text-base text-foreground mb-1">
                            {b.title}
                          </h3>
                          <p className="text-sm text-foreground/70 leading-relaxed">
                            {b.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-6 text-foreground">
                How it works
              </h2>
              <ol className="space-y-5">
                {page.process.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-gold text-rose-gold-foreground font-display font-bold flex items-center justify-center"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                        {step.title}
                      </h3>
                      <p className="text-foreground/75 leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-5 text-foreground">
                Frequently asked questions
              </h2>
              <FAQAccordion items={page.faqs} />
            </div>

            <RelatedServices slugs={page.relatedSlugs} />
          </div>

          <aside className="lg:col-span-3 space-y-6">
            {product && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-xs uppercase tracking-wider text-accent font-semibold font-display mb-2">
                  Launch pricing — limited time
                </p>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-bold font-display text-foreground">
                    {formatPriceCAD(product.launch_price_cad)}
                  </span>
                  <span className="text-base line-through text-muted-foreground">
                    {formatPriceCAD(product.base_price_cad)}
                  </span>
                </div>
                <p className="text-sm text-foreground/70 mb-5">
                  {product.turnaround}
                </p>
                <Link href={page.ctaHref}>
                  <Button className="w-full bg-rose-gold text-rose-gold-foreground hover:bg-rose-gold-hover font-display font-bold rounded-full">
                    {ctaLabel}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
            <TrustSignals />
          </aside>
        </div>
      </section>
    </div>
  );
}
