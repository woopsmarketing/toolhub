"use client";

/**
 * ProfileClient — 닉네임 인라인 편집.
 * Phase 5.4 신규.
 *
 * - 표시 모드: 닉네임 + "편집" 버튼
 * - 편집 모드: input + 저장/취소
 * - 저장: profiles.nickname UPDATE (RLS: 본인만)
 * - 낙관적 업데이트 + 실패 시 롤백 + 토스트
 */

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Pencil, Check, X } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface ProfileClientProps {
  userId: string;
  initialNickname: string;
}

const NICKNAME_MAX = 30;

export default function ProfileClient({
  userId,
  initialNickname,
}: ProfileClientProps) {
  const t = useTranslations("common");
  const [nickname, setNickname] = useState(initialNickname);
  const [draft, setDraft] = useState(initialNickname);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const [pending, startTransition] = useTransition();

  const startEdit = () => {
    setDraft(nickname);
    setEditing(true);
    setError(null);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraft(nickname);
    setError(null);
  };

  const save = () => {
    const trimmed = draft.trim().slice(0, NICKNAME_MAX);
    if (trimmed === nickname) {
      setEditing(false);
      return;
    }

    startTransition(async () => {
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        setError(t("saveFailed"));
        return;
      }

      // 낙관적 — UI 먼저 갱신, 실패 시 롤백
      const previous = nickname;
      setNickname(trimmed);
      setEditing(false);

      const { error: dbError } = await supabase
        .from("profiles")
        .update({ nickname: trimmed || null })
        .eq("id", userId);

      if (dbError) {
        setNickname(previous);
        setEditing(true);
        setError(t("saveFailed"));
        return;
      }

      setSavedToast(true);
    });
  };

  // saved toast 자동 사라짐 (cleanup-safe)
  useEffect(() => {
    if (!savedToast) return;
    const id = window.setTimeout(() => setSavedToast(false), 1800);
    return () => window.clearTimeout(id);
  }, [savedToast]);

  if (!editing) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold text-foreground">
          {nickname || (
            <span className="text-muted-foreground italic">
              {t("nickname")}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={startEdit}
          aria-label={t("edit")}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        {savedToast && (
          <span
            role="status"
            className="text-xs font-medium text-primary"
          >
            {t("saved")}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label htmlFor="nickname-input" className="sr-only">
        {t("nickname")}
      </label>
      <div className="flex items-center gap-2">
        <input
          id="nickname-input"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") cancelEdit();
          }}
          maxLength={NICKNAME_MAX}
          autoFocus
          disabled={pending}
          className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
          placeholder={t("nickname")}
        />
        <button
          type="button"
          onClick={save}
          disabled={pending}
          aria-label={t("save")}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md border border-primary bg-primary text-white transition-colors hover:bg-primary/90 disabled:opacity-60",
          )}
        >
          <Check className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={cancelEdit}
          disabled={pending}
          aria-label={t("cancel")}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-60"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
