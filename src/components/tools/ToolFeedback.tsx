/**
 * ToolFeedback — Slot stub.
 *
 * Future home of a star rating + free-text comment widget per tool.
 * Real implementation will land alongside the feedback storage decision
 * (Phase 4.5+ once the dedicated DB is in place).
 *
 * Toggled by the env flag `NEXT_PUBLIC_FEATURE_FEEDBACK="1"`. Default off.
 *
 * Returning `null` keeps the layout footprint zero until then.
 */

export interface ToolFeedbackProps {
  /** Tool slug — needed by future submission/storage. */
  toolSlug: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ToolFeedback(_props: ToolFeedbackProps) {
  if (process.env.NEXT_PUBLIC_FEATURE_FEEDBACK !== "1") return null;
  // TODO(Phase 4.5+): render rating + comment form.
  return null;
}
