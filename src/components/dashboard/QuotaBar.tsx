"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export interface QuotaData {
  max_per_minute: number;
  max_requests: number;
  window_hours: number;
  minute_count: number;
  window_count: number;
  window_resets_at: string;
}

function Meter({ title, hint, used, max }: { title: string; hint: string; used: number; max: number }) {
  const pct = Math.min(100, Math.round((used / max) * 100));

  return (
    <div className="flex flex-col gap-4.5">
      <div className="flex items-baseline justify-between gap-4.5">
        <h3 className="label text-label">{title}</h3>
        <span className="text-caption text-muted">{hint}</span>
      </div>
      <p className="flex flex-wrap items-baseline gap-x-3">
        <span className="text-[clamp(3rem,6vw,4.875rem)] leading-none tracking-[-0.04em]">
          {used.toLocaleString("id-ID")}
        </span>
        <span className="text-heading-2xs text-muted">/ {max.toLocaleString("id-ID")} request</span>
      </p>
      <div
        role="progressbar"
        aria-label={title}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-0.5 w-full overflow-hidden rounded-pill bg-line-strong"
      >
        <div
          className={`h-full transition-[width] duration-500 ease-out ${pct > 80 ? "bg-saffron" : "bg-iris"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function QuotaBar() {
  const [data, setData] = useState<QuotaData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuota = async () => {
    try {
      setLoading(true);
      const supabase = getSupabase();
      const { data: result, error } = await supabase.rpc("quota_status");
      if (!error && result) {
        setData(result as QuotaData);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuota();
  }, []);

  const refreshButton = (label: string) => (
    <button type="button" onClick={fetchQuota} disabled={loading} className="btn-ghost text-muted hover:text-ink">
      <span className={`material-symbols-rounded ${loading ? "animate-spin" : ""}`} aria-hidden="true">sync</span>
      {label}
    </button>
  );

  return (
    <section aria-labelledby="quota-title" className="flex flex-col gap-9">
      <div className="flex flex-wrap items-baseline justify-between gap-4.5">
        <h2 id="quota-title" className="text-heading-sm">Kuota</h2>
        {data && refreshButton("Segarkan")}
      </div>

      {loading && !data ? (
        <div className="grid animate-pulse grid-cols-1 gap-15 md:grid-cols-2" aria-hidden="true">
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-col gap-4.5">
              <div className="h-3 w-28 rounded-pill bg-line-strong" />
              <div className="h-14 w-40 rounded-pill bg-line" />
              <div className="h-0.5 w-full bg-line-strong" />
            </div>
          ))}
        </div>
      ) : !data ? (
        <div className="flex flex-wrap items-center justify-between gap-4.5 border-y border-line py-6">
          <p className="text-base font-extralight text-soft">
            Informasi kuota akan aktif setelah Anda membuat kunci API pertama.
          </p>
          {refreshButton("Muat ulang")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-15 md:grid-cols-2">
          <Meter title="Menit ini" hint="Reset tiap awal menit" used={data.minute_count} max={data.max_per_minute} />
          <Meter
            title={`Siklus ${data.window_hours} jam`}
            hint={`Reset ${new Date(data.window_resets_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`}
            used={data.window_count}
            max={data.max_requests}
          />
        </div>
      )}
    </section>
  );
}
