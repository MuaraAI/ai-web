import { describe, expect, it } from "vitest";
import { formatStat, parseStats } from "../stats";

describe("parseStats", () => {
  it("orders known metrics and labels them in Indonesian", () => {
    const items = parseStats({ total_tokens: 1_250_000, total_requests: 4200, active_users: 87, uptime: 0.9991 });
    expect(items.map((i) => i.label)).toEqual(["Total request", "Token diproses", "Anggota aktif", "Uptime"]);
    expect(items[3].value).toBeCloseTo(99.91);
  });

  it("matches camelCase keys and unwraps nested data", () => {
    const items = parseStats({ ok: true, data: { totalRequests: "12", activeKeys: 5 } });
    expect(items).toEqual([
      expect.objectContaining({ label: "Total request", value: 12 }),
      expect.objectContaining({ label: "Kunci API aktif", value: 5 }),
    ]);
  });

  it("fills free slots with unknown numeric fields, skipping timestamps", () => {
    const items = parseStats({ requests: 3, updated_at: 1700000000, cache_hits: 9, models: ["a", "b", "c"] });
    expect(items.map((i) => i.label)).toEqual(["Total request", "Model aktif", "Cache hits"]);
    expect(items[1].value).toBe(3);
  });

  it("returns nothing for empty or invalid payloads", () => {
    expect(parseStats(null)).toEqual([]);
    expect(parseStats({ status: "ok" })).toEqual([]);
  });
});

describe("formatStat", () => {
  it("compacts large counts and keeps small ones exact", () => {
    expect(formatStat({ key: "a", label: "", value: 1_250_000 })).toMatch(/^1,3\sjt$/);
    expect(formatStat({ key: "a", label: "", value: 4200 })).toBe("4.200");
    expect(formatStat({ key: "u", label: "", value: 99.91, suffix: "%", decimals: 2 })).toBe("99,91%");
  });
});
