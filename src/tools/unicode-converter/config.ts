import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "unicode-converter",
  category: "developer",
  template: "TextToText",
  processingType: "client",
  icon: "Globe",

  inputConfig: {
    placeholder: "텍스트 또는 유니코드 이스케이프 시퀀스를 입력하세요...",
    inputLabel: "텍스트 / 유니코드 입력",
    outputLabel: "변환 결과",
    outputType: "stats",
  },

  seo: {
    ko: {
      title: "유니코드 변환기 - 텍스트 ↔ 유니코드 이스케이프",
      description:
        "텍스트를 유니코드 이스케이프 시퀀스(\\uXXXX)로 변환하거나 유니코드 이스케이프를 원문 텍스트로 변환하세요. 한글, 이모지, 특수문자의 유니코드 코드 포인트를 확인할 수 있는 무료 온라인 도구입니다.",
      keywords: [
        "유니코드 변환",
        "유니코드 이스케이프",
        "unicode escape",
        "\\uXXXX",
        "유니코드 코드포인트",
        "텍스트 유니코드 변환",
        "unicode converter",
      ],
    },
    en: {
      title: "Unicode Converter - Text ↔ Unicode Escape Sequences",
      description:
        "Convert text to Unicode escape sequences (\\uXXXX) or decode Unicode escapes back to readable text. Find Unicode code points for Korean, emoji, and special characters. Free online tool.",
      keywords: [
        "unicode converter",
        "unicode escape",
        "text to unicode",
        "unicode to text",
        "\\uXXXX converter",
        "unicode code point",
        "unicode escape sequence",
      ],
    },
  },

  howToUse: {
    ko: [
      "텍스트 또는 \\uXXXX 형식의 유니코드 이스케이프를 입력 영역에 붙여넣으세요.",
      "유니코드 이스케이프 변환 결과와 유니코드 해석 결과가 자동으로 표시됩니다.",
      "필요한 결과를 복사해서 사용하세요.",
    ],
    en: [
      "Paste your text or \\uXXXX Unicode escape sequences into the input area.",
      "The Unicode escape conversion and interpretation results are shown automatically.",
      "Copy the result you need.",
    ],
  },

  features: {
    ko: [
      "텍스트를 \\uXXXX 유니코드 이스케이프 시퀀스로 변환",
      "유니코드 이스케이프 시퀀스를 원문 텍스트로 해석",
      "변환 및 해석 결과 동시 표시",
      "한글, 이모지, CJK 문자 등 모든 유니코드 문자 지원",
      "4자리 이상의 코드 포인트(서로게이트 쌍) 처리",
      "클라이언트에서 처리되어 데이터 보안 보장",
    ],
    en: [
      "Converts text to \\uXXXX Unicode escape sequences",
      "Interprets Unicode escape sequences back to plain text",
      "Shows both conversion and interpretation results simultaneously",
      "Supports all Unicode characters: Korean, emoji, CJK, etc.",
      "Handles code points beyond U+FFFF (surrogate pairs)",
      "Processed entirely in your browser for data security",
    ],
  },

  useCases: {
    ko: [
      {
        title: "소스코드 문자열 리터럴",
        description:
          "Java, Python, JavaScript 소스코드에서 비ASCII 문자를 유니코드 이스케이프로 사용해야 할 때 변환하세요.",
        example: {
          input: "안녕",
          output: "\\uC548\\uB155",
        },
      },
      {
        title: "유니코드 코드 포인트 확인",
        description:
          "한글, 이모지, 특수문자의 유니코드 코드 포인트를 확인하여 문자 처리 로직에 활용하세요.",
        example: {
          input: "가나다",
          output: "\\uAC00\\uB098\\uB2E4",
        },
      },
      {
        title: "유니코드 이스케이프 디코딩",
        description:
          "소스코드나 로그에서 발견한 \\uXXXX 이스케이프 시퀀스를 읽기 쉬운 텍스트로 변환하세요.",
        example: {
          input: "\\uD55C\\uAD6D\\uC5B4",
          output: "한국어",
        },
      },
    ],
    en: [
      {
        title: "Source Code String Literals",
        description:
          "Convert non-ASCII characters to Unicode escapes for use in Java, Python, or JavaScript source code string literals.",
        example: {
          input: "Hello",
          output: "\\u0048\\u0065\\u006C\\u006C\\u006F",
        },
      },
      {
        title: "Decoding Unicode Escapes",
        description:
          "Convert \\uXXXX escape sequences found in source code or logs back to readable text.",
        example: {
          input: "\\u0048\\u0065\\u006C\\u006C\\u006F",
          output: "Hello",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "유니코드 이스케이프 시퀀스란?",
      content:
        "유니코드(Unicode)는 전 세계 모든 문자를 하나의 체계로 표현하기 위한 국제 표준입니다. 각 문자는 고유한 코드 포인트(U+XXXX 형식)를 가집니다.\n\n유니코드 이스케이프 시퀀스는 이 코드 포인트를 ASCII 문자만으로 표현하는 방법입니다. Java, JavaScript, Python, C# 등 대부분의 프로그래밍 언어에서 '\\uXXXX' 형식으로 사용됩니다.\n\n예를 들어 '한' 글자의 유니코드 코드 포인트는 U+D55C이므로 프로그래밍 언어에서 '\\uD55C'로 표현할 수 있습니다.\n\n이스케이프 시퀀스는 ASCII만 지원하는 시스템에서 비ASCII 문자를 안전하게 전달하거나, 소스코드의 인코딩 문제를 피하기 위해 사용됩니다.",
    },
    en: {
      title: "What are Unicode Escape Sequences?",
      content:
        "Unicode is an international standard for representing all the world's characters in a single system. Each character has a unique code point in the format U+XXXX.\n\nUnicode escape sequences express these code points using only ASCII characters. Most programming languages use the '\\uXXXX' format — Java, JavaScript, Python, C#, and more.\n\nFor example, the Korean character '한' has code point U+D55C, so it can be written as '\\uD55C' in source code.\n\nEscape sequences are used to safely transmit non-ASCII characters through ASCII-only systems, or to avoid source file encoding issues.",
    },
  },

  faq: {
    ko: [
      {
        q: "\\uXXXX와 \\UXXXXXXXX의 차이는 무엇인가요?",
        a: "\\uXXXX는 BMP(Basic Multilingual Plane, U+0000~U+FFFF) 범위의 문자를 표현하며 4자리 16진수를 사용합니다. \\UXXXXXXXX는 U+10000 이상의 보충 문자(이모지 포함)를 표현하며 8자리를 사용합니다. JavaScript는 ES6부터 \\u{XXXXX} 형식도 지원합니다.",
      },
      {
        q: "이모지도 유니코드 이스케이프로 변환할 수 있나요?",
        a: "네. 이모지는 U+1F600 이상의 보충 문자로 JavaScript에서는 서로게이트 쌍(두 개의 \\uXXXX)으로 표현됩니다. 예를 들어 😀는 \\uD83D\\uDE00으로 표현됩니다.",
      },
      {
        q: "유니코드 이스케이프는 어떤 프로그래밍 언어에서 사용하나요?",
        a: "Java, JavaScript, TypeScript, C#, Python(\\uXXXX), Go, Swift 등 대부분의 현대 프로그래밍 언어에서 지원합니다. 언어마다 형식이 약간 다를 수 있습니다.",
      },
    ],
    en: [
      {
        q: "What is the difference between \\uXXXX and \\UXXXXXXXX?",
        a: "\\uXXXX represents characters in the BMP (U+0000–U+FFFF) using 4 hex digits. \\UXXXXXXXX represents supplementary characters (including emoji) above U+10000 using 8 digits. JavaScript also supports \\u{XXXXX} format since ES6.",
      },
      {
        q: "Can emoji be converted to Unicode escapes?",
        a: "Yes. Emoji are supplementary characters above U+1F600. In JavaScript they are represented as surrogate pairs (two \\uXXXX sequences). For example, 😀 is \\uD83D\\uDE00.",
      },
    ],
  },

  relatedTools: [
    "json-formatter",
    "base64-encoder",
    "url-encoder",
    "html-entity-converter",
    "jwt-decoder",
  ],
};
