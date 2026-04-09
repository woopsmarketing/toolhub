# Architect: CSV ↔ JSON 변환기

## 1. 기본 식별자

| 항목 | 값 | 비고 |
|------|-----|------|
| slug | `csv-json-converter` | registry 충돌 없음 확인 |
| category | `developer` | JSON/Base64/JWT 등과 함께 배치. CSV/JSON은 개발자·기획자 혼합 타깃이지만 포맷 변환은 developer 카테고리가 SEO/사용자 기대치에 부합 |
| template | `TextToText` | 텍스트 입력 → 텍스트(코드) 출력 |
| processingType | `client` | 전량 브라우저 처리, 서버 전송 없음 (경쟁사 대비 강조 포인트) |
| icon | `ArrowLeftRight` | lucide-react 공식 아이콘. 양방향 변환 의미 전달 |

## 2. 템플릿 / inputConfig 구조

```ts
inputConfig: {
  placeholder: "CSV 또는 JSON을 붙여넣으세요. 첫 글자로 방향을 자동 판별합니다.",
  inputLabel: "입력 (CSV 또는 JSON)",
  outputLabel: "변환 결과",
  inputType: "code",
  outputType: "code",
}
```

**중요 판단**: `outputType: "code"` 사용.
- 연구 노트의 "방향 표시" 요구는 실제 변환된 텍스트(코드) 한 덩어리를 주 출력으로 노출해야 하므로 `stats`가 부적합.
- TextToText 템플릿의 `outputType: "code"`는 `process()` 반환 객체의 **첫 번째 key의 value**를 코드 블록으로 렌더링하는 기존 관례를 따른다 (json-formatter 레퍼런스).
- 따라서 `process` 반환은 단일 key("변환 결과")에 변환 결과 문자열을 담고, 방향 정보는 그 문자열의 첫 줄 주석 또는 헤더 형태로 포함하지 않고 **별도 key는 사용하지 않는다**. 방향 메타는 features/guide에서 설명하고, 에러 시에만 에러 메시지를 동일 key에 담는다.

## 3. process() 시그니처 & 반환 규격

```ts
export function process(input: string): Record<string, string | number>
```

**반환 스키마 (단일 key)**:
```ts
{ "변환 결과": string }
```

- 빈 입력 → `{ "변환 결과": "" }`
- 정상 CSV → `{ "변환 결과": "<JSON pretty-printed 2-space>" }`
- 정상 JSON → `{ "변환 결과": "<CSV RFC4180>" }`
- 에러 → `{ "변환 결과": "// 오류: <사유>" }`  (code 블록에 주석 형태로 보여 UI가 깨지지 않도록)

> Logic Engineer 주의: key 이름은 반드시 정확히 `"변환 결과"` 문자열. json-formatter가 outputType: "code"에서 첫 key를 사용하는 관례를 그대로 따른다.

## 4. 방향 자동 감지 알고리즘

```
1. trimmed = input.trim()
2. if (trimmed === "") → return empty
3. first = trimmed[0]
4. if (first === "[" || first === "{") → JSON → CSV 모드
   else → CSV → JSON 모드
```

엣지: BOM(`\uFEFF`) 제거 후 판정. 선행 공백/개행 허용.

## 5. CSV → JSON 변환 명세 (RFC 4180)

**파서 요건**:
- 구분자: 쉼표(`,`) 고정 (Phase 1). 세미콜론/탭은 FAQ에 "추후 옵션" 언급만.
- 줄바꿈: `\r\n`, `\n`, `\r` 모두 지원.
- 따옴표 필드: 큰따옴표(`"`)로 감싸진 필드는 내부 쉼표·줄바꿈 허용. 내부 `""`는 리터럴 `"`로 해석.
- 첫 줄 = 헤더. 헤더 key 중복 시 뒤 값이 덮어씀.
- 헤더보다 값이 부족한 행 → 누락 key는 빈 문자열 `""`.
- 값이 부동소수/정수/true/false/null 패턴에 매칭되면 **문자열 그대로 유지** (안전성 우선, Phase 1 기본은 문자열 보존. 자동 타입 추론은 복잡도/혼동 위험이 커서 보류).
- 출력: `JSON.stringify(array, null, 2)`
- 빈 CSV(헤더만 존재) → `[]`

**파서 구현 방식**: 상태머신 기반 문자 단위 스캔. 정규식/split 분해 금지 (따옴표 이스케이프 깨짐).

```
상태: FIELD_START | IN_UNQUOTED | IN_QUOTED | QUOTE_IN_QUOTED
이벤트: char, ",", newline, EOF
결과: rows: string[][]
```

**에러 케이스**:
- 닫히지 않은 따옴표 → "따옴표가 닫히지 않았습니다"
- 헤더가 없음 (빈 입력 아닌데 헤더 파싱 실패) → "CSV 헤더를 찾을 수 없습니다"

## 6. JSON → CSV 변환 명세

**입력 허용 형태**:
1. 객체 배열: `[{...}, {...}]` — 표준 케이스
2. 단일 객체: `{...}` — 1행짜리 배열로 래핑
3. 원시값 배열: `[1, "a"]` — value 단일 컬럼 CSV로 변환 (헤더 `value`)
4. 중첩 객체 포함 배열: dot notation 평면화 (1단계)
   - `{user: {name: "kim"}}` → `user.name`
   - 배열 값은 `JSON.stringify()`로 직렬화해 문자열 필드로 삽입
5. 그 외 (숫자/문자열/null 단독) → 에러

**헤더 수집**:
- 모든 객체(평면화 후)의 key 합집합 순서 보존.
- 첫 객체의 key 순서를 우선하고, 이후 객체에서 처음 등장하는 key를 뒤에 append.

**값 직렬화 & 이스케이프 (RFC 4180)**:
- `null` / `undefined` → 빈 문자열
- boolean/number → `String(v)`
- object/array → `JSON.stringify(v)` 후 아래 이스케이프 적용
- 문자열 내 `,`, `"`, `\n`, `\r` 중 하나라도 포함 → 전체를 `"`로 감싸고 내부 `"`는 `""`로 escape

**행 구분자**: `\n` (LF) 고정. BOM은 붙이지 않음 (FAQ에서 엑셀 한글 깨짐 시 BOM 수동 추가 안내).

**에러 케이스**:
- `JSON.parse` 실패 → "올바른 JSON이 아닙니다: <메시지>"
- 지원하지 않는 루트 타입 → "객체 또는 객체 배열만 변환할 수 있습니다"
- 빈 배열 `[]` → 빈 문자열 출력

## 7. 공통 엣지케이스

| 케이스 | 처리 |
|--------|------|
| 빈 입력 / 공백만 | 빈 문자열 반환 |
| BOM 선행 | 제거 후 처리 |
| 한글 필드 | UTF-8 그대로 유지, JSON 출력 시 `JSON.stringify` 기본(비 ASCII 유니코드 이스케이프 **안 함**) |
| 매우 큰 입력 (>1MB) | 그대로 처리. UI 경고 없음 (Phase 1) |
| 헤더 중복 | 뒤 값이 덮어씀 |
| CSV 끝의 trailing newline | 허용, 빈 행은 무시 |

## 8. relatedTools

registry 실존 slug 기준:
```ts
relatedTools: ["json-formatter", "base64-encoder", "url-encoder", "text-diff"]
```
- `json-formatter`: 변환 후 JSON 검증/재포맷
- `base64-encoder`: 데이터 인코딩 워크플로우 인접
- `url-encoder`: 동일 카테고리 인접 툴
- `text-diff`: 변환 전후 비교

## 9. SEO / 콘텐츠 요건 (SEO Writer 전달 사항)

- **title(ko)**: `CSV ↔ JSON 변환기` (기본) / description에 "온라인 무료 양방향 변환" 포함
- **title(en)**: `CSV ↔ JSON Converter`
- **keywords**: 각 locale 7개 이상 (연구 키워드 반영)
- **faq**: 각 locale 4개 이상 (연구 FAQ 후보에서 선택; 양방향 자동 감지, 로컬 처리, 중첩 JSON, 한글/BOM)
- **howToUse**: 각 locale 3단계
- **features**: 각 locale 6개 (양방향 자동 감지 / RFC 4180 / 한글 지원 / 로컬 처리 / 중첩 JSON 평면화 / 에러 메시지)
- **useCases**: 각 locale 2~3개 (API 응답을 CSV로 저장, 엑셀 데이터를 JSON으로 변환 등)
- **guide**: 각 locale 1개 (CSV와 JSON 차이, 자동 감지 원리, 로컬 처리 보안)

## 10. 파일 구조 산출물 (다음 단계 생성 대상)

```
src/tools/csv-json-converter/
├── config.ts       ← SEO Writer 담당
├── logic.ts        ← Logic Engineer 담당
└── component.tsx   ← 표준 래퍼 (TextToText + config + process)
```

`src/tools/registry.ts` 수정:
1. `import { config as csvJsonConverterConfig } from "./csv-json-converter/config";`
2. `// Developer` 섹션 `markdownPreviewConfig` 아래에 `csvJsonConverterConfig` 추가

`src/app/[locale]/tools/[slug]/page.tsx` — **수정 금지**.

## 11. component.tsx 표준 코드 (확정)

```tsx
"use client";

import TextToText from "@/tools/templates/TextToText";
import { config } from "./config";
import { process } from "./logic";

export default function CsvJsonConverterTool() {
  return <TextToText tool={config} process={process} />;
}
```

## 12. 검증 체크리스트 (완료 기준)

- [ ] `csv-json-converter` slug registry 유일성
- [ ] `process()` 반환 key는 정확히 `"변환 결과"` 단일 key
- [ ] CSV→JSON 변환 후 결과가 유효한 JSON (`JSON.parse` 성공)
- [ ] JSON→CSV 변환 후 결과가 RFC 4180 준수
- [ ] 빈 입력 시 빈 결과 (throw 없음)
- [ ] 잘못된 입력 시 에러 메시지를 반환 key에 주석 형태로 담음 (throw 없음)
- [ ] 한글 CSV/JSON 왕복(round-trip) 테스트 통과
- [ ] TypeScript strict 통과
- [ ] registry import 및 배열 등록 1곳 수정만 발생
