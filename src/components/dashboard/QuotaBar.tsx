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

  if (loading && !data) {
    return (
      <div className="rounded-xl border border-white/10 bg-surface-solid/60 p-5 backdrop-blur-sm animate-pulse">
        <div className="h-4 w-32 bg-white/10 rounded mb-4" />
        <div className="h-3 w-full bg-white/5 rounded" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-white/10 bg-surface-solid/60 p-5 text-xs text-text-muted flex items-center justify-between">
        <span>Informasi kuota akan aktif setelah Anda membuat kunci API pertama.</span>
        <button
          type="button"
          onClick={fetchQuota}
          className="rounded border border-stroke px-2 py-1 text-[11px] hover:text-text"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  const minutePct = Math.min(100, Math.round((data.minute_count / data.max_per_minute) * 100));
  const windowPct = Math.min(100, Math.round((data.window_count / data.max_requests) * 100));

  return (
    <div className="rounded-xl border border-stroke bg-surface-solid p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-rounded text-accent-dark text-lg">speed</span>
          <h3 className="text-sm font-bold text-text">Status Kuota & Batas Penggunaan</h3>
        </div>
        <button
          type="button"
          onClick={fetchQuota}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-lg border border-stroke bg-surface px-2.5 py-1 text-[11px] font-medium text-text-muted transition-colors hover:text-text disabled:opacity-50"
        >
          <span className={`material-symbols-rounded text-xs ${loading ? "animate-spin" : ""}`}>
            sync
          </span>
          <span>Segarkan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Minute limit */}
        <div className="space-y-1.5 rounded-lg border border-stroke bg-background/60 p-3.5">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Batas Menit Ini</span>
            <span className="font-mono font-medium text-text">
              {data.minute_count} / {data.max_per_minute} req
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-stroke/60">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                minutePct > 80 ? "bg-amber-500" : "bg-accent-dark"
              }`}
              style={{ width: `${minutePct}%` }}
            />
          </div>
          <p className="text-[10px] text-text-muted">Reset otomatis setiap awal menit</p>
        </div>

        {/* 5-hour limit */}
        <div className="space-y-1.5 rounded-lg border border-stroke bg-background/60 p-3.5">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Batas Siklus ({data.window_hours} Jam)</span>
            <span className="font-mono font-medium text-text">
              {data.window_count} / {data.max_requests} req
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-stroke/60">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                windowPct > 80 ? "bg-amber-500" : "bg-accent-dark"
              }`}
              style={{ width: `${windowPct}%` }}
            />
          </div>
          <p className="text-[10px] text-text-muted">
            Reset: {new Date(data.window_resets_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
          </p>
        </div>
      </div>
    </div>
  );
}
