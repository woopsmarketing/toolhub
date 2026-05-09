import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('discount-calculator logic', () => {
  it('빈 입력 (0,0)은 0 결과', () => {
    const r = process({ originalPrice: 0, discountRate: 0 });
    expect(r.discountAmount).toBe('0');
    expect(r.finalPrice).toBe('0');
    expect(r.saved).toBe('0');
  });

  it('10000원에서 20% 할인은 2000원/8000원', () => {
    const r = process({ originalPrice: 10000, discountRate: 20 });
    expect(r.discountAmount).toBe('2,000');
    expect(r.finalPrice).toBe('8,000');
    expect(r.saved).toBe('20');
  });

  it('100% 할인은 전액 할인', () => {
    const r = process({ originalPrice: 50000, discountRate: 100 });
    expect(r.finalPrice).toBe('0');
  });

  it('소수점 할인율은 1자리로 표기', () => {
    const r = process({ originalPrice: 10000, discountRate: 12.5 });
    expect(r.saved).toBe('12.5');
  });
});
