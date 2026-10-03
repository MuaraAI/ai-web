"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

/** Switches between the black and white themes and remembers the choice. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;
    root.setAttribute("data-theme-switching", "");
    root.setAttribute("data-theme", next);
    window.setTimeout(() => root.removeAttribute("data-theme-switching"), 400);
    try {
      localStorage.setItem("muara-theme", next);
    } catch {
      // Storage blocked: the theme still applies for this visit.
    }
    setTheme(next);
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
