import { describe, expect, it } from "vitest";
import { estuaryBand, seededRandom, smoothstep } from "../estuary";

describe("estuary", () => {
  it("is all river at stage 0 and all sea at stage 1", () => {
    for (const x of [0, 0.25, 0.5, 0.75, 1]) {
      expect(estuaryBand(x, 0).spread).toBe(0);
      expect(estuaryBand(x, 1).spread).toBe(1);
    }
  });

  it("widens downstream through the mouth", () => {
    const upstream = estuaryBand(0.1, 0.5);
    const downstream = estuaryBand(0.95, 0.5);
    expect(upstream.half).toBeLessThan(downstream.half);
    expect(upstream.spread).toBeLessThan(downstream.spread);
  });

  it("smoothstep and the generator stay in range", () => {
    expect(smoothstep(0, 1, -2)).toBe(0);
    expect(smoothstep(0, 1, 3)).toBe(1);
    const rnd = seededRandom(42);
    for (let i = 0; i < 1000; i++) {
      const v = rnd();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
