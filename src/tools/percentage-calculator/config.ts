import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "percentage-calculator",
  category: "calculator",
  template: "FormToResult",
  processingType: "client",
  icon: "Percent",

  formFields: [
    {
      name: "value",
      label: "값",
      type: "number",
      placeholder: "숫자를 입력하세요",
      defaultValue: 100,
    },
    {
      name: "percentage",
      label: "퍼센트",
      type: "number",
      placeholder: "퍼센트를 입력하세요",
      defaultValue: 10,
      suffix: "%",
    },
  ],

  resultLabels: [
    { key: "result", label: "결과값" },
    { key: "increase", label: "증가 결과" },
    { key: "decrease", label: "감소 결과" },
  ],

  seo: {
    ko: {
      title: "퍼센트 계산기 - 비율 계산 온라인",
      description:
        "퍼센트 계산기로 값의 비율, 증가/감소 결과를 즉시 계산하세요. 할인율, 세금, 성장률 등 다양한 퍼센트 계산을 무료로 제공합니다.",
      keywords: [
        "퍼센트 계산기",
        "비율 계산",
        "할인율 계산",
        "증가율 계산",
        "감소율 계산",
        "퍼센트 계산 온라인",
      ],
    },
    en: {
      title: "Percentage Calculator - Calculate Percent Online",
      description:
        "Calculate percentages instantly. Find the percentage of a value, increase, or decrease. Free online percentage calculator for discounts, taxes, and growth rates.",
      keywords: [
        "percentage calculator",
        "percent calculator",
        "calculate percentage",
        "discount calculator",
        "percentage increase",
        "percentage decrease",
      ],
    },
  },

  howToUse: {
    ko: [
      "기준이 되는 값을 입력하세요.",
      "적용할 퍼센트(%)를 입력하세요.",
      "결과값, 증가 결과, 감소 결과를 즉시 확인하세요.",
    ],
    en: [
      "Enter the base value.",
      "Enter the percentage to apply.",
      "Instantly see the result, increased value, and decreased value.",
    ],
  },

  features: {
    ko: [
      "값의 퍼센트 계산 (값 × 퍼센트 / 100)",
      "퍼센트 증가 결과 자동 계산",
      "퍼센트 감소 결과 자동 계산",
      "소수점 정밀 계산 지원",
      "할인율, 세율, 성장률 등 다용도 활용",
    ],
    en: [
      "Calculates percentage of any value (value × percent / 100)",
      "Automatic percentage increase calculation",
      "Automatic percentage decrease calculation",
      "Precise decimal calculations",
      "Versatile use for discounts, taxes, and growth rates",
    ],
  },

  useCases: {
    ko: [
      {
        title: "쇼핑 할인 계산",
        description: "30% 할인 행사에서 실제 할인 금액과 최종 가격을 계산합니다.",
        example: {
          input: "값: 50000, 퍼센트: 30",
          output: "결과값: 15000원, 감소 결과: 35000원",
        },
      },
      {
        title: "세금 계산",
        description: "부가가치세 10%를 포함한 최종 가격을 계산합니다.",
        example: {
          input: "값: 100000, 퍼센트: 10",
          output: "결과값: 10000원, 증가 결과: 110000원",
        },
      },
      {
        title: "성적 비율 계산",
        description: "전체 점수 대비 획득 점수의 비율을 계산합니다.",
        example: {
          input: "값: 85, 퍼센트: 100",
          output: "결과값: 85점",
        },
      },
    ],
    en: [
      {
        title: "Shopping Discounts",
        description: "Calculate the discount amount and final price during a 30% off sale.",
        example: {
          input: "Value: 50000, Percentage: 30",
          output: "Result: 15000, Decreased: 35000",
        },
      },
      {
        title: "Tax Calculation",
        description: "Calculate the final price including 10% VAT.",
        example: {
          input: "Value: 100000, Percentage: 10",
          output: "Result: 10000, Increased: 110000",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "퍼센트 계산 완벽 가이드",
      content:
        "퍼센트(%)는 일상생활에서 가장 자주 사용되는 수학 개념 중 하나입니다. '퍼센트'는 라틴어 'per centum'에서 유래했으며 '100당'이라는 의미입니다.\n\n기본 공식: 결과값 = 전체값 × 퍼센트 ÷ 100\n\n예를 들어 5만원짜리 상품에서 30% 할인을 받으면 할인 금액은 50000 × 30 ÷ 100 = 15,000원이고 최종 가격은 35,000원입니다.\n\n증가율 계산은 원래 값에 퍼센트 결과를 더하고, 감소율 계산은 원래 값에서 퍼센트 결과를 빼면 됩니다.",
    },
    en: {
      title: "Complete Guide to Percentage Calculations",
      content:
        "Percentages are one of the most commonly used mathematical concepts in daily life. The word 'percent' comes from the Latin 'per centum', meaning 'per hundred'.\n\nBasic formula: Result = Total Value × Percentage ÷ 100\n\nFor example, a 30% discount on a $500 item gives a discount of 500 × 30 ÷ 100 = $150, making the final price $350.\n\nTo calculate an increase, add the result to the original value. To calculate a decrease, subtract the result from the original value.",
    },
  },

  faq: {
    ko: [
      {
        q: "퍼센트와 퍼센트 포인트의 차이는 무엇인가요?",
        a: "퍼센트(%)는 비율을 나타내는 단위이고, 퍼센트 포인트(pp)는 두 퍼센트 값의 차이를 나타냅니다. 예를 들어 이자율이 3%에서 5%로 올랐다면 2퍼센트 포인트 상승한 것입니다.",
      },
      {
        q: "소수점 퍼센트도 계산할 수 있나요?",
        a: "네, 소수점이 포함된 퍼센트도 정확하게 계산됩니다. 예를 들어 3.5%나 12.75% 같은 값도 입력 가능합니다.",
      },
      {
        q: "100% 이상의 퍼센트도 계산 가능한가요?",
        a: "네, 100% 이상의 퍼센트도 계산할 수 있습니다. 예를 들어 150%를 입력하면 원래 값의 1.5배에 해당하는 결과를 얻을 수 있습니다.",
      },
    ],
    en: [
      {
        q: "What is the difference between percent and percentage points?",
        a: "Percent (%) is a unit representing a ratio, while percentage points (pp) represent the difference between two percent values. For example, if an interest rate rises from 3% to 5%, it increased by 2 percentage points.",
      },
      {
        q: "Can I calculate percentages with decimals?",
        a: "Yes, decimal percentages are calculated accurately. You can enter values like 3.5% or 12.75%.",
      },
    ],
  },

  relatedTools: ["loan-calculator", "bmi-calculator", "date-calculator", "unit-converter"],
};
