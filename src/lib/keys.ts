export const KEY_PREFIX = "muara_ai_";

const RAW_KEY_REGEX = /^muara_ai_[0-9a-f]{64}$/;

/**
 * Generate 32 bytes (64 hex characters) of cryptographic randomness.
 * Formatted with prefix: muara_ai_<64 lowercase hex>.
 */
export function generateRawKey(): string {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${KEY_PREFIX}${hex}`;
}

/**
 * Computes lowercase SHA-256 hex string using browser/Node WebCrypto API.
 */
export async function sha256Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const digestBuffer = await globalThis.crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digestBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Extracts preview prefix (first 14 chars, e.g. "muara_ai_ab12").
 */
export function keyPrefixOf(raw: string): string {
  return raw.slice(0, 14);
}

/**
 * Validates whether string conforms strictly to muara_ai_<64 lowercase hex>.
 */
export function isValidRawKey(key: string): boolean {
  return RAW_KEY_REGEX.test(key);
}
