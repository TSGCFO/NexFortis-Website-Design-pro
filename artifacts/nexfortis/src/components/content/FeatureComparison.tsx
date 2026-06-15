import type { ComparisonRow } from "./types";

// Differentiator table: what a client gets with NexFortis vs. a typical agency
// (or the DIY status quo). Uses a real <table> with <th> column headers, so it
// adds no document headings and never affects heading hierarchy.
export function FeatureComparison({
  rows,
  usLabel = "With NexFortis",
  themLabel = "Typical agency",
}: {
  rows: readonly ComparisonRow[];
  usLabel?: string;
  themLabel?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border/50 shadow-lg shadow-black/5">
      <table className="w-full text-left border-collapse bg-card">
        <thead>
          <tr className="border-b border-border bg-secondary/40">
            <th className="p-5 text-sm font-display font-bold text-primary">What you get</th>
            <th className="p-5 text-sm font-display font-bold text-accent">{usLabel}</th>
            <th className="p-5 text-sm font-display font-bold text-muted-foreground">
              {themLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/50 last:border-b-0 align-top">
              <td className="p-5 text-sm font-semibold text-foreground">{row.feature}</td>
              <td className="p-5 text-sm text-foreground">{row.us}</td>
              <td className="p-5 text-sm text-muted-foreground">{row.them}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
