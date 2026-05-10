"use client";

/**
 * AuthButton — 헤더용 Google 로그인 / 사용자 메뉴.
 *
 * Phase 5.1 신규.
 *
 * 비로그인 시: "Sign in" 버튼 → Google OAuth 흐름
 * 로그인 시:  아바타 / 이름 + 드롭다운 (로그아웃)
 *
 * - 클릭 직후 현재 경로를 ?next= 로 callback 에 넘겨 → 로그인 후 같은 페이지 복귀
 * - useUser 로딩 중에는 placeholder 버튼 (CLS 방지)
 */

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { getSupabaseBrowser } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const BTN =
  "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
const IDLE = "bg-card text-muted-foreground hover:bg-muted hover:text-foreground";
const PRIMARY = "bg-primary text-white hover:bg-primary/90 border-primary";

export default function AuthButton() {
  const t = useTranslations("common");
  const { user, loading } = useUser();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDocClick);
    return () => window.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const handleSignIn = async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase || busy) return;
    setBusy(true);
    try {
      const next =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/";
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        next,
      )}`;
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      // signInWithOAuth 가 자체 redirect 를 발생시키므로 이 라인 이후는 실행되지 않음.
    } catch {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase || busy) return;
    setBusy(true);
    try {
      await supabase.auth.signOut();
      setOpen(false);
      // 서버 상태(예: RSC) 갱신을 위해 새로고침
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div
        aria-hidden="true"
        className="h-9 w-20 animate-pulse rounded-lg bg-muted"
      />
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={handleSignIn}
        disabled={busy}
        aria-label={t("signIn")}
        className={cn(BTN, PRIMARY, busy && "opacity-60 cursor-not-allowed")}
      >
        <LogIn className="h-4 w-4" aria-hidden="true" />
        {t("signIn")}
      </button>
    );
  }

  const displayName =
    (user.user_metadata?.name as string | undefined) ||
    (user.user_metadata?.full_name as string | undefined) ||
    user.email ||
    t("account");
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("accountMenu")}
        className={cn(BTN, IDLE, "max-w-[10rem]")}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="h-5 w-5 rounded-full object-cover"
          />
        ) : (
          <UserIcon className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="truncate">{displayName}</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t("accountMenu")}
          className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-1 shadow-lg z-50"
        >
          <div className="border-b border-border px-3 py-2 text-xs text-muted-foreground">
            <div className="truncate font-medium text-foreground">
              {displayName}
            </div>
            {user.email && (
              <div className="truncate">{user.email}</div>
            )}
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={busy}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {t("signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
