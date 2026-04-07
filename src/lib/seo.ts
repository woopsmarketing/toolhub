import { type ToolConfig } from "@/config/types";
import { type Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://toolhub.co.kr";

export function generateToolMetadata(
  tool: ToolConfig,
  locale: string
): Metadata {
  const seo = tool.seo[locale] || tool.seo["ko"];
  const title = `${seo.title} - Toolhub`;
  const description = seo.description;

  return {
    title,
    description,
    keywords: seo.keywords,
    alternates: {
      canonical: `${BASE_URL}/${locale}/tools/${tool.slug}`,
      languages: {
        ko: `${BASE_URL}/ko/tools/${tool.slug}`,
        en: `${BASE_URL}/en/tools/${tool.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/tools/${tool.slug}`,
      siteName: "Toolhub",
      type: "website",
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function generateFaqJsonLd(
  tool: ToolConfig,
  locale: string
): Record<string, unknown> | null {
  const faq = tool.faq[locale] || tool.faq["ko"];
  if (!faq || faq.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function generateWebAppJsonLd(
  tool: ToolConfig,
  locale: string
): Record<string, unknown> {
  const seo = tool.seo[locale] || tool.seo["ko"];

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: seo.title,
    description: seo.description,
    url: `${BASE_URL}/${locale}/tools/${tool.slug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}
