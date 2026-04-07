function generateUuidV4(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  // Manual v4 fallback
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  // Set version to 4
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // Set variant to 10xxxxxx
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

export function process(
  values: Record<string, string | number>
): Record<string, string | number> {
  const count = Math.min(Math.max(Number(values.count) || 1, 1), 50);

  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    uuids.push(generateUuidV4());
  }

  return {
    uuids: uuids.join("\n"),
  };
}
