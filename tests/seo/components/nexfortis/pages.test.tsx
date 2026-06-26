/**
 * Component-level SEO tests for nexfortis (artifacts/nexfortis/src/pages/).
 *
 * For each crawlable page, asserts three things:
 *   1. <title> is non-empty
 *   2. <link rel="canonical"> exists with href starting https://nexfortis.com/
 *   3. <meta name="description"> is non-empty
 *
 * Pages excluded (auth/admin/not crawlable):
 *   - admin-login, blog-admin, blog-post, not-found
 */
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { Router, Route } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

// Mock apiFetch / apiUrl used by contact.tsx and blog.tsx
vi.mock("@/lib/api", () => ({
  apiFetch: vi.fn().mockResolvedValue([]),
  apiUrl: (path: string) => `/api${path}`,
}));

// Mock analytics to avoid gtag errors
vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

// --- Page imports (each maps to @/ which resolves to artifacts/nexfortis/src) ---
import About from "@/pages/about";
import Blog from "@/pages/blog";
import Contact from "@/pages/contact";
import Home from "@/pages/home";
import Privacy from "@/pages/privacy";
import Services from "@/pages/services";
import Terms from "@/pages/terms";
import Automation from "@/pages/services/automation";
import DigitalMarketing from "@/pages/services/digital-marketing";
import ITConsulting from "@/pages/services/it-consulting";
import Microsoft365 from "@/pages/services/microsoft-365";
import QuickBooks from "@/pages/services/quickbooks";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
}

function renderAt(path: string, node: ReactNode) {
  const { hook } = memoryLocation({ path });
  const qc = makeQueryClient();
  render(
    <QueryClientProvider client={qc}>
      <HelmetProvider>
        <Router hook={hook}>{node}</Router>
      </HelmetProvider>
    </QueryClientProvider>,
  );
}

const NX_CANON = "https://nexfortis.com";

// react-helmet-async@2.x flushes head tags asynchronously (after the React
// commit), so we wait for them rather than querying the head synchronously.
async function expectSeoTags(canonicalPrefix: string = NX_CANON) {
  await waitFor(() => {
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
  });
}

// ---------------------------------------------------------------------------
// Reset head between tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  document.head.innerHTML = "";
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("nexfortis: About page", () => {
  test("emits SEO tags", async () => {
    renderAt("/about", <About />);
    await expectSeoTags(NX_CANON);
  });
});

describe("nexfortis: Blog page", () => {
  test("emits SEO tags", async () => {
    // Blog uses @tanstack/react-query's useQuery — wrapped with QueryClientProvider
    renderAt("/blog", <Blog />);
    await expectSeoTags(NX_CANON);
  });
});

describe("nexfortis: Contact page", () => {
  test("emits SEO tags", async () => {
    renderAt("/contact", <Contact />);
    await expectSeoTags(NX_CANON);
  });
});

describe("nexfortis: Home page", () => {
  test("emits SEO tags", async () => {
    renderAt("/", <Home />);
    await expectSeoTags(NX_CANON);
  });
});

describe("nexfortis: Privacy page", () => {
  test("emits SEO tags", async () => {
    renderAt("/privacy", <Privacy />);
    await expectSeoTags(NX_CANON);
  });
});

describe("nexfortis: Services overview page", () => {
  test("emits SEO tags", async () => {
    renderAt("/services", <Services />);
    await expectSeoTags(NX_CANON);
  });
});

describe("nexfortis: Terms page", () => {
  test("emits SEO tags", async () => {
    renderAt("/terms", <Terms />);
    await expectSeoTags(NX_CANON);
  });
});

describe("nexfortis: Workflow Automation service page", () => {
  test("emits SEO tags", async () => {
    renderAt("/services/workflow-automation", <Automation />);
    await expectSeoTags(NX_CANON);
  });
});

describe("nexfortis: Digital Marketing service page", () => {
  test("emits SEO tags", async () => {
    renderAt("/services/digital-marketing", <DigitalMarketing />);
    await expectSeoTags(NX_CANON);
  });
});

describe("nexfortis: IT Consulting service page", () => {
  test("emits SEO tags", async () => {
    renderAt("/services/it-consulting", <ITConsulting />);
    await expectSeoTags(NX_CANON);
  });
});

describe("nexfortis: Microsoft 365 service page", () => {
  test("emits SEO tags", async () => {
    renderAt("/services/microsoft-365", <Microsoft365 />);
    await expectSeoTags(NX_CANON);
  });
});

describe("nexfortis: QuickBooks service page", () => {
  test("emits SEO tags", async () => {
    renderAt("/services/quickbooks", <QuickBooks />);
    await expectSeoTags(NX_CANON);
  });
});
