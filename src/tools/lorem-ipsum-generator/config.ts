import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "lorem-ipsum-generator",
  category: "text",
  template: "FormToResult",
  processingType: "client",
  icon: "FileText",

  formFields: [
    {
      name: "paragraphs",
      label: "단락 수",
      type: "number",
      defaultValue: 3,
      min: 1,
      max: 20,
      step: 1,
      suffix: "단락",
    },
  ],

  resultLabels: [
    {
      key: "text",
      label: "생성된 텍스트",
    },
  ],

  seo: {
    ko: {
      title: "Lorem Ipsum 생성기 - 온라인 더미 텍스트 생성 도구",
      description:
        "Lorem Ipsum 더미 텍스트를 원하는 단락 수만큼 즉시 생성하세요. 웹 디자인, UI 목업, 인쇄물 레이아웃 작업에 필요한 자리채움 텍스트를 무료로 생성합니다.",
      keywords: [
        "Lorem Ipsum 생성기",
        "더미 텍스트 생성",
        "자리채움 텍스트",
        "placeholder 텍스트",
        "로렘 입숨",
        "더미 텍스트",
        "레이아웃 텍스트",
      ],
    },
    en: {
      title: "Lorem Ipsum Generator - Online Placeholder Text Tool",
      description:
        "Generate Lorem Ipsum placeholder text with any number of paragraphs instantly. Free online tool for web design, UI mockups, and print layout work.",
      keywords: [
        "Lorem Ipsum generator",
        "placeholder text",
        "dummy text generator",
        "filler text",
        "Lorem Ipsum text",
        "mockup text",
        "layout placeholder",
      ],
    },
  },

  howToUse: {
    ko: [
      "생성할 단락 수를 입력하세요 (1~20).",
      "'생성' 버튼을 클릭하면 Lorem Ipsum 텍스트가 생성됩니다.",
      "생성된 텍스트를 복사하여 디자인 작업에 활용하세요.",
    ],
    en: [
      "Enter the number of paragraphs you want (1-20).",
      "Click the generate button to create Lorem Ipsum text.",
      "Copy the generated text and use it in your design work.",
    ],
  },

  features: {
    ko: [
      "1~20 단락 자유롭게 생성",
      "클래식 Lorem Ipsum 텍스트 사용",
      "즉시 생성 및 복사",
      "웹 디자인 목업에 최적화",
      "브라우저에서 직접 처리 (서버 전송 없음)",
    ],
    en: [
      "Generate 1-20 paragraphs freely",
      "Uses classic Lorem Ipsum text",
      "Instant generation and copy",
      "Optimized for web design mockups",
      "Processed directly in browser (no server upload)",
    ],
  },

  useCases: {
    ko: [
      {
        title: "웹 디자인 목업",
        description:
          "실제 콘텐츠가 준비되기 전에 레이아웃과 타이포그래피를 확인하기 위한 자리채움 텍스트로 사용합니다.",
        example: {
          input: "단락 수: 2",
          output: "Lorem ipsum dolor sit amet...",
        },
      },
      {
        title: "인쇄물 레이아웃",
        description:
          "브로슈어, 포스터, 명함 등 인쇄물 디자인에서 텍스트 공간을 채우는 용도로 활용합니다.",
        example: {
          input: "단락 수: 1",
          output: "Lorem ipsum dolor sit amet...",
        },
      },
      {
        title: "개발 테스트",
        description:
          "텍스트 렌더링, 스크롤 동작, 반응형 레이아웃 테스트를 위한 더미 데이터로 활용합니다.",
        example: {
          input: "단락 수: 5",
          output: "Lorem ipsum dolor sit amet... (5단락)",
        },
      },
    ],
    en: [
      {
        title: "Web Design Mockups",
        description:
          "Use as placeholder text to check layout and typography before real content is ready.",
        example: {
          input: "Paragraphs: 2",
          output: "Lorem ipsum dolor sit amet...",
        },
      },
      {
        title: "Print Layout",
        description:
          "Fill text spaces in brochures, posters, and business card designs.",
        example: {
          input: "Paragraphs: 1",
          output: "Lorem ipsum dolor sit amet...",
        },
      },
      {
        title: "Development Testing",
        description:
          "Use as dummy data for testing text rendering, scrolling behavior, and responsive layouts.",
        example: {
          input: "Paragraphs: 5",
          output: "Lorem ipsum dolor sit amet... (5 paragraphs)",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "Lorem Ipsum이란?",
      content:
        "Lorem Ipsum은 디자인 업계에서 수백 년간 사용해 온 표준 더미 텍스트입니다. 키케로의 라틴어 텍스트 'de Finibus Bonorum et Malorum'에서 유래했으며, 1500년대부터 인쇄업자들이 레이아웃 샘플로 사용해왔습니다.\n\nLorem Ipsum을 사용하는 이유는 의미 있는 텍스트를 사용할 경우 독자가 레이아웃보다 내용에 집중하게 되기 때문입니다. Lorem Ipsum은 라틴어처럼 보이지만 의미 없는 텍스트이므로, 순수하게 시각적 레이아웃 평가에 집중할 수 있습니다.\n\n현대 웹 개발과 디자인에서 Lorem Ipsum은 와이어프레임, 프로토타입, UI 컴포넌트 스토리북 등에서 광범위하게 활용됩니다.",
    },
    en: {
      title: "What is Lorem Ipsum?",
      content:
        "Lorem Ipsum is the standard placeholder text used in the design industry for centuries. It originates from Cicero's Latin text 'de Finibus Bonorum et Malorum' and has been used by printers as layout samples since the 1500s.\n\nThe reason for using Lorem Ipsum is that meaningful text draws the reader's attention to the content rather than the layout. Lorem Ipsum looks like Latin but is nonsensical, allowing focus purely on visual layout evaluation.\n\nIn modern web development and design, Lorem Ipsum is widely used in wireframes, prototypes, and UI component storybooks.",
    },
  },

  faq: {
    ko: [
      {
        q: "Lorem Ipsum 텍스트는 실제 라틴어인가요?",
        a: "아닙니다. Lorem Ipsum은 실제 라틴어 텍스트에서 유래했지만 단어 순서가 섞여 있고 일부 단어는 임의로 변형되어 의미 없는 텍스트가 되었습니다. 의도적으로 읽을 수 없는 내용으로 만들어진 것입니다.",
      },
      {
        q: "생성된 텍스트를 상업적으로 사용해도 되나요?",
        a: "네, Lorem Ipsum 텍스트는 공개 도메인에 속하며 어떤 목적으로든 자유롭게 사용할 수 있습니다. 디자인 작업, 상업 프로젝트, 교육 자료 등 모든 용도에 사용 가능합니다.",
      },
      {
        q: "단락이 너무 짧거나 너무 길게 생성될 수 있나요?",
        a: "Lorem Ipsum 텍스트는 고정된 구조를 가지고 있어 단락 길이가 비교적 일정합니다. 이 도구는 요청한 단락 수만큼 Lorem Ipsum 단락을 순환하여 제공합니다.",
      },
    ],
    en: [
      {
        q: "Is Lorem Ipsum actual Latin?",
        a: "Not exactly. Lorem Ipsum originates from a real Latin text by Cicero, but the words have been scrambled and altered to be nonsensical. It is intentionally made unreadable.",
      },
      {
        q: "Can I use the generated text commercially?",
        a: "Yes, Lorem Ipsum text is in the public domain and can be used freely for any purpose, including commercial projects, design work, and educational materials.",
      },
      {
        q: "Can I generate very long or very short paragraphs?",
        a: "Lorem Ipsum has a fixed structure so paragraph lengths are relatively consistent. This tool cycles through standard Lorem Ipsum paragraphs based on the number you request.",
      },
    ],
  },

  relatedTools: [
    "word-counter",
    "case-converter",
    "slug-generator",
    "text-reverser",
  ],
};
