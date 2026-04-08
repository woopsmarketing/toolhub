import { notFound } from "next/navigation";
import { getToolBySlug, getAllTools } from "@/tools/registry";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
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

  return (
    <ToolPageLayout tool={tool}>
      <ToolLoader slug={slug} />
    </ToolPageLayout>
  );
}
