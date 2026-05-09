/**
 * Toolhub — JSON-LD (schema.org) generators (Phase 1 PR-6)
 *
 * 모든 생성기는 순수 함수이며, JSON.stringify 가능한 plain object 를 반환한다.
 * locale 별 (ko / en) 콘텐츠를 분기해서 inLanguage / 텍스트를 채운다.
 *
 * Schema.org 타입:
 *   - WebApplication / SoftwareApplication  (tool.schema.type 로 선택, 기본 WebApplication)
 *   - BreadcrumbList                         (Home → Category → Tool)
 *   - FAQPage                                (faq[locale] 가 있을 때만)
 *   - HowTo                                  (howToUse[locale] 가 있을 때만)
 *
 * 이 모듈은 `src/lib/seo.ts` 의 기존 generator 와 함께 사용 가능하지만,
 * 신규 코드는 본 모듈만 사용하는 것을 권장한다 (locale-aware 가 더 정확함).
 */

import type { ToolConfig, Locale } from "@/config/types";

/** Schema.org JSON-LD object (자유 형태). */
type JsonLdObject = Record<string, unknown>;

interface SeoBlock {
  title: string;
  description: string;
  keywords: string[];
}

/** locale 우선, 없으면 ko, 둘 다 없으면 첫 사용 가능한 값. */
function pickSeo(tool: ToolConfig, locale: Locale): SeoBlock {
  const fromLocale = tool.seo[locale];
  if (fromLocale) return fromLocale;
  const ko = tool.seo["ko"];
  if (ko) return ko;
  const first = Object.values(tool.seo)[0];
  return first ?? { title: tool.slug, description: "", keywords: [] };
}

function pickList<T>(
  bucket: { [locale: string]: T[] } | undefined,
  locale: Locale
): T[] {
  if (!bucket) return [];
  return bucket[locale] ?? bucket["ko"] ?? [];
}

function inLanguageTag(locale: Locale): string {
  return locale === "ko" ? "ko-KR" : "en-US";
}

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

/**
 * WebApplication / SoftwareApplication.
 * tool.schema?.type 으로 SoftwareApplication 선택 가능 (기본 WebApplication).
 * tool.schema?.applicationCategory 로 카테고리 override 가능 (기본 UtilitiesApplication).
 */
export function getWebApplicationJsonLd(
  tool: ToolConfig,
  locale: Locale,
  baseUrl: string
): JsonLdObject {
  const seo = pickSeo(tool, locale);
  const type = tool.schema?.type ?? "WebApplication";
  const applicationCategory =
    tool.schema?.applicationCategory ?? "UtilitiesApplication";
  const url = joinUrl(baseUrl, `/${locale}/tools/${tool.category}/${tool.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": type,
    name: seo.title,
    url,
    description: seo.description,
    applicationCategory,
    operatingSystem: "Any",
    inLanguage: inLanguageTag(locale),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/**
 * BreadcrumbList: Home → Category → Tool.
 * categoryName 은 locale 에 맞춰 호출자가 미리 결정해서 넘긴다.
 */
export function getBreadcrumbJsonLd(
  tool: ToolConfig,
  locale: Locale,
  baseUrl: string,
  categoryName: string
): JsonLdObject {
  const seo = pickSeo(tool, locale);
  const homeName = locale === "ko" ? "홈" : "Home";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: homeName,
        item: joinUrl(baseUrl, `/${locale}`),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: joinUrl(baseUrl, `/${locale}/categories/${tool.category}`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: seo.title,
        item: joinUrl(baseUrl, `/${locale}/tools/${tool.category}/${tool.slug}`),
      },
    ],
  };
}

/**
 * FAQPage. faq[locale] 이 비어 있으면 null.
 */
export function getFaqJsonLd(
  tool: ToolConfig,
  locale: Locale
): JsonLdObject | null {
  const items = pickList(tool.faq, locale);
  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/**
 * HowTo. howToUse[locale] 이 비어 있으면 null.
 * step 은 string 배열 → HowToStep 으로 매핑.
 */
export function getHowToJsonLd(
  tool: ToolConfig,
  locale: Locale
): JsonLdObject | null {
  const steps = pickList(tool.howToUse, locale);
  if (steps.length === 0) return null;
  const seo = pickSeo(tool, locale);

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: seo.title,
    description: seo.description,
    inLanguage: inLanguageTag(locale),
    step: steps.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text,
    })),
  };
}
