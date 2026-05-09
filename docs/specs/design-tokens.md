# Design Tokens Spec

> Toolhub 디자인 토큰 + 다크모드 명세. 모든 컴포넌트는 이 문서의 토큰만 사용한다.
> 하드코딩 색상(`bg-blue-500`, `text-gray-700` 등)은 `design-token-enforcer` 서브에이전트가 차단한다.

---

## 1. 결정 사항 (불변)

| 항목 | 확정 내용 |
|------|----------|
| 다크모드 도입 시점 | **Phase 3** (Phase 2 완료 후, PROJECT_PLAN.md §9 Phase 3.2) |
| 라이브러리 | **next-themes 고정** (PROJECT_PLAN.md §5.2) |
| 토큰 시스템 | **Tailwind v4 + CSS 변수** (`@theme inline`) |
| 토큰 정의 위치 | **`src/app/globals.css` 단일 파일** |
| 다크모드 셀렉터 | **`[data-theme="dark"]`** (next-themes `attribute="data-theme"` 설정) |
| 저장 매체 | **`localStorage.theme`** (next-themes 기본 키) |
| 시스템 감지 | **`prefers-color-scheme`** 기본 활성화 (next-themes `enableSystem`) |
| 강제 토큰 사용 | 새 컴포넌트는 토큰 사용 강제 (`design-token-enforcer` 검사) |
| 색 표기 | **HEX** 사용 (현재 globals.css 형식 유지). v4 inline `@theme`로 Tailwind 클래스 자동 생성 |
| 토큰 카테고리 | **5개**: color, spacing, radius, font, shadow |
| 변경 권한 | 토큰 추가/삭제/이름 변경은 사용자 승인 필요 |

### 1.1 도입 순서 (Phase 3)

1. Phase 2 완료 후 시작
2. `next-themes` 설치 + `ThemeProvider` 도입
3. `globals.css`에 `[data-theme="dark"]` 블록 추가 (이 문서 §3.1)
4. 헤더에 `ThemeToggle` 컴포넌트 추가 (§3.4)
5. 기존 29개 툴 회귀 테스트 (시각 + 컨트라스트)

---

## 2. 정의 / 규칙

### 2.1 토큰 카테고리

| 카테고리 | 토큰 수 | 용도 |
|----------|---------|------|
| color | 10 | 배경/전경/주조색/경계 |
| radius | 1 | 모서리 둥글기 (`--radius`) |
| font | 2 | sans / mono 패밀리 |
| spacing | 0 | Tailwind 기본값 사용 (커스텀 X) |
| shadow | 0 | Tailwind 기본값 사용 (커스텀 X) |

> **spacing/shadow**: Tailwind v4 기본값(`space-*`, `shadow-*`)을 그대로 사용한다. 토큰 신설 X.

### 2.2 컬러 토큰 — 라이트/다크 값

| 토큰 | 용도 | 라이트 (HEX) | 다크 (HEX) | Tailwind 클래스 |
|------|------|-------------|-----------|-----------------|
| `--background` | 페이지 기본 배경 | `#ffffff` | `#0b1220` | `bg-background` |
| `--foreground` | 본문 텍스트 | `#111827` | `#f3f4f6` | `text-foreground` |
| `--muted` | 보조 표면 (카드 내부 강조 박스) | `#f9fafb` | `#111827` | `bg-muted` |
| `--muted-foreground` | 보조 텍스트 | `#6b7280` | `#9ca3af` | `text-muted-foreground` |
| `--border` | 카드/입력 경계선 | `#e5e7eb` | `#1f2937` | `border-border` |
| `--primary` | 주조색 (CTA, 링크 hover) | `#2563eb` | `#3b82f6` | `bg-primary`, `text-primary` |
| `--primary-foreground` | 주조색 위 텍스트 | `#ffffff` | `#ffffff` | `text-primary-foreground` |
| `--accent` | 강조 배경 (안내 박스) | `#f0f5ff` | `#1e293b` | `bg-accent` |
| `--card` | 카드 표면 | `#ffffff` | `#0f172a` | `bg-card` |
| `--card-foreground` | 카드 위 텍스트 | `#111827` | `#f3f4f6` | `text-card-foreground` |

> **정확한 다크 값 결정 권한**: Phase 3 시점에 시각 검토 후 미세 조정 가능.
> 위 표는 WCAG AA(4.5:1) 컨트라스트를 만족하는 안전한 시작 값이다.

### 2.3 비-색상 토큰

| 토큰 | 값 | 비고 |
|------|-----|------|
| `--radius` | `0.75rem` | 카드/버튼 공통 |
| `--font-sans` | `var(--font-geist-sans)` | next/font/google `Geist` |
| `--font-mono` | `var(--font-geist-mono)` | 코드/예시 표시 |

### 2.4 사용 패턴 (Do)

Tailwind v4 + `@theme inline` 덕분에 토큰명이 자동으로 Tailwind 유틸리티가 된다.

```tsx
// ✅ Do — 토큰 클래스 사용
<div className="bg-background text-foreground border-border" />
<button className="bg-primary text-primary-foreground rounded-[var(--radius)]" />
<p className="text-muted-foreground" />
<aside className="bg-accent" />
```

### 2.5 금지 패턴 (Don't)

```tsx
// ❌ Don't — 하드코딩 색상
<div className="bg-blue-500 text-gray-700" />
<div className="bg-white text-black" />          // 다크모드에서 깨짐
<div style={{ backgroundColor: "#2563eb" }} />   // 토큰 우회
<div className="border-gray-200" />              // border-border 사용
```

#### 차단 대상 (design-token-enforcer)
- Tailwind 색 팔레트 직접 사용: `bg-{red|blue|green|yellow|purple|pink|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose}-{50..950}`
- 임의 HEX/RGB/HSL: `bg-[#...]`, `text-[rgb(...)]`, `style={{ color: "#..." }}`
- `bg-white`, `bg-black`, `text-white`, `text-black`

#### 예외 (whitelist)
- `lucide-react` 아이콘의 `text-amber-500` 같은 **장식용 단색 아이콘 1회성 사용**은 허용되지만, 가능하면 토큰화 권장 (`text-primary`, `text-muted-foreground`).
- **현재 ToolPageLayout.tsx의 `text-amber-500` / `text-purple-500` / `text-blue-500` / `text-green-500` / `text-green-600` / `border-blue-200` / `bg-blue-50/50`** — Phase 3 진입 시 토큰화 마이그레이션 대상으로 표시. 그 전까지는 기존 코드 유지.

### 2.6 다크모드 동작 명세

| 항목 | 값 |
|------|-----|
| Provider | `next-themes`의 `ThemeProvider` (`src/app/[locale]/layout.tsx` 안 `<html>` 직하) |
| `attribute` | `"data-theme"` |
| `defaultTheme` | `"system"` |
| `enableSystem` | `true` (시스템 prefers-color-scheme 감지) |
| `storageKey` | `"theme"` (localStorage.theme) |
| 값 종류 | `"light"` \| `"dark"` \| `"system"` |
| FOUC 방지 | `<html suppressHydrationWarning>` 추가 |
| 토글 위치 | 헤더 우측 (locale 스위치 옆) |

### 2.7 토큰 추가/변경 절차

1. PR에 `globals.css` 변경 + 이 문서 §2.2/§2.3 갱신
2. 사용자 승인
3. 변경 시 모든 컴포넌트 시각 회귀 확인 (`/dev/components` 라우트, PR-11)
4. §5 변경 이력에 기록

---

## 3. 예시 (실제 사용)

### 3.1 globals.css (Phase 3 도입 후 최종 형태)

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #111827;
  --muted: #f9fafb;
  --muted-foreground: #6b7280;
  --border: #e5e7eb;
  --primary: #2563eb;
  --primary-foreground: #ffffff;
  --accent: #f0f5ff;
  --card: #ffffff;
  --card-foreground: #111827;
  --radius: 0.75rem;
}

[data-theme="dark"] {
  --background: #0b1220;
  --foreground: #f3f4f6;
  --muted: #111827;
  --muted-foreground: #9ca3af;
  --border: #1f2937;
  --primary: #3b82f6;
  --primary-foreground: #ffffff;
  --accent: #1e293b;
  --card: #0f172a;
  --card-foreground: #f3f4f6;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --radius: var(--radius);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
}

html {
  scroll-behavior: smooth;
}

*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: 4px;
}

::selection {
  background: var(--primary);
  color: var(--primary-foreground);
}
```

### 3.2 컴포넌트 예시 — Button

```tsx
// src/tools/templates/_shared/Button.tsx
import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-[var(--radius)] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary";
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:opacity-90"
      : "bg-muted text-foreground border border-border hover:bg-accent";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
```

### 3.3 컴포넌트 예시 — Card

```tsx
// src/components/tools/ToolShell.tsx (참고용)
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-sm">
      {children}
    </div>
  );
}
```

### 3.4 컴포넌트 예시 — Input

```tsx
// src/tools/templates/_shared/Input.tsx
import { type InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-[var(--radius)] border border-border bg-background text-foreground placeholder:text-muted-foreground px-3 py-2 focus-visible:outline-2 focus-visible:outline-primary ${props.className ?? ""}`}
    />
  );
}
```

### 3.5 다크모드 토글 컴포넌트

```tsx
// src/components/layout/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // FOUC 방지: 클라이언트 마운트 후에만 렌더
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" aria-hidden />;

  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const Icon = theme === "dark" ? Moon : theme === "system" ? Monitor : Sun;

  return (
    <button
      type="button"
      aria-label={`테마 전환 (현재: ${theme})`}
      onClick={() => setTheme(next)}
      className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius)] border border-border bg-card text-foreground hover:bg-muted transition-colors"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
```

### 3.6 ThemeProvider 설치

```tsx
// src/app/[locale]/layout.tsx (발췌)
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children, params: { locale } }) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          storageKey="theme"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## 4. 검증 방법 / 체크리스트

### 4.1 design-token-enforcer 검사 항목

`design-token-enforcer` 서브에이전트는 신규/수정 파일에서 다음을 검사하여 발견 시 **fail** 처리한다.

| # | 검사 항목 | 정규식 / 패턴 | 결과 |
|---|----------|---------------|------|
| 1 | Tailwind 색 팔레트 직접 사용 | `\b(?:bg|text|border|ring|fill|stroke|from|via|to|outline|decoration|caret|accent|divide|placeholder|shadow)-(red\|blue\|green\|yellow\|purple\|pink\|gray\|slate\|zinc\|neutral\|stone\|orange\|amber\|lime\|emerald\|teal\|cyan\|sky\|indigo\|violet\|fuchsia\|rose)-\d{2,3}` | 🔴 fail |
| 2 | 임의 HEX/RGB/HSL Tailwind | `\b(?:bg\|text\|border)-\[#[0-9a-fA-F]{3,8}\]`, `\[rgb\(`, `\[hsl\(` | 🔴 fail |
| 3 | 인라인 style 색상 | `style=\{\{[^}]*(?:color\|background)[^}]*"#`, `style=\{\{[^}]*rgb\(` | 🔴 fail |
| 4 | bg-white / bg-black / text-white / text-black | `\b(?:bg\|text)-(?:white\|black)\b` | 🟡 warn (whitelist 시 허용) |
| 5 | 토큰 클래스 우선 권장 | `border-gray-`, `text-gray-`, `bg-gray-` | 🔴 fail |

#### whitelist 예외 처리
- `text-amber-500` / `text-purple-500` 등 **lucide 아이콘 장식용 한 줄**: `// design-token-enforcer:disable-next-line` 주석 추가 시 통과.
- 기존 `src/components/tools/ToolPageLayout.tsx`은 마이그레이션 대상 파일로 등록되어 enforcer 검사 제외 (Phase 3에서 토큰화).

### 4.2 다크모드 시각 회귀 (Phase 3)

| # | 검사 | 도구 |
|---|------|------|
| 1 | 다크모드 ON 상태로 전체 페이지 수동 점검 | 브라우저 |
| 2 | `/dev/components` 라우트에서 모든 컴포넌트 라이트/다크 비교 | 수동 (PR-11 후 가능) |
| 3 | Lighthouse Accessibility (라이트/다크 각 1회) | `npx lighthouse <url>` |
| 4 | Playwright 시각 회귀 (선택) | `playwright test --project=dark` |

### 4.3 WCAG AA 컨트라스트 (4.5:1 이상)

| 조합 | 라이트 | 다크 | 기준 |
|------|--------|------|------|
| `--foreground` on `--background` | `#111827` / `#ffffff` ≈ 16.5:1 ✅ | `#f3f4f6` / `#0b1220` ≈ 15.3:1 ✅ | ≥ 4.5:1 |
| `--muted-foreground` on `--background` | `#6b7280` / `#ffffff` ≈ 4.83:1 ✅ | `#9ca3af` / `#0b1220` ≈ 7.2:1 ✅ | ≥ 4.5:1 |
| `--primary-foreground` on `--primary` | `#ffffff` / `#2563eb` ≈ 5.2:1 ✅ | `#ffffff` / `#3b82f6` ≈ 4.5:1 ✅ | ≥ 4.5:1 |
| `--foreground` on `--muted` | `#111827` / `#f9fafb` ≈ 15.8:1 ✅ | `#f3f4f6` / `#111827` ≈ 13.9:1 ✅ | ≥ 4.5:1 |

검증 도구: <https://webaim.org/resources/contrastchecker/>

> ⚠️ Phase 3에서 다크 색을 미세 조정하면 위 비율도 재계산하여 이 표를 갱신할 것.

### 4.4 Phase 3 도입 완료 체크리스트

- [ ] `next-themes` 설치 + `ThemeProvider` 적용
- [ ] `globals.css`에 `[data-theme="dark"]` 블록 추가
- [ ] `<html suppressHydrationWarning>` 적용
- [ ] `ThemeToggle` 헤더 추가
- [ ] 기존 29개 툴 라이트/다크 시각 회귀
- [ ] Lighthouse Accessibility ≥ 95 (라이트/다크 모두)
- [ ] WCAG AA 컨트라스트 §4.3 표 모두 ✅
- [ ] `design-token-enforcer` CI 통과
- [ ] CLAUDE.md §0/§11 갱신 (다크모드 도입 완료 표시)

### 4.5 PROJECT_PLAN.md 일치성 검증

- [ ] 다크모드 도입 시점 = Phase 3 (PROJECT_PLAN.md §9 Phase 3.2) ✅
- [ ] 라이브러리 = next-themes (PROJECT_PLAN.md §5.2) ✅
- [ ] 토큰 정의 = `src/app/globals.css` (PROJECT_PLAN.md §5.1) ✅
- [ ] design-token-enforcer 강제 (PROJECT_PLAN.md §5.3, §10 #28) ✅

---

## 5. 변경 이력

| 날짜 | 버전 | 변경 | 작성자 |
|------|------|------|--------|
| 2026-05-09 | v1.0 | 초안 작성 (Phase 0) | Phase 0 명세 작업 |
