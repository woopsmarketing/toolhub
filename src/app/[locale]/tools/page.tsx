import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllTools } from "@/tools/registry";
import { categories } from "@/config/categories";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: `${t("allTools")} - Toolhub`,
    description: t("siteDescription"),
  };
}

export default function AllToolsPage() {
  const t = useTranslations();
  const allTools = getAllTools();

  // Group by category
  const grouped: Record<string, typeof allTools> = {};
  allTools.forEach((tool) => {
    if (!grouped[tool.category]) grouped[tool.category] = [];
    grouped[tool.category].push(tool);
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">
        {t("common.allTools")}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {allTools.length}개의 무료 온라인 도구를 사용해보세요.
      </p>

      <div className="mt-10 space-y-10">
        {Object.entries(grouped).map(([catKey, tools]) => {
          const cat = categories[catKey];
          return (
            <div key={catKey}>
              <div className="mb-4 flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: cat?.color }}
                />
                <h2 className="text-lg font-semibold text-foreground">
                  {t(`categories.${catKey}`)}
                </h2>
                <span className="text-sm text-muted-foreground">
                  ({tools.length})
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tools.map((tool) => {
                  const seo = tool.seo["ko"];
                  return (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
                    >
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {seo.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                        {seo.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
