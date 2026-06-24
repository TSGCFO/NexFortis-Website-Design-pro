import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui-elements";

// Cross-link grid for geo pages. Used twice on a city page: ACROSS (same service, nearby
// cities) and same-city (other services in this city). Renders nothing when empty, so the
// page degrades cleanly until sibling pages are published.
export function GeoLinkList({
  title,
  subtitle,
  bg = "brand-light",
  links,
}: {
  title: string;
  subtitle?: string;
  bg?: "white" | "brand-light";
  links: readonly { href: string; label: string }[];
}) {
  if (links.length === 0) return null;
  return (
    <Section bg={bg}>
      <SectionHeader title={title} subtitle={subtitle} centered />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card px-5 py-4 font-display font-semibold text-primary transition-colors hover:border-accent/50 hover:text-accent"
            >
              <span>{l.label}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
