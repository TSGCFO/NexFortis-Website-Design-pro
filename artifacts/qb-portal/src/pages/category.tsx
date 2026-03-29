import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "wouter";
import { loadProducts, type Product, type ProductCatalog, formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock } from "lucide-react";

function slugifyCategory(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
}

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const [catalog, setCatalog] = useState<ProductCatalog | null>(null);

  useEffect(() => {
    loadProducts().then(setCatalog);
  }, []);

  const { categoryName, products } = useMemo(() => {
    if (!catalog || !slug) return { categoryName: "", products: [] };
    const allProducts = [...catalog.services, ...catalog.tools];
    const categories = [...new Set(allProducts.map((p) => p.category))];
    const match = categories.find((c) => slugifyCategory(c) === slug);
    if (!match) return { categoryName: "", products: [] };
    return {
      categoryName: match,
      products: allProducts.filter((p) => p.category === match),
    };
  }, [catalog, slug]);

  if (!catalog) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  }

  if (!categoryName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Category not found.</p>
          <Link href="/catalog"><Button variant="outline">Browse All Services</Button></Link>
        </div>
      </div>
    );
  }

  const availableProducts = products.filter((p) => p.badge === "available");
  const comingSoonProducts = products.filter((p) => p.badge === "coming-soon");

  return (
    <div>
      <section className="bg-[#1a2744] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
            <Link href="/catalog" className="hover:text-white/70">Services & Tools</Link>
            <span>/</span>
            <span className="text-white/80">{categoryName}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{categoryName}</h1>
          <p className="text-white/70 text-lg">
            {products.length} product{products.length !== 1 ? "s" : ""} in this category
            {availableProducts.length > 0 && ` — ${availableProducts.length} available now`}
          </p>
        </div>
      </section>

      <section className="py-12 bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {availableProducts.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-[#1a2744] mb-4">Available Now</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {comingSoonProducts.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-[#1a2744] mb-4">Coming Soon</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {comingSoonProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const isAvailable = product.badge === "available";

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-bold text-[#1a2744]">{product.name}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${isAvailable ? "bg-green-100 text-green-700" : "bg-[#f0a500]/10 text-[#f0a500]"}`}>
            {isAvailable ? "Available" : "Coming Soon"}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 flex-1">{product.description}</p>
        {product.is_addon && <p className="text-xs text-muted-foreground mb-3 italic">Add-on for Core Conversion</p>}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="font-bold text-[#f0a500]">{formatPrice(product.price_cad)}</span>
            {product.turnaround && <span className="text-xs text-muted-foreground ml-2"><Clock className="w-3 h-3 inline" /> {product.turnaround}</span>}
          </div>
          {isAvailable ? (
            <Link href={`/service/${product.slug}`}>
              <Button size="sm" className="bg-[#1a2744] gap-1">
                Details <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          ) : (
            <Link href={`/waitlist?product=${product.slug}`}>
              <Button size="sm" variant="outline">Join Waitlist</Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
