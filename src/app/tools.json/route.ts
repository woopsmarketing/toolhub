import { NextResponse } from "next/server";
import { getAllTools } from "@/tools/registry";
import { categories, categoryOrder } from "@/config/categories";
import type { ToolConfig, Locale } from "@/config/types";

const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://toolhub.co.kr"
).replace(/\/+$/, "");

/**
 * /tools.json — Machine-readable tool catalog (AEO).
 *
 * Schema.org Dataset + ItemList 형식. LLM/검색엔진/외부 통합이 한 번의 fetch
 * 로 전체 카탈로그를 인식할 수 있도록 한다.
 *
 * Cache: ISR 1 hour (revalidate). 새 툴 추가 시 자동 갱신.
 */

export const revalidate = 3600;

function pickSeo(tool: ToolConfig, locale: Locale) {
  return tool.seo[locale] ?? tool.seo["ko"] ?? Object.values(tool.seo)[0]!;
}

function isPublished(tool: ToolConfig): boolean {
  return (tool.status ?? "published") === "published";
}

function buildToolEntry(tool: ToolConfig, locale: Locale, position: number) {
  const seo = pickSeo(tool, locale);
  const url = `${BASE_URL}/${locale}/tools/${tool.category}/${tool.slug}`;
  const features = tool.features?.[locale] ?? tool.features?.["ko"] ?? [];

  return {
    "@type": "ListItem",
    position,
    item: {
      "@type": tool.schema?.type ?? "WebApplication",
      "@id": `${url}#webapp`,
      name: seo.title,
      url,
      description: seo.description,
      applicationCategory:
        tool.schema?.applicationCategory ?? "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      isAccessibleForFree: true,
      inLanguage: locale === "ko" ? "ko-KR" : "en-US",
      keywords: seo.keywords,
      featureList: features,
      datePublished: tool.datePublished ?? tool.lastUpdated ?? null,
      dateModified: tool.lastUpdated ?? null,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  };
}

export async function GET() {
  const all = getAllTools().filter(isPublished);

  const catalog = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${BASE_URL}/tools.json`,
    name: "Toolhub Tools Catalog",
    description:
      "Machine-readable catalog of all free online tools provided by Toolhub. " +
      "Includes name, URL, category, features, and metadata for each tool in both Korean and English.",
    url: `${BASE_URL}/tools.json`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: {
      "@type": "Organization",
      name: "Toolhub",
      url: BASE_URL,
    },
    keywords: ["online tools", "free tools", "web utilities", "developer tools"],
    inLanguage: ["ko-KR", "en-US"],
    dateModified: new Date().toISOString(),
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: `${BASE_URL}/tools.json`,
    },
    hasPart: {
      "@type": "ItemList",
      numberOfItems: all.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: all.flatMap((tool, idx) => [
        buildToolEntry(tool, "ko", idx * 2 + 1),
        buildToolEntry(tool, "en", idx * 2 + 2),
      ]),
    },
    about: categoryOrder.map((catId) => ({
      "@type": "DefinedTerm",
      name: categories[catId]?.name?.ko ?? catId,
      alternateName: categories[catId]?.name?.en ?? catId,
      identifier: catId,
      url: `${BASE_URL}/ko/categories/${catId}`,
    })),
  };

  return NextResponse.json(catalog, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
