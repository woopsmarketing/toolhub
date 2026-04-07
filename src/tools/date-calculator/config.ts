import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "date-calculator",
  category: "calculator",
  template: "FormToResult",
  processingType: "client",
  icon: "Calendar",

  formFields: [
    {
      name: "startDate",
      label: "시작 날짜",
      type: "text",
      placeholder: "2024-01-01",
      defaultValue: "2024-01-01",
    },
    {
      name: "endDate",
      label: "종료 날짜",
      type: "text",
      placeholder: "2024-12-31",
      defaultValue: "2024-12-31",
    },
  ],

  resultLabels: [
    { key: "days", label: "일수", suffix: "일" },
    { key: "weeks", label: "주", suffix: "주" },
    { key: "months", label: "개월", suffix: "개월" },
  ],

  seo: {
    ko: {
      title: "날짜 계산기 - 두 날짜 사이의 일수 계산",
      description:
        "두 날짜 사이의 일수, 주, 개월을 즉시 계산하세요. D-Day 계산, 기간 계산, 날짜 차이를 무료로 확인할 수 있는 온라인 날짜 계산기입니다.",
      keywords: [
        "날짜 계산기",
        "일수 계산",
        "D-Day 계산",
        "날짜 차이",
        "기간 계산",
        "날짜 계산 온라인",
      ],
    },
    en: {
      title: "Date Calculator - Days Between Two Dates",
      description:
        "Calculate the number of days, weeks, and months between two dates instantly. Free online date difference calculator for deadlines, anniversaries, and countdowns.",
      keywords: [
        "date calculator",
        "days between dates",
        "date difference",
        "day counter",
        "date duration calculator",
        "how many days between",
      ],
    },
  },

  howToUse: {
    ko: [
      "시작 날짜를 YYYY-MM-DD 형식으로 입력하세요.",
      "종료 날짜를 YYYY-MM-DD 형식으로 입력하세요.",
      "두 날짜 사이의 일수, 주, 개월 수를 즉시 확인하세요.",
    ],
    en: [
      "Enter the start date in YYYY-MM-DD format.",
      "Enter the end date in YYYY-MM-DD format.",
      "Instantly see the number of days, weeks, and months between the two dates.",
    ],
  },

  features: {
    ko: [
      "두 날짜 사이의 정확한 일수 계산",
      "주(Week) 단위로 변환하여 표시",
      "개월(Month) 단위 근사값 제공",
      "과거 날짜와 미래 날짜 모두 지원",
      "YYYY-MM-DD 형식으로 간편 입력",
    ],
    en: [
      "Accurate day count between two dates",
      "Conversion to weeks",
      "Approximate month count",
      "Supports both past and future dates",
      "Simple YYYY-MM-DD input format",
    ],
  },

  useCases: {
    ko: [
      {
        title: "D-Day 계산",
        description: "시험, 여행, 행사까지 남은 날짜를 정확히 계산합니다.",
        example: {
          input: "시작: 2024-01-01, 종료: 2024-12-31",
          output: "일수: 365일, 주: 52주, 개월: 12개월",
        },
      },
      {
        title: "프로젝트 기간 계산",
        description: "프로젝트 시작일부터 마감일까지의 기간을 계산합니다.",
        example: {
          input: "시작: 2024-03-01, 종료: 2024-06-30",
          output: "일수: 121일, 주: 17주",
        },
      },
      {
        title: "계약 기간 확인",
        description: "임대차 계약이나 보험 계약 등의 기간을 확인합니다.",
        example: {
          input: "시작: 2023-07-01, 종료: 2025-06-30",
          output: "일수: 729일, 개월: 24개월",
        },
      },
    ],
    en: [
      {
        title: "Countdown Timer",
        description: "Calculate exactly how many days until an exam, trip, or event.",
        example: {
          input: "Start: 2024-01-01, End: 2024-12-31",
          output: "Days: 365, Weeks: 52, Months: 12",
        },
      },
      {
        title: "Project Duration",
        description: "Calculate the duration from project start to deadline.",
        example: {
          input: "Start: 2024-03-01, End: 2024-06-30",
          output: "Days: 121, Weeks: 17",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "날짜 계산이 필요한 순간들",
      content:
        "날짜 계산은 일상에서 자주 필요하지만 직접 계산하기 번거로운 작업입니다. 윤년(2월 29일)이 포함된 경우, 월마다 다른 일수(28~31일) 등을 고려해야 하기 때문입니다.\n\n이 계산기는 두 날짜 사이의 정확한 차이를 계산해 드립니다. 일수는 물론 주 단위와 개월 단위로도 확인할 수 있어 다양한 용도로 활용할 수 있습니다.\n\n날짜 형식은 YYYY-MM-DD(예: 2024-01-01)를 사용해 주세요. 국제 표준 형식으로 혼동 없이 날짜를 입력할 수 있습니다.",
    },
    en: {
      title: "When You Need Date Calculations",
      content:
        "Date calculations are frequently needed in daily life but tedious to do manually — especially when accounting for leap years and varying month lengths (28–31 days).\n\nThis calculator computes the precise difference between two dates, displaying it in days, weeks, and months for maximum flexibility.\n\nUse the YYYY-MM-DD format (e.g., 2024-01-01) to avoid ambiguity with international date standards.",
    },
  },

  faq: {
    ko: [
      {
        q: "시작 날짜와 종료 날짜가 같으면 몇 일인가요?",
        a: "같은 날짜를 입력하면 0일로 계산됩니다. 당일을 포함하여 계산하려면 결과에 1을 더하시면 됩니다.",
      },
      {
        q: "윤년도 정확하게 계산되나요?",
        a: "네, 윤년(2월 29일)을 포함한 날짜 계산도 정확하게 처리됩니다.",
      },
      {
        q: "과거 날짜도 계산할 수 있나요?",
        a: "네, 시작 날짜가 종료 날짜보다 이후인 경우에도 절댓값으로 계산하여 결과를 표시합니다.",
      },
    ],
    en: [
      {
        q: "What if the start and end dates are the same?",
        a: "If the same date is entered for both fields, the result will be 0 days. Add 1 to include the day itself.",
      },
      {
        q: "Are leap years handled correctly?",
        a: "Yes, leap years (February 29) are accurately accounted for in all calculations.",
      },
    ],
  },

  relatedTools: ["age-calculator", "percentage-calculator", "loan-calculator", "unit-converter"],
};
