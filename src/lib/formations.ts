/**
 * Shapes the background dots assemble into, one per page section. Every
 * formation returns exactly DOT_COUNT points in a unit box (0..1) plus a color,
 * so anime.js can morph any formation into any other dot-for-dot.
 */

export const DOT_COUNT = 120;

export const PALETTE = {
  iris: "#8052ff",
  violet: "#a98bff",
  teal: "#2bd4b4",
  blue: "#3d7bff",
  pink: "#ff4fa3",
  saffron: "#ffb829",
} as const;

export interface Dot {
  x: number;
  y: number;
  color: string;
}

export type FormationName = "stream" | "bars" | "code" | "ring" | "key";

/** Deterministic LCG so formations are identical on every render. */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Segment = [number, number, number, number];

/** Spread `count` dots evenly along a set of line segments, by length. */
function alongSegments(segments: Segment[], count: number, color: (seg: number, t: number) => string): Dot[] {
  const lengths = segments.map(([x1, y1, x2, y2]) => Math.hypot(x2 - x1, y2 - y1));
  const total = lengths.reduce((a, b) => a + b, 0);
  const dots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    let d = ((i + 0.5) / count) * total;
    let s = 0;
    while (s < segments.length - 1 && d > lengths[s]) d -= lengths[s++];
    const [x1, y1, x2, y2] = segments[s];
    const t = lengths[s] ? d / lengths[s] : 0;
    dots.push({ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t, color: color(s, t) });
  }
  return dots;
}

/** River meandering in from the left, then fanning out into a delta: the muara. */
function stream(): Dot[] {
  const rnd = seededRandom(3);
  const riverCount = Math.round(DOT_COUNT * 0.45);
  const dots: Dot[] = [];
  const mouth = { x: 0.5, y: 0.56 };

  for (let i = 0; i < riverCount; i++) {
    const t = i / (riverCount - 1);
    const x = 0.02 + t * (mouth.x - 0.02);
    const y = mouth.y + 0.1 * Math.sin(t * Math.PI * 2.2) * (1 - t) + (rnd() - 0.5) * 0.035;
    dots.push({ x, y, color: rnd() < 0.15 ? PALETTE.blue : PALETTE.teal });
  }
  for (let i = riverCount; i < DOT_COUNT; i++) {
    const k = (i - riverCount) / (DOT_COUNT - riverCount - 1);
    const angle = -0.75 + ((k * 7) % 1) * 1.5;
    const r = 0.06 + Math.floor(k * 7) / 7 * 0.4 + rnd() * 0.03;
    const sea = [PALETTE.iris, PALETTE.violet, PALETTE.pink, PALETTE.blue];
    dots.push({
      x: mouth.x + Math.cos(angle) * r,
      y: mouth.y + Math.sin(angle) * r * 0.9,
      color: rnd() < 0.08 ? PALETTE.saffron : sea[Math.floor(rnd() * sea.length)],
    });
  }
  return dots;
}

/** Four ascending bars: the role-based quotas, from contributor to maintainer. */
function bars(): Dot[] {
  const heights = [0.3, 0.48, 0.68, 0.9];
  const colors = [PALETTE.teal, PALETTE.blue, PALETTE.iris, PALETTE.saffron];
  const cols = 3;
  const totalRows = heights.reduce((a, h) => a + h, 0);
  const dots: Dot[] = [];
  heights.forEach((h, b) => {
    const share = b === heights.length - 1 ? DOT_COUNT - dots.length : Math.round((DOT_COUNT * h) / totalRows);
    const rows = Math.ceil(share / cols);
    for (let i = 0; i < share; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      dots.push({
        x: 0.1 + b * 0.22 + col * 0.055,
        y: 0.95 - (row / Math.max(rows - 1, 1)) * h,
        color: colors[b],
      });
    }
  });
  return dots;
}

/** The `</>` glyph — talking to the API from code. */
function code(): Dot[] {
  const segments: Segment[] = [
    [0.3, 0.22, 0.06, 0.5],
    [0.06, 0.5, 0.3, 0.78],
    [0.6, 0.14, 0.4, 0.86],
    [0.7, 0.22, 0.94, 0.5],
    [0.94, 0.5, 0.7, 0.78],
  ];
  return alongSegments(segments, DOT_COUNT, (s) => (s === 2 ? PALETTE.saffron : s < 2 ? PALETTE.iris : PALETTE.teal));
}

/** Two rings of people: the community gathering around one hub. */
function ring(): Dot[] {
  const hues = [PALETTE.iris, PALETTE.pink, PALETTE.saffron, PALETTE.teal, PALETTE.blue];
  const outer = Math.round(DOT_COUNT * 0.66);
  const dots: Dot[] = [];
  for (let i = 0; i < DOT_COUNT; i++) {
    const inner = i >= outer;
    const n = inner ? DOT_COUNT - outer : outer;
    const k = inner ? i - outer : i;
    const angle = (k / n) * Math.PI * 2 - Math.PI / 2;
    const r = inner ? 0.2 : 0.44;
    dots.push({
      x: 0.5 + Math.cos(angle) * r,
      y: 0.5 + Math.sin(angle) * r,
      color: hues[Math.floor((k / n) * hues.length) % hues.length],
    });
  }
  return dots;
}

/** A key — signing in and generating an API key. */
function key(): Dot[] {
  const headCount = 48;
  const dots: Dot[] = [];
  for (let i = 0; i < headCount; i++) {
    const angle = (i / headCount) * Math.PI * 2;
    dots.push({ x: 0.26 + Math.cos(angle) * 0.18, y: 0.5 + Math.sin(angle) * 0.18, color: PALETTE.saffron });
  }
  const shaft: Segment[] = [
    [0.45, 0.5, 0.95, 0.5],
    [0.78, 0.5, 0.78, 0.66],
    [0.9, 0.5, 0.9, 0.72],
  ];
  return dots.concat(alongSegments(shaft, DOT_COUNT - headCount, (s) => (s === 0 ? PALETTE.iris : PALETTE.violet)));
}

export const FORMATIONS: Record<FormationName, Dot[]> = {
  stream: stream(),
  bars: bars(),
  code: code(),
  ring: ring(),
  key: key(),
};

export function isFormationName(value: string | undefined): value is FormationName {
  return value !== undefined && value in FORMATIONS;
}

/** Soft color glows behind each formation. */
export const GLOWS: Record<FormationName, [string, string, string]> = {
  stream: [PALETTE.teal, PALETTE.iris, PALETTE.blue],
  bars: [PALETTE.blue, PALETTE.saffron, PALETTE.iris],
  code: [PALETTE.iris, PALETTE.teal, PALETTE.saffron],
  ring: [PALETTE.pink, PALETTE.iris, PALETTE.saffron],
  key: [PALETTE.saffron, PALETTE.iris, PALETTE.pink],
};
