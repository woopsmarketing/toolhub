import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "url-encoder",
  category: "developer",
  template: "TextToText",
  processingType: "client",
  icon: "Link",

  inputConfig: {
    placeholder: "인코딩하거나 디코딩할 URL 또는 텍스트를 입력하세요...",
    inputLabel: "URL / 텍스트 입력",
    outputLabel: "변환 결과",
    outputType: "stats",
  },

  seo: {
    ko: {
      title: "URL 인코더 & 디코더",
      description:
        "URL을 퍼센트 인코딩(%XX)으로 변환하거나 인코딩된 URL을 원문으로 디코딩하세요. 한글, 특수문자 등을 URL에 안전하게 사용할 수 있는 무료 온라인 URL 인코더입니다.",
      keywords: [
        "URL 인코딩",
        "URL 디코딩",
        "퍼센트 인코딩",
        "URL encode",
        "URL decode",
        "encodeURIComponent",
        "URL 변환",
      ],
    },
    en: {
      title: "URL Encoder & Decoder",
      description:
        "Encode URLs with percent-encoding (%XX) or decode encoded URLs back to plain text. Safely use Korean, special characters, and spaces in URLs. Free online tool.",
      keywords: [
        "URL encoder",
        "URL decoder",
        "percent encoding",
        "URL encode online",
        "URL decode online",
        "encodeURIComponent",
        "URI encoding",
      ],
    },
  },

  howToUse: {
    ko: [
      "URL 또는 인코딩할 텍스트를 입력 영역에 붙여넣으세요.",
      "인코딩 결과(%XX 형식)와 디코딩 결과가 자동으로 표시됩니다.",
      "필요한 결과를 복사해서 사용하세요.",
    ],
    en: [
      "Paste the URL or text you want to encode into the input area.",
      "The percent-encoded result and decoded result are shown automatically.",
      "Copy the result you need.",
    ],
  },

  features: {
    ko: [
      "encodeURIComponent 방식의 퍼센트 인코딩",
      "decodeURIComponent 방식의 URL 디코딩",
      "인코딩과 디코딩 결과 동시 표시",
      "한글, 일본어 등 멀티바이트 문자 완벽 지원",
      "공백, 특수문자 안전하게 인코딩",
      "클라이언트에서 처리되어 데이터 보안 보장",
    ],
    en: [
      "Percent encoding using encodeURIComponent",
      "URL decoding using decodeURIComponent",
      "Shows both encode and decode results simultaneously",
      "Full multibyte character support (Korean, Japanese, etc.)",
      "Safely encodes spaces and special characters",
      "Processed entirely in your browser for data security",
    ],
  },

  useCases: {
    ko: [
      {
        title: "쿼리 파라미터 인코딩",
        description:
          "URL 쿼리스트링에 한글이나 특수문자를 포함해야 할 때 퍼센트 인코딩을 사용하세요.",
        example: {
          input: "검색어=안녕 세상",
          output: "%EA%B2%80%EC%83%89%EC%96%B4%3D%EC%95%88%EB%85%95%20%EC%84%B8%EC%83%81",
        },
      },
      {
        title: "API 요청 파라미터",
        description:
          "REST API 호출 시 URL에 포함되는 파라미터 값을 안전하게 인코딩하세요.",
        example: {
          input: "name=John Doe&city=New York",
          output: "name%3DJohn%20Doe%26city%3DNew%20York",
        },
      },
      {
        title: "인코딩된 URL 해독",
        description:
          "브라우저 주소창이나 로그에서 복잡하게 인코딩된 URL을 읽기 쉽게 디코딩하세요.",
        example: {
          input: "%ED%95%9C%EA%B5%AD%EC%96%B4",
          output: "한국어",
        },
      },
    ],
    en: [
      {
        title: "Query Parameter Encoding",
        description:
          "Encode Korean characters or special characters for use in URL query strings.",
        example: {
          input: "search=hello world",
          output: "search%3Dhello%20world",
        },
      },
      {
        title: "Decoding Encoded URLs",
        description:
          "Decode complex percent-encoded URLs from browser address bars or logs for easy reading.",
        example: {
          input: "hello%20world%21",
          output: "hello world!",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "URL 인코딩이란?",
      content:
        "URL은 ASCII 문자만 사용할 수 있도록 설계되어 있습니다. 한글, 일본어, 공백, 특수문자 등을 URL에 포함하려면 퍼센트 인코딩(Percent-encoding)이 필요합니다.\n\n퍼센트 인코딩은 각 문자를 UTF-8로 변환한 뒤 각 바이트를 '%XX' 형식으로 표현합니다. 예를 들어 '가'는 '%EA%B0%80'로 인코딩됩니다.\n\nJavaScript의 encodeURIComponent()는 URL 쿼리 파라미터 값을 인코딩하는 데 적합하며, ':', '/', '?', '#', '[', ']', '@' 등 URL 구조에 영향을 주는 문자도 인코딩합니다.",
    },
    en: {
      title: "What is URL Encoding?",
      content:
        "URLs can only contain ASCII characters by design. To include Korean, Japanese, spaces, or special characters in a URL, percent-encoding is required.\n\nPercent-encoding converts each character to its UTF-8 bytes, then represents each byte as '%XX'. For example, a space becomes '%20'.\n\nJavaScript's encodeURIComponent() is ideal for encoding query parameter values — it encodes characters like ':', '/', '?', '#' that affect URL structure.",
    },
  },

  faq: {
    ko: [
      {
        q: "encodeURI와 encodeURIComponent의 차이는 무엇인가요?",
        a: "encodeURI는 URL 전체를 인코딩하며 ':', '/', '?', '#' 같은 URL 구조 문자는 인코딩하지 않습니다. encodeURIComponent는 쿼리 파라미터 값 등 URL의 일부를 인코딩할 때 사용하며 이런 특수문자도 인코딩합니다. 이 도구는 encodeURIComponent를 사용합니다.",
      },
      {
        q: "공백은 '%20'과 '+'중 어느 것으로 인코딩되나요?",
        a: "encodeURIComponent는 공백을 '%20'으로 인코딩합니다. 일부 오래된 시스템에서는 HTML 폼 데이터 전송 시 공백을 '+'로 인코딩하기도 합니다. 현대 웹에서는 '%20'을 권장합니다.",
      },
      {
        q: "URL 인코딩이 필요한 특수문자에는 어떤 것이 있나요?",
        a: "공백, 한글, 일본어, 중국어 등 비ASCII 문자와 !, @, #, $, %, ^, &, *, (, ), +, =, [, ], {, }, |, \\, :, ;, ', \", <, >, ,, ?, / 등의 특수문자는 URL에서 인코딩이 필요합니다.",
      },
    ],
    en: [
      {
        q: "What is the difference between encodeURI and encodeURIComponent?",
        a: "encodeURI encodes a full URL and does not encode structural characters like ':', '/', '?', '#'. encodeURIComponent encodes URL components like query parameter values and does encode those characters. This tool uses encodeURIComponent.",
      },
      {
        q: "Is a space encoded as '%20' or '+'?",
        a: "encodeURIComponent encodes spaces as '%20'. Some older systems encode spaces as '+' in HTML form submissions. The modern web standard recommends '%20'.",
      },
    ],
  },

  relatedTools: [
    "json-formatter",
    "base64-encoder",
    "html-entity-converter",
    "jwt-decoder",
    "unicode-converter",
  ],
};
