import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('unicode-converter logic', () => {
  it('빈 입력은 빈 결과', () => {
    const r = process('');
    expect(r['유니코드 변환']).toBe('');
    expect(r['유니코드 해석']).toBe('');
  });

  it('ASCII 변환', () => {
    const r = process('A');
    expect(r['유니코드 변환']).toBe('\\u0041');
  });

  it('한글 변환', () => {
    const r = process('가');
    // '가' = U+AC00
    expect(r['유니코드 변환']).toBe('\\uAC00');
  });

  it('이스케이프 시퀀스 디코딩', () => {
    const r = process('\\u0041\\u0042');
    expect(r['유니코드 해석']).toBe('AB');
  });

  it('이모지(서플리먼터리 평면)는 surrogate pair', () => {
    const r = process('😀');
    // U+1F600 → 😀
    expect(r['유니코드 변환']).toBe('\\uD83D\\uDE00');
  });
});
