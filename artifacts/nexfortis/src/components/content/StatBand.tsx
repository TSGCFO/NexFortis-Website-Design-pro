import type { SourcedStat } from "./types";

// Row of sourced statistics. Every figure carries a real, named source rendered
// as an outbound citation link — the EEAT signal that distinguishes these pages
// from competitors' unsourced claims. The source link doubles as the external
// citation the content gate counts (≥3 per page).
export function StatBand({ stats }: { stats: readonly SourcedStat[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-card rounded-2xl p-8 border border-border/50 shadow-lg shadow-black/5"
        >
          <div className="text-4xl md:text-5xl font-display font-extrabold text-accent mb-3">
            {s.value}
          </div>
          <p className="text-foreground font-medium leading-snug mb-4">{s.label}</p>
          <a
            href={s.sourceUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-accent underline underline-offset-2 transition-colors"
          >
            Source: {s.sourceName}
          </a>
        </div>
      ))}
    </div>
  );
}
