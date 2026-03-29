import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { loadProducts, getProductBySlug, type Product, type ProductCatalog, formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Bell } from "lucide-react";
import { getAuthToken } from "@/lib/auth";

export default function Waitlist() {
  const searchString = useSearch();
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
        if (p) setProduct(p);
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
      const token = getAuthToken();
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
      <section className="bg-[#1a2744] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Bell className="w-12 h-12 text-[#f0a500] mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Join the Waitlist</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            {product ? `Be the first to know when ${product.name} launches.` : "Be the first to know when our new services launch."}
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#f5f7fa]">
        <div className="max-w-md mx-auto px-4">
          {submitted ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-[#28a745] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[#1a2744] mb-2">You're on the list!</h2>
                <p className="text-muted-foreground">
                  We'll email you when <strong>{product?.name || "this product"}</strong> launches.
                </p>
                {product && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Expected price: <strong>{formatPrice(product.price_cad)}</strong></p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8">
                {product && (
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <h3 className="font-bold text-[#1a2744]">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                    <p className="text-sm font-semibold text-[#f0a500] mt-2">{formatPrice(product.price_cad)}</p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#1a2744] mb-1">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#f0a500]/50"
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" disabled={loading} className="w-full bg-[#1a2744] hover:bg-[#1a2744]/90 font-semibold">
                    {loading ? "Joining..." : "Join Waitlist"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">We'll only email you about this product. No spam.</p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
