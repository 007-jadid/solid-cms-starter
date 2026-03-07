import { onCleanup } from "solid-js";
import { EASE_OUT_EXPO, gsap } from "../gsap";
import { prefersReducedMotion } from "./motion-prefs";

// ─── observeOnce ─────────────────────────────────────────
// Fires `callback` once when `el` enters the viewport.
//
// Uses IntersectionObserver as the primary mechanism, with a
// ResizeObserver fallback. The RO catches elements that transition
// from hidden → visible (e.g. Kobalte tab content mounting or
// display:none being removed) and forces the IO to re-evaluate by
// disconnecting + re-observing. Without this, IO can silently miss
// the intersection event for elements that appear after a tab switch.
function observeOnce(el: HTMLElement, callback: () => void, threshold = 0.1) {
  let done = false;

  const fire = () => {
    if (done) return;
    done = true;
    io.disconnect();
    ro.disconnect();
    callback();
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) fire();
    },
    { threshold },
  );

  // When the element's size changes (e.g. becoming visible after a tab
  // switch), force the IO to re-evaluate by disconnecting + re-observing.
  const ro = new ResizeObserver(() => {
    if (done) return;
    io.disconnect();
    io.observe(el);
  });

  io.observe(el);
  ro.observe(el);

  onCleanup(() => {
    io.disconnect();
    ro.disconnect();
  });
}

// ─── animateChartWipe ────────────────────────────────────
// Horizontal clip-path curtain reveal — left → right
// Gives charts a cinematic "drawing" entrance.
//
// Uses clipPath (not opacity) to hide initially so Chart.js can
// measure its container and render the canvas at the correct size.
// Animates directly on mount — the parent card's scroll-triggered
// entrance (animateGridCards) already gates visibility.
export function animateChartWipe(
  el: HTMLElement,
  opts: { duration?: number; delay?: number } = {},
) {
  if (prefersReducedMotion) return;

  gsap.fromTo(
    el,
    { clipPath: "inset(0 100% 0 0)" },
    {
      clipPath: "inset(0 0% 0 0)",
      duration: opts.duration ?? 0.85,
      delay: opts.delay ?? 0.15,
      ease: "power3.out",
      clearProps: "clipPath",
    },
  );

  onCleanup(() => gsap.killTweensOf(el));
}

// ─── attachCardSpotlight ─────────────────────────────────
// Cursor-tracking radial gradient spotlight on hover
// Creates a premium, tactile card interaction (Linear/Vercel style)
export function attachCardSpotlight(el: HTMLElement) {
  if (prefersReducedMotion) return;

  const spotlight = document.createElement("div");
  Object.assign(spotlight.style, {
    position: "absolute",
    inset: "0",
    borderRadius: "inherit",
    pointerEvents: "none",
    opacity: "0",
    transition: "opacity 0.35s ease",
    zIndex: "1",
  });

  const computed = getComputedStyle(el);
  if (computed.position === "static") {
    el.style.position = "relative";
  }
  el.appendChild(spotlight);

  // Resolve --primary at attach-time so we get a real color value
  const primaryRaw = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();

  const handleMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlight.style.background = `radial-gradient(320px circle at ${x}px ${y}px, color-mix(in srgb, ${primaryRaw} 6%, transparent), transparent 65%)`;
  };
  const hoverShadow = `0 8px 25px -5px color-mix(in srgb, ${primaryRaw} 8%, transparent), 0 0 0 1px color-mix(in srgb, ${primaryRaw} 6%, transparent)`;

  const handleEnter = () => {
    spotlight.style.opacity = "1";
    el.style.transform = "translateY(-2px)";
    el.style.boxShadow = hoverShadow;
    el.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
  };

  const handleLeave = () => {
    spotlight.style.opacity = "0";
    el.style.transform = "";
    el.style.boxShadow = "";
  };

  el.addEventListener("mousemove", handleMove);
  el.addEventListener("mouseenter", handleEnter);
  el.addEventListener("mouseleave", handleLeave);

  onCleanup(() => {
    el.removeEventListener("mousemove", handleMove);
    el.removeEventListener("mouseenter", handleEnter);
    el.removeEventListener("mouseleave", handleLeave);
    spotlight.remove();
    gsap.killTweensOf(el);
  });
}

// ─── animateChartHero ────────────────────────────────────
// Kinetic text entrance — word-by-word stagger with 3D rotation
export function animateChartHero(containerEl: HTMLElement) {
  if (prefersReducedMotion) return;

  const subtitle = containerEl.querySelector("[data-hero-subtitle]") as HTMLElement | null;
  const title = containerEl.querySelector("[data-hero-title]") as HTMLElement | null;
  const desc = containerEl.querySelector("[data-hero-desc]") as HTMLElement | null;

  const tl = gsap.timeline({ defaults: { ease: EASE_OUT_EXPO } });

  // Subtitle — badge slides up
  if (subtitle) {
    tl.fromTo(
      subtitle,
      { opacity: 0, y: 10, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45 },
    );
  }

  // Title — split words, stagger with rotateX
  if (title) {
    const text = title.textContent!;
    const words = text.split(" ");
    title.textContent = "";
    title.style.perspective = "600px";

    const spans = words.map((word, i) => {
      const span = document.createElement("span");
      span.textContent = word + (i < words.length - 1 ? "\u00A0" : "");
      span.style.display = "inline-block";
      title.appendChild(span);
      return span;
    });

    tl.fromTo(
      spans,
      { opacity: 0, y: 24, rotateX: -30, transformOrigin: "center bottom" },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.05 },
      "-=0.15",
    );
  }

  // Description — fade up
  if (desc) {
    tl.fromTo(desc, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45 }, "-=0.2");
  }

  onCleanup(() => tl.kill());
}

// ─── animateTabContent ───────────────────────────────────
// Entrance for newly-visible tab content
export function animateTabContent(el: HTMLElement) {
  if (prefersReducedMotion) return;

  gsap.fromTo(
    el,
    { opacity: 0, y: 14, scale: 0.985 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: EASE_OUT_EXPO,
      clearProps: "transform",
    },
  );
}

// ─── animateGridCards ────────────────────────────────────
// Stagger cascade for card grids with IntersectionObserver
export function animateGridCards(gridEl: HTMLElement) {
  if (prefersReducedMotion) return;

  const cards = Array.from(gridEl.children) as HTMLElement[];
  if (!cards.length) return;

  gsap.set(cards, { opacity: 0, y: 24, scale: 0.97 });

  observeOnce(gridEl, () => {
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      stagger: 0.07,
      ease: EASE_OUT_EXPO,
      clearProps: "transform",
    });
  });

  onCleanup(() => gsap.killTweensOf(cards));
}

// ─── animateTrendPulse ───────────────────────────────────
// Trend indicator pops in with a back-bounce.
// Animates directly on mount — parent card entrance gates visibility.
export function animateTrendPulse(el: HTMLElement) {
  if (prefersReducedMotion) return;

  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.85 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      delay: 0.3,
      ease: "back.out(2.5)",
      clearProps: "transform,opacity",
    },
  );

  onCleanup(() => gsap.killTweensOf(el));
}
