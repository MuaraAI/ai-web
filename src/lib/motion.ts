"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;

/**
 * Registers GSAP plugins once and reports whether scroll motion is armed (the
 * pre-paint script in layout.tsx sets `data-motion` unless reduced motion is on).
 */
export function setupMotion(): boolean {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    registered = true;
  }
  (window as Window & { __muaraMotion?: boolean }).__muaraMotion = true;
  return document.documentElement.hasAttribute("data-motion");
}

export { gsap, ScrollTrigger, SplitText };
