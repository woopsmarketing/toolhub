import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "base64-encoder",
  category: "developer",
  template: "TextToText",
  processingType: "client",
  icon: "Binary",

  inputConfig: {
    placeholder: "인코딩하거나 디코딩할 텍스트를 입력하세요...",
    inputLabel: "텍스트 입력",
    outputLabel: "변환 결과",
    outputType: "stats",
  },

  seo: {
    ko: {
      title: "Base64 인코더 & 디코더",
      description:
        "텍스트를 Base64로 인코딩하거나 Base64를 원문으로 디코딩하세요. 자동으로 Base64 여부를 감지하여 인코딩/디코딩 결과를 모두 표시하는 무료 온라인 도구입니다.",
      keywords: [
        "Base64 인코딩",
        "Base64 디코딩",
        "Base64 변환",
        "base64 encode",
        "base64 decode",
        "base64 온라인",
      ],
    },
    en: {
      title: "Base64 Encoder & Decoder",
      description:
        "Encode text to Base64 or decode Base64 back to plain text. Automatically detects Base64 input and shows both encode and decode results. Free online tool.",
      keywords: [
        "base64 encoder",
        "base64 decoder",
        "base64 converter",
        "encode base64 online",
        "decode base64 online",
        "base64 tool",
      ],
    },
  },

  howToUse: {
    ko: [
      "인코딩 또는 디코딩할 텍스트를 입력 영역에 붙여넣으세요.",
      "자동으로 Base64 인코딩 결과와 디코딩 결과가 모두 표시됩니다.",
      "필요한 결과를 복사해서 사용하세요.",
    ],
    en: [
      "Paste the text you want to encode or decode into the input area.",
      "Both the Base64 encoded result and decoded result are shown automatically.",
      "Copy the result you need.",
    ],
  },

  features: {
    ko: [
      "텍스트를 Base64로 즉시 인코딩",
      "Base64를 원문 텍스트로 즉시 디코딩",
      "인코딩과 디코딩 결과 동시 표시",
      "유효하지 않은 Base64 입력 시 오류 안내",
      "UTF-8 문자 완벽 지원 (한글, 일본어 등)",
      "클라이언트에서 처리되어 데이터 보안 보장",
    ],
    en: [
      "Instantly encode text to Base64",
      "Instantly decode Base64 to plain text",
      "Shows both encode and decode results simultaneously",
      "Clear error messages for invalid Base64 input",
      "Full UTF-8 character support (Korean, Japanese, etc.)",
      "Processed entirely in your browser for data security",
    ],
  },

  useCases: {
    ko: [
      {
        title: "이미지 Data URL 생성",
        description:
          "이미지를 Base64로 인코딩하여 HTML/CSS에 직접 삽입할 수 있는 Data URL 형식으로 변환하세요.",
        example: {
          input: "이미지 바이너리 데이터",
          output: "data:image/png;base64,iVBORw0KGgo...",
        },
      },
      {
        title: "API 인증 헤더",
        description:
          "HTTP Basic Authentication에서 사용자명:비밀번호를 Base64로 인코딩하여 Authorization 헤더를 생성하세요.",
        example: {
          input: "username:password",
          output: "dXNlcm5hbWU6cGFzc3dvcmQ=",
        },
      },
      {
        title: "JWT 토큰 페이로드 확인",
        description:
          "JWT 토큰의 각 부분은 Base64로 인코딩되어 있습니다. 디코딩하여 내용을 확인하세요.",
        example: {
          input: "eyJhbGciOiJIUzI1NiJ9",
          output: '{"alg":"HS256"}',
        },
      },
    ],
    en: [
      {
        title: "Image Data URLs",
        description:
          "Encode image binary data to Base64 for embedding directly in HTML/CSS as a Data URL.",
        example: {
          input: "Image binary data",
          output: "data:image/png;base64,iVBORw0KGgo...",
        },
      },
      {
        title: "API Authorization Headers",
        description:
          "Encode username:password to Base64 for HTTP Basic Authentication headers.",
        example: {
          input: "username:password",
          output: "dXNlcm5hbWU6cGFzc3dvcmQ=",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "Base64 인코딩이란?",
      content:
        "Base64는 바이너리 데이터를 ASCII 문자열로 변환하는 인코딩 방식입니다. A-Z, a-z, 0-9, +, / 의 64개 문자를 사용하여 어떤 데이터든 표현할 수 있습니다.\n\nBase64는 이메일 첨부파일(MIME), HTTP 기본 인증, JWT 토큰, 이미지 Data URL, 쿠키 값 등 다양한 곳에서 사용됩니다.\n\n주의: Base64는 암호화가 아닌 인코딩입니다. 누구든지 쉽게 디코딩할 수 있으므로 민감한 정보를 Base64로만 보호하는 것은 안전하지 않습니다.",
    },
    en: {
      title: "What is Base64 Encoding?",
      content:
        "Base64 is an encoding scheme that converts binary data into an ASCII string using 64 characters: A-Z, a-z, 0-9, +, and /.\n\nBase64 is used in email attachments (MIME), HTTP Basic Authentication, JWT tokens, image Data URLs, cookie values, and more.\n\nImportant: Base64 is encoding, not encryption. Anyone can decode it easily. Never rely on Base64 alone to protect sensitive information.",
    },
  },

  faq: {
    ko: [
      {
        q: "Base64 인코딩과 암호화의 차이는 무엇인가요?",
        a: "Base64는 암호화가 아닙니다. 단순히 데이터 형식을 변환하는 인코딩입니다. 누구든지 Base64 문자열을 쉽게 디코딩할 수 있습니다. 보안이 필요하다면 AES, RSA 같은 실제 암호화 알고리즘을 사용해야 합니다.",
      },
      {
        q: "한글도 Base64로 인코딩할 수 있나요?",
        a: "네. 이 도구는 UTF-8 인코딩을 사용하므로 한글, 일본어, 중국어, 이모지 등 모든 유니코드 문자를 Base64로 인코딩하고 디코딩할 수 있습니다.",
      },
      {
        q: "Base64 문자열 끝의 '=' 기호는 무엇인가요?",
        a: "Base64는 3바이트씩 묶어서 처리합니다. 입력 데이터의 바이트 수가 3의 배수가 아닐 경우 부족한 부분을 '=' 패딩 문자로 채웁니다. 1~2개의 '='이 붙을 수 있습니다.",
      },
    ],
    en: [
      {
        q: "What is the difference between Base64 encoding and encryption?",
        a: "Base64 is not encryption. It is simply an encoding that changes the data format. Anyone can decode a Base64 string easily. For real security, use encryption algorithms like AES or RSA.",
      },
      {
        q: "What does the '=' sign at the end of Base64 mean?",
        a: "Base64 processes data in 3-byte groups. If the input length is not a multiple of 3, padding '=' characters are added to fill the gap. You may see 1 or 2 '=' signs at the end.",
      },
    ],
  },

  relatedTools: [
    "json-formatter",
    "url-encoder",
    "html-entity-converter",
    "jwt-decoder",
    "unicode-converter",
  ],
};
