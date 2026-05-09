import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('lorem-ipsum-generator logic', () => {
  it('기본값 (paragraphs 미지정 → 3)', () => {
    const r = process({});
    const paragraphs = String(r.text).split('\n\n');
    expect(paragraphs.length).toBe(3);
  });

  it('지정한 문단 수만큼 생성', () => {
    const r = process({ paragraphs: 5 });
    expect(String(r.text).split('\n\n').length).toBe(5);
  });

  it('음수는 1로, 20 초과는 20으로 클램프', () => {
    // 0은 falsy → 기본값 3
    expect(String(process({ paragraphs: -5 }).text).split('\n\n').length).toBe(1);
    expect(String(process({ paragraphs: 100 }).text).split('\n\n').length).toBe(20);
  });

  it('생성된 텍스트는 "Lorem"으로 시작', () => {
    const r = process({ paragraphs: 1 });
    expect(String(r.text)).toMatch(/^Lorem/);
  });
});
