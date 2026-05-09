/**
 * Bulk Tool Validator (Phase 1 PR-10)
 *
 * registry 에 등록된 모든 툴 config 를 검증한다.
 * 단일 툴 검증은 `scripts/validate-tool.ts` (npm run validate <slug>) 를 사용할 것.
 *
 * 검증 규칙 (PROJECT_PLAN.md §14):
 *  1. slug — 비어있지 않음 / 소문자+하이픈만 / registry 내 유일
 *  2. category — categories.ts 의 10개 ID 중 하나
 *  3. seo.ko / seo.en — title, description 존재
 *  4. seo[locale].keywords — ko/en 각각 ≥ 5
 *  5. howToUse.ko / howToUse.en — 각각 ≥ 3 단계
 *  6. features.ko / features.en — 각각 ≥ 4 항목
 *  7. faq.ko / faq.en — 각각 ≥ 3 항목
 *  8. relatedTools — 모든 항목이 registry 내 slug
 *  9. template — 설정 시 9개 TemplateType 중 하나
 * 10. ToolLoader 등록 — ToolLoader.tsx 안에 slug 가 등장
 *
 * (참고) inputConfig.outputType === "stats" 인 경우 logic.ts return key 와
 * resultLabels[].key 의 일치 검사는 logic 을 실제로 실행해야 정확하므로,
 * 본 스크립트에서는 생략한다 (단일 툴 validator 가 정적으로 검사함).
 *
 * 사용:
 *   npm run validate-tools
 *
 * 종료 코드:
 *   0 — 모두 통과
 *   1 — 1개 이상 실패
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getAllTools } from "../src/tools/registry";
import { categories } from "../src/config/categories";
import type { ToolConfig, TemplateType } from "../src/config/types";

// ─── 출력 헬퍼 ──────────────────────────────────────────────────────────────

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

// ─── 상수 ──────────────────────────────────────────────────────────────────

const VALID_TEMPLATES: ReadonlySet<TemplateType> = new Set<TemplateType>([
  "text-to-text",
  "form-to-result",
  "live-preview",
  "multi-input",
  "form-to-visual",
  "realtime",
  "workspace",
  "file-processor",
  "image-editor",
]);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// __dirname compat: tsx may load this file as CJS or ESM depending on environment.
const SCRIPT_DIR =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const LOADER_PATH = path.join(ROOT, "src/components/tools/ToolLoader.tsx");

// ─── 검증 로직 ──────────────────────────────────────────────────────────────

interface ToolFailure {
  slug: string;
  reasons: string[];
}

function validateTool(
  config: ToolConfig,
  allSlugs: Set<string>,
  duplicateSlugs: Set<string>,
  loaderContent: string,
): string[] {
  const reasons: string[] = [];
  const slug = config.slug;

  // 1. slug
  if (!slug || slug.trim() === "") {
    reasons.push("slug 비어있음");
  } else {
    if (!SLUG_PATTERN.test(slug)) {
      reasons.push(`slug 형식 오류 (소문자+하이픈만): "${slug}"`);
    }
    if (duplicateSlugs.has(slug)) {
      reasons.push(`slug 중복: "${slug}"`);
    }
  }

  // 2. category
  if (!config.category) {
    reasons.push("category 없음");
  } else if (!(config.category in categories)) {
    reasons.push(
      `category "${config.category}" 가 categories.ts 에 없음 (유효: ${Object.keys(categories).join(", ")})`,
    );
  }

  // 3. seo.ko / seo.en — title, description
  for (const locale of ["ko", "en"] as const) {
    const seoEntry = config.seo?.[locale];
    if (!seoEntry) {
      reasons.push(`seo.${locale} 없음`);
      continue;
    }
    if (!seoEntry.title || seoEntry.title.trim() === "") {
      reasons.push(`seo.${locale}.title 비어있음`);
    }
    if (!seoEntry.description || seoEntry.description.trim() === "") {
      reasons.push(`seo.${locale}.description 비어있음`);
    }

    // 4. keywords ≥ 5
    const kwCount = seoEntry.keywords?.length ?? 0;
    if (kwCount < 5) {
      reasons.push(`seo.${locale}.keywords 부족 (${kwCount}/5)`);
    }
  }

  // 5. howToUse ≥ 3
  for (const locale of ["ko", "en"] as const) {
    const count = config.howToUse?.[locale]?.length ?? 0;
    if (count < 3) {
      reasons.push(`howToUse.${locale} 부족 (${count}/3)`);
    }
  }

  // 6. features ≥ 4
  for (const locale of ["ko", "en"] as const) {
    const count = config.features?.[locale]?.length ?? 0;
    if (count < 4) {
      reasons.push(`features.${locale} 부족 (${count}/4)`);
    }
  }

  // 7. faq ≥ 3
  for (const locale of ["ko", "en"] as const) {
    const count = config.faq?.[locale]?.length ?? 0;
    if (count < 3) {
      reasons.push(`faq.${locale} 부족 (${count}/3)`);
    }
  }

  // 8. relatedTools — 모두 registry slug
  if (Array.isArray(config.relatedTools) && config.relatedTools.length > 0) {
    const bad = config.relatedTools.filter((s) => !allSlugs.has(s));
    if (bad.length > 0) {
      reasons.push(`relatedTools 미등록 slug: ${bad.join(", ")}`);
    }
    if (config.relatedTools.includes(slug)) {
      reasons.push("relatedTools 에 자기 자신 포함");
    }
  }

  // 9. template — 설정 시 enum 일치
  if (config.template !== undefined) {
    if (!VALID_TEMPLATES.has(config.template)) {
      reasons.push(
        `template "${config.template}" 가 9개 TemplateType 중 어느 것도 아님`,
      );
    }
  }

  // 10. ToolLoader 등록
  // ToolLoader.tsx 의 toolComponents 맵에 "<slug>" 형태로 키가 등장하는지 검사
  const loaderKeyPattern = new RegExp(`["'\`]${escapeRegExp(slug)}["'\`]`);
  if (!loaderKeyPattern.test(loaderContent)) {
    reasons.push("ToolLoader.tsx 에 미등록 (dynamic import 추가 필요)");
  }

  return reasons;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── 메인 ──────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const tools = getAllTools();

  if (!fs.existsSync(LOADER_PATH)) {
    console.error(`${RED}${BOLD}✗${RESET} ToolLoader.tsx 를 찾을 수 없습니다: ${LOADER_PATH}`);
    process.exit(1);
  }
  const loaderContent = fs.readFileSync(LOADER_PATH, "utf-8");

  // slug 중복 사전 계산
  const slugCounts = new Map<string, number>();
  for (const t of tools) {
    slugCounts.set(t.slug, (slugCounts.get(t.slug) ?? 0) + 1);
  }
  const duplicateSlugs = new Set<string>();
  for (const [slug, count] of slugCounts) {
    if (count > 1) duplicateSlugs.add(slug);
  }
  const allSlugs = new Set(slugCounts.keys());

  console.log(`${BOLD}Toolhub 툴 일괄 검증${RESET} ${DIM}(${tools.length}개)${RESET}\n`);

  const failures: ToolFailure[] = [];
  let passedCount = 0;

  for (const config of tools) {
    const reasons = validateTool(config, allSlugs, duplicateSlugs, loaderContent);
    if (reasons.length === 0) {
      console.log(`${GREEN}✓${RESET} ${config.slug}`);
      passedCount++;
    } else {
      console.log(`${RED}✗${RESET} ${config.slug}${DIM}:${RESET} ${reasons[0]}`);
      for (let i = 1; i < reasons.length; i++) {
        console.log(`  ${DIM}↳${RESET} ${reasons[i]}`);
      }
      failures.push({ slug: config.slug, reasons });
    }
  }

  const total = tools.length;
  const failedCount = failures.length;

  console.log("\n" + "─".repeat(50));
  if (failedCount === 0) {
    console.log(
      `${GREEN}${BOLD}✓ Validated ${total} tools — ${passedCount} passed, 0 failed${RESET}`,
    );
    process.exit(0);
  } else {
    console.log(
      `${RED}${BOLD}✗ Validated ${total} tools — ${passedCount} passed, ${failedCount} failed${RESET}`,
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`${RED}${BOLD}검증 중 오류 발생:${RESET}`, err);
  process.exit(1);
});
