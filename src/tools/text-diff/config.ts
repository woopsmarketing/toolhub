import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "text-diff",
  category: "text",
  template: "TextToText",
  processingType: "client",
  icon: "GitCompare",

  inputConfig: {
    placeholder:
      "텍스트1\n---\n텍스트2\n\n(--- 로 두 텍스트를 구분하세요)",
    inputLabel: "비교할 텍스트",
    outputLabel: "비교 결과",
    outputType: "text",
  },

  seo: {
    ko: {
      title: "텍스트 비교 도구 - 온라인 Diff 검사기",
      description:
        "두 텍스트를 줄 단위로 비교하세요. 추가된 줄(+), 삭제된 줄(-)을 즉시 확인할 수 있는 무료 온라인 텍스트 diff 도구입니다.",
      keywords: [
        "텍스트 비교",
        "diff 도구",
        "텍스트 차이 비교",
        "온라인 diff",
        "줄 비교",
        "문자열 비교",
      ],
    },
    en: {
      title: "Text Diff Tool - Online Text Comparison",
      description:
        "Compare two texts line by line. Instantly see added (+) and removed (-) lines. Free online text diff checker.",
      keywords: [
        "text diff",
        "text comparison",
        "diff tool",
        "online diff",
        "compare text",
        "line diff",
      ],
    },
  },

  howToUse: {
    ko: [
      "입력창에 첫 번째 텍스트를 입력하세요.",
      "--- (하이픈 세 개) 구분자를 입력한 후 두 번째 텍스트를 입력하세요.",
      "비교 결과에서 (+)는 추가된 줄, (-)는 삭제된 줄, 공백은 동일한 줄을 나타냅니다.",
    ],
    en: [
      "Enter the first text in the input area.",
      "Type --- (three hyphens) as a separator, then enter the second text.",
      "In the result, (+) means added lines, (-) means removed lines, and ( ) means unchanged lines.",
    ],
  },

  features: {
    ko: [
      "줄 단위(line-by-line) 텍스트 비교",
      "추가(+), 삭제(-), 동일( ) 줄 구분 표시",
      "--- 구분자로 간편하게 두 텍스트 입력",
      "변경된 줄 수 요약 제공",
      "긴 텍스트도 빠르게 비교",
      "공백 및 빈 줄 차이도 감지",
    ],
    en: [
      "Line-by-line text comparison",
      "Clear marking of added (+), removed (-), and unchanged ( ) lines",
      "Simple --- separator to split two texts",
      "Summary of changed line count",
      "Fast comparison even for long texts",
      "Detects whitespace and empty line differences",
    ],
  },

  useCases: {
    ko: [
      {
        title: "문서 버전 비교",
        description:
          "계약서, 보고서 등의 이전 버전과 현재 버전을 비교하여 변경 사항을 파악합니다.",
        example: {
          input: "안녕하세요.\n반갑습니다.\n---\n안녕하세요.\n오랜만입니다.",
          output: "  안녕하세요.\n- 반갑습니다.\n+ 오랜만입니다.",
        },
      },
      {
        title: "코드 변경 사항 확인",
        description:
          "작은 코드 조각의 변경 전후를 빠르게 비교합니다.",
        example: {
          input: "const x = 1;\nconst y = 2;\n---\nconst x = 1;\nconst z = 3;",
          output: "  const x = 1;\n- const y = 2;\n+ const z = 3;",
        },
      },
      {
        title: "번역 텍스트 검토",
        description:
          "원문과 번역문을 줄 단위로 대조하여 누락된 부분을 확인합니다.",
        example: {
          input: "Hello\nGoodbye\n---\n안녕하세요\n잘 가요",
          output: "- Hello\n+ 안녕하세요\n- Goodbye\n+ 잘 가요",
        },
      },
    ],
    en: [
      {
        title: "Document Version Comparison",
        description:
          "Compare previous and current versions of contracts or reports to identify changes.",
        example: {
          input: "Hello.\nGoodbye.\n---\nHello.\nSee you later.",
          output: "  Hello.\n- Goodbye.\n+ See you later.",
        },
      },
      {
        title: "Code Change Review",
        description:
          "Quickly compare before and after states of small code snippets.",
        example: {
          input: "const x = 1;\nconst y = 2;\n---\nconst x = 1;\nconst z = 3;",
          output: "  const x = 1;\n- const y = 2;\n+ const z = 3;",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "텍스트 Diff란 무엇인가요?",
      content:
        "Diff(차이)는 두 텍스트 사이의 차이를 줄 단위로 표시하는 방법입니다. 소프트웨어 개발에서는 git diff처럼 코드 변경 사항을 확인하는 데 널리 사용됩니다.\n\n이 도구는 LCS(최장 공통 부분 수열) 알고리즘을 기반으로 두 텍스트를 비교합니다:\n- (+) 기호: 두 번째 텍스트에만 있는 줄 (추가된 줄)\n- (-) 기호: 첫 번째 텍스트에만 있는 줄 (삭제된 줄)\n- 공백: 두 텍스트에 모두 있는 동일한 줄\n\n계약서 검토, 코드 리뷰, 번역 대조, 문서 버전 관리 등 다양한 상황에서 활용할 수 있습니다.",
    },
    en: {
      title: "What is Text Diff?",
      content:
        "A diff shows the differences between two texts on a line-by-line basis. In software development, tools like git diff are used to review code changes.\n\nThis tool compares two texts using an LCS (Longest Common Subsequence) algorithm:\n- (+) Added lines: present only in the second text\n- (-) Removed lines: present only in the first text\n- ( ) Unchanged lines: identical in both texts\n\nUseful for document review, code comparison, translation verification, and version tracking.",
    },
  },

  faq: {
    ko: [
      {
        q: "구분자 ---는 정확히 어떻게 입력하나요?",
        a: "하이픈(-) 세 개를 한 줄에 단독으로 입력하세요. --- 앞뒤로 다른 텍스트가 없어야 합니다. 이 줄을 기준으로 위쪽이 첫 번째 텍스트, 아래쪽이 두 번째 텍스트로 처리됩니다.",
      },
      {
        q: "공백이나 빈 줄 차이도 감지되나요?",
        a: "네, 공백 차이와 빈 줄도 감지됩니다. 예를 들어 한쪽에만 빈 줄이 있으면 추가/삭제로 표시됩니다.",
      },
      {
        q: "대용량 텍스트도 비교할 수 있나요?",
        a: "브라우저에서 실행되므로 매우 긴 텍스트는 처리 속도가 느려질 수 있습니다. 수천 줄 이내의 텍스트라면 문제없이 비교할 수 있습니다.",
      },
    ],
    en: [
      {
        q: "How exactly do I enter the --- separator?",
        a: "Enter three hyphens (---) on a line by themselves, with no other text. Everything above is treated as the first text, and everything below as the second.",
      },
      {
        q: "Are whitespace and empty line differences detected?",
        a: "Yes, whitespace and empty line differences are detected. If one text has a blank line that the other doesn't, it will be shown as added or removed.",
      },
      {
        q: "Can I compare very large texts?",
        a: "Since processing runs in the browser, very large texts may be slower. Texts up to a few thousand lines work fine without issues.",
      },
    ],
  },

  relatedTools: ["word-counter", "regex-tester", "duplicate-line-remover", "json-formatter"],
};
