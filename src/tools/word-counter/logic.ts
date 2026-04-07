export function process(input: string): Record<string, string | number> {
  if (!input) {
    return {
      "글자(공백포함)": 0,
      "글자(공백제외)": 0,
      "단어": 0,
      "문장": 0,
      "문단": 0,
      "줄": 0,
      "바이트(UTF-8)": 0,
      "읽기 시간": "0초",
    };
  }

  const charWithSpaces = input.length;
  const charWithoutSpaces = input.replace(/\s/g, "").length;
  const words = input
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const sentences = input
    .split(/[.!?。！？]+/)
    .filter((s) => s.trim().length > 0).length;
  const paragraphs = input
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0).length;
  const lines = input.split("\n").length;
  const bytes = new TextEncoder().encode(input).length;

  // Reading time: ~500 chars/min for Korean, ~250 words/min for English
  const readingMinutes = Math.max(charWithSpaces / 500, words / 250);
  let readingTime: string;
  if (readingMinutes < 1) {
    readingTime = `${Math.ceil(readingMinutes * 60)}초`;
  } else {
    readingTime = `약 ${Math.ceil(readingMinutes)}분`;
  }

  return {
    "글자(공백포함)": charWithSpaces,
    "글자(공백제외)": charWithoutSpaces,
    "단어": words,
    "문장": sentences,
    "문단": paragraphs,
    "줄": lines,
    "바이트(UTF-8)": bytes,
    "읽기 시간": readingTime,
  };
}
