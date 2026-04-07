function lcs(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp;
}

function buildDiff(
  dp: number[][],
  a: string[],
  b: string[],
  i: number,
  j: number,
  result: string[]
): void {
  if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
    buildDiff(dp, a, b, i - 1, j - 1, result);
    result.push(`  ${a[i - 1]}`);
  } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
    buildDiff(dp, a, b, i, j - 1, result);
    result.push(`+ ${b[j - 1]}`);
  } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
    buildDiff(dp, a, b, i - 1, j, result);
    result.push(`- ${a[i - 1]}`);
  }
}

export function process(input: string): string {
  if (!input.trim()) {
    return '두 텍스트를 --- 구분자로 나누어 입력하세요.';
  }

  const separatorIndex = input.indexOf("\n---\n");
  if (separatorIndex === -1) {
    // Try standalone --- line
    const lines = input.split("\n");
    const sepIdx = lines.findIndex((l) => l.trim() === "---");
    if (sepIdx === -1) {
      return '구분자 --- 를 찾을 수 없습니다.\n\n형식:\n텍스트1\n---\n텍스트2';
    }
    const text1Lines = lines.slice(0, sepIdx);
    const text2Lines = lines.slice(sepIdx + 1);
    return computeDiff(text1Lines, text2Lines);
  }

  const text1 = input.slice(0, separatorIndex);
  const text2 = input.slice(separatorIndex + 5);
  return computeDiff(text1.split("\n"), text2.split("\n"));
}

function computeDiff(aLines: string[], bLines: string[]): string {
  const dp = lcs(aLines, bLines);
  const result: string[] = [];
  buildDiff(dp, aLines, bLines, aLines.length, bLines.length, result);

  const added = result.filter((l) => l.startsWith("+ ")).length;
  const removed = result.filter((l) => l.startsWith("- ")).length;
  const same = result.filter((l) => l.startsWith("  ")).length;

  const summary = [
    `추가된 줄: ${added}개 | 삭제된 줄: ${removed}개 | 동일한 줄: ${same}개`,
    "",
    ...result,
  ];

  return summary.join("\n");
}
