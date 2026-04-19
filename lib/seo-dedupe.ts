// Pre-rendered HTML contains BOTH the static SEO tags from index.html (the
// SPA shell fallback) AND the per-page tags injected at runtime by
// react-helmet-async. Crawlers must see exactly one canonical/title/desc/OG
// per page, so we dedupe inside <head>, keeping the LAST occurrence of each
// SEO tag (helmet's per-page version is rendered after the static fallback).
//
// Shared between artifacts/nexfortis/vite.config.ts and
// artifacts/qb-portal/vite.config.ts so changes only need to be made once.
// Imported via relative path (`../../lib/seo-dedupe`) — same pattern as
// `lib/vite-plugin-stable-hmr.ts`. Vite executes its config through Node +
// esbuild, so no build/package step is required for this plain TS file.

export const SEO_DEDUPE_KEYS = new Set<string>([
  "description",
  "robots",
  "canonical",
  "og:title",
  "og:description",
  "og:url",
  "og:image",
  "og:image:width",
  "og:image:height",
  "og:type",
  "og:site_name",
  "og:locale",
  "twitter:card",
  "twitter:title",
  "twitter:description",
  "twitter:image",
]);

// `<link>` rel values that should be deduped. `alternate` is special-cased
// in the matcher below: each hreflang variant (en-CA, x-default, …) is
// keyed independently as `alternate:<hreflang>` so adding hreflang tags via
// helmet does not collapse two different alternates into one slot.
const LINK_REL_DEDUPE_KEYS = new Set<string>(["canonical", "alternate"]);

export function dedupeSeoTags(html: string): string {
  const headStart = html.indexOf("<head");
  if (headStart === -1) return html;
  const headOpenEnd = html.indexOf(">", headStart) + 1;
  const headEnd = html.indexOf("</head>", headOpenEnd);
  if (headOpenEnd <= 0 || headEnd === -1) return html;

  const before = html.slice(0, headOpenEnd);
  const head = html.slice(headOpenEnd, headEnd);
  const after = html.slice(headEnd);

  const tagRe = /<title>[\s\S]*?<\/title>|<(?:link|meta)\b[^>]*\/?>/gi;
  type Match = { key: string; start: number; end: number };
  const matches: Match[] = [];
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(head)) !== null) {
    const tag = m[0];
    let key: string | null = null;
    if (/^<title>/i.test(tag)) {
      key = "__title__";
    } else if (/^<link\b/i.test(tag)) {
      const relMatch = tag.match(/\brel\s*=\s*"([^"]+)"/i);
      if (relMatch) {
        const relVal = relMatch[1].toLowerCase();
        if (LINK_REL_DEDUPE_KEYS.has(relVal)) {
          if (relVal === "alternate") {
            const hrefLangMatch = tag.match(/\bhreflang\s*=\s*"([^"]+)"/i);
            const hl = (hrefLangMatch?.[1] ?? "").toLowerCase();
            key = `alternate:${hl}`;
          } else {
            key = relVal;
          }
        }
      }
    } else {
      const attrMatch = tag.match(/\b(name|property)\s*=\s*"([^"]+)"/i);
      if (attrMatch) {
        const attrVal = attrMatch[2].toLowerCase();
        if (SEO_DEDUPE_KEYS.has(attrVal)) key = attrVal;
      }
    }
    if (key) matches.push({ key, start: m.index, end: m.index + tag.length });
  }

  const lastIdxByKey = new Map<string, number>();
  matches.forEach((mt, i) => lastIdxByKey.set(mt.key, i));
  const toRemove = matches
    .filter((mt, i) => lastIdxByKey.get(mt.key) !== i)
    .sort((a, b) => b.start - a.start);

  let newHead = head;
  for (const mt of toRemove) {
    newHead = newHead.slice(0, mt.start) + newHead.slice(mt.end);
  }
  return before + newHead + after;
}
