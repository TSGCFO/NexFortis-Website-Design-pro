import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import type { PageBreadcrumb } from "@/lib/seo-schemas";

export function Breadcrumbs({ items }: { items: PageBreadcrumb[] }) {
  const full = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {full.map((b, i) => {
          const isLast = i === full.length - 1;
          return (
            <li key={b.path} className="flex items-center gap-1">
              {isLast ? (
                <span aria-current="page" className="text-foreground/70">
                  {b.name}
                </span>
              ) : (
                <Link
                  href={b.path}
                  className="hover:text-accent transition-colors"
                >
                  {b.name}
                </Link>
              )}
              {!isLast && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
