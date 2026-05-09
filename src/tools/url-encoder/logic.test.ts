import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('url-encoder logic', () => {
  it('빈 입력은 빈 결과', () => {
    const r = process('');
    expect(r['인코딩 결과']).toBe('');
    expect(r['디코딩 결과']).toBe('');
  });

  it('공백/특수문자 인코딩', () => {
    const r = process('hello world & foo');
    expect(r['인코딩 결과']).toBe('hello%20world%20%26%20foo');
  });

  it('퍼센트 인코딩 디코딩', () => {
    const r = process('hello%20world');
    expect(r['디코딩 결과']).toBe('hello world');
  });

  it('한글 인코딩 (UTF-8 percent)', () => {
    const r = process('안녕');
    expect(r['인코딩 결과']).toBe('%EC%95%88%EB%85%95');
  });

  it('잘못된 percent escape는 디코딩 오류', () => {
    const r = process('%ZZ');
    expect(r['디코딩 결과']).toContain('디코딩 오류');
  });
});
