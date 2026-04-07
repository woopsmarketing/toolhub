export function process(
  values: Record<string, string | number>
): Record<string, string | number> {
  const height = Number(values.height) || 0;
  const weight = Number(values.weight) || 0;

  if (height <= 0 || weight <= 0) {
    return {
      bmi: "-",
      category: "-",
      normal: "-",
    };
  }

  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);

  let category: string;
  if (bmi < 18.5) {
    category = "저체중";
  } else if (bmi < 25) {
    category = "정상";
  } else if (bmi < 30) {
    category = "과체중";
  } else {
    category = "비만";
  }

  // Normal weight range based on BMI 18.5 ~ 24.9 for given height
  const minNormal = 18.5 * heightM * heightM;
  const maxNormal = 24.9 * heightM * heightM;

  return {
    bmi: bmi.toFixed(1),
    category,
    normal: `${minNormal.toFixed(1)} ~ ${maxNormal.toFixed(1)}`,
  };
}
