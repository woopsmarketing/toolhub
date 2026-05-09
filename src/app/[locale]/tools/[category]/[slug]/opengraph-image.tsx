import { ImageResponse } from "next/og";
import { getToolBySlug } from "@/tools/registry";
import { categories } from "@/config/categories";
import type { Locale } from "@/config/types";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Toolhub";

/**
 * Per-tool dynamic Open Graph image.
 * 자동 생성: 카테고리 라벨 + 툴 제목 + 설명 1~2줄 + Toolhub 워드마크.
 *
 * SNS / LLM 미리보기에서 일관된 카드 노출. 별도 디자이너 작업 불필요.
 */
export default async function ToolOgImage({
  params,
}: {
  params: { locale: string; category: string; slug: string };
}) {
  const { locale, slug, category } = params;
  const tool = getToolBySlug(slug);
  const localeKey: Locale = locale === "en" ? "en" : "ko";
  const seo =
    tool?.seo[localeKey] ?? tool?.seo["ko"] ?? {
      title: "Toolhub",
      description: "Free online tools",
    };
  const categoryName =
    categories[category]?.name?.[localeKey] ?? category;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px",
          background:
            "linear-gradient(135deg, #0b1220 0%, #1e293b 60%, #2563eb 140%)",
          color: "#f3f4f6",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 600,
            opacity: 0.85,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            T
          </div>
          <span>
            Tool<span style={{ color: "#60a5fa" }}>hub</span>
          </span>
          <span
            style={{
              marginLeft: 16,
              fontSize: 20,
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(96, 165, 250, 0.18)",
              color: "#bfdbfe",
            }}
          >
            {categoryName}
          </span>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {seo.title}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              opacity: 0.85,
              maxHeight: 168,
              overflow: "hidden",
            }}
          >
            {seo.description}
          </div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              gap: 12,
              fontSize: 20,
              color: "#bfdbfe",
            }}
          >
            <span>✦ Free</span>
            <span>✦ No Sign-up</span>
            <span>✦ Browser-only</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
