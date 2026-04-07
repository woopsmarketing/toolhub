import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "loan-calculator",
  category: "calculator",
  template: "FormToResult",
  processingType: "client",
  icon: "Banknote",

  formFields: [
    {
      name: "principal",
      label: "대출 금액",
      type: "number",
      placeholder: "대출 금액을 입력하세요",
      defaultValue: 100000000,
      suffix: "원",
    },
    {
      name: "interestRate",
      label: "연 이자율",
      type: "number",
      placeholder: "연 이자율을 입력하세요",
      defaultValue: 3.5,
      step: 0.1,
      suffix: "%",
    },
    {
      name: "years",
      label: "대출 기간",
      type: "number",
      placeholder: "대출 기간을 입력하세요",
      defaultValue: 30,
      suffix: "년",
    },
  ],

  resultLabels: [
    { key: "monthly", label: "월 상환액", suffix: "원" },
    { key: "totalPayment", label: "총 상환액", suffix: "원" },
    { key: "totalInterest", label: "총 이자", suffix: "원" },
  ],

  seo: {
    ko: {
      title: "대출 계산기 - 월 상환액 및 총 이자 계산",
      description:
        "대출 금액, 이자율, 기간을 입력하면 월 상환액과 총 이자를 즉시 계산합니다. 주택담보대출, 신용대출, 자동차 할부 계산에 활용하세요.",
      keywords: [
        "대출 계산기",
        "월 상환액 계산",
        "주택담보대출 계산기",
        "이자 계산기",
        "원리금균등상환",
        "대출 이자 계산",
      ],
    },
    en: {
      title: "Loan Calculator - Monthly Payment & Total Interest",
      description:
        "Enter loan amount, interest rate, and term to instantly calculate monthly payments and total interest. Perfect for mortgages, personal loans, and auto loans.",
      keywords: [
        "loan calculator",
        "mortgage calculator",
        "monthly payment calculator",
        "interest calculator",
        "amortization calculator",
        "loan payment calculator",
      ],
    },
  },

  howToUse: {
    ko: [
      "대출 금액을 원(₩) 단위로 입력하세요.",
      "연 이자율(%)과 대출 기간(년)을 입력하세요.",
      "월 상환액, 총 상환액, 총 이자를 즉시 확인하세요.",
    ],
    en: [
      "Enter the loan principal amount.",
      "Enter the annual interest rate (%) and loan term (years).",
      "Instantly see the monthly payment, total payment, and total interest.",
    ],
  },

  features: {
    ko: [
      "원리금균등상환 방식으로 월 상환액 계산",
      "총 상환액 및 총 이자 금액 자동 계산",
      "소수점 이자율 지원 (예: 3.5%)",
      "1억, 5억 등 대형 금액도 정확히 계산",
      "천 단위 구분 기호로 읽기 쉬운 결과 표시",
    ],
    en: [
      "Monthly payment calculated using standard amortization formula",
      "Automatic calculation of total payment and total interest",
      "Decimal interest rates supported (e.g., 3.5%)",
      "Accurate for large loan amounts",
      "Results displayed with thousands separators for readability",
    ],
  },

  useCases: {
    ko: [
      {
        title: "주택담보대출 계산",
        description: "3억원을 연 3.5%로 30년 상환할 경우 월 납입금을 계산합니다.",
        example: {
          input: "대출금액: 300,000,000원, 이자율: 3.5%, 기간: 30년",
          output: "월 상환액: 1,347,051원, 총 이자: 184,938,360원",
        },
      },
      {
        title: "자동차 할부 계산",
        description: "3,000만원 자동차를 연 6%로 5년 할부 시 월 납입금을 계산합니다.",
        example: {
          input: "대출금액: 30,000,000원, 이자율: 6%, 기간: 5년",
          output: "월 상환액: 579,984원, 총 이자: 4,799,040원",
        },
      },
      {
        title: "전세자금대출 계산",
        description: "2억원을 연 4%로 2년 만기로 계산하여 이자 부담을 파악합니다.",
        example: {
          input: "대출금액: 200,000,000원, 이자율: 4%, 기간: 2년",
          output: "월 상환액: 9,208,927원",
        },
      },
    ],
    en: [
      {
        title: "Mortgage Calculation",
        description: "Calculate monthly payments for a $300,000 mortgage at 3.5% over 30 years.",
        example: {
          input: "Principal: $300,000, Rate: 3.5%, Term: 30 years",
          output: "Monthly: $1,347, Total Interest: $184,938",
        },
      },
      {
        title: "Auto Loan Calculation",
        description: "Calculate payments for a $30,000 car loan at 6% over 5 years.",
        example: {
          input: "Principal: $30,000, Rate: 6%, Term: 5 years",
          output: "Monthly: $580, Total Interest: $4,799",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "원리금균등상환 계산 방법",
      content:
        "원리금균등상환은 매월 동일한 금액을 상환하는 가장 일반적인 대출 상환 방식입니다.\n\n계산 공식:\n월 납입금 = P × [r(1+r)^n] / [(1+r)^n - 1]\n\n여기서 P = 원금, r = 월 이자율(연 이자율 ÷ 12), n = 총 상환 개월 수\n\n예를 들어 1억원을 연 3.5%로 30년 상환하면:\n- 월 이자율: 3.5% ÷ 12 = 0.2917%\n- 총 상환 개월: 30 × 12 = 360개월\n- 월 납입금: 약 449,044원\n\n초기에는 이자 비중이 높고 후반으로 갈수록 원금 비중이 높아집니다.",
    },
    en: {
      title: "How Amortization Works",
      content:
        "Amortization is the most common loan repayment method where you pay the same amount every month.\n\nFormula:\nMonthly Payment = P × [r(1+r)^n] / [(1+r)^n - 1]\n\nWhere P = principal, r = monthly interest rate (annual rate ÷ 12), n = total number of payments\n\nFor example, a $100,000 loan at 3.5% over 30 years:\n- Monthly rate: 3.5% ÷ 12 = 0.2917%\n- Total payments: 30 × 12 = 360\n- Monthly payment: ~$449\n\nEarly payments are mostly interest; later payments are mostly principal.",
    },
  },

  faq: {
    ko: [
      {
        q: "원리금균등상환과 원금균등상환의 차이는 무엇인가요?",
        a: "원리금균등상환은 매월 동일한 금액을 납부하는 방식이고, 원금균등상환은 매월 같은 원금에 줄어드는 이자를 더해 납부하는 방식입니다. 원금균등상환이 총 이자 부담이 더 적지만 초기 납입금이 높습니다.",
      },
      {
        q: "중도상환 수수료는 계산에 포함되나요?",
        a: "이 계산기는 순수 원리금균등상환만 계산합니다. 중도상환 수수료, 보증료, 기타 부대 비용은 포함되지 않으므로 실제 대출 시 금융기관에 문의하세요.",
      },
      {
        q: "변동금리 대출도 계산할 수 있나요?",
        a: "이 계산기는 고정금리를 기준으로 계산합니다. 변동금리 대출의 경우 금리 변동 시점마다 재계산이 필요합니다.",
      },
    ],
    en: [
      {
        q: "What is the difference between amortization and interest-only loans?",
        a: "With amortization, each payment covers both principal and interest. With interest-only loans, you only pay interest for a period, then a large principal payment is due. Amortization results in owning the asset outright after the term.",
      },
      {
        q: "Are fees and insurance included?",
        a: "This calculator only computes principal and interest. Origination fees, mortgage insurance, and other costs are not included. Consult your lender for full cost estimates.",
      },
    ],
  },

  relatedTools: ["percentage-calculator", "bmi-calculator", "date-calculator", "age-calculator"],
};
