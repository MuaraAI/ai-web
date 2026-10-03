import { describe, expect, it } from "vitest";
import { formatStat, parseStats } from "../stats";

describe("parseStats", () => {
  it("orders known metrics and labels them in Indonesian", () => {
    const items = parseStats({ total_tokens: 1_250_000, total_requests: 4200, active_users: 87, uptime: 0.9991 });
    expect(items.map((i) => i.label)).toEqual(["Anggota aktif", "Total request", "Token diproses", "Uptime"]);
    expect(items[3].value).toBeCloseTo(99.91);
    expect(items.every((i) => i.hint)).toBe(true);
  });

  it("reads generic count/active keys through their parent group", () => {
    const items = parseStats({
      members: 1,
      models: { count: 3, active: 3, context_window: 500000 },
      keys: { count: 5, active: 3 },
    });
    expect(items).toEqual([
      expect.objectContaining({ label: "Anggota aktif", value: 1 }),
      expect.objectContaining({ label: "Model aktif", value: 3, hint: "Tingkat penalaran yang siap dipakai" }),
      expect.objectContaining({ label: "Kunci API aktif", value: 3, hint: "Dari 5 kunci yang pernah dibuat" }),
      expect.objectContaining({ label: "Jendela konteks", value: 500000, unit: "tokens" }),
    ]);
  });

  it("matches camelCase keys and unwraps nested data", () => {
    const items = parseStats({ ok: true, data: { totalRequests: "12", activeKeys: 5 } });
    expect(items).toEqual([
      expect.objectContaining({ label: "Total request", value: 12 }),
      expect.objectContaining({ label: "Kunci API aktif", value: 5 }),
    ]);
  });

  it("fills free slots with unknown numeric fields, skipping timestamps", () => {
    const items = parseStats({ requests: 3, updated_at: 1700000000, cache: { hits: 9 }, models: ["a", "b", "c"] });
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

  it("writes token counts as k and M", () => {
    expect(formatStat({ key: "c", label: "", value: 500000, unit: "tokens" })).toBe("500k");
    expect(formatStat({ key: "t", label: "", value: 1_250_000, unit: "tokens" })).toBe("1,3M");
  });
});
