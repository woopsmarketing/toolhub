import type { NextConfig } from "next";
import type { Redirect } from "next/dist/lib/load-custom-routes";
import createNextIntlPlugin from "next-intl/plugin";
import { getAllTools } from "./src/tools/registry";
import { routing } from "./src/i18n/routing";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Phase 1 PR-12 — Legacy tool URL redirects.
 *
 * 기존 `/[locale]/tools/[slug]` 를 신규 `/[locale]/tools/[category]/[slug]` 로
 * 영구 (301) 이전한다. 매핑은 `src/tools/registry.ts` 에서 동적으로 생성하며
 * 신규 카테고리 (PR-8) 가 그대로 반영된다.
 *
 * 개수: 등록된 툴 수 × locale 수 (현재 29 × 2 = 58).
 *
 * 정책:
 *   - locale 보존 (ko → ko, en → en)
 *   - permanent: true (301)
 *
 * (PROJECT_PLAN.md §15.3 / docs/specs/url.md §2.5)
 */
function buildToolRedirects(): Redirect[] {
  const tools = getAllTools();
  const locales = routing.locales;
  return tools.flatMap((tool) =>
    locales.map((locale) => ({
      source: `/${locale}/tools/${tool.slug}`,
      destination: `/${locale}/tools/${tool.category}/${tool.slug}`,
      permanent: true,
    }))
  );
}

const nextConfig: NextConfig = {
  async redirects() {
    return buildToolRedirects();
  },
};

export default withNextIntl(nextConfig);
