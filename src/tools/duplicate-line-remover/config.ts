import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "duplicate-line-remover",
  category: "text",
  template: "TextToText",
  processingType: "client",
  icon: "ListFilter",

  inputConfig: {
    placeholder: "중복 줄을 제거할 텍스트를 입력하거나 붙여넣으세요...",
    inputLabel: "텍스트 입력",
    outputLabel: "중복 제거 결과",
    outputType: "text",
  },

  seo: {
    ko: {
      title: "중복 줄 제거기 - 온라인 중복 라인 삭제 도구",
      description:
        "텍스트에서 중복된 줄을 즉시 제거하세요. 목록, 코드, 데이터에서 중복 항목을 빠르게 삭제하는 무료 온라인 도구입니다.",
      keywords: [
        "중복 줄 제거",
        "중복 라인 삭제",
        "중복 제거",
        "텍스트 정리",
        "중복 항목 삭제",
        "라인 중복 제거기",
      ],
    },
    en: {
      title: "Duplicate Line Remover - Online Duplicate Text Cleaner",
      description:
        "Remove duplicate lines from text instantly. Free online tool to clean up lists, code, and data by eliminating repeated entries.",
      keywords: [
        "duplicate line remover",
        "remove duplicate lines",
        "duplicate text remover",
        "unique lines",
        "deduplicate text",
        "clean duplicate lines",
      ],
    },
  },

  howToUse: {
    ko: [
      "텍스트를 입력 영역에 직접 입력하거나 붙여넣으세요.",
      "중복된 줄이 자동으로 제거되어 결과에 표시됩니다.",
      "결과를 복사하여 원하는 곳에 붙여넣으세요.",
    ],
    en: [
      "Type or paste your text into the input area.",
      "Duplicate lines are automatically removed and shown in the result.",
      "Copy the result and paste it wherever you need.",
    ],
  },

  features: {
    ko: [
      "중복 줄 자동 감지 및 제거",
      "첫 번째 등장한 줄만 유지",
      "원래 줄 순서 보존",
      "빈 줄 처리 지원",
      "대소문자 구분 중복 감지",
      "실시간 처리",
    ],
    en: [
      "Automatic duplicate line detection and removal",
      "Keeps only the first occurrence of each line",
      "Preserves original line order",
      "Handles empty lines",
      "Case-sensitive duplicate detection",
      "Real-time processing",
    ],
  },

  useCases: {
    ko: [
      {
        title: "목록 정리",
        description:
          "이메일 주소, 키워드, 상품 목록 등에서 중복 항목을 빠르게 제거합니다.",
        example: {
          input: "apple\nbanana\napple\norange\nbanana",
          output: "apple\nbanana\norange",
        },
      },
      {
        title: "로그 파일 정리",
        description:
          "반복되는 로그 메시지를 제거하여 고유한 오류나 이벤트만 확인합니다.",
        example: {
          input: "ERROR: connection failed\nINFO: server started\nERROR: connection failed",
          output: "ERROR: connection failed\nINFO: server started",
        },
      },
      {
        title: "데이터 전처리",
        description:
          "CSV나 텍스트 데이터에서 중복 행을 제거하여 데이터를 정제합니다.",
        example: {
          input: "홍길동,010-1234-5678\n김철수,010-9876-5432\n홍길동,010-1234-5678",
          output: "홍길동,010-1234-5678\n김철수,010-9876-5432",
        },
      },
    ],
    en: [
      {
        title: "List Cleanup",
        description:
          "Quickly remove duplicate entries from email lists, keyword lists, or product catalogs.",
        example: {
          input: "apple\nbanana\napple\norange\nbanana",
          output: "apple\nbanana\norange",
        },
      },
      {
        title: "Log File Deduplication",
        description:
          "Remove repeated log messages to focus on unique errors and events.",
        example: {
          input: "ERROR: connection failed\nINFO: server started\nERROR: connection failed",
          output: "ERROR: connection failed\nINFO: server started",
        },
      },
      {
        title: "Data Preprocessing",
        description:
          "Clean up CSV or plain text data by removing duplicate rows before analysis.",
        example: {
          input: "john,john@example.com\njane,jane@example.com\njohn,john@example.com",
          output: "john,john@example.com\njane,jane@example.com",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "중복 줄 제거의 활용",
      content:
        "데이터 작업을 하다 보면 중복된 항목이 자주 발생합니다. 여러 소스에서 합친 목록, 복사-붙여넣기로 생긴 중복, 로그 파일의 반복 메시지 등이 대표적인 예입니다.\n\n중복을 수동으로 찾아 제거하는 것은 시간이 많이 걸리고 오류가 발생하기 쉽습니다. 이 도구는 텍스트를 붙여넣기만 하면 순식간에 중복 줄을 제거해 줍니다.\n\n이 도구는 첫 번째로 등장한 줄을 유지하고 이후 중복을 제거하며, 원래의 줄 순서를 그대로 보존합니다.",
    },
    en: {
      title: "When to Use Duplicate Line Remover",
      content:
        "Duplicate lines appear in many everyday workflows: merging lists from multiple sources, copy-paste errors, repeated log entries, or exported data with duplicates.\n\nManually finding and removing duplicates is tedious and error-prone. This tool removes them instantly — just paste your text and get clean results.\n\nThe tool preserves the original order, keeping the first occurrence of each line and removing all subsequent duplicates.",
    },
  },

  faq: {
    ko: [
      {
        q: "대소문자를 구분해서 중복을 감지하나요?",
        a: "네, 이 도구는 대소문자를 구분합니다. 예를 들어 'Apple'과 'apple'은 다른 줄로 취급됩니다. 대소문자 구분 없이 중복을 제거하려면 먼저 대소문자 변환 도구를 사용하세요.",
      },
      {
        q: "빈 줄도 중복으로 처리되나요?",
        a: "네, 연속된 빈 줄은 하나로 합쳐집니다. 빈 줄도 하나의 줄로 취급되어 중복 감지 대상이 됩니다.",
      },
      {
        q: "처리할 수 있는 텍스트 크기에 제한이 있나요?",
        a: "브라우저 기반 도구이므로 매우 큰 파일은 처리가 느려질 수 있습니다. 일반적인 텍스트 크기(수천 줄 이내)에서는 실시간으로 처리됩니다.",
      },
    ],
    en: [
      {
        q: "Is the duplicate detection case-sensitive?",
        a: "Yes, the tool is case-sensitive. For example, 'Apple' and 'apple' are treated as different lines. To remove case-insensitive duplicates, convert the text to the same case first.",
      },
      {
        q: "Are empty lines treated as duplicates?",
        a: "Yes, consecutive empty lines are collapsed into one. An empty line counts as a line and is subject to duplicate detection.",
      },
      {
        q: "Is there a size limit for the text?",
        a: "Since this is a browser-based tool, very large files may process slowly. For typical text sizes (up to a few thousand lines), processing is real-time.",
      },
    ],
  },

  relatedTools: [
    "word-counter",
    "text-reverser",
    "case-converter",
    "slug-generator",
  ],
};
