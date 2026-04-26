export function validateJsonLdBlock(block) {
  const errors = [];
  if (block && block.__invalid_json__ !== undefined) {
    errors.push("block did not parse as JSON");
    return { ok: false, errors };
  }
  if (!block || typeof block !== "object") {
    errors.push("block is not an object");
    return { ok: false, errors };
  }
  if (!block["@context"]) errors.push("missing @context");
  if (!block["@type"]) errors.push("missing @type");
  return { ok: errors.length === 0, errors };
}

export function findDuplicateTypes(blocks) {
  const counts = new Map();
  for (const b of blocks) {
    const t = b?.["@type"];
    if (!t) continue;
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, n]) => n > 1).map(([t]) => t);
}
