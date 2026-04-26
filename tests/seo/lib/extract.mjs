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
    hasNoindex: (matchMeta(html, "robots") ?? "").includes("noindex"),
  };
}

function matchTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim().replace(/\s+/g, " ") : null;
}

function matchMeta(html, name) {
  const re = new RegExp(
    `<meta\\s+[^>]*name=["']${name}["'][^>]*content=(?:"([^"]*)"|'([^']*)')[^>]*>`,
    "i",
  );
  const m = html.match(re);
  if (!m) return null;
  return (m[1] ?? m[2]).trim();
}

function matchProperty(html, property) {
  const re = new RegExp(
    `<meta\\s+[^>]*property=["']${property}["'][^>]*content=(?:"([^"]*)"|'([^']*)')[^>]*>`,
    "i",
  );
  const m = html.match(re);
  if (!m) return null;
  return (m[1] ?? m[2]).trim();
}

function matchLink(html, rel) {
  const re = new RegExp(
    `<link\\s+[^>]*rel=["']${rel}["'][^>]*href=(?:"([^"]*)"|'([^']*)')[^>]*>`,
    "i",
  );
  const m = html.match(re);
  if (!m) return null;
  return (m[1] ?? m[2]).trim();
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
  const m = html.match(/<div\s+id=["']root["'][^>]*>([\s\S]*?)<\/div>\s*(?:<script|<\/body)/i);
  if (!m) return false;
  return m[1].replace(/\s+/g, "").length === 0;
}
