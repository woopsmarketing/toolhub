/**
 * Profile page (Phase 5.4) — 로그인된 사용자의 프로필.
 *
 * - Server Component: setRequestLocale + Supabase 세션 가드
 * - 비로그인 → "/" 리다이렉트
 * - 닉네임 편집은 ProfileClient (client component) 가 담당
 * - 즐겨찾기 카드 그리드는 RelatedTools 패턴 재활용
 */

import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { categories, categoryOrder } from "@/config/categories";
import { getToolBySlug } from "@/tools/registry";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isKo = locale === "ko";
  return {
    title: isKo ? "프로필 — Toolhub" : "Profile — Toolhub",
    description: isKo
      ? "Toolhub 계정 프로필 페이지"
      : "Toolhub account profile page",
    robots: { index: false, follow: false },
    alternates: {
      canonical: `/${locale}/profile`,
      languages: { ko: "/ko/profile", en: "/en/profile" },
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await getSupabaseServer();
  if (!supabase) redirect(`/${locale}`);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}`);

  // profiles + 즐겨찾기 병렬 조회
  const [profileRes, favsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("nickname, locale, plan, avatar_url, created_at")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("tool_favorites")
      .select("tool_slug, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const profile = profileRes.data;
  const favoriteSlugs = (favsRes.data ?? []).map((row) => row.tool_slug);

  const isKo = locale === "ko";
  const t = await getTranslations({ locale, namespace: "common" });

  // 즐겨찾기 카드용 — registry 에서 풀어내기
  const favoriteTools = favoriteSlugs
    .map((slug) => getToolBySlug(slug))
    .filter(
      (tool): tool is NonNullable<ReturnType<typeof getToolBySlug>> =>
        Boolean(tool),
    );

  const joinedAtFormatted = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(
        isKo ? "ko-KR" : "en-US",
        { year: "numeric", month: "long", day: "numeric" },
      )
    : "—";

  const planLabel =
    profile?.plan === "pro" ? t("planPro") : t("planFree");

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-extrabold text-foreground">
        {t("profile")}
      </h1>

      {/* 계정 카드 */}
      <section className="mb-10 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-5">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt=""
              referrerPolicy="no-referrer"
              className="h-20 w-20 flex-shrink-0 rounded-full object-cover ring-2 ring-border"
            />
          ) : (
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-muted text-2xl font-bold text-muted-foreground">
              {(profile?.nickname || user.email || "?")
                .slice(0, 1)
                .toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0 space-y-3">
            <ProfileClient
              userId={user.id}
              initialNickname={profile?.nickname ?? ""}
            />

            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t("email")}
                </dt>
                <dd className="font-medium text-foreground break-all">
                  {user.email ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t("joinedAt")}
                </dt>
                <dd className="font-medium text-foreground">
                  {joinedAtFormatted}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t("plan")}
                </dt>
                <dd>
                  <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {planLabel}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* 즐겨찾기 */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">
          {t("myFavorites")}{" "}
          <span className="ml-1 text-base font-normal text-muted-foreground">
            ({favoriteTools.length})
          </span>
        </h2>

        {favoriteTools.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t("myFavoritesEmpty")}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {favoriteTools.map((tool) => {
              const localeKey = isKo ? "ko" : "en";
              const seoForLocale = tool.seo?.[localeKey];
              const title = seoForLocale?.title ?? tool.slug;
              const description = seoForLocale?.description ?? "";
              const categoryLabel = categories[tool.category]?.name[isKo ? "ko" : "en"] ?? tool.category;
              return (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.category}/${tool.slug}`}
                    className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/30"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                        {categoryLabel}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {title}
                    </h3>
                    {description && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {description}
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* 카테고리 다시 둘러보기 */}
      <section className="mt-12 border-t border-border pt-8">
        <p className="mb-3 text-sm text-muted-foreground">
          {isKo ? "더 둘러보기:" : "Explore more:"}
        </p>
        <div className="flex flex-wrap gap-2">
          {categoryOrder.map((cat) => (
            <Link
              key={cat}
              href={`/categories/${cat}`}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {categories[cat]?.name[isKo ? "ko" : "en"] ?? cat}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
