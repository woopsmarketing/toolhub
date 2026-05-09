/**
 * Toolhub — JSON-LD (schema.org) generators
 *
 * 모든 생성기는 순수 함수이며, JSON.stringify 가능한 plain object 를 반환한다.
 * locale 별 (ko / en) 콘텐츠를 분기해서 inLanguage / 텍스트를 채운다.
 *
 * Schema.org 타입 (per-tool):
 *   - WebApplication / SoftwareApplication  (tool.schema.type 로 선택, 기본 WebApplication)
 *   - BreadcrumbList                         (Home → Category → Tool)
 *   - FAQPage (+ speakable)                  (faq[locale] 가 있을 때만)
 *   - HowTo                                  (howToUse[locale] 가 있을 때만)
 *   - TechArticle                            (guide[locale] 이 있을 때만)
 *
 * Schema.org 타입 (site-wide, root layout):
 *   - Organization                           (Toolhub 자체)
 *   - WebSite (+ SearchAction)               (sitelinks search box)
 *
 * AEO 강화 (2026-05-10):
 *   - datePublished / dateModified : freshness 신호
 *   - isAccessibleForFree: true     : "무료" 명시
 *   - speakable                     : 음성 답변 (ChatGPT Voice / Siri)
 *   - inLanguage                    : 모든 entity 에 적용
 */

import type { ToolConfig, Locale } from "@/config/types";

/** Schema.org JSON-LD object (자유 형태). */
type JsonLdObject = Record<string, unknown>;

interface SeoBlock {
  title: string;
  description: string;
  keywords: string[];
}

/** 빌드 시각 — lastUpdated 누락 시 fallback 으로 사용. */
const BUILD_DATE = new Date().toISOString().split("T")[0];

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
  locale: Locale,
): T[] {
  if (!bucket) return [];
  return bucket[locale] ?? bucket["ko"] ?? [];
}

function pickGuide(
  tool: ToolConfig,
  locale: Locale,
): { title: string; content: string } | null {
  return tool.guide?.[locale] ?? tool.guide?.["ko"] ?? null;
}

function inLanguageTag(locale: Locale): string {
  return locale === "ko" ? "ko-KR" : "en-US";
}

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

function resolveDates(tool: ToolConfig): {
  datePublished: string;
  dateModified: string;
} {
  const datePublished = tool.datePublished ?? tool.lastUpdated ?? BUILD_DATE;
  const dateModified = tool.lastUpdated ?? BUILD_DATE;
  return { datePublished, dateModified };
}

/**
 * WebApplication / SoftwareApplication.
 * tool.schema?.type 으로 SoftwareApplication 선택 가능 (기본 WebApplication).
 * tool.schema?.applicationCategory 로 카테고리 override 가능 (기본 UtilitiesApplication).
 */
export function getWebApplicationJsonLd(
  tool: ToolConfig,
  locale: Locale,
  baseUrl: string,
): JsonLdObject {
  const seo = pickSeo(tool, locale);
  const type = tool.schema?.type ?? "WebApplication";
  const applicationCategory =
    tool.schema?.applicationCategory ?? "UtilitiesApplication";
  const url = joinUrl(baseUrl, `/${locale}/tools/${tool.category}/${tool.slug}`);
  const features = pickList(tool.features, locale);
  const { datePublished, dateModified } = resolveDates(tool);

  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webapp`,
    name: seo.title,
    url,
    description: seo.description,
    applicationCategory,
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    inLanguage: inLanguageTag(locale),
    isAccessibleForFree: true,
    datePublished,
    dateModified,
    keywords: seo.keywords.join(", "),
    featureList: features,
    publisher: {
      "@type": "Organization",
      name: "Toolhub",
      url: baseUrl,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
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
  categoryName: string,
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
 * FAQPage with speakable. faq[locale] 이 비어 있으면 null.
 *
 * speakable: ChatGPT Voice / Siri / Google Assistant 같은 voice answer 시스템이
 * 답변에 직접 사용할 수 있도록 표시한다 (질문/답변 노드 모두 발화 가능).
 */
export function getFaqJsonLd(
  tool: ToolConfig,
  locale: Locale,
): JsonLdObject | null {
  const items = pickList(tool.faq, locale);
  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: inLanguageTag(locale),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-speakable]", "[itemprop='acceptedAnswer']"],
    },
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
  locale: Locale,
): JsonLdObject | null {
  const steps = pickList(tool.howToUse, locale);
  if (steps.length === 0) return null;
  const seo = pickSeo(tool, locale);
  const { datePublished, dateModified } = resolveDates(tool);

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: seo.title,
    description: seo.description,
    inLanguage: inLanguageTag(locale),
    datePublished,
    dateModified,
    step: steps.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text,
    })),
  };
}

/**
 * TechArticle (for guide content).
 * tool.guide[locale] 가 있을 때만 발화. LLM 이 "Toolhub 의 가이드에 따르면..." 인용 가능하게 만든다.
 */
export function getTechArticleJsonLd(
  tool: ToolConfig,
  locale: Locale,
  baseUrl: string,
): JsonLdObject | null {
  const guide = pickGuide(tool, locale);
  if (!guide || !guide.content) return null;
  const seo = pickSeo(tool, locale);
  const url = joinUrl(baseUrl, `/${locale}/tools/${tool.category}/${tool.slug}`);
  const { datePublished, dateModified } = resolveDates(tool);

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${url}#guide`,
    headline: guide.title,
    description: seo.description,
    articleBody: guide.content,
    inLanguage: inLanguageTag(locale),
    datePublished,
    dateModified,
    isAccessibleForFree: true,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "Toolhub", url: baseUrl },
    publisher: {
      "@type": "Organization",
      name: "Toolhub",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: joinUrl(baseUrl, "/icon.png"),
      },
    },
  };
}

// ---- Site-wide (root layout) generators ----

/**
 * Organization JSON-LD — site root 에 1회 주입.
 * E-E-A-T (Expertise/Experience/Authoritativeness/Trust) 신호.
 */
export function getOrganizationJsonLd(baseUrl: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}#organization`,
    name: "Toolhub",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: joinUrl(baseUrl, "/icon.png"),
    },
    description:
      "텍스트, 코드, 계산, 변환, 이미지, PDF 등 다양한 분야의 무료 온라인 도구 모음. 모든 처리는 브라우저 내에서 이루어지며 데이터는 서버로 전송되지 않는다.",
    foundingDate: "2025-01-01",
    knowsLanguage: ["ko-KR", "en-US"],
  };
}

/**
 * WebSite JSON-LD with SearchAction — site root 에 1회 주입.
 * Google sitelinks search box + LLM 이 "Toolhub 에서 [keyword] 검색" 패턴 인식.
 */
export function getWebSiteJsonLd(baseUrl: string, locale: Locale): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}#website`,
    name: "Toolhub",
    url: baseUrl,
    inLanguage: inLanguageTag(locale),
    publisher: { "@id": `${baseUrl}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/${locale}/tools?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * ItemList JSON-LD — 카테고리 페이지에 사용.
 * 해당 카테고리의 툴 목록을 구조화하여 LLM/검색엔진이 카테고리 단위로 인식하게 한다.
 */
export function getCategoryItemListJsonLd(
  tools: ToolConfig[],
  locale: Locale,
  baseUrl: string,
  categoryName: string,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: categoryName,
    inLanguage: inLanguageTag(locale),
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => {
      const seo = pickSeo(tool, locale);
      return {
        "@type": "ListItem",
        position: index + 1,
        url: joinUrl(
          baseUrl,
          `/${locale}/tools/${tool.category}/${tool.slug}`,
        ),
        name: seo.title,
      };
    }),
  };
}
