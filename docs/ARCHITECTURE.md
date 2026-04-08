# Toolhub — Architecture

---

## 요청 흐름

```
브라우저 요청
    ↓
middleware.ts          → 로케일 감지 / 없으면 defaultLocale(ko)로 redirect
    ↓
app/[locale]/layout.tsx → Geist 폰트, NextIntlClientProvider, Header/Footer
    ↓
app/[locale]/tools/[slug]/page.tsx
    ├── getToolBySlug(slug)      → ToolConfig (SEO, 콘텐츠)
    ├── getToolComponent(slug)   → React 컴포넌트
    ├── generateMetadata()       → Next.js 메타태그
    └── JSON-LD 스크립트 3종 주입
    ↓
ToolPageLayout (SEO 랜딩 페이지 뼈대)
    └── <ToolComponent />        → 실제 툴 UI
```

---

## 툴 시스템 구조

### 3-파일 패턴

```
src/tools/<slug>/
├── config.ts     → ToolConfig (메타데이터 + SEO 콘텐츠 + 템플릿 설정)
├── logic.ts      → process() 순수 함수 (입력 → 출력, 부수효과 없음)
└── component.tsx → 템플릿 래퍼 ("use client" 필수)
```

### 단일 등록소

```
src/tools/registry.ts
  ← 모든 config + component를 ToolEntry[]로 관리
  → getAllTools()       : ToolConfig[]       (sitemap, 홈, 카테고리에서 사용)
  → getToolBySlug()    : ToolConfig          (page.tsx에서 SEO 생성)
  → getToolComponent() : React.ComponentType (page.tsx에서 렌더링)
```

`page.tsx`는 registry에서 읽기만 한다. 새 툴 추가 시 수정 대상 아님.

---

## 템플릿 시스템

```
TextToText    → textarea 입력 → 텍스트/코드/통계(stats) 출력
FormToResult  → 폼 필드 입력 → 계산 결과 카드
LivePreview   → textarea 입력 → 실시간 렌더링 (마크다운, HTML 등)
FileToFile    → 미구현 (Phase 2 예정)
```

템플릿은 `tool.formFields`, `tool.inputConfig`, `tool.resultLabels`를 읽어
UI를 자동 구성한다. 템플릿 자체를 수정하면 해당 템플릿을 쓰는 모든 툴에 영향.

---

## SEO 자동화

모든 SEO는 `config.ts`의 데이터에서 자동 파생된다.

```
config.ts.seo
    ├── lib/seo.ts → generateToolMetadata()    → <head> 메타태그
    ├── lib/seo.ts → generateFaqJsonLd()       → FAQPage 스키마
    ├── lib/seo.ts → generateWebAppJsonLd()    → WebApplication 스키마
    └── lib/seo.ts → generateBreadcrumbJsonLd() → BreadcrumbList 스키마

config.ts (모든 툴) → sitemap.ts → /sitemap.xml 자동 생성
                    → robots.ts  → /robots.txt 자동 생성
```

환경변수: `NEXT_PUBLIC_BASE_URL` (기본값: `https://toolhub.co.kr`)

---

## i18n 구조

```
locales: ["ko", "en"]   defaultLocale: "ko"
URL 패턴: /{locale}/tools/{slug}

src/i18n/
├── routing.ts    → 로케일 정의
├── request.ts    → 빌드/요청 시 messages/{locale}.json 로드
└── navigation.ts → Link, redirect, useRouter (i18n-aware)

src/messages/
├── ko.json       → UI 공통 문자열 (한국어)
└── en.json       → UI 공통 문자열 (영어)
```

툴별 SEO 콘텐츠(제목, FAQ, 가이드 등)는 `messages/`가 아니라 `config.ts` 안에 있다.
`messages/`는 버튼, 라벨 등 UI 고정 문자열만 담는다.

---

## 빌드 및 정적 생성

```
generateStaticParams() in page.tsx
    → getAllTools() × locales
    → 빌드 타임에 모든 툴 × 로케일 조합을 정적 페이지로 pre-render
    → 예: 25 tools × 2 locales = 50 페이지 (+ home, categories 등)
```

모든 툴 페이지는 정적 HTML로 생성된다. 서버 런타임 없이 Vercel CDN에서 서빙.

---

## 데이터 흐름 요약

```
config.ts (데이터)
    ↓
registry.ts (등록 + 조회)
    ↓
page.tsx (SEO 조립 + 컴포넌트 선택)
    ↓
ToolPageLayout (랜딩 페이지 뼈대: 브레드크럼, H1, How-to, FAQ, Related)
    ↓
Template Component (실제 툴 UI)
    ↓
logic.ts (순수 계산)
```

---

## 확장 예정

| Phase | 내용 | 변경점 |
|-------|------|--------|
| 1.5 | 클라이언트 툴 25개 추가 | registry.ts에 entries 추가만 |
| 2 | 이미지/PDF (Python FastAPI) | FileToFile 템플릿 구현 + API 라우트 추가 |
| 3 | AI 기반 툴 | 외부 API 연동 + 서버 컴포넌트 전환 일부 |
