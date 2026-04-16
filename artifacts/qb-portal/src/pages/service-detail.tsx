import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { loadProducts, getProductBySlug, type Product, type ProductCatalog, formatPriceCAD, getActivePrice, isPromoActive } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Shield, Lock, ArrowRight, Star, FileCheck, BookOpen } from "lucide-react";
import { SEO } from "@/components/seo";
import { getServiceLandingLinks } from "@/data/serviceLandingLinks";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [catalog, setCatalog] = useState<ProductCatalog | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts().then((c) => {
      setCatalog(c);
      if (slug) {
        const p = getProductBySlug(c, slug);
        if (p) {
          setProduct(p);
          const related = c.services
            .filter((r) => r.category === p.category && r.id !== p.id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      }
    });
  }, [slug]);

  if (!catalog || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{catalog ? "Service not found." : "Loading..."}</p>
          {catalog && (
            <Link href="/catalog">
              <Button variant="outline">Browse All Services</Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  const promo = isPromoActive();
  const activePrice = getActivePrice(product);
  const addons = catalog.services.filter((s) => s.is_addon && product.category_slug === "quickbooks-conversion" && !product.is_addon);
  const isSubscription = product.billing_type === "subscription";
  const priceSuffix = isSubscription ? "/mo" : "";

  return (
    <div>
      <SEO
        title={product.name}
        description={product.description}
        path={`/service/${product.slug}`}
      />
      <section className="section-brand-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
            <Link href="/catalog" className="hover:text-white/70">Services</Link>
            <span>/</span>
            <Link href={`/category/${product.category_slug}`} className="hover:text-white/70">{product.category}</Link>
            <span>/</span>
            <span className="text-white/80">{product.name}</span>
          </div>
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-bold font-display text-white">{product.name}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                  Available Now
                </span>
              </div>
              {promo && catalog?.promo_label && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-gold/10 text-rose-gold text-sm font-semibold mb-3">
                  {catalog.promo_label}
                </span>
              )}
              <p className="text-white/70 text-lg max-w-2xl">{product.description}</p>
            </div>
            <div className="text-right">
              {promo ? (
                <>
                  <p className="text-3xl font-bold text-accent">{formatPriceCAD(activePrice)}{priceSuffix}</p>
                  <p className="text-white/50 text-sm line-through">{formatPriceCAD(product.base_price_cad)}{priceSuffix}</p>
                </>
              ) : (
                <p className="text-3xl font-bold text-accent">{formatPriceCAD(activePrice)}{priceSuffix}</p>
              )}
              {isSubscription && promo && (
                <p className="text-xs text-white/50 mt-2">
                  Launch rate for first 3 months, then {formatPriceCAD(product.base_price_cad)}/mo.
                </p>
              )}
              {product.turnaround && <p className="text-white/50 text-sm mt-1"><Clock className="w-4 h-4 inline mr-1" />{product.turnaround}</p>}
              {product.pack_size && (
                <div className="mt-3 px-4 py-2 rounded-lg bg-accent/10 text-accent text-sm font-medium">
                  {`That's just ${formatPriceCAD(Math.round(getActivePrice(product) / product.pack_size))}/conversion`}
                  {product.pack_size === 10 && " — includes Guaranteed 30-Minute turnaround on all conversions"}
                </div>
              )}
              <div className="flex flex-wrap gap-3 mt-4 text-xs text-white/50">
                <span className="flex items-center gap-1">✓ Money-Back Guarantee</span>
                <span className="flex items-center gap-1">✓ All Prices CAD</span>
                <span className="flex items-center gap-1">✓ GST/HST added at checkout</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="brand-divider" />

      <section className="py-12 section-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold font-display text-primary mb-4">About This Service</h2>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold font-display text-primary mb-4">What's Included</h2>
                  <ul className="space-y-3">
                    {isSubscription ? (
                      <>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{product.description}</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">1–2 hour response time during business hours</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Cancel anytime — no long-term commitment</span>
                        </li>
                      </>
                    ) : product.category_slug === "volume-packs" ? (
                      <>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{product.description}</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Credits valid for 12 months</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Use credits for any standard Enterprise → Premier/Pro conversion</span>
                        </li>
                        {product.pack_size === 10 && (
                          <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm font-semibold">Includes Guaranteed 30-Minute turnaround on all 10 conversions</span>
                          </li>
                        )}
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{product.description}</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Penny-perfect accuracy verification</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Secure file handling (256-bit encrypted, deleted after 7 days)</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Email confirmation and delivery notification</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Money-back guarantee if unsatisfied</span>
                        </li>
                      </>
                    )}
                  </ul>
                </CardContent>
              </Card>

              {addons.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold font-display text-primary mb-4">Available Add-Ons</h2>
                    <div className="space-y-3">
                      {addons.map((addon) => (
                        <div key={addon.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                          <div>
                            <p className="font-medium text-sm">{addon.name}</p>
                            <p className="text-xs text-muted-foreground">{addon.description}</p>
                          </div>
                          <span className="font-semibold text-accent text-sm">{formatPriceCAD(getActivePrice(addon))}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="border-accent/30">
                <CardContent className="p-6 text-center">
                  {promo ? (
                    <>
                      <p className="text-3xl font-bold text-accent mb-1">{formatPriceCAD(activePrice)}{priceSuffix}</p>
                      <p className="text-sm text-muted-foreground line-through mb-2">{formatPriceCAD(product.base_price_cad)}{priceSuffix}</p>
                      {catalog.promo_label && (
                        <p className="text-xs text-rose-gold font-semibold mb-2">{catalog.promo_label}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-3xl font-bold text-accent mb-2">{formatPriceCAD(activePrice)}{priceSuffix}</p>
                  )}
                  {isSubscription && promo && (
                    <p className="text-xs text-muted-foreground mb-2">
                      Launch rate for first 3 months, then {formatPriceCAD(product.base_price_cad)}/mo.
                    </p>
                  )}
                  {product.turnaround && <p className="text-sm text-muted-foreground mb-4"><Clock className="w-4 h-4 inline mr-1" />Turnaround: {product.turnaround}</p>}
                  <Link href={`/order?service=${product.id}`}>
                    <Button className="w-full bg-rose-gold text-rose-gold-foreground hover:bg-rose-gold-hover font-display font-bold gap-2" size="lg">
                      Order Now <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold font-display text-primary mb-3">Trust & Security</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2"><Lock className="w-4 h-4 text-accent" /> 256-bit encrypted transfers</li>
                    <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-accent" /> PIPEDA compliant</li>
                    <li className="flex items-center gap-2"><FileCheck className="w-4 h-4 text-accent" /> Files deleted after 7 days</li>
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-accent" /> Money-back guarantee</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold font-display text-primary mb-3">Category</h3>
                  <Link href={`/category/${product.category_slug}`} className="text-accent hover:underline text-sm">
                    {product.category}
                  </Link>
                </CardContent>
              </Card>

              {(() => {
                const landingLinks = getServiceLandingLinks(product.slug);
                if (landingLinks.length === 0) return null;
                return (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-bold font-display text-primary mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-accent" /> Learn More
                      </h3>
                      <ul className="space-y-3 text-sm">
                        {landingLinks.map((link) => (
                          <li key={link.slug} className="leading-snug">
                            <Link
                              href={`/landing/${link.slug}`}
                              className="text-accent hover:underline"
                            >
                              {link.anchor}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold font-display text-primary mb-6">Related Services</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((rp) => (
                  <Link key={rp.id} href={`/service/${rp.slug}`}>
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm font-display text-primary mb-1">{rp.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{rp.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            {rp.billing_type === "subscription" ? (
                              promo ? (
                                <>
                                  <span className="font-bold text-accent text-sm">{formatPriceCAD(getActivePrice(rp))}/mo</span>
                                  <span className="text-xs text-muted-foreground line-through ml-2">{formatPriceCAD(rp.base_price_cad)}/mo</span>
                                </>
                              ) : (
                                <span className="font-bold text-accent text-sm">{formatPriceCAD(getActivePrice(rp))}/mo</span>
                              )
                            ) : promo ? (
                              <>
                                <span className="font-bold text-accent text-sm">{formatPriceCAD(getActivePrice(rp))}</span>
                                <span className="text-xs text-muted-foreground line-through ml-2">{formatPriceCAD(rp.base_price_cad)}</span>
                              </>
                            ) : (
                              <span className="font-bold text-accent text-sm">{formatPriceCAD(getActivePrice(rp))}</span>
                            )}
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Available
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
