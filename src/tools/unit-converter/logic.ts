// Conversion factors to meters
const TO_METERS: Record<string, number> = {
  km: 1000,
  m: 1,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.344,
  ft: 0.3048,
  in: 0.0254,
};

const UNIT_LABELS: Record<string, string> = {
  km: "km",
  m: "m",
  cm: "cm",
  mm: "mm",
  mi: "mi",
  ft: "ft",
  in: "in",
};

export function process(
  values: Record<string, string | number>
): Record<string, string | number> {
  const value = Number(values.value) || 0;
  const fromUnit = String(values.fromUnit || "km");
  const toUnit = String(values.toUnit || "m");

  const fromFactor = TO_METERS[fromUnit] ?? 1;
  const toFactor = TO_METERS[toUnit] ?? 1;

  const meters = value * fromFactor;
  const converted = meters / toFactor;

  // Trim trailing zeros up to 8 decimal places
  const formatted = parseFloat(converted.toFixed(8)).toString();

  return {
    result: `${formatted} ${UNIT_LABELS[toUnit] ?? toUnit}`,
  };
}
