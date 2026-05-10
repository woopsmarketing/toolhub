/**
 * useUser — Supabase 세션 / 유저 구독 훅 (클라이언트 전용).
 *
 * Phase 5.1 신규.
 *
 * - 마운트 시 getSession() 으로 초기값 로드
 * - onAuthStateChange 로 로그인/로그아웃 실시간 반영
 * - SSR-safe: 서버에서는 항상 { user: null, loading: true } 반환
 * - Supabase 클라이언트 미설정(env 누락) 시 { user: null, loading: false }
 */

"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "@/lib/supabase";

export interface UseUserResult {
  user: User | null;
  loading: boolean;
}

export function useUser(): UseUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowser();

    if (!supabase) {
      // microtask 로 미뤄 cascading render 회피
      Promise.resolve().then(() => {
        if (active) setLoading(false);
      });
      return () => {
        active = false;
      };
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return;
        setUser(session?.user ?? null);
        setLoading(false);
      },
    );

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
