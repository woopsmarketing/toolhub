import { describe, it, expect } from "vitest";
import { process } from "./logic";

describe("whitespace-remover logic", () => {
  it("빈 입력은 빈 문자열", () => {
    expect(process("")).toBe("");
  });

  it("앞뒤 공백 trim", () => {
    expect(process("   hello   ")).toBe("hello");
  });

  it("연속 공백·탭을 단일 공백으로 압축", () => {
    expect(process("a   b\t\tc")).toBe("a b c");
  });

  it("연속된 빈 줄 제거 (\\n\\n\\n → \\n)", () => {
    expect(process("line1\n\n\nline2")).toBe("line1\nline2");
  });

  it("공백만 있는 줄도 빈 줄로 간주하여 제거", () => {
    expect(process("line1\n   \nline2")).toBe("line1\nline2");
  });

  it("공백/줄바꿈만 있는 입력은 빈 문자열", () => {
    expect(process("\n\n\n   \t\n")).toBe("");
  });

  it("trim + 빈 줄 제거 복합", () => {
    expect(process("  a  \n  b  ")).toBe("a\nb");
  });

  it("탭과 공백 혼합 압축", () => {
    expect(process("a\t \tb")).toBe("a b");
  });

  it("줄바꿈 보존 — 의미 있는 줄 사이 \\n 유지", () => {
    expect(process("first paragraph\nsecond line")).toBe(
      "first paragraph\nsecond line",
    );
  });
});
