# Subagent Guidelines Spec

> Toolhub 의 38개 서브에이전트 + 6개 슬래시커맨드 시스템 프롬프트 작성 가이드.
> PROJECT_PLAN.md §10 / §11 / §12 + CLAUDE.md §9 + docs/AGENT_WORKFLOW.md §0 / §8 / §9 에 근거.
> **단일 진실 공급원** — `.claude/agents/*.md` 와 `.claude/commands/*.md` 는 이 명세를 따른다.

---

## 1. 결정 사항 (불변)

| # | 결정 | 비고 |
|---|------|------|
| 1.1 | **서브에이전트 38개 고정** | PROJECT_PLAN.md §10 (28+6+분리4). 운영 후 통합 가능, 임의 추가 X |
| 1.2 | **단일 책임 원칙 (1 에이전트 = 1 핵심 업무)** | 한 에이전트가 2개 이상 책임 X. 분리가 필요하면 새 에이전트 신설 |
| 1.3 | **시스템 프롬프트 200줄 이내** | 사용자 결정. 초과 시 책임을 분리하거나 외부 명세 참조로 축약 |
| 1.4 | **결과는 다음 에이전트의 입력으로** | docs/AGENT_WORKFLOW.md §8 형식 준수 (짧은 결과 / 긴 결과) |
| 1.5 | **YAML 명세서 = Single Source of Truth** | `tools-spec/<slug>.yaml` 이 모든 에이전트의 1차 입력. 충돌 시 YAML 우선 |
| 1.6 | **슬래시커맨드 6개 고정** | `/new-tool`, `/tool-audit`, `/tool-publish`, `/tool-fix`, `/tool-status`, `/agent-run` |
| 1.7 | **에이전트 정의 위치:** `.claude/agents/<name>.md` | docs/AGENT_WORKFLOW.md §7 산출물 위치 규칙 |
| 1.8 | **슬래시커맨드 정의 위치:** `.claude/commands/<name>.md` | 동일 |
| 1.9 | **에이전트 카테고리 9개로 분류** | 기획4 / 콘텐츠5 / i18n1 / 개발3 / SEO8 / 품질8 / 테스트3 / 데이터2 / 보고4 = 38 |
| 1.10 | **`/new-tool` 파이프라인 9 STAGE** | PROJECT_PLAN.md §12. STAGE 단위 재실행은 `/tool-fix` 로 |
| 1.11 | **에이전트는 CLAUDE.md / PROJECT_PLAN.md 의 금지사항을 그대로 상속** | 서브에이전트 프롬프트가 메인 규칙을 우회 X |
| 1.12 | **각 에이전트 frontmatter 필수 필드:** `name`, `description` | `tools`, `model` 은 권장 (선언 시 권한 최소화) |
| 1.13 | **Phase 2.2 시작 전까지는 정의 파일 미생성** | 본 명세는 Phase 0 산출물 (가이드만) |

---

## 2. 정의 / 규칙

### 2.1 `.claude/agents/<name>.md` 파일 구조 표준

```markdown
---
name: <agent-name>                # kebab-case, 슬래시커맨드/파이프라인이 식별
description: <한 줄 요약>          # 사용자/오케스트레이터가 보는 설명 (1문장)
tools: [Read, Edit, Bash, Grep]   # 권장: 필요한 도구만 명시 (권한 최소화)
model: opus | sonnet | haiku       # 권장: 작업 난이도에 맞춰 선택
---

# <에이전트 이름>

## 역할
- (1~3줄, 무엇을 하는 에이전트인가)

## 입력
- (받는 컨텍스트 — 파일/슬러그/이전 에이전트 산출물)

## 산출물
- (생성/수정하는 파일 경로 또는 반환 데이터)

## 절차
1. ...
2. ...
3. ...

## 검증 체크리스트
- [ ] ...
- [ ] ...

## 출력 형식
(docs/AGENT_WORKFLOW.md §8 의 짧은 결과 또는 긴 결과 형식 명시)

## 금지
- (CLAUDE.md / PROJECT_PLAN.md 의 해당 영역 금지사항 재인용)
```

### 2.2 시스템 프롬프트 작성 원칙 (5개)

| # | 원칙 | 설명 |
|---|------|------|
| W1 | **단일 책임** | 한 에이전트는 한 가지 핵심 업무만. "겸사겸사" 금지. (CLAUDE.md §9.4) |
| W2 | **입출력 명시** | 입력 파일/형식과 산출물 경로를 frontmatter 또는 본문 상단에 고정 |
| W3 | **검증 체크리스트 포함** | 작업 후 자체 검증 가능하도록 체크리스트 3~10개 항목 |
| W4 | **200줄 제한** | 초과 시 외부 spec 참조 (`docs/specs/<topic>.md`) 로 축약 |
| W5 | **상위 규칙 상속** | CLAUDE.md / PROJECT_PLAN.md 금지사항을 우회하는 지시 X. 명확히 재인용 |

### 2.3 38개 에이전트 카테고리 분류 (PROJECT_PLAN.md §10 그대로)

| 카테고리 | 수 | 에이전트 (#는 PROJECT_PLAN.md §10 번호) |
|---------|----|----------------------------------------|
| 📐 기획/설계 | 4 | 1 tool-planner / 2 duplicate-checker / 3 tool-designer / 4 category-classifier |
| 📝 콘텐츠 작성 | 5 | 5 seo-content-writer / 6 faq-writer / 7 howto-writer / 8 usecase-writer / 9 copy-writer |
| 🌐 번역 | 1 | 10 i18n-translator |
| 💻 개발 | 3 | 11 tool-developer / 12 component-wrapper / 13 registry-registrar |
| 🔍 SEO/메타 | 8 | 14 metadata-writer / 15 jsonld-validator / 16 seo-auditor / 17 related-tools-suggester / 18 url-canonical-checker / 19 sitemap-validator / 20 llms-txt-generator / 21 migration-runner |
| ✅ 검증/품질 | 8 | 22 code-reviewer / 23 type-validator / 24 a11y-auditor / 25 security-reviewer / 26 performance-auditor / 27 bundle-size-checker / 28 design-token-enforcer / 29 license-checker |
| 🧪 테스트 | 3 | 30 unit-tester / 31 integration-tester / 32 e2e-tester |
| 📊 데이터/분석 | 2 | 33 analytics-instrumentor / 34 supabase-migrator |
| 📋 보고/배포 | 4 | 35 report-writer / 36 changelog-writer / 37 tool-doc-writer / 38 publish-gatekeeper |
| **합계** | **38** | — |

> ⚠️ supabase-migrator (#34) 는 Phase 4.5 전까지 미사용. 정의 파일은 Phase 4.5 시작 시 신설.

### 2.4 입력 / 출력 형식 표준 (docs/AGENT_WORKFLOW.md §8)

#### 짧은 결과 (단일 산출물)

```markdown
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

#### 긴 결과 (복합 작업)

별도 마크다운 파일로 저장 후 경로만 전달.

```markdown
## 작업 완료
**리포트:** `docs/reviews/<topic>-2026-05-09.md`
**요약:** Critical 1건, Warning 3건, Info 5건. 자세한 내용은 리포트 참조.
**다음 단계:** code-reviewer 가 Critical 1건 처리
```

> 자유 서술 장문 보고 금지. 다음 에이전트의 컨텍스트 부담을 최소화한다.

### 2.5 병렬 가능 / 순차 강제 그룹 (docs/AGENT_WORKFLOW.md §9)

| 그룹 | 분류 | 사유 |
|------|------|------|
| STAGE 1 (기획) | **순차** | tool-planner → duplicate-checker → category-classifier → tool-designer 순서 의존 |
| STAGE 2 (콘텐츠) | **병렬 5개** | seo-content-writer / faq-writer / howto-writer / usecase-writer / copy-writer 가 서로 다른 필드 |
| STAGE 3 (i18n) | **순차** | STAGE 2 산출물 모두 모인 후 ko↔en 보강 |
| STAGE 4 (개발) | **순차** | tool-developer → component-wrapper → registry-registrar 의존 체인 |
| STAGE 5 (메타/SEO) | **병렬 6개** | metadata-writer / jsonld-validator / related-tools-suggester / url-canonical-checker / sitemap-validator / analytics-instrumentor 가 독립 산출물 |
| STAGE 6 (검증) | **병렬 8개** | code-reviewer / type-validator / a11y-auditor / security-reviewer / performance-auditor / bundle-size-checker / design-token-enforcer / license-checker 모두 read-only 검증 |
| STAGE 7 (테스트) | **순차** | unit-tester → integration-tester → e2e-tester 빌드 의존 |
| STAGE 8 (최종 점검) | **단일** | seo-auditor 1개 |
| STAGE 9 (보고/문서) | **병렬 4개** | report-writer / changelog-writer / tool-doc-writer / llms-txt-generator |

> 같은 파일 동시 수정 금지 (race condition). 각 에이전트의 산출물 경로가 겹치지 않을 때만 병렬.

### 2.6 6개 슬래시커맨드 정의 (PROJECT_PLAN.md §11)

| 커맨드 | 인자 | 동작 |
|--------|------|------|
| `/new-tool` | `<yaml-file>` 또는 `<slug>` | §3.3 의 9 STAGE 파이프라인 전체 실행 |
| `/tool-audit` | `<slug>` | seo-auditor + a11y-auditor + performance-auditor + security-reviewer 종합 |
| `/tool-publish` | `<slug>` | publish-gatekeeper 실행 → 통과 시 config 의 `status: published` 전환 |
| `/tool-fix` | `<slug> <stage>` | 특정 STAGE 만 재실행 (예: `/tool-fix compress seo`) |
| `/tool-status` | `<slug>` | 현재 status / 검증 결과 / 최근 변경 조회 (read-only) |
| `/agent-run` | `<agent> <slug>` | 단일 에이전트 디버그 실행 (개발자 도구) |

### 2.7 슬래시커맨드 frontmatter 표준

```markdown
---
description: <한 줄 요약>
argument-hint: <인자 형식 표시>     # 예: "<slug> | <yaml-file>"
---

# /<command-name>

## 역할
...

## 동작 (호출하는 에이전트와 순서)
1. STAGE N: <agent-1>, <agent-2> (병렬)
2. ...

## 사용자 확인 지점
- STAGE 1 종료 후
- STAGE 9 종료 후 (수동 검증 → /tool-publish)
```

---

## 3. 예시 (실제 사용)

### 3.1 에이전트 정의 예시 — `tool-planner`

`.claude/agents/tool-planner.md`:

```markdown
---
name: tool-planner
description: YAML 명세서를 ToolConfig 초안 + 기능 명세서로 변환하는 기획 에이전트
tools: [Read, Write, Grep]
model: opus
---

# tool-planner

## 역할
YAML 명세서 (`tools-spec/<slug>.yaml`) 를 입력받아 ToolConfig 초안 + 기능 명세서 1차 드래프트를 작성한다.
이후 단계 (duplicate-checker, category-classifier, tool-designer) 가 이 산출물을 기반으로 작업한다.

## 입력
- `tools-spec/<slug>.yaml` (단일 진실 공급원, §1.5)
- `docs/specs/tool-config.md` (ToolConfig 필드 명세)

## 산출물
- `tools-spec/<slug>.draft.json` (ToolConfig 초안 — 후속 에이전트가 보강)
- 짧은 결과 형식 (§2.4) 으로 결과 메시지 반환

## 절차
1. YAML 파싱 → 필수 필드 확인 (slug / category / template / i18n.ko / i18n.en)
2. ToolConfig 의 default 값 채움 (status: "draft", processing 추론)
3. 누락된 콘텐츠 (faq/howToUse/features) 는 후속 에이전트가 채우도록 빈 배열로 둠
4. 카테고리가 10개 (PROJECT_PLAN.md §1.2) 중 하나인지 검증, 위반 시 작업 중단
5. relatedTools 가 비었으면 빈 배열, 후속 (related-tools-suggester) 가 채움

## 검증 체크리스트
- [ ] YAML 의 slug 가 §url.md R1~R8 통과
- [ ] category 가 10개 중 하나
- [ ] template 이 9개 중 하나
- [ ] i18n.ko / i18n.en 둘 다 존재
- [ ] draft.json 파일 생성됨

## 출력 형식
docs/AGENT_WORKFLOW.md §8 짧은 결과 형식.

## 금지
- logic.ts 작성 X (tool-developer 의 책임)
- registry 등록 X (registry-registrar 의 책임)
- ko/en 번역 보강 X (i18n-translator 의 책임)
- 카테고리 임의 추가 X (CLAUDE.md §7)
```

### 3.2 슬래시커맨드 정의 예시 — `/new-tool`

`.claude/commands/new-tool.md`:

```markdown
---
description: YAML 명세서를 받아 9 STAGE 파이프라인으로 새 툴 전체 양산
argument-hint: "<yaml-file> | <slug>"
---

# /new-tool

## 역할
`tools-spec/<slug>.yaml` 명세서를 입력받아, 38개 서브에이전트를 9 STAGE 파이프라인으로 호출하여
하나의 새 툴을 완성한다 (logic + component + config + 메타 + 테스트 + 문서).

## 동작 (호출 순서)
1. **STAGE 1 (기획, 순차):** tool-planner → duplicate-checker → category-classifier → tool-designer
2. *(사용자 1차 확인)*
3. **STAGE 2 (콘텐츠, 병렬 5):** seo-content-writer, faq-writer, howto-writer, usecase-writer, copy-writer
4. **STAGE 3 (i18n, 단일):** i18n-translator
5. **STAGE 4 (개발, 순차):** tool-developer → component-wrapper → registry-registrar
6. **STAGE 5 (메타/SEO, 병렬 6):** metadata-writer, jsonld-validator, related-tools-suggester, url-canonical-checker, sitemap-validator, analytics-instrumentor
7. **STAGE 6 (검증, 병렬 8):** code-reviewer, type-validator, a11y-auditor, security-reviewer, performance-auditor, bundle-size-checker, design-token-enforcer, license-checker
8. **STAGE 7 (테스트, 순차):** unit-tester → integration-tester → e2e-tester
9. **STAGE 8 (최종 점검, 단일):** seo-auditor
10. **STAGE 9 (보고/문서, 병렬 4):** report-writer, changelog-writer, tool-doc-writer, llms-txt-generator
11. *(사용자 직접 검증 — 수동)*
12. **publish:** `/tool-publish <slug>` 로 상태 전환

## 사용자 확인 지점
- STAGE 1 종료 후 (기획 결과 검토)
- STAGE 9 종료 후 (수동 스모크 → /tool-publish)

## 실패 처리
특정 STAGE 실패 시 `/tool-fix <slug> <stage-name>` 으로 해당 STAGE 만 재실행.
```

### 3.3 `/new-tool` 파이프라인 호출 흐름 다이어그램 (PROJECT_PLAN.md §12)

```
사용자: /new-tool image-compress.yaml
  │
  ▼
[STAGE 1: 기획]
  tool-planner → duplicate-checker → category-classifier → tool-designer
  ▼ (사용자 1차 확인)

[STAGE 2: 콘텐츠 — 병렬]
  ┌─ seo-content-writer
  ├─ faq-writer
  ├─ howto-writer
  ├─ usecase-writer
  └─ copy-writer
  ▼

[STAGE 3: i18n]
  i18n-translator (콘텐츠 ko↔en 보강)
  ▼

[STAGE 4: 개발]
  tool-developer → component-wrapper → registry-registrar
  ▼

[STAGE 5: 메타/SEO — 병렬]
  ┌─ metadata-writer
  ├─ jsonld-validator
  ├─ related-tools-suggester
  ├─ url-canonical-checker
  ├─ sitemap-validator
  └─ analytics-instrumentor
  ▼

[STAGE 6: 검증 — 병렬]
  ┌─ code-reviewer
  ├─ type-validator
  ├─ a11y-auditor
  ├─ security-reviewer
  ├─ performance-auditor
  ├─ bundle-size-checker
  ├─ design-token-enforcer
  └─ license-checker
  ▼

[STAGE 7: 테스트]
  unit-tester → integration-tester → e2e-tester
  ▼

[STAGE 8: 최종 점검]
  seo-auditor (Lighthouse 종합)
  ▼

[STAGE 9: 보고/문서]
  report-writer + changelog-writer + tool-doc-writer + llms-txt-generator
  ▼

[사용자 직접 검증 — 수동]
  ▼

publish-gatekeeper → /tool-publish 로 status: published 전환
```

각 STAGE 실패 시 해당 STAGE 만 재실행 가능 (`/tool-fix <slug> <stage>`).

---

## 4. 검증 방법 / 체크리스트

### 4.1 38개 에이전트 정의 파일 — 200줄 이내 검증

- [ ] `.claude/agents/` 의 모든 `*.md` 파일 라인수 ≤ 200
- [ ] 검증 명령 예: `wc -l .claude/agents/*.md | awk '$1 > 200'` → 출력 없어야 통과
- [ ] 초과 시: 책임 분리 또는 외부 spec 참조로 축약 (W4)

### 4.2 frontmatter 표준 준수

- [ ] 모든 에이전트 정의에 `name` 필드 존재 (kebab-case)
- [ ] 모든 에이전트 정의에 `description` 필드 존재 (1문장)
- [ ] `tools` 필드는 권장 — 명시 시 사용 도구만 나열 (권한 최소화)
- [ ] `model` 필드는 권장 — 작업 난이도에 맞는 모델 선택 (opus/sonnet/haiku)
- [ ] 슬래시커맨드 6개 모두 `description` + `argument-hint` 존재

### 4.3 입출력 형식 통일 (docs/AGENT_WORKFLOW.md §8)

- [ ] 각 에이전트 본문에 "출력 형식" 섹션 존재
- [ ] 짧은 결과 형식을 사용한다고 명시 (또는 긴 결과 → 외부 파일 경로)
- [ ] "산출물" 섹션이 명시적인 파일 경로 또는 반환 데이터를 정의
- [ ] 자유 서술 장문 보고 금지 명시

### 4.4 단일 책임 검증 (W1)

- [ ] 한 에이전트가 2개 이상의 핵심 업무를 갖지 않음
- [ ] PROJECT_PLAN.md §10 의 38개 책임과 정확히 1:1 매핑
- [ ] "역할" 섹션이 1~3줄로 한 가지 업무만 기술
- [ ] 다른 에이전트의 산출물을 침범하지 않음 (예: tool-planner 가 logic.ts 작성 X)

### 4.5 카테고리 / 슬래시커맨드 수 검증

- [ ] 에이전트 카테고리 9개 합 = 4+5+1+3+8+8+3+2+4 = **38**
- [ ] 슬래시커맨드 정확히 **6개** (`/new-tool`, `/tool-audit`, `/tool-publish`, `/tool-fix`, `/tool-status`, `/agent-run`)
- [ ] 임의 에이전트/커맨드 추가 X (사용자 명시 승인 필요)

### 4.6 상위 규칙 상속 (W5)

- [ ] 에이전트 프롬프트가 CLAUDE.md §7 (절대 금지) 우회 X
- [ ] Supabase 호출 코드 작성 지시 X (Phase 4.5 전까지)
- [ ] 새 카테고리/이벤트명 임의 추가 지시 X
- [ ] page.tsx 직접 수정 지시 X
- [ ] logic.ts 외부 API/부수효과 지시 X

### 4.7 파이프라인 정합성 (PROJECT_PLAN.md §12)

- [ ] `/new-tool` 의 9 STAGE 가 §3.3 다이어그램과 일치
- [ ] STAGE 2 / 5 / 6 / 9 가 병렬 (§2.5 표 그대로)
- [ ] STAGE 1 / 3 / 4 / 7 / 8 이 순차 (§2.5 표 그대로)
- [ ] 사용자 확인 지점 2회 (STAGE 1 후 / STAGE 9 후)
- [ ] STAGE 단위 재실행이 `/tool-fix` 로 가능

---

## 5. 변경 이력

| 날짜 | 버전 | 변경 |
|------|------|------|
| 2026-05-09 | v1.0 | 초안 작성 (Phase 0). PROJECT_PLAN.md §10 / §11 / §12 + CLAUDE.md §9 + docs/AGENT_WORKFLOW.md §0 / §8 / §9 기반. |
