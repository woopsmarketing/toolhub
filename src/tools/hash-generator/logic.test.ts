import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('hash-generator logic', () => {
  it('빈 입력은 빈 문자열', () => {
    expect(process('')).toBe('');
  });

  it('"hello"의 알려진 해시 값 검증', () => {
    const out = process('hello');
    // MD5("hello") = 5d41402abc4b2a76b9719d911017c592
    expect(out).toContain('5d41402abc4b2a76b9719d911017c592');
    // SHA-1("hello") = aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d
    expect(out).toContain('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
    // SHA-256("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
    expect(out).toContain('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('출력에 5종 알고리즘 라벨 포함', () => {
    const out = process('test');
    expect(out).toContain('MD5');
    expect(out).toContain('SHA-1');
    expect(out).toContain('SHA-256');
    expect(out).toContain('SHA-384');
    expect(out).toContain('SHA-512');
  });

  it('한글 입력도 해시 생성', () => {
    const out = process('안녕');
    expect(out.length).toBeGreaterThan(100);
    expect(out).toContain('SHA-256');
  });
});
