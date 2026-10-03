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
    <section aria-labelledby="keys-title" className="flex flex-col gap-7.5">
      <div className="flex flex-wrap items-baseline justify-between gap-4.5">
        <h2 id="keys-title" className="text-heading-sm">
          Kunci Anda
        </h2>
        <button type="button" onClick={onRefresh} disabled={loading} className="btn-ghost text-ash hover:text-bone">
          <span className={`material-symbols-rounded ${loading ? "animate-spin" : ""}`} aria-hidden="true">
            sync
          </span>
          Perbarui
        </button>
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-ember">
          {errorMessage}
        </p>
      )}

      {loading && keys.length === 0 ? (
        <p className="border-y border-line py-7.5 text-base font-extralight text-ash">Memuat daftar kunci...</p>
      ) : keys.length === 0 ? (
        <p className="border-y border-line py-7.5 text-base font-extralight text-mist">
          Belum ada kunci API. Buat kunci pertama Anda melalui formulir di atas.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[15px]">
            <thead>
              <tr className="label">
                <th scope="col" className="pb-3 pr-4.5 font-semibold">Nama</th>
                <th scope="col" className="pb-3 pr-4.5 font-semibold">Prefix</th>
                <th scope="col" className="pb-3 pr-4.5 font-semibold">Status</th>
                <th scope="col" className="hidden pb-3 pr-4.5 font-semibold sm:table-cell">Dibuat</th>
                <th scope="col" className="hidden pb-3 pr-4.5 font-semibold md:table-cell">Terakhir dipakai</th>
                <th scope="col" className="pb-3 text-right font-semibold">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="border-b border-line">
              {keys.map((k) => (
                <tr key={k.id} className={`border-t border-line ${k.is_active ? "" : "text-ash"}`}>
                  <td className="py-6 pr-4.5">{k.name}</td>
                  <td className="py-6 pr-4.5 font-mono text-sm">
                    {k.key_prefix}
                    <span className="text-ash">••••••••</span>
                  </td>
                  <td className="py-6 pr-4.5">
                    {k.is_active ? "Aktif" : "Dicabut"}
                  </td>
                  <td className="hidden py-6 pr-4.5 font-extralight sm:table-cell">
                    {new Date(k.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="hidden py-6 pr-4.5 font-extralight md:table-cell">
                    {k.last_used_at
                      ? new Date(k.last_used_at).toLocaleDateString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Belum pernah"}
                  </td>
                  <td className="py-6 text-right">
                    {k.is_active && (
                      <button
                        type="button"
                        onClick={() => handleRevoke(k.id)}
                        disabled={revokingId === k.id}
                        className="btn-ghost text-ember hover:text-bone"
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
    </section>
  );
}
