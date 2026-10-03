"use client";

import { useEffect, useRef } from "react";
import { estuaryBand } from "@/lib/estuary";
import { SCENES, blendScenes, isSceneName, sceneAt, type Scene, type SceneName, type SceneSection } from "@/lib/scenes";

const LINES = 22;
const TEAL = [43, 212, 180];
const IRIS = [128, 82, 255];

/**
 * Fixed background of river currents. Every section marked `data-scene` sets the
 * mood — narrow river, rapids, the mouth, open sea — and the field morphs
 * smoothly between them as the reader scrolls.
 */
export function FlowField({ fallback = "mouth" }: { fallback?: SceneName }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let target: Scene = SCENES[fallback];
    let current: Scene = target;

    const readScroll = () => {
      const sections: SceneSection[] = [];
      document.querySelectorAll<HTMLElement>("[data-scene]").forEach((el) => {
        const scene = el.dataset.scene;
        if (!isSceneName(scene)) return;
        const rect = el.getBoundingClientRect();
        sections.push({ top: rect.top, height: rect.height, scene });
      });
      target = sceneAt(sections, window.innerHeight * 0.5, fallback);
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
      const sc = current;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(sc.tilt);
      ctx.translate(-width / 2, -height / 2 + sc.offsetY * height);

      const rgb = TEAL.map((c, k) => Math.round(c + (IRIS[k] - c) * sc.hue)).join(",");
      // Draw a little wider than the screen so tilted lines never show their ends.
      const span = width * 1.3;
      const x0 = -width * 0.15;
      const step = Math.max(12, span / 110);

      for (let i = 0; i < LINES; i++) {
        const lane = (i / (LINES - 1)) * 2 - 1;
        const core = 1 - 0.55 * Math.abs(lane);
        ctx.beginPath();
        for (let x = x0; x <= x0 + span; x += step) {
          const xn = (x - x0) / span;
          const band = estuaryBand(xn, sc.stage, time);
          const center = 0.5 + (band.center - 0.5) * sc.curl;
          const swell =
            (0.003 + 0.012 * band.spread) * sc.swell * Math.sin(xn * Math.PI * (3 + (i % 3)) * sc.freq + time * 0.5 * sc.speed + i * 1.7);
          const y = (center + lane * band.half + swell) * height;
          if (x === x0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Lines fade at both screen edges instead of being cut off.
        const fadeEdges = (a: number) => {
          const g = ctx.createLinearGradient(x0, 0, x0 + span, 0);
          g.addColorStop(0, `rgba(${rgb},0)`);
          g.addColorStop(0.25, `rgba(${rgb},${a})`);
          g.addColorStop(0.75, `rgba(${rgb},${a})`);
          g.addColorStop(1, `rgba(${rgb},0)`);
          return g;
        };

        ctx.setLineDash([]);
        ctx.strokeStyle = fadeEdges(0.08 * core * sc.alpha);
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.setLineDash([2 + (i % 4), 18 + (i % 5) * 6]);
        ctx.lineDashOffset = -time * 30 * sc.speed * (1 + (i % 3) * 0.25);
        ctx.strokeStyle = fadeEdges(0.32 * core * sc.alpha);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();
    };

    const ease = () => {
      let moving = false;
      const next = blendScenes(current, target, 0.06);
      for (const key of Object.keys(next) as (keyof Scene)[]) {
        if (Math.abs(next[key] - target[key]) > 0.0005) moving = true;
      }
      current = moving ? next : target;
    };

    const loop = (t: number) => {
      ease();
      paint(t);
      if (!document.hidden) frame = requestAnimationFrame(loop);
    };

    const onScroll = () => {
      readScroll();
      if (reducedMotion) {
        current = target;
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
    current = target;
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
  }, [fallback]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      style={{ maskImage: "linear-gradient(to bottom, transparent 0, #000 96px)" }}
    />
  );
}
