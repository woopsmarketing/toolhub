function textToUnicodeEscape(text: string): string {
  let result = "";
  for (const char of text) {
    const codePoint = char.codePointAt(0);
    if (codePoint === undefined) continue;

    if (codePoint > 0xffff) {
      // Supplementary character: use surrogate pair representation
      const high = Math.floor((codePoint - 0x10000) / 0x400) + 0xd800;
      const low = ((codePoint - 0x10000) % 0x400) + 0xdc00;
      result += `\\u${high.toString(16).toUpperCase().padStart(4, "0")}\\u${low.toString(16).toUpperCase().padStart(4, "0")}`;
    } else {
      result += `\\u${codePoint.toString(16).toUpperCase().padStart(4, "0")}`;
    }
  }
  return result;
}

function unicodeEscapeToText(input: string): string {
  try {
    // Replace \uXXXX sequences
    return input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
  } catch {
    return "오류: 유니코드 이스케이프를 해석할 수 없습니다.";
  }
}

export function process(input: string): Record<string, string> {
  if (!input) {
    return {
      "유니코드 변환": "",
      "유니코드 해석": "",
    };
  }

  return {
    "유니코드 변환": textToUnicodeEscape(input),
    "유니코드 해석": unicodeEscapeToText(input),
  };
}
