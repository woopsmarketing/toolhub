import { ChevronRight, HelpCircle } from "lucide-react";
import type { FaqItem } from "@/config/types";

export interface ToolFAQProps {
  /** FAQ items, locale-resolved. Section is hidden if empty. */
  items: FaqItem[];
  /** Localized "FAQ" heading. */
  title: string;
}

/**
 * Content section: FAQ accordion.
 *
 * Server-renderable — uses native <details>/<summary> so no client JS is
 * required for open/close behavior.
 */
export default function ToolFAQ({ items, title }: ToolFAQProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="mb-5 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-purple-500" />
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-xl border border-border bg-card overflow-hidden"
          >
            <summary className="cursor-pointer px-5 py-4 text-[15px] text-foreground font-medium hover:text-primary transition-colors list-none flex items-center justify-between">
              {item.q}
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
            </summary>
            <div className="border-t border-border bg-muted/20 px-5 py-4 text-sm text-muted-foreground leading-relaxed">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
