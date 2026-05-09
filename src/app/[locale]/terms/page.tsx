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
    title: isKo ? "이용약관 - Toolhub" : "Terms of Service - Toolhub",
    description: isKo
      ? "Toolhub 무료 온라인 도구 이용약관."
      : "Terms of service for using Toolhub's free online tools.",
    alternates: {
      canonical: `/${locale}/terms`,
      languages: { ko: "/ko/terms", en: "/en/terms" },
    },
  };
}

export default async function TermsPage({
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
          <h1>이용약관</h1>
          <p className="text-sm text-muted-foreground">마지막 업데이트: {lastUpdated}</p>

          <h2>1. 서비스 소개</h2>
          <p>
            Toolhub("서비스")는 텍스트, 코드, 계산, 변환, 이미지, PDF, 보안 등
            다양한 분야의 무료 온라인 도구를 제공합니다.
          </p>

          <h2>2. 이용</h2>
          <p>
            모든 도구는 별도 회원가입 없이 즉시 사용할 수 있습니다. 사용자는
            법령에 위배되지 않는 합리적인 범위 내에서 자유롭게 도구를 이용할
            수 있습니다.
          </p>

          <h2>3. 금지 행위</h2>
          <ul>
            <li>자동화된 대규모 요청으로 서비스에 부하를 가하는 행위</li>
            <li>서비스의 보안을 우회하거나 무단 접근하는 행위</li>
            <li>타인의 권리를 침해하거나 불법적인 목적으로 도구를 사용하는 행위</li>
          </ul>

          <h2>4. 보증의 부인</h2>
          <p>
            서비스는 "있는 그대로" 제공되며, 특정 목적에의 적합성이나 정확성에
            관한 어떠한 명시적/묵시적 보증도 하지 않습니다. 결과의 정확성을 사용자가
            반드시 검증해야 합니다 (예: 계산기 결과의 법적/재무적 효력).
          </p>

          <h2>5. 책임의 제한</h2>
          <p>
            Toolhub는 본 서비스 사용으로 인해 발생한 직간접적 손해, 데이터 손실,
            업무 중단, 기타 어떠한 손해에 대해서도 책임을 지지 않습니다.
          </p>

          <h2>6. 콘텐츠 라이선스</h2>
          <p>
            가이드 문서, FAQ 등 사이트의 텍스트 콘텐츠는 CC BY 4.0 라이선스 하에
            출처 표기 시 자유롭게 인용·재사용할 수 있습니다. 코드는 별도 저장소
            라이선스를 따릅니다.
          </p>

          <h2>7. 약관 변경</h2>
          <p>
            본 약관은 변경될 수 있으며, 변경 시 본 페이지에 공지합니다. 변경 후
            서비스를 계속 이용하면 변경에 동의한 것으로 간주됩니다.
          </p>

          <h2>8. 준거법</h2>
          <p>
            본 약관은 대한민국 법령에 따라 해석됩니다.
          </p>

          <h2>9. 문의</h2>
          <p>
            <a href="mailto:hello@toolhub.co.kr" className="text-primary hover:underline">
              hello@toolhub.co.kr
            </a>
          </p>
        </article>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="legal-content">
        <h1>Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

        <h2>1. Service description</h2>
        <p>
          Toolhub ("the Service") provides free online tools across text, code,
          calculation, conversion, image, PDF, and security categories.
        </p>

        <h2>2. Use</h2>
        <p>
          All tools are usable immediately without registration. You may use the
          tools freely within reasonable limits and applicable law.
        </p>

        <h2>3. Prohibited conduct</h2>
        <ul>
          <li>Automated bulk requests that impose undue load on the Service</li>
          <li>Bypassing or attempting to bypass security mechanisms</li>
          <li>Using the tools to violate others' rights or for unlawful purposes</li>
        </ul>

        <h2>4. Disclaimer of warranties</h2>
        <p>
          The Service is provided "as is" without express or implied warranties of
          fitness for a particular purpose or accuracy. You must verify results
          before relying on them (e.g., calculator outputs for legal or financial
          decisions).
        </p>

        <h2>5. Limitation of liability</h2>
        <p>
          Toolhub is not liable for any direct or indirect damages, data loss,
          business interruption, or other harm arising from use of the Service.
        </p>

        <h2>6. Content license</h2>
        <p>
          Site text content (guides, FAQ) is licensed under CC BY 4.0 and may be
          freely cited and reused with attribution. Code follows the license of
          the source repository.
        </p>

        <h2>7. Changes to terms</h2>
        <p>
          These terms may change; updates will be posted on this page. Continued
          use after changes constitutes acceptance.
        </p>

        <h2>8. Governing law</h2>
        <p>These terms are governed by the laws of the Republic of Korea.</p>

        <h2>9. Contact</h2>
        <p>
          <a href="mailto:hello@toolhub.co.kr" className="text-primary hover:underline">
            hello@toolhub.co.kr
          </a>
        </p>
      </article>
    </div>
  );
}
