export const STATS_URL = "https://api.muaraai.com/v1/ai/stats";

export interface StatItem {
  key: string;
  label: string;
  value: number;
  /** Rendered after the number, e.g. "%" or " ms". */
  suffix?: string;
  /** Digits kept when the value is not compacted (percentages, latency). */
  decimals?: number;
}

interface Known {
  label: string;
  suffix?: string;
  decimals?: number;
}

// Known metrics, in display priority. Keys are matched after lowercasing and
// stripping separators, so `totalRequests`, `total_requests` and `total-requests` agree.
const KNOWN: [string[], Known][] = [
  [["totalrequests", "requeststotal", "requests", "requestcount", "totalrequest"], { label: "Total request" }],
  [["requeststoday", "todayrequests", "requests24h", "requestslast24h", "dailyrequests"], { label: "Request 24 jam" }],
  [["totaltokens", "tokens", "tokenstotal", "tokensprocessed", "tokencount"], { label: "Token diproses" }],
  [["activeusers", "users", "totalusers", "members", "activemembers", "totalmembers"], { label: "Anggota aktif" }],
  [["activekeys", "keys", "apikeys", "totalkeys", "activeapikeys"], { label: "Kunci API aktif" }],
  [["uptime", "uptimepercent", "uptimepct", "availability"], { label: "Uptime", suffix: "%", decimals: 2 }],
  [["avglatencyms", "latencyms", "averagelatencyms", "p50latencyms", "latency"], { label: "Latensi rata-rata", suffix: " ms" }],
  [["models", "modelcount", "totalmodels"], { label: "Model aktif" }],
];

const IGNORED = /(^|_)(id|ts|timestamp|time|at|date|version|status|code)$/;

const normalize = (key: string) => key.toLowerCase().replace(/[^a-z0-9]/g, "");

function humanize(key: string): string {
  const words = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-.]+/g, " ")
    .trim()
    .toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
  return null;
}

/** Numeric leaves of a JSON object, keyed by their last path segment. Arrays count as their length. */
function collect(node: unknown, out: Map<string, number>, depth = 0) {
  if (!node || typeof node !== "object" || depth > 3) return;
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      if (!out.has(key)) out.set(key, value.length);
      continue;
    }
    if (value && typeof value === "object") {
      collect(value, out, depth + 1);
      continue;
    }
    const n = toNumber(value);
    if (n !== null && !out.has(key)) out.set(key, n);
  }
}

/**
 * Turns the gateway's stats payload into display tiles. Known metrics come first in a
 * fixed order; any other numeric fields fill the remaining slots with humanized labels.
 */
export function parseStats(payload: unknown, limit = 4): StatItem[] {
  const fields = new Map<string, number>();
  collect(payload, fields);

  const items: StatItem[] = [];
  const used = new Set<string>();

  for (const [aliases, meta] of KNOWN) {
    for (const [key, value] of fields) {
      if (used.has(key) || !aliases.includes(normalize(key))) continue;
      const pct = meta.suffix === "%" && value > 0 && value <= 1 ? value * 100 : value;
      items.push({ key, value: pct, ...meta });
      used.add(key);
      break;
    }
  }

  for (const [key, value] of fields) {
    if (used.has(key) || IGNORED.test(key.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase())) continue;
    items.push({ key, label: humanize(key), value });
    used.add(key);
  }

  return items.slice(0, limit);
}

const compact = new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 });

export function formatStat(item: StatItem, value = item.value): string {
  const text =
    item.decimals !== undefined
      ? value.toLocaleString("id-ID", { maximumFractionDigits: item.decimals })
      : Math.abs(value) >= 10_000
        ? compact.format(value)
        : Math.round(value).toLocaleString("id-ID");
  return `${text}${item.suffix ?? ""}`;
}
