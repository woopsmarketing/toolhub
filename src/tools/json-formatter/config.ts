import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "json-formatter",
  category: "developer",
  template: "TextToText",
  processingType: "client",
  icon: "Braces",

  inputConfig: {
    placeholder: "JSON을 붙여넣으세요...",
    inputLabel: "JSON 입력",
    outputLabel: "포맷된 JSON",
    inputType: "code",
    outputType: "code",
  },

  seo: {
    ko: {
      title: "JSON 포맷터 & 검증기",
      description:
        "JSON을 보기 좋게 들여쓰기 포맷팅하고 유효성을 검증하세요. 잘못된 JSON을 즉시 감지하고 오류 위치를 알려주는 무료 온라인 JSON 포맷터입니다.",
      keywords: [
        "JSON 포맷터",
        "JSON 정렬",
        "JSON 검증",
        "JSON 들여쓰기",
        "JSON 예쁘게",
        "JSON beautify",
        "JSON validator",
      ],
    },
    en: {
      title: "JSON Formatter & Validator",
      description:
        "Format and validate JSON instantly. Pretty-print JSON with proper indentation and catch syntax errors in real time. Free online JSON formatter.",
      keywords: [
        "JSON formatter",
        "JSON beautifier",
        "JSON validator",
        "JSON pretty print",
        "format JSON online",
        "JSON linter",
      ],
    },
  },

  howToUse: {
    ko: [
      "JSON 텍스트를 입력 영역에 붙여넣으세요.",
      "자동으로 유효성이 검사되고 보기 좋게 포맷됩니다.",
      "포맷된 JSON을 복사해서 사용하세요.",
    ],
    en: [
      "Paste your JSON text into the input area.",
      "The JSON is automatically validated and pretty-printed.",
      "Copy the formatted JSON and use it wherever you need.",
    ],
  },

  features: {
    ko: [
      "JSON 구문 유효성 실시간 검사",
      "2칸 들여쓰기로 깔끔한 포맷팅",
      "오류 발생 시 명확한 오류 메시지 표시",
      "중첩된 객체와 배열 모두 지원",
      "대용량 JSON 처리 가능",
      "클라이언트에서 처리되어 데이터 보안 보장",
    ],
    en: [
      "Real-time JSON syntax validation",
      "Clean formatting with 2-space indentation",
      "Clear error messages when JSON is invalid",
      "Supports deeply nested objects and arrays",
      "Handles large JSON payloads",
      "Processed entirely in your browser for data security",
    ],
  },

  useCases: {
    ko: [
      {
        title: "API 응답 디버깅",
        description:
          "API에서 받은 JSON 응답을 읽기 쉽게 포맷팅하여 데이터 구조를 파악하세요.",
        example: {
          input: '{"user":{"id":1,"name":"김철수","email":"kim@example.com"}}',
          output: '{\n  "user": {\n    "id": 1,\n    "name": "김철수"\n  }\n}',
        },
      },
      {
        title: "설정 파일 정리",
        description:
          "package.json, tsconfig.json 등 프로젝트 설정 파일을 정리하고 유효성을 확인하세요.",
        example: {
          input: '{"name":"my-app","version":"1.0.0","dependencies":{}}',
          output: "들여쓰기가 적용된 포맷된 JSON",
        },
      },
      {
        title: "JSON 오류 수정",
        description:
          "잘못된 JSON을 붙여넣으면 어떤 부분이 잘못되었는지 오류 메시지로 확인할 수 있습니다.",
        example: {
          input: "{'key': 'value'}",
          output: "오류: 올바르지 않은 JSON 형식",
        },
      },
    ],
    en: [
      {
        title: "API Response Debugging",
        description:
          "Format API JSON responses to easily understand the data structure.",
        example: {
          input: '{"user":{"id":1,"name":"John","email":"john@example.com"}}',
          output: "Nicely indented, readable JSON output",
        },
      },
      {
        title: "Config File Cleanup",
        description:
          "Tidy up package.json, tsconfig.json, and other project config files.",
        example: {
          input: '{"name":"my-app","version":"1.0.0"}',
          output: "Formatted JSON with proper indentation",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "JSON 포맷팅이 필요한 이유",
      content:
        "JSON(JavaScript Object Notation)은 데이터 교환에 가장 널리 사용되는 형식입니다. API 응답, 설정 파일, 데이터베이스 내보내기 등 어디서나 사용됩니다.\n\n그러나 실제 환경에서 JSON은 공백 없이 한 줄로 압축된 형태로 전송되는 경우가 많습니다. 이런 JSON은 사람이 읽기 매우 어렵습니다.\n\nJSON 포맷터는 이런 압축된 JSON을 들여쓰기와 줄바꿈을 추가해 사람이 읽기 좋은 형태로 변환합니다. 또한 JSON 구문 오류를 즉시 감지하여 디버깅 시간을 줄여줍니다.",
    },
    en: {
      title: "Why JSON Formatting Matters",
      content:
        "JSON (JavaScript Object Notation) is the most widely used data exchange format. It appears in API responses, config files, database exports, and more.\n\nIn production, JSON is often transmitted as a single compressed line with no whitespace, making it extremely hard to read.\n\nA JSON formatter transforms this compressed JSON into a human-readable form with proper indentation and line breaks. It also instantly detects syntax errors, saving valuable debugging time.",
    },
  },

  faq: {
    ko: [
      {
        q: "JSON 포맷팅과 JSON 검증의 차이는 무엇인가요?",
        a: "JSON 포맷팅은 유효한 JSON을 읽기 쉽게 들여쓰기 형태로 변환하는 것입니다. JSON 검증은 입력된 텍스트가 올바른 JSON 구문을 따르는지 확인하는 것입니다. 이 도구는 두 가지를 모두 수행합니다.",
      },
      {
        q: "큰 JSON 파일도 처리할 수 있나요?",
        a: "네, 브라우저 메모리 내에서 처리되므로 수 MB 크기의 JSON도 처리할 수 있습니다. 다만 매우 큰 파일(10MB 이상)은 브라우저 성능에 따라 느려질 수 있습니다.",
      },
      {
        q: "입력한 JSON 데이터는 서버에 저장되나요?",
        a: "아니요. 모든 처리는 브라우저 내에서 이루어지며 서버로 전송되지 않습니다. 민감한 데이터도 안전하게 사용할 수 있습니다.",
      },
    ],
    en: [
      {
        q: "What is the difference between JSON formatting and JSON validation?",
        a: "JSON formatting transforms valid JSON into a readable, indented form. JSON validation checks whether the input text follows correct JSON syntax. This tool does both simultaneously.",
      },
      {
        q: "Can it handle large JSON files?",
        a: "Yes. Processing happens in your browser memory, so files of several MB are fine. Very large files (10MB+) may be slow depending on your device.",
      },
      {
        q: "Is my JSON data sent to a server?",
        a: "No. All processing is done locally in your browser. Nothing is sent to any server, so sensitive data is safe.",
      },
    ],
  },

  relatedTools: [
    "base64-encoder",
    "url-encoder",
    "html-entity-converter",
    "jwt-decoder",
    "unicode-converter",
  ],
};
