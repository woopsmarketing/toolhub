/**
 * Logic Test Runner
 * Usage: npm run test-logic <slug>
 * Example: npm run test-logic percentage-calculator
 *
 * Logic Tester Agent가 src/tools/<slug>/logic.test.ts 를 먼저 작성한 뒤 이 스크립트를 실행합니다.
 */

import path from "path";

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npm run test-logic <slug>");
  process.exit(1);
}

const ROOT = path.resolve(import.meta.dirname, "..");
const testFilePath = path.join(ROOT, "src/tools", slug, "logic.test.ts");
const logicFilePath = path.join(ROOT, "src/tools", slug, "logic.ts");

import fs from "fs";
if (!fs.existsSync(testFilePath)) {
  console.error(`❌ 테스트 파일 없음: src/tools/${slug}/logic.test.ts`);
  console.error("Logic Tester Agent가 먼저 테스트 파일을 작성해야 합니다.");
  process.exit(1);
}
if (!fs.existsSync(logicFilePath)) {
  console.error(`❌ logic.ts 없음: src/tools/${slug}/logic.ts`);
  process.exit(1);
}

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

// 테스트 파일과 logic 파일을 동적으로 임포트
const { tests } = await import(testFilePath) as {
  tests: Array<{
    description: string;
    input: string | Record<string, string | number>;
    expect?: Record<string, string | number>;
    validate?: (result: Record<string, string | number>) => boolean;
  }>;
};

const { process: runLogic } = await import(logicFilePath) as {
  process: (input: string | Record<string, string | number>) => Record<string, string | number>;
};

console.log(`\n${BOLD}Logic Test: ${slug}${RESET}`);
console.log(`총 ${tests.length}개 테스트\n`);

let passed = 0;
let failed = 0;

for (const test of tests) {
  try {
    const result = runLogic(test.input as string & Record<string, string | number>);

    // expect 기반 검증
    if (test.expect) {
      const failures: string[] = [];
      for (const [key, expected] of Object.entries(test.expect)) {
        const actual = result[key];
        if (actual !== expected) {
          failures.push(`  ${key}: 기대 ${YELLOW}${expected}${RESET}, 실제 ${RED}${actual}${RESET}`);
        }
      }
      if (failures.length === 0) {
        console.log(`  ${GREEN}✔${RESET} ${test.description}`);
        passed++;
      } else {
        console.log(`  ${RED}✖${RESET} ${test.description}`);
        failures.forEach((f) => console.log(f));
        failed++;
      }
    }

    // validate 함수 기반 검증
    else if (test.validate) {
      if (test.validate(result)) {
        console.log(`  ${GREEN}✔${RESET} ${test.description}`);
        passed++;
      } else {
        console.log(`  ${RED}✖${RESET} ${test.description}`);
        console.log(`    결과: ${JSON.stringify(result)}`);
        failed++;
      }
    }
  } catch (e) {
    console.log(`  ${RED}✖${RESET} ${test.description} — 런타임 오류`);
    console.log(`    ${String(e)}`);
    failed++;
  }
}

console.log("\n" + "─".repeat(40));
if (failed === 0) {
  console.log(`${GREEN}${BOLD}✔ PASSED${RESET}  ${passed}개 모두 통과`);
  process.exit(0);
} else {
  console.log(`${RED}${BOLD}✖ FAILED${RESET}  통과 ${passed} / 실패 ${failed}`);
  process.exit(1);
}
