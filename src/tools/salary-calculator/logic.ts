export function process(
  values: Record<string, string | number>
): Record<string, string | number> {
  const annualSalary = Number(values.annualSalary) || 0;
  const dependents = Number(values.dependents) || 1;
  const mealAllowance = Number(values.mealAllowance) || 0;
  const retirementIncluded = String(values.retirementIncluded) === "true";

  if (annualSalary <= 0) {
    return {
      monthlyGross: "0", nationalPension: "0", healthInsurance: "0",
      longTermCare: "0", employmentInsurance: "0", incomeTax: "0",
      localIncomeTax: "0", totalDeduction: "0", netSalary: "0",
    };
  }

  const effectiveAnnual = retirementIncluded ? annualSalary / (13 / 12) : annualSalary;
  const monthlyGross = Math.round(effectiveAnnual / 12);
  const taxableMonthly = Math.max(monthlyGross - mealAllowance, 0);

  if (taxableMonthly <= 0) {
    return {
      monthlyGross: monthlyGross.toLocaleString(), nationalPension: "0",
      healthInsurance: "0", longTermCare: "0", employmentInsurance: "0",
      incomeTax: "0", localIncomeTax: "0", totalDeduction: "0",
      netSalary: monthlyGross.toLocaleString(),
    };
  }

  const pensionBase = Math.min(Math.max(taxableMonthly, 390000), 6170000);
  const nationalPension = Math.round(pensionBase * 0.0475);
  const healthInsurance = Math.round(taxableMonthly * 0.03545);
  const longTermCare = Math.round(healthInsurance * 0.1281);
  const employmentInsurance = Math.round(taxableMonthly * 0.009);

  const annualTaxable = taxableMonthly * 12;

  let earned: number;
  if (annualTaxable <= 5_000_000) earned = annualTaxable * 0.7;
  else if (annualTaxable <= 15_000_000) earned = 3_500_000 + (annualTaxable - 5_000_000) * 0.4;
  else if (annualTaxable <= 45_000_000) earned = 7_500_000 + (annualTaxable - 15_000_000) * 0.15;
  else if (annualTaxable <= 100_000_000) earned = 12_000_000 + (annualTaxable - 45_000_000) * 0.05;
  else earned = 14_750_000 + (annualTaxable - 100_000_000) * 0.02;

  const personalDeduction = dependents * 1_500_000;
  const standardDeduction = 1_300_000;
  const taxBase = Math.max(annualTaxable - earned - personalDeduction - standardDeduction, 0);

  let annualTax: number;
  if (taxBase <= 14_000_000) annualTax = taxBase * 0.06;
  else if (taxBase <= 50_000_000) annualTax = 840_000 + (taxBase - 14_000_000) * 0.15;
  else if (taxBase <= 88_000_000) annualTax = 6_240_000 + (taxBase - 50_000_000) * 0.24;
  else if (taxBase <= 150_000_000) annualTax = 15_360_000 + (taxBase - 88_000_000) * 0.35;
  else if (taxBase <= 300_000_000) annualTax = 37_060_000 + (taxBase - 150_000_000) * 0.38;
  else if (taxBase <= 500_000_000) annualTax = 94_060_000 + (taxBase - 300_000_000) * 0.4;
  else if (taxBase <= 1_000_000_000) annualTax = 174_060_000 + (taxBase - 500_000_000) * 0.42;
  else annualTax = 384_060_000 + (taxBase - 1_000_000_000) * 0.45;

  let taxCredit: number;
  if (annualTax <= 1_300_000) taxCredit = annualTax * 0.55;
  else taxCredit = annualTax * 0.3;

  const totalSalary = effectiveAnnual;
  let creditLimit: number;
  if (totalSalary <= 33_000_000) creditLimit = 740_000;
  else if (totalSalary <= 70_000_000) creditLimit = 660_000;
  else creditLimit = 500_000;
  taxCredit = Math.min(taxCredit, creditLimit);

  const incomeTax = Math.round(Math.max(annualTax - taxCredit, 0) / 12);
  const localIncomeTax = Math.round(incomeTax * 0.1);

  const totalDeduction = nationalPension + healthInsurance + longTermCare + employmentInsurance + incomeTax + localIncomeTax;
  const netSalary = monthlyGross - totalDeduction;

  return {
    monthlyGross: monthlyGross.toLocaleString(),
    nationalPension: nationalPension.toLocaleString(),
    healthInsurance: healthInsurance.toLocaleString(),
    longTermCare: longTermCare.toLocaleString(),
    employmentInsurance: employmentInsurance.toLocaleString(),
    incomeTax: incomeTax.toLocaleString(),
    localIncomeTax: localIncomeTax.toLocaleString(),
    totalDeduction: totalDeduction.toLocaleString(),
    netSalary: netSalary.toLocaleString(),
  };
}
