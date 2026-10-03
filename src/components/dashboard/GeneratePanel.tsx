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
    <section className="grid items-start gap-15 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <span className="eyebrow">Kunci API</span>
        <h2 className="text-heading-sm">{hasActiveKey ? "Buat ulang kunci API." : "Buat kunci API baru."}</h2>
        <p className="max-w-[440px] text-body font-extralight text-mist">
          Kunci dibuat di browser Anda dan hanya ditampilkan sekali. Server hanya menyimpan hash SHA-256.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label htmlFor="key-name" className="label">
            Nama kunci / deskripsi
          </label>
          <input
            id="key-name"
            type="text"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            placeholder="Misal: Proyek AI Kuliah"
            maxLength={40}
            className="field max-w-[420px]"
          />
        </div>

        {hasActiveKey && (
          <div className="flex flex-col gap-3">
            <p className="max-w-[520px] text-[15px] font-extralight leading-relaxed text-mist">
              <strong className="font-semibold text-saffron">1 kunci aktif per anggota.</strong> Membuat kunci baru akan langsung menonaktifkan kunci lama Anda.
            </p>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-[15px]">
              <input
                type="checkbox"
                checked={confirmRegenerate}
                onChange={(e) => setConfirmRegenerate(e.target.checked)}
                className="h-[18px] w-[18px] accent-iris"
              />
              Saya mengerti dan setuju untuk mencabut kunci lama
            </label>
          </div>
        )}

        {errorMessage && (
          <p role="alert" className="text-sm text-ember">
            {errorMessage}
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={isGenerating || (hasActiveKey && !confirmRegenerate)}
            className="btn-primary"
          >
            <span className="material-symbols-rounded" aria-hidden="true">
              {isGenerating ? "hourglass_empty" : "key"}
            </span>
            {isGenerating ? "Memproses..." : hasActiveKey ? "Buat ulang kunci" : "Buat kunci API"}
          </button>
        </div>
      </form>
    </section>
  );
}
