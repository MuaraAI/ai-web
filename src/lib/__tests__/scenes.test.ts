import { describe, expect, it } from "vitest";
import { SCENES, blendScenes, isSceneName, sceneAt } from "../scenes";
import { buildDelta, pointAt, toPath } from "../delta";

describe("scenes", () => {
  const sections = [
    { top: 0, height: 1000, scene: "river" as const },
    { top: 1000, height: 1000, scene: "sea" as const },
  ];

  it("holds a section's own scene through most of it", () => {
    expect(sceneAt(sections, 300, "mouth")).toEqual(SCENES.river);
  });

  it("eases into the next scene at the section's end", () => {
    const mid = sceneAt(sections, 800, "mouth");
    expect(mid.stage).toBeGreaterThan(SCENES.river.stage);
    expect(mid.stage).toBeLessThan(SCENES.sea.stage);
    expect(sceneAt(sections, 999.9, "mouth").stage).toBeCloseTo(SCENES.sea.stage, 3);
  });

  it("uses the fallback when a page has no scenes", () => {
    expect(sceneAt([], 400, "mouth")).toEqual(SCENES.mouth);
  });

  it("blends linearly and validates names", () => {
    expect(blendScenes(SCENES.river, SCENES.sea, 0.5).hue).toBeCloseTo(0.5);
    expect(isSceneName("rapids")).toBe(true);
    expect(isSceneName("lake")).toBe(false);
  });
});

describe("delta map", () => {
  it("joins every channel to the river mouth or another channel", () => {
    const map = buildDelta();
    const riverEnd = map.river.pts[map.river.pts.length - 1];
    expect(riverEnd).toEqual(map.mouth);
    expect(map.channels.length).toBeGreaterThanOrEqual(7);
    for (const ch of map.channels) expect(ch.total).toBeGreaterThan(0);
  });

  it("walks paths by arc length", () => {
    const path = toPath([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ]);
    expect(pointAt(path, 0.25)).toMatchObject({ x: 0.25, y: 0, angle: 0 });
    expect(pointAt(path, 5).x).toBe(1);
  });
});
