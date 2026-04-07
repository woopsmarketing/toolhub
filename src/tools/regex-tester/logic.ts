export function process(input: string): string {
  if (!input.trim()) {
    return "정규식 패턴과 테스트 텍스트를 입력하세요.";
  }

  const lines = input.split("\n");
  const patternLine = lines[0].trim();
  const testText = lines.slice(1).join("\n");

  if (!patternLine) {
    return "첫 번째 줄에 정규식 패턴을 입력하세요.";
  }

  if (!testText) {
    return "두 번째 줄부터 테스트할 텍스트를 입력하세요.";
  }

  let regex: RegExp;
  try {
    regex = new RegExp(patternLine, "gm");
  } catch (e) {
    return `정규식 오류: ${(e as Error).message}`;
  }

  const matches: RegExpExecArray[] = [];
  let match: RegExpExecArray | null;
  // Reset lastIndex for safety
  regex.lastIndex = 0;
  while ((match = regex.exec(testText)) !== null) {
    matches.push(match);
    // Prevent infinite loop on zero-length matches
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }
  }

  if (matches.length === 0) {
    return `패턴: /${patternLine}/\n\n매칭 결과 없음`;
  }

  const lines_result: string[] = [
    `패턴: /${patternLine}/`,
    `총 ${matches.length}건 매칭됨`,
    "",
  ];

  matches.forEach((m, i) => {
    let line = `[${i + 1}] "${m[0]}" (위치: ${m.index}~${m.index + m[0].length - 1})`;
    if (m.length > 1) {
      const groups = m.slice(1).filter((g) => g !== undefined);
      if (groups.length > 0) {
        line += ` | 그룹: ${groups.map((g, gi) => `(${gi + 1}) "${g}"`).join(", ")}`;
      }
    }
    lines_result.push(line);
  });

  return lines_result.join("\n");
}
