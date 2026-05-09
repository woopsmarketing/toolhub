import { Info } from "lucide-react";

export interface ToolHeaderProps {
  /** Tool title (already resolved per-locale). */
  title: string;
  /** Tool short description (already resolved per-locale). */
  description: string;
}

/**
 * Page-structure component: H1 + description info card.
 *
 * Server-renderable. Receives only resolved strings.
 */
export default function ToolHeader({ title, description }: ToolHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl leading-tight">
        {title}
      </h1>
      <div className="mt-4 flex gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" aria-hidden="true" />
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </header>
  );
}
