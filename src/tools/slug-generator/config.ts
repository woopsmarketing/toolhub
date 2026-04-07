import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "slug-generator",
  category: "text",
  template: "TextToText",
  processingType: "client",
  icon: "Link",

  inputConfig: {
    placeholder: "슬러그로 변환할 텍스트를 입력하거나 붙여넣으세요...",
    inputLabel: "텍스트 입력",
    outputLabel: "생성된 슬러그",
    outputType: "text",
  },

  seo: {
    ko: {
      title: "URL 슬러그 생성기 - 온라인 슬러그 변환 도구",
      description:
        "텍스트를 URL 친화적인 슬러그로 즉시 변환하세요. 공백을 하이픈으로, 특수문자 제거, 소문자 변환을 자동으로 처리하는 무료 온라인 슬러그 생성기입니다.",
      keywords: [
        "URL 슬러그 생성기",
        "슬러그 변환",
        "URL 생성기",
        "permalink 생성",
        "SEO 슬러그",
        "URL 최적화",
        "kebab-case 변환",
      ],
    },
    en: {
      title: "URL Slug Generator - Online Slug Creator Tool",
      description:
        "Convert any text to a URL-friendly slug instantly. Automatically replaces spaces with hyphens, removes special characters, and lowercases text. Free online slug generator.",
      keywords: [
        "URL slug generator",
        "slug creator",
        "URL slug",
        "permalink generator",
        "SEO slug",
        "URL optimizer",
        "convert to slug",
      ],
    },
  },

  howToUse: {
    ko: [
      "슬러그로 변환할 텍스트(예: 블로그 제목)를 입력하거나 붙여넣으세요.",
      "URL 친화적인 슬러그가 자동으로 생성됩니다.",
      "생성된 슬러그를 복사해서 URL, 파일명 등에 사용하세요.",
    ],
    en: [
      "Enter or paste the text (e.g., blog post title) to convert to a slug.",
      "A URL-friendly slug is automatically generated.",
      "Copy the slug and use it in URLs, file names, and more.",
    ],
  },

  features: {
    ko: [
      "공백을 하이픈(-)으로 자동 변환",
      "영문 대문자를 소문자로 변환",
      "URL에 안전하지 않은 특수문자 제거",
      "연속된 하이픈 정리",
      "앞뒤 하이픈 제거",
      "한글 포함 텍스트 지원",
    ],
    en: [
      "Automatically replaces spaces with hyphens",
      "Converts uppercase to lowercase",
      "Removes URL-unsafe special characters",
      "Collapses consecutive hyphens",
      "Trims leading and trailing hyphens",
      "Supports text with Korean characters",
    ],
  },

  useCases: {
    ko: [
      {
        title: "블로그 포스트 URL",
        description:
          "블로그 글 제목을 SEO 친화적인 URL 슬러그로 변환합니다.",
        example: {
          input: "2024년 최고의 웹 개발 트렌드 10가지",
          output: "2024년-최고의-웹-개발-트렌드-10가지",
        },
      },
      {
        title: "파일명 생성",
        description:
          "공백과 특수문자 없이 안전한 파일명을 만들 수 있습니다.",
        example: {
          input: "My Project Report (Final Version)",
          output: "my-project-report-final-version",
        },
      },
      {
        title: "CSS 클래스명",
        description:
          "텍스트에서 CSS 클래스명이나 ID로 사용할 수 있는 슬러그를 생성합니다.",
        example: {
          input: "Hero Section Title",
          output: "hero-section-title",
        },
      },
      {
        title: "API 엔드포인트",
        description:
          "RESTful API 엔드포인트 경로를 일관된 형식으로 생성합니다.",
        example: {
          input: "User Profile Settings",
          output: "user-profile-settings",
        },
      },
    ],
    en: [
      {
        title: "Blog Post URLs",
        description:
          "Convert blog post titles into SEO-friendly URL slugs.",
        example: {
          input: "Top 10 Web Development Trends in 2024",
          output: "top-10-web-development-trends-in-2024",
        },
      },
      {
        title: "File Name Generation",
        description:
          "Create safe file names without spaces or special characters.",
        example: {
          input: "My Project Report (Final Version)",
          output: "my-project-report-final-version",
        },
      },
      {
        title: "CSS Class Names",
        description:
          "Generate valid CSS class names or IDs from descriptive text.",
        example: {
          input: "Hero Section Title",
          output: "hero-section-title",
        },
      },
      {
        title: "API Endpoints",
        description:
          "Generate consistent RESTful API endpoint paths from resource names.",
        example: {
          input: "User Profile Settings",
          output: "user-profile-settings",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "좋은 URL 슬러그 만들기",
      content:
        "URL 슬러그는 웹 페이지 주소의 일부로, 페이지 내용을 설명하는 사람이 읽을 수 있는 부분입니다. 예를 들어 'https://example.com/blog/my-first-post'에서 'my-first-post'가 슬러그입니다.\n\n좋은 슬러그는 짧고 명확하며, 소문자만 사용하고, 공백 대신 하이픈을 사용합니다. 특수문자와 인코딩이 필요한 문자는 제거하거나 대체합니다.\n\nSEO 관점에서 슬러그에 키워드를 포함시키는 것이 중요하며, 너무 길지 않게 유지하는 것이 좋습니다. 일반적으로 3-5개 단어로 구성된 슬러그가 이상적입니다.",
    },
    en: {
      title: "Creating Good URL Slugs",
      content:
        "A URL slug is the human-readable part of a web address that describes the page content. For example, in 'https://example.com/blog/my-first-post', 'my-first-post' is the slug.\n\nGood slugs are short, descriptive, use only lowercase letters, and replace spaces with hyphens. Special characters and those requiring URL encoding are removed or replaced.\n\nFrom an SEO perspective, including relevant keywords in your slug is important, and keeping it concise is best. Slugs with 3-5 words are generally ideal.",
    },
  },

  faq: {
    ko: [
      {
        q: "한글이 포함된 텍스트는 어떻게 처리되나요?",
        a: "한글은 URL에서 퍼센트 인코딩(%ED%95%9C%EA%B8%80)이 필요하지만, 이 도구는 한글을 그대로 유지합니다. 한글 슬러그는 일부 플랫폼에서 지원되며, 영문 슬러그가 필요한 경우 한글을 영문으로 번역한 후 변환하세요.",
        },
      {
        q: "슬러그에서 숫자는 어떻게 처리되나요?",
        a: "숫자는 슬러그에서 그대로 유지됩니다. '2024년 트렌드'는 '2024년-트렌드'가 됩니다.",
      },
      {
        q: "슬러그 길이는 어느 정도가 적당한가요?",
        a: "SEO와 사용성을 고려할 때 3-5개 단어, 50자 이내가 이상적입니다. 너무 긴 슬러그는 검색 결과에서 잘리거나 기억하기 어려울 수 있습니다.",
      },
    ],
    en: [
      {
        q: "How are special characters handled?",
        a: "Special characters that are not URL-safe (like !, @, #, $, etc.) are removed. Spaces and underscores are converted to hyphens.",
      },
      {
        q: "How are numbers treated in slugs?",
        a: "Numbers are preserved as-is in the slug. For example, '10 Best Tips' becomes '10-best-tips'.",
      },
      {
        q: "What is the ideal slug length?",
        a: "For SEO and usability, 3-5 words and under 50 characters is ideal. Very long slugs may be truncated in search results and are harder to remember.",
      },
    ],
  },

  relatedTools: [
    "word-counter",
    "case-converter",
    "text-reverser",
    "lorem-ipsum-generator",
  ],
};
