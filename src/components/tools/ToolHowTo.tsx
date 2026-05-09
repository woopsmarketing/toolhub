import { Lightbulb } from "lucide-react";

export interface ToolHowToProps {
  /** Step strings, locale-resolved. Section is hidden if empty. */
  steps: string[];
  /** Localized "How to use" heading. */
  title: string;
}

/**
 * Content section: numbered "How to use" steps.
 *
 * Server-renderable.
 */
export default function ToolHowTo({ steps, title }: ToolHowToProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="mb-5 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-sm">
                {i + 1}
              </span>
              <span className="pt-1 text-[15px] text-muted-foreground leading-relaxed">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
