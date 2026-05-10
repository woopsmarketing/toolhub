import { describe, it, expect } from "vitest";
import { process } from "./logic";

describe("qr-code-generator logic (단순 버전)", () => {
  it("빈 입력은 null 반환", () => {
    expect(process("")).toBeNull();
  });

  it("공백만 있는 입력도 null 반환", () => {
    expect(process("   \t\n  ")).toBeNull();
  });

  it("정상 입력은 svg 키 + <svg 로 시작 + </svg> 로 종료", () => {
    const result = process("https://example.com");
    expect(result).not.toBeNull();
    expect(result!.svg.startsWith("<svg")).toBe(true);
    expect(result!.svg.includes("</svg>")).toBe(true);
  });

  it("pixelSize 가 양수 정수로 반환됨", () => {
    const result = process("hello");
    expect(result!.pixelSize).toBeGreaterThan(0);
    expect(Number.isInteger(result!.pixelSize)).toBe(true);
  });

  it("pixelSize 가 viewBox 와 일치", () => {
    const result = process("hello");
    const match = result!.svg.match(/viewBox="0 0 (\d+) (\d+)"/);
    expect(match).not.toBeNull();
    expect(Number(match![1])).toBe(result!.pixelSize);
    expect(Number(match![2])).toBe(result!.pixelSize);
  });

  it("기본 색상 (검정/흰색) 이 SVG 내에 포함됨", () => {
    const result = process("default colors");
    expect(result!.svg).toContain("#000000");
    expect(result!.svg).toContain("#FFFFFF");
  });

  it("UTF-8 한글/이모지 입력 정상 처리", () => {
    const result = process("안녕하세요 🎉");
    expect(result).not.toBeNull();
    expect(result!.svg.startsWith("<svg")).toBe(true);
  });

  it("입력 길이가 다르면 QR 셀 수도 다를 수 있음 (긴 입력일수록 큼)", () => {
    const short = process("a")!;
    const long = process("a".repeat(200))!;
    expect(long.pixelSize).toBeGreaterThanOrEqual(short.pixelSize);
  });

  it("앞뒤 공백은 trim 처리", () => {
    const trimmed = process("hello")!;
    const padded = process("   hello   ")!;
    expect(padded.svg).toBe(trimmed.svg);
  });
});
