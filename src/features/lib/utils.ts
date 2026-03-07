import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Escape HTML special characters to prevent XSS when building HTML strings. */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Validate that a redirect URL is safe (relative path only).
 * Rejects protocol-relative URLs, absolute URLs, and data/javascript schemes.
 */
export function isSafeRedirectUrl(url: string): boolean {
  // Must start with a single "/" (not "//" which is protocol-relative)
  if (!url.startsWith("/") || url.startsWith("//")) return false;
  // Block any attempt to sneak in a scheme
  try {
    const parsed = new URL(url, "http://localhost");
    return parsed.origin === "http://localhost";
  } catch {
    return false;
  }
}
