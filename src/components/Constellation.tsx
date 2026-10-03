"use client";

import { useEffect, useRef } from "react";
import { buildConstellation, type Particle } from "@/lib/constellation";

const FIELD = buildConstellation(900, 70);

function drawTriangle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  const r = size / 2;
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const a = rotation + (i * Math.PI * 2) / 3;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
}

/** Signature hero visual: a brain-shaped field of outlined triangles that slowly twinkles. */
export function Constellation({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
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
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1.25;
      const time = t / 1000;

      const drawSet = (set: Particle[], toX: (p: Particle) => number, toY: (p: Particle) => number, spin: number) => {
        for (const p of set) {
          const twinkle = reducedMotion ? 1 : 0.6 + 0.4 * Math.sin(time * p.speed + p.phase);
          ctx.globalAlpha = p.alpha * twinkle;
          ctx.strokeStyle = p.color;
          drawTriangle(ctx, toX(p), toY(p), p.size, p.rotation + time * spin * p.speed);
        }
      };

      drawSet(FIELD.ambient, (p) => p.x * width, (p) => p.y * height, reducedMotion ? 0 : 0.05);

      const radius = Math.min(width * 0.48, height * 0.58);
      const drift = reducedMotion ? 0 : Math.sin(time * 0.6) * 6;
      const cx = width / 2;
      const cy = height / 2 - radius * 0.04 + drift;
      drawSet(FIELD.brain, (p) => cx + p.x * radius, (p) => cy + p.y * radius, reducedMotion ? 0 : 0.12);
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      paint(t);
      if (visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(frame);
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
