export function process(input: string): string {
  if (!input.trim()) {
    return "";
  }

  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    const message = e instanceof Error ? e.message : "알 수 없는 오류";
    return `오류: 올바르지 않은 JSON 형식입니다.\n${message}`;
  }
}
