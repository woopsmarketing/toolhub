import { describe, it, expect } from "vitest";
import { process } from "./logic";

// Helper: parse a Korean-locale formatted integer string ("3,665,988") back to number
const num = (s: string | number) => Number(String(s).replace(/,/g, ""));

describe("savings-calculator logic", () => {
  it("월 30만 원 / 4% / 12개월 / 일반과세 — 단리 공식 검증", () => {
    const r = process({
      monthly: 300000,
      rate: 4,
      months: 12,
      taxBracket: "standard",
    });
    // 원금 = 300,000 × 12 = 3,600,000
    expect(num(r.principal)).toBe(3_600_000);
    // 단리 세전 = 300,000 × (0.04/12) × (12×13/2) = 78,000
    expect(num(r.simpleInterest)).toBe(78_000);
    // 단리 세후 = 78,000 × (1 - 0.154) = 65,988
    expect(num(r.simpleAfterTax)).toBe(65_988);
    // 단리 만기 = 3,600,000 + 65,988 = 3,665,988
    expect(num(r.simpleMaturity)).toBe(3_665_988);
  });

  it("비과세 — 세전 이자와 세후 이자가 동일", () => {
    const r = process({
      monthly: 500000,
      rate: 5,
      months: 24,
      taxBracket: "exempt",
    });
    expect(num(r.simpleInterest)).toBe(num(r.simpleAfterTax));
    expect(num(r.compoundInterest)).toBe(num(r.compoundAfterTax));
  });

  it("0 입력 — 모든 결과가 \"0\"", () => {
    const r = process({
      monthly: 0,
      rate: 4,
      months: 12,
      taxBracket: "standard",
    });
    expect(r.principal).toBe("0");
    expect(r.simpleInterest).toBe("0");
    expect(r.simpleAfterTax).toBe("0");
    expect(r.simpleMaturity).toBe("0");
    expect(r.compoundInterest).toBe("0");
    expect(r.compoundAfterTax).toBe("0");
    expect(r.compoundMaturity).toBe("0");
  });

  it("단리·복리 모두 양(+)의 이자, 만기액 > 원금 (12개월 이상)", () => {
    const r = process({
      monthly: 300000,
      rate: 4,
      months: 36,
      taxBracket: "exempt", // 세후 비교 단순화
    });
    const principal = num(r.principal);
    expect(num(r.simpleMaturity)).toBeGreaterThan(principal);
    expect(num(r.compoundMaturity)).toBeGreaterThan(principal);
    expect(num(r.simpleInterest)).toBeGreaterThan(0);
    expect(num(r.compoundInterest)).toBeGreaterThan(0);
    // 한국 적금 표준 공식: 만기일시지급 단리 ≥ 월복리 (단리 공식이 잔여기간 합산이므로)
    expect(num(r.simpleInterest)).toBeGreaterThanOrEqual(
      num(r.compoundInterest),
    );
  });

  it("세금우대(9.5%) 세후 이자 > 일반과세(15.4%) 세후 이자", () => {
    const base = { monthly: 300000, rate: 4, months: 12 } as const;
    const standard = process({ ...base, taxBracket: "standard" });
    const preferential = process({ ...base, taxBracket: "preferential" });
    expect(num(preferential.simpleAfterTax)).toBeGreaterThan(
      num(standard.simpleAfterTax),
    );
    expect(num(preferential.compoundAfterTax)).toBeGreaterThan(
      num(standard.compoundAfterTax),
    );
  });

  it("이자율 0% — 단리·복리 모두 이자 0, 만기액 = 원금", () => {
    const r = process({
      monthly: 100000,
      rate: 0,
      months: 6,
      taxBracket: "standard",
    });
    expect(num(r.principal)).toBe(600_000);
    expect(num(r.simpleInterest)).toBe(0);
    expect(num(r.compoundInterest)).toBe(0);
    expect(num(r.simpleMaturity)).toBe(600_000);
    expect(num(r.compoundMaturity)).toBe(600_000);
  });

  it("결과는 천 단위 구분 기호를 포함한 문자열", () => {
    const r = process({
      monthly: 300000,
      rate: 4,
      months: 12,
      taxBracket: "standard",
    });
    expect(typeof r.principal).toBe("string");
    expect(String(r.principal)).toContain(",");
    expect(String(r.simpleMaturity)).toContain(",");
  });

  it("일반과세 세후 = 세전 × (1 - 0.154) — 복리에도 동일하게 적용", () => {
    const r = process({
      monthly: 200000,
      rate: 3,
      months: 24,
      taxBracket: "standard",
    });
    const expectedAfter = Math.round(num(r.compoundInterest) * (1 - 0.154));
    // 부동소수 round 차이 허용 ±1원
    expect(Math.abs(num(r.compoundAfterTax) - expectedAfter)).toBeLessThanOrEqual(1);
  });
});
