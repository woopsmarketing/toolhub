import { type ToolConfig } from "@/config/types";

const unitOptions = [
  { label: "킬로미터 (km)", value: "km" },
  { label: "미터 (m)", value: "m" },
  { label: "센티미터 (cm)", value: "cm" },
  { label: "밀리미터 (mm)", value: "mm" },
  { label: "마일 (mi)", value: "mi" },
  { label: "피트 (ft)", value: "ft" },
  { label: "인치 (in)", value: "in" },
];

export const config: ToolConfig = {
  slug: "unit-converter",
  category: "converter",
  template: "FormToResult",
  processingType: "client",
  icon: "ArrowLeftRight",

  formFields: [
    {
      name: "value",
      label: "값",
      type: "number",
      placeholder: "변환할 값을 입력하세요",
      defaultValue: 1,
    },
    {
      name: "fromUnit",
      label: "변환 전 단위",
      type: "select",
      options: unitOptions,
      defaultValue: "km",
    },
    {
      name: "toUnit",
      label: "변환 후 단위",
      type: "select",
      options: unitOptions,
      defaultValue: "m",
    },
  ],

  resultLabels: [{ key: "result", label: "변환 결과" }],

  seo: {
    ko: {
      title: "단위 변환기 - 길이 단위 변환 온라인",
      description:
        "킬로미터, 미터, 센티미터, 밀리미터, 마일, 피트, 인치 등 다양한 길이 단위를 즉시 변환하세요. 무료 온라인 단위 변환기입니다.",
      keywords: [
        "단위 변환기",
        "길이 변환",
        "km 변환",
        "미터 변환",
        "인치 변환",
        "단위 계산기",
      ],
    },
    en: {
      title: "Unit Converter - Length Unit Conversion Online",
      description:
        "Convert between kilometers, meters, centimeters, millimeters, miles, feet, and inches instantly. Free online length unit converter.",
      keywords: [
        "unit converter",
        "length converter",
        "km to miles",
        "meters to feet",
        "inches to cm",
        "length unit calculator",
      ],
    },
  },

  howToUse: {
    ko: [
      "변환할 숫자 값을 입력하세요.",
      "변환 전 단위와 변환 후 단위를 선택하세요.",
      "변환 결과를 즉시 확인하세요.",
    ],
    en: [
      "Enter the numeric value to convert.",
      "Select the source unit and the target unit.",
      "See the conversion result instantly.",
    ],
  },

  features: {
    ko: [
      "7가지 길이 단위 지원 (km, m, cm, mm, mi, ft, in)",
      "미터를 기준 단위로 정밀 변환",
      "소수점 이하 8자리 정밀도",
      "같은 단위 간 변환도 지원",
      "국제 표준 단위와 영미 단위 모두 지원",
      "실시간 즉시 변환",
    ],
    en: [
      "7 length units supported (km, m, cm, mm, mi, ft, in)",
      "Precise conversion using meter as base unit",
      "Up to 8 decimal places of precision",
      "Supports conversion between the same units",
      "Both metric and imperial units supported",
      "Instant real-time conversion",
    ],
  },

  useCases: {
    ko: [
      {
        title: "해외 여행 거리 확인",
        description: "미국/영국의 마일(mile) 단위를 익숙한 킬로미터로 변환합니다.",
        example: {
          input: "값: 10, 변환 전: mi, 변환 후: km",
          output: "변환 결과: 16.09344 km",
        },
      },
      {
        title: "신체 치수 변환",
        description: "해외 쇼핑몰에서 인치(inch) 단위 사이즈를 센티미터로 변환합니다.",
        example: {
          input: "값: 72, 변환 전: in, 변환 후: cm",
          output: "변환 결과: 182.88 cm",
        },
      },
      {
        title: "건축/인테리어 단위 변환",
        description: "건축 도면의 밀리미터 단위를 미터로 변환합니다.",
        example: {
          input: "값: 2500, 변환 전: mm, 변환 후: m",
          output: "변환 결과: 2.5 m",
        },
      },
    ],
    en: [
      {
        title: "Travel Distance Conversion",
        description: "Convert miles used in the US/UK to familiar kilometers.",
        example: {
          input: "Value: 10, From: mi, To: km",
          output: "Result: 16.09344 km",
        },
      },
      {
        title: "Clothing Size Conversion",
        description: "Convert inch-based sizes from international shopping sites to centimeters.",
        example: {
          input: "Value: 72, From: in, To: cm",
          output: "Result: 182.88 cm",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "길이 단위 변환 완벽 가이드",
      content:
        "전 세계에는 두 가지 주요 단위 체계가 있습니다. 미터법(SI 단위계)은 한국을 포함한 대부분의 국가에서 사용하며 km, m, cm, mm 등이 속합니다. 야드파운드법은 미국, 영국 등에서 사용하며 마일(mile), 피트(ft), 인치(in) 등이 속합니다.\n\n이 변환기는 미터(m)를 기준 단위로 사용하여 모든 단위 간 정확한 변환을 제공합니다.\n\n주요 변환 비율:\n- 1 km = 1,000 m\n- 1 mi = 1,609.344 m\n- 1 ft = 0.3048 m\n- 1 in = 0.0254 m",
    },
    en: {
      title: "Complete Guide to Length Unit Conversion",
      content:
        "There are two major unit systems worldwide. The metric system (SI) is used in most countries including Korea, covering km, m, cm, and mm. The imperial system is used in the US and UK, covering miles, feet, and inches.\n\nThis converter uses meters (m) as the base unit for accurate conversion between all units.\n\nKey conversion ratios:\n- 1 km = 1,000 m\n- 1 mi = 1,609.344 m\n- 1 ft = 0.3048 m\n- 1 in = 0.0254 m",
    },
  },

  faq: {
    ko: [
      {
        q: "1마일은 몇 킬로미터인가요?",
        a: "1마일은 약 1.60934 킬로미터입니다. 정확한 값은 1 mi = 1,609.344 m입니다.",
      },
      {
        q: "1피트는 몇 센티미터인가요?",
        a: "1피트는 약 30.48 센티미터입니다. 정확한 값은 1 ft = 30.48 cm입니다.",
      },
      {
        q: "다른 단위(무게, 온도 등)도 지원하나요?",
        a: "현재는 길이 단위만 지원합니다. 무게, 온도, 넓이 등 다른 단위 변환은 추후 추가될 예정입니다.",
      },
    ],
    en: [
      {
        q: "How many kilometers is 1 mile?",
        a: "1 mile is approximately 1.60934 kilometers. The exact value is 1 mi = 1,609.344 m.",
      },
      {
        q: "How many centimeters is 1 foot?",
        a: "1 foot is exactly 30.48 centimeters.",
      },
    ],
  },

  relatedTools: ["percentage-calculator", "date-calculator", "bmi-calculator", "loan-calculator"],
};
