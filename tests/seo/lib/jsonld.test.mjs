import { test } from "node:test";
import assert from "node:assert/strict";
import { validateJsonLdBlock, findDuplicateTypes } from "./jsonld.mjs";

test("validateJsonLdBlock — accepts valid block", () => {
  const r = validateJsonLdBlock({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NexFortis",
  });
  assert.deepEqual(r, { ok: true, errors: [] });
});

test("validateJsonLdBlock — rejects missing @context", () => {
  const r = validateJsonLdBlock({ "@type": "Organization", name: "X" });
  assert.equal(r.ok, false);
  assert.match(r.errors.join("|"), /@context/);
});

test("validateJsonLdBlock — rejects missing @type", () => {
  const r = validateJsonLdBlock({ "@context": "https://schema.org", name: "X" });
  assert.equal(r.ok, false);
  assert.match(r.errors.join("|"), /@type/);
});

test("validateJsonLdBlock — rejects __invalid_json__ marker (extractor failure)", () => {
  const r = validateJsonLdBlock({ __invalid_json__: "..." });
  assert.equal(r.ok, false);
});

test("findDuplicateTypes — returns dup types", () => {
  const dups = findDuplicateTypes([
    { "@type": "Organization" },
    { "@type": "Organization" },
    { "@type": "WebPage" },
  ]);
  assert.deepEqual(dups, ["Organization"]);
});

test("findDuplicateTypes — empty when none", () => {
  assert.deepEqual(findDuplicateTypes([{ "@type": "WebPage" }]), []);
});
