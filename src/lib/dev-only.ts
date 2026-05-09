/**
 * dev-only — Helpers to gate development-only routes/features from production.
 *
 * Phase 1 PR-11: backs the `/dev/*` showcase route(s).
 *
 * The `notFoundInProduction()` helper renders Next.js's `not-found` page when
 * called outside `NODE_ENV === "development"`. It is intentionally written so
 * the import of `next/navigation` happens lazily (inside the function body) —
 * this keeps the helper safe to import from server components without pulling
 * the navigation runtime into client bundles in unrelated places.
 */

export const isDevEnvironment = process.env.NODE_ENV === "development";

/**
 * Throws Next.js's `notFound()` (which yields a 404) unless we're running in
 * a development environment.
 *
 * Usage:
 *   // app/[locale]/dev/layout.tsx
 *   import { notFoundInProduction } from "@/lib/dev-only";
 *   export default function DevLayout({ children }) {
 *     notFoundInProduction();
 *     return children;
 *   }
 */
export function notFoundInProduction(): void {
  if (!isDevEnvironment) {
    // Lazy require so the symbol is resolved only when actually needed.
    // `next/navigation`'s `notFound()` throws a special error Next.js catches
    // to render the not-found page.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { notFound } = require("next/navigation") as typeof import("next/navigation");
    notFound();
  }
}
