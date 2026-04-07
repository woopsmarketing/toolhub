import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "regex-tester",
  category: "developer",
  template: "TextToText",
  processingType: "client",
  icon: "Regex",

  inputConfig: {
    placeholder:
      "정규식/테스트 문자열 형식:\n첫 줄: 정규식 패턴\n나머지: 테스트할 텍스트",
    inputLabel: "정규식 입력",
    outputLabel: "매칭 결과",
    outputType: "text",
  },

  seo: {
    ko: {
      title: "정규식 테스터 - 온라인 Regex 검사 도구",
      description:
        "정규식 패턴을 실시간으로 테스트하세요. 매칭 위치와 캡처 그룹을 즉시 확인할 수 있는 무료 온라인 정규표현식 테스터입니다.",
      keywords: [
        "정규식 테스터",
        "정규표현식 테스트",
        "regex 테스터",
        "정규식 검사",
        "regex online",
        "정규표현식 온라인",
      ],
    },
    en: {
      title: "Regex Tester - Online Regular Expression Tool",
      description:
        "Test regular expression patterns in real time. Find all matches with positions instantly. Free online regex tester.",
      keywords: [
        "regex tester",
        "regular expression tester",
        "online regex",
        "regex checker",
        "regex tool",
        "pattern matching",
      ],
    },
  },

  howToUse: {
    ko: [
      "첫 번째 줄에 정규식 패턴을 입력하세요 (예: \\d+, [a-z]+, ^hello).",
      "두 번째 줄부터 테스트할 텍스트를 입력하세요.",
      "매칭된 결과, 위치, 개수가 즉시 표시됩니다.",
    ],
    en: [
      "Enter your regex pattern on the first line (e.g., \\d+, [a-z]+, ^hello).",
      "Enter the text to test starting from the second line.",
      "Matched results, positions, and counts are displayed instantly.",
    ],
  },

  features: {
    ko: [
      "전역 플래그(g)로 모든 매칭 결과 탐색",
      "매칭 위치(인덱스) 표시",
      "총 매칭 개수 요약",
      "잘못된 정규식 패턴 오류 안내",
      "여러 줄 텍스트 지원",
      "캡처 그룹 결과 표시",
    ],
    en: [
      "Find all matches using global flag (g)",
      "Display match positions (index)",
      "Total match count summary",
      "Clear error messages for invalid patterns",
      "Multi-line text support",
      "Capture group results displayed",
    ],
  },

  useCases: {
    ko: [
      {
        title: "이메일 유효성 검사",
        description:
          "이메일 형식 정규식이 올바르게 동작하는지 테스트합니다.",
        example: {
          input: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\nuser@example.com\ninvalid-email",
          output: "매칭 1건: user@example.com (0번 위치)",
        },
      },
      {
        title: "숫자 추출",
        description: "텍스트에서 모든 숫자를 추출합니다.",
        example: {
          input: "\\d+\n주문번호 12345, 총 금액 50000원",
          output: "매칭 2건: 12345 (5번), 50000 (15번)",
        },
      },
      {
        title: "URL 패턴 검사",
        description: "문자열에서 URL 패턴이 포함되어 있는지 확인합니다.",
        example: {
          input: "https?://[\\w./-]+\nhttps://example.com/path",
          output: "매칭 1건: https://example.com/path",
        },
      },
    ],
    en: [
      {
        title: "Email Validation",
        description: "Test whether an email regex pattern works correctly.",
        example: {
          input: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\nuser@example.com\ninvalid-email",
          output: "1 match: user@example.com (position 0)",
        },
      },
      {
        title: "Number Extraction",
        description: "Extract all numbers from a text string.",
        example: {
          input: "\\d+\nOrder #12345, total $500",
          output: "2 matches: 12345 (pos 8), 500 (pos 22)",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "정규표현식 기초 가이드",
      content:
        "정규표현식(Regular Expression, Regex)은 문자열의 패턴을 정의하는 강력한 도구입니다.\n\n주요 문자 클래스: \\d(숫자), \\w(단어 문자), \\s(공백), .(모든 문자)\n수량자: *(0회 이상), +(1회 이상), ?(0 또는 1회), {n,m}(n~m회)\n앵커: ^(시작), $(끝)\n그룹: (abc)(캡처 그룹), [abc](문자 집합), [^abc](부정)\n\n이 도구에서는 첫 줄에 패턴을 입력하면 자동으로 전역 플래그(g)와 다중행 플래그(m)가 적용되어 모든 매칭을 찾습니다.",
    },
    en: {
      title: "Regular Expression Basics Guide",
      content:
        "Regular expressions (Regex) are a powerful tool for defining string patterns.\n\nCharacter classes: \\d (digit), \\w (word char), \\s (whitespace), . (any char)\nQuantifiers: * (0+), + (1+), ? (0 or 1), {n,m} (n to m times)\nAnchors: ^ (start), $ (end)\nGroups: (abc) capture group, [abc] character set, [^abc] negation\n\nThis tool automatically applies the global (g) and multiline (m) flags to find all matches in the input text.",
    },
  },

  faq: {
    ko: [
      {
        q: "플래그(flag)는 어떻게 지정하나요?",
        a: "현재 이 도구는 자동으로 전역(g)과 다중행(m) 플래그를 적용합니다. 대소문자 무시(i) 등 추가 플래그는 패턴 앞에 별도로 명시할 필요 없이 기본 제공됩니다.",
      },
      {
        q: "백슬래시(\\)는 어떻게 입력하나요?",
        a: "입력창에 직접 \\d, \\w 등을 입력하면 됩니다. 이 도구는 입력된 텍스트를 정규식 패턴으로 직접 해석합니다.",
      },
      {
        q: "정규식 오류가 발생하면 어떻게 되나요?",
        a: "잘못된 패턴을 입력하면 결과 영역에 오류 메시지가 표시됩니다. 괄호 누락, 잘못된 수량자 등 문법 오류를 확인하세요.",
      },
    ],
    en: [
      {
        q: "How do I specify regex flags?",
        a: "This tool automatically applies the global (g) and multiline (m) flags to find all matches. No need to specify flags manually.",
      },
      {
        q: "How do I enter backslash patterns like \\d?",
        a: "Just type \\d, \\w, etc. directly in the input field. The tool interprets your first line as a raw regex pattern.",
      },
      {
        q: "What happens if my regex pattern is invalid?",
        a: "If you enter an invalid pattern, an error message is displayed in the result area. Check for missing brackets, invalid quantifiers, or other syntax errors.",
      },
    ],
  },

  relatedTools: ["text-diff", "json-formatter", "word-counter", "base64-encoder"],
};
