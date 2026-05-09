/**
 * ToolAffiliateCTA — Slot stub.
 *
 * Future home of context-aware affiliate-link CTAs (e.g. "Recommended editor"
 * on developer tools). Activated per-tool when `monetization.affiliate === true`
 * AND the env flag `NEXT_PUBLIC_FEATURE_AFFILIATE="1"` is set.
 *
 * Returning `null` keeps the layout clean until the affiliate program rolls out.
 */

export interface ToolAffiliateCTAProps {
  /** From `ToolConfig.monetization.affiliate`. */
  enabled?: boolean;
  /** Tool slug — used for tracking the source CTA. */
  toolSlug: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ToolAffiliateCTA(_props: ToolAffiliateCTAProps) {
  if (process.env.NEXT_PUBLIC_FEATURE_AFFILIATE !== "1") return null;
  // TODO: render affiliate link card.
  return null;
}
