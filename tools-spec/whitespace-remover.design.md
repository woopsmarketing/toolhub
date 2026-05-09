# whitespace-remover — 설계 노트

> **STAGE 1.4 — tool-designer 산출물.** 9개 템플릿 중 1개 선정 + 입출력 골격 + logic.ts 시그니처 결정.

## 1. 선정 템플릿: `text-to-text`

**사유:**
- 입력 = 단일 textarea (정리할 텍스트), 출력 = 단일 textarea (정리된 텍스트)
- 옵션 없음 (고정 동작) → form-to-result 불필요
- 실시간 갱신은 필요하지만 결과가 텍스트(HTML 렌더 X)이므로 live-preview 불필요
- 9개 enum 중 가장 단순한 매칭. `word-counter`, `case-converter`, `text-reverser` 와 동일 패턴.

**대안 검토:**
| 템플릿 | 채택 X 사유 |
|--------|-------------|
| form-to-result | 폼 필드 없음 (텍스트 단일 입력만 있음) |
| live-preview | 출력이 plain text 이므로 HTML 렌더 불필요 |
| multi-input | 단일 입력만 사용 |
| 그 외 | 파일/이미지/실시간 등 부적합 |

## 2. inputConfig (확정)

```ts
inputConfig: {
  inputLabel:  "정리할 텍스트" / "Text to clean"
  outputLabel: "정리된 텍스트" / "Cleaned text"
  placeholder: "여기에 텍스트를 붙여넣으세요..." / "Paste the text you want to clean..."
  inputType:   "text"
  outputType:  "text"  // ← stats 아님. resultLabels 불필요.
}
```

## 3. logic.ts 시그니처 (타입만)

```ts
/**
 * 입력 텍스트의 공백을 정리한다.
 *
 * 동작 (한 번에 3가지):
 *  1) 각 줄을 trim (앞뒤 공백 제거)
 *  2) 줄 내부의 연속된 공백·탭을 단일 공백으로 압축
 *  3) 공백만 있는 줄 제거, 단 의미 있는 줄 사이의 \n 은 보존
 *
 * 순수 함수. 외부 의존성 없음. 외부 API 호출 없음.
 */
export function process(input: string): string;
```

**알고리즘 요약:**
```
1. input.split("\n")        → 각 줄
2. line.replace(/[ \t]+/g, " ").trim()  → 줄 단위 정리
3. filter(line => line.length > 0)      → 빈 줄 제거
4. join("\n")               → 다시 합침
```

**복잡도:** O(N) (N = 입력 길이). 1만 글자 ~ 0.5ms 미만 (V8).

## 4. UX 결정

| 항목 | 결정 |
|------|------|
| 실시간 갱신 | ✅ — TextToText 템플릿 기본 동작 (입력 변경 → process 즉시 호출) |
| Clear 버튼 | ✅ — TextToText 템플릿 기본 제공 |
| Copy 버튼 | ✅ — TextToText 템플릿 기본 제공 |
| 통계 카드 | ❌ — outputType=text 이므로 표시 X |
| 다운로드 | ❌ (1차) — 결과 텍스트 짧으면 Copy 만으로 충분. 추후 ToolActions 의 다운로드 버튼이 자동 처리 |
| 옵션 (모드 선택) | ❌ (1차) — 단일 고정 동작. 추후 옵션화 시 form-to-result 로 전환 |

## 5. 엣지 케이스 / 테스트 시나리오

unit-tester 가 작성할 케이스 (참고):

| # | 입력 | 기대 출력 | 의도 |
|---|------|-----------|------|
| 1 | `""` | `""` | 빈 문자열 |
| 2 | `"   hello   "` | `"hello"` | trim |
| 3 | `"a   b\t\tc"` | `"a b c"` | collapse |
| 4 | `"line1\n\n\nline2"` | `"line1\nline2"` | empty line removal |
| 5 | `"line1\n   \nline2"` | `"line1\nline2"` | whitespace-only line removal |
| 6 | `"\n\n\n"` | `""` | only whitespace |
| 7 | `"  a  \n  b  "` | `"a\nb"` | combined trim + line preserve |

## 6. 다음 STAGE 입력

이 design.md + draft.json 으로 다음 STAGE 들이 동작:
- **STAGE 4 (tool-developer)** → `src/tools/whitespace-remover/{config.ts, logic.ts, component.tsx}` 작성
- **STAGE 7 (unit-tester)** → 위 7개 케이스 + boundary 테스트
