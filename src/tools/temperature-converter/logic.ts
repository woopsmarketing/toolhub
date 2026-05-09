/**
 * Temperature Converter — pure conversion function.
 *
 * 동작:
 *  - 입력 값과 단위(celsius/fahrenheit/kelvin)를 받아 모든 단위 값을 동시에 반환
 *  - 변환은 항상 섭씨를 매개로 수행 (단순화)
 *  - 결과는 소수점 둘째 자리까지 반올림된 문자열
 *
 * 공식:
 *  - C → F: °F = °C × 9/5 + 32
 *  - F → C: °C = (°F − 32) × 5/9
 *  - C → K: K  = °C + 273.15
 *  - K → C: °C = K  − 273.15
 *
 * 외부 의존성 없음. 외부 API 호출 없음.
 */
export function process(
  fields: Record<string, string | number>,
): Record<string, string | number> {
  const value = Number(fields.value ?? 0);
  const unit = String(fields.unit ?? "celsius");

  let celsius: number;
  if (unit === "celsius") celsius = value;
  else if (unit === "fahrenheit") celsius = ((value - 32) * 5) / 9;
  else if (unit === "kelvin") celsius = value - 273.15;
  else celsius = value;

  const fahrenheit = (celsius * 9) / 5 + 32;
  const kelvin = celsius + 273.15;

  const fmt = (n: number) => (Math.round(n * 100) / 100).toString();

  return {
    celsius: fmt(celsius),
    fahrenheit: fmt(fahrenheit),
    kelvin: fmt(kelvin),
  };
}
