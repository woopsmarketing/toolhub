/**
 * Whitespace Remover — pure cleanup function.
 *
 * 동작 (한 번에 3가지):
 *  1) 각 줄을 trim (앞뒤 공백 제거)
 *  2) 줄 내부의 연속된 공백·탭을 단일 공백으로 압축
 *  3) 공백만 있는 줄(빈 줄) 제거 — 의미 있는 줄 사이의 \n 은 보존
 *
 * 외부 의존성 없음. 외부 API 호출 없음.
 */
export function process(input: string): string {
  if (!input) return "";

  return input
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter((line) => line.length > 0)
    .join("\n");
}
