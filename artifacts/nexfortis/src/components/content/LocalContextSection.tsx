import type { ReactNode } from "react";
import { Section, SectionHeader } from "@/components/ui-elements";

// Genuinely-local context block for geo [service]+[city] pages — the anti-doorway core.
// Renders city-unique prose (real neighbourhoods, districts, market context) + the
// concrete areas served as chips. Never a templated city-name swap.
export function LocalContextSection({
  heading,
  children,
  areas,
  areasHeading,
}: {
  heading: string;
  children: ReactNode;
  areas: readonly { name: string; note?: string }[];
  areasHeading?: string;
}) {
  return (
    <Section bg="white">
      <div className="max-w-3xl mx-auto">
        <SectionHeader title={heading} />
        <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">{children}</div>
        {areas.length > 0 && (
          <div className="mt-10">
            {areasHeading && (
              <h3 className="text-xl font-display font-bold text-primary mb-4">{areasHeading}</h3>
            )}
            <ul className="flex flex-wrap gap-2">
              {areas.map((a) => (
                <li
                  key={a.name}
                  className="px-3 py-1.5 rounded-full bg-secondary text-sm font-display text-foreground"
                  title={a.note}
                >
                  {a.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
}
