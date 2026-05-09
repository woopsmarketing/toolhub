import type { UseCase } from "@/config/types";

export interface ToolUseCasesProps {
  /** Use cases, locale-resolved. Section is hidden if empty/undefined. */
  useCases: UseCase[] | undefined;
  /** Localized "Use cases" heading. */
  title: string;
}

/**
 * Content section: use case grid with optional input/output examples.
 *
 * Server-renderable.
 */
export default function ToolUseCases({ useCases, title }: ToolUseCasesProps) {
  if (!useCases || useCases.length === 0) return null;

  return (
    <section className="mb-14">
      <h2 className="mb-5 text-xl font-bold text-foreground">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {useCases.map((uc, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
          >
            <h3 className="mb-2 text-base font-semibold text-foreground">
              {uc.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {uc.description}
            </p>
            {uc.example && (
              <div className="mt-3 rounded-lg bg-muted/50 border border-border/50 p-3 text-xs font-mono">
                <div className="text-muted-foreground">
                  <span className="font-semibold text-primary">입력:</span>{" "}
                  {uc.example.input}
                </div>
                <div className="mt-1.5 text-foreground">
                  <span className="font-semibold text-green-600">결과:</span>{" "}
                  {uc.example.output}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
