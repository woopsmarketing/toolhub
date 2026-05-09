import { setRequestLocale } from "next-intl/server";
import { notFoundInProduction } from "@/lib/dev-only";

/**
 * /dev/* layout — gates ALL development showcase routes from production builds.
 *
 * Behavior:
 *  - In `NODE_ENV === "development"`: renders children normally.
 *  - In any other env (incl. "production" Vercel builds): triggers `notFound()`
 *    so the route returns a 404 (and is not part of the sitemap).
 *
 * Phase 1 PR-11.
 */
export default async function DevLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  notFoundInProduction();

  const { locale } = await params;
  setRequestLocale(locale);

  return <>{children}</>;
}

export const metadata = {
  robots: { index: false, follow: false },
};
