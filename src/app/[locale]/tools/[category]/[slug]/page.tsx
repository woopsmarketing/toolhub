import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getToolBySlug, getAllTools } from "@/tools/registry";
import { generateToolMetadata } from "@/lib/seo";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import ToolLoader from "@/components/tools/ToolLoader";
import ToolJsonLd from "@/components/seo/ToolJsonLd";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/config/types";

/**
 * Tool detail page (Phase 1 PR-12).
 *
 * URL: /[locale]/tools/[category]/[slug]
 * 이전 URL `/[locale]/tools/[slug]` 은 `next.config.ts` 의 `redirects()` 가
 * 301 로 새 URL 로 일괄 이전한다 (29 tools × 2 locales = 58 redirects).
 *
 * 이 파일은 PR-12 이후 유일한 툴 상세 라우트이며, 기존 `[slug]/page.tsx` 는
 * 삭제됐다 (Option A). 절대 직접 수정하지 말 것 — 새 툴은 registry.ts 등록만
 * 하면 자동 노출된다.
 */

export async function generateStaticParams() {
  return getAllTools().flatMap((tool) =>
    routing.locales.map((locale) => ({
      locale,
      category: tool.category,
      slug: tool.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  // 잘못된 카테고리 prefix 로 들어온 경우는 메타도 채우지 않는다 (notFound 가 됨).
  if (tool.category !== category) return {};
  return generateToolMetadata(tool, locale);
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  setRequestLocale(locale);

  const tool = getToolBySlug(slug);
  if (!tool) notFound();
  // URL 의 카테고리 prefix 와 registry 의 tool.category 가 다르면 404.
  // 예: `/ko/tools/text/loan-calculator` → loan-calculator 는 calculator 카테고리이므로 404.
  if (tool.category !== category) notFound();

  return (
    <>
      <ToolJsonLd tool={tool} locale={locale as Locale} />
      <ToolPageLayout tool={tool}>
        <ToolLoader slug={slug} />
      </ToolPageLayout>
    </>
  );
}
