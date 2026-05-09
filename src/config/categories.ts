/**
 * Toolhub — 카테고리 정의 (Phase 1 PR-8)
 *
 * 단일 진실 공급원: docs/specs/categories.md §1.2
 * 정합 문서:
 *   - PROJECT_PLAN.md §1.2 / §15.2
 *   - CLAUDE.md §5
 *
 * 변경 이력:
 *   - PR-8 (2026-05-09):
 *       · 7개 → 10개로 확장 (seo / security / productivity / ai 신설)
 *       · `generator` 제거 (소속 툴: password/hash/uuid → security, lorem-ipsum → text)
 *       · `Category` 인터페이스에 `name: Record<Locale, string>` 추가 (locale-aware 라벨)
 *       · 기존 i18n 메시지 키(`categories.<id>`)는 호환을 위해 유지 (PR-12 이후 정리)
 */
import { type Locale } from "@/config/types";

export interface Category {
  /** URL/식별자. 카테고리 ID 와 동일. 소문자 영문 단일 단어. */
  slug: string;
  /** Locale 별 표시 이름 (Phase 1 PR-8 신규). */
  name: Record<Locale, string>;
  /** lucide-react 아이콘 이름. */
  icon: string;
  /** 브랜드 컬러 HEX. */
  color: string;
}

/** 정식 카테고리 ID 10개 (PR-8). 추가/삭제는 사용자 승인 필수. */
export type CategoryId =
  | "text"
  | "developer"
  | "calculator"
  | "converter"
  | "image"
  | "pdf"
  | "seo"
  | "security"
  | "productivity"
  | "ai";

export const categories: Record<string, Category> = {
  text: {
    slug: "text",
    name: { ko: "텍스트/문서", en: "Text & Document" },
    icon: "Type",
    color: "#3B82F6",
  },
  developer: {
    slug: "developer",
    name: { ko: "개발자", en: "Developer" },
    icon: "Code",
    color: "#8B5CF6",
  },
  calculator: {
    slug: "calculator",
    name: { ko: "계산기", en: "Calculator" },
    icon: "Calculator",
    color: "#10B981",
  },
  converter: {
    slug: "converter",
    name: { ko: "변환기", en: "Converter" },
    icon: "ArrowLeftRight",
    color: "#F59E0B",
  },
  image: {
    slug: "image",
    name: { ko: "이미지", en: "Image" },
    icon: "Image",
    color: "#06B6D4",
  },
  pdf: {
    slug: "pdf",
    name: { ko: "PDF", en: "PDF" },
    icon: "FileText",
    color: "#EF4444",
  },
  seo: {
    slug: "seo",
    name: { ko: "SEO/웹", en: "SEO & Web" },
    icon: "Search",
    color: "#14B8A6",
  },
  security: {
    slug: "security",
    name: { ko: "보안/암호화", en: "Security" },
    icon: "Shield",
    color: "#DC2626",
  },
  productivity: {
    slug: "productivity",
    name: { ko: "생산성", en: "Productivity" },
    icon: "Clock",
    color: "#6366F1",
  },
  ai: {
    slug: "ai",
    name: { ko: "AI", en: "AI" },
    icon: "Sparkles",
    color: "#A855F7",
  },
};

export const categoryOrder: CategoryId[] = [
  "text",
  "developer",
  "calculator",
  "converter",
  "image",
  "pdf",
  "seo",
  "security",
  "productivity",
  "ai",
];
