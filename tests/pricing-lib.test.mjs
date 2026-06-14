import { test } from "node:test";
import assert from "node:assert/strict";
import {
  centsToCAD,
  groupByCategory,
  renderPricingMarkdown,
} from "../artifacts/qb-portal/scripts/pricing-lib.mjs";

test("centsToCAD formats cents as CAD with 2 decimals", () => {
  assert.equal(centsToCAD(14900), "$149.00 CAD");
  assert.equal(centsToCAD(7500), "$75.00 CAD");
  assert.equal(centsToCAD(0), "$0.00 CAD");
});

test("groupByCategory groups by category preserving first-appearance order", () => {
  const services = [
    { name: "A", category: "Cat1", base_price_cad: 100, launch_price_cad: 50, turnaround: "1h" },
    { name: "B", category: "Cat2", base_price_cad: 200, launch_price_cad: 100, turnaround: "2h" },
    { name: "C", category: "Cat1", base_price_cad: 300, launch_price_cad: 150, turnaround: "3h" },
  ];
  const grouped = groupByCategory(services);
  assert.deepEqual([...grouped.keys()], ["Cat1", "Cat2"]);
  assert.deepEqual(grouped.get("Cat1").map((s) => s.name), ["A", "C"]);
});

test("renderPricingMarkdown renders title, promo, category, prices, footer", () => {
  const catalog = {
    promo_active: true,
    promo_label: "Launch Special — 50% Off",
    services: [
      {
        name: "Enterprise → Premier/Pro Standard",
        category: "QuickBooks Conversion Services",
        base_price_cad: 14900,
        launch_price_cad: 7500,
        turnaround: "Under 60 minutes",
      },
    ],
  };
  const md = renderPricingMarkdown(catalog, { generatedAt: "2026-06-14" });
  assert.ok(md.includes("# NexFortis IT Solutions — QuickBooks Conversion Pricing"));
  assert.ok(md.includes("Launch Special — 50% Off"));
  assert.ok(md.includes("## QuickBooks Conversion Services"));
  assert.ok(md.includes("Enterprise → Premier/Pro Standard"));
  assert.ok(md.includes("$75.00 CAD"));
  assert.ok(md.includes("$149.00 CAD"));
  assert.ok(md.includes("Under 60 minutes"));
  assert.ok(md.includes("2026-06-14"));
  assert.ok(md.includes("All prices in CAD"));
});
