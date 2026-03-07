import { EASE_OUT_EXPO, EASE_SMOOTH, gsap } from "../gsap";
import { prefersReducedMotion } from "./motion-prefs";

// ─── animateExpandOpen (imperative helper) ─────────────────
export function animateExpandOpen(el: HTMLElement) {
  if (prefersReducedMotion) return;
  const height = el.scrollHeight;
  gsap.fromTo(
    el,
    { height: 0, opacity: 0, overflow: "hidden" },
    {
      height,
      opacity: 1,
      duration: 0.35,
      ease: EASE_OUT_EXPO,
      clearProps: "height,overflow",
    },
  );
}

// ─── animateExpandClose (imperative helper) ────────────────
export function animateExpandClose(el: HTMLElement, onComplete?: () => void) {
  if (prefersReducedMotion) {
    onComplete?.();
    return;
  }
  gsap.to(el, {
    height: 0,
    opacity: 0,
    overflow: "hidden",
    duration: 0.25,
    ease: EASE_SMOOTH,
    onComplete,
  });
}

// ─── animateBulkActionsEnter (imperative helper) ───────────
export function animateBulkActionsEnter(el: HTMLElement) {
  if (prefersReducedMotion) return;
  gsap.fromTo(
    el,
    { opacity: 0, y: -12, scale: 0.97 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: "back.out(1.7)",
      clearProps: "transform",
    },
  );
}

// ─── animateInputMorph (imperative helper) ─────────────────
// Input scales up from its text placeholder position
export function animateInputMorph(el: HTMLElement) {
  if (prefersReducedMotion) return;
  gsap.fromTo(
    el,
    { scaleX: 0.92, scaleY: 0.85, opacity: 0, transformOrigin: "left center" },
    {
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      duration: 0.25,
      ease: EASE_OUT_EXPO,
      clearProps: "transform",
    },
  );
}
