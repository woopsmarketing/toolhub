import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('duplicate-line-remover logic', () => {
  it('빈 입력은 빈 문자열', () => {
    expect(process('')).toBe('');
  });

  it('중복된 줄 제거 (순서 보존)', () => {
    expect(process('a\nb\na\nc\nb')).toBe('a\nb\nc');
  });

  it('모든 줄이 동일하면 1줄만 남음', () => {
    expect(process('hi\nhi\nhi')).toBe('hi');
  });

  it('빈 줄도 1번만 남고 중복 제거', () => {
    expect(process('a\n\nb\n\nc')).toBe('a\n\nb\nc');
  });

  it('대소문자/공백을 다르게 취급 (정확 일치)', () => {
    expect(process('A\na\nA')).toBe('A\na');
  });
});
