// HTML → normalized SEO fingerprint.
// Pure function. No filesystem, no network. Hand-written regex parser
// because we only ever read prerendered, server-emitted HTML.

export function extract(html, route) {
  return {
    route,
    title: matchTitle(html),
    description: matchMeta(html, "description"),
    canonical: matchLink(html, "canonical"),
    robots: matchMeta(html, "robots"),
    og: extractOg(html),
    twitter: extractTwitter(html),
    headings: extractHeadings(html),
    jsonld: extractJsonLd(html),
    anchors: extractAnchors(html),
    rootDivIsEmpty: isRootDivEmpty(html),
    hasNoindex: /noindex/i.test(matchMeta(html, "robots") ?? ""),
  };
}

function matchTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim().replace(/\s+/g, " ") : null;
}

function matchMeta(html, name) {
  const tagRe = /<meta\s+([^>]*)>/gi;
  for (const m of html.matchAll(tagRe)) {
    const attrs = m[1];
    const nameRe = new RegExp(`\\bname=["']${escapeRegex(name)}["']`, "i");
    if (!nameRe.test(attrs)) continue;
    const contentMatch = attrs.match(/\bcontent=(?:"([^"]*)"|'([^']*)')/i);
    if (contentMatch) return (contentMatch[1] ?? contentMatch[2]).trim();
  }
  return null;
}

function matchProperty(html, property) {
  const tagRe = /<meta\s+([^>]*)>/gi;
  for (const m of html.matchAll(tagRe)) {
    const attrs = m[1];
    const propRe = new RegExp(`\\bproperty=["']${escapeRegex(property)}["']`, "i");
    if (!propRe.test(attrs)) continue;
    const contentMatch = attrs.match(/\bcontent=(?:"([^"]*)"|'([^']*)')/i);
    if (contentMatch) return (contentMatch[1] ?? contentMatch[2]).trim();
  }
  return null;
}

function matchLink(html, rel) {
  const tagRe = /<link\s+([^>]*)>/gi;
  for (const m of html.matchAll(tagRe)) {
    const attrs = m[1];
    const relRe = new RegExp(`\\brel=["']${escapeRegex(rel)}["']`, "i");
    if (!relRe.test(attrs)) continue;
    const hrefMatch = attrs.match(/\bhref=(?:"([^"]*)"|'([^']*)')/i);
    if (hrefMatch) return (hrefMatch[1] ?? hrefMatch[2]).trim();
  }
  return null;
}

function extractOg(html) {
  const og = {};
  for (const key of ["title", "description", "url", "image", "type"]) {
    const v = matchProperty(html, `og:${key}`);
    if (v != null) og[key] = v;
  }
  return og;
}

function extractTwitter(html) {
  const card = matchMeta(html, "twitter:card");
  return card ? { card } : {};
}

function extractHeadings(html) {
  const out = [];
  const re = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  for (const m of html.matchAll(re)) {
    const text = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    out.push({ level: Number(m[1]), text });
  }
  return out;
}

function extractAnchors(html) {
  const seen = new Set();
  const out = [];
  const re = /<a\s+[^>]*href=(?:"([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a>/gi;
  for (const m of html.matchAll(re)) {
    const href = (m[1] ?? m[2]).trim();
    const text = m[3].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const key = `${text}\u0000${href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ text, href });
  }
  return out;
}

function extractJsonLd(html) {
  const out = [];
  const re = /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const m of html.matchAll(re)) {
    try {
      out.push(JSON.parse(m[1]));
    } catch {
      out.push({ __invalid_json__: m[1].slice(0, 200) });
    }
  }
  return out.sort((a, b) => String(a["@type"] ?? "").localeCompare(String(b["@type"] ?? "")));
}

function isRootDivEmpty(html) {
  const openRe = /<div\s+id=["']root["'][^>]*>/i;
  const open = openRe.exec(html);
  if (!open) return false;
  const start = open.index + open[0].length;
  // Walk forward, tracking nested <div> depth to find the matching </div>.
  const tagRe = /<(\/?)div\b[^>]*>/gi;
  tagRe.lastIndex = start;
  let depth = 1;
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    if (m[1] === "/") {
      depth--;
      if (depth === 0) {
        const inner = html.slice(start, m.index);
        // Strip HTML comments before checking emptiness.
        const stripped = inner.replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, "");
        return stripped.length === 0;
      }
    } else {
      depth++;
    }
  }
  return false;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
