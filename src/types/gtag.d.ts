/**
 * Global type augmentation for Google Analytics 4 (gtag.js).
 * See PROJECT_PLAN.md §4 — GA4 is the sole analytics backend through Phase 4.
 */

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js" | "set" | "consent",
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export {};
