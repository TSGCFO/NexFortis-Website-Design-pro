import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { LandingPageLayout } from "@/components/landing-page-layout";
import { getLandingPageBySlug } from "@/data/landingPages";
import { loadProducts, type ProductCatalog } from "@/lib/products";
import NotFound from "@/pages/not-found";

export default function LandingPage() {
  const [, params] = useRoute<{ slug: string }>("/landing/:slug");
  const slug = params?.slug;
  const page = slug ? getLandingPageBySlug(slug) : undefined;

  const [catalog, setCatalog] = useState<ProductCatalog | null>(null);

  useEffect(() => {
    let mounted = true;
    loadProducts()
      .then((c) => {
        if (mounted) setCatalog(c);
      })
      .catch(() => {
        if (mounted) setCatalog(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!page) return <NotFound />;

  return <LandingPageLayout page={page} catalog={catalog} />;
}
