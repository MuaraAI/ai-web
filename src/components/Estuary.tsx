"use client";

import { useEffect, useRef } from "react";
import { seededRandom, smoothstep } from "@/lib/estuary";
import { DELTA_ASPECT, LANDMARKS, buildDelta, pointAt, type Path } from "@/lib/delta";

const MAP = buildDelta();
const RIVER_COLORS = ["#2bd4b4", "#2bd4b4", "#15b39a", "#3d7bff"];
const SEA_COLORS = ["#8052ff", "#8052ff", "#a98bff", "#3d7bff", "#ff4fa3"];
const PARTICLE_COUNT = 260;
const RIPPLES = 9;

interface Drop {
  channel: Path;
  d: number;
  lane: number;
  size: number;
  speed: number;
  riverColor: string;
  seaColor: string;
}

function spawn(rnd: () => number, initial: boolean): Drop {
  const spark = rnd() < 0.06;
  return {
    channel: MAP.channels[Math.floor(rnd() * MAP.channels.length)],
    d: initial ? rnd() * (MAP.river.total + 0.35) : -rnd() * 0.25,
    lane: (rnd() + rnd() - 1) * 0.9,
    size: 3.5 + rnd() * 3.5,
    speed: 0.8 + rnd() * 0.5,
    riverColor: spark ? "#ffb829" : RIVER_COLORS[Math.floor(rnd() * RIVER_COLORS.length)],
    seaColor: spark ? "#ffb829" : SEA_COLORS[Math.floor(rnd() * SEA_COLORS.length)],
  };
}

const label = "pointer-events-none absolute text-caption font-semibold uppercase tracking-[0.12em]";

/** Hero map of a muara: river from the hulu, delta channels at the mouth, waves out to sea. */
export function Estuary({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rnd = seededRandom(23);
    const drops = Array.from({ length: PARTICLE_COUNT }, () => spawn(rnd, true));
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
      const time = reducedMotion ? 0 : t / 1000;
      const dt = last && !reducedMotion ? Math.min(0.05, time - last) : 0;
      last = time;
      const s = width;
      const oy = (height - width * DELTA_ASPECT) / 2;
      const X = (x: number) => x * s;
      const Y = (y: number) => oy + y * s;
      const mouth = MAP.mouth;

      ctx.clearRect(0, 0, width, height);

      // Sea: swell lines rolling outward from the mouth.
      ctx.lineWidth = 1;
      for (let k = 0; k < RIPPLES; k++) {
        const r = 0.24 + (((k + time * 0.35) % RIPPLES) / RIPPLES) * 0.72;
        const a = 0.3 * smoothstep(0.24, 0.32, r) * (1 - smoothstep(0.5, 0.96, r));
        ctx.strokeStyle = `rgba(128, 82, 255, ${a})`;
        ctx.beginPath();
        ctx.arc(X(mouth.x), Y(mouth.y), r * s, -1.3, 1.3);
        ctx.stroke();
      }

      // River: banks and current lines, widening toward the mouth.
      const river = MAP.river;
      for (const lane of [-1, -0.5, 0, 0.5, 1]) {
        const bank = Math.abs(lane) === 1;
        ctx.strokeStyle = bank ? "rgba(189, 189, 189, 0.28)" : "rgba(43, 212, 180, 0.32)";
        ctx.lineWidth = bank ? 1 : 0.9;
        ctx.beginPath();
        river.pts.forEach((p, i) => {
          const next = river.pts[Math.min(i + 1, river.pts.length - 1)];
          const prev = river.pts[Math.max(i - 1, 0)];
          const ang = Math.atan2(next.y - prev.y, next.x - prev.x);
          const half = 0.007 + 0.016 * (river.lens[i] / river.total);
          const x = X(p.x - Math.sin(ang) * half * lane);
          const y = Y(p.y + Math.cos(ang) * half * lane);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }

      // Distributary channels: river green fading into sea violet.
      for (const ch of MAP.channels) {
        const start = ch.pts[0];
        const end = ch.pts[ch.pts.length - 1];
        const g = ctx.createLinearGradient(X(start.x), Y(start.y), X(end.x), Y(end.y));
        g.addColorStop(0, "rgba(43, 212, 180, 0.45)");
        g.addColorStop(1, "rgba(128, 82, 255, 0.05)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ch.pts.forEach((p, i) => (i === 0 ? ctx.moveTo(X(p.x), Y(p.y)) : ctx.lineTo(X(p.x), Y(p.y))));
        ctx.stroke();
      }

      // Mouth marker: a pulse where the river meets the sea.
      const pulse = reducedMotion ? 0.5 : (time * 0.6) % 1;
      ctx.strokeStyle = `rgba(255, 184, 41, ${0.6 * (1 - pulse)})`;
      ctx.beginPath();
      ctx.arc(X(mouth.x), Y(mouth.y), 4 + pulse * 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#ffb829";
      ctx.beginPath();
      ctx.arc(X(mouth.x), Y(mouth.y), 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Drops travel the river, take a channel, and spill out as a plume.
      ctx.lineWidth = 1.1;
      for (let i = 0; i < drops.length; i++) {
        const p = drops[i];
        const inRiver = p.d < river.total;
        const along = p.d - river.total;
        const pace = inRiver ? 0.11 : along < p.channel.total ? 0.06 : 0.035;
        p.d += dt * pace * p.speed;

        let pos: { x: number; y: number; angle: number };
        let fade = smoothstep(0, 0.05, p.d);
        if (inRiver) {
          pos = pointAt(river, p.d);
          const half = 0.007 + 0.016 * (p.d / river.total);
          pos = { ...pos, x: pos.x - Math.sin(pos.angle) * half * p.lane, y: pos.y + Math.cos(pos.angle) * half * p.lane };
        } else if (along < p.channel.total) {
          pos = pointAt(p.channel, along);
        } else {
          const tip = pointAt(p.channel, p.channel.total);
          const out = along - p.channel.total;
          const spread = p.lane * out * 0.8;
          pos = {
            x: tip.x + Math.cos(tip.angle) * out - Math.sin(tip.angle) * spread,
            y: tip.y + Math.sin(tip.angle) * out + Math.cos(tip.angle) * spread,
            angle: tip.angle,
          };
          fade *= 1 - smoothstep(0.04, 0.16, out);
          if (out > 0.16) {
            drops[i] = spawn(rnd, false);
            continue;
          }
        }
        if (p.d < 0) continue;

        ctx.globalAlpha = 0.9 * fade;
        ctx.strokeStyle = inRiver ? p.riverColor : p.seaColor;
        const r = p.size / 2;
        const x = X(pos.x);
        const y = Y(pos.y);
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(pos.angle) * r * 1.3, y + Math.sin(pos.angle) * r * 1.3);
        ctx.lineTo(x + Math.cos(pos.angle + 2.5) * r, y + Math.sin(pos.angle + 2.5) * r);
        ctx.lineTo(x + Math.cos(pos.angle - 2.5) * r, y + Math.sin(pos.angle - 2.5) * r);
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

  const at = (p: { x: number; y: number }) => ({ left: `${p.x * 100}%`, top: `${(p.y / DELTA_ASPECT) * 100}%` });

  return (
    <div className={`relative aspect-[5/4] w-full ${className}`}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      <span aria-hidden="true" className={`${label} -translate-y-7 text-ash`} style={at(LANDMARKS.hulu)}>
        Hulu
      </span>
      <span aria-hidden="true" className={`${label} -translate-x-1/2 -translate-y-9 text-saffron`} style={at(LANDMARKS.muara)}>
        Muara
      </span>
      <span aria-hidden="true" className={`${label} -translate-x-1/2 text-ash`} style={at(LANDMARKS.laut)}>
        Laut
      </span>
    </div>
  );
}
