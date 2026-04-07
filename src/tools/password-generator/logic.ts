export function process(
  values: Record<string, string | number>
): Record<string, string | number> {
  const length = Math.min(128, Math.max(4, Number(values.length) || 16));
  const includeUpper = values.includeUpper !== "no";
  const includeNumbers = values.includeNumbers !== "no";
  const includeSymbols = values.includeSymbols !== "no";

  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  let charset = lower;
  if (includeUpper) charset += upper;
  if (includeNumbers) charset += numbers;
  if (includeSymbols) charset += symbols;

  // Generate using crypto random values for security
  let password = "";
  const array = new Uint32Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      password += charset[array[i] % charset.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
  }

  // Evaluate strength
  let charsetSize = lower.length;
  if (includeUpper) charsetSize += upper.length;
  if (includeNumbers) charsetSize += numbers.length;
  if (includeSymbols) charsetSize += symbols.length;

  const entropy = length * Math.log2(charsetSize);
  let strength: string;
  if (entropy < 40) {
    strength = "약함";
  } else if (entropy < 60) {
    strength = "보통";
  } else if (entropy < 80) {
    strength = "강함";
  } else {
    strength = "매우 강함";
  }

  return {
    password,
    strength,
  };
}
