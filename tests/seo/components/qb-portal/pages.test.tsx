/**
 * Component-level SEO tests for qb-portal (artifacts/qb-portal/src/pages/).
 *
 * For each crawlable page, asserts three things:
 *   1. <title> is non-empty
 *   2. <link rel="canonical"> exists with href starting https://qb.nexfortis.com/
 *   3. <meta name="description"> is non-empty
 *
 * Pages excluded:
 *   - portal (requires auth context, redirects to /login)
 *   - auth pages: login, register, forgot-password, reset-password, auth-callback
 *   - admin pages
 *   - order*, subscription*, ticket-detail, order-complete (post-login)
 *   - not-found
 */
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, act } from "@testing-library/react";
import { Router, Route } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { HelmetProvider } from "react-helmet-async";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Mock @/lib/supabase FIRST so the module can be imported without real env vars.
// supabase.ts throws synchronously if VITE_SUPABASE_URL is absent.
// ---------------------------------------------------------------------------
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    },
  },
}));

// Mock auth.tsx so pages using useAuth don't need AuthProvider
vi.mock("@/lib/auth", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: () => ({
    user: null,
    session: null,
    loading: false,
    isOperator: false,
    signUp: vi.fn(),
    signIn: vi.fn(),
    signInWithGoogle: vi.fn(),
    signInWithMicrosoft: vi.fn(),
    signOut: vi.fn(),
    resetPassword: vi.fn(),
    getAccessToken: vi.fn().mockResolvedValue(null),
  }),
  getAccessToken: vi.fn().mockResolvedValue(null),
}));

// ---------------------------------------------------------------------------
// Mock fetch for loadProducts().
// Pages like catalog/category/service-detail/home call loadProducts() which
// hits `${BASE_URL}products.json`. We intercept all fetch calls globally.
// ---------------------------------------------------------------------------
const MOCK_CATALOG = {
  promo_active: false,
  promo_label: "",
  services: [
    {
      id: 1,
      slug: "enterprise-to-premier-standard",
      name: "Enterprise to Premier (Standard)",
      category: "QuickBooks Conversion",
      category_slug: "quickbooks-conversion",
      description: "Convert your QuickBooks Enterprise file to Premier.",
      deliverable: "Converted .QBW file",
      base_price_cad: 14900,
      launch_price_cad: 7500,
      turnaround: "< 1 hour",
      badge: "available" as const,
      is_addon: false,
      requires_service: null,
      accepted_file_types: [".qbm"],
      sort_order: 1,
    },
    {
      id: 2,
      slug: "rush-delivery",
      name: "Rush Delivery",
      category: "QuickBooks Conversion",
      category_slug: "quickbooks-conversion",
      description: "Priority processing for your order.",
      deliverable: "Priority processing",
      base_price_cad: 4900,
      launch_price_cad: 2500,
      turnaround: "< 15 min",
      badge: "available" as const,
      is_addon: true,
      requires_service: 1,
      accepted_file_types: [],
      sort_order: 2,
    },
  ],
};

global.fetch = vi.fn(async (url: RequestInfo | URL) => {
  const urlStr = String(url);
  if (urlStr.includes("products.json")) {
    return {
      ok: true,
      json: async () => MOCK_CATALOG,
    } as Response;
  }
  // promo-status override endpoint
  if (urlStr.includes("promo-status")) {
    return { ok: false } as Response;
  }
  // fallback
  return { ok: false, json: async () => ({}) } as Response;
}) as unknown as typeof fetch;

// ---------------------------------------------------------------------------
// Page imports
// ---------------------------------------------------------------------------
import FAQ from "@/pages/faq";
import Home from "@/pages/home";
import Privacy from "@/pages/privacy";
import QbmGuide from "@/pages/qbm-guide";
import Terms from "@/pages/terms";
import Catalog from "@/pages/catalog";
import Category from "@/pages/category";
import ServiceDetail from "@/pages/service-detail";
import LandingPage from "@/pages/landing";
import Waitlist from "@/pages/waitlist";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderAt(path: string, node: ReactNode) {
  const { hook } = memoryLocation({ path });
  render(
    <HelmetProvider>
      <Router hook={hook}>{node}</Router>
    </HelmetProvider>,
  );
}

const QB_CANON = "https://qb.nexfortis.com";

function expectSeoTags(canonicalPrefix: string = QB_CANON) {
  const title = document.head.querySelector("title")?.textContent ?? "";
  expect(title.length, "title should be non-empty").toBeGreaterThan(0);

  const link = document.head.querySelector('link[rel="canonical"]');
  expect(link, "canonical link should exist").not.toBeNull();
  expect(link?.getAttribute("href")).toMatch(
    new RegExp(`^${canonicalPrefix.replace(/\//g, "\\/")}`)
  );

  const desc =
    document.head.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
  expect(desc.length, "description should be non-empty").toBeGreaterThan(0);
}

// ---------------------------------------------------------------------------
// Reset head between tests; also reset catalog cache inside products module
// ---------------------------------------------------------------------------

beforeEach(() => {
  document.head.innerHTML = "";
  // Clear vitest mock call tracking
  vi.clearAllMocks();
  // Re-establish fetch mock after clearAllMocks
  global.fetch = vi.fn(async (url: RequestInfo | URL) => {
    const urlStr = String(url);
    if (urlStr.includes("products.json")) {
      return { ok: true, json: async () => MOCK_CATALOG } as Response;
    }
    if (urlStr.includes("promo-status")) {
      return { ok: false } as Response;
    }
    return { ok: false, json: async () => ({}) } as Response;
  }) as unknown as typeof fetch;
});

// ---------------------------------------------------------------------------
// Tests — static pages (SEO rendered synchronously)
// ---------------------------------------------------------------------------

describe("qb-portal: FAQ page", () => {
  test("emits SEO tags", () => {
    renderAt("/faq", <FAQ />);
    expectSeoTags(QB_CANON);
  });
});

describe("qb-portal: Home page", () => {
  test("emits SEO tags", () => {
    // Home renders SEO unconditionally before the async catalog load
    renderAt("/", <Home />);
    expectSeoTags(QB_CANON);
  });
});

describe("qb-portal: Privacy page", () => {
  test("emits SEO tags", () => {
    renderAt("/privacy", <Privacy />);
    expectSeoTags(QB_CANON);
  });
});

describe("qb-portal: QBM Guide page", () => {
  test("emits SEO tags", () => {
    renderAt("/qbm-guide", <QbmGuide />);
    expectSeoTags(QB_CANON);
  });
});

describe("qb-portal: Terms page", () => {
  test("emits SEO tags", () => {
    renderAt("/terms", <Terms />);
    expectSeoTags(QB_CANON);
  });
});

// ---------------------------------------------------------------------------
// Tests — async catalog pages (loadProducts() fetch mock needed)
// ---------------------------------------------------------------------------

describe("qb-portal: Catalog page", () => {
  test("emits SEO tags after catalog loads", async () => {
    await act(async () => {
      renderAt("/catalog", <Catalog />);
    });
    expectSeoTags(QB_CANON);
  });
});

describe("qb-portal: Category page", () => {
  test("emits SEO tags after catalog loads with a known category slug", async () => {
    // useParams() reads from Route's params context — wrap in Route to populate it
    const { hook } = memoryLocation({ path: "/category/quickbooks-conversion" });
    await act(async () => {
      render(
        <HelmetProvider>
          <Router hook={hook}>
            <Route path="/category/:slug">
              <Category />
            </Route>
          </Router>
        </HelmetProvider>,
      );
    });
    expectSeoTags(QB_CANON);
  });
});

describe("qb-portal: Service Detail page", () => {
  test("emits SEO tags after catalog loads with a known product slug", async () => {
    // useParams() reads from Route's params context — wrap in Route to populate it
    const { hook } = memoryLocation({ path: "/service/enterprise-to-premier-standard" });
    await act(async () => {
      render(
        <HelmetProvider>
          <Router hook={hook}>
            <Route path="/service/:slug">
              <ServiceDetail />
            </Route>
          </Router>
        </HelmetProvider>,
      );
    });
    expectSeoTags(QB_CANON);
  });
});

describe("qb-portal: Waitlist page", () => {
  test("emits SEO tags", () => {
    // Waitlist renders SEO synchronously then async-loads catalog in background
    renderAt("/waitlist", <Waitlist />);
    expectSeoTags(QB_CANON);
  });
});

describe("qb-portal: Landing page", () => {
  test("emits SEO tags for a real landing slug", async () => {
    // Use a slug confirmed to exist in landingPages.ts data
    await act(async () => {
      renderAt("/landing/enterprise-to-premier-conversion", <LandingPage />);
    });
    expectSeoTags(QB_CANON);
  });
});
