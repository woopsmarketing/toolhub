/**
 * Tool Validation Script
 * Usage: npm run validate <slug>
 * Example: npm run validate word-counter
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npm run validate <slug>");
  process.exit(1);
}

const ROOT = path.resolve(import.meta.dirname, "..");
const TOOL_DIR = path.join(ROOT, "src/tools", slug);
const REGISTRY = path.join(ROOT, "src/tools/registry.ts");
const PAGE = path.join(ROOT, "src/app/[locale]/tools/[slug]/page.tsx");

// ─── Output helpers ────────────────────────────────────────────────────────

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

let passed = 0;
let failed = 0;
const failures: string[] = [];

function ok(label: string) {
  console.log(`  ${GREEN}✔${RESET} ${label}`);
  passed++;
}

function fail(label: string, hint?: string) {
  console.log(`  ${RED}✖${RESET} ${label}${hint ? `  ${YELLOW}← ${hint}${RESET}` : ""}`);
  failed++;
  failures.push(label);
}

function section(title: string) {
  console.log(`\n${BOLD}${title}${RESET}`);
}

// ─── 1. 파일 구조 ──────────────────────────────────────────────────────────

section("1. 파일 구조");

const configPath = path.join(TOOL_DIR, "config.ts");
const logicPath = path.join(TOOL_DIR, "logic.ts");
const componentPath = path.join(TOOL_DIR, "component.tsx");

fs.existsSync(configPath) ? ok("config.ts 존재") : fail("config.ts 없음", `src/tools/${slug}/config.ts`);
fs.existsSync(logicPath) ? ok("logic.ts 존재") : fail("logic.ts 없음", `src/tools/${slug}/logic.ts`);
fs.existsSync(componentPath) ? ok("component.tsx 존재") : fail("component.tsx 없음", `src/tools/${slug}/component.tsx`);

if (fs.existsSync(componentPath)) {
  const firstLine = fs.readFileSync(componentPath, "utf-8").split("\n")[0].trim();
  firstLine === '"use client";' || firstLine === "'use client';"
    ? ok('component.tsx 첫 줄 "use client"')
    : fail('component.tsx 첫 줄에 "use client" 없음');
}

// ─── 2. Registry 등록 ──────────────────────────────────────────────────────

section("2. Registry 등록");

const registry = fs.readFileSync(REGISTRY, "utf-8");

registry.includes(`"${slug}/config"`) || registry.includes(`'${slug}/config'`)
  ? ok("registry.ts config import 존재")
  : fail("registry.ts config import 없음", `import { config as ... } from "./${slug}/config"`);

registry.includes(`"${slug}/component"`) || registry.includes(`'${slug}/component'`)
  ? ok("registry.ts component import 존재")
  : fail("registry.ts component import 없음", `import ... from "./${slug}/component"`);

// toolEntries에 slug의 config와 component가 쌍으로 있는지 확인
const entriesBlock = registry.match(/const toolEntries[\s\S]*?\];/)?.[0] ?? "";
entriesBlock.includes(slug)
  ? ok("toolEntries에 등록됨")
  : fail("toolEntries에 등록 안 됨", `{ config: ..., Component: ... } 추가 필요`);

// page.tsx가 수정되지 않았는지 (component import가 없어야 정상)
const page = fs.readFileSync(PAGE, "utf-8");
!page.includes(`from "@/tools/${slug}/component"`)
  ? ok("page.tsx 수정 없음 (정상)")
  : fail("page.tsx에 component import가 직접 추가됨", "registry.ts를 통해 등록할 것");

// ─── 3. Config 품질 ────────────────────────────────────────────────────────

section("3. Config 품질");

let config: import("../src/config/types").ToolConfig | null = null;

try {
  const mod = await import(configPath);
  config = mod.config;
} catch (e) {
  fail("config.ts import 실패", String(e));
}

if (config) {
  // SEO
  config.seo?.ko ? ok("seo.ko 존재") : fail("seo.ko 없음");
  config.seo?.en ? ok("seo.en 존재") : fail("seo.en 없음");

  const koKw = config.seo?.ko?.keywords?.length ?? 0;
  const enKw = config.seo?.en?.keywords?.length ?? 0;
  koKw >= 5 ? ok(`keywords.ko ${koKw}개`) : fail(`keywords.ko 부족 (${koKw}개)`, "5개 이상 필요");
  enKw >= 5 ? ok(`keywords.en ${enKw}개`) : fail(`keywords.en 부족 (${enKw}개)`, "5개 이상 필요");

  // howToUse
  const koHtu = config.howToUse?.ko?.length ?? 0;
  const enHtu = config.howToUse?.en?.length ?? 0;
  koHtu >= 3 ? ok(`howToUse.ko ${koHtu}단계`) : fail(`howToUse.ko 부족 (${koHtu}개)`, "3단계 이상 필요");
  enHtu >= 3 ? ok(`howToUse.en ${enHtu}단계`) : fail(`howToUse.en 부족 (${enHtu}개)`, "3단계 이상 필요");

  // features
  const koFt = config.features?.ko?.length ?? 0;
  const enFt = config.features?.en?.length ?? 0;
  koFt >= 4 ? ok(`features.ko ${koFt}개`) : fail(`features.ko 부족 (${koFt}개)`, "4개 이상 필요");
  enFt >= 4 ? ok(`features.en ${enFt}개`) : fail(`features.en 부족 (${enFt}개)`, "4개 이상 필요");

  // faq
  const koFaq = config.faq?.ko?.length ?? 0;
  const enFaq = config.faq?.en?.length ?? 0;
  koFaq >= 3 ? ok(`faq.ko ${koFaq}개`) : fail(`faq.ko 부족 (${koFaq}개)`, "3개 이상 필요");
  enFaq >= 2 ? ok(`faq.en ${enFaq}개`) : fail(`faq.en 부족 (${enFaq}개)`, "2개 이상 필요");

  // relatedTools
  if (config.relatedTools.length > 0) {
    const badSlugs = config.relatedTools.filter(
      (s) => !registry.includes(`"${s}/config"`) && !registry.includes(`'${s}/config'`)
    );
    badSlugs.length === 0
      ? ok(`relatedTools ${config.relatedTools.length}개 모두 유효`)
      : fail(`relatedTools에 미등록 slug 존재`, badSlugs.join(", "));

    !config.relatedTools.includes(slug)
      ? ok("relatedTools에 자기 자신 없음")
      : fail("relatedTools에 자기 자신(slug) 포함됨");
  } else {
    ok("relatedTools 빈 배열 (허용)");
  }
}

// ─── 4. 템플릿 계약 일치 (FormToResult) ────────────────────────────────────

section("4. 템플릿 계약");

if (config?.template === "FormToResult") {
  const logicContent = fs.readFileSync(logicPath, "utf-8");
  const fieldNames = (config.formFields ?? []).map((f) => f.name);
  const resultKeys = (config.resultLabels ?? []).map((r) => r.key);

  // formFields names가 logic.ts에서 참조되는지
  const missingFields = fieldNames.filter((n) => !logicContent.includes(n));
  missingFields.length === 0
    ? ok(`formFields names 모두 logic.ts에서 참조됨`)
    : fail(`logic.ts에서 누락된 field name`, missingFields.join(", "));

  // resultLabels keys가 logic.ts return에 있는지
  const missingKeys = resultKeys.filter((k) => !logicContent.includes(k));
  missingKeys.length === 0
    ? ok(`resultLabels keys 모두 logic.ts에서 반환됨`)
    : fail(`logic.ts return에 없는 key`, missingKeys.join(", "));
} else {
  ok(`${config?.template ?? "Unknown"} 템플릿 — 계약 검사 해당 없음`);
}

// ─── 5. Logic 순수성 ───────────────────────────────────────────────────────

section("5. Logic 순수성");

if (fs.existsSync(logicPath)) {
  const logic = fs.readFileSync(logicPath, "utf-8");

  !/\bfetch\b|\baxios\b/.test(logic)
    ? ok("외부 API 호출 없음")
    : fail("fetch 또는 axios 발견", "logic.ts는 순수 함수만 허용");

  !/console\.(log|error|warn)/.test(logic)
    ? ok("console 출력 없음")
    : fail("console.log/error/warn 발견", "제거 필요");

  logic.includes("export function process")
    ? ok("process 함수 export 존재")
    : fail("process 함수 export 없음", "export function process(...) 필요");
}

// ─── 6. TypeScript 검사 ────────────────────────────────────────────────────

section("6. TypeScript");

try {
  execSync("npx tsc --noEmit", { cwd: ROOT, stdio: "pipe" });
  ok("tsc --noEmit 통과");
} catch (e: unknown) {
  const output = (e as { stderr?: Buffer; stdout?: Buffer }).stderr?.toString()
    ?? (e as { stderr?: Buffer; stdout?: Buffer }).stdout?.toString()
    ?? "";
  fail("tsc --noEmit 실패", output.split("\n")[0]);
}

// ─── 결과 요약 ──────────────────────────────────────────────────────────────

console.log("\n" + "─".repeat(50));

if (failed === 0) {
  console.log(`${GREEN}${BOLD}✔ PASSED${RESET}  ${passed}개 항목 모두 통과`);
  process.exit(0);
} else {
  console.log(`${RED}${BOLD}✖ FAILED${RESET}  통과 ${passed}개 / 실패 ${failed}개`);
  console.log(`\n${BOLD}실패 항목:${RESET}`);
  failures.forEach((f) => console.log(`  ${RED}•${RESET} ${f}`));
  process.exit(1);
}
