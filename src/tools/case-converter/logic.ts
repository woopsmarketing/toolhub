export function process(input: string): Record<string, string | number> {
  if (!input) {
    return {
      "대문자 (UPPERCASE)": "",
      "소문자 (lowercase)": "",
      "첫글자 대문자 (Title Case)": "",
      "camelCase": "",
      "snake_case": "",
      "kebab-case": "",
    };
  }

  const uppercase = input.toUpperCase();
  const lowercase = input.toLowerCase();

  const titleCase = input
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());

  const words = input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[\s_\-]+/g, " ")
    .replace(/[^\w\s가-힣]/g, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);

  const camelCase =
    words.length === 0
      ? ""
      : words[0].toLowerCase() +
        words
          .slice(1)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join("");

  const snakeCase = words.map((w) => w.toLowerCase()).join("_");

  const kebabCase = words.map((w) => w.toLowerCase()).join("-");

  return {
    "대문자 (UPPERCASE)": uppercase,
    "소문자 (lowercase)": lowercase,
    "첫글자 대문자 (Title Case)": titleCase,
    "camelCase": camelCase,
    "snake_case": snakeCase,
    "kebab-case": kebabCase,
  };
}
