export function process(input: string): string {
  if (!input) {
    return "";
  }

  const lines = input.split("\n");
  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of lines) {
    if (!seen.has(line)) {
      seen.add(line);
      result.push(line);
    }
  }

  return result.join("\n");
}
