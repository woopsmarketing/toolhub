/**
 * Toolhub — public/llms.txt 자동 생성 스크립트 (Phase 1 PR-6)
 *
 * llms.txt 표준: https://llmstxt.org/
 * 본 스크립트는 `src/tools/registry.ts` 의 등록 툴을 카테고리별로 묶어
 * 결정론적 (정렬된) 마크다운을 생성한다.
 *
 * 출력:
 *   - public/llms.txt    (한국어 ko)
 *   - public/llms-en.txt (영문 en)
 *
 * 환경변수:
 *   - NEXT_PUBLIC_BASE_URL (기본 "https://toolhub.example")
 *
 * 실행: `npm run generate:llms-txt` (prebuild 훅 자동 실행)
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getAllTools } from "../src/tools/registry";
import { categories, categoryOrder } from "../src/config/categories";
import type { ToolConfig, Locale } from "../src/config/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");

const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://toolhub.example"
).replace(/\/+$/, "");

interface RenderOptions {
  locale: Locale;
  /** 사이트 헤더 (마크다운 H1 라인) */
  siteTitle: string;
  /** 인용 블록 (>) */
  blurb: string;
  /** "## Tools" 헤더 텍스트 */
  toolsHeading: string;
  /** "draft" 툴 필터링 안내 (없을 시 빈 문자열) */
  draftNote?: string;
}

const RENDER_KO: RenderOptions = {
  locale: "ko",
  siteTitle: "Toolhub — 무료 온라인 도구 모음",
  blurb:
    "텍스트, 코드, 계산, 변환, 이미지, PDF 등 다양한 분야의 무료 온라인 도구를 제공합니다. 모든 도구는 브라우저 내에서 동작하며, 사용자의 데이터는 서버로 전송되지 않습니다.",
  toolsHeading: "도구 목록",
};

const RENDER_EN: RenderOptions = {
  locale: "en",
  siteTitle: "Toolhub — Free Online Tools",
  blurb:
    "Free online tools for text, code, calculation, conversion, image, and PDF processing. All tools run entirely in your browser; your data is never sent to any server.",
  toolsHeading: "Tools",
};

/** locale 우선, 없으면 ko fallback. 둘 다 없으면 첫 사용 가능한 값. */
function pickSeo(tool: ToolConfig, locale: Locale) {
  return (
    tool.seo[locale] ??
    tool.seo["ko"] ??
    Object.values(tool.seo)[0] ?? {
      title: tool.slug,
      description: "",
      keywords: [],
    }
  );
}

/** "published" 만 통과 (status 누락 시 published 로 간주). */
function isPublished(tool: ToolConfig): boolean {
  return (tool.status ?? "published") === "published";
}

/**
 * 마크다운 생성 (결정론적: 카테고리 = categoryOrder 순서, 툴 = 제목 알파벳 정렬).
 */
function render(options: RenderOptions): string {
  const { locale, siteTitle, blurb, toolsHeading } = options;
  const tools = getAllTools().filter(isPublished);

  // 카테고리별 그룹
  const grouped = new Map<string, ToolConfig[]>();
  for (const tool of tools) {
    const list = grouped.get(tool.category) ?? [];
    list.push(tool);
    grouped.set(tool.category, list);
  }

  const lines: string[] = [];
  lines.push(`# ${siteTitle}`);
  lines.push("");
  lines.push(`> ${blurb}`);
  lines.push("");
  lines.push(`## ${toolsHeading}`);
  lines.push("");

  // 알려진 카테고리 (categoryOrder 순서) → 그 외 (알파벳 순)
  const knownIds = new Set<string>(categoryOrder);
  const orderedCategoryIds: string[] = [
    ...categoryOrder.filter((id) => grouped.has(id)),
    ...Array.from(grouped.keys())
      .filter((id) => !knownIds.has(id))
      .sort(),
  ];

  for (const categoryId of orderedCategoryIds) {
    const list = grouped.get(categoryId);
    if (!list || list.length === 0) continue;

    const cat = categories[categoryId];
    const categoryName = cat?.name?.[locale] ?? categoryId;

    lines.push(`### ${categoryName}`);
    lines.push("");

    // 결정론적 정렬: locale 별 title 기준
    const sorted = [...list].sort((a, b) => {
      const ta = pickSeo(a, locale).title;
      const tb = pickSeo(b, locale).title;
      return ta.localeCompare(tb, locale === "ko" ? "ko-KR" : "en-US");
    });

    for (const tool of sorted) {
      const seo = pickSeo(tool, locale);
      const url = `${BASE_URL}/${locale}/tools/${tool.category}/${tool.slug}`;
      // description 의 줄바꿈 제거 (한 줄로 normalise)
      const desc = seo.description.replace(/\s+/g, " ").trim();
      lines.push(`- [${seo.title}](${url}): ${desc}`);
    }

    lines.push("");
  }

  // 마지막 빈 줄 정리 (POSIX 파일은 1개의 trailing newline)
  while (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }
  lines.push("");

  return lines.join("\n");
}

async function main(): Promise<void> {
  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  const koContent = render(RENDER_KO);
  const enContent = render(RENDER_EN);

  const koPath = path.join(PUBLIC_DIR, "llms.txt");
  const enPath = path.join(PUBLIC_DIR, "llms-en.txt");

  await fs.writeFile(koPath, koContent, "utf8");
  await fs.writeFile(enPath, enContent, "utf8");

  const koLines = koContent.split("\n").length;
  const enLines = enContent.split("\n").length;
  // eslint-disable-next-line no-console
  console.log(
    `[generate-llms-txt] wrote ${koPath} (${koLines} lines) and ${enPath} (${enLines} lines) — base=${BASE_URL}`
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[generate-llms-txt] failed:", err);
  process.exit(1);
});
