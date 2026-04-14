export interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  category_slug: string;
  description: string;
  base_price_cad: number;
  launch_price_cad: number;
  turnaround: string;
  badge: "available";
  is_addon: boolean;
  requires_service: number | null;
  accepted_file_types: string[];
  sort_order: number;
  billing_type?: "subscription";
  billing_interval?: "month";
}

export interface ProductCatalog {
  promo_active: boolean;
  promo_label: string;
  services: Product[];
}

let catalogCache: ProductCatalog | null = null;

export async function loadProducts(): Promise<ProductCatalog> {
  if (catalogCache) return catalogCache;
  const res = await fetch(`${import.meta.env.BASE_URL}products.json`);
  catalogCache = await res.json();
  return catalogCache!;
}

export function getServiceCategories(services: Product[]): string[] {
  return [...new Set(services.map((s) => s.category))];
}

export function getProductById(catalog: ProductCatalog, id: number): Product | undefined {
  return catalog.services.find((p) => p.id === id);
}

export function getProductBySlug(catalog: ProductCatalog, slug: string): Product | undefined {
  return catalog.services.find((p) => p.slug === slug);
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getActivePrice(product: Product): number {
  if (!catalogCache) return product.base_price_cad;
  return catalogCache.promo_active ? product.launch_price_cad : product.base_price_cad;
}

export function isPromoActive(): boolean {
  return catalogCache?.promo_active ?? false;
}

export function formatPriceCAD(cents: number): string {
  return `$${(cents / 100).toFixed(2)} CAD`;
}
