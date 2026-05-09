/**
 * Toolhub — ToolJsonLd (Phase 1 PR-6)
 *
 * 서버 컴포넌트. 단일 툴 페이지에 schema.org JSON-LD `<script>` 블록을 주입한다.
 *
 * 포함 스키마:
 *   1. WebApplication (또는 SoftwareApplication)
 *   2. BreadcrumbList
 *   3. FAQPage          (faq[locale] 가 있을 때만)
 *   4. HowTo            (howToUse[locale] 가 있을 때만)
 *
 * `<script type="application/ld+json">` 의 본문은 JSON.stringify 결과로 주입되며,
 * 이는 schema.org / Google Rich Results 가이드를 따른다.
 */

import {
  getWebApplicationJsonLd,
  getBreadcrumbJsonLd,
  getFaqJsonLd,
  getHowToJsonLd,
} from "@/lib/jsonld";
import { categories } from "@/config/categories";
import type { ToolConfig, Locale } from "@/config/types";

interface ToolJsonLdProps {
  tool: ToolConfig;
  locale: Locale;
  /** Optional. 미지정 시 NEXT_PUBLIC_BASE_URL 또는 toolhub.co.kr fallback. */
  baseUrl?: string;
  /** Optional. 미지정 시 categories.ts 에서 locale 매핑 → 없으면 tool.category id. */
  categoryName?: string;
}

const DEFAULT_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://toolhub.co.kr";

export default function ToolJsonLd({
  tool,
  locale,
  baseUrl = DEFAULT_BASE_URL,
  categoryName,
}: ToolJsonLdProps) {
  const resolvedCategoryName =
    categoryName ?? categories[tool.category]?.name?.[locale] ?? tool.category;

  const schemas: Array<Record<string, unknown> | null> = [
    getWebApplicationJsonLd(tool, locale, baseUrl),
    getBreadcrumbJsonLd(tool, locale, baseUrl, resolvedCategoryName),
    getFaqJsonLd(tool, locale),
    getHowToJsonLd(tool, locale),
  ];

  const valid = schemas.filter(
    (s): s is Record<string, unknown> => s !== null
  );

  return (
    <>
      {valid.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
