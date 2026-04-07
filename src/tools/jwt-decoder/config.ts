import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "jwt-decoder",
  category: "developer",
  template: "TextToText",
  processingType: "client",
  icon: "Key",

  inputConfig: {
    placeholder: "JWT 토큰을 붙여넣으세요 (eyJ...)",
    inputLabel: "JWT 토큰",
    outputLabel: "디코딩 결과",
    inputType: "code",
    outputType: "stats",
  },

  seo: {
    ko: {
      title: "JWT 디코더 - JWT 토큰 파싱",
      description:
        "JWT(JSON Web Token)의 헤더와 페이로드를 즉시 디코딩하여 내용을 확인하세요. 로그인 토큰의 만료 시간, 사용자 정보 등을 쉽게 확인할 수 있는 무료 온라인 JWT 디코더입니다.",
      keywords: [
        "JWT 디코더",
        "JWT 파싱",
        "JSON Web Token",
        "JWT 토큰 확인",
        "JWT decode online",
        "토큰 만료 확인",
        "JWT 헤더 페이로드",
      ],
    },
    en: {
      title: "JWT Decoder - Parse JWT Tokens",
      description:
        "Instantly decode and inspect the header and payload of any JWT (JSON Web Token). Check expiration time, user info, and claims from login tokens. Free online JWT decoder.",
      keywords: [
        "JWT decoder",
        "JWT parser",
        "JSON Web Token decoder",
        "decode JWT online",
        "JWT token inspector",
        "JWT claims viewer",
        "JWT expiry checker",
      ],
    },
  },

  howToUse: {
    ko: [
      "JWT 토큰(eyJ...로 시작하는 문자열)을 입력 영역에 붙여넣으세요.",
      "헤더와 페이로드가 자동으로 JSON 형식으로 디코딩됩니다.",
      "토큰의 알고리즘, 사용자 정보, 만료 시간 등을 확인하세요.",
    ],
    en: [
      "Paste your JWT token (the string starting with eyJ...) into the input area.",
      "The header and payload are automatically decoded to JSON format.",
      "Inspect the algorithm, user info, expiration time, and other claims.",
    ],
  },

  features: {
    ko: [
      "JWT 헤더(Header) Base64 디코딩 및 JSON 포맷팅",
      "JWT 페이로드(Payload) Base64 디코딩 및 JSON 포맷팅",
      "유효하지 않은 JWT 형식 감지 및 오류 메시지",
      "exp 클레임으로 토큰 만료 확인 가능",
      "클라이언트에서 처리되어 토큰 보안 보장",
      "모든 JWT 알고리즘 지원 (HS256, RS256, ES256 등)",
    ],
    en: [
      "Base64 decoding and JSON formatting of JWT Header",
      "Base64 decoding and JSON formatting of JWT Payload",
      "Detects invalid JWT format with clear error messages",
      "Check token expiration using the exp claim",
      "Processed entirely in your browser — token never leaves your device",
      "Supports all JWT algorithms (HS256, RS256, ES256, etc.)",
    ],
  },

  useCases: {
    ko: [
      {
        title: "로그인 토큰 디버깅",
        description:
          "API 인증 오류 발생 시 JWT 토큰의 내용을 확인하여 사용자 정보, 권한, 만료 시간을 빠르게 검사하세요.",
        example: {
          input: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          output: '{ "alg": "HS256", "typ": "JWT" }',
        },
      },
      {
        title: "토큰 만료 시간 확인",
        description:
          "페이로드의 exp 필드는 Unix 타임스탬프로 만료 시간을 나타냅니다. 토큰이 언제 만료되는지 확인하세요.",
        example: {
          input: "페이로드에 exp: 1735689600 포함된 JWT",
          output: '{ "exp": 1735689600, "sub": "user123" }',
        },
      },
      {
        title: "JWT 알고리즘 확인",
        description:
          "헤더의 alg 필드로 사용된 서명 알고리즘을 확인하세요. 보안 감사나 호환성 확인에 유용합니다.",
        example: {
          input: "JWT 토큰",
          output: '{ "alg": "RS256", "typ": "JWT" }',
        },
      },
    ],
    en: [
      {
        title: "API Authentication Debugging",
        description:
          "When API auth errors occur, inspect the JWT token to quickly check user info, permissions, and expiration.",
        example: {
          input: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          output: '{ "alg": "HS256", "typ": "JWT" }',
        },
      },
      {
        title: "Checking Token Expiration",
        description:
          "The exp field in the payload is a Unix timestamp for expiration. Decode the token to check when it expires.",
        example: {
          input: "JWT with exp field in payload",
          output: '{ "exp": 1735689600, "sub": "user123" }',
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "JWT(JSON Web Token)란?",
      content:
        "JWT는 당사자 간에 정보를 안전하게 전달하기 위한 개방형 표준(RFC 7519)입니다. 주로 인증(Authentication)과 정보 교환에 사용됩니다.\n\nJWT는 점(.)으로 구분된 세 부분으로 구성됩니다:\n1. 헤더(Header): 토큰 타입과 사용된 해싱 알고리즘 정보\n2. 페이로드(Payload): 클레임(claim) 정보 — 사용자 ID, 이름, 권한, 만료 시간 등\n3. 서명(Signature): 헤더와 페이로드의 무결성을 검증하는 서명\n\n헤더와 페이로드는 Base64Url로 인코딩되어 있어 누구나 디코딩하여 내용을 볼 수 있습니다. 단, 서명 검증은 비밀키가 있어야 하므로 민감한 정보는 페이로드에 포함하지 않는 것이 좋습니다.",
    },
    en: {
      title: "What is JWT (JSON Web Token)?",
      content:
        "JWT is an open standard (RFC 7519) for securely transmitting information between parties. It is primarily used for authentication and information exchange.\n\nA JWT consists of three parts separated by dots (.):\n1. Header: Token type and hashing algorithm\n2. Payload: Claims — user ID, name, permissions, expiration time, etc.\n3. Signature: Verifies the integrity of the header and payload\n\nThe header and payload are Base64Url encoded, so anyone can decode and read them. Signature verification requires the secret key, so avoid putting sensitive data in the payload.",
    },
  },

  faq: {
    ko: [
      {
        q: "JWT 디코딩과 JWT 검증의 차이는 무엇인가요?",
        a: "디코딩은 Base64로 인코딩된 헤더와 페이로드의 내용을 읽는 것입니다. 검증은 비밀키를 사용해 서명이 올바른지, 토큰이 변조되지 않았는지 확인하는 것입니다. 이 도구는 디코딩만 가능하며, 서명 검증은 서버 측 비밀키가 필요합니다.",
      },
      {
        q: "JWT 토큰을 이 도구에 입력해도 안전한가요?",
        a: "모든 처리는 브라우저 내에서만 이루어지며 어떤 서버에도 전송되지 않습니다. 단, JWT에는 민감한 정보가 포함될 수 있으므로 프로덕션 환경의 실제 토큰은 테스트 환경이나 만료된 토큰으로 대체하는 것을 권장합니다.",
      },
      {
        q: "exp 값을 사람이 읽을 수 있는 날짜로 어떻게 변환하나요?",
        a: "exp는 Unix 타임스탬프(1970년 1월 1일 UTC 기준 경과 초)입니다. JavaScript에서 new Date(exp * 1000).toLocaleString()으로 변환할 수 있습니다.",
      },
    ],
    en: [
      {
        q: "What is the difference between decoding and verifying a JWT?",
        a: "Decoding reads the Base64-encoded header and payload content. Verification uses the secret key to confirm the signature is valid and the token has not been tampered with. This tool only decodes — signature verification requires the server-side secret key.",
      },
      {
        q: "Is it safe to paste my JWT token into this tool?",
        a: "All processing happens locally in your browser and nothing is sent to any server. However, since JWTs may contain sensitive information, we recommend using test tokens or expired tokens rather than live production tokens.",
      },
      {
        q: "How do I convert the exp value to a human-readable date?",
        a: "The exp field is a Unix timestamp (seconds since January 1, 1970 UTC). In JavaScript: new Date(exp * 1000).toLocaleString() converts it to a readable date.",
      },
    ],
  },

  relatedTools: [
    "json-formatter",
    "base64-encoder",
    "url-encoder",
    "html-entity-converter",
    "unicode-converter",
  ],
};
