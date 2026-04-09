# Logic Code: hash-generator

## 시그니처 확정

```typescript
export function process(input: string): Record<string, string | number>
```

- sync 함수 (Web Crypto API 미사용, js-* 라이브러리만 사용)
- 반환은 TextToText 템플릿 호환을 위한 `Record<string, string | number>`
- 단일 key `"해시 결과"` 에 포맷된 멀티라인 문자열을 담음
- 빈 입력 → `{ "해시 결과": "" }`

---

## 구현 코드

```typescript
// src/tools/hash-generator/logic.ts
//
// Sync hash generation using pure-JS libraries (no Web Crypto API).
// 각 라이브러리의 export 형태가 다르므로 아래 import 방식을 사용한다.
//
// - js-md5:    default export (function) 또는 { md5 } named export. default export가 호환성 최선.
// - js-sha1:   default export (function). 과거 버전은 named export도 함께 제공.
// - js-sha256: named export `{ sha256 }` 가 표준. default import는 버전에 따라 실패.
// - js-sha512: named export `{ sha384, sha512 }` 가 표준.
//
// 만약 빌드 시 import 오류 발생하면 아래 "대안 import" 주석 참고.

import md5 from "js-md5";
// 대안: import { md5 } from "js-md5";
import sha1 from "js-sha1";
// 대안: import { sha1 } from "js-sha1";
import { sha256 } from "js-sha256";
// 대안: import sha256 from "js-sha256";
import { sha384, sha512 } from "js-sha512";
// 대안: import sha512Default from "js-sha512"; const { sha384, sha512 } = sha512Default;

export function process(input: string): Record<string, string | number> {
  if (!input) {
    return { "해시 결과": "" };
  }

  const lines = [
    "MD5  ⚠️  (보안 취약)",
    md5(input),
    "",
    "SHA-1  ⚠️  (보안 취약)",
    sha1(input),
    "",
    "SHA-256",
    sha256(input),
    "",
    "SHA-384",
    sha384(input),
    "",
    "SHA-512",
    sha512(input),
  ];

  return { "해시 결과": lines.join("\n") };
}
```

---

## 계약 검증 체크

| 항목 | 상태 | 비고 |
|---|---|---|
| `export function process` 존재 | ✅ | named export |
| 시그니처: `(input: string) => Record<string, string \| number>` | ✅ | TextToText 호환 |
| sync (Promise 미반환) | ✅ | Web Crypto 사용 안 함 |
| 순수 함수 | ✅ | 외부 상태/API 호출 없음 |
| 부수효과 없음 | ✅ | I/O, 전역 변경 없음 |
| 빈 입력 가드 | ✅ | `{ "해시 결과": "" }` 반환 |
| 반환 key 단일성 | ✅ | `"해시 결과"` 한 개 |
| 사용 라이브러리 | ✅ | js-md5, js-sha1, js-sha256, js-sha512 |
| "use client" 선언 | ❌(불필요) | logic.ts는 클라이언트 경로에서만 import됨 |

---

## Import 주의사항 (중요)

각 `js-sha*` 라이브러리는 버전과 번들러 설정에 따라 export 방식이 다르게 해석될 수 있다. TypeScript + Next.js 15 + `esModuleInterop: true` 환경에서의 가장 안정적인 조합은 다음과 같다:

1. **js-md5**: `import md5 from "js-md5"` — default import 안정적
2. **js-sha1**: `import sha1 from "js-sha1"` — default import 안정적
3. **js-sha256**: `import { sha256 } from "js-sha256"` — named import 권장 (default는 일부 번들러에서 undefined)
4. **js-sha512**: `import { sha384, sha512 } from "js-sha512"` — named import 표준

빌드 시 `"X has no default export"` 또는 `"X is not a function"` 오류 발생 시:
- 위 주석의 "대안 import" 라인으로 교체
- 최후 수단: `import * as md5Mod from "js-md5"; const md5 = (md5Mod as any).default ?? (md5Mod as any).md5 ?? md5Mod;`

---

## 의존성 설치 필요

`package.json`에 아래 의존성이 추가되어 있어야 한다 (Config Assembler 책임):

```
"js-md5": "^0.8.0",
"js-sha1": "^0.7.0",
"js-sha256": "^0.11.0",
"js-sha512": "^0.9.0"
```

현재 `node_modules` 확인 결과 **미설치 상태**이므로 `npm install js-md5 js-sha1 js-sha256 js-sha512` 실행 필요.

---

## Config/Template 정합성 메모

- 본 logic은 `outputType: "text"` 를 가정하여 단일 포맷 문자열을 반환한다.
- 그러나 반환 타입을 `Record<string, string | number>` 로 유지했기 때문에, config의 `outputType`은 `"stats"` 로도 동작은 한다 (단일 stat 카드에 긴 텍스트가 들어가 UX가 나쁨). **Config Assembler는 반드시 `outputType: "text"` 를 사용해야 한다.**
- `resultLabels` 불필요 (stats 모드가 아니므로).
