import { test } from "node:test";
import assert from "node:assert/strict";

test("seo test runner is wired up", () => {
  // This test exists so PR #1 has at least one passing assertion proving
  // the node:test runner can discover files under tests/seo/. It will be
  // deleted by PR #2, which adds real tests.
  assert.equal(2 + 2, 4);
});
