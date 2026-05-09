import { describe, it, expect } from "vitest";
import { process } from "./logic";

describe("html-preview logic", () => {
  it("빈 입력은 빈 문자열", () => {
    expect(process("")).toBe("");
  });

  it("정상 HTML 입력은 그대로 반환", () => {
    const html = "<h1>Hello, World!</h1>";
    expect(process(html)).toBe(html);
  });

  it("여러 줄 HTML 입력도 그대로 반환", () => {
    const html = "<div>\n  <p>line 1</p>\n  <p>line 2</p>\n</div>";
    expect(process(html)).toBe(html);
  });

  it("inline style 속성과 <style> 태그를 변형 없이 반환", () => {
    const html =
      '<style>.x{color:red}</style><div class="x" style="font-weight:bold">A</div>';
    expect(process(html)).toBe(html);
  });

  it("script 태그도 그대로 반환 (sanitize 는 component 가 담당)", () => {
    const html = "<script>console.log('hi')</script>";
    expect(process(html)).toBe(html);
  });

  it("공백·특수문자 보존", () => {
    const html = "  <p>&amp; &lt;tag&gt;</p>  ";
    expect(process(html)).toBe(html);
  });
});
