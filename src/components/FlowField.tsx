"use client";

import { useEffect, useRef } from "react";
import { clamp, estuaryBand, smoothstep } from "@/lib/estuary";

const LINES = 22;
const VERDANT = [43, 212, 180];
const IRIS = [128, 82, 255];

interface FlowFieldProps {
  /** Journey stage at the top of the page (0 = river, 1 = open sea). */
  from: number;
  /** Journey stage at the bottom of the page. */
  to: number;
  /** Keep the texture faint until the reader scrolls past the hero. */
  quietTop?: boolean;
}

/**
 * Fixed background of current lines. Scrolling carries the reader downstream:
 * the lines bunch into a river, open through the estuary, and settle into sea swell.
 */
export function FlowField({ from, to, quietTop = false }: FlowFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let stage = from;
    let target = from;
    let presence = quietTop ? 0.2 : 1;
    let targetPresence = presence;

    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      target = from + (to - from) * progress;
      targetPresence = quietTop ? 0.2 + 0.8 * smoothstep(0, window.innerHeight * 0.7, window.scrollY) : 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = (t: number) => {
      const time = reducedMotion ? 0 : t / 1000;
      ctx.clearRect(0, 0, width, height);
      const step = Math.max(12, width / 90);

      for (let i = 0; i < LINES; i++) {
        const lane = (i / (LINES - 1)) * 2 - 1;
        let spreadSum = 0;
        let samples = 0;

        ctx.beginPath();
        for (let x = -step; x <= width + step; x += step) {
          const band = estuaryBand(x / width, stage, time);
          spreadSum += band.spread;
          samples++;
          const swell = (0.003 + 0.014 * band.spread) * Math.sin((x / width) * Math.PI * (3 + (i % 3)) + time * 0.5 + i * 1.7);
          const y = (band.center + lane * band.half + swell) * height;
          if (x === -step) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const mix = spreadSum / samples;
        const rgb = VERDANT.map((c, k) => Math.round(c + (IRIS[k] - c) * mix)).join(",");
        const core = 1 - 0.55 * Math.abs(lane);

        // Faint bed line…
        ctx.setLineDash([]);
        ctx.strokeStyle = `rgba(${rgb},${0.07 * core * presence})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // …with a dashed current running downstream along it.
        ctx.setLineDash([2 + (i % 4), 18 + (i % 5) * 6]);
        ctx.lineDashOffset = -time * (36 - 18 * mix) * (1 + (i % 3) * 0.25);
        ctx.strokeStyle = `rgba(${rgb},${0.28 * core * presence})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    };

    const loop = (t: number) => {
      stage += (target - stage) * 0.06;
      presence += (targetPresence - presence) * 0.06;
      paint(t);
      if (!document.hidden) frame = requestAnimationFrame(loop);
    };

    const onScroll = () => {
      readScroll();
      if (reducedMotion) {
        stage = target;
        presence = targetPresence;
        paint(0);
      }
    };

    const onResize = () => {
      resize();
      onScroll();
      if (reducedMotion) paint(0);
    };

    const onVisibility = () => {
      if (!document.hidden && !reducedMotion) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(loop);
      }
    };

    resize();
    readScroll();
    stage = target;
    presence = targetPresence;
    if (reducedMotion) paint(0);
    else frame = requestAnimationFrame(loop);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [from, to, quietTop]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
