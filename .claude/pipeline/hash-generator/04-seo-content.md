# SEO Content — hash-generator

아래는 `src/tools/hash-generator/config.ts`에 그대로 주입 가능한 SEO 블록이다.
(slug, category, template, icon, inputConfig 등 식별자 블록은 Config Assembler가 조립)

```ts
seo: {
  ko: {
    title: "해시 생성기 - MD5, SHA-1, SHA-256, SHA-384, SHA-512 온라인 변환",
    description:
      "텍스트를 MD5, SHA-1, SHA-256, SHA-384, SHA-512 해시로 한 번에 변환하는 무료 온라인 해시 생성기. 입력은 브라우저에서 로컬 처리되어 서버로 전송되지 않으며, 파일 체크섬, API 시그니처, 블록체인 해시 확인 등 개발자 작업에 바로 사용할 수 있습니다.",
    keywords: [
      "해시 생성기",
      "MD5 해시 생성기",
      "SHA-256 변환기",
      "SHA-1 SHA-512 생성기",
      "온라인 해시 변환",
      "문자열 해시 계산기",
      "체크섬 생성기",
      "해시값 계산기",
    ],
  },
  en: {
    title: "Hash Generator - MD5, SHA-1, SHA-256, SHA-384, SHA-512 Online",
    description:
      "Free online hash generator that converts text into MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes at once. All processing runs locally in your browser with no server upload — ideal for file checksums, API signatures, and blockchain hash verification.",
    keywords: [
      "hash generator online",
      "md5 hash generator",
      "sha256 generator",
      "sha1 sha512 online",
      "text to hash converter",
      "online hash calculator",
      "checksum generator",
    ],
  },
},

content: {
  ko: {
    guide:
      "해시 생성기는 입력한 텍스트를 MD5, SHA-1, SHA-256, SHA-384, SHA-512 다섯 가지 알고리즘의 해시값으로 한 번에 변환합니다. 모든 계산은 브라우저 안에서 JavaScript로 수행되므로 입력 내용이 서버로 전송되지 않습니다. 파일 체크섬 검증, API 서명 확인, 블록체인 트랜잭션 해시 대조, 개발·테스트용 해시 생성 등에 바로 활용할 수 있습니다. 주의: MD5와 SHA-1은 충돌 공격이 실증되어 보안 용도로 더 이상 권장되지 않으며, 본 도구에서도 ⚠️ 배지로 표시됩니다. 비밀번호 저장에는 단순 해시 대신 bcrypt, argon2, scrypt 같은 전용 알고리즘을, 디지털 서명과 무결성 검증에는 SHA-256 이상을 사용하세요.",
    howToUse: [
      "상단 입력창에 해시로 변환할 텍스트를 붙여넣거나 직접 입력합니다.",
      "MD5, SHA-1, SHA-256, SHA-384, SHA-512 다섯 종의 해시값이 즉시 출력 영역에 표시됩니다.",
      "필요한 해시 줄을 선택해 복사하거나, 전체 복사 버튼으로 결과 블록을 한 번에 가져갑니다.",
    ],
    features: [
      "MD5·SHA-1·SHA-256·SHA-384·SHA-512 다섯 알고리즘을 한 번의 입력으로 동시에 출력",
      "입력값이 서버로 전송되지 않는 100% 브라우저 로컬 처리 방식",
      "MD5·SHA-1에 ⚠️ 보안 경고 배지를 표시해 안전한 사용을 유도",
      "결과 전체 복사 버튼으로 문서·이슈 트래커·스크립트에 바로 붙여넣기 가능",
      "설치·회원가입·사용량 제한 없이 무료로 즉시 사용",
    ],
    useCases: [
      {
        title: "파일 체크섬 및 무결성 검증",
        description:
          "다운로드한 파일의 SHA-256 체크섬이 배포자가 공개한 값과 일치하는지 텍스트 기반으로 빠르게 대조합니다.",
        example:
          "릴리스 노트의 SHA-256 값과 도구가 계산한 값을 나란히 비교하여 파일 변조 여부 확인",
      },
      {
        title: "API 요청 시그니처 생성",
        description:
          "HMAC 기반 API 서명을 작성하기 전 단계에서 payload의 SHA-256 해시를 즉시 확인하고 싶을 때 사용합니다.",
        example:
          "AWS·토스·카카오 API 요청 body의 SHA-256 해시를 계산해 개발자 문서 예시와 대조",
      },
      {
        title: "블록체인 트랜잭션·블록 해시 확인",
        description:
          "SHA-256 더블 해시 기반 체인에서 특정 문자열의 해시 산출값을 수동으로 확인할 때 활용합니다.",
        example:
          "비트코인 블록 헤더의 일부 필드를 붙여넣어 예상 해시값을 즉석에서 계산",
      },
    ],
    faq: [
      {
        question: "입력한 텍스트가 서버로 전송되나요?",
        answer:
          "아니요. 이 해시 생성기는 모든 계산을 브라우저 안의 JavaScript로 수행하며, 네트워크로 어떤 데이터도 전송하지 않습니다. 민감한 개발용 문자열이나 내부 설정값도 안심하고 붙여넣을 수 있습니다.",
      },
      {
        question: "MD5와 SHA-1은 왜 ⚠️ 경고가 붙나요?",
        answer:
          "MD5는 2004년 이후 실용적 충돌 공격이 알려져 있고 SHA-1도 2017년 SHAttered 공격으로 충돌이 공개되어, 현재 디지털 서명·TLS·암호학적 무결성 용도로는 권장되지 않습니다. 호환성 확인이나 비암호 체크섬용으로는 여전히 쓰이지만, 보안 목적이라면 SHA-256 이상을 사용해야 합니다.",
      },
      {
        question: "비밀번호를 SHA-256으로 저장해도 되나요?",
        answer:
          "권장하지 않습니다. SHA 계열은 속도가 빨라 GPU로 초당 수십억 건의 추측이 가능하므로 비밀번호 저장에는 부적합합니다. 비밀번호는 bcrypt, argon2, scrypt처럼 작업 계수(work factor)를 조절할 수 있는 전용 해시 알고리즘으로 솔트(salt)와 함께 저장해야 합니다.",
      },
      {
        question: "같은 입력에서 왜 항상 같은 해시가 나오나요?",
        answer:
          "해시 함수는 결정적(deterministic) 함수이므로 동일한 입력은 언제 어디서 실행하더라도 항상 같은 해시를 반환합니다. 반대로 해시값에서 원래 텍스트를 복원하는 것은 수학적으로 불가능에 가까우며, 레인보우 테이블을 통한 부분적 역추적만 제한적으로 가능합니다.",
      },
    ],
  },
  en: {
    guide:
      "This hash generator converts any text into MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes in a single step. All hashing runs locally in your browser via JavaScript, so your input is never uploaded to any server. It is built for developer workflows such as file checksum verification, API signature generation, blockchain hash checks, and test data creation. Note that MD5 and SHA-1 are considered cryptographically broken and are flagged with a ⚠️ warning — use SHA-256 or stronger for signatures and integrity checks, and use bcrypt/argon2/scrypt for password storage.",
    howToUse: [
      "Paste or type the text you want to hash into the input field at the top.",
      "The tool instantly outputs all five hashes — MD5, SHA-1, SHA-256, SHA-384, and SHA-512.",
      "Copy the individual line you need, or use the copy button to grab the entire result block.",
    ],
    features: [
      "Generates MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes simultaneously from a single input",
      "100% client-side processing — input never leaves your browser",
      "⚠️ security warning badges on MD5 and SHA-1 to guide safer usage",
      "One-click full copy for pasting into docs, issue trackers, or shell scripts",
      "Completely free with no signup, installation, or rate limit",
    ],
    useCases: [
      {
        title: "File checksum verification",
        description:
          "Quickly compare a published SHA-256 checksum against the value you compute locally to confirm a download has not been tampered with.",
        example:
          "Match the SHA-256 listed in a GitHub release against the hash produced by this tool",
      },
      {
        title: "API signature and blockchain hash checks",
        description:
          "Compute SHA-256 of an API request payload while building HMAC signatures, or verify that a blockchain transaction string produces the expected hash.",
        example:
          "Hash an AWS request body or a Bitcoin block header field to cross-check documentation samples",
      },
    ],
    faq: [
      {
        question: "Is my input sent to a server?",
        answer:
          "No. All hashing happens inside your browser using JavaScript, and no network request is made with your input. You can safely paste sensitive development strings or configuration snippets.",
      },
      {
        question: "Why are MD5 and SHA-1 marked with a warning?",
        answer:
          "MD5 has had practical collision attacks since 2004, and SHA-1 was broken by the SHAttered attack in 2017. They are no longer recommended for digital signatures, TLS, or any cryptographic integrity use. They remain fine for legacy compatibility or non-security checksums, but for any security-sensitive purpose use SHA-256 or stronger.",
      },
      {
        question: "Can I use SHA-256 to store passwords?",
        answer:
          "No. SHA-family hashes are designed to be fast, which means GPUs can guess billions of passwords per second. For password storage use a purpose-built algorithm such as bcrypt, argon2, or scrypt with a unique salt per user and a tunable work factor.",
      },
    ],
  },
},

relatedTools: ["password-generator", "uuid-generator", "base64-encoder", "jwt-decoder"],
```

## 품질 체크리스트

- [x] title에 "Toolhub" 미포함 (ko/en)
- [x] title에 MD5·SHA-1·SHA-256·SHA-384·SHA-512 명시 (ko/en)
- [x] keywords ko 8개 (≥7), en 7개 (≥6)
- [x] faq ko 4개, en 3개
- [x] howToUse ko 3단계, en 3단계
- [x] features ko 5개, en 5개
- [x] useCases ko 3개(example 포함), en 2개(example 포함)
- [x] guide ko 약 430자 (≥200), en 약 640자 (≥150)
- [x] 브라우저 로컬 처리 / 서버 전송 없음 강조 (guide·features·faq)
- [x] MD5/SHA-1 보안 경고 (guide·features·faq)
- [x] bcrypt/argon2/scrypt 권장 언급 (guide·faq)
- [x] useCases: 파일 체크섬, API 시그니처, 블록체인 해시 확인 포함
- [x] relatedTools는 registry.ts 실제 등록 slug만 사용 (architect 03 확인)
