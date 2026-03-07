import { EASE_OUT_EXPO, EASE_SMOOTH, gsap } from "../gsap";
import { prefersReducedMotion } from "./motion-prefs";

// ─── animateTableRows (imperative helper) ─────────────────
// Premium stagger: rows sweep in from left with a clip-path reveal + subtle x offset
export function animateTableRows(tableBodyEl: HTMLElement) {
  if (prefersReducedMotion) return;
  const rows = tableBodyEl.querySelectorAll("tr");
  if (!rows.length) return;
  gsap.killTweensOf(rows);
  gsap.fromTo(
    rows,
    {
      opacity: 0,
      x: -8,
      clipPath: "inset(0 100% 0 0)",
    },
    {
      opacity: 1,
      x: 0,
      clipPath: "inset(0 0% 0 0)",
      stagger: 0.035,
      duration: 0.4,
      ease: EASE_OUT_EXPO,
      clearProps: "transform,clipPath",
    },
  );
}

// ─── animatePageTransition (imperative helper) ─────────────
// Crossfade rows when page/tab changes: fade out old → stagger in new
export function animatePageTransition(tableBodyEl: HTMLElement, onMidpoint?: () => void) {
  if (prefersReducedMotion) {
    onMidpoint?.();
    return;
  }
  const rows = tableBodyEl.querySelectorAll("tr");
  if (!rows.length) {
    onMidpoint?.();
    return;
  }
  gsap.killTweensOf(rows);

  // Quick fade out then stagger in
  const tl = gsap.timeline();
  tl.to(rows, {
    opacity: 0,
    y: -4,
    duration: 0.15,
    ease: EASE_SMOOTH,
    stagger: 0.01,
    onComplete: () => onMidpoint?.(),
  }).fromTo(
    rows,
    { opacity: 0, y: 6, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: 0.03,
      duration: 0.35,
      ease: EASE_OUT_EXPO,
      clearProps: "transform",
    },
  );
}

// ─── animateRowSelect (imperative helper) ──────────────────
// Brief pulse on the selection indicator
export function animateRowSelect(rowEl: HTMLElement) {
  if (prefersReducedMotion || !rowEl) return;
  gsap.killTweensOf(rowEl);
  const tl = gsap.timeline();
  tl.fromTo(rowEl, { scale: 1 }, { scale: 1.005, duration: 0.15, ease: EASE_SMOOTH }).to(rowEl, {
    scale: 1,
    duration: 0.25,
    ease: "back.out(2)",
    clearProps: "transform",
  });
}

// ─── animateRowDeselect (imperative helper) ────────────────
export function animateRowDeselect(rowEl: HTMLElement) {
  if (prefersReducedMotion || !rowEl) return;
  gsap.killTweensOf(rowEl);
  gsap.to(rowEl, {
    scale: 1,
    duration: 0.2,
    ease: EASE_SMOOTH,
    clearProps: "transform",
  });
}

// ─── animateEditStart (imperative helper) ──────────────────
// Row lifts slightly with a glow when editing starts
export function animateEditStart(rowEl: HTMLElement) {
  if (prefersReducedMotion || !rowEl) return;
  gsap.killTweensOf(rowEl);

  // Resolve CSS variable to an actual color GSAP can parse
  const primary = getComputedStyle(rowEl).getPropertyValue("--primary").trim();
  const shadowColor = primary ? `hsl(${primary})` : "hsl(210, 100%, 50%)";

  gsap.fromTo(
    rowEl,
    { boxShadow: `0 0 0 0 transparent` },
    {
      boxShadow: `0 0 0 2px color-mix(in srgb, ${shadowColor} 15%, transparent)`,
      y: -1,
      duration: 0.3,
      ease: EASE_OUT_EXPO,
    },
  );
}

// ─── animateEditEnd (imperative helper) ────────────────────
export function animateEditEnd(rowEl: HTMLElement) {
  if (prefersReducedMotion || !rowEl) return;
  gsap.killTweensOf(rowEl);
  gsap.to(rowEl, {
    boxShadow: "0 0 0 0 transparent",
    y: 0,
    duration: 0.25,
    ease: EASE_SMOOTH,
    clearProps: "transform,boxShadow",
  });
}
