import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "uuid-generator",
  category: "generator",
  template: "FormToResult",
  processingType: "client",
  icon: "Fingerprint",

  formFields: [
    {
      name: "count",
      label: "생성 개수",
      type: "number",
      defaultValue: 5,
      min: 1,
      max: 50,
      step: 1,
    },
    {
      name: "version",
      label: "버전",
      type: "select",
      defaultValue: "4",
      options: [{ label: "UUID v4 (랜덤)", value: "4" }],
    },
  ],

  resultLabels: [{ key: "uuids", label: "생성된 UUID" }],

  seo: {
    ko: {
      title: "UUID 생성기 - 온라인 UUID v4 생성 도구",
      description:
        "UUID v4를 즉시 생성하세요. 최대 50개까지 한 번에 생성할 수 있는 무료 온라인 UUID 생성기입니다.",
      keywords: [
        "UUID 생성기",
        "UUID 생성",
        "UUID v4",
        "GUID 생성기",
        "고유 ID 생성",
        "랜덤 UUID",
      ],
    },
    en: {
      title: "UUID Generator - Online UUID v4 Generator",
      description:
        "Generate UUID v4 instantly. Create up to 50 UUIDs at once. Free online UUID generator tool.",
      keywords: [
        "UUID generator",
        "UUID v4 generator",
        "GUID generator",
        "random UUID",
        "unique ID generator",
        "online UUID",
      ],
    },
  },

  howToUse: {
    ko: [
      "생성할 UUID 개수를 선택하세요 (1~50개).",
      "UUID 버전을 선택하세요 (현재 v4 지원).",
      "계산 버튼을 누르면 지정된 개수의 UUID가 즉시 생성됩니다.",
    ],
    en: [
      "Select the number of UUIDs to generate (1–50).",
      "Select the UUID version (v4 supported).",
      "Click Generate to instantly create the specified number of UUIDs.",
    ],
  },

  features: {
    ko: [
      "UUID v4 (랜덤) 생성",
      "최대 50개 일괄 생성",
      "표준 UUID 형식 (8-4-4-4-12) 준수",
      "암호학적으로 안전한 난수 사용",
      "생성 결과 복사 지원",
      "브라우저에서 완전히 로컬 처리",
    ],
    en: [
      "UUID v4 (random) generation",
      "Bulk generation up to 50 at once",
      "Standard UUID format (8-4-4-4-12)",
      "Cryptographically secure random numbers",
      "Copy result support",
      "Fully local processing in the browser",
    ],
  },

  useCases: {
    ko: [
      {
        title: "데이터베이스 기본 키 생성",
        description:
          "데이터베이스 레코드의 고유 식별자(Primary Key)로 사용할 UUID를 미리 생성합니다.",
        example: {
          input: "생성 개수: 3",
          output:
            "550e8400-e29b-41d4-a716-446655440000\n6ba7b810-9dad-11d1-80b4-00c04fd430c8\n...",
        },
      },
      {
        title: "API 요청 ID",
        description:
          "API 요청 추적을 위한 고유한 Request ID로 UUID를 활용합니다.",
        example: {
          input: "생성 개수: 1",
          output: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        },
      },
      {
        title: "테스트 데이터 생성",
        description:
          "개발 및 테스트 환경에서 고유 ID가 필요한 테스트 데이터를 빠르게 준비합니다.",
        example: {
          input: "생성 개수: 10",
          output: "10개의 고유 UUID 목록",
        },
      },
    ],
    en: [
      {
        title: "Database Primary Keys",
        description:
          "Pre-generate UUIDs to use as unique primary keys for database records.",
        example: {
          input: "Count: 3",
          output:
            "550e8400-e29b-41d4-a716-446655440000\n6ba7b810-9dad-11d1-80b4-00c04fd430c8\n...",
        },
      },
      {
        title: "API Request IDs",
        description: "Use UUIDs as unique request IDs for API call tracing.",
        example: {
          input: "Count: 1",
          output: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "UUID란 무엇인가요?",
      content:
        "UUID(Universally Unique Identifier)는 전 세계에서 고유성이 보장되는 128비트 식별자입니다. 표준 형식은 32개의 16진수 문자를 하이픈으로 구분한 8-4-4-4-12 형태입니다.\n\nUUID v4는 가장 널리 사용되는 버전으로, 암호학적으로 안전한 난수를 기반으로 생성됩니다. 충돌 확률이 극히 낮아 사실상 전 세계에서 유일합니다.\n\n데이터베이스 기본 키, API 요청 ID, 세션 토큰, 파일 이름 등 고유 식별자가 필요한 모든 곳에 사용할 수 있습니다. 이 도구는 브라우저의 Web Crypto API를 사용하여 보안 수준 높은 UUID를 생성합니다.",
    },
    en: {
      title: "What is a UUID?",
      content:
        "A UUID (Universally Unique Identifier) is a 128-bit identifier guaranteed to be unique worldwide. The standard format is 32 hexadecimal characters separated by hyphens in an 8-4-4-4-12 pattern.\n\nUUID v4 is the most widely used version, generated using cryptographically secure random numbers. The probability of collision is astronomically low, making it practically unique across the globe.\n\nUUIDs are used for database primary keys, API request IDs, session tokens, file names, and anywhere a unique identifier is needed. This tool uses the browser's Web Crypto API for secure UUID generation.",
    },
  },

  faq: {
    ko: [
      {
        q: "UUID v4는 정말 고유한가요?",
        a: "UUID v4는 128비트 랜덤 값을 기반으로 하므로 충돌 확률은 수십억 개를 생성해도 사실상 0에 가깝습니다. 실무에서 중복 걱정 없이 사용할 수 있습니다.",
      },
      {
        q: "생성된 UUID는 서버에 저장되나요?",
        a: "아니요, 모든 처리는 브라우저에서 로컬로 이루어집니다. 생성된 UUID는 서버로 전송되거나 저장되지 않습니다.",
      },
      {
        q: "UUID와 GUID의 차이는 무엇인가요?",
        a: "GUID(Globally Unique Identifier)는 Microsoft가 사용하는 용어로, UUID와 같은 개념입니다. 형식과 생성 방법이 동일하며 실질적으로 같은 것으로 볼 수 있습니다.",
      },
    ],
    en: [
      {
        q: "Are UUID v4 values truly unique?",
        a: "UUID v4 is based on 128 bits of randomness, making collision probability essentially zero even when generating billions of UUIDs. Safe to use without worrying about duplicates.",
      },
      {
        q: "Are generated UUIDs stored on a server?",
        a: "No, all processing is done locally in your browser. Generated UUIDs are never sent to or stored on any server.",
      },
      {
        q: "What is the difference between UUID and GUID?",
        a: "GUID (Globally Unique Identifier) is Microsoft's term for the same concept as UUID. The format and generation method are identical — they are effectively the same thing.",
      },
    ],
  },

  relatedTools: ["password-generator", "base64-encoder", "discount-calculator"],
};
