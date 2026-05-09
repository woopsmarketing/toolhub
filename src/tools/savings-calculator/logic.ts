/**
 * Korean installment savings (적금) calculator.
 *
 * Standard formulas:
 *  - Simple interest    = monthly × (rate/12) × n(n+1)/2
 *  - Compound maturity  = monthly × [(1 + r/12)^n - 1] / (r/12)
 *  - After-tax interest = pre-tax interest × (1 - tax rate)
 *
 * Tax brackets: standard 15.4% / preferential 9.5% / exempt 0%.
 */
export function process(
  fields: Record<string, string | number>,
): Record<string, string | number> {
  const monthly = Number(fields.monthly ?? 0);
  const rate = Number(fields.rate ?? 0) / 100; // % → decimal
  const months = Math.max(1, Number(fields.months ?? 1));
  const bracket = String(fields.taxBracket ?? "standard"); // standard / preferential / exempt

  if (!Number.isFinite(monthly) || !Number.isFinite(rate) || monthly <= 0 || rate < 0 || months <= 0) {
    return zero();
  }

  // Simple interest = monthly × (rate/12) × n(n+1)/2
  const simpleInterest = (monthly * (rate / 12) * (months * (months + 1))) / 2;

  // Compound (monthly compound) maturity = monthly × [(1+r/12)^n - 1] / (r/12)
  const r12 = rate / 12;
  const principal = monthly * months;
  const compoundMaturityPure =
    r12 === 0
      ? principal
      : (monthly * (Math.pow(1 + r12, months) - 1)) / r12;
  const compoundInterest = compoundMaturityPure - principal;

  const taxRate =
    bracket === "exempt" ? 0 : bracket === "preferential" ? 0.095 : 0.154;

  const simpleAfterTax = simpleInterest * (1 - taxRate);
  const compoundAfterTax = compoundInterest * (1 - taxRate);

  const fmt = (n: number) => Math.round(n).toLocaleString("ko-KR");

  return {
    principal: fmt(principal),
    simpleInterest: fmt(simpleInterest),
    simpleAfterTax: fmt(simpleAfterTax),
    simpleMaturity: fmt(principal + simpleAfterTax),
    compoundInterest: fmt(compoundInterest),
    compoundAfterTax: fmt(compoundAfterTax),
    compoundMaturity: fmt(principal + compoundAfterTax),
  };
}

function zero(): Record<string, string | number> {
  return {
    principal: "0",
    simpleInterest: "0",
    simpleAfterTax: "0",
    simpleMaturity: "0",
    compoundInterest: "0",
    compoundAfterTax: "0",
    compoundMaturity: "0",
  };
}
