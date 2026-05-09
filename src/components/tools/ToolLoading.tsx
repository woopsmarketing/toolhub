import { Loader2 } from "lucide-react";

export interface ToolLoadingProps {
  /** Optional label (e.g. "Loading…"). */
  label?: string;
}

/**
 * Lightweight loading indicator.
 *
 * Used as the `loading` fallback for dynamically imported templates and as a
 * generic placeholder while server-processed tools (Phase 2 image/PDF) await
 * their result.
 *
 * Server-renderable.
 */
export default function ToolLoading({ label }: ToolLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground"
    >
      <Loader2 className="h-4 w-4 animate-spin" />
      {label && <span>{label}</span>}
    </div>
  );
}
