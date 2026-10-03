import { describe, expect, it } from "vitest";
import {
  generateRawKey,
  isValidRawKey,
  KEY_PREFIX,
  keyPrefixOf,
  sha256Hex,
} from "../keys";

describe("keys module", () => {
  it("generates keys matching format muara_ai_<64 lowercase hex>", () => {
    for (let i = 0; i < 50; i++) {
      const key = generateRawKey();
      expect(key.startsWith(KEY_PREFIX)).toBe(true);
      expect(key.length).toBe(9 + 64); // "muara_ai_" (9) + 64 hex = 73
      expect(isValidRawKey(key)).toBe(true);
    }
  });

  it("generates unique keys across 1000 generations", () => {
    const set = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      set.add(generateRawKey());
    }
    expect(set.size).toBe(1000);
  });

  it("calculates sha256Hex matching known test vectors", async () => {
    // SHA256("abc") = ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
    const h1 = await sha256Hex("abc");
    expect(h1).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");

    // SHA256("") = e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    const h2 = await sha256Hex("");
    expect(h2).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  });

  it("extracts keyPrefixOf with length 14", () => {
    const raw = "muara_ai_ab1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const prefix = keyPrefixOf(raw);
    expect(prefix).toBe("muara_ai_ab123");
    expect(prefix.length).toBe(14);
  });

  it("isValidRawKey rejects invalid prefixes, uppercase, wrong lengths, and non-hex", () => {
    expect(isValidRawKey("sk-live_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef")).toBe(false);
    expect(isValidRawKey("muara_ai_" + "A".repeat(64))).toBe(false);
    expect(isValidRawKey("muara_ai_" + "a".repeat(63))).toBe(false);
    expect(isValidRawKey("muara_ai_" + "a".repeat(65))).toBe(false);
    expect(isValidRawKey("muara_ai_" + "z".repeat(64))).toBe(false);
    expect(isValidRawKey("")).toBe(false);
    expect(isValidRawKey("muara_ai_")).toBe(false);
  });
});
