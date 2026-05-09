/**
 * ToolAdSlot — Slot stub.
 *
 * Future home of an inline ad placement (likely AdSense or equivalent).
 * Activated per-tool when `monetization.ads === true` AND the env flag
 * `NEXT_PUBLIC_FEATURE_ADS="1"` is set.
 *
 * Returning `null` keeps the layout clean until monetization rolls out.
 */

export interface ToolAdSlotProps {
  /** From `ToolConfig.monetization.ads`. */
  enabled?: boolean;
  /** Optional placement hint for future A/B tests. */
  placement?: "top" | "in-content" | "bottom";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ToolAdSlot(_props: ToolAdSlotProps) {
  if (process.env.NEXT_PUBLIC_FEATURE_ADS !== "1") return null;
  // TODO: render ad unit when ads program is live.
  return null;
}
