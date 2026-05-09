import { setRequestLocale } from "next-intl/server";
import { getToolCount } from "@/tools/registry";
import { categoryOrder } from "@/config/categories";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isKo = locale === "ko";
  return {
    title: isKo ? "Toolhub 소개" : "About Toolhub",
    description: isKo
      ? "Toolhub는 무료 온라인 도구 모음 사이트입니다. 텍스트, 개발, 계산, 변환, 보안 등 다양한 분야의 도구를 회원가입 없이 브라우저에서 바로 사용할 수 있습니다."
      : "Toolhub is a free online tools collection. Use text, developer, calculator, converter, and security tools directly in your browser — no sign-up required.",
    alternates: {
      canonical: `/${locale}/about`,
      languages: { ko: "/ko/about", en: "/en/about" },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKo = locale === "ko";
  const toolCount = getToolCount();
  const categoryCount = categoryOrder.length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="legal-content">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {isKo ? "Toolhub 소개" : "About Toolhub"}
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {isKo
            ? `Toolhub는 ${toolCount}개의 무료 온라인 도구를 ${categoryCount}개 카테고리(텍스트, 개발자, 계산기, 변환기, 이미지, PDF, SEO, 보안, 생산성, AI)로 제공합니다. 모든 도구는 브라우저에서 직접 동작하며, 입력 데이터는 서버로 전송되지 않습니다.`
            : `Toolhub provides ${toolCount} free online tools across ${categoryCount} categories (text, developer, calculator, converter, image, PDF, SEO, security, productivity, AI). Every tool runs directly in your browser — your input never reaches our servers.`}
        </p>

        <h2 className="mt-10 text-xl font-bold text-foreground">
          {isKo ? "원칙" : "Principles"}
        </h2>
        <ul className="mt-3 space-y-2 text-foreground">
          <li>
            <strong>{isKo ? "무료" : "Free"}</strong> —{" "}
            {isKo
              ? "모든 도구는 영구 무료입니다. 결제·구독 없음."
              : "All tools are permanently free. No paywalls, no subscriptions."}
          </li>
          <li>
            <strong>{isKo ? "회원가입 불필요" : "No sign-up"}</strong> —{" "}
            {isKo
              ? "이메일/계정 없이 바로 사용. 즐겨찾기/히스토리는 LocalStorage로 기기 내 저장."
              : "Use immediately without an account. Favorites and history live in LocalStorage on your device."}
          </li>
          <li>
            <strong>{isKo ? "프라이버시 우선" : "Privacy-first"}</strong> —{" "}
            {isKo
              ? "모든 처리는 브라우저에서. 입력 텍스트/파일은 어떤 서버로도 전송되지 않음."
              : "All processing happens in your browser. Input data is never transmitted to any server."}
          </li>
          <li>
            <strong>{isKo ? "오픈" : "Open"}</strong> —{" "}
            {isKo
              ? "MIT 라이선스 라이브러리만 사용. 광고 없는 단정한 UI."
              : "MIT-licensed dependencies only. Ad-free, distraction-free UI."}
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-bold text-foreground">
          {isKo ? "기술" : "Technology"}
        </h2>
        <p className="mt-3 text-foreground">
          {isKo
            ? "Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 · next-intl 한·영 지원. 모든 도구는 정적으로 사전 렌더되며 PWA 친화적입니다."
            : "Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 · next-intl Korean/English. All tools are statically prerendered and PWA-friendly."}
        </p>

        <h2 className="mt-10 text-xl font-bold text-foreground">
          {isKo ? "문의" : "Contact"}
        </h2>
        <p className="mt-3 text-foreground">
          {isKo ? "기능 요청·버그 제보·제휴 문의: " : "Feature requests, bug reports, partnerships: "}
          <a
            href="mailto:hello@toolhub.co.kr"
            className="text-primary hover:underline"
          >
            hello@toolhub.co.kr
          </a>
        </p>
      </article>
    </div>
  );
}
