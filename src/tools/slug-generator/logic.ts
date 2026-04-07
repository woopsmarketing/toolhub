export function process(input: string): string {
  if (!input) {
    return "";
  }

  return input
    .trim()
    // Convert to lowercase for ASCII characters
    .toLowerCase()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, "-")
    // Remove characters that are not alphanumeric, hyphens, or Korean
    .replace(/[^\w\-가-힣]/g, "")
    // Replace underscores left from \w with hyphens
    .replace(/_/g, "-")
    // Collapse multiple consecutive hyphens into one
    .replace(/-{2,}/g, "-")
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, "");
}
