import { notFound } from "next/navigation";
import { getToolBySlug, getAllTools } from "@/tools/registry";
import ToolLoader from "@/components/tools/ToolLoader";

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
  if (!tool) notFound();

  const seo = tool.seo[locale] || tool.seo["ko"];

  return (
    <div style={{ padding: "40px" }}>
      <h1>{seo.title}</h1>
      <p>{seo.description}</p>
      <hr />
      <ToolLoader slug={slug} />
    </div>
  );
}
