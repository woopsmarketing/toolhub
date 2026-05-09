/**
 * Toolhub — SiteJsonLd
 *
 * Server component. Root layout 에 주입되어 사이트 전체 메타 (Organization +
 * WebSite + SearchAction) 를 한 번 노출한다. 툴 페이지의 ToolJsonLd 와 별개로
 * 모든 페이지 (홈/카테고리/about 등) 에 동일하게 적용된다.
 *
 * E-E-A-T 신호 + LLM 이 "Toolhub 에서 ..." 인용할 때 entity 인식 강화.
 */

import { getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/jsonld";
import type { Locale } from "@/config/types";

interface SiteJsonLdProps {
  locale: Locale;
  baseUrl?: string;
}

const DEFAULT_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://toolhub.co.kr";

export default function SiteJsonLd({
  locale,
  baseUrl = DEFAULT_BASE_URL,
}: SiteJsonLdProps) {
  const schemas = [
    getOrganizationJsonLd(baseUrl),
    getWebSiteJsonLd(baseUrl, locale),
  ];
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
