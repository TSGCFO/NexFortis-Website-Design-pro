/**
 * Unit coverage for the SeoHeadDedupe runtime guard (nexfortis).
 *
 * Simulates the post-hydration state the guard exists to fix: the prerendered
 * <head> tags are already present when react-helmet-async appends its own
 * copies on top. The guard must collapse each SEO-critical tag to a single
 * element, keeping the LAST occurrence (helmet's route-aware copy) to match
 * the build-time semantics of lib/seo-dedupe.mjs.
 */
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { render, waitFor, cleanup } from "@testing-library/react";
import { SeoHeadDedupe } from "@/components/seo-head-dedupe";

function addLink(rel: string, href: string, hreflang?: string) {
  const el = document.createElement("link");
  el.setAttribute("rel", rel);
  el.setAttribute("href", href);
  if (hreflang) el.setAttribute("hreflang", hreflang);
  document.head.appendChild(el);
  return el;
}

function addMeta(attr: "name" | "property", key: string, content: string) {
  const el = document.createElement("meta");
  el.setAttribute(attr, key);
  el.setAttribute("content", content);
  document.head.appendChild(el);
  return el;
}

function addTitle(text: string) {
  const el = document.createElement("title");
  el.textContent = text;
  document.head.appendChild(el);
  return el;
}

beforeEach(() => {
  document.head.innerHTML = "";
});

// Unmount so the component's effect disconnects its MutationObserver before
// the next test mutates the (shared) document.head.
afterEach(() => {
  cleanup();
});

describe("SeoHeadDedupe", () => {
  test("collapses duplicate canonical/hreflang/description/og/title to the last copy", async () => {
    render(<SeoHeadDedupe />);

    // Prerendered tags already in <head> at load.
    addLink("canonical", "https://nexfortis.com/stale");
    addLink("alternate", "https://nexfortis.com/stale", "en-CA");
    addMeta("name", "description", "stale description");
    addMeta("property", "og:url", "https://nexfortis.com/stale");
    addTitle("Stale Title");

    // helmet appends its own copies after hydration.
    const freshCanonical = addLink("canonical", "https://nexfortis.com/fresh");
    addLink("alternate", "https://nexfortis.com/fresh", "en-CA");
    addMeta("name", "description", "fresh description");
    addMeta("property", "og:url", "https://nexfortis.com/fresh");
    addTitle("Fresh Title");

    await waitFor(() => {
      expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
      expect(
        document.head.querySelectorAll('link[rel="alternate"][hreflang="en-CA"]').length,
      ).toBe(1);
      expect(document.head.querySelectorAll('meta[name="description"]').length).toBe(1);
      expect(document.head.querySelectorAll('meta[property="og:url"]').length).toBe(1);
      expect(document.head.querySelectorAll("title").length).toBe(1);
    });

    // keep-LAST: the survivor is helmet's fresh tag, not the stale prerendered one.
    expect(document.head.querySelector('link[rel="canonical"]')).toBe(freshCanonical);
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      "https://nexfortis.com/fresh",
    );
    expect(
      document.head.querySelector('meta[name="description"]')?.getAttribute("content"),
    ).toBe("fresh description");
    expect(document.head.querySelector("title")?.textContent).toBe("Fresh Title");
  });

  test("keeps distinct hreflang alternates (different hreflang are not duplicates)", async () => {
    render(<SeoHeadDedupe />);

    addLink("alternate", "https://nexfortis.com/x", "en-CA");
    addLink("alternate", "https://nexfortis.com/x", "x-default");
    // A real duplicate to force an observer pass.
    addLink("canonical", "https://nexfortis.com/a");
    addLink("canonical", "https://nexfortis.com/b");

    await waitFor(() => {
      expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
    });
    expect(document.head.querySelectorAll('link[rel="alternate"]').length).toBe(2);
  });
});
