/**
 * Geometry for the hero "muara" map: a river meanders in from upstream (hulu),
 * reaches its mouth (muara), splits into distributary channels and pushes
 * out into the sea (laut). Coordinates are normalized to the frame width;
 * the frame is DELTA_ASPECT tall.
 */
import { seededRandom } from "./estuary";

export const DELTA_ASPECT = 0.8;

export interface Vec {
  x: number;
  y: number;
}

export interface Path {
  pts: Vec[];
  /** Cumulative length at each point. */
  lens: number[];
  total: number;
}

export interface DeltaMap {
  river: Path;
  mouth: Vec;
  channels: Path[];
}

/** Map anchors, also used to place the HTML labels over the canvas. */
export const LANDMARKS = {
  hulu: { x: 0.04, y: 0.5 },
  muara: { x: 0.47, y: 0.4 },
  laut: { x: 0.86, y: 0.14 },
} as const;

const RIVER_POINTS: Vec[] = [
  { x: -0.04, y: 0.66 },
  { x: 0.07, y: 0.61 },
  { x: 0.16, y: 0.46 },
  { x: 0.26, y: 0.39 },
  { x: 0.35, y: 0.46 },
  { x: 0.42, y: 0.43 },
  LANDMARKS.muara,
];

export function catmullRom(points: Vec[], samples = 16): Vec[] {
  const out: Vec[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    for (let s = 0; s < samples; s++) {
      const t = s / samples;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push({
        x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

export function quadratic(a: Vec, c: Vec, b: Vec, samples = 20): Vec[] {
  const out: Vec[] = [];
  for (let s = 0; s <= samples; s++) {
    const t = s / samples;
    const u = 1 - t;
    out.push({ x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y });
  }
  return out;
}

export function toPath(pts: Vec[]): Path {
  const lens = [0];
  for (let i = 1; i < pts.length; i++) {
    lens.push(lens[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  return { pts, lens, total: lens[lens.length - 1] };
}

/** Point and heading at arc length `d` along the path (clamped to its ends). */
export function pointAt(path: Path, d: number): Vec & { angle: number } {
  const { pts, lens, total } = path;
  const target = Math.min(Math.max(d, 0), total);
  let i = 1;
  while (i < lens.length - 1 && lens[i] < target) i++;
  const a = pts[i - 1];
  const b = pts[i];
  const seg = lens[i] - lens[i - 1] || 1;
  const t = (target - lens[i - 1]) / seg;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, angle: Math.atan2(b.y - a.y, b.x - a.x) };
}

function channel(from: Vec, angle: number, length: number, bend: number): Path {
  const dir = { x: Math.cos(angle), y: Math.sin(angle) };
  const end = { x: from.x + dir.x * length, y: from.y + dir.y * length };
  const control = { x: from.x + dir.x * length * 0.5 - dir.y * bend, y: from.y + dir.y * length * 0.5 + dir.x * bend };
  return toPath(quadratic(from, control, end));
}

export function buildDelta(seed = 5): DeltaMap {
  const rnd = seededRandom(seed);
  const river = toPath(catmullRom(RIVER_POINTS));
  const mouth = LANDMARKS.muara;
  const channels: Path[] = [];
  const count = 7;

  for (let i = 0; i < count; i++) {
    const angle = -0.95 + (1.9 * i) / (count - 1) + (rnd() - 0.5) * 0.12;
    const main = channel(mouth, angle, 0.17 + rnd() * 0.08, (rnd() - 0.5) * 0.06);
    channels.push(main);
    // Odd channels fork once more on their way to the sea.
    if (i % 2 === 1) {
      const fork = pointAt(main, main.total * 0.55);
      channels.push(channel(fork, fork.angle + (rnd() < 0.5 ? -0.4 : 0.4), 0.07 + rnd() * 0.04, 0));
    }
  }

  return { river, mouth, channels };
}
