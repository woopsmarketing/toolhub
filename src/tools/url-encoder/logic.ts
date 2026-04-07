export function process(input: string): Record<string, string> {
  if (!input) {
    return {
      "인코딩 결과": "",
      "디코딩 결과": "",
    };
  }

  let encoded = "";
  try {
    encoded = encodeURIComponent(input);
  } catch {
    encoded = "인코딩 오류: 변환할 수 없는 문자가 포함되어 있습니다.";
  }

  let decoded = "";
  try {
    decoded = decodeURIComponent(input);
  } catch {
    decoded = "디코딩 오류: 올바른 퍼센트 인코딩 문자열이 아닙니다.";
  }

  return {
    "인코딩 결과": encoded,
    "디코딩 결과": decoded,
  };
}
