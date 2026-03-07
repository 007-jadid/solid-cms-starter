/**
 * Shared input style tokens — single source of truth for all form field components.
 * Every input-like component imports from here instead of duplicating Tailwind classes.
 */

/** Base classes shared by ALL input-like elements */
export const inputBase =
  "flex w-full rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

/** Focus ring for native inputs (uses focus-visible) */
export const inputRing =
  "focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:ring-offset-1";

/** Focus ring for button-like triggers — Select, AsyncSelect (uses focus, not focus-visible) */
export const triggerRing = "focus:outline-none focus:ring-1 focus:ring-ring/40 focus:ring-offset-1";

/** Invalid/error state — bracket syntax for Kobalte data attributes */
export const inputInvalid =
  "data-[invalid]:border-destructive data-[invalid]:focus-visible:!ring-destructive/40";

/** File input reset */
export const inputFile = "file:border-0 file:bg-transparent file:text-sm file:font-medium";

/** Size variants */
export const inputSize = {
  default: "h-10 px-3 py-2",
  sm: "h-8 px-2.5 py-1.5",
  lg: "h-12 px-4 py-3",
} as const;
