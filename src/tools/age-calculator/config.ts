import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "age-calculator",
  category: "calculator",
  template: "FormToResult",
  processingType: "client",
  icon: "Cake",

  formFields: [
    {
      name: "birthDate",
      label: "생년월일",
      type: "text",
      placeholder: "1990-01-01",
      defaultValue: "1990-01-01",
    },
  ],

  resultLabels: [
    { key: "age", label: "만 나이", suffix: "세" },
    { key: "koreanAge", label: "한국 나이", suffix: "세" },
    { key: "days", label: "살아온 일수", suffix: "일" },
    { key: "nextBirthday", label: "다음 생일까지", suffix: "일" },
  ],

  seo: {
    ko: {
      title: "나이 계산기 - 만 나이 및 한국 나이 계산",
      description:
        "생년월일을 입력하여 만 나이, 한국 나이, 살아온 일수, 다음 생일까지 남은 날짜를 즉시 계산하세요. 2023년 만 나이 통일법 적용.",
      keywords: [
        "나이 계산기",
        "만 나이 계산",
        "한국 나이",
        "생일 계산",
        "나이 계산 온라인",
        "만 나이 통일",
      ],
    },
    en: {
      title: "Age Calculator - Calculate Your Exact Age",
      description:
        "Enter your birth date to instantly calculate your exact age, Korean age, days lived, and days until your next birthday. Free online age calculator.",
      keywords: [
        "age calculator",
        "how old am I",
        "calculate age",
        "birthday calculator",
        "days lived calculator",
        "next birthday countdown",
      ],
    },
  },

  howToUse: {
    ko: [
      "생년월일을 YYYY-MM-DD 형식으로 입력하세요.",
      "만 나이, 한국 나이, 살아온 일수가 자동으로 계산됩니다.",
      "다음 생일까지 남은 날짜도 함께 확인하세요.",
    ],
    en: [
      "Enter your birth date in YYYY-MM-DD format.",
      "Your exact age, Korean age, and days lived are calculated automatically.",
      "Also see how many days until your next birthday.",
    ],
  },

  features: {
    ko: [
      "만 나이 정확 계산 (생일 기준)",
      "한국 나이 계산 (현재 연도 - 출생 연도 + 1)",
      "살아온 총 일수 계산",
      "다음 생일까지 남은 일수 계산",
      "2023년 만 나이 통일법 기준 적용",
    ],
    en: [
      "Precise age calculation based on birth date",
      "Korean age calculation (current year - birth year + 1)",
      "Total days lived calculation",
      "Days until next birthday",
      "Supports any birth date from the past",
    ],
  },

  useCases: {
    ko: [
      {
        title: "만 나이 확인",
        description: "2023년 만 나이 통일법 시행 이후 정확한 만 나이를 확인합니다.",
        example: {
          input: "생년월일: 1990-06-15",
          output: "만 나이: 34세, 한국 나이: 35세",
        },
      },
      {
        title: "생일 카운트다운",
        description: "다음 생일까지 몇 일 남았는지 확인합니다.",
        example: {
          input: "생년월일: 1995-12-25",
          output: "다음 생일까지: 263일",
        },
      },
      {
        title: "인생 돌아보기",
        description: "태어난 날부터 오늘까지 살아온 총 일수를 확인합니다.",
        example: {
          input: "생년월일: 1985-03-10",
          output: "살아온 일수: 14,358일",
        },
      },
    ],
    en: [
      {
        title: "Check Your Exact Age",
        description: "Find out your precise age based on today's date.",
        example: {
          input: "Birth date: 1990-06-15",
          output: "Age: 34, Korean age: 35",
        },
      },
      {
        title: "Birthday Countdown",
        description: "See how many days are left until your next birthday.",
        example: {
          input: "Birth date: 1995-12-25",
          output: "Days until next birthday: 263",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "만 나이와 한국 나이의 차이",
      content:
        "한국에서는 전통적으로 태어날 때 1살로 시작하고 매년 1월 1일에 한 살씩 나이를 먹는 '한국 나이' 방식을 사용했습니다. 하지만 2023년 6월부터 법적·행정적 나이 기준이 '만 나이'로 통일되었습니다.\n\n만 나이: 생일이 지난 경우 = 현재 연도 - 출생 연도, 생일이 지나지 않은 경우 = 현재 연도 - 출생 연도 - 1\n\n한국 나이: 현재 연도 - 출생 연도 + 1\n\n예를 들어 1990년 6월 15일생이라면:\n- 2024년 7월 기준 만 나이: 34세 (생일 지남)\n- 한국 나이: 35세 (2024 - 1990 + 1)",
    },
    en: {
      title: "International Age vs. Korean Age",
      content:
        "In Korea, the traditional age system counts a person as 1 year old at birth, and everyone ages by one year on January 1st. However, since June 2023, Korea officially unified to the international age system for legal and administrative purposes.\n\nInternational age: If birthday has passed = current year - birth year; if not yet = current year - birth year - 1\n\nKorean age: current year - birth year + 1\n\nFor example, someone born on June 15, 1990:\n- International age in July 2024: 34 (birthday has passed)\n- Korean age: 35 (2024 - 1990 + 1)",
    },
  },

  faq: {
    ko: [
      {
        q: "2023년 만 나이 통일법이 무엇인가요?",
        a: "2023년 6월 28일부터 시행된 법으로, 법적·사회적 나이 기준을 '만 나이'로 통일한 것입니다. 이전에는 연 나이, 만 나이, 한국 나이 등 세 가지 방식이 혼용되었지만, 이제 공식 문서에서는 만 나이를 사용합니다.",
      },
      {
        q: "다음 생일까지 계산은 어떻게 되나요?",
        a: "오늘 날짜를 기준으로 올해 생일이 이미 지났다면 내년 생일까지의 일수를, 아직 지나지 않았다면 올해 생일까지의 일수를 계산합니다.",
      },
      {
        q: "윤년 생일(2월 29일)생도 계산할 수 있나요?",
        a: "네, 2월 29일생의 경우도 정확하게 계산됩니다. 윤년이 아닌 해에는 3월 1일을 기준으로 계산합니다.",
      },
    ],
    en: [
      {
        q: "What is the Korean Age Unification Act of 2023?",
        a: "Enacted on June 28, 2023, this law standardized the legal age calculation to the international system. Previously, three different age-counting methods coexisted in Korea. Now official documents use the international (exact) age.",
      },
      {
        q: "How is the next birthday countdown calculated?",
        a: "If your birthday has already passed this year, the count shows days until next year's birthday. If it hasn't passed yet, it shows days until this year's birthday.",
      },
    ],
  },

  relatedTools: ["date-calculator", "bmi-calculator", "percentage-calculator", "loan-calculator"],
};
