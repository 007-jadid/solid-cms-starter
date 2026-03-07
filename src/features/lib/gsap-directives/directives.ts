import { type Accessor, createEffect, onCleanup, onMount } from "solid-js";
import { EASE_OUT_EXPO, EASE_SMOOTH, gsap, ScrollTrigger } from "../gsap";
import { prefersReducedMotion } from "./motion-prefs";

// ─── Module augmentation for SolidJS custom directives ───
declare module "solid-js" {
  namespace JSX {
    interface Directives {
      fadeIn: true | { y?: number; duration?: number; delay?: number };
      staggerChildren:
        | true
        | {
            y?: number;
            stagger?: number;
            duration?: number;
            delay?: number;
          };
      scaleIn: true | { scale?: number; duration?: number; delay?: number };
      countUp: {
        end: number;
        duration?: number;
        decimals?: number;
        prefix?: string;
        suffix?: string;
      };
      hoverLift: true | { y?: number; shadow?: string };
      pressScale: true | { scale?: number };
      selectionPulse: true | { active?: boolean; scale?: number };
      scrollReveal: true | { y?: number; duration?: number; start?: string };
    }
  }
}

// ─── fadeIn ───────────────────────────────────────────────
interface FadeInOptions {
  y?: number;
  duration?: number;
  delay?: number;
}

export function fadeIn(el: HTMLElement, accessor: Accessor<FadeInOptions | true>) {
  if (prefersReducedMotion) return;
  const opts = typeof accessor() === "object" ? (accessor() as FadeInOptions) : {};
  const tween = gsap.fromTo(
    el,
    { opacity: 0, y: opts.y ?? 8 },
    {
      opacity: 1,
      y: 0,
      duration: opts.duration ?? 0.5,
      delay: opts.delay ?? 0,
      ease: EASE_OUT_EXPO,
      clearProps: "transform",
    },
  );
  onCleanup(() => tween.kill());
}

// ─── staggerChildren ─────────────────────────────────────
interface StaggerOptions {
  y?: number;
  stagger?: number;
  duration?: number;
  delay?: number;
}

export function staggerChildren(el: HTMLElement, accessor: Accessor<StaggerOptions | true>) {
  if (prefersReducedMotion) return;
  const opts = typeof accessor() === "object" ? (accessor() as StaggerOptions) : {};
  onMount(() => {
    const children = el.children;
    if (!children.length) return;
    const tween = gsap.fromTo(
      Array.from(children),
      { opacity: 0, y: opts.y ?? 16 },
      {
        opacity: 1,
        y: 0,
        duration: opts.duration ?? 0.4,
        stagger: opts.stagger ?? 0.06,
        delay: opts.delay ?? 0,
        ease: EASE_OUT_EXPO,
        clearProps: "transform",
      },
    );
    onCleanup(() => tween.kill());
  });
}

// ─── scaleIn ──────────────────────────────────────────────
interface ScaleInOptions {
  scale?: number;
  duration?: number;
  delay?: number;
}

export function scaleIn(el: HTMLElement, accessor: Accessor<ScaleInOptions | true>) {
  if (prefersReducedMotion) return;
  const opts = typeof accessor() === "object" ? (accessor() as ScaleInOptions) : {};
  const tween = gsap.fromTo(
    el,
    { opacity: 0, scale: opts.scale ?? 0.95 },
    {
      opacity: 1,
      scale: 1,
      duration: opts.duration ?? 0.4,
      delay: opts.delay ?? 0,
      ease: EASE_OUT_EXPO,
      clearProps: "transform",
    },
  );
  onCleanup(() => tween.kill());
}

// ─── countUp ──────────────────────────────────────────────
interface CountUpOptions {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export function countUp(el: HTMLElement, accessor: Accessor<CountUpOptions>) {
  const opts = accessor();
  if (prefersReducedMotion) {
    el.textContent = `${opts.prefix ?? ""}${opts.end.toLocaleString(undefined, { minimumFractionDigits: opts.decimals ?? 0, maximumFractionDigits: opts.decimals ?? 0 })}${opts.suffix ?? ""}`;
    return;
  }
  const counter = { value: 0 };
  const tween = gsap.to(counter, {
    value: opts.end,
    duration: opts.duration ?? 1.2,
    delay: 0.3,
    ease: EASE_SMOOTH,
    onUpdate() {
      const formatted = counter.value.toLocaleString(undefined, {
        minimumFractionDigits: opts.decimals ?? 0,
        maximumFractionDigits: opts.decimals ?? 0,
      });
      el.textContent = `${opts.prefix ?? ""}${formatted}${opts.suffix ?? ""}`;
    },
  });
  onCleanup(() => tween.kill());
}

// ─── hoverLift ────────────────────────────────────────────
interface HoverLiftOptions {
  y?: number;
  shadow?: string;
}

export function hoverLift(el: HTMLElement, accessor: Accessor<HoverLiftOptions | true>) {
  if (prefersReducedMotion) return;
  const opts = typeof accessor() === "object" ? (accessor() as HoverLiftOptions) : {};
  const y = opts.y ?? -3;

  const handleEnter = () => {
    gsap.to(el, {
      y,
      boxShadow: opts.shadow ?? "0 4px 12px rgba(0,0,0,0.1)",
      duration: 0.25,
      ease: EASE_SMOOTH,
    });
  };

  const handleLeave = () => {
    gsap.to(el, {
      y: 0,
      boxShadow: "0 0px 0px rgba(0,0,0,0)",
      duration: 0.25,
      ease: EASE_SMOOTH,
      clearProps: "will-change",
    });
  };

  el.addEventListener("mouseenter", handleEnter);
  el.addEventListener("mouseleave", handleLeave);

  onCleanup(() => {
    el.removeEventListener("mouseenter", handleEnter);
    el.removeEventListener("mouseleave", handleLeave);
    gsap.killTweensOf(el);
  });
}

// ─── pressScale ───────────────────────────────────────────
interface PressScaleOptions {
  scale?: number;
}

export function pressScale(el: HTMLElement, accessor: Accessor<PressScaleOptions | true>) {
  if (prefersReducedMotion) return;
  const opts = typeof accessor() === "object" ? (accessor() as PressScaleOptions) : {};
  const scale = opts.scale ?? 0.97;

  const handleDown = () => {
    gsap.to(el, { scale, duration: 0.1, ease: EASE_SMOOTH });
  };
  const handleUp = () => {
    gsap.to(el, { scale: 1, duration: 0.2, ease: "back.out(2)" });
  };

  el.addEventListener("mousedown", handleDown);
  el.addEventListener("mouseup", handleUp);
  el.addEventListener("mouseleave", handleUp);

  onCleanup(() => {
    el.removeEventListener("mousedown", handleDown);
    el.removeEventListener("mouseup", handleUp);
    el.removeEventListener("mouseleave", handleUp);
    gsap.killTweensOf(el);
  });
}

// ─── selectionPulse ──────────────────────────────────────
interface SelectionPulseOptions {
  active?: boolean;
  scale?: number;
}

export function selectionPulse(el: HTMLElement, accessor: Accessor<SelectionPulseOptions | true>) {
  if (prefersReducedMotion) return;

  createEffect(() => {
    const raw = accessor();
    const opts = typeof raw === "object" ? (raw as SelectionPulseOptions) : {};
    const shouldPulse = typeof raw === "boolean" ? raw : (opts.active ?? true);
    if (!shouldPulse) return;

    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { scale: 1 },
      {
        scale: opts.scale ?? 1.015,
        duration: 0.18,
        ease: EASE_SMOOTH,
        yoyo: true,
        repeat: 1,
        clearProps: "transform",
      },
    );
  });

  onCleanup(() => gsap.killTweensOf(el));
}

// ─── scrollReveal ─────────────────────────────────────────
interface ScrollRevealOptions {
  y?: number;
  duration?: number;
  start?: string;
}

export function scrollReveal(el: HTMLElement, accessor: Accessor<ScrollRevealOptions | true>) {
  if (prefersReducedMotion) return;
  const opts = typeof accessor() === "object" ? (accessor() as ScrollRevealOptions) : {};

  gsap.set(el, { opacity: 0, y: opts.y ?? 30 });

  const trigger = ScrollTrigger.create({
    trigger: el,
    start: opts.start ?? "top 85%",
    once: true,
    onEnter: () => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: opts.duration ?? 0.6,
        ease: EASE_OUT_EXPO,
        clearProps: "transform",
      });
    },
  });

  onCleanup(() => {
    trigger.kill();
    gsap.killTweensOf(el);
  });
}
