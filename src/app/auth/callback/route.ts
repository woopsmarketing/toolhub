/**
 * Toolhub — OAuth callback handler.
 *
 * Phase 5.1. Supabase OAuth (Google) 흐름의 마지막 단계:
 *   1. 사용자가 헤더 로그인 → supabase.auth.signInWithOAuth({ provider: "google" })
 *   2. Google 로그인 → Supabase 콜백 → 우리 앱의 본 라우트로 redirect
 *      (URL 예: /auth/callback?code=xxx&next=/ko/tools/text/word-counter)
 *   3. 본 핸들러가 code 를 세션으로 교환 → 쿠키 설정 → next 경로로 redirect
 *
 * locale 무관 (root path) — middleware matcher 에서 제외됨.
 */

import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");
  const errorParam = url.searchParams.get("error_description") ?? url.searchParams.get("error");

  // 안전한 redirect 경로만 허용 (open redirect 방지) — 우리 앱 내부 경로 또는 "/" 만.
  // 백슬래시(`\`) 도 일부 브라우저가 `/` 로 정규화하여 외부 도메인으로 새는 우회 경로가 됨.
  const safeNext =
    nextParam &&
    nextParam.startsWith("/") &&
    !nextParam.startsWith("//") &&
    !nextParam.includes("\\")
      ? nextParam
      : "/";

  if (errorParam) {
    return NextResponse.redirect(
      new URL(`/?auth_error=${encodeURIComponent(errorParam)}`, url.origin),
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?auth_error=missing_code", url.origin));
  }

  const supabase = await getSupabaseServer();
  if (!supabase) {
    return NextResponse.redirect(new URL("/?auth_error=client_unavailable", url.origin));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`/?auth_error=${encodeURIComponent(error.message)}`, url.origin),
    );
  }

  return NextResponse.redirect(new URL(safeNext, url.origin));
}
