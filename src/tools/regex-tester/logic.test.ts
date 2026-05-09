import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('regex-tester logic', () => {
  it('빈 입력은 안내 메시지', () => {
    expect(process('')).toContain('정규식 패턴과 테스트');
    expect(process('   ')).toContain('정규식 패턴과 테스트');
  });

  it('패턴만 있고 텍스트 없음', () => {
    expect(process('\\d+')).toContain('두 번째 줄부터');
  });

  it('매칭 성공: 숫자 추출', () => {
    const out = process('\\d+\nhello 123 world 456');
    expect(out).toContain('총 2건 매칭됨');
    expect(out).toContain('"123"');
    expect(out).toContain('"456"');
  });

  it('매칭 없음', () => {
    const out = process('xyz\nhello world');
    expect(out).toContain('매칭 결과 없음');
  });

  it('잘못된 정규식은 오류 메시지', () => {
    const out = process('[invalid\nsome text');
    expect(out).toContain('정규식 오류');
  });

  it('캡처 그룹 표시', () => {
    const out = process('(\\w+)@(\\w+)\nfoo@bar');
    expect(out).toContain('그룹');
    expect(out).toContain('"foo"');
  });
});
