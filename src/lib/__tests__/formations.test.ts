import { describe, expect, it } from "vitest";
import { DOT_COUNT, FORMATIONS, GLOWS, isFormationName, seededRandom } from "../formations";

describe("formations", () => {
  it("gives every shape the same dot count so any shape can morph into any other", () => {
    for (const [name, dots] of Object.entries(FORMATIONS)) {
      expect(dots, name).toHaveLength(DOT_COUNT);
    }
  });

  it("keeps every dot inside the unit box with a color", () => {
    for (const [name, dots] of Object.entries(FORMATIONS)) {
      for (const d of dots) {
        expect(d.x, name).toBeGreaterThanOrEqual(0);
        expect(d.x, name).toBeLessThanOrEqual(1);
        expect(d.y, name).toBeGreaterThanOrEqual(0);
        expect(d.y, name).toBeLessThanOrEqual(1);
        expect(d.color, name).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }
  });

  it("has glow colors for each shape and validates names", () => {
    for (const name of Object.keys(FORMATIONS)) expect(GLOWS[name as keyof typeof GLOWS]).toHaveLength(3);
    expect(isFormationName("bars")).toBe(true);
    expect(isFormationName("river")).toBe(false);
  });

  it("generates values in [0, 1)", () => {
    const rnd = seededRandom(42);
    for (let i = 0; i < 1000; i++) {
      const v = rnd();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
