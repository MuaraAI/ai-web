"use client";

import { useState } from "react";

export function CopyEndpoint({
  url = "https://api.muaraai.com/v1/ai",
}: {
  url?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-lg border border-stroke bg-surface-solid px-3 py-1.5 font-mono text-xs shadow-sm">
      <span className="font-semibold text-accent-dark">BASE URL</span>
      <span className="text-text select-all font-medium">{url}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1 rounded border border-stroke bg-background px-2 py-0.5 text-[11px] font-sans font-medium text-text-muted hover:text-text hover:border-accent-dark/40 transition-colors"
        title="Salin Base URL"
      >
        <span className="material-symbols-rounded text-xs">
          {copied ? "check" : "content_copy"}
        </span>
        <span>{copied ? "Tersalin" : "Salin"}</span>
      </button>
    </div>
  );
}
