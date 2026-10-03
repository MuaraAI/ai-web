"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, setupMotion } from "@/lib/motion";
import { STATS_URL, formatStat, parseStats, type StatItem } from "@/lib/stats";

const REFRESH_MS = 60_000;

// Shown until (or unless) the gateway answers.
const SPECS = [
  { value: "500k", label: "Jendela konteks token" },
  { value: "64k", label: "Maksimal token keluaran" },
  { value: "<80ms", label: "Overhead edge gateway" },
  { value: "Zero log", label: "Prompt tidak disimpan" },
];

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
    <dd ref={ref} className="text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.1] tracking-[-0.035em] tabular-nums">
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

  return (
    <section aria-label="Statistik gateway" aria-busy={state.status === "loading"} className={className}>
      <div className="mb-4.5 flex items-baseline justify-between gap-4.5">
        <span className="label">{live ? "Statistik langsung" : "Spesifikasi"}</span>
        <span className="text-caption text-ash" aria-live="polite">
          {state.status === "loading" && "Memuat statistik..."}
          {state.status === "error" && "Statistik belum tersedia"}
          {live &&
            `Diperbarui ${state.at.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`}
        </span>
      </div>

      <dl className="grid grid-cols-2 border-l border-t border-line">
        {live
          ? state.items.map((item) => (
              <div key={item.key} className="flex flex-col-reverse gap-1.5 border-b border-r border-line p-4.5 sm:p-6">
                <dt className="text-sm text-ash">{item.label}</dt>
                <Figure item={item} />
              </div>
            ))
          : SPECS.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-1.5 border-b border-r border-line p-4.5 sm:p-6">
                <dt className="text-sm text-ash">{s.label}</dt>
                <dd className="text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.1] tracking-[-0.035em]">{s.value}</dd>
              </div>
            ))}
      </dl>
    </section>
  );
}
