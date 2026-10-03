import { smoothstep } from "./estuary";

/**
 * Background "scenes" along the river-to-sea journey. Each page section opts into
 * one with `data-scene="…"`, and the background morphs between them while scrolling.
 */
export interface Scene {
  /** 0 = river channel, 1 = open sea (see estuaryBand). */
  stage: number;
  /** Rotation of the whole current field, radians. */
  tilt: number;
  /** Vertical shift of the channel, fraction of viewport height. */
  offsetY: number;
  /** Wave height multiplier. */
  swell: number;
  /** Wave frequency multiplier — higher reads as rapids. */
  freq: number;
  /** Meander strength multiplier. */
  curl: number;
  /** Overall visibility. */
  alpha: number;
  /** Color mix: 0 = river teal, 1 = sea violet. */
  hue: number;
  /** Current speed multiplier. */
  speed: number;
}

export const SCENES = {
  hero: { stage: 0.15, tilt: -0.1, offsetY: 0.2, swell: 0.5, freq: 1, curl: 1, alpha: 0.3, hue: 0, speed: 1 },
  river: { stage: 0, tilt: 0.14, offsetY: 0, swell: 0.6, freq: 1.2, curl: 1.7, alpha: 1, hue: 0, speed: 1.5 },
  rapids: { stage: 0.25, tilt: -0.22, offsetY: 0.06, swell: 1.8, freq: 2.4, curl: 1, alpha: 0.95, hue: 0.25, speed: 2.1 },
  mouth: { stage: 0.5, tilt: 0, offsetY: 0, swell: 1, freq: 1, curl: 0.8, alpha: 1, hue: 0.55, speed: 1 },
  sea: { stage: 1, tilt: 0.05, offsetY: -0.04, swell: 1.6, freq: 0.8, curl: 0, alpha: 1.25, hue: 1, speed: 0.6 },
  deep: { stage: 1, tilt: 0, offsetY: 0.25, swell: 0.5, freq: 0.6, curl: 0, alpha: 0.6, hue: 1, speed: 0.3 },
} satisfies Record<string, Scene>;

export type SceneName = keyof typeof SCENES;

export function isSceneName(value: string | undefined): value is SceneName {
  return value !== undefined && value in SCENES;
}

export function blendScenes(a: Scene, b: Scene, t: number): Scene {
  const out = { ...a };
  for (const key of Object.keys(a) as (keyof Scene)[]) out[key] = a[key] + (b[key] - a[key]) * t;
  return out;
}

export interface SceneSection {
  top: number;
  height: number;
  scene: SceneName;
}

/**
 * Scene for a reading line at `y` (viewport px). A section holds its own scene
 * through most of its height and eases into the next one near its end.
 */
export function sceneAt(sections: SceneSection[], y: number, fallback: SceneName): Scene {
  if (sections.length === 0) return SCENES[fallback];
  if (y <= sections[0].top) return SCENES[sections[0].scene];

  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    if (y < s.top + s.height || i === sections.length - 1) {
      const next = sections[Math.min(i + 1, sections.length - 1)];
      const progress = s.height > 0 ? (y - s.top) / s.height : 1;
      return blendScenes(SCENES[s.scene], SCENES[next.scene], smoothstep(0.55, 1, progress));
    }
  }
  return SCENES[sections[sections.length - 1].scene];
}
