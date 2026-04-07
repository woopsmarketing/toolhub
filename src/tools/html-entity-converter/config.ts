import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "html-entity-converter",
  category: "developer",
  template: "TextToText",
  processingType: "client",
  icon: "Code",

  inputConfig: {
    placeholder: "HTML 엔티티로 변환하거나 디코딩할 텍스트를 입력하세요...",
    inputLabel: "텍스트 입력",
    outputLabel: "변환 결과",
    outputType: "stats",
  },

  seo: {
    ko: {
      title: "HTML 엔티티 변환기",
      description:
        "HTML 특수문자를 엔티티(&amp;, &lt;, &gt; 등)로 변환하거나 HTML 엔티티를 원문으로 디코딩하세요. XSS 방지와 HTML 콘텐츠 작성에 필수적인 무료 온라인 도구입니다.",
      keywords: [
        "HTML 엔티티",
        "HTML 특수문자",
        "HTML 인코딩",
        "HTML escape",
        "HTML entity converter",
        "XSS 방지",
        "HTML 변환",
      ],
    },
    en: {
      title: "HTML Entity Converter",
      description:
        "Convert HTML special characters to entities (&amp;, &lt;, &gt;, etc.) or decode HTML entities back to plain text. Essential for XSS prevention and HTML content creation.",
      keywords: [
        "HTML entity converter",
        "HTML escape",
        "HTML encode",
        "HTML decode",
        "HTML special characters",
        "XSS prevention",
        "HTML entities online",
      ],
    },
  },

  howToUse: {
    ko: [
      "HTML 텍스트 또는 엔티티가 포함된 텍스트를 입력 영역에 붙여넣으세요.",
      "HTML 엔티티로 변환된 결과와 엔티티를 디코딩한 결과가 자동으로 표시됩니다.",
      "필요한 결과를 복사해서 사용하세요.",
    ],
    en: [
      "Paste your HTML text or entity-encoded text into the input area.",
      "The HTML entity encoded result and decoded result are shown automatically.",
      "Copy the result you need.",
    ],
  },

  features: {
    ko: [
      "<, >, &, \", ' 등 HTML 특수문자 엔티티 변환",
      "HTML 엔티티를 원문 텍스트로 디코딩",
      "인코딩과 디코딩 결과 동시 표시",
      "XSS 공격 방지를 위한 안전한 이스케이프",
      "숫자 엔티티(&#숫자;) 및 명명 엔티티(&name;) 모두 지원",
      "클라이언트에서 처리되어 데이터 보안 보장",
    ],
    en: [
      "Converts HTML special characters like <, >, &, \", ' to entities",
      "Decodes HTML entities back to plain text",
      "Shows both encode and decode results simultaneously",
      "Safe escaping for XSS attack prevention",
      "Supports both numeric (&#number;) and named (&name;) entities",
      "Processed entirely in your browser for data security",
    ],
  },

  useCases: {
    ko: [
      {
        title: "XSS 방지 이스케이프",
        description:
          "사용자 입력을 HTML에 출력할 때 반드시 특수문자를 엔티티로 변환하여 XSS 공격을 방지하세요.",
        example: {
          input: "<script>alert('xss')</script>",
          output: "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;",
        },
      },
      {
        title: "HTML 소스코드 문서화",
        description:
          "블로그나 문서에 HTML 코드를 그대로 표시하려면 엔티티로 변환해야 브라우저가 태그를 해석하지 않습니다.",
        example: {
          input: "<div class=\"container\">Hello</div>",
          output: "&lt;div class=&quot;container&quot;&gt;Hello&lt;/div&gt;",
        },
      },
      {
        title: "HTML 엔티티 디코딩",
        description:
          "HTML 소스에서 복사한 엔티티 문자열을 읽기 쉬운 텍스트로 변환하세요.",
        example: {
          input: "&lt;p&gt;안녕하세요&lt;/p&gt;",
          output: "<p>안녕하세요</p>",
        },
      },
    ],
    en: [
      {
        title: "XSS Prevention Escaping",
        description:
          "Always escape special characters to entities when rendering user input in HTML to prevent XSS attacks.",
        example: {
          input: "<script>alert('xss')</script>",
          output: "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;",
        },
      },
      {
        title: "Displaying HTML Source Code",
        description:
          "Convert HTML tags to entities so they display as text rather than being interpreted by the browser.",
        example: {
          input: "<div>Hello World</div>",
          output: "&lt;div&gt;Hello World&lt;/div&gt;",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "HTML 엔티티란?",
      content:
        "HTML 엔티티는 HTML에서 특별한 의미를 가진 문자를 표현하기 위한 코드입니다. 예를 들어 '<'는 HTML 태그의 시작을 의미하므로 텍스트로 표시하려면 '&lt;'로 써야 합니다.\n\n주요 HTML 엔티티:\n- & → &amp;\n- < → &lt;\n- > → &gt;\n- \" → &quot;\n- ' → &#39;\n\nHTML 엔티티는 XSS(Cross-Site Scripting) 공격 방지에도 필수적입니다. 사용자 입력을 HTML에 직접 출력할 때 이스케이프 처리를 하지 않으면 악의적인 스크립트가 실행될 수 있습니다.",
    },
    en: {
      title: "What are HTML Entities?",
      content:
        "HTML entities are codes used to represent characters that have special meaning in HTML. For example, '<' marks the start of an HTML tag, so to display it as text you must write '&lt;'.\n\nCommon HTML entities:\n- & → &amp;\n- < → &lt;\n- > → &gt;\n- \" → &quot;\n- ' → &#39;\n\nHTML entities are also essential for XSS (Cross-Site Scripting) prevention. If you output user input directly to HTML without escaping, malicious scripts can execute.",
    },
  },

  faq: {
    ko: [
      {
        q: "모든 특수문자를 HTML 엔티티로 변환해야 하나요?",
        a: "모든 특수문자를 변환할 필요는 없습니다. HTML 구조에 영향을 주는 &, <, >, \", ' 를 반드시 변환해야 합니다. 한글이나 일반 유니코드 문자는 현대 HTML(UTF-8)에서는 직접 사용해도 안전합니다.",
      },
      {
        q: "&amp;와 &#38;의 차이는 무엇인가요?",
        a: "&amp;는 '&' 문자의 명명 엔티티(named entity)이고, &#38;은 같은 문자의 숫자 엔티티(numeric entity)입니다. 두 표현 모두 같은 결과를 나타내며 HTML에서 동일하게 동작합니다.",
      },
      {
        q: "React나 Vue에서도 HTML 엔티티 이스케이프가 필요한가요?",
        a: "React와 Vue는 기본적으로 렌더링 시 자동으로 이스케이프 처리를 합니다. 단, dangerouslySetInnerHTML(React)이나 v-html(Vue)을 사용할 때는 직접 이스케이프 처리를 해야 합니다.",
      },
    ],
    en: [
      {
        q: "Do I need to convert all special characters to HTML entities?",
        a: "Not all of them. You must convert &, <, >, \", and ' as they affect HTML structure. Korean and other Unicode characters are safe to use directly in modern HTML (UTF-8).",
      },
      {
        q: "Do React or Vue need HTML entity escaping?",
        a: "React and Vue automatically escape output during rendering by default. However, when using dangerouslySetInnerHTML (React) or v-html (Vue), you must escape manually.",
      },
    ],
  },

  relatedTools: [
    "json-formatter",
    "base64-encoder",
    "url-encoder",
    "jwt-decoder",
    "unicode-converter",
  ],
};
