# Architect 결과: 해시 생성기

## 기본 식별자

| 항목 | 값 |
|---|---|
| slug | `hash-generator` |
| category | `generator` |
| template | `TextToText` |
| processingType | `client` |
| icon | `Hash` (lucide-react) |

slug 중복 검사: registry.ts 확인 완료. `hash-generator`는 미등록 상태. 사용 가능.

---

## 지원 알고리즘 (확정)

사용자 결정 — 옵션 B 채택.

| 알고리즘 | 구현 | 보안 경고 |
|---|---|---|
| MD5 | `js-md5` 라이브러리 (sync) | 필요 (`⚠️`) |
| SHA-1 | `crypto.subtle.digest("SHA-1", ...)` (async) | 필요 (`⚠️`) |
| SHA-256 | `crypto.subtle.digest("SHA-256", ...)` (async) | — |
| SHA-384 | `crypto.subtle.digest("SHA-384", ...)` (async) | — |
| SHA-512 | `crypto.subtle.digest("SHA-512", ...)` (async) | — |

---

## inputConfig

```ts
inputConfig: {
  placeholder: "해시를 생성할 텍스트를 입력하세요...",
  inputLabel: "원본 텍스트",
  outputLabel: "해시 결과",
  outputType: "stats",
}
```

`outputType: "stats"` 선택 이유: 5종 해시를 나란히 카드 형태로 보여주기에 적합. 별도 `resultLabels`는 TextToText 템플릿에서 사용되지 않음 — stats 모드는 logic.ts의 return object key를 label로 그대로 사용한다 (word-counter와 동일 패턴).

**주의 — UI 제약 사항**: 현재 TextToText stats 카드는 `grid-cols-2 sm:grid-cols-4` 로 고정되어 있다. 5종 해시가 4열 그리드에 들어가면 마지막 행에 1개만 놓이는 모양새가 된다. 허용 범위. 또한 해시 hex string(64~128자)은 카드의 `text-2xl font-bold`에 그대로 표시되면 매우 못생기게 된다. **이 부분은 Config Assembler가 인지해야 할 UX 리스크**이며, stats 템플릿이 해시 표시용으로 최적은 아니다. 대안 재검토 권고 사항은 아래 "리스크" 섹션 참조.

---

## process 시그니처와 ⚠️ 템플릿 호환성 차단 이슈

### 요구되는 시그니처

```ts
async function process(input: string): Promise<Record<string, string | number>>
```

### TextToText 템플릿 현재 상태 (실측)

`src/tools/templates/TextToText.tsx:11`:

```ts
process: (input: string) => string | Record<string, string | number>;
```

`src/tools/templates/TextToText.tsx:18`:

```ts
const result = input ? process(input) : null;
```

**결론: 현재 TextToText 템플릿은 sync만 지원한다.** async process를 넘기면:
1. 타입 에러 (Promise는 `string | Record<...>` 할당 불가)
2. 런타임에서는 `result`가 Promise 객체가 되어 stats 카드 5개가 모두 `[object Promise]`로 렌더링됨
3. 입력 변경 시마다 렌더 사이클과 Promise resolve 사이 상태 관리 부재

### 해결 옵션 (Config Assembler 결정 필요)

**옵션 1 — TextToText 템플릿을 async 지원하도록 확장 (권장)**
- props 타입을 `(input: string) => (string | Record<...>) | Promise<string | Record<...>>` 로 확장
- `useState` + `useEffect`로 async result 상태 관리
- 입력 변경 시 이전 Promise 취소 플래그 (race condition 방지) 필요
- 영향 범위: 모든 기존 TextToText 툴. sync 케이스는 그대로 동작해야 한다 (하위 호환).
- CLAUDE.md 규칙 "새 템플릿 컴포넌트 무단 생성 금지"에 저촉되지 않음 — 기존 템플릿 확장임.
- CLAUDE.md 규칙 "치명적 모호성만 질문" — 이것은 치명적 기술 제약이므로 사용자 승인 필요할 수 있음.

**옵션 2 — logic.ts를 동기로 강제 (비권장)**
- 순수 JS MD5/SHA 라이브러리로 통일 (예: `crypto-js` 또는 `js-sha256` 계열 전부)
- Web Crypto API 포기 → 번들 크기 증가 (~15KB gzipped 추정)
- 리서치에서 결정한 "SHA는 Web Crypto" 기조 번복 필요

**옵션 3 — 새 템플릿 생성 (금지)**
- CLAUDE.md "새 템플릿 컴포넌트 무단 생성" 금지 규칙 위반.

### Architect 권고

**옵션 1 (TextToText async 확장)**. 이유:
- Web Crypto 기반 해시 구현은 앞으로 다른 툴(HMAC, 파일 체크섬 등)에도 재사용 가치 높음
- 번들 오염 최소
- 하위 호환 유지 가능

**Config Assembler는 이 결정을 사용자에게 알리고 승인을 구해야 한다.** 템플릿 수정은 모든 TextToText 툴에 영향을 주는 변경이므로 파이프라인 내에서 독단 진행은 부적절하다.

---

## 반환 key (Logic Engineer 명세)

stats 모드의 label은 logic return key 그대로 사용된다.

```ts
{
  "MD5 ⚠️": "<32자 hex>",
  "SHA-1 ⚠️": "<40자 hex>",
  "SHA-256": "<64자 hex>",
  "SHA-384": "<96자 hex>",
  "SHA-512": "<128자 hex>",
}
```

빈 입력 처리: `input === ""` 일 때 process는 호출되지 않음 (TextToText가 `input ? process(input) : null`로 가드). 단 async 확장 시에도 이 가드는 유지되어야 한다.

---

## Logic Engineer 상세 지침

### 의존성 추가
- `package.json`에 `"js-md5": "^0.8.3"` (또는 리서치에서 명시한 최신) 추가
- Config Assembler 또는 Logic Engineer가 `npm install js-md5` 실행

### 구현 뼈대

```ts
import md5 from "js-md5";

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha(algo: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512", input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest(algo, data);
  return bufferToHex(hash);
}

export async function process(input: string): Promise<Record<string, string>> {
  if (!input) {
    return {
      "MD5 ⚠️": "",
      "SHA-1 ⚠️": "",
      "SHA-256": "",
      "SHA-384": "",
      "SHA-512": "",
    };
  }

  const [sha1, sha256, sha384, sha512] = await Promise.all([
    sha("SHA-1", input),
    sha("SHA-256", input),
    sha("SHA-384", input),
    sha("SHA-512", input),
  ]);

  return {
    "MD5 ⚠️": md5(input),
    "SHA-1 ⚠️": sha1,
    "SHA-256": sha256,
    "SHA-384": sha384,
    "SHA-512": sha512,
  };
}
```

### 제약
- 부수효과 금지 (CLAUDE.md 규칙)
- 외부 API 호출 금지 (`crypto.subtle`은 브라우저 내장이므로 허용)
- 서버 실행 가능성 고려: `crypto.subtle`은 브라우저 전용. logic.ts가 서버에서 import되면 안 됨. 현 registry.ts는 config만 서버에서 참조하고 component는 dynamic import이므로 안전.

---

## relatedTools

registry.ts 확인 기반 (실제 등록된 slug):

```ts
relatedTools: ["password-generator", "uuid-generator", "base64-encoder", "jwt-decoder"]
```

선정 근거:
- `password-generator`: 같은 generator 카테고리, 보안 연관
- `uuid-generator`: 같은 generator 카테고리, 고유 식별자 생성
- `base64-encoder`: 개발자가 해시와 함께 자주 사용하는 인코딩 툴
- `jwt-decoder`: JWT 서명은 HMAC-SHA256 기반으로 해시와 직접 연관

---

## SEO / 콘텐츠 요구사항 (Config Assembler/SEO Writer용)

최소 충족 기준 (CLAUDE.md):
- seo.ko / seo.en 둘 다
- keywords 각 locale 5개 이상
- faq 각 locale 3개 이상
- howToUse 각 locale 3단계 이상
- features 각 locale 4개 이상

리서치 01-research.md에 소재 풍부. 특히 FAQ 후보 8개는 그대로 활용 가능.

### 강조해야 할 차별점
1. 5종 알고리즘 동시 출력
2. 브라우저 로컬 처리 (서버 전송 없음)
3. MD5/SHA-1 보안 경고 배지
4. 원클릭 복사 (템플릿 기본 제공 — stats 모드에서 CopyButton은 미노출이므로 **UX 리스크**임, 아래 참조)

---

## ⚠️ 리스크 및 Config Assembler 확인 사항

### 리스크 1 — TextToText 템플릿이 async 미지원 (최우선 블로커)
이미 위에 상술. Config Assembler가 사용자 승인 받아 템플릿 확장 여부 결정.

### 리스크 2 — stats 모드에서 해시 값 표시 부적합
`TextToText.tsx:56`:

```tsx
<div className="text-2xl font-bold text-primary">{value}</div>
```

SHA-512 hex는 128자. `text-2xl font-bold`로는 카드를 터뜨린다. 또한 stats 모드는 CopyButton을 제공하지 않는다(`TextToText.tsx:67` — string 결과일 때만 표시). 즉 **"각 해시별 원클릭 복사"라는 차별화 포인트가 현재 템플릿으로는 불가능**하다.

**권고**: Config Assembler는 다음 중 하나를 사용자에게 제시:
1. TextToText 템플릿 stats 모드에 "긴 값" 렌더링 + 카드별 CopyButton 지원 추가 (옵션 1과 함께 수행)
2. 템플릿 제약을 받아들이고 원클릭 복사를 포기 (SEO 포지셔닝 약화)
3. 별도 커스텀 컴포넌트 (CLAUDE.md "새 템플릿 금지"와 충돌 — 재논의 필요)

### 리스크 3 — 번들 증가
`js-md5` ~3KB gzipped. 허용 범위. 이미 결정됨.

### 리스크 4 — 서버 사이드 안전성
logic.ts가 SSR 경로에서 import되면 `crypto.subtle` 미존재로 에러. 현재 아키텍처상 component.tsx는 dynamic import이므로 logic.ts도 클라이언트에서만 로드된다. 안전. Logic Engineer는 logic.ts 최상단에 "use client" 선언 불필요 (component.tsx에만 필요).

---

## Config Assembler에게 명시 보고 사항

1. **[BLOCKER]** TextToText 템플릿이 sync process만 지원. async 확장이 필수이며 이는 모든 기존 TextToText 툴에 영향. 사용자 승인 받고 진행 요망.
2. **[UX]** stats 카드는 긴 hex 해시 표시에 부적합하며 카드별 복사 버튼도 없다. 템플릿 수정 범위에 포함 고려.
3. **[DEPENDENCY]** `js-md5` npm 설치 필요.
4. **[REGISTRY]** `hash-generator` slug 미등록 확인 완료. registry.ts의 generator 섹션에 추가 (현재 `loremIpsumGeneratorConfig`, `passwordGeneratorConfig`, `uuidGeneratorConfig` 다음).

---

## 파이프라인 다음 단계 입력 요약

- SEO Writer: 리서치 01-research.md + 본 문서의 "SEO / 콘텐츠" 섹션 참고
- Logic Engineer: 본 문서 "Logic Engineer 상세 지침" 섹션이 완전한 명세
- Config Assembler: 본 문서 "리스크 및 확인 사항" 4개 모두 사용자에게 전달 후 진행

---

## 🔄 최종 결정 오버라이드 (사용자 승인)

블로커 해결 방향: **옵션 A 채택**

### 변경사항
- **알고리즘 구현**: 모두 **sync JS 라이브러리** 사용
  - MD5 → `js-md5`
  - SHA-1 → `js-sha1`
  - SHA-256 → `js-sha256`
  - SHA-384 → `js-sha512` (SHA-384는 `js-sha512/sha384` 서브경로)
  - SHA-512 → `js-sha512`
- **Web Crypto API 미사용** (async 문제 회피)
- **outputType**: `"text"` (카드 대신 포맷된 텍스트 출력)
- **process 시그니처**: `(input: string) => string` (sync, 단일 문자열 반환)

### 반환 포맷 (예시)
```
MD5  ⚠️  (보안 취약)
5d41402abc4b2a76b9719d911017c592

SHA-1  ⚠️  (보안 취약)
aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d

SHA-256
2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824

SHA-384
59e1748777448c69de6b800d7a33bbfb9ff1b463e44354c3553bcdb9c666fa90125a3c79f90397bdf5f6a13de828684f

SHA-512
9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043
```

### 복사 UX
- 전체 출력 복사: TextToText 템플릿 내장 복사 버튼 사용
- 개별 해시 복사: 수동 선택 (Phase 2에서 `HashDisplay` 템플릿 정식 추가 시 개선)

### Logic Engineer 구현 뼈대
```typescript
import md5 from "js-md5";
import sha1 from "js-sha1";
import sha256 from "js-sha256";
import { sha384, sha512 } from "js-sha512";

export function process(input: string): string {
  if (!input) return "";
  
  return [
    `MD5  ⚠️  (보안 취약)`,
    md5(input),
    ``,
    `SHA-1  ⚠️  (보안 취약)`,
    sha1(input),
    ``,
    `SHA-256`,
    sha256(input),
    ``,
    `SHA-384`,
    sha384(input),
    ``,
    `SHA-512`,
    sha512(input),
  ].join("\n");
}
```

### package.json 의존성 추가 필요
```
"js-md5": "^0.8.0",
"js-sha1": "^0.7.0",
"js-sha256": "^0.11.0",
"js-sha512": "^0.9.0"
```
