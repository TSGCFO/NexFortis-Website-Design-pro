import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { loadProducts, getProductBySlug, type Product, type ProductCatalog, formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Shield, Lock, ArrowRight, Star, FileCheck } from "lucide-react";

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
          const related = [...c.services, ...c.tools]
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

  const isAvailable = product.badge === "available";
  const addons = catalog.services.filter((s) => s.is_addon && s.requires_service === product.id);

  return (
    <div>
      <section className="bg-[#1a2744] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
            <Link href="/catalog" className="hover:text-white/70">Services & Tools</Link>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="text-white/80">{product.name}</span>
          </div>
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isAvailable ? "bg-green-500/20 text-green-300" : "bg-[#f0a500]/20 text-[#f0a500]"}`}>
                  {isAvailable ? "Available Now" : "Coming Soon"}
                </span>
              </div>
              <p className="text-white/70 text-lg max-w-2xl">{product.description}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-[#f0a500]">{formatPrice(product.price_cad)}</p>
              {product.turnaround && <p className="text-white/50 text-sm mt-1"><Clock className="w-4 h-4 inline mr-1" />{product.turnaround}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-[#1a2744] mb-4">About This Service</h2>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                  {product.competitor_ref && (
                    <p className="text-sm text-muted-foreground mt-4 italic">Comparable to: {product.competitor_ref}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-[#1a2744] mb-4">What's Included</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Complete {product.name.toLowerCase()} processing</span>
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
                  </ul>
                </CardContent>
              </Card>

              {addons.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-[#1a2744] mb-4">Available Add-Ons</h2>
                    <div className="space-y-3">
                      {addons.map((addon) => (
                        <div key={addon.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                          <div>
                            <p className="font-medium text-sm">{addon.name}</p>
                            <p className="text-xs text-muted-foreground">{addon.description}</p>
                          </div>
                          <span className="font-semibold text-[#f0a500] text-sm">{formatPrice(addon.price_cad)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="border-[#f0a500]/30">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-[#f0a500] mb-2">{formatPrice(product.price_cad)}</p>
                  {product.turnaround && <p className="text-sm text-muted-foreground mb-4"><Clock className="w-4 h-4 inline mr-1" />Turnaround: {product.turnaround}</p>}
                  {isAvailable ? (
                    <Link href={`/order?service=${product.id}`}>
                      <Button className="w-full bg-[#B76E79] text-white hover:bg-[#A35D68] font-bold gap-2" size="lg">
                        Order Now <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/waitlist?product=${product.slug}`}>
                      <Button className="w-full bg-[#1a2744] font-bold" size="lg">
                        Join Waitlist
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-[#1a2744] mb-3">Trust & Security</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2"><Lock className="w-4 h-4 text-[#f0a500]" /> 256-bit encrypted transfers</li>
                    <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-[#f0a500]" /> PIPEDA compliant</li>
                    <li className="flex items-center gap-2"><FileCheck className="w-4 h-4 text-[#f0a500]" /> Files deleted after 7 days</li>
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-[#f0a500]" /> Money-back guarantee</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-[#1a2744] mb-3">Category</h3>
                  <Link href={`/category/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`} className="text-[#f0a500] hover:underline text-sm">
                    {product.category}
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-[#1a2744] mb-6">Related Services</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((rp) => (
                  <Link key={rp.id} href={`/service/${rp.slug}`}>
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm text-[#1a2744] mb-1">{rp.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{rp.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#f0a500] text-sm">{formatPrice(rp.price_cad)}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${rp.badge === "available" ? "bg-green-100 text-green-700" : "bg-[#f0a500]/10 text-[#f0a500]"}`}>
                            {rp.badge === "available" ? "Available" : "Coming Soon"}
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
