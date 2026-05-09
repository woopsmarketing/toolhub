export interface ToolGuideProps {
  /** Long-form guide block (locale-resolved). Section is hidden if undefined. */
  guide: { title: string; content: string } | undefined;
}

/**
 * Content section: long-form guide article.
 *
 * Server-renderable. Splits content by newline into paragraphs (matches the
 * original ToolPageLayout behavior).
 */
export default function ToolGuide({ guide }: ToolGuideProps) {
  if (!guide) return null;

  const paragraphs = guide.content.split("\n").filter((p) => p.trim());

  return (
    <section aria-labelledby="tool-guide-heading" className="mb-14">
      <h2
        id="tool-guide-heading"
        className="mb-5 text-xl font-bold text-foreground"
      >
        {guide.title}
      </h2>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
