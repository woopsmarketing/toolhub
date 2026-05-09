import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('base64-encoder logic', () => {
  it('빈 문자열은 인코딩/디코딩 모두 빈 결과', () => {
    const r = process('');
    expect(r['인코딩 결과']).toBe('');
    expect(r['디코딩 결과']).toBe('');
  });

  it('"hello" 인코딩은 "aGVsbG8="', () => {
    const r = process('hello');
    expect(r['인코딩 결과']).toBe('aGVsbG8=');
  });

  it('Base64 문자열 디코딩 round-trip', () => {
    const r = process('aGVsbG8=');
    expect(r['디코딩 결과']).toBe('hello');
  });

  it('한글 인코딩은 UTF-8 변환 후 처리', () => {
    const r = process('안녕');
    // "안녕" → UTF-8 → base64
    expect(r['인코딩 결과']).toBe('7JWI64WV');
  });

  it('잘못된 base64 디코딩은 오류 메시지 반환', () => {
    const r = process('한글입력');
    expect(r['디코딩 결과']).toContain('디코딩 오류');
  });
});
