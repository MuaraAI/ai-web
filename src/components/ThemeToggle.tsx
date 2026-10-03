"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

type Theme = "dark" | "light";

/**
 * Switches between the black and white themes and remembers the choice. The new
 * theme grows out of a circle in the middle of the screen until it covers the whole
 * view (View Transitions API); browsers without it, or readers who prefer reduced
 * motion, get a short color cross-fade instead.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;

    const apply = () => {
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("muara-theme", next);
      } catch {
        // Storage blocked: the theme still applies for this visit.
      }
      flushSync(() => setTheme(next));
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) {
      root.setAttribute("data-theme-switching", "");
      apply();
      window.setTimeout(() => root.removeAttribute("data-theme-switching"), 400);
      return;
    }

    root.setAttribute("data-theme-reveal", "");
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        const radius = Math.hypot(x, y);
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 750, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
    transition.finished.finally(() => root.removeAttribute("data-theme-reveal"));
  };

  const label = theme === "light" ? "Ganti ke tema gelap" : "Ganti ke tema terang";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-button text-ash transition-colors hover:text-bone"
    >
      <span className="material-symbols-rounded text-[20px]" aria-hidden="true">
        {theme === "light" ? "dark_mode" : "light_mode"}
      </span>
    </button>
  );
}
