/**
 * Shared math for the "muara" visuals: a narrow meandering river that widens
 * through an estuary into open sea, used by the scroll-driven background.
 */

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
