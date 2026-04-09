# Assembly Report — hash-generator

## 생성된 파일

| 파일 | 상태 |
|---|---|
| `src/tools/hash-generator/config.ts` | 생성 완료 |
| `src/tools/hash-generator/logic.ts` | 생성 완료 |
| `src/tools/hash-generator/component.tsx` | 미생성 (경계 밖 — 다음 단계) |

---

## 계약 검증 결과

### logic.ts

| 항목 | 상태 | 비고 |
|---|---|---|
| `export function process` named export | ✅ | sync 함수 |
| 시그니처: `(input: string) => Record<string, string \| number>` | ✅ | TextToText 호환 |
| 단일 반환 key `"해시 결과"` | ✅ | outputType: "text" 와 정합 |
| 빈 입력 가드 | ✅ | `{ "해시 결과": "" }` 반환 |
| 순수 함수 / 부수효과 없음 | ✅ | |
| Web Crypto API 미사용 | ✅ | 모두 sync JS 라이브러리 |
| "use client" 미선언 | ✅ | logic.ts는 불필요 |

### config.ts

| 항목 | 상태 | 비고 |
|---|---|---|
| slug: `hash-generator` | ✅ | registry 미등록 slug 확인 |
| category: `generator` | ✅ | categories.ts 존재 값 |
| template: `TextToText` | ✅ | |
| icon: `Hash` | ✅ | lucide-react 존재 |
| outputType: `"text"` | ✅ | stats 아님 (오버라이드 준수) |
| seo.ko keywords ≥ 5개 | ✅ | 8개 |
| seo.en keywords ≥ 5개 | ✅ | 7개 |
| faq.ko ≥ 3개 | ✅ | 4개 |
| faq.en ≥ 3개 | ✅ | 3개 |
| howToUse.ko ≥ 3단계 | ✅ | 3단계 |
| howToUse.en ≥ 3단계 | ✅ | 3단계 |
| features.ko ≥ 4개 | ✅ | 5개 |
| features.en ≥ 4개 | ✅ | 5개 |
| relatedTools slug 실존 | ✅ | password-generator, uuid-generator, base64-encoder, jwt-decoder 모두 registry 등록 확인 |
| FaqItem 구조 (q/a) | ✅ | types.ts 명세 준수 |
| UseCase 구조 (example: {input, output}) | ✅ | types.ts 명세 준수 (SEO 콘텐츠의 string example을 변환) |

---

## SEO 콘텐츠 변환 메모

04-seo-content.md의 콘텐츠는 거의 그대로 사용했으나 두 가지 타입 불일치를 수정했다:

1. **FaqItem**: SEO 파일은 `question`/`answer` 키를 사용했으나 `types.ts`는 `q`/`a` 를 요구함 → 변환 완료
2. **UseCase.example**: SEO 파일은 문자열 형태였으나 `types.ts`는 `{ input: string; output: string }` 객체를 요구함 → 각 example을 input/output 쌍으로 분리하여 재구성 완료

---

## 의존성 상태

`package.json`에 이미 선언됨 (이전 단계에서 추가):
```
"js-md5": "^0.8.3",
"js-sha1": "^0.7.0",
"js-sha256": "^0.11.0",
"js-sha512": "^0.9.0"
```

**npm install 실패**: WSL2에서 `/mnt/d/` (Windows NTFS 마운트)에 npm 심링크 생성 시 EPERM 오류 발생.
- 패키지는 `package.json`에 선언되어 있으므로 Windows 네이티브 터미널(PowerShell/cmd)에서 `npm install` 실행 필요.
- 또는 WSL2 내 Linux 파일시스템(`~/` 경로)으로 프로젝트 이동 시 해결됨.

---

## 다음 단계

1. **Windows 터미널에서 npm install 실행** (WSL 심링크 제한 우회)
2. **component.tsx 생성** — TextToText 래퍼 (standard pattern)
3. **registry.ts 등록** — generator 섹션에 추가
4. **TypeScript 빌드 검증** — `npm run build` 또는 `tsc --noEmit`

---

## 주의사항 (Logic Engineer 메모 인계)

logic.ts의 각 라이브러리 import는 번들러/TypeScript 설정에 따라 에러가 발생할 수 있다. 빌드 시 오류 발생 시 각 import 라인 아래의 "대안 import" 주석을 참고할 것:

- `js-md5`: default 또는 named `{ md5 }`
- `js-sha1`: default 또는 named `{ sha1 }`
- `js-sha256`: named `{ sha256 }` (권장) 또는 default
- `js-sha512`: named `{ sha384, sha512 }` (권장)
