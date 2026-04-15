import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, Upload, Clock, CheckCircle, ArrowRight, Lock, DollarSign, MapPin, Zap, Award } from "lucide-react";
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

const featuredServices = [
  {
    title: "Enterprise → Premier/Pro Standard",
    price: "From $75.00 CAD",
    originalPrice: "$149.00",
    desc: "Convert your QuickBooks Enterprise file to Premier or Pro. Under 60 minutes. Penny-perfect accuracy.",
    badge: "Most Popular",
    href: "/service/enterprise-to-premier-standard",
  },
  {
    title: "Audit Trail + CRA Period Copy Bundle",
    price: "$75.00 CAD",
    originalPrice: "$149.00",
    desc: "Our most popular bundle: audit trail removal plus CRA period copy. Save vs. buying separately.",
    badge: "Best Value",
    href: "/service/audit-trail-cra-bundle",
  },
  {
    title: "5-Pack Conversions",
    price: "$325.00 CAD",
    originalPrice: "$649.00",
    desc: "Bundle of 5 standard conversions for accountants and bookkeepers. $65/conversion. Valid 12 months.",
    badge: "For Accountants",
    href: "/service/5-pack-conversions",
  },
  {
    title: "Guaranteed 30-Minute Conversion",
    price: "$125.00 CAD",
    originalPrice: "$249.00",
    desc: "Priority processing with a guaranteed 30-minute turnaround. Full refund if we exceed 30 minutes.",
    badge: "Fastest",
    href: "/service/guaranteed-30-minute",
  },
  {
    title: "QB Expert Support — Professional",
    price: "$50.00/mo CAD",
    originalPrice: "$99.00/mo",
    desc: "8 tickets/month, 1-hour response time, data integrity analysis, 10% discount on all services.",
    badge: "Recommended",
    href: "/service/expert-support-professional",
  },
  {
    title: "Sage 50 → QuickBooks Migration",
    price: "$125.00 CAD",
    originalPrice: "$249.00",
    desc: "Migrate your Sage 50 or Simply Accounting data to QuickBooks Desktop. Full data transfer.",
    badge: "New Service",
    href: "/service/sage50-to-quickbooks",
  },
];

export default function Home() {
  const [catalog, setCatalog] = useState<ProductCatalog | null>(null);
  const promo = catalog?.promo_active ?? false;
  const steps = getSteps(catalog);

  useEffect(() => {
    loadProducts().then(setCatalog);
  }, []);

  const flagshipProduct = catalog ? getProductBySlug(catalog, "enterprise-to-premier-standard") : undefined;
  const regPriceFormatted = flagshipProduct ? formatPriceCAD(flagshipProduct.base_price_cad) : "$149.00 CAD";

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
        description="Canadian QuickBooks experts. Enterprise to Premier conversion, data services, and expert support. Starting at $75 CAD with our launch special."
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
            {promo ? (
              <>Starting at <span className="text-azure font-bold">{lowestPriceFormatted}</span> with our launch special <span className="text-white/50 text-base line-through">(reg. {regPriceFormatted})</span></>

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
            <table className="w-full bg-card rounded-xl shadow-sm border border-border overflow-hidden">
              <thead>
                <tr className="section-brand-navy">
                  <th className="px-4 py-3 text-left text-sm font-display font-semibold">Feature</th>
                  <th className="px-4 py-3 text-center text-sm font-display font-semibold bg-accent text-white">NexFortis</th>
                  <th className="px-4 py-3 text-center text-sm font-display font-semibold text-white">Big Red Consulting</th>
                  <th className="px-4 py-3 text-center text-sm font-display font-semibold text-white">E-Tech</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-card" : "bg-muted/50"}>
                    <td className="px-4 py-3 text-sm font-medium text-primary">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-center font-semibold text-success bg-success/5">{row.nexfortis}</td>
                    <td className="px-4 py-3 text-sm text-center text-muted-foreground">{row.bigred}</td>
                    <td className="px-4 py-3 text-sm text-center text-muted-foreground">{row.etech}</td>
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
            {featuredServices.map((svc, i) => (
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
