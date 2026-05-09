/**
 * HTML Preview — pure passthrough function.
 *
 * 동작:
 *  - 입력된 HTML 문자열을 그대로 반환한다.
 *  - 실제 렌더링과 보안(sandbox iframe)은 component.tsx 의 renderPreview 가 담당.
 *  - logic.ts 자체는 외부 의존성 / 부수효과 없이 순수 함수.
 *
 * 빈 입력만 빈 문자열로 정규화한다.
 */
export function process(input: string): string {
  if (!input) return "";
  return input;
}
