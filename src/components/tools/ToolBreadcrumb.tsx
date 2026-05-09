import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export interface ToolBreadcrumbProps {
  /** Localized "Home" label. */
  homeLabel: string;
  /** Localized category label. */
  categoryLabel: string;
  /** Category id (used for the category link target). */
  category: string;
  /** Current tool title (final crumb, not a link). */
  toolTitle: string;
  /** Localized aria-label for the <nav> landmark (e.g. "Breadcrumb"). */
  ariaLabel?: string;
}

/**
 * Page-structure component: Home / Category / Tool name.
 *
 * Server-renderable (no hooks). Receives only resolved strings so it stays
 * decoupled from the full ToolConfig shape. Uses an ordered list inside a
 * <nav aria-label> landmark per the WAI-ARIA breadcrumb pattern.
 */
export default function ToolBreadcrumb({
  homeLabel,
  categoryLabel,
  category,
  toolTitle,
  ariaLabel = "Breadcrumb",
}: ToolBreadcrumbProps) {
  return (
    <nav aria-label={ariaLabel} className="mb-6 text-sm text-muted-foreground">
      <ol className="flex items-center gap-1.5">
        <li className="flex items-center">
          <Link href="/" className="hover:text-primary transition-colors">
            {homeLabel}
          </Link>
        </li>
        <li aria-hidden="true" className="flex items-center">
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </li>
        <li className="flex items-center">
          <Link
            href={`/categories/${category}`}
            className="hover:text-primary transition-colors"
          >
            {categoryLabel}
          </Link>
        </li>
        <li aria-hidden="true" className="flex items-center">
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </li>
        <li className="flex items-center">
          <span aria-current="page" className="text-foreground font-medium">
            {toolTitle}
          </span>
        </li>
      </ol>
    </nav>
  );
}
