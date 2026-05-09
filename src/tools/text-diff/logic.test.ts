import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('text-diff logic', () => {
  it('빈 입력은 안내 메시지', () => {
    expect(process('')).toContain('두 텍스트를');
  });

  it('구분자(---) 없는 입력은 형식 안내', () => {
    expect(process('hello world')).toContain('구분자');
  });

  it('동일한 텍스트는 추가/삭제 0', () => {
    const out = process('a\nb\n---\na\nb');
    expect(out).toContain('추가된 줄: 0개');
    expect(out).toContain('삭제된 줄: 0개');
  });

  it('변경 사항 추가/삭제 카운트', () => {
    const out = process('a\nb\nc\n---\na\nx\nc');
    expect(out).toContain('추가된 줄: 1개');
    expect(out).toContain('삭제된 줄: 1개');
    expect(out).toContain('+ x');
    expect(out).toContain('- b');
  });

  it('단일 --- 라인도 구분자로 인식', () => {
    const out = process('hello\n---\nworld');
    expect(out).toContain('+ world');
    expect(out).toContain('- hello');
  });
});
