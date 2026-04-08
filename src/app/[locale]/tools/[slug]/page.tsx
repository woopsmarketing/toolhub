import { notFound } from "next/navigation";
import { getToolBySlug, getAllTools } from "@/tools/registry";
import { generateToolMetadata, generateFaqJsonLd, generateWebAppJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

export async function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return generateToolMetadata(tool, locale);
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  // Dynamic import: loads the "use client" component at render time
  // This avoids importing client components in the server module graph
  let ToolComponent: React.ComponentType;
  try {
    const mod = await import(`@/tools/${slug}/component`);
    ToolComponent = mod.default;
  } catch {
    notFound();
  }

  const faqJsonLd = generateFaqJsonLd(tool, locale);
  const webAppJsonLd = generateWebAppJsonLd(tool, locale);
  const seo = tool.seo[locale] || tool.seo["ko"];
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: `/${locale}` },
    { name: tool.category, url: `/${locale}/categories/${tool.category}` },
    { name: seo.title, url: `/${locale}/tools/${tool.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <ToolPageLayout tool={tool}>
        <ToolComponent />
      </ToolPageLayout>
    </>
  );
}
