"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useTranslations } from "next-intl";
import { Sun, Moon, Monitor } from "lucide-react";

type ThemeValue = "light" | "dark" | "system";

// SSR/CSR 동기화: 서버에서는 false, 클라이언트에서는 true 반환
// → mount 후에만 실제 토글 UI 노출 (FOUC + hydration mismatch 방지)
function subscribe() {
  return () => {};
}
function getSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("themeToggle");
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden />;
  }

  const current = (theme ?? "system") as ThemeValue;
  const next: ThemeValue =
    current === "light" ? "dark" : current === "dark" ? "system" : "light";

  const Icon = current === "dark" ? Moon : current === "system" ? Monitor : Sun;
  const currentLabel =
    current === "dark"
      ? t("dark")
      : current === "system"
        ? t("system")
        : t("light");

  return (
    <button
      type="button"
      aria-label={`${t("label")} (${currentLabel})`}
      title={currentLabel}
      onClick={() => setTheme(next)}
      className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius)] border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export default ThemeToggle;
