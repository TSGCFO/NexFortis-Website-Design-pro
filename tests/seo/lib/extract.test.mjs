import { test } from "node:test";
import assert from "node:assert/strict";
import { extract } from "./extract.mjs";

const html = `<!doctype html><html><head>
  <title>About NexFortis | NexFortis IT Solutions</title>
</head><body><div id="root"><h1>About NexFortis</h1></div></body></html>`;

test("extract — title is captured verbatim", () => {
  const fp = extract(html, "/about");
  assert.equal(fp.title, "About NexFortis | NexFortis IT Solutions");
});

test("extract — meta description with double quotes", () => {
  const html = `<head><meta name="description" content="Hello world."></head>`;
  assert.equal(extract(html, "/").description, "Hello world.");
});

test("extract — meta description with single quotes", () => {
  const html = `<head><meta name='description' content='Hello world.'></head>`;
  assert.equal(extract(html, "/").description, "Hello world.");
});

test("extract — canonical link", () => {
  const html = `<head><link rel="canonical" href="https://nexfortis.com/about"></head>`;
  assert.equal(extract(html, "/about").canonical, "https://nexfortis.com/about");
});

test("extract — robots meta", () => {
  const html = `<head><meta name="robots" content="noindex,nofollow"></head>`;
  assert.equal(extract(html, "/").robots, "noindex,nofollow");
});

test("extract — robots defaults to null when absent", () => {
  assert.equal(extract(`<head></head>`, "/").robots, null);
});

test("extract — open graph tags", () => {
  const html = `<head>
    <meta property="og:title" content="OG Title">
    <meta property="og:description" content="OG Desc">
    <meta property="og:url" content="https://nexfortis.com/about">
    <meta property="og:image" content="https://nexfortis.com/og.png">
    <meta property="og:type" content="website">
  </head>`;
  const fp = extract(html, "/about");
  assert.deepEqual(fp.og, {
    title: "OG Title",
    description: "OG Desc",
    url: "https://nexfortis.com/about",
    image: "https://nexfortis.com/og.png",
    type: "website",
  });
});

test("extract — twitter card", () => {
  const html = `<head><meta name="twitter:card" content="summary_large_image"></head>`;
  assert.deepEqual(extract(html, "/").twitter, { card: "summary_large_image" });
});

test("extract — headings preserve order, level, text", () => {
  const html = `<body>
    <h1>About NexFortis</h1>
    <h2>Our Story</h2>
    <h3>Founders</h3>
    <h2>Our Values</h2>
  </body>`;
  assert.deepEqual(extract(html, "/about").headings, [
    { level: 1, text: "About NexFortis" },
    { level: 2, text: "Our Story" },
    { level: 3, text: "Founders" },
    { level: 2, text: "Our Values" },
  ]);
});

test("extract — headings strip nested tags", () => {
  const html = `<body><h1>About <span>NexFortis</span></h1></body>`;
  assert.deepEqual(extract(html, "/about").headings, [
    { level: 1, text: "About NexFortis" },
  ]);
});

test("extract — anchors capture text and href, dedupe by [text,href]", () => {
  const html = `<body>
    <a href="/contact">Contact us</a>
    <a href="/contact">Contact us</a>
    <a href="/services">Browse services</a>
  </body>`;
  assert.deepEqual(extract(html, "/").anchors, [
    { text: "Contact us", href: "/contact" },
    { text: "Browse services", href: "/services" },
  ]);
});

test("extract — JSON-LD blocks, sorted by @type", () => {
  const html = `<head>
    <script type="application/ld+json">{"@type":"WebPage","name":"X"}</script>
    <script type="application/ld+json">{"@type":"BreadcrumbList","itemListElement":[]}</script>
  </head>`;
  const fp = extract(html, "/");
  assert.equal(fp.jsonld.length, 2);
  assert.equal(fp.jsonld[0]["@type"], "BreadcrumbList");
  assert.equal(fp.jsonld[1]["@type"], "WebPage");
});

test("extract — rootDivIsEmpty true when only whitespace inside #root", () => {
  const html = `<body><div id="root">   </div></body>`;
  assert.equal(extract(html, "/").rootDivIsEmpty, true);
});

test("extract — rootDivIsEmpty false when content present", () => {
  const html = `<body><div id="root"><h1>Hi</h1></div></body>`;
  assert.equal(extract(html, "/").rootDivIsEmpty, false);
});

test("extract — hasNoindex true when robots contains noindex", () => {
  const html = `<head><meta name="robots" content="noindex,follow"></head>`;
  assert.equal(extract(html, "/").hasNoindex, true);
});

test("extract — hasNoindex false otherwise", () => {
  assert.equal(extract(`<head></head>`, "/").hasNoindex, false);
});

test("extract — meta tags work with content= before name=", () => {
  const html = `<head><meta content="Hello." name="description"></head>`;
  assert.equal(extract(html, "/").description, "Hello.");
});

test("extract — robots reversed attribute order", () => {
  const html = `<head><meta content="noindex,follow" name="robots"></head>`;
  const fp = extract(html, "/");
  assert.equal(fp.robots, "noindex,follow");
  assert.equal(fp.hasNoindex, true);
});

test("extract — link rel reversed attribute order", () => {
  const html = `<head><link href="https://nexfortis.com/" rel="canonical"></head>`;
  assert.equal(extract(html, "/").canonical, "https://nexfortis.com/");
});

test("extract — og:title with property after content", () => {
  const html = `<head><meta content="Hello" property="og:title"></head>`;
  assert.deepEqual(extract(html, "/").og, { title: "Hello" });
});

test("extract — hasNoindex case-insensitive (NOINDEX)", () => {
  const html = `<head><meta name="robots" content="NOINDEX,follow"></head>`;
  assert.equal(extract(html, "/").hasNoindex, true);
});

test("extract — hasNoindex case-insensitive (NoIndex)", () => {
  const html = `<head><meta name="robots" content="NoIndex"></head>`;
  assert.equal(extract(html, "/").hasNoindex, true);
});
