const ENCODE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const DECODE_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": "\u00A0",
  "&copy;": "©",
  "&reg;": "®",
  "&trade;": "™",
  "&euro;": "€",
  "&pound;": "£",
  "&yen;": "¥",
  "&cent;": "¢",
  "&mdash;": "—",
  "&ndash;": "–",
  "&laquo;": "«",
  "&raquo;": "»",
};

function encodeHtmlEntities(text: string): string {
  return text.replace(/[&<>"']/g, (char) => ENCODE_MAP[char] ?? char);
}

function decodeHtmlEntities(text: string): string {
  // Decode named entities
  let result = text.replace(
    /&[a-zA-Z]+;/g,
    (entity) => DECODE_MAP[entity] ?? entity
  );
  // Decode numeric decimal entities &#number;
  result = result.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 10))
  );
  // Decode numeric hex entities &#xHEX;
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  return result;
}

export function process(input: string): Record<string, string> {
  if (!input) {
    return {
      "엔티티 변환": "",
      "엔티티 해석": "",
    };
  }

  return {
    "엔티티 변환": encodeHtmlEntities(input),
    "엔티티 해석": decodeHtmlEntities(input),
  };
}
