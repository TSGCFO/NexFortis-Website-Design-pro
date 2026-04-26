// Cross-page and per-anchor analysis. Input: array of
// { route, anchors: [{text, href}] }.

export const GENERIC_ANCHOR_BANLIST = [
  "read article",
  "read more",
  "details",
  "learn more",
  "click here",
];

const MAX_LEN = 120;

export function findAmbiguousAnchors(pages) {
  const map = new Map(); // text -> Map<href, route[]>
  for (const p of pages) {
    for (const a of p.anchors ?? []) {
      const text = a.text.toLowerCase();
      if (!map.has(text)) map.set(text, new Map());
      const inner = map.get(text);
      const list = inner.get(a.href) ?? [];
      list.push(p.route);
      inner.set(a.href, list);
    }
  }
  const out = [];
  for (const [text, hrefMap] of map) {
    if (hrefMap.size > 1) {
      out.push({
        text,
        hrefs: [...hrefMap.keys()],
        routes: [...new Set([].concat(...hrefMap.values()))],
      });
    }
  }
  return out;
}

export function findGenericAnchors(pages) {
  const banSet = new Set(GENERIC_ANCHOR_BANLIST);
  const out = [];
  for (const p of pages) {
    for (const a of p.anchors ?? []) {
      if (banSet.has(a.text.toLowerCase())) {
        out.push({ route: p.route, text: a.text, href: a.href });
      }
    }
  }
  return out;
}

export function findOverlongAnchors(pages) {
  const out = [];
  for (const p of pages) {
    for (const a of p.anchors ?? []) {
      if (a.text.length > MAX_LEN) {
        out.push({ route: p.route, text: a.text, href: a.href, length: a.text.length });
      }
    }
  }
  return out;
}
