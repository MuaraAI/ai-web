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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/85 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-once-title"
        className="flex w-full max-w-[600px] flex-col gap-6 rounded-card border border-line-strong bg-canvas p-7 sm:p-[38px]"
      >
        <span className="eyebrow">Tampil satu kali</span>
        <h2 id="view-once-title" className="text-heading-sm">
          Kunci API dibuat.
        </h2>
        <p className="text-base font-extralight leading-relaxed text-soft">
          Simpan sekarang di tempat aman. Demi keamanan, kunci hanya ditampilkan <strong className="font-semibold text-saffron">satu kali</strong>. Setelah jendela ini ditutup, teks lengkapnya tidak dapat dilihat lagi.
        </p>

        <div className="flex flex-col gap-3">
          <span className="label">Kunci API rahasia</span>
          <div className="flex flex-col gap-3 rounded-card border border-line-strong py-3.5 pl-5 pr-3.5 sm:flex-row sm:items-center sm:gap-4.5">
            <code className="min-w-0 flex-1 select-all break-all font-mono text-sm text-ink">{apiKey}</code>
            <button type="button" onClick={handleCopy} className="btn-primary min-h-[44px] shrink-0 px-4.5">
              <span className="material-symbols-rounded" aria-hidden="true">
                {copied ? "check" : "content_copy"}
              </span>
              <span aria-live="polite">{copied ? "Tersalin" : "Salin"}</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="btn-ghost">
            Selesai &amp; tutup
          </button>
        </div>
      </div>
    </div>
  );
}
