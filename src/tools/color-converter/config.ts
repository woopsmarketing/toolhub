import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "color-converter",
  category: "converter",
  template: "TextToText",
  processingType: "client",
  icon: "Palette",

  inputConfig: {
    placeholder: "색상 코드를 입력하세요 (예: #FF5733, rgb(255,87,51), hsl(11,100%,60%))",
    inputLabel: "색상 코드 입력",
    outputLabel: "변환 결과",
    outputType: "stats",
  },

  seo: {
    ko: {
      title: "색상 코드 변환기 - HEX, RGB, HSL 변환",
      description:
        "HEX, RGB, HSL 색상 코드를 즉시 상호 변환하세요. 웹 디자인과 개발에 필수적인 무료 온라인 색상 코드 변환 도구입니다.",
      keywords: [
        "색상 코드 변환",
        "hex rgb 변환",
        "rgb hsl 변환",
        "색상 변환기",
        "색상코드 변환",
        "헥스 코드 변환",
        "color converter",
      ],
    },
    en: {
      title: "Color Code Converter - HEX, RGB, HSL",
      description:
        "Instantly convert between HEX, RGB, and HSL color codes. Free online color converter for web designers and developers.",
      keywords: [
        "color converter",
        "hex to rgb",
        "rgb to hsl",
        "color code converter",
        "hex color converter",
        "css color converter",
      ],
    },
  },

  howToUse: {
    ko: [
      "HEX(#FF5733), RGB(rgb(255,87,51)), 또는 HSL(hsl(11,100%,60%)) 형식의 색상 코드를 입력하세요.",
      "입력과 동시에 나머지 두 형식으로 자동 변환됩니다.",
      "변환된 색상 코드를 복사하여 CSS나 디자인 도구에 바로 사용하세요.",
    ],
    en: [
      "Enter a color code in HEX (#FF5733), RGB (rgb(255,87,51)), or HSL (hsl(11,100%,60%)) format.",
      "The other two formats are automatically calculated instantly.",
      "Copy the converted color code and use it in your CSS or design tool.",
    ],
  },

  features: {
    ko: [
      "HEX → RGB, HSL 자동 변환",
      "RGB → HEX, HSL 자동 변환",
      "HSL → HEX, RGB 자동 변환",
      "#ABC 단축 HEX 형식 지원",
      "실시간 변환 (입력 즉시 결과 표시)",
      "대소문자 구분 없이 입력 가능",
    ],
    en: [
      "HEX → RGB, HSL automatic conversion",
      "RGB → HEX, HSL automatic conversion",
      "HSL → HEX, RGB automatic conversion",
      "Shorthand HEX format support (#ABC)",
      "Real-time conversion as you type",
      "Case-insensitive input",
    ],
  },

  useCases: {
    ko: [
      {
        title: "웹 CSS 색상 변환",
        description:
          "디자인 툴에서 얻은 HEX 색상을 CSS의 rgb() 또는 hsl() 함수 형식으로 변환할 때 사용합니다.",
        example: {
          input: "#FF5733",
          output: "RGB: rgb(255, 87, 51) / HSL: hsl(11, 100%, 60%)",
        },
      },
      {
        title: "브랜드 컬러 관리",
        description:
          "브랜드 가이드라인에 여러 형식의 색상 코드를 함께 기재할 때 빠르게 변환합니다.",
        example: {
          input: "rgb(0, 123, 255)",
          output: "HEX: #007BFF / HSL: hsl(211, 100%, 50%)",
        },
      },
      {
        title: "HSL 색상 조정",
        description:
          "HSL 형식은 색조, 채도, 밝기를 직접 조정하기 쉬워 CSS 테마 작업에 유용합니다.",
        example: {
          input: "hsl(240, 100%, 50%)",
          output: "HEX: #0000FF / RGB: rgb(0, 0, 255)",
        },
      },
    ],
    en: [
      {
        title: "Web CSS Color Conversion",
        description:
          "Convert HEX colors from design tools to rgb() or hsl() format for use in CSS.",
        example: {
          input: "#FF5733",
          output: "RGB: rgb(255, 87, 51) / HSL: hsl(11, 100%, 60%)",
        },
      },
      {
        title: "Brand Color Management",
        description:
          "Quickly generate all format variants when documenting brand colors in style guides.",
        example: {
          input: "rgb(0, 123, 255)",
          output: "HEX: #007BFF / HSL: hsl(211, 100%, 50%)",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "색상 코드 형식 이해하기",
      content:
        "웹에서 사용되는 주요 색상 형식은 HEX, RGB, HSL 세 가지입니다.\n\nHEX(#RRGGBB)는 빨강·초록·파랑 각 채널을 16진수 두 자리로 표현합니다. #FF5733처럼 6자리로 쓰거나 #F53처럼 3자리 단축 형식을 쓸 수 있습니다.\n\nRGB(r, g, b)는 각 채널을 0~255 사이 정수로 표현하며, 직관적으로 색을 조합할 때 편리합니다.\n\nHSL(hue, saturation, lightness)은 색조(0~360°), 채도(0~100%), 밝기(0~100%)로 색을 표현합니다. 같은 색조에서 밝기나 채도만 조절하기 쉬워 CSS 테마나 다크모드 구현에 특히 유용합니다.",
    },
    en: {
      title: "Understanding Color Code Formats",
      content:
        "The three main color formats used on the web are HEX, RGB, and HSL.\n\nHEX (#RRGGBB) represents each channel (red, green, blue) as two hexadecimal digits. You can use the full 6-digit form (#FF5733) or the 3-digit shorthand (#F53).\n\nRGB (r, g, b) expresses each channel as an integer from 0 to 255 — intuitive for mixing colors directly.\n\nHSL (hue, saturation, lightness) uses a 0–360° hue angle, and 0–100% saturation and lightness. It makes it easy to adjust only brightness or saturation, which is especially useful for CSS themes and dark mode implementations.",
    },
  },

  faq: {
    ko: [
      {
        q: "#FFF처럼 3자리 HEX도 입력할 수 있나요?",
        a: "네, #RGB 형식의 단축 HEX를 지원합니다. #FFF는 #FFFFFF로, #F53은 #FF5533으로 자동 확장하여 변환합니다.",
      },
      {
        q: "투명도(알파값)는 지원하나요?",
        a: "현재 버전은 불투명 색상(RGB, HSL)만 지원합니다. rgba() 또는 hsla()의 알파 채널 변환은 지원하지 않습니다.",
      },
      {
        q: "HSL의 색조(Hue) 값은 어떻게 이해하나요?",
        a: "색조는 색상환의 각도(0~360°)입니다. 0°/360°=빨강, 120°=초록, 240°=파랑입니다. 채도 100%는 가장 선명한 색, 0%는 회색이며, 밝기 50%가 기본 색이고 100%는 흰색, 0%는 검정입니다.",
      },
    ],
    en: [
      {
        q: "Can I enter 3-digit shorthand HEX like #FFF?",
        a: "Yes, shorthand #RGB format is supported. #FFF expands to #FFFFFF and #F53 expands to #FF5533 before conversion.",
      },
      {
        q: "Is transparency (alpha) supported?",
        a: "The current version supports opaque colors only (RGB, HSL). rgba() and hsla() alpha channel conversion is not supported.",
      },
      {
        q: "How do I read the HSL hue value?",
        a: "Hue is an angle on the color wheel (0–360°): 0°/360° = red, 120° = green, 240° = blue. Saturation 100% is the most vivid color, 0% is gray. Lightness 50% is the pure color, 100% is white, and 0% is black.",
      },
    ],
  },

  relatedTools: ["base64-encoder", "word-counter", "json-formatter"],
};
