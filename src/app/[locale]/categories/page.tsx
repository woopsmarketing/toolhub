import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { categories, categoryOrder } from "@/config/categories";
import { getToolsByCategory } from "@/tools/registry";
import {
  Type,
  Code,
  Calculator,
  ArrowLeftRight,
  Sparkles,
  Image,
  FileText,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  text: <Type className="h-6 w-6" />,
  developer: <Code className="h-6 w-6" />,
  calculator: <Calculator className="h-6 w-6" />,
  converter: <ArrowLeftRight className="h-6 w-6" />,
  generator: <Sparkles className="h-6 w-6" />,
  image: <Image className="h-6 w-6" />,
  pdf: <FileText className="h-6 w-6" />,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: `${t("categories")} - Toolhub`,
    description: t("siteDescription"),
  };
}

export default function CategoriesPage() {
  const t = useTranslations();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">
        {t("common.categories")}
      </h1>
      <p className="mt-2 text-muted-foreground">
        카테고리별로 필요한 도구를 찾아보세요.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryOrder.map((catKey) => {
          const cat = categories[catKey];
          const tools = getToolsByCategory(catKey);

          return (
            <Link
              key={catKey}
              href={`/categories/${catKey}`}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: `${cat.color}15`,
                  color: cat.color,
                }}
              >
                {categoryIcons[catKey]}
              </div>
              <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {t(`categories.${catKey}`)}
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {t(`categories.${catKey}Desc`)}
              </p>
              <div className="mt-3 text-xs font-medium text-primary">
                {tools.length > 0
                  ? `${tools.length}개 도구`
                  : t("common.comingSoon")}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
