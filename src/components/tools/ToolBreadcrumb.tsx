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
}

/**
 * Page-structure component: Home / Category / Tool name.
 *
 * Server-renderable (no hooks). Receives only resolved strings so it stays
 * decoupled from the full ToolConfig shape.
 */
export default function ToolBreadcrumb({
  homeLabel,
  categoryLabel,
  category,
  toolTitle,
}: ToolBreadcrumbProps) {
  return (
    <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-primary transition-colors">
        {homeLabel}
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <Link
        href={`/categories/${category}`}
        className="hover:text-primary transition-colors"
      >
        {categoryLabel}
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <span className="text-foreground font-medium">{toolTitle}</span>
    </nav>
  );
}
