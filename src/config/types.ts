/**
 * Toolhub — ToolConfig 타입 정의 (단일 진실 공급원)
 *
 * 본 파일은 PROJECT_PLAN.md §2 / docs/specs/tool-config.md §2 의 인터페이스를
 * 그대로 반영하며, 모든 툴이 등록 시 따라야 한다.
 *
 * Phase 1 PR-2 변경:
 *  - TemplateType 을 kebab-case 9개로 확장 (PascalCase 5개에서 변경)
 *  - ProcessingType 에 "ai" 추가
 *  - 신규 optional 필드 추가:
 *    subCategory, tags, status, processing, schema, monetization, analytics, privacy
 *  - 기존 필수 `template`, `processingType`, `icon` 은 호환을 위해 그대로 유지
 *    (단 `template` 은 kebab-case 값으로만 채워야 함 — 기존 29개는 PR-2 에서 일괄 변환)
 *  - `Locale` 타입 도입 ("ko" | "en")
 */

// ---- 공통 ----

export type Locale = "ko" | "en";

/**
 * 템플릿 키 (kebab-case, 9개 enum).
 *
 * 현재 실 구현은 3개:
 *   - "text-to-text"   → src/tools/templates/TextToText.tsx
 *   - "form-to-result" → src/tools/templates/FormToResult.tsx
 *   - "live-preview"   → src/tools/templates/LivePreview.tsx
 *
 * Phase 1 PR-4 에서 추가 (실 구현):
 *   - "multi-input"
 *   - "form-to-visual"
 *
 * 카테고리별 작업 시점에 도입 (스켈레톤만 PR-4):
 *   - "realtime"
 *   - "workspace"
 *   - "file-processor"
 *   - "image-editor"
 */
export type TemplateType =
  | "text-to-text"
  | "form-to-result"
  | "live-preview"
  | "multi-input"
  | "form-to-visual"
  | "realtime"
  | "workspace"
  | "file-processor"
  | "image-editor";

/**
 * 처리 위치.
 *  - client: logic.ts 가 순수함수, 모든 처리가 브라우저 내
 *  - server: API/서버 사이드 처리 필요 (Phase 2 이미지/PDF 일부)
 *  - ai:     AI 호출 (Phase 3)
 */
export type ProcessingType = "client" | "server" | "ai";

// ---- 콘텐츠 서브 타입 ----

export interface FaqItem {
  q: string;
  a: string;
}

export interface UseCase {
  title: string;
  description: string;
  example?: {
    input: string;
    output: string;
  };
}

export interface InputFieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea";
  placeholder?: string;
  options?: { label: string; value: string }[];
  defaultValue?: string | number;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

// ---- ToolConfig ----

export interface ToolConfig {
  // === 식별 ===
  /** URL slug. 소문자 영문+하이픈만. 카테고리 prefix 제외 (PROJECT_PLAN.md §1.4). */
  slug: string;
  /** `categories.ts` 에 정의된 카테고리 ID. */
  category: string;
  /** 2단계 분류 미래 대비. 현재는 사용 X (PR-2 신규). */
  subCategory?: string;
  /** 자유 태그 (PROJECT_PLAN.md §1.3). PR-2 신규. */
  tags?: string[];

  // === 상태 ===
  /** "draft" | "published" — draft 인 툴은 sitemap/리스트에서 제외. 기본 "published". PR-2 신규. */
  status?: "draft" | "published";
  /**
   * NEW name (PR-2). 기본 "client".
   * 호환을 위해 기존 `processingType` 도 당분간 유지된다 (PR-7 에서 정리).
   */
  processing?: ProcessingType;

  // === Freshness 신호 (AEO/SEO) ===
  /** 최초 공개일 (ISO 8601 YYYY-MM-DD). JSON-LD `datePublished` 로 사용. */
  datePublished?: string;
  /** 마지막 업데이트일 (ISO 8601 YYYY-MM-DD). JSON-LD `dateModified` 로 사용. 미지정 시 빌드 시각 사용. */
  lastUpdated?: string;

  /**
   * 템플릿 키. PR-2 부터 kebab-case 사용 (TemplateType 참조).
   *
   * 호환: 본 필드는 모든 기존 29개 config 가 가지고 있으므로 사실상 필수이지만,
   *       Phase 1 PR-2 의 호환 정책상 optional 로 둔다 (default: "text-to-text").
   *       ToolLoader 의 동적 매핑이 fallback 역할을 한다.
   */
  template?: TemplateType;

  /**
   * @deprecated PR-2 에서 `processing` 으로 rename 권장. PR-7 에서 마이그레이션 후 제거 예정.
   * 당분간 호환을 위해 유지되며, 기존 29개 config 가 사용 중.
   */
  processingType?: ProcessingType;

  /**
   * Lucide 아이콘 이름. 카테고리/리스트 페이지에서 사용 중일 수 있어 호환을 위해 유지.
   * 신규 툴은 카테고리 기본 아이콘으로 대체 가능 (선언 생략 가능).
   */
  icon?: string;

  // === 입출력 설정 (템플릿별) ===

  /** "text-to-text" / "live-preview" 템플릿에서 권장. */
  inputConfig?: {
    placeholder?: string;
    inputLabel?: string;
    outputLabel?: string;
    inputType?: "text" | "code";
    outputType?: "text" | "code" | "stats";
  };

  /** "form-to-result" / "form-to-visual" 템플릿에서 필수. */
  formFields?: InputFieldConfig[];
  /** "form-to-result" 또는 inputConfig.outputType="stats" 에서 필수. */
  resultLabels?: { key: string; label: string; suffix?: string }[];

  // === SEO ===

  /**
   * SEO 메타데이터 (locale 별).
   *
   * 호환: 현재는 `[locale: string]: { title, description, keywords }` 형식을 유지한다
   *       (기존 29개가 모두 이 형식). 신규는 권장 형식 `Record<Locale, ...>` 으로 작성하면
   *       자동으로 호환된다 (Locale 은 string 의 부분집합).
   *
   * 품질 기준: ko/en 둘 다 필수, keywords 각 locale ≥ 5개 (CLAUDE.md §4).
   */
  seo: {
    [locale: string]: {
      title: string;
      description: string;
      keywords: string[];
    };
  };

  // === 콘텐츠 (다국어) ===
  // 권장: 신규 작성 시 Record<Locale, T> 패턴. 호환을 위해 인덱스 시그니처 유지.

  /** 각 locale ≥ 3 단계 (CLAUDE.md §4). */
  howToUse: {
    [locale: string]: string[];
  };

  /** 각 locale ≥ 4개 (CLAUDE.md §4). */
  features: {
    [locale: string]: string[];
  };

  /** 권장. SEO 강화. */
  useCases?: {
    [locale: string]: UseCase[];
  };

  /** 권장. 본문형 가이드 (긴 글). */
  guide?: {
    [locale: string]: {
      title: string;
      content: string;
    };
  };

  /** 각 locale ≥ 3개 (CLAUDE.md §4). */
  faq: {
    [locale: string]: FaqItem[];
  };

  // === 관계 ===
  /** registry 에 존재하는 다른 툴의 slug. 권장 3~5개. */
  relatedTools: string[];

  // === 구조화 데이터 (PR-2 신규) ===
  schema?: {
    type?: "WebApplication" | "SoftwareApplication";
    applicationCategory?: string;
  };

  // === 수익화 (PR-2 신규, 미래 대비) ===
  monetization?: {
    ads?: boolean;
    affiliate?: boolean;
    proCta?: boolean;
    aiCredits?: boolean;
  };

  // === 분석 (PR-2 신규) ===
  analytics?: {
    /** 표준 14개(PROJECT_PLAN.md §4.1) 외 추가 이벤트명. */
    customEvents?: string[];
  };

  // === 프라이버시 (PR-2 신규) ===
  privacy?: {
    /** 입력값 저장 여부. 기본 false. */
    storesInput?: boolean;
    /** 파일 저장 여부. 기본 false. */
    storesFiles?: boolean;
    /** 모든 처리가 브라우저 내. 기본 true. */
    clientSideOnly?: boolean;
  };
}
