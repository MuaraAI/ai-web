"use client";

import { useEffect, useRef, useState } from "react";

const STOPS = ["Hulu", "Muara", "Laut"];

/** Side rail that tracks the reader's way downstream, from river source to open sea. */
export function JourneyRail() {
  const markerRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (markerRef.current) markerRef.current.style.top = `${progress * 100}%`;
      setActive(Math.round(progress * (STOPS.length - 1)));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 min-[1440px]:block">
      <div className="relative flex h-44 flex-col justify-between pr-4">
        <span className="absolute right-0 top-0 h-full w-px bg-line-strong" />
        <span
          ref={markerRef}
          className="absolute -right-[3px] h-[7px] w-[7px] -translate-y-1/2 rounded-pill bg-iris transition-[top] duration-150 ease-out"
        />
        {STOPS.map((stop, i) => (
          <span
            key={stop}
            className={`text-caption font-semibold uppercase tracking-[0.025em] transition-colors duration-300 ${
              i === active ? "text-bone" : "text-ash/60"
            }`}
          >
            {stop}
          </span>
        ))}
      </div>
    </div>
  );
}
