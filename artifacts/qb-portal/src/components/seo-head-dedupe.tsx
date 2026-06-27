import { useEffect } from "react";

// Runtime safety net for the react-helmet-async duplicate-tag regression.
//
// The build-time pass (lib/seo-dedupe.mjs) collapses duplicate canonical /
// hreflang / meta tags in the *prerendered HTML file*, so a standard
// (no-JavaScript) crawl sees a single clean set. But at runtime react-helmet
// re-injects its own copies on top of the prerendered ones. When the installed
// helmet build cannot recognize-and-replace the prerendered tags, those copies
// pile up in the live DOM — producing the duplicate <link rel="canonical"> and
// <link rel="alternate" hreflang> that a JavaScript crawl (and Googlebot's own
// render pass) flags as canonical / alternate-link errors on every page.
//
// This observer mirrors the prerender dedupe's keep-LAST semantics: helmet
// appends its managed tags after the prerendered ones, so the last occurrence
// of each SEO-critical key is helmet's (correct, route-aware) tag. We keep it
// and remove the earlier prerendered duplicate. helmet does not track the
// prerendered tag, so removing it never triggers a re-add. With helmet@2.0.5
// (which replaces correctly) this is a harmless no-op; it exists so a future
// helmet bump cannot silently reintroduce the regression.

const META_DEDUPE_KEYS = new Set([
  "description",
  "robots",
  "og:title",
  "og:description",
  "og:url",
  "og:image",
  "og:image:width",
  "og:image:height",
  "og:image:type",
  "og:type",
  "og:site_name",
  "og:locale",
  "twitter:card",
  "twitter:title",
  "twitter:description",
  "twitter:image",
  "geo.region",
  "geo.placename",
]);

function keyFor(el: Element): string | null {
  const tag = el.tagName.toLowerCase();
  // Mirror lib/seo-dedupe.mjs, which also collapses <title> (keep-last).
  if (tag === "title") return "title";
  if (tag === "link") {
    const rel = (el.getAttribute("rel") || "").toLowerCase();
    if (rel === "canonical") return "link:canonical";
    if (rel === "alternate") {
      const hl = (el.getAttribute("hreflang") || "").toLowerCase();
      if (hl) return `link:alternate:${hl}`;
    }
    return null;
  }
  if (tag === "meta") {
    const k = (el.getAttribute("name") || el.getAttribute("property") || "").toLowerCase();
    if (k && META_DEDUPE_KEYS.has(k)) return `meta:${k}`;
    return null;
  }
  return null;
}

function dedupeSeoHead() {
  const head = document.head;
  if (!head) return;
  const nodes = Array.from(head.children);
  const survivor = new Map<string, Element>();
  for (const el of nodes) {
    const key = keyFor(el);
    if (key) survivor.set(key, el); // keep-last
  }
  for (const el of nodes) {
    const key = keyFor(el);
    if (key && survivor.get(key) !== el) el.remove();
  }
}

/** Renders nothing. Mount once inside <HelmetProvider>. */
export function SeoHeadDedupe() {
  useEffect(() => {
    const head = document.head;
    if (!head) return;
    dedupeSeoHead();
    // Coalesce bursts of head mutations (helmet can emit several in one tick on
    // a route change) into a single dedupe pass per microtask.
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      queueMicrotask(() => {
        scheduled = false;
        dedupeSeoHead();
      });
    });
    observer.observe(head, { childList: true });
    return () => observer.disconnect();
  }, []);
  return null;
}
