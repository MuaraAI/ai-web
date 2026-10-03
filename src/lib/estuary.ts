/**
 * Shared geometry for the "muara" visuals: a narrow meandering river that
 * widens through an estuary into open sea. Everything is normalized so the
 * hero particles and the scroll-driven background speak the same language.
 */

export const RIVER_COLORS = ["#15846e", "#2bd4b4", "#2bd4b4", "#3d7bff"] as const;
export const SEA_COLORS = ["#8052ff", "#8052ff", "#a98bff", "#3d7bff", "#ff4fa3"] as const;
export const SPARK_COLOR = "#ffb829";

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Deterministic LCG so every render of the field is identical. */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export interface Band {
  /** Channel center, as a fraction of height. */
  center: number;
  /** Half the channel width, as a fraction of height. */
  half: number;
  /** 0 = river, 1 = open sea at this point. */
  spread: number;
}

/**
 * Channel shape at horizontal position `xn` (0..1, flowing left → right).
 * `stage` moves the river mouth across the frame: 0 is all river, 0.5 puts the
 * estuary mid-frame, 1 is all sea.
 */
export function estuaryBand(xn: number, stage: number, time = 0): Band {
  // The opening spans [mouth - 0.1, mouth + 0.45]; this maps stage 0..1 so it sweeps fully across.
  const mouth = 1.1 - 1.55 * stage;
  const spread = smoothstep(mouth - 0.1, mouth + 0.45, xn);
  const meander = 0.09 * (1 - spread) * Math.sin(xn * Math.PI * 2.4 + time * 0.15);
  return { center: 0.5 + meander, half: 0.05 + 0.5 * spread, spread };
}

export interface FlowParticle {
  /** Progress along the flow, 0..1 (wraps). */
  x: number;
  /** Lane across the channel, -1..1. */
  lane: number;
  size: number;
  spin: number;
  speed: number;
  alpha: number;
  phase: number;
  riverColor: string;
  seaColor: string;
  /** Spread at which this particle switches to its sea color, so the hue shift feathers. */
  turn: number;
}

export function buildFlow(count: number, seed = 11): FlowParticle[] {
  const rnd = seededRandom(seed);
  const pick = <T,>(list: readonly T[]) => list[Math.floor(rnd() * list.length)];
  const particles: FlowParticle[] = [];

  for (let i = 0; i < count; i++) {
    // Bias lanes toward the thalweg so the river core reads denser than its banks.
    const lane = (rnd() + rnd() + rnd()) / 1.5 - 1;
    const spark = rnd() < 0.06;
    particles.push({
      x: rnd(),
      lane,
      size: 5 + rnd() * 6,
      spin: rnd() * Math.PI * 2,
      speed: 0.035 + rnd() * 0.05,
      alpha: 0.55 + rnd() * 0.45,
      phase: rnd() * Math.PI * 2,
      riverColor: spark ? SPARK_COLOR : pick(RIVER_COLORS),
      seaColor: spark ? SPARK_COLOR : pick(SEA_COLORS),
      turn: 0.2 + rnd() * 0.6,
    });
  }

  return particles;
}
