import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('slug-generator logic', () => {
  it('빈 입력은 빈 문자열', () => {
    expect(process('')).toBe('');
  });

  it('공백을 하이픈으로 변환하고 소문자화', () => {
    expect(process('Hello World')).toBe('hello-world');
  });

  it('특수문자 제거', () => {
    expect(process('Hello, World!')).toBe('hello-world');
  });

  it('한글 보존', () => {
    expect(process('안녕 하세요')).toBe('안녕-하세요');
  });

  it('연속 하이픈 합치고 양 끝 하이픈 제거', () => {
    expect(process('--hello---world--')).toBe('hello-world');
  });

  it('밑줄/공백/대시 혼용을 단일 하이픈으로 정규화', () => {
    expect(process('foo_bar baz')).toBe('foo-bar-baz');
  });
});
