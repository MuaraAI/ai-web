"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, utils } from "animejs";
import { DOT_COUNT, FORMATIONS, GLOWS, isFormationName, type FormationName } from "@/lib/formations";

const GLOW_SPOTS: [number, number][][] = [
  [
    [0.15, 0.2],
    [0.85, 0.75],
    [0.55, 0.45],
  ],
  [
    [0.8, 0.15],
    [0.2, 0.8],
    [0.5, 0.5],
  ],
];

/**
 * Fixed anime.js background. Sections declare `data-formation="…"`; when one
 * crosses the middle of the screen, the dots regroup into its shape and the
 * color glows drift to match.
 */
export function ShapeField({ fallback = "stream", subtle = false }: { fallback?: FormationName; subtle?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dots = Array.from(root.querySelectorAll<HTMLElement>("[data-dot]"));
    const inners = dots.map((d) => d.firstElementChild as HTMLElement);
    const glows = Array.from(root.querySelectorAll<HTMLElement>("[data-glow]"));
    let current: FormationName = fallback;
    let step = 0;

    /** Where the formation sits: right half on desktop, centered behind content on phones. */
    const frame = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w >= 1024) {
        const size = Math.min(w * 0.4, h * 0.7);
        return { left: w * 0.72 - size / 2, top: h * 0.52 - size / 2, size };
      }
      const size = Math.min(w * 0.86, h * 0.5);
      return { left: (w - size) / 2, top: h * 0.62 - size / 2, size };
    };

    const go = (name: FormationName, instant = false) => {
      current = name;
      step++;
      const { left, top, size } = frame();
      const shape = FORMATIONS[name];
      const duration = instant || reducedMotion ? 0 : 1300;

      animate(dots, {
        x: (_el?: unknown, i = 0) => left + shape[i].x * size,
        y: (_el?: unknown, i = 0) => top + shape[i].y * size,
        duration,
        delay: duration ? stagger(7, { from: "center" }) : 0,
        ease: "inOutExpo",
      });
      animate(inners, {
        backgroundColor: (_el?: unknown, i = 0) => shape[i].color,
        duration: duration ? 900 : 0,
        delay: duration ? stagger(5, { from: "first" }) : 0,
        ease: "outQuad",
      });

      const spots = GLOW_SPOTS[step % 2];
      animate(glows, {
        x: (_el?: unknown, i = 0) => spots[i][0] * window.innerWidth - window.innerWidth * 0.25,
        y: (_el?: unknown, i = 0) => spots[i][1] * window.innerHeight - window.innerWidth * 0.25,
        backgroundColor: (_el?: unknown, i = 0) => GLOWS[name][i],
        duration: instant || reducedMotion ? 0 : 2200,
        ease: "inOutSine",
      });
    };

    go(fallback, true);

    // Idle life: each dot bobs gently on its own rhythm.
    const idle = reducedMotion
      ? null
      : animate(inners, {
          y: () => [utils.random(-5, 0), utils.random(0, 5)],
          scale: () => [1, utils.random(0.7, 1.25, 2)],
          duration: () => utils.random(1600, 3000),
          delay: stagger(20),
          alternate: true,
          loop: true,
          ease: "inOutSine",
        });

    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-formation]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const name = (entry.target as HTMLElement).dataset.formation;
          if (entry.isIntersecting && isFormationName(name) && name !== current) go(name);
        }
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    sections.forEach((s) => observer.observe(s));

    const onResize = () => go(current, true);
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      idle?.revert();
      utils.remove(dots);
      utils.remove(inners);
      utils.remove(glows);
    };
  }, [fallback]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${subtle ? "opacity-30" : "opacity-40 lg:opacity-100"}`}
    >
      {[0, 1, 2].map((i) => (
        <div key={i} data-glow className="shape-glow absolute left-0 top-0 h-[50vw] w-[50vw] rounded-pill" />
      ))}
      {Array.from({ length: DOT_COUNT }, (_, i) => (
        <div key={i} data-dot className="absolute left-0 top-0">
          <span className="-ml-[3.5px] -mt-[3.5px] block h-[7px] w-[7px] rounded-pill" />
        </div>
      ))}
    </div>
  );
}
