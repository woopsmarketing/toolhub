import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('json-formatter logic', () => {
  it('빈 입력은 빈 문자열', () => {
    expect(process('')).toBe('');
    expect(process('   ')).toBe('');
  });

  it('압축 JSON을 들여쓰기 2칸으로 포맷', () => {
    const out = process('{"a":1,"b":[2,3]}');
    expect(out).toBe('{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}');
  });

  it('잘못된 JSON은 오류 메시지 반환', () => {
    const out = process('{not valid}');
    expect(out).toContain('오류:');
    expect(out).toContain('올바르지 않은 JSON');
  });

  it('이미 포맷된 JSON도 동일 결과', () => {
    const formatted = '{\n  "a": 1\n}';
    expect(process(formatted)).toBe(formatted);
  });
});
