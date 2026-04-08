import { getToolBySlug } from "@/tools/registry";

export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  let toolTitle = "NOT FOUND";
  try {
    const tool = getToolBySlug(slug);
    toolTitle = tool?.seo?.[locale]?.title ?? "NO TITLE";
  } catch (e) {
    toolTitle = "ERROR: " + String(e);
  }

  return (
    <div style={{ padding: "40px", fontFamily: "monospace" }}>
      <h1>TEST A: registry import, NO generateStaticParams</h1>
      <p>Slug: {slug}</p>
      <p>Locale: {locale}</p>
      <p>Tool title: {toolTitle}</p>
    </div>
  );
}
