import { NextResponse } from "next/server";
import { getAllTools } from "@/tools/registry";
import type { ToolConfig } from "@/config/types";

const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://toolhub.co.kr"
).replace(/\/+$/, "");

/**
 * /feed.xml — Atom feed of recently added/updated tools.
 *
 * LLM 크롤러가 신규 툴을 빠르게 인지할 수 있도록 published 툴을
 * lastUpdated / datePublished 내림차순으로 노출한다. (정보 누락 시 빌드 시각 사용)
 */

export const revalidate = 3600;

const BUILD_DATE = new Date().toISOString();

function isPublished(tool: ToolConfig): boolean {
  return (tool.status ?? "published") === "published";
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toIsoDate(value?: string): string {
  if (!value) return BUILD_DATE;
  // YYYY-MM-DD or full ISO; coerce to ISO if needed
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00:00Z`;
  return value;
}

export async function GET() {
  const tools = getAllTools()
    .filter(isPublished)
    .map((tool) => ({
      tool,
      updated: tool.lastUpdated ?? tool.datePublished ?? BUILD_DATE,
    }))
    .sort((a, b) => (a.updated < b.updated ? 1 : -1))
    .slice(0, 50);

  const entries = tools
    .flatMap(({ tool, updated }) =>
      (["ko", "en"] as const).map((locale) => {
        const seo = tool.seo[locale] ?? tool.seo["ko"];
        const url = `${BASE_URL}/${locale}/tools/${tool.category}/${tool.slug}`;
        const updatedIso = toIsoDate(updated);
        return `  <entry>
    <id>${url}</id>
    <title type="text">${escapeXml(seo.title)}</title>
    <link rel="alternate" type="text/html" href="${url}" hreflang="${locale}"/>
    <updated>${updatedIso}</updated>
    <summary type="text">${escapeXml(seo.description)}</summary>
    <category term="${tool.category}"/>
    <author><name>Toolhub</name></author>
  </entry>`;
      }),
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Toolhub — New &amp; Updated Tools</title>
  <subtitle>Free online tools updates</subtitle>
  <id>${BASE_URL}/feed.xml</id>
  <link rel="self" type="application/atom+xml" href="${BASE_URL}/feed.xml"/>
  <link rel="alternate" type="text/html" href="${BASE_URL}/"/>
  <updated>${BUILD_DATE}</updated>
  <author><name>Toolhub</name><uri>${BASE_URL}</uri></author>
${entries}
</feed>
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
