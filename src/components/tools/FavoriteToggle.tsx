"use client";

/**
 * FavoriteToggle — ToolHeader 제목 옆에 노출되는 즐겨찾기 토글.
 *
 * 도구 페이지를 자주 쓰는 페이지로 등록한다는 의미가 강하므로 페이지 상단에 배치한다.
 * (기존 ToolActions 툴바의 Favorite 버튼은 중복 방지를 위해 제거됨.)
 */

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFavorite } from "@/hooks/useFavorite";
import { cn } from "@/lib/utils";

export default function FavoriteToggle({ toolSlug }: { toolSlug: string }) {
  const t = useTranslations("common");
  const { isFavorite, toggle } = useFavorite(toolSlug);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? t("unfavoriteTooltip") : t("favoriteTooltip")}
      title={isFavorite ? t("unfavoriteTooltip") : t("favoriteTooltip")}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        isFavorite
          ? "border-primary bg-primary text-primary-foreground hover:opacity-90"
          : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Heart
        className={cn("h-4 w-4", isFavorite && "fill-current")}
        aria-hidden="true"
      />
      {isFavorite ? t("favorited") : t("favorite")}
    </button>
  );
}
