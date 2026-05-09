import { describe, it, expect } from "vitest";
import { process } from "./logic";

describe("qr-code-generator logic", () => {
  it("빈 입력은 빈 객체 반환", () => {
    expect(process({ text: "" })).toEqual({});
  });

  it("공백만 있는 입력도 빈 객체 반환", () => {
    expect(process({ text: "   \t\n  " })).toEqual({});
  });

  it("정상 입력은 svg 키 + <svg 로 시작", () => {
    const result = process({ text: "https://example.com" });
    expect(result.svg).toBeDefined();
    expect(result.svg!.startsWith("<svg")).toBe(true);
    expect(result.svg!.includes("</svg>")).toBe(true);
  });

  it("downloadable 메타데이터 (mime/filename) 정상 설정", () => {
    const result = process({ text: "hello" });
    expect(result.downloadable).toBeDefined();
    expect(result.downloadable!.mime).toBe("image/svg+xml");
    expect(result.downloadable!.filename).toBe("qrcode.svg");
    // data 는 svg 문자열과 동일
    expect(result.downloadable!.data).toBe(result.svg);
  });

  it("기본 색상이 SVG 내에 포함됨", () => {
    const result = process({ text: "default colors" });
    expect(result.svg).toContain("#000000");
    expect(result.svg).toContain("#FFFFFF");
  });

  it("커스텀 색상 적용", () => {
    const result = process({
      text: "custom colors",
      foreground: "#FF0000",
      background: "#00FF00",
    });
    expect(result.svg).toContain("#FF0000");
    expect(result.svg).toContain("#00FF00");
  });

  it("잘못된 hex 색상은 fallback 으로 대체", () => {
    const result = process({
      text: "bad hex",
      foreground: "not-a-color",
      background: "rgb(0,0,0)",
    });
    // fallback: foreground=#000000, background=#FFFFFF
    expect(result.svg).toContain("#000000");
    expect(result.svg).toContain("#FFFFFF");
    expect(result.svg).not.toContain("not-a-color");
    expect(result.svg).not.toContain("rgb(0,0,0)");
  });

  it("errorCorrectionLevel H 도 정상 처리", () => {
    const result = process({
      text: "https://example.com",
      errorCorrectionLevel: "H",
    });
    expect(result.svg).toBeDefined();
    expect(result.svg!.startsWith("<svg")).toBe(true);
  });

  it("errorCorrectionLevel L/M/Q/H 모두 정상 (셀 수 차이 발생)", () => {
    const sizes = (["L", "M", "Q", "H"] as const).map((level) => {
      const result = process({
        text: "https://toolhub.tools/qr-code-generator",
        errorCorrectionLevel: level,
      });
      // viewBox 추출
      const match = result.svg!.match(/viewBox="0 0 (\d+) \d+"/);
      return match ? Number(match[1]) : 0;
    });
    // H 가 L 보다 셀 수가 많거나 같음 (절대 작아질 수 없음)
    expect(sizes[3]).toBeGreaterThanOrEqual(sizes[0]);
  });

  it("size 옵션이 viewBox 에 반영됨 (scale 차이)", () => {
    const small = process({ text: "size test", size: 4 });
    const large = process({ text: "size test", size: 16 });
    const smallMatch = small.svg!.match(/viewBox="0 0 (\d+) \d+"/);
    const largeMatch = large.svg!.match(/viewBox="0 0 (\d+) \d+"/);
    expect(largeMatch![1]).not.toBe(smallMatch![1]);
    expect(Number(largeMatch![1])).toBeGreaterThan(Number(smallMatch![1]));
  });

  it("UTF-8 한글/이모지 입력 정상 처리", () => {
    const result = process({ text: "안녕하세요 🎉" });
    expect(result.svg).toBeDefined();
    expect(result.svg!.startsWith("<svg")).toBe(true);
  });

  it("3자리 hex (#RGB) 도 허용", () => {
    const result = process({
      text: "short hex",
      foreground: "#F00",
    });
    expect(result.svg).toContain("#F00");
  });
});
