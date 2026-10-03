"use client";

import { useEffect, useRef } from "react";
import { buildFlow, estuaryBand, smoothstep } from "@/lib/estuary";

const PARTICLES = buildFlow(760);
const STAGE = 0.42;

/** Signature hero visual: triangles flowing down a river that fans out into the sea. */
export function Estuary({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles = PARTICLES.map((p) => ({ ...p }));
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = (t: number) => {
      const time = t / 1000;
      const dt = last ? Math.min(0.05, time - last) : 0;
      last = time;

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1.2;

      for (const p of particles) {
        const band = estuaryBand(p.x, STAGE, time);
        // Water slows as the channel opens up.
        if (!reducedMotion) p.x += dt * p.speed * (1 - 0.55 * band.spread);
        if (p.x > 1.04) p.x -= 1.08;

        const wobble = reducedMotion ? 0 : Math.sin(time * 1.3 + p.phase) * (0.004 + 0.01 * band.spread);
        const x = p.x * width;
        const y = (band.center + p.lane * band.half + wobble) * height;

        // Point each triangle downstream along the local channel slope.
        const ahead = estuaryBand(p.x + 0.01, STAGE, time);
        const slope = ((ahead.center + p.lane * ahead.half) - (band.center + p.lane * band.half)) * height;
        const heading = Math.atan2(slope, 0.01 * width);

        const edgeFade = smoothstep(-0.04, 0.08, p.x) * (1 - smoothstep(0.9, 1.03, p.x));
        const twinkle = reducedMotion ? 1 : 0.7 + 0.3 * Math.sin(time * 2 + p.phase);
        ctx.globalAlpha = p.alpha * edgeFade * twinkle;
        ctx.strokeStyle = band.spread > p.turn ? p.seaColor : p.riverColor;

        const r = p.size / 2;
        const rot = heading + p.spin * band.spread;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(rot) * r, y + Math.sin(rot) * r);
        ctx.lineTo(x + Math.cos(rot + 2.4) * r, y + Math.sin(rot + 2.4) * r);
        ctx.lineTo(x + Math.cos(rot - 2.4) * r, y + Math.sin(rot - 2.4) * r);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      paint(t);
      if (visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (reducedMotion) paint(0);
      else frame = requestAnimationFrame(loop);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion) paint(0);
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    intersectionObserver.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden && visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    start();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
