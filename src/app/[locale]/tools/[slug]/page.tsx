import { getToolBySlug, getAllTools } from "@/tools/registry";

export async function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tool = getToolBySlug(slug);

  return (
    <div>
      <h1>DEBUG: {slug}</h1>
      <p>Locale: {locale}</p>
      <p>Tool found: {tool ? "YES" : "NO"}</p>
      <p>Title: {tool?.seo?.[locale]?.title ?? "N/A"}</p>
    </div>
  );
}
