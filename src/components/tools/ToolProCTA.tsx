/**
 * ToolProCTA — Slot stub.
 *
 * Future home of a Pro upsell card ("Save unlimited history", "Larger files",
 * etc.). Activated per-tool when `monetization.proCta === true` AND the env
 * flag `NEXT_PUBLIC_FEATURE_PRO="1"` is set. Pro tier itself ships in Phase 5+.
 *
 * Returning `null` keeps the layout clean until then.
 */

export interface ToolProCTAProps {
  /** From `ToolConfig.monetization.proCta`. */
  enabled?: boolean;
  /** Tool slug — used for tracking the source CTA. */
  toolSlug: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ToolProCTA(_props: ToolProCTAProps) {
  if (process.env.NEXT_PUBLIC_FEATURE_PRO !== "1") return null;
  // TODO(Phase 5+): render Pro upsell card.
  return null;
}
