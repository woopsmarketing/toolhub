import { describe, it, expect } from 'vitest';
import { process } from './logic';

describe('html-entity-converter logic', () => {
  it('빈 입력은 빈 결과', () => {
    const r = process('');
    expect(r['엔티티 변환']).toBe('');
    expect(r['엔티티 해석']).toBe('');
  });

  it('특수문자 인코딩', () => {
    const r = process('<div class="x">&hello\'</div>');
    expect(r['엔티티 변환']).toBe('&lt;div class=&quot;x&quot;&gt;&amp;hello&#39;&lt;/div&gt;');
  });

  it('명명 엔티티 디코딩', () => {
    const r = process('&lt;p&gt;hi&lt;/p&gt;');
    expect(r['엔티티 해석']).toBe('<p>hi</p>');
  });

  it('숫자 엔티티 (10진수/16진수) 디코딩', () => {
    const r = process('&#65;&#x42;');
    expect(r['엔티티 해석']).toBe('AB');
  });

  it('확장 엔티티 (©, ™ 등) 디코딩', () => {
    const r = process('&copy;&trade;');
    expect(r['엔티티 해석']).toBe('©™');
  });
});
