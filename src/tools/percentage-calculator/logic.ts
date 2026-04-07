export function process(
  values: Record<string, string | number>
): Record<string, string | number> {
  const value = Number(values.value) || 0;
  const percentage = Number(values.percentage) || 0;

  const result = value * percentage / 100;
  const increase = value + result;
  const decrease = value - result;

  const fmt = (n: number) =>
    Number.isInteger(n) ? n.toLocaleString() : parseFloat(n.toFixed(4)).toLocaleString();

  return {
    result: fmt(result),
    increase: fmt(increase),
    decrease: fmt(decrease),
  };
}
