// Pre-rendered HTML contains BOTH the static SEO tags from index.html (the
// SPA shell fallback) AND the per-page tags injected at runtime by
// react-helmet-async (and React 19's built-in metadata hoisting). Crawlers
// must see exactly one canonical/title/desc/OG per page, so we dedupe
// inside <head>:
//
//   - For `<title>`: keep the FIRST occurrence. React 19 hoists `<title>`
//     elements rendered inside the React tree to the top of <head>, before
//     the shell's pre-existing `<title>` tag. Helmet's per-page title is
//     therefore the first one in DOM order; the shell fallback is second.
//
//   - For all other SEO tags (`<meta name=...>`, `<meta property=...>`,
//     `<link rel=canonical>`, `<link rel=alternate hreflang=...>`):
//     keep the LAST occurrence. These are appended by helmet AFTER the
//     shell's static tags, so the per-page version naturally wins.
//
// NOTE: The standalone prerender.mjs scripts (artifacts/nexfortis/prerender.mjs
// and artifacts/qb-portal/prerender.mjs) each have their own inline
// `dedupeHead()` function with broader coverage (itemprop, charset,
// http-equiv). This shared module is retained for reference and potential
// reuse in other contexts (e.g. tests, dev tooling).

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

  const tagRe = /<title\b[^>]*>[\s\S]*?<\/title>|<(?:link|meta)\b[^>]*\/?>/gi;
  type Match = { key: string; start: number; end: number; isTitle: boolean };
  const matches: Match[] = [];
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(head)) !== null) {
    const tag = m[0];
    let key: string | null = null;
    let isTitle = false;
    if (/^<title\b/i.test(tag)) {
      key = "__title__";
      isTitle = true;
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
    if (key)
      matches.push({ key, start: m.index, end: m.index + tag.length, isTitle });
  }

  // For `<title>`: keep the FIRST occurrence (React 19/helmet hoist first).
  // For everything else: keep the LAST occurrence (helmet appends after).
  const keepIdxByKey = new Map<string, number>();
  matches.forEach((mt, i) => {
    if (mt.isTitle) {
      if (!keepIdxByKey.has(mt.key)) keepIdxByKey.set(mt.key, i);
    } else {
      keepIdxByKey.set(mt.key, i);
    }
  });
  const toRemove = matches
    .filter((mt, i) => keepIdxByKey.get(mt.key) !== i)
    .sort((a, b) => b.start - a.start);

  let newHead = head;
  for (const mt of toRemove) {
    newHead = newHead.slice(0, mt.start) + newHead.slice(mt.end);
  }
  return before + newHead + after;
}
