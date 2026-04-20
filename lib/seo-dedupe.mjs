const SEO_DEDUPE_KEYS = new Set([
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

const LINK_REL_DEDUPE_KEYS = new Set(["canonical", "alternate"]);

export function dedupeSeoTags(html) {
  const headStart = html.indexOf("<head");
  if (headStart === -1) return html;
  const headOpenEnd = html.indexOf(">", headStart) + 1;
  const headEnd = html.indexOf("</head>", headOpenEnd);
  if (headOpenEnd <= 0 || headEnd === -1) return html;

  const before = html.slice(0, headOpenEnd);
  const head = html.slice(headOpenEnd, headEnd);
  const after = html.slice(headEnd);

  const tagRe = /<title\b[^>]*>[\s\S]*?<\/title>|<(?:link|meta)\b[^>]*\/?>/gi;
  const matches = [];
  let m;
  while ((m = tagRe.exec(head)) !== null) {
    const tag = m[0];
    let key = null;
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

  const keepIdxByKey = new Map();
  matches.forEach((mt, i) => {
    keepIdxByKey.set(mt.key, i);
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

export { SEO_DEDUPE_KEYS };
