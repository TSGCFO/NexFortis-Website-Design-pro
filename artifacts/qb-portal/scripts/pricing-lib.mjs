// Pure formatting helpers for pricing.md generation. No filesystem I/O here.

export function centsToCAD(cents) {
  return `$${(cents / 100).toFixed(2)} CAD`;
}

export function groupByCategory(services) {
  const map = new Map();
  for (const s of services) {
    if (!map.has(s.category)) map.set(s.category, []);
    map.get(s.category).push(s);
  }
  return map;
}

export function renderPricingMarkdown(catalog, { generatedAt }) {
  const lines = [];
  lines.push("# NexFortis IT Solutions — QuickBooks Conversion Pricing");
  lines.push("");
  lines.push(
    "> Machine-readable price list for the NexFortis QuickBooks conversion portal " +
      "(qb.nexfortis.com). All prices in CAD. Operated by NexFortis IT Solutions, Nobleton, ON."
  );
  lines.push("");
  if (catalog.promo_active && catalog.promo_label) {
    lines.push(`**Current promotion:** ${catalog.promo_label} (launch prices shown below are active).`);
    lines.push("");
  }

  const grouped = groupByCategory(catalog.services);
  for (const [category, services] of grouped) {
    lines.push(`## ${category}`);
    lines.push("");
    lines.push("| Service | Regular price | Launch price | Turnaround |");
    lines.push("| --- | --- | --- | --- |");
    for (const s of services) {
      lines.push(
        `| ${s.name} | ${centsToCAD(s.base_price_cad)} | ${centsToCAD(s.launch_price_cad)} | ${s.turnaround} |`
      );
    }
    lines.push("");
  }

  lines.push("---");
  lines.push(`Generated on ${generatedAt}. See https://qb.nexfortis.com/catalog for full service details.`);
  lines.push("");
  return lines.join("\n");
}
