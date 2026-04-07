export function process(
  values: Record<string, string | number>
): Record<string, string | number> {
  const startStr = String(values.startDate || "").trim();
  const endStr = String(values.endDate || "").trim();

  const start = new Date(startStr);
  const end = new Date(endStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      days: "날짜 형식을 확인하세요 (YYYY-MM-DD)",
      weeks: "-",
      months: "-",
    };
  }

  const diffMs = Math.abs(end.getTime() - start.getTime());
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);

  const startNorm = start < end ? start : end;
  const endNorm = start < end ? end : start;
  let months =
    (endNorm.getFullYear() - startNorm.getFullYear()) * 12 +
    (endNorm.getMonth() - startNorm.getMonth());
  if (endNorm.getDate() < startNorm.getDate()) {
    months -= 1;
  }
  months = Math.max(0, months);

  return {
    days,
    weeks,
    months,
  };
}
