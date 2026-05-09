import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('case-converter logic', () => {
  it('빈 입력은 모든 출력이 빈 문자열', () => {
    const r = process('');
    expect(r['대문자 (UPPERCASE)']).toBe('');
    expect(r['camelCase']).toBe('');
    expect(r['snake_case']).toBe('');
  });

  it('"hello world" 변환 케이스 검증', () => {
    const r = process('hello world');
    expect(r['대문자 (UPPERCASE)']).toBe('HELLO WORLD');
    expect(r['소문자 (lowercase)']).toBe('hello world');
    expect(r['camelCase']).toBe('helloWorld');
    expect(r['snake_case']).toBe('hello_world');
    expect(r['kebab-case']).toBe('hello-world');
  });

  it('Title Case 변환', () => {
    const r = process('hello world foo');
    expect(r['첫글자 대문자 (Title Case)']).toBe('Hello World Foo');
  });

  it('camelCase 입력을 분해해 다른 케이스로 변환', () => {
    const r = process('helloWorldFoo');
    expect(r['snake_case']).toBe('hello_world_foo');
    expect(r['kebab-case']).toBe('hello-world-foo');
  });
});
