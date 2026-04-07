import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { categories, categoryOrder } from "@/config/categories";
import { getToolsByCategory } from "@/tools/registry";
import { ChevronRight } from "lucide-react";

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
  const { category } = await params;
  const t = useTranslations();

  if (!categories[category]) notFound();

  const cat = categories[category];
  const tools = getToolsByCategory(category);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">
          {t("common.home")}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/categories" className="hover:text-primary transition-colors">
          {t("common.categories")}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">
          {t(`categories.${category}`)}
        </span>
      </nav>

      <div className="mb-8">
        <div
          className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
        >
          <span className="text-xl">
            {category === "text" && "📝"}
            {category === "developer" && "💻"}
            {category === "calculator" && "🔢"}
            {category === "converter" && "🔄"}
            {category === "generator" && "✨"}
            {category === "image" && "🖼️"}
            {category === "pdf" && "📄"}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          {t(`categories.${category}`)}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t(`categories.${category}Desc`)}
        </p>
      </div>

      {tools.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const seo = tool.seo["ko"];
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {seo.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {seo.description}
                </p>
                <div className="mt-3">
                  <span className="rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
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
