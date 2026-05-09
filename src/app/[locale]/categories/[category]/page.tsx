import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { categories, categoryOrder } from "@/config/categories";
import { getToolsByCategory } from "@/tools/registry";
import { ChevronRight } from "lucide-react";
import { getCategoryItemListJsonLd } from "@/lib/jsonld";
import type { Locale } from "@/config/types";

const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://toolhub.co.kr"
).replace(/\/+$/, "");

export async function generateStaticParams() {
  return categoryOrder.map((cat) => ({ category: cat }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const t = await getTranslations({ locale });

  if (!categories[category]) return {};

  return {
    title: `${t(`categories.${category}`)} - Toolhub`,
    description: t(`categories.${category}Desc`),
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  if (!categories[category]) notFound();

  const cat = categories[category];
  const tools = getToolsByCategory(category);
  const localeTyped: Locale = locale === "en" ? "en" : "ko";
  const itemListJsonLd =
    tools.length > 0
      ? getCategoryItemListJsonLd(
          tools,
          localeTyped,
          BASE_URL,
          t(`categories.${category}`),
        )
      : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      {/* Breadcrumb */}
      <nav
        aria-label={t("common.breadcrumbLabel")}
        className="mb-6 text-sm text-muted-foreground"
      >
        <ol className="flex items-center gap-1.5">
          <li className="flex items-center">
            <Link href="/" className="hover:text-primary transition-colors">
              {t("common.home")}
            </Link>
          </li>
          <li aria-hidden="true" className="flex items-center">
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </li>
          <li className="flex items-center">
            <Link
              href="/categories"
              className="hover:text-primary transition-colors"
            >
              {t("common.categories")}
            </Link>
          </li>
          <li aria-hidden="true" className="flex items-center">
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </li>
          <li className="flex items-center">
            <span aria-current="page" className="font-medium text-foreground">
              {t(`categories.${category}`)}
            </span>
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <div
          className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
          aria-hidden="true"
        >
          <span className="text-xl">
            {category === "text" && "📝"}
            {category === "developer" && "💻"}
            {category === "calculator" && "🔢"}
            {category === "converter" && "🔄"}
            {category === "image" && "🖼️"}
            {category === "pdf" && "📄"}
            {category === "seo" && "🔍"}
            {category === "security" && "🔒"}
            {category === "productivity" && "⏱️"}
            {category === "ai" && "✨"}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          {t(`categories.${category}`)}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t(`categories.${category}Desc`)}
        </p>
      </header>

      {tools.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const seo = tool.seo[locale] || tool.seo["ko"];
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.category}/${tool.slug}`}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {seo.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {seo.description}
                </p>
                <div className="mt-3">
                  <span className="rounded-md bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                    {t("common.free")}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            {t("common.comingSoon")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            이 카테고리의 도구를 준비 중입니다.
          </p>
        </div>
      )}
    </div>
  );
}
