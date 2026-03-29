import { useState, useEffect } from "react";
import { Link } from "wouter";
import { loadProducts, type Product, type ProductCatalog, formatPrice, getServiceCategories, getToolCategories } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";

export default function Catalog() {
  const [catalog, setCatalog] = useState<ProductCatalog | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProducts().then(setCatalog);
  }, []);

  if (!catalog) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading catalog...</div></div>;

  const allProducts = [...catalog.services, ...catalog.tools];
  const allCategories = [...new Set(allProducts.map((p) => p.category))].sort();

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
      <section className="bg-[#1a2744] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Services & Tools Catalog</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            54 QuickBooks products and services for Canadian businesses. Browse our complete catalog below.
          </p>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#f0a500]/50"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === "all" ? "bg-[#1a2744] text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >
                All ({allProducts.length})
              </button>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === cat ? "bg-[#1a2744] text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {Object.entries(grouped).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No products match your search.</div>
          ) : (
            Object.entries(grouped).map(([category, products]) => (
              <div key={category} className="mb-12">
                <Link href={`/category/${category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`}>
                  <h2 className="text-2xl font-bold text-[#1a2744] mb-6 hover:text-[#f0a500] transition-colors cursor-pointer">{category}</h2>
                </Link>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const isAvailable = product.badge === "available";
  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-[#1a2744] text-sm leading-tight flex-1 mr-2">{product.name}</h3>
          {isAvailable ? (
            <span className="px-2 py-0.5 rounded-full bg-[#28a745]/10 text-[#28a745] text-xs font-semibold shrink-0">Available</span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-[#ff6b35]/10 text-[#ff6b35] text-xs font-semibold badge-coming-soon shrink-0">Coming Soon</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
        {product.is_addon && (
          <div className="text-xs text-muted-foreground mb-2 italic">Add-on for Core Conversion</div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-[#f0a500]">{formatPrice(product.price_cad)}</span>
            {product.turnaround && <span className="text-xs text-muted-foreground ml-2">{product.turnaround}</span>}
          </div>
          {isAvailable ? (
            <Link href={`/service/${product.slug}`}>
              <Button size="sm" className="bg-[#B76E79] hover:bg-[#A35D68] text-white text-xs">Order Now</Button>
            </Link>
          ) : (
            <Link href={`/waitlist?product=${product.slug}`}>
              <Button size="sm" variant="outline" className="text-xs text-[#ff6b35] border-[#ff6b35]/30 hover:bg-[#ff6b35]/5">Join Waitlist</Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
