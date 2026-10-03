import { describe, expect, it } from "vitest";
import { buildConstellation, inBrain, seededRandom } from "../constellation";

describe("constellation", () => {
  it("is deterministic for the same seed", () => {
    const a = buildConstellation(50, 10, 3);
    const b = buildConstellation(50, 10, 3);
    expect(a).toEqual(b);
  });

  it("builds the requested number of particles inside the silhouette", () => {
    const { brain, ambient } = buildConstellation(200, 25);
    expect(brain).toHaveLength(200);
    expect(ambient).toHaveLength(25);
    for (const p of brain) expect(inBrain(p.x, p.y)).toBe(true);
    for (const p of ambient) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThan(1);
    }
  });

  it("produces values in [0, 1)", () => {
    const rnd = seededRandom(42);
    for (let i = 0; i < 1000; i++) {
      const v = rnd();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
