import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('unit-converter logic', () => {
  it('값이 0이면 0 결과', () => {
    const r = process({ value: 0, fromUnit: 'km', toUnit: 'm' });
    expect(r.result).toBe('0 m');
  });

  it('1km = 1000m', () => {
    const r = process({ value: 1, fromUnit: 'km', toUnit: 'm' });
    expect(r.result).toBe('1000 m');
  });

  it('100cm = 1m', () => {
    const r = process({ value: 100, fromUnit: 'cm', toUnit: 'm' });
    expect(r.result).toBe('1 m');
  });

  it('1mi = 1.609344km', () => {
    const r = process({ value: 1, fromUnit: 'mi', toUnit: 'km' });
    expect(r.result).toBe('1.609344 km');
  });

  it('동일 단위 변환은 입력 그대로', () => {
    const r = process({ value: 5, fromUnit: 'm', toUnit: 'm' });
    expect(r.result).toBe('5 m');
  });
});
