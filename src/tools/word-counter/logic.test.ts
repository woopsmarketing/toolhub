import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('word-counter logic', () => {
  it('빈 문자열은 모든 카운트가 0', () => {
    const result = process('');
    expect(result['글자(공백포함)']).toBe(0);
    expect(result['글자(공백제외)']).toBe(0);
    expect(result['단어']).toBe(0);
    expect(result['문장']).toBe(0);
    expect(result['문단']).toBe(0);
    expect(result['줄']).toBe(0);
    expect(result['바이트(UTF-8)']).toBe(0);
    expect(result['읽기 시간']).toBe('0초');
  });

  it('한 단어 "hello"는 단어 1개, 글자 5개', () => {
    const result = process('hello');
    expect(result['단어']).toBe(1);
    expect(result['글자(공백포함)']).toBe(5);
    expect(result['글자(공백제외)']).toBe(5);
  });
});
