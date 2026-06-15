import type { ReactNode } from "react";

// Pricing *reference* (not a checkout table): a "from" anchor plus what's
// included, in transparent ranges. Never invents specific figures — copy is
// supplied per page and phrased as ranges/brackets. Title renders as <h3>
// (under a section <h2>).
export function PricingReference({
  fromLabel,
  note,
}: {
  fromLabel: string;
  note: ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto rounded-2xl border border-border/50 bg-card shadow-lg shadow-black/5 p-8 md:p-10">
      <h3 className="text-2xl font-display font-bold text-primary mb-3">{fromLabel}</h3>
      <div className="text-muted-foreground leading-relaxed">{note}</div>
    </div>
  );
}
