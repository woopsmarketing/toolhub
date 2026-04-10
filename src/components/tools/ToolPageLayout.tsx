"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronRight, CheckCircle2, Info, Lightbulb, HelpCircle, ArrowRight } from "lucide-react";
import { type ToolConfig } from "@/config/types";
import { getToolBySlug } from "@/tools/registry";

interface ToolPageLayoutProps {
  tool: ToolConfig;
  children: React.ReactNode;
}

export default function ToolPageLayout({ tool, children }: ToolPageLayoutProps) {
  const t = useTranslations();
  const locale = useLocale();

  const seo = tool.seo[locale] || tool.seo["ko"];
  const howToUse = tool.howToUse[locale] || tool.howToUse["ko"];
  const features = tool.features[locale] || tool.features["ko"];
  const useCases = tool.useCases?.[locale] || tool.useCases?.["ko"];
  const guide = tool.guide?.[locale] || tool.guide?.["ko"];
  const faq = tool.faq[locale] || tool.faq["ko"];
  const relatedTools = tool.relatedTools
    .map((slug) => getToolBySlug(slug))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">
          {t("common.home")}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/categories/${tool.category}`}
          className="hover:text-primary transition-colors"
        >
          {t(`categories.${tool.category}`)}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{seo.title}</span>
      </nav>

      {/* Title + Description Card */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl leading-tight">
          {seo.title}
        </h1>
        <div className="mt-4 flex gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            {seo.description}
          </p>
        </div>
      </div>

      {/* Tool Area */}
      <div className="mb-14 rounded-2xl border border-border bg-card p-6 shadow-sm">
        {children}
      </div>

      {/* How to Use */}
      {howToUse && howToUse.length > 0 && (
        <section className="mb-14">
          <div className="mb-5 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold text-foreground">
              {t("common.howToUse")}
            </h2>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <ol className="space-y-4">
              {howToUse.map((step, i) => (
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
      )}

      {/* Use Cases */}
      {useCases && useCases.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-5 text-xl font-bold text-foreground">
            {t("common.useCases")}
          </h2>
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
      )}

      {/* Features */}
      {features && features.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-5 text-xl font-bold text-foreground">
            {t("common.features")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feat, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                <span className="text-sm text-muted-foreground leading-relaxed">{feat}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Guide */}
      {guide && (
        <section className="mb-14">
          <h2 className="mb-5 text-xl font-bold text-foreground">
            {guide.title}
          </h2>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
              {guide.content.split("\n").filter(p => p.trim()).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq && faq.length > 0 && (
        <section className="mb-14">
          <div className="mb-5 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-purple-500" />
            <h2 className="text-xl font-bold text-foreground">
              {t("common.faq")}
            </h2>
          </div>
          <div className="space-y-3">
            {faq.map((item, i) => (
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
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-5 text-xl font-bold text-foreground">
            {t("common.relatedTools")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((rt) => {
              if (!rt) return null;
              const rtSeo = rt.seo[locale] || rt.seo["ko"];
              return (
                <Link
                  key={rt.slug}
                  href={`/tools/${rt.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {rtSeo.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {rtSeo.description}
                    </p>
                  </div>
                  <ArrowRight className="ml-3 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
