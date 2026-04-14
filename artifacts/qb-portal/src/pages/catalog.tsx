import { useState, useEffect } from "react";
import { Link } from "wouter";
import { loadProducts, type Product, type ProductCatalog, formatPrice, getActivePrice, isPromoActive } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import { SEO } from "@/components/seo";

export default function Catalog() {
  const [catalog, setCatalog] = useState<ProductCatalog | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProducts().then(setCatalog);
  }, []);

  if (!catalog) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading catalog...</div></div>;

  const allProducts = [...catalog.services].sort((a, b) => a.sort_order - b.sort_order);
  const allCategories = [...new Set(allProducts.map((p) => p.category))];

  const filtered = allProducts.filter((p) => {
    const matchesCategory = filter === "all" || p.category === filter;
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const grouped = filtered.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div>
      <SEO
        title="Service Catalog"
        description="Browse 20 QuickBooks services across 5 categories. Conversion, data services, platform migrations, expert support, and volume packs."
        path="/catalog"
      />
      <section className="section-brand-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold font-display text-white mb-4">Service Catalog</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            20 QuickBooks services across 5 categories for Canadian businesses. Browse our complete catalog below.
          </p>
          {isPromoActive() && catalog.promo_label && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-gold/20 text-rose-gold text-sm font-semibold">
              {catalog.promo_label}
            </div>
          )}
        </div>
      </section>

      <div className="brand-divider" />

      <section className="py-8 bg-background border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === "all" ? "bg-navy text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >
                All ({allProducts.length})
              </button>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === cat ? "bg-navy text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  {cat} ({allProducts.filter((p) => p.category === cat).length})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 section-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {Object.entries(grouped).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No services match your search.</div>
          ) : (
            Object.entries(grouped).map(([category, products]) => {
              const categorySlug = products[0]?.category_slug || category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
              return (
                <div key={category} className="mb-12">
                  <Link href={`/category/${categorySlug}`}>
                    <h2 className="text-2xl font-bold font-display text-primary mb-6 hover:text-accent transition-colors cursor-pointer">{category}</h2>
                  </Link>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const promo = isPromoActive();
  const activePrice = getActivePrice(product);
  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold font-display text-primary text-sm leading-tight flex-1 mr-2">{product.name}</h3>
          <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-semibold shrink-0">Available</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
        {product.is_addon && (
          <div className="text-xs text-muted-foreground mb-2 italic">Add-on</div>
        )}
        <div className="flex items-center justify-between">
          <div>
            {promo ? (
              <>
                <span className="font-bold text-accent">{formatPrice(activePrice)}</span>
                <span className="text-xs text-muted-foreground line-through ml-2">{formatPrice(product.base_price_cad)}</span>
              </>
            ) : (
              <span className="font-bold text-accent">{formatPrice(activePrice)}</span>
            )}
            {product.turnaround && <span className="text-xs text-muted-foreground ml-2">{product.turnaround}</span>}
          </div>
          <Link href={`/service/${product.slug}`}>
            <Button size="sm" className="bg-rose-gold hover:bg-rose-gold-hover text-white text-xs">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
