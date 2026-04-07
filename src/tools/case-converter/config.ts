import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "case-converter",
  category: "text",
  template: "TextToText",
  processingType: "client",
  icon: "CaseSensitive",

  inputConfig: {
    placeholder: "여기에 텍스트를 입력하거나 붙여넣으세요...",
    inputLabel: "텍스트 입력",
    outputLabel: "변환 결과",
    outputType: "stats",
  },

  seo: {
    ko: {
      title: "대소문자 변환기 - 온라인 케이스 컨버터",
      description:
        "텍스트를 대문자, 소문자, 첫글자 대문자, camelCase, snake_case, kebab-case로 즉시 변환하세요. 무료 온라인 대소문자 변환 도구입니다.",
      keywords: [
        "대소문자 변환",
        "케이스 변환",
        "camelCase",
        "snake_case",
        "kebab-case",
        "텍스트 변환기",
        "대문자 변환",
        "소문자 변환",
      ],
    },
    en: {
      title: "Case Converter - Online Text Case Changer",
      description:
        "Convert text to uppercase, lowercase, title case, camelCase, snake_case, and kebab-case instantly. Free online case converter tool.",
      keywords: [
        "case converter",
        "text case changer",
        "uppercase converter",
        "lowercase converter",
        "camelCase converter",
        "snake_case converter",
        "kebab-case converter",
        "title case",
      ],
    },
  },

  howToUse: {
    ko: [
      "텍스트를 입력 영역에 직접 입력하거나 붙여넣으세요.",
      "입력과 동시에 6가지 케이스로 자동 변환됩니다.",
      "원하는 변환 결과를 복사해서 사용하세요.",
    ],
    en: [
      "Type or paste your text into the input area.",
      "The text is instantly converted into 6 different cases.",
      "Copy the desired conversion result and use it.",
    ],
  },

  features: {
    ko: [
      "대문자(UPPERCASE) 변환",
      "소문자(lowercase) 변환",
      "첫글자 대문자(Title Case) 변환",
      "camelCase 변환 (프로그래밍용)",
      "snake_case 변환 (프로그래밍용)",
      "kebab-case 변환 (URL/CSS용)",
    ],
    en: [
      "UPPERCASE conversion",
      "lowercase conversion",
      "Title Case conversion",
      "camelCase conversion (for programming)",
      "snake_case conversion (for programming)",
      "kebab-case conversion (for URLs/CSS)",
    ],
  },

  useCases: {
    ko: [
      {
        title: "변수명 작성",
        description:
          "프로그래밍할 때 변수명을 camelCase나 snake_case로 빠르게 변환할 수 있습니다.",
        example: {
          input: "user full name",
          output: "camelCase: userFullName / snake_case: user_full_name",
        },
      },
      {
        title: "URL 슬러그 생성",
        description:
          "블로그 포스트 제목을 URL에 적합한 kebab-case로 변환합니다.",
        example: {
          input: "My Blog Post Title",
          output: "kebab-case: my-blog-post-title",
        },
      },
      {
        title: "제목 형식 통일",
        description:
          "문서나 프레젠테이션에서 제목의 대소문자 형식을 일관되게 맞출 수 있습니다.",
        example: {
          input: "hello world from korea",
          output: "Title Case: Hello World From Korea",
        },
      },
    ],
    en: [
      {
        title: "Variable Naming",
        description:
          "Quickly convert text to camelCase or snake_case when writing variable names in code.",
        example: {
          input: "user full name",
          output: "camelCase: userFullName / snake_case: user_full_name",
        },
      },
      {
        title: "URL Slug Creation",
        description:
          "Convert blog post titles to URL-friendly kebab-case format.",
        example: {
          input: "My Blog Post Title",
          output: "kebab-case: my-blog-post-title",
        },
      },
      {
        title: "Document Formatting",
        description:
          "Ensure consistent capitalization in documents and presentations.",
        example: {
          input: "hello world from korea",
          output: "Title Case: Hello World From Korea",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "케이스 변환이 필요한 이유",
      content:
        "프로그래밍에서 변수명, 함수명, 클래스명 등에 따라 사용하는 케이스가 다릅니다. JavaScript에서는 변수와 함수에 camelCase를, Python에서는 snake_case를, CSS 클래스명에는 kebab-case를 주로 사용합니다.\n\n문서 작성에서도 제목(Title Case)과 본문(sentence case)의 대소문자 규칙이 다릅니다. 영문 제목에서는 주요 단어의 첫 글자를 대문자로 쓰는 Title Case를 사용하는 것이 일반적입니다.\n\n이 도구를 사용하면 6가지 형식으로 동시에 변환 결과를 확인할 수 있어 상황에 맞는 케이스를 빠르게 선택할 수 있습니다.",
    },
    en: {
      title: "Why Case Conversion Matters",
      content:
        "Different programming languages and contexts require different text cases. JavaScript uses camelCase for variables and functions, Python uses snake_case, and CSS class names typically use kebab-case.\n\nIn document writing, titles use Title Case while body text uses sentence case. Consistent capitalization improves readability and professionalism.\n\nThis tool converts your text into all 6 common formats simultaneously, so you can instantly pick the right case for your context.",
    },
  },

  faq: {
    ko: [
      {
        q: "한글 텍스트도 변환되나요?",
        a: "한글은 대소문자 구분이 없어 대문자/소문자/Title Case 변환은 효과가 없습니다. camelCase, snake_case, kebab-case 변환 시 한글은 그대로 유지되며, 단어 구분은 공백을 기준으로 합니다.",
      },
      {
        q: "camelCase와 PascalCase의 차이는 무엇인가요?",
        a: "camelCase는 첫 단어를 소문자로 시작하고 이후 단어의 첫 글자를 대문자로 씁니다 (예: myVariableName). PascalCase는 모든 단어의 첫 글자를 대문자로 씁니다 (예: MyVariableName). 이 도구는 camelCase를 지원합니다.",
      },
      {
        q: "특수문자가 포함된 텍스트도 변환되나요?",
        a: "네, 특수문자가 포함된 텍스트도 변환됩니다. camelCase, snake_case, kebab-case 변환 시 특수문자는 단어 구분자로 처리되거나 제거됩니다.",
      },
    ],
    en: [
      {
        q: "Does it work with non-English text?",
        a: "Non-English characters are preserved as-is during conversion. For camelCase, snake_case, and kebab-case, word boundaries are determined by spaces and special characters.",
      },
      {
        q: "What is the difference between camelCase and PascalCase?",
        a: "camelCase starts with a lowercase letter (e.g., myVariableName) while PascalCase capitalizes every word (e.g., MyVariableName). This tool converts to camelCase.",
      },
      {
        q: "How are special characters handled?",
        a: "Special characters are treated as word separators for camelCase, snake_case, and kebab-case conversions, and are removed from the output.",
      },
    ],
  },

  relatedTools: [
    "word-counter",
    "text-reverser",
    "slug-generator",
    "duplicate-line-remover",
  ],
};
