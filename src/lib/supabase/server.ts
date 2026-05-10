/**
 * Toolhub — Supabase 서버 클라이언트 (RSC / Route Handler / Server Action).
 *
 * Phase 4.5 신규. 서버 컴포넌트에서 RLS-bound 데이터를 읽거나, route handler
 * 에서 현재 세션에 의존하는 작업이 필요할 때 사용.
 *
 * Phase 5 (인증 도입) 후에 본격 활용 — 지금은 인프라 셋업 단계.
 *
 * ⚠️ "use client" 모듈에서 import 금지. next/headers 의존.
 */

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export async function getSupabaseServer(): Promise<SupabaseClient<Database> | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) return null;

  const cookieStore = await cookies();

  return createServerClient<Database>(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: CookieOptions }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component 에서 호출 시 set 불가 — 무시.
          // middleware / route handler 에서만 실제 set 됨.
        }
      },
    },
  });
}
