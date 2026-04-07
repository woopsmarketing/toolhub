import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "text-reverser",
  category: "text",
  template: "TextToText",
  processingType: "client",
  icon: "Repeat",

  inputConfig: {
    placeholder: "뒤집을 텍스트를 입력하거나 붙여넣으세요...",
    inputLabel: "텍스트 입력",
    outputLabel: "뒤집기 결과",
    outputType: "text",
  },

  seo: {
    ko: {
      title: "텍스트 뒤집기 - 온라인 문자열 역순 변환기",
      description:
        "텍스트를 거꾸로 뒤집어 보세요. 문자열 전체 역순, 줄별 역순을 즉시 변환하는 무료 온라인 텍스트 뒤집기 도구입니다.",
      keywords: [
        "텍스트 뒤집기",
        "문자열 역순",
        "글자 거꾸로",
        "텍스트 반전",
        "문자열 뒤집기",
        "reverse text",
      ],
    },
    en: {
      title: "Text Reverser - Online String Reversal Tool",
      description:
        "Reverse any text instantly. Free online tool to flip text backwards, reverse character order, or reverse line order.",
      keywords: [
        "text reverser",
        "reverse text",
        "flip text",
        "mirror text",
        "string reversal",
        "backwards text",
        "reverse string online",
      ],
    },
  },

  howToUse: {
    ko: [
      "뒤집고 싶은 텍스트를 입력 영역에 입력하거나 붙여넣으세요.",
      "텍스트 전체가 자동으로 역순으로 변환됩니다.",
      "결과를 복사하여 원하는 곳에 사용하세요.",
    ],
    en: [
      "Type or paste the text you want to reverse into the input area.",
      "The entire text is automatically reversed character by character.",
      "Copy the result and use it wherever you need.",
    ],
  },

  features: {
    ko: [
      "전체 텍스트 문자 단위 역순 변환",
      "한글, 영어, 특수문자 모두 지원",
      "줄바꿈 포함 전체 역순 처리",
      "실시간 변환",
      "원본 텍스트 보존",
    ],
    en: [
      "Full character-by-character text reversal",
      "Supports Korean, English, and special characters",
      "Reversal includes line breaks",
      "Real-time conversion",
      "Original text preserved",
    ],
  },

  useCases: {
    ko: [
      {
        title: "재미있는 메시지 만들기",
        description:
          "친구에게 거꾸로 쓴 메시지를 보내거나, 숨겨진 메시지를 만들 때 사용합니다.",
        example: {
          input: "안녕하세요",
          output: "요세하녕안",
        },
      },
      {
        title: "팰린드롬 확인",
        description:
          "텍스트를 뒤집어서 원본과 비교하면 팰린드롬(앞뒤가 같은 단어) 여부를 확인할 수 있습니다.",
        example: {
          input: "racecar",
          output: "racecar (팰린드롬!)",
        },
      },
      {
        title: "암호화 학습",
        description:
          "간단한 암호화 기법의 예시로 텍스트 역순 변환을 활용합니다.",
        example: {
          input: "hello world",
          output: "dlrow olleh",
        },
      },
    ],
    en: [
      {
        title: "Fun Messages",
        description:
          "Create reversed messages for fun, puzzles, or hidden messages to share with friends.",
        example: {
          input: "hello world",
          output: "dlrow olleh",
        },
      },
      {
        title: "Palindrome Check",
        description:
          "Reverse text and compare with the original to check if a word or phrase is a palindrome.",
        example: {
          input: "racecar",
          output: "racecar (palindrome!)",
        },
      },
      {
        title: "Simple Encryption Learning",
        description:
          "Use text reversal as a simple demonstration of basic encryption concepts.",
        example: {
          input: "secret message",
          output: "egassem terces",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "텍스트 뒤집기의 다양한 활용",
      content:
        "텍스트를 거꾸로 뒤집는 것은 간단해 보이지만 여러 용도로 활용됩니다. 팰린드롬(앞뒤가 동일한 단어나 문장) 확인, 암호화 학습, 창의적인 디자인 작업 등에 사용됩니다.\n\n거울에 비친 글자처럼 텍스트를 반전시키면 특별한 시각적 효과를 줄 수 있습니다. 소셜 미디어에서 독특한 게시물을 만들거나 퍼즐 제작에 활용할 수 있습니다.\n\n한글, 영어, 숫자, 특수문자를 포함한 모든 문자를 지원하며 실시간으로 처리됩니다.",
    },
    en: {
      title: "Creative Uses for Text Reversal",
      content:
        "Reversing text has more uses than you might think. It's used to check palindromes, create puzzles, demonstrate simple encryption concepts, and produce unique visual effects.\n\nMirrored text can make social media posts stand out, and reversed messages can be used as a simple hide-in-plain-sight trick.\n\nThis tool supports all languages and characters and processes text in real time.",
    },
  },

  faq: {
    ko: [
      {
        q: "줄별로 역순 변환도 가능한가요?",
        a: "현재 이 도구는 전체 텍스트를 문자 단위로 역순 변환합니다. 줄별 역순이 필요하다면 각 줄을 개별적으로 붙여넣어 처리하세요.",
      },
      {
        q: "한글 텍스트도 올바르게 뒤집히나요?",
        a: "네, 한글을 포함한 모든 유니코드 문자를 정확하게 처리합니다. 한글의 경우 각 글자(자모 조합 완성형)가 하나의 단위로 처리됩니다.",
      },
      {
        q: "이모지도 뒤집을 수 있나요?",
        a: "이모지는 복잡한 유니코드 구조로 인해 뒤집힐 때 깨질 수 있습니다. 이모지가 포함된 텍스트는 예상치 못한 결과가 나올 수 있습니다.",
      },
    ],
    en: [
      {
        q: "Can I reverse text line by line?",
        a: "This tool reverses the entire text character by character. For line-by-line reversal, paste each line separately.",
      },
      {
        q: "Does it work correctly with non-Latin characters?",
        a: "Yes, all Unicode characters including Korean, Chinese, Arabic, and others are handled correctly.",
      },
      {
        q: "Can emojis be reversed?",
        a: "Emojis have complex Unicode structures and may not reverse correctly. Text containing emojis may produce unexpected results.",
      },
    ],
  },

  relatedTools: [
    "word-counter",
    "case-converter",
    "duplicate-line-remover",
    "slug-generator",
  ],
};
