export function process(
  values: Record<string, string | number>
): Record<string, string | number> {
  const originalPrice = Number(values.originalPrice) || 0;
  const discountRate = Number(values.discountRate) || 0;

  const discountAmount = Math.round(originalPrice * (discountRate / 100));
  const finalPrice = originalPrice - discountAmount;
  const saved = discountRate;

  return {
    discountAmount: discountAmount.toLocaleString("ko-KR"),
    finalPrice: finalPrice.toLocaleString("ko-KR"),
    saved: saved % 1 === 0 ? saved.toString() : saved.toFixed(1),
  };
}
