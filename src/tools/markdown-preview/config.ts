import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "markdown-preview",
  category: "developer",
  template: "TextToText",
  processingType: "client",
  icon: "FileCode",

  inputConfig: {
    placeholder:
      "마크다운을 입력하세요...\n\n# 제목\n## 소제목\n**굵게** *기울임*\n- 목록",
    inputLabel: "마크다운 입력",
    outputLabel: "변환된 HTML",
    outputType: "text",
  },

  seo: {
    ko: {
      title: "마크다운 미리보기 - 온라인 Markdown to HTML 변환기",
      description:
        "마크다운을 HTML로 즉시 변환하세요. 제목, 굵게, 기울임, 목록, 코드 블록, 링크 등을 지원하는 무료 온라인 마크다운 변환기입니다.",
      keywords: [
        "마크다운 변환기",
        "markdown to html",
        "마크다운 미리보기",
        "마크다운 html 변환",
        "온라인 마크다운",
        "markdown converter",
      ],
    },
    en: {
      title: "Markdown Preview - Online Markdown to HTML Converter",
      description:
        "Convert Markdown to HTML instantly. Supports headings, bold, italic, lists, code blocks, links, and more. Free online Markdown converter.",
      keywords: [
        "markdown converter",
        "markdown to html",
        "markdown preview",
        "online markdown",
        "markdown editor",
        "markdown parser",
      ],
    },
  },

  howToUse: {
    ko: [
      "마크다운 문법으로 텍스트를 입력하세요.",
      "입력과 동시에 HTML로 변환된 결과가 표시됩니다.",
      "변환된 HTML 코드를 복사하여 웹 페이지나 에디터에 사용하세요.",
    ],
    en: [
      "Enter text using Markdown syntax in the input area.",
      "The HTML output is generated instantly as you type.",
      "Copy the converted HTML and use it in your web page or editor.",
    ],
  },

  features: {
    ko: [
      "제목 변환 (# H1, ## H2, ### H3)",
      "굵게(**text**), 기울임(*text*) 텍스트",
      "순서 없는 목록(- item) 지원",
      "인라인 코드(`code`)와 코드 블록(```...```) 지원",
      "링크([text](url)) 변환",
      "인용문(> blockquote)과 수평선(---) 지원",
    ],
    en: [
      "Heading conversion (# H1, ## H2, ### H3)",
      "Bold (**text**) and italic (*text*) formatting",
      "Unordered list (- item) support",
      "Inline code (`code`) and code blocks (```...```)",
      "Link ([text](url)) conversion",
      "Blockquote (>) and horizontal rule (---) support",
    ],
  },

  useCases: {
    ko: [
      {
        title: "README 파일 미리보기",
        description:
          "GitHub README.md 파일을 작성하면서 HTML 변환 결과를 즉시 확인합니다.",
        example: {
          input: "# 프로젝트 이름\n\n**설명**: 간단한 소개글",
          output: "<h1>프로젝트 이름</h1><p><strong>설명</strong>: 간단한 소개글</p>",
        },
      },
      {
        title: "블로그 콘텐츠 작성",
        description:
          "마크다운으로 블로그 글을 작성하고 HTML로 변환하여 CMS에 붙여넣습니다.",
        example: {
          input: "## 주요 기능\n- 기능 1\n- 기능 2",
          output: "<h2>주요 기능</h2><ul><li>기능 1</li><li>기능 2</li></ul>",
        },
      },
      {
        title: "문서 빠른 변환",
        description:
          "마크다운 형식의 문서를 HTML로 빠르게 변환하여 웹 페이지에 바로 사용합니다.",
        example: {
          input: "> 중요한 내용\n\n---",
          output: "<blockquote>중요한 내용</blockquote><hr>",
        },
      },
    ],
    en: [
      {
        title: "README Preview",
        description:
          "Write a GitHub README.md and instantly preview the HTML output.",
        example: {
          input: "# Project Name\n\n**Description**: Brief intro",
          output: "<h1>Project Name</h1><p><strong>Description</strong>: Brief intro</p>",
        },
      },
      {
        title: "Blog Content Writing",
        description:
          "Write blog posts in Markdown and convert to HTML to paste into your CMS.",
        example: {
          input: "## Features\n- Feature 1\n- Feature 2",
          output: "<h2>Features</h2><ul><li>Feature 1</li><li>Feature 2</li></ul>",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "마크다운 문법 요약",
      content:
        "마크다운(Markdown)은 일반 텍스트로 서식 있는 문서를 작성할 수 있는 경량 마크업 언어입니다. GitHub, Notion, 개발 문서 등에서 널리 사용됩니다.\n\n주요 문법:\n- 제목: # H1, ## H2, ### H3\n- 굵게: **텍스트** 또는 __텍스트__\n- 기울임: *텍스트* 또는 _텍스트_\n- 목록: - 항목 (줄마다)\n- 코드: `인라인 코드` 또는 ```블록 코드```\n- 링크: [표시 텍스트](URL)\n- 인용문: > 인용 내용\n- 수평선: ---\n\n이 변환기는 외부 라이브러리 없이 주요 마크다운 문법을 HTML로 변환합니다.",
    },
    en: {
      title: "Markdown Syntax Summary",
      content:
        "Markdown is a lightweight markup language that lets you write formatted documents using plain text. It's widely used on GitHub, Notion, and developer documentation.\n\nKey syntax:\n- Headings: # H1, ## H2, ### H3\n- Bold: **text** or __text__\n- Italic: *text* or _text_\n- Lists: - item (one per line)\n- Code: `inline code` or ```block code```\n- Links: [display text](URL)\n- Blockquote: > quote content\n- Horizontal rule: ---\n\nThis converter handles all major Markdown syntax without any external library.",
    },
  },

  faq: {
    ko: [
      {
        q: "순서 있는 목록(1. 2. 3.)도 지원하나요?",
        a: "현재 버전은 순서 없는 목록(-)을 지원합니다. 순서 있는 목록(1. 2. 3.)은 향후 업데이트에서 추가될 예정입니다.",
      },
      {
        q: "표(Table) 문법은 지원하나요?",
        a: "현재 버전은 기본 마크다운 문법(제목, 굵게, 기울임, 목록, 코드, 링크, 인용문, 수평선)을 지원합니다. 표 문법은 지원하지 않습니다.",
      },
      {
        q: "변환된 HTML을 직접 사용할 수 있나요?",
        a: "네, 변환된 HTML은 복사하여 웹 페이지, CMS, 이메일 편집기 등 HTML을 지원하는 어디서든 바로 사용할 수 있습니다.",
      },
    ],
    en: [
      {
        q: "Are ordered lists (1. 2. 3.) supported?",
        a: "The current version supports unordered lists (-). Ordered list (1. 2. 3.) support is planned for a future update.",
      },
      {
        q: "Are tables supported?",
        a: "The current version supports core Markdown syntax (headings, bold, italic, lists, code, links, blockquotes, horizontal rules). Table syntax is not supported.",
      },
      {
        q: "Can I use the converted HTML directly?",
        a: "Yes, the converted HTML can be copied and used directly in web pages, CMS platforms, email editors, or anywhere HTML is accepted.",
      },
    ],
  },

  relatedTools: ["regex-tester", "json-formatter", "base64-encoder", "word-counter"],
};
