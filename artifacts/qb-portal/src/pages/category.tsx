import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "wouter";
import { loadProducts, type Product, type ProductCatalog, formatPrice, getActivePrice, isPromoActive } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock } from "lucide-react";
import { SEO } from "@/components/seo";

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const [catalog, setCatalog] = useState<ProductCatalog | null>(null);

  useEffect(() => {
    loadProducts().then(setCatalog);
  }, []);

  const { categoryName, products } = useMemo(() => {
    if (!catalog || !slug) return { categoryName: "", products: [] };
    const match = catalog.services.find((p) => p.category_slug === slug);
    if (!match) return { categoryName: "", products: [] };
    return {
      categoryName: match.category,
      products: catalog.services
        .filter((p) => p.category_slug === slug)
        .sort((a, b) => a.sort_order - b.sort_order),
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

  return (
    <div>
      <SEO
        title={categoryName}
        description={`Browse ${products.length} QuickBooks ${categoryName.toLowerCase()} services. Professional solutions for Canadian businesses.`}
        path={`/category/${slug}`}
      />
      <section className="section-brand-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
            <Link href="/catalog" className="hover:text-white/70">Services</Link>
            <span>/</span>
            <span className="text-white/80">{categoryName}</span>
          </div>
          <h1 className="text-4xl font-bold font-display text-white mb-4">{categoryName}</h1>
          <p className="text-white/70 text-lg">
            {products.length} service{products.length !== 1 ? "s" : ""} in this category
          </p>
        </div>
      </section>

      <div className="brand-divider" />

      <section className="py-12 section-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const promo = isPromoActive();
  const activePrice = getActivePrice(product);

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-bold font-display text-primary">{product.name}</h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Available
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 flex-1">{product.description}</p>
        {product.is_addon && <p className="text-xs text-muted-foreground mb-3 italic">Add-on</p>}
        <div className="flex items-center justify-between mt-auto">
          <div>
            {promo ? (
              <>
                <span className="font-bold text-accent">{formatPrice(activePrice)}</span>
                <span className="text-xs text-muted-foreground line-through ml-2">{formatPrice(product.base_price_cad)}</span>
              </>
            ) : (
              <span className="font-bold text-accent">{formatPrice(activePrice)}</span>
            )}
            {product.turnaround && <span className="text-xs text-muted-foreground ml-2"><Clock className="w-3 h-3 inline" /> {product.turnaround}</span>}
          </div>
          <Link href={`/service/${product.slug}`}>
            <Button size="sm" className="bg-navy text-white hover:bg-navy/90 gap-1">
              Details <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
