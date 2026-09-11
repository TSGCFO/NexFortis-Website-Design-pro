import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import BlogPostPage from "@/pages/blog-post";
import { readPrerenderedBlogPost } from "@/lib/blog-post";

const snapshot = {
  id: 17,
  title: "Keeping your business data available",
  slug: "keeping-business-data-available",
  excerpt: "Practical steps for keeping business information available during an outage.",
  content: "## Keep a recoverable copy\nSave a tested backup before changing your systems.",
  category: "IT Advice",
  coverImage: null,
  seoTitle: "Business data availability",
  metaDescription: "Keep your business data available with tested backups and a practical recovery plan.",
  published: true,
  createdAt: "2026-09-01T12:00:00.000Z",
};

const clients: QueryClient[] = [];
const fetchMock = vi.fn<typeof fetch>();

function seedSnapshot(value: unknown = snapshot) {
  const script = document.createElement("script");
  script.id = "nexfortis-blog-post";
  script.type = "application/json";
  script.textContent = JSON.stringify(value);
  document.head.appendChild(script);
  return script;
}

function jsonResponse(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function renderArticle(slug = snapshot.slug) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retryDelay: 0, gcTime: 0, refetchOnWindowFocus: false },
    },
  });
  clients.push(client);
  const { hook, navigate } = memoryLocation({ path: `/blog/${slug}` });
  const article = (currentSlug: string) => (
    <QueryClientProvider client={client}>
      <HelmetProvider>
        <Router hook={hook}>
          <BlogPostPage slug={currentSlug} />
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
  const view = render(article(slug));
  return {
    client,
    rerenderArticle(nextSlug: string) {
      navigate(`/blog/${nextSlug}`);
      view.rerender(article(nextSlug));
    },
  };
}

function articleSchemas() {
  return [...document.head.querySelectorAll('script[type="application/ld+json"]')]
    .map((script) => JSON.parse(script.textContent ?? "{}"))
    .filter((schema) => schema["@type"] === "Article");
}

async function expectArticleSeo(post = snapshot) {
  await waitFor(() => {
    expect(document.title).toBe(`${post.seoTitle} | NexFortis IT Solutions`);
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://nexfortis.com/blog/${post.slug}`,
    );
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      post.metaDescription,
    );
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      expect.stringMatching(/^index,follow/),
    );
    expect(articleSchemas()).toEqual([
      expect.objectContaining({
        headline: post.seoTitle,
        url: `https://nexfortis.com/blog/${post.slug}`,
      }),
    ]);
  });
}

beforeEach(() => {
  document.head.innerHTML = "";
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  for (const client of clients.splice(0)) client.clear();
  vi.unstubAllGlobals();
  document.head.innerHTML = "";
});

describe("blog article recovery", () => {
  test("shows the saved article immediately while the API request is still pending", async () => {
    seedSnapshot();
    fetchMock.mockImplementation(() => new Promise<Response>(() => {}));

    renderArticle();

    expect(screen.getByRole("heading", { level: 1, name: snapshot.title })).toBeVisible();
    expect(screen.getByText("Save a tested backup before changing your systems.")).toBeVisible();
    expect(screen.queryByText("Loading article...")).not.toBeInTheDocument();
    await expectArticleSeo();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(`/api/blog/posts/${snapshot.slug}`),
      expect.any(Object),
    );
  });

  test.each(["network", 429, 500] as const)(
    "retains the saved article and search metadata after a %s failure",
    async (failure) => {
      seedSnapshot();
      if (failure === "network") {
        fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
      } else {
        fetchMock.mockImplementation(async () => jsonResponse({ error: "Try later" }, failure));
      }

      const { client } = renderArticle();
      await waitFor(() => {
        expect(client.getQueryState(["blog-post", snapshot.slug])?.status).toBe("error");
      });

      expect(screen.getByRole("heading", { level: 1, name: snapshot.title })).toBeVisible();
      expect(screen.getByText("Save a tested backup before changing your systems.")).toBeVisible();
      expect(screen.queryByRole("heading", { name: "Article Not Found" })).not.toBeInTheDocument();
      await expectArticleSeo();
    },
  );

  test.each([404, 410])(
    "honours an API %s even when an older saved article exists",
    async (status) => {
      seedSnapshot();
      fetchMock.mockImplementation(async () => jsonResponse({ error: "Article removed" }, status));

      renderArticle();

      expect(await screen.findByRole("heading", { name: "Article Not Found" })).toBeVisible();
      expect(screen.queryByRole("heading", { name: snapshot.title })).not.toBeInTheDocument();
      expect(screen.queryByText("Save a tested backup before changing your systems.")).not.toBeInTheDocument();
      await waitFor(() => {
        expect(document.head.querySelector('meta[name="robots"]')?.getAttribute("content"))
          .toContain("noindex");
        expect(articleSchemas()).toHaveLength(0);
      });
      expect(fetchMock).toHaveBeenCalledTimes(1);
    },
  );

  test("offers retry after a temporary failure without a snapshot and recovers on success", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    renderArticle();

    expect(await screen.findByRole("heading", { name: "Article temporarily unavailable" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Article Not Found" })).not.toBeInTheDocument();

    fetchMock.mockImplementation(async () => jsonResponse(snapshot));
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("heading", { level: 1, name: snapshot.title })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Article temporarily unavailable" })).not.toBeInTheDocument();
    await expectArticleSeo();
  });

  test("does not resurrect a removed article when a later API request fails", async () => {
    seedSnapshot();
    fetchMock.mockImplementation(async () => jsonResponse({ error: "Article removed" }, 404));

    const { client } = renderArticle();
    expect(await screen.findByRole("heading", { name: "Article Not Found" })).toBeVisible();

    fetchMock.mockImplementation(async () => jsonResponse({ error: "Try later" }, 500));
    await act(async () => {
      await client.invalidateQueries({ queryKey: ["blog-post", snapshot.slug] });
    });

    expect(screen.getByRole("heading", { name: "Article Not Found" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: snapshot.title })).not.toBeInTheDocument();
    expect(readPrerenderedBlogPost(snapshot.slug)).toBeUndefined();
    await waitFor(() => {
      expect(document.head.querySelector('meta[name="robots"]')?.getAttribute("content"))
        .toContain("noindex");
    });
  });

  test("does not display another article's snapshot at an unknown URL", async () => {
    seedSnapshot();
    fetchMock.mockImplementation(async () => jsonResponse({ error: "Unknown article" }, 404));

    renderArticle("unknown-article");

    expect(screen.queryByRole("heading", { name: snapshot.title })).not.toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Article Not Found" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: snapshot.title })).not.toBeInTheDocument();
  });

  test("drops the previous article immediately when the mounted page changes to an unknown slug", async () => {
    seedSnapshot();
    let completeUnknownRequest!: (response: Response) => void;
    fetchMock
      .mockImplementationOnce(() => new Promise<Response>(() => {}))
      .mockImplementationOnce(() => new Promise<Response>((resolve) => {
        completeUnknownRequest = resolve;
      }));

    const { rerenderArticle } = renderArticle();
    expect(screen.getByRole("heading", { level: 1, name: snapshot.title })).toBeVisible();

    act(() => rerenderArticle("unknown-article"));

    expect(screen.queryByRole("heading", { name: snapshot.title })).not.toBeInTheDocument();
    expect(screen.queryByText("Save a tested backup before changing your systems.")).not.toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    await act(async () => completeUnknownRequest(jsonResponse({ error: "Unknown article" }, 404)));

    expect(await screen.findByRole("heading", { name: "Article Not Found" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: snapshot.title })).not.toBeInTheDocument();
    await waitFor(() => {
      expect(document.head.querySelector('meta[name="robots"]')?.getAttribute("content"))
        .toContain("noindex");
    });
  });

  test("replaces the saved content and metadata after a successful API refresh", async () => {
    const updated = {
      ...snapshot,
      title: "Updated business recovery advice",
      content: "The updated recovery process includes a monthly restoration check.",
      seoTitle: "Updated recovery advice",
      metaDescription: "An updated recovery plan with monthly restoration checks for your business data.",
    };
    seedSnapshot();
    let completeRequest!: (response: Response) => void;
    fetchMock.mockImplementation(() => new Promise<Response>((resolve) => {
      completeRequest = resolve;
    }));

    renderArticle();
    expect(screen.getByRole("heading", { level: 1, name: snapshot.title })).toBeVisible();

    await act(async () => completeRequest(jsonResponse(updated)));

    expect(await screen.findByRole("heading", { level: 1, name: updated.title })).toBeVisible();
    expect(screen.getByText(updated.content)).toBeVisible();
    expect(screen.queryByText("Save a tested backup before changing your systems.")).not.toBeInTheDocument();
    await expectArticleSeo(updated);
  });
});

describe("saved blog payload validation", () => {
  test("ignores malformed JSON without interrupting page startup", () => {
    seedSnapshot().textContent = "{incomplete";
    expect(readPrerenderedBlogPost(snapshot.slug)).toBeUndefined();
  });

  test.each([
    ["unpublished", { ...snapshot, published: false }],
    ["missing publication flag", { ...snapshot, published: undefined }],
    ["missing title", { ...snapshot, title: undefined }],
    ["missing content", { ...snapshot, content: undefined }],
    ["wrong slug", { ...snapshot, slug: "a-different-article" }],
  ])("ignores a %s payload", (_reason, payload) => {
    seedSnapshot(payload);
    expect(readPrerenderedBlogPost(snapshot.slug)).toBeUndefined();
  });
});
