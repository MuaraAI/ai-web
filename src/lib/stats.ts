export const STATS_URL = "https://api.muaraai.com/v1/ai/stats";

export interface StatItem {
  key: string;
  label: string;
  /** One line under the label that says what the number means. */
  hint?: string;
  value: number;
  /** Rendered after the number, e.g. "%" or " ms". */
  suffix?: string;
  /** Digits kept when the value is not compacted (percentages). */
  decimals?: number;
  /** Token counts read as 500k / 1,2M, like the rest of the site. */
  unit?: "tokens";
}

interface Field {
  /** Normalized path segments, e.g. ["models", "count"]. */
  path: string[];
  /** Original dotted path, used as a stable key. */
  key: string;
  value: number;
}

interface Metric {
  id: string;
  label: string;
  /** Aliases for the number shown, best first. "a.b" means key b under a parent a. */
  value: string[];
  /** Aliases for a total the shown number is part of ("3 of 5"). */
  total?: string[];
  hint: (total: number | null) => string;
  suffix?: string;
  decimals?: number;
  unit?: "tokens";
  /** Percentages may come as a 0..1 ratio. */
  ratio?: boolean;
}

// Known metrics in display priority. Keys are compared lowercased with separators
// stripped, so `activeMembers`, `active_members` and `active-members` agree.
const METRICS: Metric[] = [
  {
    id: "members",
    label: "Anggota aktif",
    value: ["members.active", "users.active", "activemembers", "activeusers", "members", "users", "members.count", "users.count", "totalmembers", "totalusers"],
    total: ["members.total", "members.count", "users.total", "users.count", "totalmembers", "totalusers"],
    hint: (t) => (t ? `Dari ${t} anggota terdaftar di gateway` : "Anggota komunitas yang memakai gateway"),
  },
  {
    id: "requests",
    label: "Total request",
    value: ["totalrequests", "requests.total", "requests.count", "requests", "requestcount", "requeststotal"],
    hint: () => "Panggilan API yang sudah dilayani gateway",
  },
  {
    id: "requests-today",
    label: "Request 24 jam",
    value: ["requeststoday", "requests.today", "requests24h", "requests.last24h", "requestslast24h", "dailyrequests"],
    hint: () => "Panggilan API dalam 24 jam terakhir",
  },
  {
    id: "tokens",
    label: "Token diproses",
    value: ["totaltokens", "tokens.total", "tokens", "tokensprocessed", "tokencount"],
    unit: "tokens",
    hint: () => "Token masuk dan keluar yang sudah dilayani",
  },
  {
    id: "models",
    label: "Model aktif",
    value: ["models.active", "activemodels", "models.count", "models.total", "modelcount", "totalmodels", "models"],
    total: ["models.count", "models.total", "modelcount", "totalmodels", "models"],
    hint: (t) => (t ? `Dari ${t} tingkat penalaran Muara V1 Flash` : "Tingkat penalaran yang siap dipakai"),
  },
  {
    id: "keys",
    label: "Kunci API aktif",
    value: ["keys.active", "apikeys.active", "activekeys", "activeapikeys", "keys.count", "apikeys.count", "keys", "apikeys", "totalkeys"],
    total: ["keys.total", "keys.count", "apikeys.total", "apikeys.count", "totalkeys"],
    hint: (t) => (t ? `Dari ${t} kunci yang pernah dibuat` : "Kunci yang bisa dipakai saat ini"),
  },
  {
    id: "context",
    label: "Jendela konteks",
    value: ["contextwindow", "maxcontext", "contexttokens", "maxcontexttokens", "contextlength"],
    unit: "tokens",
    hint: () => "Token maksimum yang dibaca dalam satu permintaan",
  },
  {
    id: "output",
    label: "Keluaran maksimum",
    value: ["maxoutput", "maxoutputtokens", "outputtokens", "maxtokens"],
    unit: "tokens",
    hint: () => "Panjang jawaban terpanjang dalam token",
  },
  {
    id: "uptime",
    label: "Uptime",
    value: ["uptime", "uptimepercent", "uptimepct", "availability"],
    suffix: "%",
    decimals: 2,
    ratio: true,
    hint: () => "Ketersediaan gateway",
  },
  {
    id: "latency",
    label: "Latensi rata-rata",
    value: ["avglatencyms", "latencyms", "averagelatencyms", "p50latencyms", "latency"],
    suffix: " ms",
    hint: () => "Waktu rata-rata sampai respons pertama",
  },
];

// Words for labeling fields no metric knows, e.g. `cache.hits` → "Hits cache".
const NOUNS: Record<string, string> = {
  models: "model",
  keys: "kunci API",
  apikeys: "kunci API",
  members: "anggota",
  users: "anggota",
  requests: "request",
  tokens: "token",
};
const WORDS: Record<string, string> = { count: "Jumlah", total: "Total", active: "Aktif", today: "Hari ini" };

const IGNORED = /^(id|ts|timestamp|time|date|version|status|code|ok)$|(at|time|timestamp|date)$/;

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

/** Numeric leaves of a JSON object with their paths. Arrays count as their length. */
function collect(node: unknown, out: Field[], path: string[] = [], raw: string[] = []) {
  if (!node || typeof node !== "object" || path.length > 3) return;
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    const p = [...path, normalize(key)];
    const r = [...raw, key];
    if (Array.isArray(value)) {
      out.push({ path: p, key: r.join("."), value: value.length });
    } else if (value && typeof value === "object") {
      collect(value, out, p, r);
    } else {
      const n = toNumber(value);
      if (n !== null) out.push({ path: p, key: r.join("."), value: n });
    }
  }
}

/** "a.b" matches a field whose last two segments are a and b; "a" matches its last segment. */
function matches(field: Field, alias: string): boolean {
  const parts = alias.split(".");
  if (parts.length > field.path.length) return false;
  return parts.every((part, i) => field.path[field.path.length - parts.length + i] === part);
}

function find(fields: Field[], aliases: string[], used: Set<string>): Field | undefined {
  for (const alias of aliases) {
    const hit = fields.find((f) => !used.has(f.key) && matches(f, alias));
    if (hit) return hit;
  }
  return undefined;
}

/**
 * Turns the gateway's stats payload into display tiles with a label and a one-line
 * explanation. Known metrics come first in a fixed order, and an "active" count is
 * shown together with its total ("3, dari 5 ..."). Unknown numeric fields fill any
 * remaining slots.
 */
export function parseStats(payload: unknown, limit = 4): StatItem[] {
  const fields: Field[] = [];
  collect(payload, fields);

  const items: StatItem[] = [];
  const used = new Set<string>();

  for (const m of METRICS) {
    const hit = find(fields, m.value, used);
    if (!hit) continue;
    used.add(hit.key);

    let total: number | null = null;
    const totalHit = m.total ? find(fields, m.total, used) : undefined;
    if (totalHit) {
      used.add(totalHit.key);
      if (totalHit.value > hit.value) total = totalHit.value;
    }

    const value = m.ratio && hit.value > 0 && hit.value <= 1 ? hit.value * 100 : hit.value;
    items.push({
      key: m.id,
      label: m.label,
      hint: m.hint(total),
      value,
      suffix: m.suffix,
      decimals: m.decimals,
      unit: m.unit,
    });
  }

  for (const f of fields) {
    const last = f.path[f.path.length - 1];
    if (used.has(f.key) || IGNORED.test(last)) continue;
    const parent = f.path[f.path.length - 2];
    const label =
      parent && WORDS[last] && NOUNS[parent]
        ? `${WORDS[last]} ${NOUNS[parent]}`
        : humanize(f.key.split(".").slice(-2).join(" "));
    items.push({ key: f.key, label, value: f.value });
    used.add(f.key);
  }

  return items.slice(0, limit);
}

const compact = new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 });
const oneDecimal = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 1 });

export function formatStat(item: StatItem, value = item.value): string {
  let text: string;
  if (item.unit === "tokens" && Math.abs(value) >= 1000) {
    text = Math.abs(value) >= 1_000_000 ? `${oneDecimal(value / 1_000_000)}M` : `${oneDecimal(value / 1000)}k`;
  } else if (item.decimals !== undefined) {
    text = value.toLocaleString("id-ID", { maximumFractionDigits: item.decimals });
  } else if (Math.abs(value) >= 10_000) {
    text = compact.format(value);
  } else {
    text = Math.round(value).toLocaleString("id-ID");
  }
  return `${text}${item.suffix ?? ""}`;
}
