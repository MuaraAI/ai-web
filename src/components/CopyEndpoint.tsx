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
    <div className="flex flex-wrap items-center gap-x-4.5 gap-y-1">
      <span className="label">Base URL</span>
      <code className="select-all break-all font-mono text-[15px] text-ink">{url}</code>
      <button type="button" onClick={handleCopy} className="btn-quiet" aria-label="Salin Base URL">
        <span className="material-symbols-rounded" aria-hidden="true">
          {copied ? "check" : "content_copy"}
        </span>
        <span aria-live="polite">{copied ? "Tersalin" : "Salin"}</span>
      </button>
    </div>
  );
}
