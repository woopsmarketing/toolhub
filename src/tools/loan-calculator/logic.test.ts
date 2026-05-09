import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('loan-calculator logic', () => {
  it('빈 입력은 모두 0', () => {
    const r = process({ principal: 0, interestRate: 0, years: 0 });
    expect(r.monthly).toBe('0');
    expect(r.totalPayment).toBe('0');
    expect(r.totalInterest).toBe('0');
  });

  it('무이자(0%) 대출은 원금/n으로 분할', () => {
    const r = process({ principal: 12000000, interestRate: 0, years: 1 });
    expect(r.monthly).toBe('1,000,000');
    expect(r.totalInterest).toBe('0');
  });

  it('이자율 적용 (100만원, 6%, 1년)', () => {
    const r = process({ principal: 1000000, interestRate: 6, years: 1 });
    // monthly ≈ 86,066, total ≈ 1,032,793
    expect(String(r.monthly)).toMatch(/^[\d,]+$/);
    expect(Number(String(r.monthly).replace(/,/g, ''))).toBeGreaterThan(80000);
    expect(Number(String(r.totalInterest).replace(/,/g, ''))).toBeGreaterThan(0);
  });

  it('원금 0이면 모두 0', () => {
    const r = process({ principal: 0, interestRate: 5, years: 10 });
    expect(r.monthly).toBe('0');
  });
});
