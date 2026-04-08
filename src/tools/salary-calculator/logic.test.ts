/**
 * salary-calculator logic.test.ts
 * 실행: npm run test-logic salary-calculator
 */

const toNum = (s: string | number) =>
  Number(String(s).replace(/,/g, ""));

export const tests = [
  // ─────────────────────────────────────────────
  // 1. 빈 입력 (연봉 0): 모든 결과 "0"
  // ─────────────────────────────────────────────
  {
    description: "연봉 0 → 모든 항목이 '0'",
    input: {
      annualSalary: 0,
      dependents: "1",
      mealAllowance: "0",
      retirementIncluded: "false",
    },
    expect: {
      monthlyGross: "0",
      nationalPension: "0",
      healthInsurance: "0",
      longTermCare: "0",
      employmentInsurance: "0",
      incomeTax: "0",
      localIncomeTax: "0",
      totalDeduction: "0",
      netSalary: "0",
    },
  },

  // ─────────────────────────────────────────────
  // 2. 연봉 4,000만원 / 부양가족 1명 / 식대 미포함 / 퇴직금 별도
  //    monthlyGross 값 검증 + 공제 항목 양수 + netSalary < monthlyGross
  // ─────────────────────────────────────────────
  {
    description: "연봉 4,000만원 기본 케이스 — monthlyGross가 '3,333,333'",
    input: {
      annualSalary: 40000000,
      dependents: "1",
      mealAllowance: "0",
      retirementIncluded: "false",
    },
    expect: {
      monthlyGross: "3,333,333",
    },
  },
  {
    description: "연봉 4,000만원 — 모든 공제 항목이 양수",
    input: {
      annualSalary: 40000000,
      dependents: "1",
      mealAllowance: "0",
      retirementIncluded: "false",
    },
    validate: (result: Record<string, string | number>) => {
      const fields = [
        "nationalPension",
        "healthInsurance",
        "longTermCare",
        "employmentInsurance",
        "incomeTax",
        "localIncomeTax",
        "totalDeduction",
      ] as const;
      return fields.every((key) => toNum(result[key]) > 0);
    },
  },
  {
    description: "연봉 4,000만원 — netSalary가 monthlyGross보다 작다",
    input: {
      annualSalary: 40000000,
      dependents: "1",
      mealAllowance: "0",
      retirementIncluded: "false",
    },
    validate: (result: Record<string, string | number>) =>
      toNum(result.netSalary) < toNum(result.monthlyGross),
  },

  // ─────────────────────────────────────────────
  // 3. 연봉 5,000만원: 부양가족 1명 vs 2명 — 소득세 감소 확인
  // ─────────────────────────────────────────────
  {
    description: "연봉 5,000만원 / 부양가족 1명 — incomeTax 정확한 값",
    input: {
      annualSalary: 50000000,
      dependents: "1",
      mealAllowance: "0",
      retirementIncluded: "false",
    },
    expect: {
      incomeTax: "276,875",
    },
  },
  {
    description: "연봉 5,000만원 / 부양가족 2명 — 부양가족 1명보다 incomeTax가 낮다",
    input: {
      annualSalary: 50000000,
      dependents: "2",
      mealAllowance: "0",
      retirementIncluded: "false",
    },
    validate: (result: Record<string, string | number>) =>
      toNum(result.incomeTax) < 276875,
  },

  // ─────────────────────────────────────────────
  // 4. 퇴직금 포함(true) 시 monthlyGross가 퇴직금 별도(false)보다 낮다
  // ─────────────────────────────────────────────
  {
    description: "퇴직금 포함 — monthlyGross가 '3,076,923'",
    input: {
      annualSalary: 40000000,
      dependents: "1",
      mealAllowance: "0",
      retirementIncluded: "true",
    },
    expect: {
      monthlyGross: "3,076,923",
    },
  },
  {
    description: "퇴직금 포함 시 monthlyGross가 퇴직금 별도보다 낮다",
    input: {
      annualSalary: 40000000,
      dependents: "1",
      mealAllowance: "0",
      retirementIncluded: "true",
    },
    validate: (result: Record<string, string | number>) =>
      toNum(result.monthlyGross) < 3333333,
  },

  // ─────────────────────────────────────────────
  // 5. 비과세 식대(20만원) 적용 시 netSalary가 더 높다
  // ─────────────────────────────────────────────
  {
    description: "식대 미포함 — netSalary가 '2,830,883'",
    input: {
      annualSalary: 40000000,
      dependents: "1",
      mealAllowance: "0",
      retirementIncluded: "false",
    },
    expect: {
      netSalary: "2,830,883",
    },
  },
  {
    description: "비과세 식대 20만원 적용 — 미적용 시보다 netSalary가 높다",
    input: {
      annualSalary: 40000000,
      dependents: "1",
      mealAllowance: "200000",
      retirementIncluded: "false",
    },
    validate: (result: Record<string, string | number>) =>
      toNum(result.netSalary) > 2830883,
  },
];
