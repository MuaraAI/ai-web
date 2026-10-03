export interface Particle {
  /** Normalized position: -1..1 around the shape center (brain) or 0..1 of the field (ambient). */
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
  alpha: number;
  phase: number;
  speed: number;
}

export const CONSTELLATION_COLORS = [
  "#8052ff",
  "#8052ff",
  "#8052ff",
  "#a98bff",
  "#ffb829",
  "#15846e",
  "#2bd4b4",
  "#ff4fa3",
  "#3d7bff",
] as const;

/** Deterministic LCG so server and client render the same field. */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Cortex + cerebellum + brain stem silhouette in a -1..1 box. */
export function inBrain(x: number, y: number): boolean {
  const cortex = (x * x) / 0.9 + ((y + 0.08) * (y + 0.08)) / 0.4 <= 1 && y < 0.42 - 0.12 * x;
  const cerebellum = ((x - 0.42) ** 2) / 0.09 + ((y - 0.42) ** 2) / 0.035 <= 1;
  const stem = ((x - 0.16) ** 2) / 0.006 + ((y - 0.6) ** 2) / 0.05 <= 1;
  return cortex || cerebellum || stem;
}

function particle(rnd: () => number, x: number, y: number, minSize: number, sizeRange: number, minAlpha: number, alphaRange: number): Particle {
  return {
    x,
    y,
    size: minSize + rnd() * sizeRange,
    rotation: rnd() * Math.PI * 2,
    color: CONSTELLATION_COLORS[Math.floor(rnd() * CONSTELLATION_COLORS.length)],
    alpha: minAlpha + rnd() * alphaRange,
    phase: rnd() * Math.PI * 2,
    speed: 0.4 + rnd() * 1.1,
  };
}

export function buildConstellation(count: number, ambientCount: number, seed = 7) {
  const rnd = seededRandom(seed);
  const brain: Particle[] = [];
  let attempts = 0;

  while (brain.length < count && attempts < count * 60) {
    attempts++;
    const x = rnd() * 2 - 1;
    const y = rnd() * 2 - 1;
    if (!inBrain(x, y)) continue;
    // Thin out particles between folds so gyri read as bands.
    const fold = Math.sin(x * 11 + Math.sin(y * 7) * 1.8) * Math.cos(y * 9 - x * 3);
    if (Math.abs(fold) < 0.35 && rnd() > 0.25) continue;
    brain.push(particle(rnd, x, y, 6, 8, 0.6, 0.4));
  }

  const ambient: Particle[] = [];
  for (let i = 0; i < ambientCount; i++) {
    ambient.push(particle(rnd, rnd(), rnd(), 4, 5, 0.12, 0.25));
  }

  return { brain, ambient };
}
