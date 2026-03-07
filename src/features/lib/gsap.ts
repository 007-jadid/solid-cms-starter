import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const EASE_OUT_EXPO = "expo.out";
export const EASE_OUT_QUART = "quart.out";
export const EASE_SMOOTH = "power2.out";

/** CSS cubic-bezier equivalent of expo.out — for CSS transition use */
export const CSS_EASE_OUT_EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";
