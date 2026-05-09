import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('korean-typing-converter logic', () => {
  it('빈 입력은 변환 불가', () => {
    const r = process('');
    expect(r['변환 결과']).toBe('');
    expect(r['감지된 방향']).toBe('변환 불가');
    expect(r['원본 길이']).toBe(0);
    expect(r['변환 길이']).toBe(0);
  });

  it('영타 → 한글: "dkssud" → "안녕"', () => {
    const r = process('dkssud');
    expect(r['변환 결과']).toBe('안녕');
    expect(r['감지된 방향']).toBe('영타 → 한글');
  });

  it('한글 → 영타: "안녕" → "dkssud"', () => {
    const r = process('안녕');
    expect(r['변환 결과']).toBe('dkssud');
    expect(r['감지된 방향']).toBe('한글 → 영타');
  });

  it('한글/영문 모두 없는 입력은 변환 불가', () => {
    const r = process('123 !@#');
    expect(r['감지된 방향']).toBe('변환 불가');
  });

  it('영타 → 한글 round-trip 가능 ("rkskek" → "가나다")', () => {
    const r = process('rkskek');
    expect(r['변환 결과']).toBe('가나다');
  });
});
