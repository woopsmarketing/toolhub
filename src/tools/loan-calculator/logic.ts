export function process(
  values: Record<string, string | number>
): Record<string, string | number> {
  const principal = Number(values.principal) || 0;
  const annualRate = Number(values.interestRate) || 0;
  const years = Number(values.years) || 0;

  if (principal <= 0 || years <= 0) {
    return {
      monthly: "0",
      totalPayment: "0",
      totalInterest: "0",
    };
  }

  const n = years * 12; // total number of monthly payments

  if (annualRate === 0) {
    // Zero-interest loan
    const monthly = principal / n;
    return {
      monthly: Math.round(monthly).toLocaleString(),
      totalPayment: Math.round(principal).toLocaleString(),
      totalInterest: "0",
    };
  }

  const r = annualRate / 100 / 12; // monthly interest rate
  // Standard amortization formula: P * [r(1+r)^n] / [(1+r)^n - 1]
  const pow = Math.pow(1 + r, n);
  const monthly = principal * (r * pow) / (pow - 1);
  const totalPayment = monthly * n;
  const totalInterest = totalPayment - principal;

  return {
    monthly: Math.round(monthly).toLocaleString(),
    totalPayment: Math.round(totalPayment).toLocaleString(),
    totalInterest: Math.round(totalInterest).toLocaleString(),
  };
}
