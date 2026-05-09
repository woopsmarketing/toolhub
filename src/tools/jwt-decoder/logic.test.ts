import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('jwt-decoder logic', () => {
  it('빈 입력은 빈 결과', () => {
    const r = process('');
    expect(r['헤더(Header)']).toBe('');
    expect(r['페이로드(Payload)']).toBe('');
  });

  it('형식이 잘못된 토큰 (마침표 부족)은 오류 메시지', () => {
    const r = process('not.jwt');
    expect(r['헤더(Header)']).toContain('JWT 형식이 올바르지 않습니다');
  });

  it('표준 JWT 디코딩 (HS256, sub:1234567890)', () => {
    // {"alg":"HS256","typ":"JWT"}.{"sub":"1234567890","name":"John Doe","iat":1516239022}.<sig>
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const r = process(token);
    const header = JSON.parse(String(r['헤더(Header)']));
    const payload = JSON.parse(String(r['페이로드(Payload)']));
    expect(header.alg).toBe('HS256');
    expect(header.typ).toBe('JWT');
    expect(payload.sub).toBe('1234567890');
    expect(payload.name).toBe('John Doe');
  });

  it('손상된 base64 페이로드는 오류 메시지', () => {
    const r = process('eyJhbGciOiJIUzI1NiJ9.!!!corrupt!!!.sig');
    expect(String(r['페이로드(Payload)'])).toContain('오류');
  });
});
