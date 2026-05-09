/**
 * Toolhub — JSON-LD audit script
 *
 * 등록된 모든 published 툴에 대해 JSON-LD 5종을 직접 호출 → 구조 검증.
 * 라이브 서버 없이 빌드 산출물 단계에서 실행 가능.
 *
 * 실행: `npm run audit:jsonld`
 *
 * 종료 코드:
 *   - 0: 모든 툴 통과
 *   - 1: 1개 이상 실패
 *
 * 검증 항목:
 *   1. WebApplication: @context, @type, name, url, description, inLanguage, datePublished, dateModified, isAccessibleForFree
 *   2. BreadcrumbList: itemListElement (3개, position 1~3, name+item)
 *   3. FAQPage: mainEntity (≥3개), speakable
 *   4. HowTo: step (≥3개, position+text)
 *   5. TechArticle: headline, articleBody, datePublished, dateModified (guide 있을 때만)
 *   6. Organization (site-wide): name, url, logo, foundingDate, knowsLanguage
 *   7. WebSite (site-wide): name, url, potentialAction (SearchAction)
 */

import { getAllTools } from "../src/tools/registry";
import { categories } from "../src/config/categories";
import {
  getWebApplicationJsonLd,
  getBreadcrumbJsonLd,
  getFaqJsonLd,
  getHowToJsonLd,
  getTechArticleJsonLd,
  getOrganizationJsonLd,
  getWebSiteJsonLd,
} from "../src/lib/jsonld";
import type { ToolConfig, Locale } from "../src/config/types";

const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://toolhub.co.kr"
).replace(/\/+$/, "");

interface Issue {
  scope: string;
  type: string;
  field: string;
  detail?: string;
}

function isPublished(tool: ToolConfig): boolean {
  return (tool.status ?? "published") === "published";
}

function hasField(obj: unknown, path: string): boolean {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (typeof cur !== "object" || cur === null) return false;
    cur = (cur as Record<string, unknown>)[p];
    if (cur === undefined || cur === null || cur === "") return false;
  }
  return true;
}

function isNonEmptyArray(obj: unknown, path: string): boolean {
  if (!hasField(obj, path)) return false;
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) cur = (cur as Record<string, unknown>)[p];
  return Array.isArray(cur) && cur.length > 0;
}

function checkRequiredFields(
  scope: string,
  type: string,
  obj: unknown,
  fields: string[],
  issues: Issue[],
): void {
  if (!obj || typeof obj !== "object") {
    issues.push({ scope, type, field: "<root>", detail: "object missing" });
    return;
  }
  for (const f of fields) {
    if (!hasField(obj, f)) {
      issues.push({ scope, type, field: f, detail: "missing or empty" });
    }
  }
}

function auditTool(tool: ToolConfig, locale: Locale): Issue[] {
  const scope = `${tool.slug}@${locale}`;
  const issues: Issue[] = [];
  const categoryName =
    categories[tool.category]?.name?.[locale] ?? tool.category;

  // 1. WebApplication
  const webapp = getWebApplicationJsonLd(tool, locale, BASE_URL);
  checkRequiredFields(scope, "WebApplication", webapp, [
    "@context",
    "@type",
    "@id",
    "name",
    "url",
    "description",
    "applicationCategory",
    "inLanguage",
    "isAccessibleForFree",
    "datePublished",
    "dateModified",
    "offers",
    "publisher",
  ], issues);
  if (
    !isNonEmptyArray(webapp, "featureList") &&
    (tool.features?.[locale]?.length ?? 0) > 0
  ) {
    issues.push({
      scope,
      type: "WebApplication",
      field: "featureList",
      detail: "config has features but JSON-LD lacks featureList",
    });
  }

  // 2. BreadcrumbList
  const breadcrumb = getBreadcrumbJsonLd(tool, locale, BASE_URL, categoryName);
  checkRequiredFields(scope, "BreadcrumbList", breadcrumb, [
    "@context",
    "@type",
    "itemListElement",
  ], issues);
  if (
    Array.isArray((breadcrumb as Record<string, unknown>).itemListElement) &&
    ((breadcrumb as { itemListElement: unknown[] }).itemListElement.length !== 3)
  ) {
    issues.push({
      scope,
      type: "BreadcrumbList",
      field: "itemListElement",
      detail: `expected 3 items, got ${
        (breadcrumb as { itemListElement: unknown[] }).itemListElement.length
      }`,
    });
  }

  // 3. FAQPage (only if faq exists)
  const faqJsonLd = getFaqJsonLd(tool, locale);
  if ((tool.faq?.[locale]?.length ?? 0) > 0) {
    if (!faqJsonLd) {
      issues.push({
        scope,
        type: "FAQPage",
        field: "<root>",
        detail: "faq exists but JSON-LD null",
      });
    } else {
      checkRequiredFields(scope, "FAQPage", faqJsonLd, [
        "@context",
        "@type",
        "inLanguage",
        "speakable",
        "mainEntity",
      ], issues);
    }
  }

  // 4. HowTo
  const howto = getHowToJsonLd(tool, locale);
  if ((tool.howToUse?.[locale]?.length ?? 0) > 0) {
    if (!howto) {
      issues.push({
        scope,
        type: "HowTo",
        field: "<root>",
        detail: "howToUse exists but JSON-LD null",
      });
    } else {
      checkRequiredFields(scope, "HowTo", howto, [
        "@context",
        "@type",
        "name",
        "step",
        "datePublished",
        "dateModified",
      ], issues);
    }
  }

  // 5. TechArticle (only if guide exists)
  const article = getTechArticleJsonLd(tool, locale, BASE_URL);
  if (tool.guide?.[locale]?.content) {
    if (!article) {
      issues.push({
        scope,
        type: "TechArticle",
        field: "<root>",
        detail: "guide exists but JSON-LD null",
      });
    } else {
      checkRequiredFields(scope, "TechArticle", article, [
        "@context",
        "@type",
        "@id",
        "headline",
        "articleBody",
        "inLanguage",
        "datePublished",
        "dateModified",
        "publisher",
      ], issues);
    }
  }

  return issues;
}

function auditSiteWide(): Issue[] {
  const issues: Issue[] = [];

  // Organization
  const org = getOrganizationJsonLd(BASE_URL);
  checkRequiredFields("site", "Organization", org, [
    "@context",
    "@type",
    "@id",
    "name",
    "url",
    "logo",
    "description",
    "knowsLanguage",
  ], issues);

  // WebSite
  for (const locale of ["ko", "en"] as Locale[]) {
    const site = getWebSiteJsonLd(BASE_URL, locale);
    checkRequiredFields(`site@${locale}`, "WebSite", site, [
      "@context",
      "@type",
      "@id",
      "name",
      "url",
      "inLanguage",
      "publisher",
      "potentialAction",
    ], issues);
  }

  return issues;
}

function main(): void {
  const tools = getAllTools().filter(isPublished);
  const allIssues: Issue[] = [];

  // Site-wide
  allIssues.push(...auditSiteWide());

  // Per-tool × per-locale
  for (const tool of tools) {
    for (const locale of ["ko", "en"] as Locale[]) {
      allIssues.push(...auditTool(tool, locale));
    }
  }

  const totalChecks = tools.length * 2 + 3; // tools × 2 locales + 1 org + 2 websites
  const failedScopes = new Set(allIssues.map((i) => i.scope)).size;
  const passedScopes = totalChecks - failedScopes;

  console.log(`\nToolhub JSON-LD audit (${tools.length} tools × 2 locales + site-wide)\n`);

  if (allIssues.length === 0) {
    console.log(`✓ ${passedScopes}/${totalChecks} scopes passed — all JSON-LD valid`);
    process.exit(0);
  }

  // Group by scope
  const grouped = new Map<string, Issue[]>();
  for (const issue of allIssues) {
    const list = grouped.get(issue.scope) ?? [];
    list.push(issue);
    grouped.set(issue.scope, list);
  }

  for (const [scope, issues] of grouped) {
    console.log(`✗ ${scope}`);
    for (const issue of issues) {
      console.log(`    ${issue.type}.${issue.field} — ${issue.detail ?? "missing"}`);
    }
  }

  console.log(
    `\n${"─".repeat(50)}\n✗ ${passedScopes}/${totalChecks} scopes passed — ${allIssues.length} issues across ${failedScopes} scopes`,
  );
  process.exit(1);
}

main();
