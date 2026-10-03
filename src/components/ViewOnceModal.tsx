"use client";

import { useState } from "react";

interface ViewOnceModalProps {
  apiKey: string;
  onClose: () => void;
}

export function ViewOnceModal({ apiKey, onClose }: ViewOnceModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-stroke bg-surface-solid p-6 sm:p-7 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 border border-stroke text-accent-dark shadow-sm">
              <span className="material-symbols-rounded">key</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-text">Kunci API Dibuat</h3>
              <p className="text-xs text-text-muted">Simpan kunci ini di tempat yang aman</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
          <span className="material-symbols-rounded text-base text-amber-600 shrink-0">warning</span>
          <p>
            <strong>Perhatian:</strong> Kunci ini hanya akan ditampilkan <strong>satu kali saja</strong> demi keamanan. Setelah jendela ini ditutup, Anda tidak dapat melihat teks lengkap kunci ini lagi.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Kunci API Rahasia
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 font-mono text-xs text-code-text bg-code-bg border border-stroke rounded-lg px-3.5 py-2.5 break-all select-all">
              {apiKey}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-accent border border-stroke px-3.5 py-2.5 text-xs font-semibold text-on-accent transition-all hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent-dark shadow-sm"
            >
              <span className="material-symbols-rounded text-sm">
                {copied ? "check" : "content_copy"}
              </span>
              <span>{copied ? "Tersalin" : "Salin"}</span>
            </button>
          </div>
        </div>

        <div className="border-t border-stroke pt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-surface-solid border border-stroke px-5 py-2 text-xs font-medium text-text transition-colors hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-accent-dark shadow-sm"
          >
            Selesai & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
