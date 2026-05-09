import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('age-calculator logic', () => {
  it('빈 입력은 형식 오류를 반환', () => {
    const r = process({ birthDate: '' });
    expect(r.age).toBe('날짜 형식을 확인하세요 (YYYY-MM-DD)');
    expect(r.koreanAge).toBe('-');
  });

  it('잘못된 날짜 문자열은 형식 오류를 반환', () => {
    const r = process({ birthDate: 'not-a-date' });
    expect(r.age).toBe('날짜 형식을 확인하세요 (YYYY-MM-DD)');
  });

  it('과거 생일은 만 나이/한국 나이를 계산', () => {
    const r = process({ birthDate: '2000-01-01' });
    expect(typeof r.age).toBe('number');
    expect(typeof r.koreanAge).toBe('number');
    expect(Number(r.age)).toBeGreaterThan(0);
    expect(Number(r.koreanAge)).toBe(Number(r.age) + 1);
  });

  it('생일 이후 일수와 다음 생일까지 일수가 계산됨', () => {
    const r = process({ birthDate: '1990-06-15' });
    // days는 toLocaleString된 문자열
    expect(typeof r.days).toBe('string');
    expect(typeof r.nextBirthday).toBe('number');
    expect(Number(r.nextBirthday)).toBeGreaterThanOrEqual(0);
    expect(Number(r.nextBirthday)).toBeLessThanOrEqual(366);
  });
});
