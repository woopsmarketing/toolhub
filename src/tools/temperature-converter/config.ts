import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "temperature-converter",
  category: "converter",
  template: "form-to-result",
  processingType: "client",
  icon: "Thermometer",
  tags: ["temperature", "celsius", "fahrenheit", "kelvin", "unit"],
  status: "published",

  datePublished: "2026-05-10",
  lastUpdated: "2026-05-10",

  inputConfig: {
    outputType: "stats",
  },

  formFields: [
    {
      name: "value",
      label: "변환할 값",
      type: "number",
      defaultValue: 25,
      step: 0.01,
    },
    {
      name: "unit",
      label: "입력 단위",
      type: "select",
      defaultValue: "celsius",
      options: [
        { label: "섭씨 (°C)", value: "celsius" },
        { label: "화씨 (°F)", value: "fahrenheit" },
        { label: "켈빈 (K)", value: "kelvin" },
      ],
    },
  ],

  resultLabels: [
    { key: "celsius", label: "섭씨", suffix: "°C" },
    { key: "fahrenheit", label: "화씨", suffix: "°F" },
    { key: "kelvin", label: "켈빈", suffix: "K" },
  ],

  seo: {
    ko: {
      title: "온도 변환기 - 섭씨·화씨·켈빈 즉시 변환",
      description:
        "온도 변환기는 섭씨(℃)·화씨(℉)·켈빈(K) 세 단위 사이의 온도 값을 즉시 상호 변환해주는 무료 온라인 도구입니다. 한 번 입력하면 나머지 두 단위 값을 동시에 표시합니다.",
      keywords: [
        "온도 변환기",
        "섭씨 화씨 변환",
        "화씨 섭씨 계산",
        "켈빈 변환",
        "온도 단위 변환",
        "celsius fahrenheit 변환",
        "화씨 100도 섭씨",
        "온도 계산기",
      ],
    },
    en: {
      title: "Temperature Converter - Celsius / Fahrenheit / Kelvin",
      description:
        "Temperature Converter is a free online tool that converts between Celsius (°C), Fahrenheit (°F), and Kelvin (K). Enter a value in any unit and see the other two instantly — fully client-side, no signup.",
      keywords: [
        "temperature converter",
        "celsius to fahrenheit",
        "fahrenheit to celsius",
        "kelvin converter",
        "temperature unit converter",
        "convert temperature online",
        "c to f converter",
        "free temperature calculator",
      ],
    },
  },

  howToUse: {
    ko: [
      "입력 단위(섭씨/화씨/켈빈)를 선택하세요.",
      "변환할 온도 값을 입력하세요.",
      '"계산하기"를 누르면 나머지 두 단위의 값이 표시됩니다.',
    ],
    en: [
      "Choose the input unit (Celsius/Fahrenheit/Kelvin).",
      "Type the temperature value to convert.",
      'Click "Calculate" to see the other two unit values.',
    ],
  },

  features: {
    ko: [
      "섭씨·화씨·켈빈 한 단위만 입력하면 나머지 두 단위 값을 동시에 출력",
      "표준 변환 공식 사용 (섭씨 ↔ 화씨, 섭씨 ↔ 켈빈)",
      "음수 온도와 절대영도(0K = -273.15℃) 정확히 처리",
      "모든 처리는 브라우저 내 (입력값이 외부 서버로 전송되지 않음)",
      "소수점 둘째 자리까지 결과 표시 (반올림)",
    ],
    en: [
      "Enter a value in one unit and instantly see the other two",
      "Uses standard conversion formulas (C↔F, C↔K)",
      "Handles negative temperatures and absolute zero (0K = -273.15°C) correctly",
      "Fully client-side — your input never leaves the browser",
      "Results rounded to two decimal places",
    ],
  },

  useCases: {
    ko: [
      {
        title: "외국 요리·과학 자료 단위 변환",
        description:
          "미국 요리 레시피의 화씨 오븐 온도를 섭씨로 변환하거나, 과학 논문의 켈빈을 섭씨로 환산.",
        example: {
          input: "화씨 350",
          output: "섭씨 176.67℃ / 켈빈 449.82K",
        },
      },
      {
        title: "해외 여행 날씨 확인",
        description:
          "미국·캐나다 일기예보의 화씨 기온을 한국식 섭씨로 빠르게 환산.",
      },
    ],
    en: [
      {
        title: "Foreign recipes and scientific papers",
        description:
          "Convert °F oven temperatures from US recipes to °C, or convert Kelvin in scientific papers to Celsius.",
      },
      {
        title: "Weather checks for travel",
        description:
          "Quickly convert °F weather forecasts in the US/Canada to °C you are used to.",
      },
    ],
  },

  guide: {
    ko: {
      title: "온도 변환기 사용 가이드",
      content:
        "온도 변환기는 섭씨(°C), 화씨(°F), 켈빈(K) 세 가지 온도 단위 사이의 값을 즉시 상호 변환해주는 도구입니다. 외국 요리 레시피, 과학 논문, 해외 일기예보 등 서로 다른 단위 체계를 다룰 때 가장 자주 쓰입니다.\n\n변환 공식은 다음과 같습니다.\n• 섭씨 → 화씨:  °F = °C × 9/5 + 32\n• 화씨 → 섭씨:  °C = (°F − 32) × 5/9\n• 섭씨 → 켈빈:  K = °C + 273.15\n• 켈빈 → 섭씨:  °C = K − 273.15\n\n입력 값과 단위만 선택하면 나머지 두 단위의 값이 동시에 표시되며, 모든 계산은 브라우저 내에서 수행되므로 입력 값이 외부 서버로 전송되지 않습니다.",
    },
    en: {
      title: "Temperature Converter Guide",
      content:
        "Temperature Converter converts between Celsius (°C), Fahrenheit (°F), and Kelvin (K). It is most useful for foreign recipes, scientific papers, or international weather forecasts where different unit systems mix.\n\nFormulas:\n• C → F:  °F = °C × 9/5 + 32\n• F → C:  °C = (°F − 32) × 5/9\n• C → K:  K = °C + 273.15\n• K → C:  °C = K − 273.15\n\nPick the source unit and type a value; the other two unit values appear instantly. Everything runs in your browser, so your input never leaves the device.",
    },
  },

  faq: {
    ko: [
      {
        q: "온도 변환 공식은 무엇인가요?",
        a: "온도 변환기는 표준 공식을 사용합니다. 섭씨 → 화씨 = ℃ × 9/5 + 32, 화씨 → 섭씨 = (℉ − 32) × 5/9, 섭씨 → 켈빈 = ℃ + 273.15. 켈빈은 절대온도이므로 0K = -273.15℃입니다.",
      },
      {
        q: "절대영도보다 낮은 값을 입력해도 되나요?",
        a: "입력 자체는 가능하지만 물리적으로 절대영도(-273.15℃ = 0K) 미만의 온도는 존재하지 않습니다. 켈빈 결과가 음수로 표시되면 입력값을 다시 확인해 보세요.",
      },
      {
        q: "화씨 100도는 섭씨 몇 도인가요?",
        a: "화씨 100도는 섭씨 약 37.78℃입니다. (100 − 32) × 5/9 = 37.78. 사람의 체온(36.5~37.5℃) 범위에 가깝습니다.",
      },
      {
        q: "입력 값이 서버로 전송되나요?",
        a: "아니오, 온도 변환기는 입력 값을 어떤 서버로도 전송하지 않습니다. 모든 계산은 사용자의 브라우저 내에서만 수행됩니다.",
      },
    ],
    en: [
      {
        q: "What conversion formulas are used?",
        a: "Temperature Converter uses the standard formulas. C → F = °C × 9/5 + 32, F → C = (°F − 32) × 5/9, C → K = °C + 273.15. Kelvin is an absolute scale, so 0K = -273.15°C.",
      },
      {
        q: "Can I enter values below absolute zero?",
        a: "You can type any value, but physically nothing can exist below absolute zero (-273.15°C = 0K). If the Kelvin output is negative, recheck your input.",
      },
      {
        q: "What is 100°F in Celsius?",
        a: "100°F is about 37.78°C. (100 − 32) × 5/9 = 37.78°C, close to human body temperature (36.5~37.5°C).",
      },
      {
        q: "Are my inputs sent to a server?",
        a: "No, Temperature Converter never sends your inputs anywhere. All math happens inside your browser.",
      },
    ],
  },

  relatedTools: [
    "unit-converter",
    "color-converter",
    "percentage-calculator",
    "bmi-calculator",
  ],

  privacy: {
    storesInput: false,
    storesFiles: false,
    clientSideOnly: true,
  },

  schema: {
    type: "WebApplication",
    applicationCategory: "UtilitiesApplication",
  },
};
