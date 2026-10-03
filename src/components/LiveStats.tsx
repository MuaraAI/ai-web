"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, setupMotion } from "@/lib/motion";
import { STATS_URL, formatStat, parseStats, type StatItem } from "@/lib/stats";

const REFRESH_MS = 60_000;

// Shown until (or unless) the gateway answers.
const SPECS = [
  { value: "500k", label: "Jendela konteks", hint: "Token maksimum yang dibaca dalam satu permintaan" },
  { value: "64k", label: "Keluaran maksimum", hint: "Panjang jawaban terpanjang dalam token" },
  { value: "<80ms", label: "Overhead gateway", hint: "Tambahan latensi dari lapisan edge" },
  { value: "Zero log", label: "Privasi prompt", hint: "Percakapan di-stream, tidak pernah disimpan" },
];

const VALUE_CLASS = "text-[clamp(2.25rem,3.6vw,3rem)] leading-none tracking-[-0.04em] tabular-nums";

// Columns follow the tile count: three figures sit in one row (2 + full-width on phones).
const COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3 [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1",
};

function Tile({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-r border-line p-5 sm:p-6">
      <dt className="label">{label}</dt>
      {children}
      {hint && <dd className="text-[13px] font-extralight leading-snug text-mist">{hint}</dd>}
    </div>
  );
}

type State = { status: "loading" } | { status: "error" } | { status: "live"; items: StatItem[]; at: Date };

function Figure({ item }: { item: StatItem }) {
  const ref = useRef<HTMLElement>(null);
  const shown = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!setupMotion()) {
      el.textContent = formatStat(item);
      shown.current = item.value;
      return;
    }
    // Count from the last shown value, so refreshes tick forward instead of restarting.
    const counter = { v: shown.current };
    const tween = gsap.to(counter, {
      v: item.value,
      duration: shown.current === 0 ? 1.6 : 0.8,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = formatStat(item, counter.v);
      },
      onComplete: () => {
        shown.current = item.value;
      },
      scrollTrigger: { trigger: el, start: "top 95%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      shown.current = counter.v;
    };
  }, [item]);

  return (
    <dd ref={ref} className={VALUE_CLASS}>
      {formatStat(item, 0)}
    </dd>
  );
}

/** Live gateway figures from the public stats endpoint, refreshed every minute while visible. */
export function LiveStats({ className = "" }: { className?: string }) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let alive = true;
    let controller: AbortController | null = null;

    const load = async () => {
      if (document.hidden) return;
      controller?.abort();
      controller = new AbortController();
      try {
        const res = await fetch(STATS_URL, { signal: controller.signal, cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const items = parseStats(await res.json());
        if (!alive) return;
        setState((prev) =>
          items.length > 0 ? { status: "live", items, at: new Date() } : prev.status === "live" ? prev : { status: "error" },
        );
      } catch (err) {
        if (!alive || (err as Error).name === "AbortError") return;
        // Keep the last good figures on a failed refresh.
        setState((prev) => (prev.status === "live" ? prev : { status: "error" }));
      }
    };

    load();
    const timer = window.setInterval(load, REFRESH_MS);
    document.addEventListener("visibilitychange", load);
    return () => {
      alive = false;
      controller?.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", load);
    };
  }, []);

  const live = state.status === "live";

  const tiles = live ? state.items.length : SPECS.length;

  return (
    <section aria-label="Statistik gateway" aria-busy={state.status === "loading"} className={className}>
      <div className="mb-4.5 flex items-baseline justify-between gap-4.5">
        <span className="label text-bone">{live ? "Statistik langsung" : "Spesifikasi gateway"}</span>
        <span className="text-caption text-ash" aria-live="polite">
          {state.status === "loading" && "Memuat statistik..."}
          {state.status === "error" && "Data langsung belum tersedia"}
          {live &&
            `Diperbarui ${state.at.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`}
          {live && <span className="hidden sm:inline"> · tiap menit</span>}
        </span>
      </div>

      <dl className={`grid border-l border-t border-line ${COLS[tiles] ?? "grid-cols-2"}`}>
        {live
          ? state.items.map((item) => (
              <Tile key={item.key} label={item.label} hint={item.hint}>
                <Figure item={item} />
              </Tile>
            ))
          : SPECS.map((s) => (
              <Tile key={s.label} label={s.label} hint={s.hint}>
                <dd className={VALUE_CLASS}>{s.value}</dd>
              </Tile>
            ))}
      </dl>
    </section>
  );
}
