import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('password-generator logic', () => {
  it('기본 입력은 길이 16의 비밀번호 생성', () => {
    const r = process({ length: 16 });
    expect(String(r.password).length).toBe(16);
    expect(typeof r.strength).toBe('string');
  });

  it('지정 길이 32', () => {
    const r = process({ length: 32 });
    expect(String(r.password).length).toBe(32);
  });

  it('최소 길이 4 미만은 4로 클램프', () => {
    const r = process({ length: 1 });
    expect(String(r.password).length).toBe(4);
  });

  it('최대 길이 128 초과는 128로 클램프', () => {
    const r = process({ length: 200 });
    expect(String(r.password).length).toBe(128);
  });

  it('소문자만 사용 시 소문자 외 문자 미포함', () => {
    const r = process({
      length: 20,
      includeUpper: 'no',
      includeNumbers: 'no',
      includeSymbols: 'no',
    });
    expect(String(r.password)).toMatch(/^[a-z]+$/);
  });

  it('강도 평가 라벨이 존재', () => {
    const r = process({ length: 32 });
    expect(['약함', '보통', '강함', '매우 강함']).toContain(String(r.strength));
  });
});
