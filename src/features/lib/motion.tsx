/**
 * Animation utility components — GSAP-based replacements for solid-motionone.
 * All components use GSAP directives or onMount animations.
 */

import type { JSX } from "solid-js";
import { For, onCleanup, onMount } from "solid-js";
import { EASE_OUT_EXPO, EASE_SMOOTH, gsap } from "./gsap";
import { cn } from "./utils";

// =============================================================================
// TRANSITION CONFIGS
// =============================================================================

export const defaultTransition = {
  duration: 0.3,
  ease: EASE_OUT_EXPO,
} as const;

export const fastTransition = {
  duration: 0.15,
  ease: EASE_OUT_EXPO,
} as const;

// =============================================================================
// EASINGS (CSS cubic-bezier strings for non-GSAP contexts)
// =============================================================================

export const easings = {
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
};

// =============================================================================
// ANIMATED COMPONENTS
// =============================================================================

/**
 * Fade-up wrapper for any content
 */
export function AnimatedContainer(props: {
  children: JSX.Element;
  class?: string;
  delay?: number;
}) {
  let ref!: HTMLDivElement;
  onMount(() => {
    const tween = gsap.fromTo(
      ref,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        delay: props.delay ?? 0,
        ease: EASE_OUT_EXPO,
        clearProps: "transform",
      },
    );
    onCleanup(() => tween.kill());
  });
  return (
    <div ref={ref} class={props.class} style={{ opacity: 0 }}>
      {props.children}
    </div>
  );
}

/**
 * Container for staggered list animations
 */
export function StaggerContainer(props: { children: JSX.Element; class?: string }) {
  let ref!: HTMLDivElement;
  onMount(() => {
    const tween = gsap.fromTo(
      ref,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: EASE_SMOOTH },
    );
    onCleanup(() => tween.kill());
  });
  return (
    <div ref={ref} class={props.class} style={{ opacity: 0 }}>
      {props.children}
    </div>
  );
}

/**
 * Individual item within a StaggerContainer
 */
export function StaggerItem(props: { children: JSX.Element; class?: string; index?: number }) {
  let ref!: HTMLDivElement;
  onMount(() => {
    const tween = gsap.fromTo(
      ref,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        delay: (props.index ?? 0) * 0.05,
        ease: EASE_OUT_EXPO,
        clearProps: "transform",
      },
    );
    onCleanup(() => tween.kill());
  });
  return (
    <div ref={ref} class={props.class} style={{ opacity: 0 }}>
      {props.children}
    </div>
  );
}

/**
 * Wrap page content for route transitions
 */
export function PageTransition(props: { children: JSX.Element; class?: string }) {
  let ref!: HTMLDivElement;
  onMount(() => {
    const tween = gsap.fromTo(
      ref,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, ease: EASE_OUT_EXPO, clearProps: "transform" },
    );
    onCleanup(() => tween.kill());
  });
  return (
    <div ref={ref} class={props.class} style={{ opacity: 0 }}>
      {props.children}
    </div>
  );
}

/**
 * Card with hover lift effect
 */
export function AnimatedCard(props: {
  children: JSX.Element;
  class?: string;
  enableHover?: boolean;
}) {
  let ref!: HTMLDivElement;
  onMount(() => {
    const tween = gsap.fromTo(
      ref,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.25, ease: EASE_OUT_EXPO, clearProps: "transform" },
    );
    if (props.enableHover) {
      const enter = () => gsap.to(ref, { y: -4, scale: 1.01, duration: 0.2, ease: EASE_SMOOTH });
      const leave = () =>
        gsap.to(ref, {
          y: 0,
          scale: 1,
          duration: 0.25,
          ease: EASE_OUT_EXPO,
          clearProps: "transform",
        });
      ref.addEventListener("mouseenter", enter);
      ref.addEventListener("mouseleave", leave);
      onCleanup(() => {
        ref.removeEventListener("mouseenter", enter);
        ref.removeEventListener("mouseleave", leave);
      });
    }
    onCleanup(() => tween.kill());
  });
  return (
    <div
      ref={ref}
      class={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        props.enableHover && "cursor-pointer",
        props.class,
      )}
      style={{ opacity: 0 }}
    >
      {props.children}
    </div>
  );
}

/**
 * Loading skeleton with shimmer effect
 */
export function Shimmer(props: {
  width?: number | string;
  height?: number | string;
  class?: string;
}) {
  const style = {
    width: typeof props.width === "number" ? `${props.width}px` : (props.width ?? "100%"),
    height: typeof props.height === "number" ? `${props.height}px` : (props.height ?? "16px"),
  } as const;

  return (
    <div
      style={style}
      class={cn(
        "relative overflow-hidden rounded-md bg-muted",
        "before:absolute before:inset-0 before:-translate-x-full before:bg-linear-to-r before:from-transparent before:via-white/40 before:to-transparent before:animate-[shimmer_1.6s_infinite]",
        props.class,
      )}
    />
  );
}

/**
 * Page loading skeleton with staggered animation
 * Use as Suspense fallback for pages
 */
export function PageLoadingFallback(props: { class?: string }) {
  const skeletonItems = [
    { width: 200, height: 32 },
    { width: "100%", height: 48 },
    { width: "100%", height: 400 },
  ];

  return (
    <div class={cn("space-y-4 p-6", props.class)}>
      <For each={skeletonItems}>
        {(item, index) => (
          <StaggerItem index={index()}>
            <Shimmer width={item.width} height={item.height} />
          </StaggerItem>
        )}
      </For>
    </div>
  );
}
