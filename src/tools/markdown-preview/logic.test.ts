import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('markdown-preview logic', () => {
  it('빈 입력은 빈 문자열', () => {
    expect(process('')).toBe('');
    expect(process('   ')).toBe('');
  });

  it('헤딩 변환 (# / ## / ###)', () => {
    expect(process('# H1')).toBe('<h1>H1</h1>');
    expect(process('## H2')).toBe('<h2>H2</h2>');
    expect(process('### H3')).toBe('<h3>H3</h3>');
  });

  it('볼드/이탤릭/인라인 코드', () => {
    expect(process('**bold**')).toBe('<p><strong>bold</strong></p>');
    expect(process('*italic*')).toBe('<p><em>italic</em></p>');
    expect(process('`code`')).toBe('<p><code>code</code></p>');
  });

  it('링크 변환', () => {
    expect(process('[text](http://x.com)')).toBe(
      '<p><a href="http://x.com">text</a></p>'
    );
  });

  it('순서 없는 리스트와 인용문', () => {
    expect(process('- item1\n- item2')).toBe(
      '<ul>\n<li>item1</li>\n<li>item2</li>\n</ul>'
    );
    expect(process('> quote')).toBe('<blockquote>quote</blockquote>');
  });

  it('코드블록은 escape 후 pre/code로 감쌈', () => {
    const out = process('```\n<x>&\n```');
    expect(out).toContain('<pre><code>');
    expect(out).toContain('&lt;x&gt;&amp;');
  });
});
