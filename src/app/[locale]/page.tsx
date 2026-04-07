import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import {
  Search,
  Zap,
  Shield,
  UserX,
  DollarSign,
  ArrowRight,
  Type,
  Code,
  Calculator,
  ArrowLeftRight,
  Sparkles,
  Image,
  FileText,
} from "lucide-react";
import { categories, categoryOrder } from "@/config/categories";
import { getAllTools, getToolsByCategory, getToolCount } from "@/tools/registry";

const categoryIcons: Record<string, React.ReactNode> = {
  text: <Type className="h-5 w-5" />,
  developer: <Code className="h-5 w-5" />,
  calculator: <Calculator className="h-5 w-5" />,
  converter: <ArrowLeftRight className="h-5 w-5" />,
  generator: <Sparkles className="h-5 w-5" />,
  image: <Image className="h-5 w-5" />,
  pdf: <FileText className="h-5 w-5" />,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: `${t("siteName")} - ${t("siteDescription")}`,
    description: t("siteDescription"),
  };
}

export default function HomePage() {
  const t = useTranslations();
  const allTools = getAllTools();
  const toolCount = getToolCount();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent to-background pb-16 pt-20 sm:pb-24 sm:pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.08),transparent_50%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("home.heroTitle").split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line.includes("무료") || line.includes("free") ? (
                  <span className="text-primary">{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {t("home.heroSubtitle")}
          </p>

          {/* Search */}
          <div className="mx-auto mt-10 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("common.search")}
                className="w-full rounded-2xl border border-border bg-white px-12 py-4 text-base shadow-lg shadow-primary/5 transition-all focus:border-primary focus:outline-none focus:shadow-primary/10"
              />
            </div>
          </div>

          <p className="mt-6 text-sm font-medium text-muted-foreground">
            {t("home.toolCount", { count: toolCount })}
          </p>
        </div>
      </section>

      {/* Categories + Tools */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {categoryOrder.map((catKey) => {
            const cat = categories[catKey];
            const catTools = getToolsByCategory(catKey);
            if (catTools.length === 0) return null;

            return (
              <div key={catKey}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      {categoryIcons[catKey]}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">
                        {t(`categories.${catKey}`)}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {catTools.length}개 도구
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/categories/${catKey}`}
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {t("home.viewAll")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {catTools.map((tool) => {
                    const seo = tool.seo["ko"];
                    return (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
                      >
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {seo.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {seo.description}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                            {t("common.free")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {t(`categories.${tool.category}`)}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Toolhub */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-bold text-foreground">
            {t("home.whyTitle")}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <DollarSign className="h-6 w-6" />,
                title: t("home.whyFree"),
                desc: t("home.whyFreeDesc"),
                color: "#10B981",
              },
              {
                icon: <UserX className="h-6 w-6" />,
                title: t("home.whyNoSignup"),
                desc: t("home.whyNoSignupDesc"),
                color: "#8B5CF6",
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: t("home.whyFast"),
                desc: t("home.whyFastDesc"),
                color: "#F59E0B",
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: t("home.whySecure"),
                desc: t("home.whySecureDesc"),
                color: "#3B82F6",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `${item.color}15`,
                    color: item.color,
                  }}
                >
                  {item.icon}
                </div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
