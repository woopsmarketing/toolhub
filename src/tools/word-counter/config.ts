import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "word-counter",
  category: "text",
  template: "TextToText",
  processingType: "client",
  icon: "Type",

  inputConfig: {
    placeholder: "여기에 텍스트를 입력하거나 붙여넣으세요...",
    inputLabel: "텍스트 입력",
    outputLabel: "분석 결과",
    outputType: "stats",
  },

  seo: {
    ko: {
      title: "온라인 글자수 세기",
      description:
        "실시간으로 글자수, 단어수, 문장수, 바이트 수를 세어보세요. 공백 포함/미포함, 읽기 시간까지 한번에 확인할 수 있는 무료 온라인 글자수 카운터입니다.",
      keywords: [
        "글자수세기",
        "글자수 카운터",
        "단어수 세기",
        "문자수 세기",
        "바이트 계산",
        "글자수 세기 온라인",
      ],
    },
    en: {
      title: "Online Word Counter",
      description:
        "Count characters, words, sentences, and bytes in real time. Free online character counter with reading time estimation.",
      keywords: [
        "word counter",
        "character counter",
        "letter counter",
        "word count online",
        "character count",
      ],
    },
  },

  howToUse: {
    ko: [
      "텍스트를 입력 영역에 직접 입력하거나 붙여넣으세요.",
      "실시간으로 글자수, 단어수, 문장수 등이 자동 계산됩니다.",
      "공백 포함/미포함 글자수를 모두 확인할 수 있습니다.",
    ],
    en: [
      "Type or paste your text into the input area.",
      "Character count, word count, and sentence count are calculated in real time.",
      "View counts with and without spaces.",
    ],
  },

  features: {
    ko: [
      "공백 포함/미포함 글자수 실시간 계산",
      "단어 수, 문장 수 자동 카운트",
      "바이트(Byte) 수 계산 (UTF-8)",
      "문단 및 줄 수 표시",
      "예상 읽기 시간 계산",
      "한글, 영어, 숫자, 특수문자 모두 지원",
    ],
    en: [
      "Real-time character count with/without spaces",
      "Automatic word and sentence counting",
      "Byte count calculation (UTF-8)",
      "Paragraph and line count",
      "Estimated reading time",
      "Supports all languages and special characters",
    ],
  },

  useCases: {
    ko: [
      {
        title: "블로그 글 제목 작성",
        description:
          "네이버 블로그 제목은 15~30자가 적당합니다. 너무 길면 검색 결과에서 잘려 보입니다.",
        example: {
          input: "효과적인 블로그 제목 작성법 7가지 핵심 팁",
          output: "공백포함 22자, 공백미포함 19자",
        },
      },
      {
        title: "자기소개서 글자수 제한 확인",
        description:
          "대부분의 자기소개서는 500~1,000자 제한이 있습니다. 작성 중 실시간으로 글자수를 확인하세요.",
        example: {
          input: "저는 3년간 웹 개발 경험을 통해...",
          output: "공백포함 18자",
        },
      },
      {
        title: "SNS 게시글 최적 길이 확인",
        description:
          "트위터(X)는 280자, 인스타그램은 2,200자, 카카오톡 메시지는 1,000자 제한이 있습니다.",
        example: {
          input: "오늘 새로운 카페를 발견했는데 정말 분위기가 좋았다 ☕",
          output: "공백포함 27자",
        },
      },
      {
        title: "검색엔진 메타 디스크립션",
        description:
          "SEO에 최적화된 메타 디스크립션은 한글 기준 80~160자가 적당합니다.",
        example: {
          input: "무료 온라인 글자수 세기 도구. 실시간 글자수 카운터로 공백 포함 미포함 바이트까지 한번에.",
          output: "공백포함 42자 (적정 범위)",
        },
      },
    ],
    en: [
      {
        title: "Blog Post Titles",
        description:
          "SEO-friendly blog titles should be 50-60 characters. Check your title length instantly.",
        example: {
          input: "7 Essential Tips for Writing Effective Blog Titles",
          output: "50 characters with spaces",
        },
      },
      {
        title: "Social Media Posts",
        description:
          "Twitter limits to 280 characters, Instagram to 2,200. Check your post length before publishing.",
        example: {
          input: "Just discovered an amazing new coffee shop! ☕",
          output: "46 characters with spaces",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "글자수 세기가 중요한 이유",
      content:
        "온라인에서 글을 작성할 때 글자수 제한은 매우 흔합니다. 검색엔진 메타 디스크립션(155자 권장), 트위터 게시물(280자), 자기소개서(500~1,000자), 논문 초록(200~300단어) 등 다양한 플랫폼과 문서에서 글자수 제한을 두고 있습니다.\n\n글자수를 정확히 세는 것은 단순히 제한을 지키기 위한 것만이 아닙니다. 적절한 길이의 글은 독자의 집중력을 유지하고, 핵심 메시지를 효과적으로 전달하는 데 도움이 됩니다.\n\n특히 한글의 경우 영어와 달리 한 글자가 2~3바이트를 차지하므로, 바이트 기준 제한이 있는 시스템에서는 바이트 수 계산이 필수적입니다.",
    },
    en: {
      title: "Why Character Counting Matters",
      content:
        "Character limits are everywhere online. Meta descriptions (155 chars), tweets (280 chars), cover letters, academic abstracts — each has its own length requirement.\n\nAccurate character counting isn't just about staying within limits. The right length helps maintain reader attention and delivers your message effectively.\n\nOur tool counts characters with and without spaces, words, sentences, paragraphs, and even estimates reading time — everything you need in one place.",
    },
  },

  faq: {
    ko: [
      {
        q: "공백도 글자수에 포함되나요?",
        a: "상황에 따라 다릅니다. 이 도구에서는 공백 포함 글자수와 공백 미포함 글자수를 모두 표시합니다. 일반적으로 자기소개서나 에세이에서는 공백을 포함하고, 코드나 특수한 경우에는 공백을 제외합니다.",
      },
      {
        q: "한글과 영어의 바이트 차이는 무엇인가요?",
        a: "UTF-8 인코딩 기준으로 영어 알파벳은 1바이트, 한글은 3바이트를 차지합니다. 예를 들어 '가'는 3바이트, 'a'는 1바이트입니다. 데이터베이스나 SMS 등에서 바이트 제한이 있는 경우 이 차이가 중요합니다.",
      },
      {
        q: "읽기 시간은 어떻게 계산되나요?",
        a: "한국어 기준 분당 약 500자, 영어 기준 분당 약 200~250단어를 읽는 것으로 계산합니다. 실제 읽기 속도는 콘텐츠의 난이도와 개인차에 따라 달라질 수 있습니다.",
      },
    ],
    en: [
      {
        q: "Are spaces included in the character count?",
        a: "It depends on the context. This tool shows both counts — with and without spaces. Most social media platforms count spaces, while some academic requirements exclude them.",
      },
      {
        q: "How is reading time calculated?",
        a: "We estimate based on an average reading speed of 200-250 words per minute. Actual reading speed may vary depending on content complexity.",
      },
    ],
  },

  relatedTools: [],
};
