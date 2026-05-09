import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('bmi-calculator logic', () => {
  it('빈 입력은 "-" 반환', () => {
    const r = process({ height: 0, weight: 0 });
    expect(r.bmi).toBe('-');
    expect(r.category).toBe('-');
    expect(r.normal).toBe('-');
  });

  it('70kg/175cm는 BMI 22.9 (정상)', () => {
    const r = process({ height: 175, weight: 70 });
    expect(r.bmi).toBe('22.9');
    expect(r.category).toBe('정상');
  });

  it('저체중 분류 (BMI < 18.5)', () => {
    const r = process({ height: 170, weight: 50 });
    expect(r.category).toBe('저체중');
  });

  it('비만 분류 (BMI >= 30)', () => {
    const r = process({ height: 170, weight: 95 });
    expect(r.category).toBe('비만');
  });

  it('정상 체중 범위 문자열 형식 검증', () => {
    const r = process({ height: 170, weight: 65 });
    expect(String(r.normal)).toMatch(/^\d+\.\d+ ~ \d+\.\d+$/);
  });
});
