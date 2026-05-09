import { describe, it, expect } from "vitest";
import { process } from "./logic";

describe("temperature-converter logic", () => {
  it("25°C → 77°F / 298.15K (실온)", () => {
    const r = process({ value: 25, unit: "celsius" });
    expect(r.celsius).toBe("25");
    expect(r.fahrenheit).toBe("77");
    expect(r.kelvin).toBe("298.15");
  });

  it("100°F → 약 37.78°C / 약 310.93K (체온 근처)", () => {
    const r = process({ value: 100, unit: "fahrenheit" });
    expect(r.celsius).toBe("37.78");
    expect(r.fahrenheit).toBe("100");
    expect(r.kelvin).toBe("310.93");
  });

  it("0K → -273.15°C / -459.67°F (절대영도)", () => {
    const r = process({ value: 0, unit: "kelvin" });
    expect(r.celsius).toBe("-273.15");
    expect(r.fahrenheit).toBe("-459.67");
    expect(r.kelvin).toBe("0");
  });

  it("0°C → 32°F / 273.15K (얼음 어는점)", () => {
    const r = process({ value: 0, unit: "celsius" });
    expect(r.celsius).toBe("0");
    expect(r.fahrenheit).toBe("32");
    expect(r.kelvin).toBe("273.15");
  });

  it("100°C → 212°F / 373.15K (물 끓는점)", () => {
    const r = process({ value: 100, unit: "celsius" });
    expect(r.celsius).toBe("100");
    expect(r.fahrenheit).toBe("212");
    expect(r.kelvin).toBe("373.15");
  });

  it("-40°C → -40°F (특수한 일치점)", () => {
    const r = process({ value: -40, unit: "celsius" });
    expect(r.celsius).toBe("-40");
    expect(r.fahrenheit).toBe("-40");
    expect(r.kelvin).toBe("233.15");
  });

  it("-40°F → -40°C (역방향 일치점)", () => {
    const r = process({ value: -40, unit: "fahrenheit" });
    expect(r.celsius).toBe("-40");
    expect(r.fahrenheit).toBe("-40");
    expect(r.kelvin).toBe("233.15");
  });

  it("문자열 입력도 Number 변환되어 처리됨", () => {
    const r = process({ value: "25", unit: "celsius" });
    expect(r.celsius).toBe("25");
    expect(r.fahrenheit).toBe("77");
    expect(r.kelvin).toBe("298.15");
  });

  it("기본값 (필드 누락 시 0°C)", () => {
    const r = process({});
    expect(r.celsius).toBe("0");
    expect(r.fahrenheit).toBe("32");
    expect(r.kelvin).toBe("273.15");
  });

  it("알 수 없는 단위는 섭씨로 fallback", () => {
    const r = process({ value: 100, unit: "rankine" });
    expect(r.celsius).toBe("100");
    expect(r.fahrenheit).toBe("212");
    expect(r.kelvin).toBe("373.15");
  });
});
