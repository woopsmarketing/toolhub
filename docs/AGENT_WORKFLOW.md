# Agent Workflow — 표준 작업 절차

> **이 문서는 새 Agent 세션이 작업을 시작하기 전 반드시 읽는다.**
> CLAUDE.md가 "무엇을 하면 안 되는지"라면, 이 문서는 "어떤 순서로 작업할지"이다.

---

## 0. 첫 5분 — 컨텍스트 파악 체크리스트

새 세션을 시작하면 다음 순서로 컨텍스트를 잡는다:

```
1. CLAUDE.md          ← 자동 로드됨 (다시 읽지 않아도 됨)
2. PROJECT_PLAN.md §0, §9   ← 결정사항 + 현재 Phase/PR
3. 받은 작업 지시 분석     ← 어느 Phase/PR에 해당?
4. git log -10           ← 최근 어떤 작업이 commit됐는지
5. TaskList              ← 진행 중인 task / 의존성
6. 해당 작업의 specs 읽기 ← docs/specs/<관련>.md (있으면)
```

**금지사항:** 위 6단계 끝나기 전에 코드 작성 시작하지 않는다.

---

## 1. 작업 종류 분류

받은 지시를 다음 5종류 중 하나로 분류:

| 종류 | 트리거 키워드 | 표준 절차 섹션 |
|------|--------------|---------------|
| A. 명세 문서 작성 | "스펙 작성", "Phase 0", "docs/specs" | §2 |
| B. 인프라 PR 작업 | "PR-N", "Phase 1", "ToolPageLayout 분리" 등 | §3 |
| C. 새 툴 추가 | "<slug> 툴 만들기", "/new-tool" | §4 |
| D. 기존 툴 수정 | "<slug> 수정", "버그 fix" | §5 |
| E. 검증/리뷰 | "검토", "audit", "리뷰" | §6 |

**모호하면 사용자에게 분류 확인 후 진행.**

---

## 2. 작업 A — 명세 문서 작성 (Phase 0)

### 입력
- 작성할 명세 파일명 (예: `docs/specs/categories.md`)
- PROJECT_PLAN.md의 해당 섹션 (예: §1.2, §1.3 ...)

### 산출물
- `docs/specs/<topic>.md` 단일 파일

### 절차
1. `PROJECT_PLAN.md` 해당 섹션 정독
2. 비슷한 기존 spec이 있으면 형식 통일
3. 다음 구조로 작성:
   ```
   # <Topic> Spec
   ## 1. 결정 사항 (불변)
   ## 2. 정의 / 규칙
   ## 3. 예시 (실제 사용)
   ## 4. 검증 방법 / 체크리스트
   ## 5. 변경 이력
   ```
4. PROJECT_PLAN.md와 모순되는 내용 발견 시 → 작성 중단, 사용자 확인

### 검증
- [ ] 모든 결정이 PROJECT_PLAN.md와 일치
- [ ] 추측이나 가정 없음 (모르는 건 "TBD"로 표시)
- [ ] 예시는 실제 코드에서 그대로 사용 가능

---

## 3. 작업 B — 인프라 PR 작업 (Phase 1)

### 입력
- PR 번호 (예: PR-3)
- PROJECT_PLAN.md §9 Phase 1 표의 해당 행

### 산출물
- 작업 종류에 따라 (예: 컴포넌트 파일 / 타입 / 훅 / 마이그레이션)
- git commit 1개

### 절차
1. **의존성 확인** — PR-2 완료돼야 PR-9 시작 가능 등 (PROJECT_PLAN.md §9 의존성 그래프)
2. **현재 코드 read** — 변경 대상 파일을 먼저 정확히 파악
3. **변경 범위 최소화** — PR 범위 외의 파일 건드리지 않음
4. **TypeScript strict** — `any` 사용 금지, 모든 prop 타입 명시
5. **테스트** — logic.ts 변경 시 vitest 추가 (PR-9 완료 후)
6. **검증 명령 실행**:
   ```
   npm run typecheck
   npm run lint
   npm run test          # PR-9 완료 후
   npm run build
   ```
7. **commit** — `git commit -m "PR-N: <task>"` 형식

### 금지
- 다른 PR 작업 침범
- TypeScript 오류 남겨두고 commit
- 새 라이브러리 추가 시 사용자 확인 없이 진행 (>50KB)
- 환경변수 새로 만들기

### 검증
- [ ] `npm run typecheck` 통과
- [ ] `npm run lint` 통과
- [ ] `npm run build` 통과
- [ ] 변경 파일이 PR 범위 내
- [ ] CLAUDE.md §11 갱신 필요 항목 표시

---

## 4. 작업 C — 새 툴 추가 (Phase 2 이후)

### 입력
- `tools-spec/<slug>.yaml` 명세서

### 산출물
- `src/tools/<slug>/{config.ts, logic.ts, logic.test.ts, component.tsx}`
- `src/tools/registry.ts` 1줄 추가
- `src/components/tools/ToolLoader.tsx` 1줄 추가

### 절차
1. YAML 명세서 검증 (필수 필드, 카테고리 유효성)
2. 중복 검사 (`grep -r "slug:" src/tools/*/config.ts`)
3. 템플릿 결정 (PROJECT_PLAN.md §6)
4. logic.ts 작성 (순수 함수, 타입 명시)
5. logic.test.ts 작성 (vitest)
6. config.ts 생성 (YAML → TS 변환, locale 데이터 모두 채움)
7. component.tsx 생성 (5줄 템플릿 래퍼)
8. registry.ts + ToolLoader.tsx 등록
9. `npm run validate-tools` 실행
10. 브라우저에서 동작 확인 (`npm run dev`)

### 검증
- [ ] config.ts 품질 기준 (CLAUDE.md §4) 통과
- [ ] logic.test.ts 통과
- [ ] validate-tools 통과
- [ ] page.tsx 수정 안 함

---

## 5. 작업 D — 기존 툴 수정

### 입력
- 수정 대상 slug
- 수정 내용 (버그/개선)

### 산출물
- 해당 툴 파일만 수정 + commit

### 절차
1. 기존 코드 read (config.ts, logic.ts, component.tsx)
2. 변경 영향 범위 파악 (다른 툴이 참조하나? `grep -r <slug> src/`)
3. 최소한의 변경
4. 회귀 테스트 (logic.test.ts)
5. commit

### 금지
- 무관한 리팩터링 동시 진행
- "겸사겸사" 다른 툴 손보기

---

## 6. 작업 E — 검증/리뷰

### 입력
- 검토 대상 (PR / 툴 / 영역)

### 산출물
- 마크다운 리포트 (`docs/reviews/<topic>-<date>.md` 권장) 또는 사용자 직접 보고

### 절차
1. 기준 명확히 (CLAUDE.md / PROJECT_PLAN.md / 해당 spec)
2. 체크리스트 기반 검토 (추측 X)
3. **실제 명령으로 검증** (read만으로 끝내지 않기):
   - 타입: `npm run typecheck`
   - 빌드: `npm run build`
   - 보안: `npm audit`
   - 번들: `npm run analyze` (있는 경우)
4. 발견 사항 분류:
   - 🔴 Critical (배포 차단)
   - 🟡 Warning (개선 필요)
   - 🟢 Info (참고)

---

## 7. 산출물 저장 위치 규칙

| 산출물 종류 | 저장 위치 |
|-----------|----------|
| 명세 문서 | `docs/specs/<topic>.md` |
| 컴포넌트 | `src/components/tools/` |
| 공용 UI | `src/tools/templates/_shared/` |
| 훅 | `src/hooks/` |
| 타입 | `src/config/types.ts` (또는 `src/types/`) |
| 라이브러리 헬퍼 | `src/lib/` |
| 툴 코드 | `src/tools/<slug>/` |
| 스크립트 | `scripts/` |
| YAML 명세 | `tools-spec/` |
| 서브에이전트 | `.claude/agents/` |
| 슬래시커맨드 | `.claude/commands/` |
| 검토 리포트 | `docs/reviews/` |
| 변경 이력 | `CHANGELOG.md` |

**금지:** 위 외의 위치에 임의로 파일 만들기. 의문 시 사용자 확인.

---

## 8. 다음 Agent에 결과 전달 형식

서브에이전트 파이프라인에서 결과를 다음 단계에 넘길 때:

### 짧은 결과 (단일 산출물)
```
## 작업 완료

**산출물:**
- `path/to/file.ts` (생성/수정)

**핵심 변경:**
- (한 줄)

**검증 결과:**
- typecheck: ✅
- build: ✅
- test: N/A

**다음 단계 권장:**
- (다음 에이전트가 무엇을 할지 1줄)
```

### 긴 결과 (복합 작업)
별도 마크다운 파일로 저장 후 경로만 전달.

**금지:** 작업 결과를 자유 서술로 길게 보내지 말 것. 다음 에이전트가 컨텍스트 부담.

---

## 9. 의존성 / 병렬 / 순차 가이드

### 병렬 가능
- 서로 다른 파일 생성 (예: `useFavorite.ts` vs `useShare.ts`)
- 서로 다른 명세 작성 (Phase 0의 8개 spec)
- 서로 다른 툴 양산 (Phase 5)

### 순차 강제
- 같은 파일 수정 (race condition 위험)
- 타입 정의 → 그 타입 사용 (PR-2 → PR-3)
- 마이그레이션 → 데이터 사용 (Phase 4.5 → Phase 5)

### 사용자가 "병렬로 진행"이라 한 경우
- 한 메시지에 여러 Agent 호출 (Claude Code의 병렬 도구 호출)
- 각 Agent에 명확한 산출물 path 지정 → 충돌 방지

---

## 10. 자주 하는 실수 방지

### 새 Agent 세션이 자주 하는 실수
- ❌ CLAUDE.md를 안 읽고 옛 패턴(7개 카테고리 등)으로 작업
- ❌ Supabase 호출 코드를 작성 (현재 미사용)
- ❌ "겸사겸사" 무관한 리팩터링 동시 진행
- ❌ logic.ts에 try/catch 남발 (순수 함수에 부수효과)
- ❌ 새 카테고리/이벤트명 임의 추가
- ❌ TypeScript 오류 남기고 commit
- ❌ page.tsx 직접 수정 (절대 금지)
- ❌ 결과를 자유 서술로 길게 보고 (다음 에이전트 부담)

### 방지 방법
1. **첫 5분 체크리스트** (§0) 무조건 실행
2. **변경 범위가 모호하면 사용자에게 한 번 확인**
3. **commit 전 검증 명령 실행** (typecheck/lint/build)
4. **다음 에이전트에 전달할 결과는 §8 형식 준수**

---

## 11. 이 문서 갱신

이 문서는 운영하면서 발견된 패턴을 추가한다.
- 새 작업 종류 발견 시 → §1 + 해당 §X 추가
- 자주 하는 실수 발견 시 → §10에 추가
- Phase 이행으로 절차 변경 시 → 해당 § 갱신

**갱신 권한:** 사용자 또는 사용자 명시 승인. Agent가 임의로 수정 X.
