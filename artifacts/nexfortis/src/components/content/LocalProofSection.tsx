import type { ReactNode } from "react";
import { Section, SectionHeader } from "@/components/ui-elements";

// Local proof for geo pages — REAL NexFortis result/engagement where available, otherwise a
// CITED local market stat. Never an invented testimonial or client (per _facts.md).
export function LocalProofSection({
  heading,
  items,
}: {
  heading: string;
  items: readonly { label: string; detail: ReactNode }[];
}) {
  if (items.length === 0) return null;
  return (
    <Section bg="brand-light">
      <SectionHeader title={heading} centered />
      <div className="mt-10 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {items.map((it, i) => (
          <div key={i} className="rounded-2xl bg-card border border-border/50 p-6">
            <p className="font-display font-bold text-primary mb-2">{it.label}</p>
            <div className="text-muted-foreground leading-relaxed">{it.detail}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
