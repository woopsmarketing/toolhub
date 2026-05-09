import { describe, it, expect } from 'vitest';
import { process } from './logic';

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('uuid-generator logic', () => {
  it('기본 입력은 1개 UUID 생성', () => {
    const r = process({});
    const uuids = String(r.uuids).split('\n');
    expect(uuids.length).toBe(1);
    expect(uuids[0]).toMatch(UUID_V4_REGEX);
  });

  it('count 5개 생성', () => {
    const r = process({ count: 5 });
    const uuids = String(r.uuids).split('\n');
    expect(uuids.length).toBe(5);
    uuids.forEach((u) => expect(u).toMatch(UUID_V4_REGEX));
  });

  it('1 미만은 1로, 50 초과는 50으로 클램프', () => {
    expect(String(process({ count: 0 }).uuids).split('\n').length).toBe(1);
    expect(String(process({ count: 999 }).uuids).split('\n').length).toBe(50);
  });

  it('생성된 UUID는 고유성을 가짐', () => {
    const r = process({ count: 10 });
    const uuids = String(r.uuids).split('\n');
    expect(new Set(uuids).size).toBe(10);
  });
});
