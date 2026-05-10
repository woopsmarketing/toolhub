/**
 * Toolhub — Supabase 브라우저 클라이언트.
 *
 * Phase 4.5 신규. "use client" 컴포넌트 / 훅 / analytics fire-and-forget 에서 사용한다.
 *
 * - 환경변수 누락 시 console.warn 후 null 반환 → 호출부는 noop 처리할 것
 *   (analytics 등 부수적 사용처에서 SSR/빌드 깨뜨림 방지).
 * - 모듈 단위 싱글턴 — 첫 호출 시 1회 생성 후 재사용.
 * - 인증/세션은 Phase 5 에서 활성화. 현 시점은 anon key 만으로 RLS-bound 접근.
 */

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let cached: SupabaseClient<Database> | null | undefined;

export function getSupabaseBrowser(): SupabaseClient<Database> | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    if (typeof window !== "undefined") {
      console.warn(
        "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing — client disabled.",
      );
    }
    cached = null;
    return null;
  }

  cached = createBrowserClient<Database>(url, anon);
  return cached;
}
