import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('color-converter logic', () => {
  it('빈 입력은 빈 결과', () => {
    const r = process('');
    expect(r.HEX).toBe('');
    expect(r.RGB).toBe('');
    expect(r.HSL).toBe('');
  });

  it('HEX → RGB/HSL 변환 (#FF0000)', () => {
    const r = process('#FF0000');
    expect(r.HEX).toBe('#FF0000');
    expect(r.RGB).toBe('rgb(255, 0, 0)');
    expect(r.HSL).toBe('hsl(0, 100%, 50%)');
  });

  it('RGB 형식 인식 및 HEX 변환', () => {
    const r = process('rgb(0, 255, 0)');
    expect(r.HEX).toBe('#00FF00');
  });

  it('짧은 HEX(#F00) 정규화', () => {
    const r = process('#F00');
    expect(r.HEX).toBe('#FF0000');
  });

  it('인식 불가 입력은 안내 메시지', () => {
    const r = process('not-a-color');
    expect(String(r.HSL)).toContain('인식할 수 없는');
  });
});
