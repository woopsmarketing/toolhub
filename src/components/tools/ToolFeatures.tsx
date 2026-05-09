import { CheckCircle2 } from "lucide-react";

export interface ToolFeaturesProps {
  /** Feature bullet strings, locale-resolved. Section is hidden if empty. */
  features: string[];
  /** Localized "Features" heading. */
  title: string;
}

/**
 * Content section: features check list.
 *
 * Server-renderable.
 */
export default function ToolFeatures({ features, title }: ToolFeaturesProps) {
  if (!features || features.length === 0) return null;

  return (
    <section className="mb-14">
      <h2 className="mb-5 text-xl font-bold text-foreground">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {features.map((feat, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3.5"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
            <span className="text-sm text-muted-foreground leading-relaxed">
              {feat}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
