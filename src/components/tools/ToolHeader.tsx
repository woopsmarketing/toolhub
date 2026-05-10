import { Info } from "lucide-react";
import FavoriteToggle from "./FavoriteToggle";

export interface ToolHeaderProps {
  /** Tool title (already resolved per-locale). */
  title: string;
  /** Tool short description (already resolved per-locale). */
  description: string;
  /** Tool slug — 제공되면 H1 옆에 즐겨찾기 토글이 표시된다. */
  toolSlug?: string;
}

/**
 * Page-structure component: H1 + description info card + FavoriteToggle.
 *
 * Server-renderable. Receives only resolved strings.
 * FavoriteToggle (client component) 만 hydrate 된다.
 */
export default function ToolHeader({
  title,
  description,
  toolSlug,
}: ToolHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl leading-tight">
          {title}
        </h1>
        {toolSlug && <FavoriteToggle toolSlug={toolSlug} />}
      </div>
      <div className="mt-4 flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </header>
  );
}
