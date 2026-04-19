import { useState, useEffect } from "react";
import { useSearch, useLocation } from "wouter";
import { loadProducts, getProductBySlug, type Product, type ProductCatalog, formatPrice, getActivePrice } from "@/lib/products";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Bell } from "lucide-react";
import { getAccessToken } from "@/lib/auth";

export default function Waitlist() {
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(searchString);
  const productSlug = params.get("product") || "";

  const [catalog, setCatalog] = useState<ProductCatalog | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts().then((c) => {
      setCatalog(c);
      if (productSlug) {
        const p = getProductBySlug(c, productSlug);
        if (p) {
          setProduct(p);
        }
        // Unknown slug: stay on the page and show the generic waitlist form.
      }
    });
  }, [productSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!product) {
      setError("Product not found. Please try again from the catalog.");
      return;
    }
    const productId = product.id;
    const productName = product.name;

    const key = `waitlist_${email}_${productId}`;
    if (localStorage.getItem(key)) {
      setError("You're already on the waitlist for this product.");
      return;
    }

    setLoading(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/qb/waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ email, product_id: productId, product_name: productName }),
      });

      if (res.ok) {
        localStorage.setItem(key, JSON.stringify({ email, productId, productName, timestamp: new Date().toISOString() }));
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.error === "duplicate") {
          localStorage.setItem(key, "true");
          setError("You're already on the waitlist for this product.");
        } else {
          setError("Failed to join the waitlist. Please try again.");
        }
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SEO
        title="Join the Waitlist"
        description="Be the first to know when new NexFortis QuickBooks services launch."
        path="/waitlist"
      />
      <section className="section-brand-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Bell className="w-12 h-12 text-accent mx-auto mb-4" />
          <h1 className="text-4xl font-bold font-display text-white mb-4">Get Notified About New Services</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            {product ? `Be the first to know when ${product.name} launches.` : "Be the first to know when we launch new QuickBooks services and tools."}
          </p>
        </div>
      </section>

      <div className="brand-divider" />

      <section className="py-16 section-brand-light">
        <div className="max-w-md mx-auto px-4">
          {submitted ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                <h2 className="text-2xl font-bold font-display text-primary mb-2">You're on the list!</h2>
                <p className="text-muted-foreground">
                  We'll email you when <strong>{product?.name || "this product"}</strong> launches.
                </p>
                {product && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Expected price: <strong>{formatPrice(getActivePrice(product))}</strong></p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8">
                {product && (
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <h3 className="font-bold font-display text-primary">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                    <p className="text-sm font-semibold text-accent mt-2">{formatPrice(getActivePrice(product))}</p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" disabled={loading} className="w-full bg-navy text-white hover:bg-navy/90 font-display font-semibold">
                    {loading ? "Joining..." : "Join Waitlist"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">We'll only email you about new service launches. No spam.</p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
