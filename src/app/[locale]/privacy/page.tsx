import { setRequestLocale } from "next-intl/server";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isKo = locale === "ko";
  return {
    title: isKo ? "개인정보처리방침 - Toolhub" : "Privacy Policy - Toolhub",
    description: isKo
      ? "Toolhub의 개인정보 수집·이용·보관 정책. 모든 도구는 브라우저 내에서 동작하며 입력 데이터는 서버로 전송되지 않습니다."
      : "Toolhub's privacy policy. All tools run in your browser; input data is never transmitted to our servers.",
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: { ko: "/ko/privacy", en: "/en/privacy" },
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKo = locale === "ko";
  const lastUpdated = "2026-05-10";

  if (isKo) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <article className="legal-content">
          <h1>개인정보처리방침</h1>
          <p className="text-sm text-muted-foreground">
            마지막 업데이트: {lastUpdated}
          </p>

          <h2>1. 데이터 처리 원칙</h2>
          <p>
            Toolhub의 모든 도구는 사용자의 브라우저 내에서만 동작합니다. 사용자가
            입력한 텍스트·파일·계산값 등 어떠한 콘텐츠도 Toolhub 서버 또는
            외부 서비스로 전송되지 않습니다.
          </p>

          <h2>2. 로컬 저장소 사용</h2>
          <p>
            즐겨찾기, 사용 히스토리, 다크모드 설정, 언어 선택 등 사용자 환경설정은
            브라우저의 LocalStorage에만 저장됩니다. 이 데이터는 사용자의 기기에만
            존재하며 Toolhub가 접근할 수 없습니다. 브라우저 데이터를 삭제하면
            함께 사라집니다.
          </p>

          <h2>3. 분석</h2>
          <p>
            방문자 트렌드 파악을 위해 Google Analytics 4(GA4)를 사용할 수 있습니다.
            GA4는 IP 주소, 브라우저 정보, 페이지 이동 등을 익명화된 형태로 수집합니다.
            개인 식별 정보는 수집되지 않습니다. 추적을 원하지 않으면 브라우저의
            추적 차단 기능 또는 Do Not Track 설정을 활용할 수 있습니다.
          </p>

          <h2>4. 쿠키</h2>
          <p>
            Toolhub 자체는 추적용 쿠키를 사용하지 않습니다. GA4가 익명 식별용
            쿠키를 사용할 수 있습니다.
          </p>

          <h2>5. 광고 / 제휴</h2>
          <p>
            현재 광고는 표시하지 않습니다. 향후 도입 시 본 정책을 갱신하고 사전에
            안내합니다.
          </p>

          <h2>6. 이용자 권리</h2>
          <p>
            사용자는 언제든지 브라우저의 LocalStorage를 삭제하여 저장된 환경설정을
            제거할 수 있습니다. GA4 옵트아웃은{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener"
            >
              Google 공식 옵트아웃 도구
            </a>
            를 통해 가능합니다.
          </p>

          <h2>7. 정책 변경</h2>
          <p>
            본 정책이 변경될 경우 본 페이지에 공지하며, 중요한 변경은 사이트 상단
            배너로 안내합니다.
          </p>

          <h2>8. 문의</h2>
          <p>
            개인정보 관련 문의:{" "}
            <a href="mailto:privacy@toolhub.co.kr" className="text-primary hover:underline">
              privacy@toolhub.co.kr
            </a>
          </p>
        </article>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="legal-content">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

        <h2>1. Data processing principles</h2>
        <p>
          All Toolhub tools run entirely within your browser. Any text, file, or
          input value you provide is never transmitted to Toolhub servers or any
          third-party service.
        </p>

        <h2>2. Local storage</h2>
        <p>
          Favorites, usage history, dark-mode preference, and language selection
          are stored only in your browser's LocalStorage. This data lives on your
          device, is not accessible to Toolhub, and is deleted when you clear
          your browser data.
        </p>

        <h2>3. Analytics</h2>
        <p>
          We may use Google Analytics 4 (GA4) to understand aggregate visitor
          trends. GA4 collects anonymized data such as IP address, browser
          metadata, and page navigation. No personally identifying information is
          collected. You can opt out via your browser's tracking-protection
          settings or Do Not Track signals.
        </p>

        <h2>4. Cookies</h2>
        <p>
          Toolhub itself does not set tracking cookies. GA4 may set anonymous
          identification cookies.
        </p>

        <h2>5. Ads / affiliates</h2>
        <p>
          We do not currently display advertisements. If introduced in future,
          this policy will be updated with prior notice.
        </p>

        <h2>6. Your rights</h2>
        <p>
          You can clear your browser's LocalStorage at any time to remove stored
          preferences. Opt out of GA4 via the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener"
          >
            official Google opt-out tool
          </a>
          .
        </p>

        <h2>7. Policy changes</h2>
        <p>
          Material changes to this policy will be announced on this page, with a
          banner notice for significant updates.
        </p>

        <h2>8. Contact</h2>
        <p>
          Privacy inquiries:{" "}
          <a href="mailto:privacy@toolhub.co.kr" className="text-primary hover:underline">
            privacy@toolhub.co.kr
          </a>
        </p>
      </article>
    </div>
  );
}
