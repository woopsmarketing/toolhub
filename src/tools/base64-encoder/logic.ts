export function process(input: string): Record<string, string> {
  if (!input) {
    return {
      "인코딩 결과": "",
      "디코딩 결과": "",
    };
  }

  // Encode: text → Base64
  let encoded = "";
  try {
    encoded = btoa(unescape(encodeURIComponent(input)));
  } catch {
    encoded = "인코딩 오류: 변환할 수 없는 문자가 포함되어 있습니다.";
  }

  // Decode: Base64 → text
  let decoded = "";
  try {
    decoded = decodeURIComponent(escape(atob(input)));
  } catch {
    decoded = "디코딩 오류: 올바른 Base64 문자열이 아닙니다.";
  }

  return {
    "인코딩 결과": encoded,
    "디코딩 결과": decoded,
  };
}
