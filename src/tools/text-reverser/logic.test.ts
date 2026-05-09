import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('text-reverser logic', () => {
  it('빈 입력은 빈 문자열', () => {
    expect(process('')).toBe('');
  });

  it('영문 문자열 뒤집기', () => {
    expect(process('hello')).toBe('olleh');
  });

  it('한글 문자열 뒤집기', () => {
    expect(process('안녕하세요')).toBe('요세하녕안');
  });

  it('이모지(서로게이트 페어)도 안전하게 뒤집기', () => {
    // Array.from은 surrogate pair를 코드포인트 단위로 분리
    expect(process('a😀b')).toBe('b😀a');
  });

  it('회문은 동일한 결과', () => {
    expect(process('abcba')).toBe('abcba');
  });
});
