import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('date-calculator logic', () => {
  it('빈 입력은 형식 오류 메시지 반환', () => {
    const r = process({ startDate: '', endDate: '' });
    expect(r.days).toBe('날짜 형식을 확인하세요 (YYYY-MM-DD)');
  });

  it('동일 날짜는 0일/0주/0개월', () => {
    const r = process({ startDate: '2024-01-01', endDate: '2024-01-01' });
    expect(r.days).toBe(0);
    expect(r.weeks).toBe(0);
    expect(r.months).toBe(0);
  });

  it('1년 차이는 365일/52주/12개월', () => {
    const r = process({ startDate: '2023-01-01', endDate: '2024-01-01' });
    expect(r.days).toBe(365);
    expect(r.weeks).toBe(52);
    expect(r.months).toBe(12);
  });

  it('역순 입력도 절대값으로 처리', () => {
    const r = process({ startDate: '2024-01-31', endDate: '2024-01-01' });
    expect(r.days).toBe(30);
  });
});
