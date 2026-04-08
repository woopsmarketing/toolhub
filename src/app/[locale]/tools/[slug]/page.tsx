export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  return (
    <div>
      <h1>DEBUG TEST</h1>
      <p>Slug: {slug}</p>
      <p>Locale: {locale}</p>
    </div>
  );
}
