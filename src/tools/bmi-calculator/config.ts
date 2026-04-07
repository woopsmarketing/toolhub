import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "bmi-calculator",
  category: "calculator",
  template: "FormToResult",
  processingType: "client",
  icon: "Heart",

  formFields: [
    {
      name: "height",
      label: "키",
      type: "number",
      placeholder: "키를 입력하세요",
      defaultValue: 170,
      suffix: "cm",
    },
    {
      name: "weight",
      label: "몸무게",
      type: "number",
      placeholder: "몸무게를 입력하세요",
      defaultValue: 70,
      suffix: "kg",
    },
  ],

  resultLabels: [
    { key: "bmi", label: "BMI 지수" },
    { key: "category", label: "분류" },
    { key: "normal", label: "정상 체중 범위", suffix: "kg" },
  ],

  seo: {
    ko: {
      title: "BMI 계산기 - 체질량지수 계산 온라인",
      description:
        "키와 몸무게를 입력하여 BMI(체질량지수)를 즉시 계산하세요. 저체중, 정상, 과체중, 비만 여부와 정상 체중 범위를 확인할 수 있는 무료 BMI 계산기입니다.",
      keywords: [
        "BMI 계산기",
        "체질량지수 계산",
        "비만도 계산기",
        "체중 계산기",
        "정상 체중",
        "BMI 계산 온라인",
      ],
    },
    en: {
      title: "BMI Calculator - Body Mass Index Online",
      description:
        "Enter your height and weight to instantly calculate your BMI. Check if you are underweight, normal, overweight, or obese with our free online BMI calculator.",
      keywords: [
        "BMI calculator",
        "body mass index",
        "bmi online",
        "weight calculator",
        "healthy weight range",
        "obesity calculator",
      ],
    },
  },

  howToUse: {
    ko: [
      "키를 센티미터(cm) 단위로 입력하세요.",
      "몸무게를 킬로그램(kg) 단위로 입력하세요.",
      "BMI 지수, 분류, 정상 체중 범위를 즉시 확인하세요.",
    ],
    en: [
      "Enter your height in centimeters (cm).",
      "Enter your weight in kilograms (kg).",
      "Instantly see your BMI, classification, and healthy weight range.",
    ],
  },

  features: {
    ko: [
      "WHO 기준 BMI 계산 (체중 ÷ 키²)",
      "저체중/정상/과체중/비만 자동 분류",
      "정상 체중 범위(BMI 18.5~24.9) 표시",
      "소수점 첫째 자리까지 정밀 계산",
      "한국인 체형에 맞는 기준 적용",
    ],
    en: [
      "BMI calculated per WHO standards (weight ÷ height²)",
      "Automatic classification: underweight, normal, overweight, obese",
      "Displays healthy weight range (BMI 18.5–24.9)",
      "Precise to one decimal place",
      "Based on internationally recognized BMI standards",
    ],
  },

  useCases: {
    ko: [
      {
        title: "건강 검진 전 체중 확인",
        description: "건강 검진 전에 자신의 BMI를 미리 확인하여 의사 상담을 준비합니다.",
        example: {
          input: "키: 170cm, 몸무게: 70kg",
          output: "BMI: 24.2, 분류: 정상, 정상 체중: 53.5 ~ 72.0 kg",
        },
      },
      {
        title: "다이어트 목표 설정",
        description: "현재 BMI를 확인하고 정상 범위에 도달하기 위한 목표 체중을 설정합니다.",
        example: {
          input: "키: 165cm, 몸무게: 75kg",
          output: "BMI: 27.5, 분류: 과체중, 정상 체중: 50.3 ~ 67.8 kg",
        },
      },
      {
        title: "성장기 자녀 체중 확인",
        description: "성장기 아이의 체중이 정상 범위에 있는지 확인합니다.",
        example: {
          input: "키: 150cm, 몸무게: 45kg",
          output: "BMI: 20.0, 분류: 정상",
        },
      },
    ],
    en: [
      {
        title: "Pre-checkup Health Review",
        description: "Check your BMI before a medical exam to prepare for doctor consultations.",
        example: {
          input: "Height: 170cm, Weight: 70kg",
          output: "BMI: 24.2, Category: Normal, Healthy range: 53.5–72.0 kg",
        },
      },
      {
        title: "Setting Diet Goals",
        description: "Review your current BMI and set a target weight to reach the normal range.",
        example: {
          input: "Height: 165cm, Weight: 75kg",
          output: "BMI: 27.5, Category: Overweight, Healthy range: 50.3–67.8 kg",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "BMI란 무엇인가요?",
      content:
        "BMI(Body Mass Index, 체질량지수)는 체중(kg)을 키(m)의 제곱으로 나눈 값으로, 세계보건기구(WHO)가 체지방을 간접적으로 측정하기 위해 권장하는 지표입니다.\n\nBMI 계산식: BMI = 체중(kg) ÷ [키(m)]²\n\nWHO 기준 분류:\n- 18.5 미만: 저체중\n- 18.5 ~ 24.9: 정상 체중\n- 25.0 ~ 29.9: 과체중\n- 30.0 이상: 비만\n\n단, BMI는 근육량과 체지방을 구분하지 못하는 한계가 있습니다. 운동선수처럼 근육이 많은 경우 BMI가 높게 나올 수 있으므로 참고 지표로만 활용하세요.",
    },
    en: {
      title: "What is BMI?",
      content:
        "BMI (Body Mass Index) is calculated by dividing weight in kilograms by height in meters squared. It is the standard indirect measure of body fat recommended by the World Health Organization (WHO).\n\nBMI Formula: BMI = Weight (kg) ÷ [Height (m)]²\n\nWHO Classifications:\n- Below 18.5: Underweight\n- 18.5–24.9: Normal weight\n- 25.0–29.9: Overweight\n- 30.0 and above: Obese\n\nNote: BMI does not distinguish between muscle and fat. Athletes with high muscle mass may have a high BMI despite being healthy. Use BMI as a reference, not a definitive diagnosis.",
    },
  },

  faq: {
    ko: [
      {
        q: "BMI가 정상 범위여도 건강하지 않을 수 있나요?",
        a: "네, BMI는 간단한 참고 지표입니다. 근육량, 체지방 분포, 연령, 성별 등 다양한 요인을 고려하지 않습니다. 정확한 건강 상태 파악을 위해서는 의사와 상담하는 것이 좋습니다.",
      },
      {
        q: "아시아인의 BMI 기준은 다른가요?",
        a: "일부 연구에서는 아시아인의 경우 WHO 기준보다 낮은 BMI에서도 당뇨, 심혈관 질환 위험이 높아진다고 합니다. 대한비만학회는 23 이상을 과체중, 25 이상을 비만으로 정의합니다.",
      },
      {
        q: "어린이나 청소년에게도 적용할 수 있나요?",
        a: "성인 BMI 기준은 18세 이상에게 적용됩니다. 아동·청소년의 경우 성별과 연령을 고려한 별도의 백분위수 기준을 사용해야 합니다.",
      },
    ],
    en: [
      {
        q: "Can I be healthy with a high BMI?",
        a: "Yes, BMI is a simple reference tool. It does not account for muscle mass, fat distribution, age, or gender. Consult a doctor for a comprehensive health assessment.",
      },
      {
        q: "Are BMI standards different for Asians?",
        a: "Some research suggests Asians face higher risks of diabetes and cardiovascular disease at lower BMI values. The Korean Society for the Study of Obesity defines overweight as BMI ≥23 and obese as BMI ≥25.",
      },
    ],
  },

  relatedTools: ["percentage-calculator", "unit-converter", "age-calculator", "loan-calculator"],
};
