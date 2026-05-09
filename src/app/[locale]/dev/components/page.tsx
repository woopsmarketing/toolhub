import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import PrimitivesShowcase from "./sections/PrimitivesShowcase";
import LayoutShowcase from "./sections/LayoutShowcase";
import SectionsShowcase from "./sections/SectionsShowcase";
import SlotsShowcase from "./sections/SlotsShowcase";
import InfraShowcase from "./sections/InfraShowcase";
import TemplatesShowcase from "./sections/TemplatesShowcase";

/**
 * /dev/components — Visual debugging surface for the Phase 1 infra outputs.
 *
 * Renders every primitive (4), layout component (15 split from ToolPageLayout),
 * and template (9) on a single page so engineers can sanity-check styling and
 * behavior without spinning up an actual tool route.
 *
 * Gating:
 *  - The parent `dev/layout.tsx` calls `notFoundInProduction()` so this page
 *    is unreachable on production builds.
 *  - Metadata sets `noindex, nofollow` as a defense-in-depth measure.
 */

export const metadata: Metadata = {
  title: "Components Showcase (dev only)",
  robots: { index: false, follow: false },
};

interface Section {
  id: string;
  title: string;
  subtitle: string;
  Component: React.ComponentType;
}

const SECTIONS: Section[] = [
  {
    id: "primitives",
    title: "Primitives",
    subtitle: "src/tools/templates/_shared (4개)",
    Component: PrimitivesShowcase,
  },
  {
    id: "layout",
    title: "Layout",
    subtitle: "Breadcrumb · Header · Shell · Actions",
    Component: LayoutShowcase,
  },
  {
    id: "sections",
    title: "Content Sections",
    subtitle: "HowTo · UseCases · Features · Guide · FAQ · Related",
    Component: SectionsShowcase,
  },
  {
    id: "slots",
    title: "Monetization / Feedback Slots",
    subtitle: "Feedback · AdSlot · Affiliate · Pro · AiUpgrade",
    Component: SlotsShowcase,
  },
  {
    id: "infra",
    title: "Infra",
    subtitle: "ErrorBoundary · Loading",
    Component: InfraShowcase,
  },
  {
    id: "templates",
    title: "Templates",
    subtitle: "9 templates (5 live + 4 skeleton)",
    Component: TemplatesShowcase,
  },
];

export default async function DevComponentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Header note */}
      <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
        <p className="text-sm font-semibold text-amber-900">
          Development environment only.
        </p>
        <p className="mt-1 text-xs text-amber-800">
          이 페이지는 <code>NODE_ENV=development</code> 에서만 접근 가능합니다.
          프로덕션 빌드에서는 <code>404</code> 를 반환합니다 (
          <code>app/[locale]/dev/layout.tsx</code>). 메타데이터도{" "}
          <code>noindex, nofollow</code> 입니다.
        </p>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Components Showcase
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Phase 1 인프라 출력물(프리미티브 4 · 컴포넌트 15 · 템플릿 9) 시각 디버깅.
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[200px_minmax(0,1fr)]">
        {/* Sticky TOC */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <nav aria-label="Sections" className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Contents
            </p>
            <ul className="space-y-2 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block rounded-md px-2 py-1.5 text-foreground transition-colors hover:bg-muted hover:text-primary"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Sections */}
        <div className="min-w-0 space-y-16">
          {SECTIONS.map(({ id, title, subtitle, Component }) => (
            <section
              key={id}
              id={id}
              className="scroll-mt-6 border-t border-border pt-8 first:border-t-0 first:pt-0"
            >
              <header className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              </header>
              <Component />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
