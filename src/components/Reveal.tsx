"use client";

import { useEffect, useRef, useState } from "react";
import type { SceneName } from "@/lib/scenes";

/** Fades and lifts its content into place the first time it enters the viewport. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  scene,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Background scene this block sets while it is in view (see FlowField). */
  scene?: SceneName;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-visible={visible}
      data-scene={scene}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
