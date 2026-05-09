import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export interface RelatedToolItem {
  slug: string;
  /** Category id used as URL prefix (Phase 1 PR-12). */
  category: string;
  title: string;
  description: string;
}

export interface RelatedToolsProps {
  /** Already-resolved related tools (locale-resolved title/description). */
  items: RelatedToolItem[];
  /** Localized "Related tools" heading. */
  title: string;
}

/**
 * Content section: related tools card grid.
 *
 * Server-renderable. The parent (ToolPageLayout) is responsible for resolving
 * registry entries → display strings so this component does not need access
 * to the full registry/locale.
 */
export default function RelatedTools({ items, title }: RelatedToolsProps) {
  if (!items || items.length === 0) return null;

  return (
    <section aria-labelledby="tool-related-heading" className="mb-14">
      <h2
        id="tool-related-heading"
        className="mb-5 text-xl font-bold text-foreground"
      >
        {title}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 list-none p-0">
        {items.map((rt) => (
          <li key={rt.slug}>
            <Link
              href={`/tools/${rt.category}/${rt.slug}`}
              className="group flex h-full items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {rt.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                  {rt.description}
                </p>
              </div>
              <ArrowRight
                className="ml-3 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
