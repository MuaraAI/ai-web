"use client";

import { useState } from "react";
import { generateRawKey, keyPrefixOf, sha256Hex } from "@/lib/keys";
import { DB, getSupabase } from "@/lib/supabase";

interface GeneratePanelProps {
  userId: string;
  hasActiveKey: boolean;
  activeKeyId?: string;
  onKeyCreated: (rawKey: string) => void;
  onRefresh: () => void;
}

export function GeneratePanel({
  userId,
  hasActiveKey,
  activeKeyId,
  onKeyCreated,
  onRefresh,
}: GeneratePanelProps) {
  const [keyName, setKeyName] = useState("Default");
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasActiveKey && !confirmRegenerate) {
      setErrorMessage("Silakan centang persetujuan pencabutan kunci lama terlebih dahulu.");
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMessage(null);
      const supabase = getSupabase();

      // 1. If active key exists, revoke it first
      if (hasActiveKey && activeKeyId) {
        const { error: revokeError } = await supabase
          .from(DB.apiKeys)
          .update({ is_active: false })
          .eq("id", activeKeyId);

        if (revokeError) {
          throw new Error(`Gagal mencabut kunci lama: ${revokeError.message}`);
        }
      }

      // 2. Generate raw key and SHA-256 hash in browser
      const rawKey = generateRawKey();
      const keyHash = await sha256Hex(rawKey);
      const keyPrefix = keyPrefixOf(rawKey);

      // 3. Insert into public.ai_api_keys (view with security_invoker to ai.api_keys)
      const { error: insertError } = await supabase.from(DB.apiKeys).insert({
        user_id: userId,
        key_prefix: keyPrefix,
        key_hash: keyHash,
        name: keyName.trim() || "Default",
        is_active: true,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      // 4. Trigger view-once modal & refresh table
      onKeyCreated(rawKey);
      onRefresh();
      setConfirmRegenerate(false);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal membuat kunci API.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="rounded-xl border border-stroke bg-surface-solid p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-rounded text-accent-dark text-lg">add_circle</span>
        <h3 className="text-sm font-bold text-text">
          {hasActiveKey ? "Buat Ulang Kunci API (Regenerate)" : "Buat Kunci API Baru"}
        </h3>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-xs text-text-muted mb-1 font-medium">
            Nama Kunci / Deskripsi
          </label>
          <input
            type="text"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            placeholder="Misal: Proyek AI Kuliah"
            maxLength={40}
            className="w-full sm:max-w-xs rounded-lg border border-stroke bg-background px-3.5 py-2 text-xs sm:text-sm text-text placeholder:text-text-muted focus:border-accent-dark focus:outline-none focus:ring-1 focus:ring-accent-dark"
          />
        </div>

        {hasActiveKey && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-900 space-y-2">
            <p className="leading-relaxed">
              Anda telah memiliki kunci API yang aktif. Aturan sistem mengizinkan <strong>1 kunci aktif per anggota</strong>. Membuat kunci baru akan langsung menonaktifkan kunci lama Anda.
            </p>
            <label className="flex items-center gap-2 cursor-pointer pt-1 text-text">
              <input
                type="checkbox"
                checked={confirmRegenerate}
                onChange={(e) => setConfirmRegenerate(e.target.checked)}
                className="rounded border-stroke bg-background text-accent-dark focus:ring-accent-dark h-4 w-4"
              />
              <span className="text-[11px] font-medium">
                Saya mengerti dan setuju untuk mencabut kunci lama
              </span>
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={isGenerating || (hasActiveKey && !confirmRegenerate)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent border border-stroke px-4 py-2.5 text-xs sm:text-sm font-semibold text-on-accent transition-all hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent-dark shadow-sm disabled:opacity-50"
        >
          <span className="material-symbols-rounded text-sm">
            {isGenerating ? "hourglass_empty" : "key"}
          </span>
          <span>{isGenerating ? "Memproses..." : hasActiveKey ? "Buat Ulang Kunci" : "Buat Kunci API"}</span>
        </button>
      </form>
    </div>
  );
}
