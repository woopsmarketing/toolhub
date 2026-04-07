export function process(input: string): string {
  if (!input) {
    return "";
  }

  // Use Array.from to correctly handle multi-byte Unicode characters (Korean, emoji, etc.)
  return Array.from(input).reverse().join("");
}
