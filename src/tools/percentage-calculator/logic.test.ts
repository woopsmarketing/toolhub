import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('percentage-calculator logic', () => {
  it('빈 입력 (0,0)은 모두 0', () => {
    const r = process({ value: 0, percentage: 0 });
    expect(r.result).toBe('0');
    expect(r.increase).toBe('0');
    expect(r.decrease).toBe('0');
  });

  it('200의 25%는 50, 증가 250, 감소 150', () => {
    const r = process({ value: 200, percentage: 25 });
    expect(r.result).toBe('50');
    expect(r.increase).toBe('250');
    expect(r.decrease).toBe('150');
  });

  it('100% 적용 시 increase는 두 배, decrease는 0', () => {
    const r = process({ value: 100, percentage: 100 });
    expect(r.increase).toBe('200');
    expect(r.decrease).toBe('0');
  });

  it('소수점 결과는 반올림 후 표기', () => {
    const r = process({ value: 1000, percentage: 33.33 });
    // 1000 * 33.33 / 100 = 333.3
    expect(String(r.result)).toContain('333');
  });
});
