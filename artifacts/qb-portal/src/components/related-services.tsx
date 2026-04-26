import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { getLandingPageBySlug } from "@/data/landingPages";

function stripTokens(text: string): string {
  return text
    .replace(/\{[a-zA-Z]+\}/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function RelatedServices({ slugs }: { slugs: string[] }) {
  const pages = slugs
    .map((s) => getLandingPageBySlug(s))
    .filter((p): p is NonNullable<ReturnType<typeof getLandingPageBySlug>> => !!p);
  if (pages.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="mt-12 overflow-x-hidden">
      <h2
        id="related-heading"
        className="font-display font-bold text-2xl mb-5 text-foreground"
      >
        Related services
      </h2>
      <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x md:grid-cols-2 gap-4 pb-2 md:pb-0 max-w-full">
        {pages.map((p) => (
          <div
            key={p.slug}
            className="relative snap-start min-w-[240px] sm:min-w-[260px] md:min-w-0 rounded-xl border border-border bg-card hover:border-accent transition-colors p-5 group"
          >
            {/* Anchor text is just the H1 (always ≤ 70 chars) so it stays
                under the 120-char SEO ceiling (audit finding I3). The
                meta-description renders below the anchor as plain card body
                text rather than being absorbed into the link's text content.
                The ::after overlay keeps the whole card clickable for sighted
                users without bloating the anchor's accessible name. */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display font-semibold text-base text-foreground group-hover:text-accent transition-colors">
                <Link
                  href={`/landing/${p.slug}`}
                  className="after:absolute after:inset-0 after:content-[''] hover:underline"
                >
                  {p.h1}
                </Link>
              </h3>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
            </div>
            <p className="text-sm text-foreground/70 mt-2 line-clamp-2">
              {stripTokens(p.metaDescription)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
