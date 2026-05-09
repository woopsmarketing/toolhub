/**
 * ToolAiUpgradeSlot — Slot stub.
 *
 * Future home of a "Try the AI version" recommendation for tools that have an
 * AI-augmented sibling (e.g. summarize / rewrite / translate). Activated per-tool
 * when `monetization.aiCredits === true` AND the env flag
 * `NEXT_PUBLIC_FEATURE_AI_UPGRADE="1"` is set. AI tools themselves ship in Phase 3.
 *
 * Returning `null` keeps the layout clean until then.
 */

export interface ToolAiUpgradeSlotProps {
  /** From `ToolConfig.monetization.aiCredits`. */
  enabled?: boolean;
  /** Tool slug — used for tracking the source CTA. */
  toolSlug: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ToolAiUpgradeSlot(_props: ToolAiUpgradeSlotProps) {
  if (process.env.NEXT_PUBLIC_FEATURE_AI_UPGRADE !== "1") return null;
  // TODO(Phase 3+): render AI upgrade recommendation card.
  return null;
}
