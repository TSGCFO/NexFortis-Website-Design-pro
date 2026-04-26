import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, Upload, Clock, CheckCircle, ArrowRight, Lock, DollarSign, MapPin, Zap, Award, Headphones, BookOpen } from "lucide-react";
import { formatPriceCAD, getActivePrice, getProductBySlug, loadProducts, type ProductCatalog } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/seo";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
};

// Surface six high-value QuickBooks landing pages directly from the home
// page (audit issue C3 — these were 4 clicks deep before, which suppressed
// crawl frequency). Each anchor must be unique and keyword-rich (no generic
// "Read more" / "Learn more" — INV-015 anchor uniqueness, INV-017 generic
// anchors). Rendered server-side / pre-rendered in the noscript shell as
// well so search engines see the links even before React hydrates.
const commonScenarios = [
  {
    href: "/landing/accountedge-to-quickbooks",
    text: "AccountEdge to QuickBooks migration: full guide",
    desc: "Move your AccountEdge (formerly MYOB) company file into QuickBooks Desktop with transaction history and GST/HST intact.",
  },
  {
    href: "/landing/quickbooks-company-file-error",
    text: "Repair a QuickBooks company file error",
    desc: "Diagnose and recover from H-series and 6000-series QuickBooks company file errors that block CRA prep.",
  },
  {
    href: "/landing/multi-currency-removal",
    text: "Remove QuickBooks multi-currency from your file",
    desc: "Turn off multi-currency at the file level after an accidental enable — the only path Intuit does not provide in-product.",
  },
  {
    href: "/landing/quickbooks-multi-currency-problems",
    text: "Fix common QuickBooks multi-currency problems",
    desc: "Common multi-currency report and data-entry issues, and how NexFortis cleans them up without losing balances.",
  },
  {
    href: "/landing/list-reduction",
    text: "Reduce bloated QuickBooks lists",
    desc: "Get back under QuickBooks list limits by merging duplicates and inactivating unused names — without breaking reports.",
  },
  {
    href: "/landing/is-it-safe",
    text: "How we keep your QuickBooks data safe",
    desc: "Encryption in transit, 7-day retention, and PIPEDA-compliant handling of your QuickBooks company file.",
  },
];

const trustBadges = [
  { icon: MapPin, label: "Canadian-First" },
  { icon: Lock, label: "256-bit Encrypted" },
  { icon: CheckCircle, label: "Penny-Perfect Accuracy" },
  { icon: Clock, label: "Under 1 Hour" },
];

function getSteps(catalog: ProductCatalog | null) {
  let priceSuffix = "";
  if (catalog) {
    const flagship = getProductBySlug(catalog, "enterprise-to-premier-standard");
    if (flagship) {
      priceSuffix = ` Starting at ${formatPriceCAD(getActivePrice(flagship))}.`;
    }
  }
  return [
    { num: "1", icon: Upload, title: "Create & Upload Your QBM", desc: "Export your Enterprise file as a Portable Company File (.QBM) and upload it securely." },
    { num: "2", icon: DollarSign, title: "Choose Services & Pay", desc: `Select your conversion and any add-ons. Pay securely with Stripe.${priceSuffix}` },
    { num: "3", icon: Zap, title: "Receive Your Converted File", desc: "Get your converted Premier/Pro file delivered in under 1 hour with a validation report." },
  ];
}

function getComparisonData(lowestPriceFormatted: string, rushPriceFormatted: string) {
  return [
    { feature: "Price", nexfortis: `From ${lowestPriceFormatted}`, bigred: "$249 USD (~$344 CAD)", etech: "$299 USD (~$413 CAD)" },
    { feature: "Turnaround", nexfortis: "Under 1 hour", bigred: "Next business day", etech: "1 business day" },
    { feature: "Same-day rush", nexfortis: `Included option (+${rushPriceFormatted})`, bigred: "Not stated", etech: "$450 USD (~$621 CAD)" },
    { feature: "Canadian-first", nexfortis: "Yes", bigred: "No", etech: "Implied" },
    { feature: "GST/HST preserved", nexfortis: "Yes", bigred: "Unknown", etech: "Yes" },
    { feature: "Total services", nexfortis: "20", bigred: "28", etech: "7" },
  ];
}

const featuredServiceDefs = [
  {
    slug: "enterprise-to-premier-standard",
    title: "Enterprise → Premier/Pro Standard",
    desc: "Convert your QuickBooks Enterprise file to Premier or Pro. Under 60 minutes. Penny-perfect accuracy.",
    badge: "Most Popular",
    href: "/service/enterprise-to-premier-standard",
    prefix: "From ",
  },
  {
    slug: "audit-trail-cra-bundle",
    title: "Audit Trail + CRA Period Copy Bundle",
    desc: "Our most popular bundle: audit trail removal plus CRA period copy. Save vs. buying separately.",
    badge: "Best Value",
    href: "/service/audit-trail-cra-bundle",
  },
  {
    slug: "5-pack-conversions",
    title: "5-Pack Conversions",
    desc: "Bundle of 5 standard conversions for accountants and bookkeepers. $65/conversion. Valid 12 months.",
    badge: "For Accountants",
    href: "/service/5-pack-conversions",
  },
  {
    slug: "guaranteed-30-minute",
    title: "Guaranteed 30-Minute Conversion",
    desc: "Priority processing with a guaranteed 30-minute turnaround. Full refund if we exceed 30 minutes.",
    badge: "Fastest",
    href: "/service/guaranteed-30-minute",
  },
  {
    slug: "sage50-to-quickbooks",
    title: "Sage 50 → QuickBooks Migration",
    desc: "Migrate your Sage 50 or Simply Accounting data to QuickBooks Desktop. Full data transfer.",
    badge: "New Service",
    href: "/service/sage50-to-quickbooks",
  },
];

export default function Home() {
  const [catalog, setCatalog] = useState<ProductCatalog | null>(null);
  const promo = catalog?.promo_active ?? false;
  const steps = getSteps(catalog);

  const featuredServices = useMemo(() => {
    if (!catalog) return null;
    return featuredServiceDefs.map((def) => {
      const product = getProductBySlug(catalog, def.slug);
      if (!product) {
        console.warn(`Featured service slug "${def.slug}" not found in catalog`);
        return null;
      }
      const suffix = product.billing_type === "subscription" ? "/mo" : "";
      const activePrice = getActivePrice(product);
      const prefix = "prefix" in def && def.prefix ? def.prefix : "";
      return {
        ...def,
        price: `${prefix}${formatPriceCAD(activePrice)}${suffix}`,
        originalPrice: `${formatPriceCAD(product.base_price_cad)}${suffix}`,
      };
    }).filter(Boolean) as Array<typeof featuredServiceDefs[number] & { price: string; originalPrice: string }>;
  }, [catalog]);

  useEffect(() => {
    loadProducts().then(setCatalog);
  }, []);

  const flagshipProduct = catalog ? getProductBySlug(catalog, "enterprise-to-premier-standard") : undefined;
  const regPriceFormatted = flagshipProduct ? formatPriceCAD(flagshipProduct.base_price_cad) : formatPriceCAD(14900);

  const nonAddonPrices = catalog
    ? catalog.services.filter((s) => !s.is_addon).map((s) => getActivePrice(s))
    : [];
  const lowestPrice = nonAddonPrices.length > 0
    ? Math.min(...nonAddonPrices)
    : promo ? 7500 : 14900;
  const lowestPriceFormatted = formatPriceCAD(lowestPrice);

  const rushProduct = catalog ? getProductBySlug(catalog, "rush-delivery") : undefined;
  const rushPriceCents = rushProduct ? getActivePrice(rushProduct) : 4900;
  const comparisonData = getComparisonData(lowestPriceFormatted, formatPriceCAD(rushPriceCents));

  return (
    <div>
      <SEO
        title="QuickBooks Conversion & Data Services"
        description="Canadian QuickBooks experts. Enterprise to Premier conversion, data services, and platform migrations. Starting at $75 CAD with our launch special."
        path="/"
      />
      <section className="section-brand-navy py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-azure text-sm font-semibold mb-6">
              <Shield className="w-4 h-4" />
              Canadian QuickBooks Experts
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white font-display tracking-tight"
          >
            QuickBooks Conversion &<br className="hidden md:block" /> Data Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/80 mb-4 max-w-2xl mx-auto"
          >
            {!catalog ? (
              <span className="inline-flex items-center gap-2">Starting at <span className="inline-block h-6 w-36 animate-pulse bg-muted rounded" /></span>
            ) : promo && flagshipProduct ? (
              <>Starting at <span className="text-azure font-bold">{formatPriceCAD(getActivePrice(flagshipProduct))}</span> with our launch special <span className="text-white/50 text-base line-through">(reg. {regPriceFormatted})</span></>
            ) : flagshipProduct ? (
              <>Starting at <span className="text-azure font-bold">{formatPriceCAD(getActivePrice(flagshipProduct))}</span></>
            ) : (
              <>Starting at <span className="text-azure font-bold">{lowestPriceFormatted}</span></>
            )}
          </motion.p>
          {promo && catalog?.promo_label && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mb-4"
            >
              <div className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-gold/20 text-rose-gold text-sm font-bold">
                {catalog.promo_label}
              </div>
            </motion.div>
          )}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-white/70 mb-10 max-w-2xl mx-auto"
          >
            Canadian-first. Under 1 hour. 20 services across 5 categories. Convert your QuickBooks Enterprise files to Premier/Pro with penny-perfect accuracy.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/order">
              <Button size="lg" className="bg-rose-gold text-rose-gold-foreground hover:bg-rose-gold-hover font-display font-bold text-lg px-8 gap-2 rounded-full">
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/catalog">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-display font-medium text-lg px-8 rounded-full">
                View All Services
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 text-sm text-white/70">
                <badge.icon className="w-4 h-4 text-azure" />
                {badge.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="brand-divider" />

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display tracking-tight text-primary mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Three simple steps to convert your QuickBooks Enterprise file</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="text-sm font-bold text-accent mb-2 font-display">Step {step.num}</div>
                <h3 className="text-lg font-bold font-display text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 section-brand-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display tracking-tight text-primary mb-4">Why NexFortis?</h2>
            <p className="text-muted-foreground">See how we compare to the competition</p>
          </motion.div>
          <motion.div {...fadeInUp} className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-border overflow-hidden">
              <thead>
                <tr className="section-brand-navy">
                  <th className="px-4 py-3 text-left text-sm font-display font-semibold text-white">Feature</th>
                  <th className="px-4 py-3 text-center text-sm font-display font-semibold bg-accent text-white">NexFortis</th>
                  <th className="px-4 py-3 text-center text-sm font-display font-semibold text-white">Big Red Consulting</th>
                  <th className="px-4 py-3 text-center text-sm font-display font-semibold text-white">E-Tech</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800/50"}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-center font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20">{row.nexfortis}</td>
                    <td className="px-4 py-3 text-sm text-center text-slate-500 dark:text-slate-400">{row.bigred}</td>
                    <td className="px-4 py-3 text-sm text-center text-slate-500 dark:text-slate-400">{row.etech}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            All NexFortis prices in CAD. Competitor prices shown in CAD equivalent at ~1.38 USD/CAD exchange rate.
            GST/HST will be added at checkout.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display tracking-tight text-primary mb-4">Featured Services</h2>
            <p className="text-muted-foreground">Our most popular QuickBooks solutions</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices ? featuredServices.map((svc, i) => (
              <motion.div
                key={svc.title}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow border-border h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold font-display text-primary">{svc.title}</h3>
                      {svc.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-gold/10 text-rose-gold text-xs font-semibold">
                          {svc.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{svc.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-accent">{promo ? svc.price : svc.originalPrice || svc.price}</span>
                        {promo && svc.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">{svc.originalPrice}</span>
                        )}
                      </div>
                      <Link href={svc.href}>
                        <Button size="sm" className="bg-rose-gold hover:bg-rose-gold-hover text-white">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )) : Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card className="border-border h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-5 bg-muted rounded-full w-16" />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-muted rounded w-28" />
                      <div className="h-8 bg-muted rounded w-24" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          <motion.div {...fadeInUp} className="text-center mt-8">
            <Link href="/catalog">
              <Button variant="outline" className="gap-2 font-display">
                View All 20 Services <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16 section-brand-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <h2 className="text-3xl font-bold font-display tracking-tight text-primary mb-4">Need Expert QuickBooks Support?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Priority support from Canadian QuickBooks experts with guaranteed response times.</p>
            <p className="text-sm text-muted-foreground mt-4 mb-2">Every paid order includes basic support — 2 tickets within 30 days of delivery.</p>
          </motion.div>
          <motion.div {...fadeInUp} className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                  <Headphones className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold font-display text-primary mb-1">Essentials</h3>
                <p className="text-2xl font-bold text-accent mb-1">$25<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground">3 tickets, 1-hr SLA</p>
              </CardContent>
            </Card>
            <Card className="text-center border-accent ring-2 ring-accent/20">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
                  <Headphones className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold font-display text-primary mb-1">Professional</h3>
                <p className="text-2xl font-bold text-accent mb-1">$50<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground">8 tickets, 10% discount</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-3">
                  <Headphones className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-bold font-display text-primary mb-1">Premium</h3>
                <p className="text-2xl font-bold text-accent mb-1">$75<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground">Unlimited, 30-min SLA</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div {...fadeInUp} className="text-center">
            <Link href="/subscription">
              <Button className="bg-rose-gold text-rose-gold-foreground hover:bg-rose-gold-hover font-display font-bold gap-2 rounded-full px-8" aria-label="View all support plans">
                View All Plans <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display tracking-tight text-primary mb-4">Common QuickBooks Scenarios</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              In-depth guides for the QuickBooks problems we see most often. Pick the scenario that matches yours.
            </p>
          </motion.div>
          <motion.ul
            {...fadeInUp}
            className="grid md:grid-cols-2 gap-4 list-none p-0"
            aria-label="Common QuickBooks scenarios"
          >
            {commonScenarios.map((s) => (
              <li key={s.href}>
                <Link href={s.href}>
                  <a className="block h-full p-5 rounded-lg border border-border bg-white dark:bg-slate-900 hover:border-accent hover:shadow-md transition-all group">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-md bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold font-display text-primary group-hover:text-accent transition-colors mb-1">
                          {s.text}
                        </h3>
                        <p className="text-sm text-muted-foreground">{s.desc}</p>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      <section className="py-16 section-brand-navy">
        <motion.div {...fadeInUp} className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Lock className="w-4 h-4 text-azure" />
              <span>Files encrypted in transit</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Shield className="w-4 h-4 text-azure" />
              <span>PIPEDA compliant</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Award className="w-4 h-4 text-azure" />
              <span>Files deleted within 7 days</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold font-display text-white mb-4">Ready to Convert Your QuickBooks File?</h2>
          <p className="text-white/70 mb-8">Get started in minutes. Your converted file will be delivered in under 1 hour.</p>
          <Link href="/order">
            <Button size="lg" className="bg-rose-gold text-rose-gold-foreground hover:bg-rose-gold-hover font-display font-bold text-lg px-8 gap-2 rounded-full">
              Start Your Conversion <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
