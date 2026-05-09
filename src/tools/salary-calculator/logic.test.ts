import { describe, it, expect } from 'vitest';
import { process } from './logic';

const toNum = (s: string | number) => Number(String(s).replace(/,/g, ''));

describe('salary-calculator logic', () => {
  it('연봉 0은 모든 항목이 "0"', () => {
    const r = process({
      annualSalary: 0,
      dependents: '1',
      mealAllowance: '0',
      retirementIncluded: 'false',
    });
    expect(r.monthlyGross).toBe('0');
    expect(r.netSalary).toBe('0');
    expect(r.totalDeduction).toBe('0');
  });

  it('연봉 4,000만원 monthlyGross "3,333,333"', () => {
    const r = process({
      annualSalary: 40000000,
      dependents: '1',
      mealAllowance: '0',
      retirementIncluded: 'false',
    });
    expect(r.monthlyGross).toBe('3,333,333');
    expect(r.netSalary).toBe('2,830,883');
    expect(toNum(r.netSalary) < toNum(r.monthlyGross)).toBe(true);
  });

  it('연봉 5,000만원 / 부양가족 2명은 1명보다 incomeTax가 낮음', () => {
    const r1 = process({ annualSalary: 50000000, dependents: '1', mealAllowance: '0', retirementIncluded: 'false' });
    const r2 = process({ annualSalary: 50000000, dependents: '2', mealAllowance: '0', retirementIncluded: 'false' });
    expect(r1.incomeTax).toBe('276,875');
    expect(toNum(r2.incomeTax)).toBeLessThan(toNum(r1.incomeTax));
  });

  it('퇴직금 포함 옵션은 monthlyGross가 낮음', () => {
    const r = process({
      annualSalary: 40000000,
      dependents: '1',
      mealAllowance: '0',
      retirementIncluded: 'true',
    });
    expect(r.monthlyGross).toBe('3,076,923');
  });

  it('비과세 식대 적용 시 netSalary 증가', () => {
    const r = process({
      annualSalary: 40000000,
      dependents: '1',
      mealAllowance: '200000',
      retirementIncluded: 'false',
    });
    expect(toNum(r.netSalary)).toBeGreaterThan(2830883);
  });
});
