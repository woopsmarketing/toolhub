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
    <section aria-labelledby="tool-features-heading" className="mb-14">
      <h2
        id="tool-features-heading"
        className="mb-5 text-xl font-bold text-foreground"
      >
        {title}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 list-none p-0">
        {features.map((feat, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3.5"
          >
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-green-500"
              aria-hidden="true"
            />
            <span className="text-sm text-muted-foreground leading-relaxed">
              {feat}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
