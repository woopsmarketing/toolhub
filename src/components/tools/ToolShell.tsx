import type { ReactNode } from "react";

export interface ToolShellProps {
  /** Tool body — usually the dynamically loaded template component. */
  children: ReactNode;
}

/**
 * Page-structure component: container wrapping the actual tool area
 * (the children rendered by ToolLoader / template).
 *
 * Server-renderable.
 */
export default function ToolShell({ children }: ToolShellProps) {
  return (
    <div className="mb-14 rounded-2xl border border-border bg-card p-6 shadow-sm">
      {children}
    </div>
  );
}
