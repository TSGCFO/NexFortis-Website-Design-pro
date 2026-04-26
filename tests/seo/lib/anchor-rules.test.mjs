import { test } from "node:test";
import assert from "node:assert/strict";
import {
  findAmbiguousAnchors,
  findGenericAnchors,
  findOverlongAnchors,
  GENERIC_ANCHOR_BANLIST,
} from "./anchor-rules.mjs";

test("findAmbiguousAnchors — same text, different hrefs across pages", () => {
  const pages = [
    { route: "/", anchors: [{ text: "Read more", href: "/blog/a" }] },
    { route: "/about", anchors: [{ text: "Read more", href: "/blog/b" }] },
  ];
  const r = findAmbiguousAnchors(pages);
  assert.equal(r.length, 1);
  assert.equal(r[0].text, "read more");
  assert.deepEqual(new Set(r[0].hrefs), new Set(["/blog/a", "/blog/b"]));
});

test("findAmbiguousAnchors — same text & href is fine", () => {
  const pages = [
    { route: "/", anchors: [{ text: "Contact", href: "/contact" }] },
    { route: "/about", anchors: [{ text: "Contact", href: "/contact" }] },
  ];
  assert.deepEqual(findAmbiguousAnchors(pages), []);
});

test("findGenericAnchors — banlist hits", () => {
  const found = findGenericAnchors([
    { route: "/", anchors: [
      { text: "Read more", href: "/x" },
      { text: "Click here", href: "/y" },
      { text: "Browse our IT services", href: "/z" },
    ] },
  ]);
  assert.equal(found.length, 2);
  assert.deepEqual(found.map((f) => f.text).sort(), ["Click here", "Read more"]);
});

test("findOverlongAnchors — over 120 chars flagged", () => {
  const long = "a".repeat(121);
  const found = findOverlongAnchors([
    { route: "/", anchors: [{ text: long, href: "/x" }, { text: "ok", href: "/y" }] },
  ]);
  assert.equal(found.length, 1);
  assert.equal(found[0].text, long);
});

test("GENERIC_ANCHOR_BANLIST exports a non-empty array", () => {
  assert.ok(GENERIC_ANCHOR_BANLIST.length > 0);
});
