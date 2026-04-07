"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronRight, CheckCircle2 } from "lucide-react";
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

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {seo.title}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">{seo.description}</p>
      </div>

      {/* Tool Area */}
      <div className="mb-12 rounded-2xl border border-border bg-card p-6 shadow-sm">
        {children}
      </div>

      {/* How to Use */}
      {howToUse && howToUse.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            {t("common.howToUse")}
          </h2>
          <ol className="space-y-3">
            {howToUse.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-muted-foreground leading-relaxed">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Use Cases */}
      {useCases && useCases.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            {t("common.useCases")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {useCases.map((uc, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-muted/30 p-5"
              >
                <h3 className="mb-2 font-semibold text-foreground">
                  {uc.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {uc.description}
                </p>
                {uc.example && (
                  <div className="mt-3 rounded-lg bg-white p-3 text-xs font-mono">
                    <div className="text-muted-foreground">
                      <span className="text-primary">입력:</span>{" "}
                      {uc.example.input}
                    </div>
                    <div className="mt-1 text-foreground">
                      <span className="text-green-600">결과:</span>{" "}
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
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            {t("common.features")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feat, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                <span className="text-muted-foreground">{feat}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Guide */}
      {guide && (
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            {guide.title}
          </h2>
          <div className="prose prose-gray max-w-none text-muted-foreground leading-relaxed">
            {guide.content.split("\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq && faq.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            {t("common.faq")}
          </h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-border bg-card"
              >
                <summary className="cursor-pointer px-5 py-4 text-foreground font-medium hover:text-primary transition-colors">
                  {item.q}
                </summary>
                <div className="border-t border-border px-5 py-4 text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            {t("common.relatedTools")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {relatedTools.map((rt) => {
              if (!rt) return null;
              const rtSeo = rt.seo[locale] || rt.seo["ko"];
              return (
                <Link
                  key={rt.slug}
                  href={`/tools/${rt.slug}`}
                  className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <h3 className="font-semibold text-foreground">
                    {rtSeo.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {rtSeo.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
