export interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  tier: "launch" | "coming-soon";
  price_cad: number | null;
  turnaround?: string;
  description: string;
  competitor_ref: string;
  is_addon?: boolean;
  requires_service?: number | null;
  target_launch: string;
  badge: "available" | "coming-soon";
}

export interface ProductCatalog {
  services: Product[];
  tools: Product[];
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

export function getToolCategories(tools: Product[]): string[] {
  return [...new Set(tools.map((t) => t.category))];
}

export function getProductById(catalog: ProductCatalog, id: number): Product | undefined {
  return [...catalog.services, ...catalog.tools].find((p) => p.id === id);
}

export function getProductBySlug(catalog: ProductCatalog, slug: string): Product | undefined {
  return [...catalog.services, ...catalog.tools].find((p) => p.slug === slug);
}

export function formatPrice(price: number | null): string {
  if (price === null) return "Quote";
  return `$${price} CAD`;
}
