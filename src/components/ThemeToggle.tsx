"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const options: { value: Theme; label: string; icon: string }[] = [
  { value: "light", label: "Tema terang", icon: "light_mode" },
  { value: "dark", label: "Tema gelap", icon: "dark_mode" },
];

/** Segmented light/dark switch; the choice is remembered per browser. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const choose = (next: Theme) => {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage unavailable (private mode): the choice still applies for this visit.
    }
  };

  return (
    <div role="group" aria-label="Pilih tema" className="flex items-center rounded-button border border-line-strong p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => choose(o.value)}
          aria-pressed={theme === o.value}
          aria-label={o.label}
          title={o.label}
          className={`flex h-8 w-8 items-center sm:h-9 sm:w-9 justify-center rounded-[7px] transition-colors ${
            theme === o.value ? "bg-iris text-white" : "text-muted hover:text-ink"
          }`}
        >
          <span className="material-symbols-rounded" aria-hidden="true">
            {o.icon}
          </span>
        </button>
      ))}
    </div>
  );
}
