function base64UrlDecode(str: string): string {
  // Normalize base64url to base64
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  try {
    return decodeURIComponent(
      escape(atob(padded))
    );
  } catch {
    throw new Error("Base64 디코딩 실패");
  }
}

export function process(input: string): Record<string, string> {
  const token = input.trim();

  if (!token) {
    return {
      "헤더(Header)": "",
      "페이로드(Payload)": "",
    };
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return {
      "헤더(Header)": "오류: JWT 형식이 올바르지 않습니다. JWT는 점(.)으로 구분된 3개의 부분으로 이루어져야 합니다.",
      "페이로드(Payload)": "",
    };
  }

  let header = "";
  try {
    const decoded = base64UrlDecode(parts[0]);
    const parsed = JSON.parse(decoded);
    header = JSON.stringify(parsed, null, 2);
  } catch {
    header = "오류: 헤더를 디코딩할 수 없습니다.";
  }

  let payload = "";
  try {
    const decoded = base64UrlDecode(parts[1]);
    const parsed = JSON.parse(decoded);
    payload = JSON.stringify(parsed, null, 2);
  } catch {
    payload = "오류: 페이로드를 디코딩할 수 없습니다.";
  }

  return {
    "헤더(Header)": header,
    "페이로드(Payload)": payload,
  };
}
