import type { ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "salary-calculator",
  category: "calculator",
  template: "FormToResult",
  processingType: "client",
  icon: "Wallet",

  formFields: [
    {
      name: "annualSalary",
      label: "연봉",
      type: "number",
      placeholder: "연봉을 입력하세요",
      defaultValue: 40000000,
      suffix: "원",
      step: 1000000,
    },
    {
      name: "dependents",
      label: "부양가족 수 (본인 포함)",
      type: "select",
      defaultValue: "1",
      options: [
        { label: "1명 (본인만)", value: "1" },
        { label: "2명", value: "2" },
        { label: "3명", value: "3" },
        { label: "4명 이상", value: "4" },
      ],
    },
    {
      name: "mealAllowance",
      label: "비과세 식대",
      type: "select",
      defaultValue: "0",
      options: [
        { label: "미포함", value: "0" },
        { label: "월 20만원 포함", value: "200000" },
      ],
    },
    {
      name: "retirementIncluded",
      label: "퇴직금 구분",
      type: "select",
      defaultValue: "false",
      options: [
        { label: "퇴직금 별도", value: "false" },
        { label: "퇴직금 포함", value: "true" },
      ],
    },
  ],

  resultLabels: [
    { key: "monthlyGross", label: "월 급여", suffix: "원" },
    { key: "nationalPension", label: "국민연금 (4.75%)", suffix: "원" },
    { key: "healthInsurance", label: "건강보험 (3.545%)", suffix: "원" },
    { key: "longTermCare", label: "장기요양보험 (12.81%)", suffix: "원" },
    { key: "employmentInsurance", label: "고용보험 (0.9%)", suffix: "원" },
    { key: "incomeTax", label: "소득세", suffix: "원" },
    { key: "localIncomeTax", label: "지방소득세 (소득세의 10%)", suffix: "원" },
    { key: "totalDeduction", label: "공제 합계", suffix: "원" },
    { key: "netSalary", label: "월 실수령액", suffix: "원" },
  ],

  seo: {
    ko: {
      title: "연봉 실수령액 계산기 - 2026년 4대보험·세금 공제 후 월급 계산",
      description:
        "2026년 최신 4대보험 요율 기준으로 연봉 실수령액을 계산합니다. 국민연금, 건강보험, 장기요양보험, 고용보험, 소득세, 지방소득세 공제 항목별 내역을 확인하고 실제 월급을 파악하세요.",
      keywords: [
        "연봉 실수령액 계산기",
        "연봉계산기 2026",
        "세후 월급 계산기",
        "4대보험 계산기",
        "연봉 실수령액표",
        "월급 실수령액 계산",
        "소득세 계산기",
      ],
    },
    en: {
      title: "Korea Salary Calculator - Take-Home Pay After Tax & Insurance",
      description:
        "Calculate your actual take-home pay in South Korea based on 2026 tax rates and social insurance premiums. See detailed deductions for National Pension, Health Insurance, Employment Insurance, and income tax, instantly and with no sign-up required.",
      keywords: [
        "korea salary calculator",
        "salary after tax calculator korea",
        "korea take home pay calculator",
        "korean income tax calculator 2026",
        "korean social insurance calculator",
        "korea net salary calculator",
      ],
    },
  },

  howToUse: {
    ko: [
      "연봉(세전 총액)을 입력하세요.",
      "부양가족 수(본인 포함)와 20세 이하 자녀 수를 선택하세요.",
      "비과세 식대와 퇴직금 포함/별도 여부를 설정하세요.",
      "계산 결과에서 4대보험, 소득세, 지방소득세 각 항목별 공제액과 월 실수령액을 확인하세요.",
    ],
    en: [
      "Enter your annual gross salary in KRW.",
      "Select the number of dependents (including yourself).",
      "Set non-taxable meal allowance and whether severance pay is included.",
      "Review the detailed breakdown of social insurance premiums, income tax, local income tax, and your monthly take-home pay.",
    ],
  },

  features: {
    ko: [
      "2026년 최신 4대보험 요율(국민연금 4.75%, 건강보험 3.545%, 장기요양 12.81%, 고용보험 0.9%) 자동 적용",
      "국민연금, 건강보험, 장기요양보험, 고용보험, 소득세, 지방소득세 6개 공제 항목별 상세 내역 표시",
      "부양가족 수에 따른 근로소득 간이세액표 기반 소득세 자동 계산",
      "비과세 식대(월 20만원 한도) 설정 지원",
      "퇴직금 포함/별도에 따른 실수령액 차이 비교",
      "개인정보 서버 전송 없이 브라우저에서 즉시 계산",
    ],
    en: [
      "2026 Korean social insurance rates automatically applied (NPS 4.75%, NHI 3.545%, LTC 12.81%, EI 0.9%)",
      "Detailed breakdown of all 6 deduction items: pension, health, long-term care, employment, income tax, local tax",
      "Income tax calculated based on simplified wage tax table and number of dependents",
      "Non-taxable meal allowance setting (up to KRW 200,000/month)",
      "Compare take-home pay with severance included vs. separate",
      "Instant client-side calculation with no data sent to servers",
    ],
  },

  useCases: {
    ko: [
      {
        title: "이직 시 연봉 협상",
        description:
          "제안받은 연봉의 실제 월 수령액을 미리 계산하여 생활비 대비 적정 수준인지 판단합니다.",
        example: {
          input:
            "연봉: 50,000,000원, 부양가족: 1명, 비과세 식대: 200,000원, 퇴직금 별도",
          output: "월 실수령액: 약 3,574,000원 (공제합계 약 593,000원)",
        },
      },
      {
        title: "신입사원 첫 월급 예측",
        description:
          "입사 전 첫 월급이 얼마나 들어올지 미리 파악하여 주거비와 생활비를 계획합니다.",
        example: {
          input:
            "연봉: 36,000,000원, 부양가족: 1명, 비과세 식대: 200,000원, 퇴직금 별도",
          output: "월 실수령액: 약 2,700,000원 (공제합계 약 300,000원)",
        },
      },
      {
        title: "연봉 인상 전후 비교",
        description:
          "연봉이 4,000만원에서 5,000만원으로 인상될 때 실수령액 차이를 계산하여 실질적인 인상 효과를 확인합니다.",
        example: {
          input: "변경 전 연봉: 40,000,000원 → 변경 후 연봉: 50,000,000원",
          output: "월 실수령액 차이: 약 650,000원 증가",
        },
      },
    ],
    en: [
      {
        title: "Salary Negotiation for Expats",
        description:
          "Calculate your actual monthly take-home pay from a Korean salary offer to evaluate if it meets your living cost expectations.",
        example: {
          input:
            "Annual salary: KRW 60,000,000, Dependents: 1, Meal allowance: KRW 200,000, Severance: separate",
          output: "Monthly take-home: approx. KRW 4,230,000",
        },
      },
      {
        title: "Comparing Job Offers",
        description:
          "Compare two offers with different gross salaries to see the real difference in net monthly income after Korean taxes and insurance.",
        example: {
          input: "Offer A: KRW 50,000,000 vs. Offer B: KRW 55,000,000",
          output: "Monthly take-home difference: approx. KRW 320,000",
        },
      },
      {
        title: "First Paycheck Estimate",
        description:
          "Foreign nationals starting their first job in Korea can estimate their first monthly paycheck before arriving, helping them plan housing and living expenses in advance.",
        example: {
          input:
            "Annual salary: KRW 36,000,000, Dependents: 1, Meal allowance: KRW 200,000, Severance: separate",
          output: "Monthly take-home: approx. KRW 2,700,000",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "2026년 연봉 실수령액 계산 가이드",
      content:
        "연봉 실수령액이란 세전 연봉에서 4대 사회보험료와 소득세·지방소득세를 공제한 뒤 실제로 통장에 입금되는 금액을 말합니다. 매년 4대보험 요율이 변경되므로 최신 기준으로 계산하는 것이 중요합니다.\n\n2026년 기준 근로자 부담 4대보험 요율은 국민연금 4.75%, 건강보험 3.545%, 장기요양보험(건강보험료의 12.81%), 고용보험 0.9%입니다. 국민연금은 월 소득 617만원 상한이 적용되어 최대 293,075원까지만 부과됩니다.\n\n소득세는 근로소득 간이세액표에 따라 부양가족 수별로 차등 적용됩니다. 지방소득세는 소득세의 10%가 자동 부과됩니다. 비과세 식대는 월 20만원 한도 내에서 과세 대상 소득에서 제외되므로 실수령액을 높이는 효과가 있습니다.\n\n퇴직금 포함 연봉의 경우 연봉 총액의 1/13이 퇴직적립금으로 빠지기 때문에 월 급여 기준액이 낮아집니다. 퇴직금 별도인 경우에는 연봉 전액이 12개월로 분할됩니다. 연봉 협상 시 반드시 퇴직금 포함 여부를 확인하세요.",
    },
    en: {
      title: "Guide to Calculating Take-Home Pay in Korea (2026)",
      content:
        "Take-home pay is the amount deposited into your bank account after deducting social insurance premiums, income tax, and local income tax from your gross annual salary. Because insurance rates change every year, it is important to use the latest figures.\n\nAs of 2026, employee-side social insurance rates are: National Pension 4.75%, National Health Insurance 3.545%, Long-Term Care Insurance 12.81% of health insurance premium, and Employment Insurance 0.9%. National Pension contributions are capped at a monthly income of KRW 6,170,000.\n\nIncome tax is determined by the simplified wage income tax table and varies by the number of dependents. Local income tax is automatically assessed at 10% of income tax. A non-taxable meal allowance of up to KRW 200,000 per month is excluded from taxable income, effectively increasing your take-home pay.\n\nIf severance pay is included in the annual salary, 1/13 of the total is set aside as severance reserve, reducing the monthly base pay. When severance is separate, the full salary is divided by 12 months. Always confirm whether an offer includes or excludes severance pay during negotiations.",
    },
  },

  faq: {
    ko: [
      {
        q: "연봉 3,000만원과 5,000만원의 실수령액은 각각 얼마인가요?",
        a: "2026년 기준 부양가족 1명(본인), 비과세 식대 20만원, 퇴직금 별도 기준으로 연봉 3,000만원의 월 실수령액은 약 225만원, 연봉 5,000만원은 약 357만원입니다. 연봉이 높을수록 소득세 구간이 올라가 공제 비율이 커지므로 단순 비례하지 않습니다.",
      },
      {
        q: "2026년 4대보험 요율은 어떻게 변경되었나요?",
        a: "2026년 근로자 부담 기준 국민연금은 4.75%, 건강보험은 3.545%, 장기요양보험은 건강보험료의 12.81%, 고용보험은 0.9%입니다. 건강보험과 장기요양보험료는 매년 소폭 인상되는 추세이므로 연초에 최신 요율을 확인하시기 바랍니다.",
      },
      {
        q: "퇴직금 포함 연봉과 별도 연봉의 실수령액 차이는 얼마나 되나요?",
        a: "퇴직금 포함 연봉의 경우 연봉의 1/13이 퇴직적립금으로 빠지므로 월 급여 기준액이 약 7.7% 낮아집니다. 예를 들어 연봉 5,000만원 퇴직금 포함이면 월 기준 급여가 약 385만원이고, 퇴직금 별도이면 약 417만원으로 월 실수령액에서 약 25~30만원 차이가 발생합니다.",
      },
      {
        q: "비과세 식대를 설정하면 실수령액이 얼마나 늘어나나요?",
        a: "비과세 식대 월 20만원을 적용하면 해당 금액이 과세 대상 소득에서 제외됩니다. 연봉 5,000만원 기준으로 비과세 식대 적용 시 4대보험료와 소득세가 함께 줄어들어 월 실수령액이 약 5~8만원 정도 증가합니다.",
      },
    ],
    en: [
      {
        q: "How much is the actual take-home pay for a KRW 50 million salary?",
        a: "Based on 2026 rates with 1 dependent (self only), KRW 200,000 non-taxable meal allowance, and severance separate, a KRW 50 million annual salary yields approximately KRW 3,570,000 in monthly take-home pay.",
      },
      {
        q: "What are the 2026 social insurance rates in Korea?",
        a: "For 2026, employee-side rates are: National Pension 4.75%, National Health Insurance 3.545%, Long-Term Care Insurance 12.81% of health insurance, and Employment Insurance 0.9%.",
      },
      {
        q: "Does this calculator work for foreign employees in Korea?",
        a: "Yes. Foreign employees in Korea are generally subject to the same social insurance obligations and income tax rules as Korean nationals. This calculator uses the standard Korean deduction rules.",
      },
      {
        q: "What is the difference between severance-inclusive and separate salary?",
        a: "When severance pay is included in your annual salary, 1/13 of the total is set aside as a severance reserve, which means your monthly base pay is approximately 7.7% lower than it would be under a severance-separate arrangement. For example, a KRW 36,000,000 severance-inclusive salary results in a meaningfully lower monthly gross than the same figure quoted as severance-separate, so always confirm which structure applies before comparing offers.",
      },
    ],
  },

  relatedTools: [
    "loan-calculator",
    "percentage-calculator",
    "discount-calculator",
    "age-calculator",
  ],
};
