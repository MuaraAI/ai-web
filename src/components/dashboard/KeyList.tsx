"use client";

import { useState } from "react";
import { DB, getSupabase } from "@/lib/supabase";

export interface ApiKeyItem {
  id: string;
  name: string;
  key_prefix: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

interface KeyListProps {
  keys: ApiKeyItem[];
  loading: boolean;
  onRefresh: () => void;
}

export function KeyList({ keys, loading, onRefresh }: KeyListProps) {
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRevoke = async (id: string) => {
    const confirm = window.confirm(
      "Apakah Anda yakin ingin mencabut kunci API ini? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.",
    );
    if (!confirm) return;

    try {
      setRevokingId(id);
      setErrorMessage(null);
      const supabase = getSupabase();
      const { error } = await supabase
        .from(DB.apiKeys)
        .update({ is_active: false })
        .eq("id", id);

      if (error) {
        setErrorMessage(error.message);
      } else {
        onRefresh();
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal mencabut kunci.");
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="rounded-xl border border-stroke bg-surface-solid p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-rounded text-accent-dark text-lg">vpn_key</span>
          <h3 className="text-sm font-bold text-text">Daftar Kunci API Anda</h3>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-lg border border-stroke bg-surface px-2.5 py-1 text-[11px] font-medium text-text-muted transition-colors hover:text-text disabled:opacity-50"
        >
          <span className={`material-symbols-rounded text-xs ${loading ? "animate-spin" : ""}`}>
            sync
          </span>
          <span>Perbarui</span>
        </button>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500">
          {errorMessage}
        </div>
      )}

      {loading && keys.length === 0 ? (
        <div className="py-8 text-center text-xs text-text-muted">Memuat daftar kunci...</div>
      ) : keys.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stroke p-6 text-center text-xs text-text-muted">
          Belum ada kunci API. Buat kunci pertama Anda melalui panel pembuatan di atas.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stroke text-text-muted">
                <th className="pb-2.5 font-medium">Nama</th>
                <th className="pb-2.5 font-medium">Prefix Kunci</th>
                <th className="pb-2.5 font-medium">Status</th>
                <th className="pb-2.5 font-medium hidden sm:table-cell">Dibuat</th>
                <th className="pb-2.5 font-medium hidden md:table-cell">Terakhir Digunakan</th>
                <th className="pb-2.5 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke/60">
              {keys.map((k) => (
                <tr key={k.id} className="group transition-colors hover:bg-surface-hover/40">
                  <td className="py-3 font-medium text-text">{k.name}</td>
                  <td className="py-3 font-mono text-text-muted">
                    <span className="text-accent-dark font-medium">{k.key_prefix}</span>••••••••
                  </td>
                  <td className="py-3">
                    {k.is_active ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                        <span className="h-1 w-1 rounded-full bg-emerald-500" />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-500">
                        Dicabut
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-text-muted hidden sm:table-cell">
                    {new Date(k.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-3 text-text-muted hidden md:table-cell">
                    {k.last_used_at
                      ? new Date(k.last_used_at).toLocaleDateString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Belum pernah"}
                  </td>
                  <td className="py-3 text-right">
                    {k.is_active && (
                      <button
                        type="button"
                        onClick={() => handleRevoke(k.id)}
                        disabled={revokingId === k.id}
                        className="rounded px-2.5 py-1 text-[11px] font-medium text-red-500 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      >
                        {revokingId === k.id ? "Mencabut..." : "Cabut"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
