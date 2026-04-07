import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "discount-calculator",
  category: "calculator",
  template: "FormToResult",
  processingType: "client",
  icon: "Tag",

  formFields: [
    {
      name: "originalPrice",
      label: "원래 가격",
      type: "number",
      defaultValue: 50000,
      min: 0,
      step: 1000,
      suffix: "원",
    },
    {
      name: "discountRate",
      label: "할인율",
      type: "number",
      defaultValue: 20,
      min: 0,
      max: 100,
      step: 1,
      suffix: "%",
    },
  ],

  resultLabels: [
    { key: "discountAmount", label: "할인 금액", suffix: "원" },
    { key: "finalPrice", label: "최종 가격", suffix: "원" },
    { key: "saved", label: "절약 비율", suffix: "%" },
  ],

  seo: {
    ko: {
      title: "할인 계산기 - 할인가 즉시 계산",
      description:
        "원래 가격과 할인율을 입력하면 할인 금액과 최종 가격을 즉시 계산합니다. 쇼핑할 때 유용한 무료 온라인 할인 계산기입니다.",
      keywords: [
        "할인 계산기",
        "할인가 계산",
        "할인율 계산",
        "세일 계산기",
        "최종 가격 계산",
        "쇼핑 계산기",
      ],
    },
    en: {
      title: "Discount Calculator - Instant Sale Price Calculator",
      description:
        "Enter the original price and discount rate to instantly calculate the discount amount and final price. Free online discount calculator for shopping.",
      keywords: [
        "discount calculator",
        "sale price calculator",
        "percent off calculator",
        "discount amount",
        "final price calculator",
        "shopping calculator",
      ],
    },
  },

  howToUse: {
    ko: [
      "원래 가격(정가)을 입력하세요.",
      "할인율(%)을 입력하세요.",
      "계산 버튼을 누르면 할인 금액, 최종 가격, 절약 비율이 표시됩니다.",
    ],
    en: [
      "Enter the original (full) price.",
      "Enter the discount rate (%).",
      "Click Calculate to see the discount amount, final price, and savings percentage.",
    ],
  },

  features: {
    ko: [
      "원래 가격과 할인율로 할인 금액 즉시 계산",
      "최종 결제 가격 자동 산출",
      "절약 비율 표시",
      "천 단위 구분자로 가독성 높은 금액 표시",
      "0~100% 할인율 지원",
      "간편한 입력 인터페이스",
    ],
    en: [
      "Instant discount amount from original price and rate",
      "Automatic final price calculation",
      "Savings percentage display",
      "Thousands separator for readable amounts",
      "Supports 0–100% discount rates",
      "Simple and clean input interface",
    ],
  },

  useCases: {
    ko: [
      {
        title: "쇼핑몰 세일 가격 확인",
        description:
          "온라인 쇼핑 중 30% 할인 행사 상품의 실제 결제 금액을 빠르게 계산합니다.",
        example: {
          input: "원래 가격: 89,000원 / 할인율: 30%",
          output: "할인 금액: 26,700원 / 최종 가격: 62,300원",
        },
      },
      {
        title: "블랙프라이데이 가격 비교",
        description:
          "여러 상품의 할인가를 계산하여 어떤 상품이 더 저렴한지 비교합니다.",
        example: {
          input: "원래 가격: 150,000원 / 할인율: 40%",
          output: "할인 금액: 60,000원 / 최종 가격: 90,000원",
        },
      },
      {
        title: "멤버십 할인 적용",
        description:
          "VIP 멤버십 15% 할인이 적용된 실제 가격을 계산합니다.",
        example: {
          input: "원래 가격: 200,000원 / 할인율: 15%",
          output: "할인 금액: 30,000원 / 최종 가격: 170,000원",
        },
      },
    ],
    en: [
      {
        title: "Online Shopping Sale Price",
        description:
          "Quickly calculate the actual price of a 30%-off sale item while shopping online.",
        example: {
          input: "Original: $89 / Discount: 30%",
          output: "Discount: $26.70 / Final: $62.30",
        },
      },
      {
        title: "Black Friday Price Comparison",
        description:
          "Calculate discounted prices for multiple items to compare deals.",
        example: {
          input: "Original: $150 / Discount: 40%",
          output: "Discount: $60 / Final: $90",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "할인율과 할인 금액 계산 방법",
      content:
        "할인 계산은 간단한 수식으로 이루어집니다.\n\n할인 금액 = 원래 가격 × (할인율 ÷ 100)\n최종 가격 = 원래 가격 - 할인 금액\n\n예를 들어 50,000원짜리 상품이 20% 할인이라면:\n- 할인 금액 = 50,000 × 0.20 = 10,000원\n- 최종 가격 = 50,000 - 10,000 = 40,000원\n\n쇼핑 시 할인율만 표시된 경우, 이 계산기로 실제 절약 금액과 최종 결제 금액을 빠르게 확인할 수 있습니다.",
    },
    en: {
      title: "How Discount Calculation Works",
      content:
        "Discount calculation uses a simple formula:\n\nDiscount Amount = Original Price × (Discount Rate ÷ 100)\nFinal Price = Original Price - Discount Amount\n\nFor example, a $50 item with a 20% discount:\n- Discount Amount = $50 × 0.20 = $10\n- Final Price = $50 - $10 = $40\n\nUse this calculator whenever you see a percentage-off sale and want to know exactly how much you save and pay.",
    },
  },

  faq: {
    ko: [
      {
        q: "할인율이 100%이면 어떻게 되나요?",
        a: "할인율이 100%이면 최종 가격은 0원이 됩니다. 즉, 완전 무료입니다. 실제 상거래에서는 드문 경우이지만 계산은 정상적으로 처리됩니다.",
      },
      {
        q: "소수점 할인율도 계산되나요?",
        a: "네, 예를 들어 12.5%처럼 소수점 할인율도 정확하게 계산됩니다.",
      },
      {
        q: "부가세(VAT)는 포함되나요?",
        a: "이 계산기는 순수 할인 계산만 수행합니다. 부가세나 추가 수수료는 포함되지 않습니다. 세금 포함 가격을 원래 가격으로 입력하면 세후 할인가를 계산할 수 있습니다.",
      },
    ],
    en: [
      {
        q: "What happens with a 100% discount?",
        a: "A 100% discount results in a final price of 0. Rare in practice, but the calculator handles it correctly.",
      },
      {
        q: "Can I enter a decimal discount rate like 12.5%?",
        a: "Yes, decimal discount rates like 12.5% are calculated accurately.",
      },
      {
        q: "Is VAT included?",
        a: "This calculator performs a pure discount calculation only. VAT and additional fees are not included. Enter the tax-inclusive price as the original price if you want the after-tax discounted price.",
      },
    ],
  },

  relatedTools: ["percentage-calculator", "word-counter", "uuid-generator"],
};
