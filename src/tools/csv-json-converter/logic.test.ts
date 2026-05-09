import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('csv-json-converter logic', () => {
  it('빈 입력은 빈 문자열 반환', () => {
    expect(process('')).toBe('');
    expect(process('   ')).toBe('');
  });

  it('CSV → JSON 기본 변환', () => {
    const csv = 'name,age\nAlice,30\nBob,25';
    const out = process(csv);
    const parsed = JSON.parse(out);
    expect(parsed).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ]);
  });

  it('JSON → CSV 변환', () => {
    const json = '[{"name":"Alice","age":30}]';
    const out = process(json);
    expect(out).toBe('name,age\nAlice,30');
  });

  it('따옴표/콤마가 포함된 CSV 필드 파싱', () => {
    const csv = 'a,b\n"hello, world","line1\nline2"';
    const out = process(csv);
    const parsed = JSON.parse(out);
    expect(parsed[0].a).toBe('hello, world');
    expect(parsed[0].b).toBe('line1\nline2');
  });

  it('잘못된 JSON은 오류 주석 반환', () => {
    expect(process('{invalid}')).toMatch(/^\/\/ 오류:/);
  });
});
