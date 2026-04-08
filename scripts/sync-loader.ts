/**
 * ToolLoader.tsx 자동 생성 스크립트
 * Usage: npm run sync-loader
 *
 * registry.ts에서 모든 tool slug을 추출하고 ToolLoader.tsx를 자동 생성한다.
 * 이중 등록 문제 해소: registry.ts만 수정하면 ToolLoader.tsx는 이 스크립트가 동기화.
 */

import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const REGISTRY = path.join(ROOT, "src/tools/registry.ts");
const LOADER = path.join(ROOT, "src/components/tools/ToolLoader.tsx");

// registry.ts에서 slug 추출 (config import 패턴)
const registryContent = fs.readFileSync(REGISTRY, "utf-8");
const slugRegex = /from "\.\/([^/]+)\/config"/g;
const slugs: string[] = [];
let match;
while ((match = slugRegex.exec(registryContent)) !== null) {
  slugs.push(match[1]);
}

if (slugs.length === 0) {
  console.error("❌ registry.ts에서 slug을 찾지 못했습니다.");
  process.exit(1);
}

// 카테고리별 그룹 추출 (주석 기반)
const lines = registryContent.split("\n");
const categoryMap: Record<string, string[]> = {};
let currentCategory = "Uncategorized";

for (const line of lines) {
  const categoryComment = line.match(/^\s*\/\/\s*(Text|Developer|Calculator|Converter|Generator)/i);
  if (categoryComment) {
    currentCategory = categoryComment[1];
    if (!categoryMap[currentCategory]) categoryMap[currentCategory] = [];
  }
  const configMatch = line.match(/^\s*(\w+Config),?\s*$/);
  if (configMatch) {
    // 이 config의 slug을 찾기
    const configName = configMatch[1];
    const importMatch = registryContent.match(
      new RegExp(`import \\{ config as ${configName} \\} from "\\.\\/([^/]+)\\/config"`)
    );
    if (importMatch) {
      categoryMap[currentCategory] = categoryMap[currentCategory] || [];
      categoryMap[currentCategory].push(importMatch[1]);
    }
  }
}

// ToolLoader.tsx 생성
const dynamicImports = Object.entries(categoryMap)
  .map(([category, catSlugs]) => {
    const entries = catSlugs
      .map((s) => `  "${s}": dynamic(() => import("@/tools/${s}/component")),`)
      .join("\n");
    return `  // ${category}\n${entries}`;
  })
  .join("\n");

const loaderContent = `"use client";

import dynamic from "next/dynamic";

// 자동 생성 파일 — 직접 수정하지 마세요
// npm run sync-loader 로 registry.ts 기반 자동 생성됩니다
const toolComponents: Record<string, React.ComponentType> = {
${dynamicImports}
};

export default function ToolLoader({ slug }: { slug: string }) {
  const Component = toolComponents[slug];
  if (!Component) return null;
  return <Component />;
}
`;

fs.writeFileSync(LOADER, loaderContent);

const GREEN = "\x1b[32m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";
console.log(`${GREEN}${BOLD}✔${RESET} ToolLoader.tsx 생성 완료 (${slugs.length}개 툴)`);

// 검증: registry slug과 loader slug이 일치하는지
const loaderCheck = fs.readFileSync(LOADER, "utf-8");
const missing = slugs.filter((s) => !loaderCheck.includes(`"${s}"`));
if (missing.length > 0) {
  console.error(`❌ 누락된 slug: ${missing.join(", ")}`);
  process.exit(1);
}
