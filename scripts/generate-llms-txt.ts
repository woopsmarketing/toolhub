/**
 * Toolhub — public/llms.txt + llms-full.txt 자동 생성 스크립트
 *
 * llms.txt 표준: https://llmstxt.org/
 *
 * 본 스크립트는 `src/tools/registry.ts` 의 등록 툴을 카테고리별로 묶어
 * 결정론적 (정렬된) 마크다운을 생성한다.
 *
 * 출력:
 *   - public/llms.txt        (한국어 ko, 도구당 features+useCase 포함된 인덱스)
 *   - public/llms-en.txt     (영문 en, 동일)
 *   - public/llms-full.txt   (한국어 ko, 도구당 FAQ+howTo+guide 포함된 long-form)
 *   - public/llms-full-en.txt(영문 en, 동일)
 *
 * AEO 강화 (2026-05-10):
 *   - llms.txt: 1줄 → 도구당 description + features 2~3개 + use case 1~2개
 *   - llms-full.txt 신설: FAQ + How-to + Guide 본문 전체 포함. LLM 인용용.
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
  siteTitle: string;
  blurb: string;
  toolsHeading: string;
  featuresLabel: string;
  useCasesLabel: string;
  faqLabel: string;
  howToLabel: string;
  guideLabel: string;
}

const RENDER_KO: RenderOptions = {
  locale: "ko",
  siteTitle: "Toolhub — 무료 온라인 도구 모음",
  blurb:
    "텍스트, 코드, 계산, 변환, 이미지, PDF 등 다양한 분야의 무료 온라인 도구를 제공합니다. 모든 도구는 브라우저 내에서 동작하며, 사용자의 데이터는 서버로 전송되지 않습니다. 한국어/영어 지원, 회원가입 불필요.",
  toolsHeading: "도구 목록",
  featuresLabel: "주요 기능",
  useCasesLabel: "활용 예",
  faqLabel: "자주 묻는 질문",
  howToLabel: "사용 방법",
  guideLabel: "가이드",
};

const RENDER_EN: RenderOptions = {
  locale: "en",
  siteTitle: "Toolhub — Free Online Tools",
  blurb:
    "Free online tools for text, code, calculation, conversion, image, and PDF processing. All tools run entirely in your browser; your data is never sent to any server. Korean/English supported. No sign-up required.",
  toolsHeading: "Tools",
  featuresLabel: "Key features",
  useCasesLabel: "Use cases",
  faqLabel: "FAQ",
  howToLabel: "How to use",
  guideLabel: "Guide",
};

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

function pickList<T>(
  bucket: { [locale: string]: T[] } | undefined,
  locale: Locale,
): T[] {
  if (!bucket) return [];
  return bucket[locale] ?? bucket["ko"] ?? [];
}

function pickGuide(tool: ToolConfig, locale: Locale) {
  return tool.guide?.[locale] ?? tool.guide?.["ko"] ?? null;
}

function isPublished(tool: ToolConfig): boolean {
  return (tool.status ?? "published") === "published";
}

function groupByCategory(tools: ToolConfig[]): Map<string, ToolConfig[]> {
  const grouped = new Map<string, ToolConfig[]>();
  for (const tool of tools) {
    const list = grouped.get(tool.category) ?? [];
    list.push(tool);
    grouped.set(tool.category, list);
  }
  return grouped;
}

function orderedCategoryIds(grouped: Map<string, ToolConfig[]>): string[] {
  const knownIds = new Set<string>(categoryOrder);
  return [
    ...categoryOrder.filter((id) => grouped.has(id)),
    ...Array.from(grouped.keys())
      .filter((id) => !knownIds.has(id))
      .sort(),
  ];
}

function sortByTitle(tools: ToolConfig[], locale: Locale): ToolConfig[] {
  return [...tools].sort((a, b) => {
    const ta = pickSeo(a, locale).title;
    const tb = pickSeo(b, locale).title;
    return ta.localeCompare(tb, locale === "ko" ? "ko-KR" : "en-US");
  });
}

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** llms.txt — 도구당 description + features 2~3 + use case 1~2 (~3-5 lines per tool). */
function renderIndex(options: RenderOptions): string {
  const { locale, siteTitle, blurb, toolsHeading, featuresLabel, useCasesLabel } =
    options;
  const tools = getAllTools().filter(isPublished);
  const grouped = groupByCategory(tools);

  const lines: string[] = [];
  lines.push(`# ${siteTitle}`);
  lines.push("");
  lines.push(`> ${blurb}`);
  lines.push("");
  lines.push(
    `> Total: ${tools.length} tools across ${grouped.size} categories. Updated: ${new Date().toISOString().split("T")[0]}`,
  );
  lines.push("");
  lines.push(`## ${toolsHeading}`);
  lines.push("");

  for (const categoryId of orderedCategoryIds(grouped)) {
    const list = grouped.get(categoryId);
    if (!list || list.length === 0) continue;

    const cat = categories[categoryId];
    const categoryName = cat?.name?.[locale] ?? categoryId;

    lines.push(`### ${categoryName}`);
    lines.push("");

    for (const tool of sortByTitle(list, locale)) {
      const seo = pickSeo(tool, locale);
      const url = `${BASE_URL}/${locale}/tools/${tool.category}/${tool.slug}`;
      const features = pickList(tool.features, locale).slice(0, 3);
      const useCases = pickList(tool.useCases, locale).slice(0, 2);

      lines.push(`- [${seo.title}](${url}): ${normalize(seo.description)}`);
      if (features.length > 0) {
        lines.push(
          `  - ${featuresLabel}: ${features.map((f) => normalize(f)).join(" · ")}`,
        );
      }
      if (useCases.length > 0) {
        const examples = useCases
          .map((uc) => `${normalize(uc.title)}`)
          .join(" · ");
        lines.push(`  - ${useCasesLabel}: ${examples}`);
      }
    }

    lines.push("");
  }

  while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  lines.push("");
  return lines.join("\n");
}

/** llms-full.txt — 도구당 description + features + useCases + howTo + FAQ + guide 본문. */
function renderFull(options: RenderOptions): string {
  const {
    locale,
    siteTitle,
    blurb,
    toolsHeading,
    featuresLabel,
    useCasesLabel,
    faqLabel,
    howToLabel,
    guideLabel,
  } = options;
  const tools = getAllTools().filter(isPublished);
  const grouped = groupByCategory(tools);

  const lines: string[] = [];
  lines.push(`# ${siteTitle} (Full)`);
  lines.push("");
  lines.push(`> ${blurb}`);
  lines.push("");
  lines.push(
    `> Generated: ${new Date().toISOString().split("T")[0]} · ${tools.length} tools · ${grouped.size} categories`,
  );
  lines.push("");
  lines.push(`## ${toolsHeading}`);
  lines.push("");

  for (const categoryId of orderedCategoryIds(grouped)) {
    const list = grouped.get(categoryId);
    if (!list || list.length === 0) continue;

    const cat = categories[categoryId];
    const categoryName = cat?.name?.[locale] ?? categoryId;
    lines.push(`---`);
    lines.push("");
    lines.push(`## ${categoryName}`);
    lines.push("");

    for (const tool of sortByTitle(list, locale)) {
      const seo = pickSeo(tool, locale);
      const url = `${BASE_URL}/${locale}/tools/${tool.category}/${tool.slug}`;
      const features = pickList(tool.features, locale);
      const useCases = pickList(tool.useCases, locale);
      const howTo = pickList(tool.howToUse, locale);
      const faq = pickList(tool.faq, locale);
      const guide = pickGuide(tool, locale);

      lines.push(`### ${seo.title}`);
      lines.push("");
      lines.push(`URL: ${url}`);
      lines.push("");
      lines.push(normalize(seo.description));
      lines.push("");

      if (features.length > 0) {
        lines.push(`**${featuresLabel}**`);
        lines.push("");
        for (const f of features) lines.push(`- ${normalize(f)}`);
        lines.push("");
      }

      if (howTo.length > 0) {
        lines.push(`**${howToLabel}**`);
        lines.push("");
        howTo.forEach((step, i) =>
          lines.push(`${i + 1}. ${normalize(step)}`),
        );
        lines.push("");
      }

      if (useCases.length > 0) {
        lines.push(`**${useCasesLabel}**`);
        lines.push("");
        for (const uc of useCases) {
          lines.push(`- **${normalize(uc.title)}** — ${normalize(uc.description)}`);
        }
        lines.push("");
      }

      if (faq.length > 0) {
        lines.push(`**${faqLabel}**`);
        lines.push("");
        for (const item of faq) {
          lines.push(`- Q: ${normalize(item.q)}`);
          lines.push(`  A: ${normalize(item.a)}`);
        }
        lines.push("");
      }

      if (guide && guide.content) {
        lines.push(`**${guideLabel}: ${guide.title}**`);
        lines.push("");
        lines.push(guide.content.trim());
        lines.push("");
      }
    }
  }

  while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  lines.push("");
  return lines.join("\n");
}

async function main(): Promise<void> {
  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  const koIndex = renderIndex(RENDER_KO);
  const enIndex = renderIndex(RENDER_EN);
  const koFull = renderFull(RENDER_KO);
  const enFull = renderFull(RENDER_EN);

  const writes: Array<[string, string]> = [
    [path.join(PUBLIC_DIR, "llms.txt"), koIndex],
    [path.join(PUBLIC_DIR, "llms-en.txt"), enIndex],
    [path.join(PUBLIC_DIR, "llms-full.txt"), koFull],
    [path.join(PUBLIC_DIR, "llms-full-en.txt"), enFull],
  ];

  for (const [filePath, content] of writes) {
    await fs.writeFile(filePath, content, "utf8");
    const lines = content.split("\n").length;
    // eslint-disable-next-line no-console
    console.log(`[generate-llms-txt] ${path.basename(filePath)} (${lines} lines)`);
  }
  // eslint-disable-next-line no-console
  console.log(`[generate-llms-txt] base=${BASE_URL}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[generate-llms-txt] failed:", err);
  process.exit(1);
});
