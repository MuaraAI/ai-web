"use client";

import { useState } from "react";

/** Copies `text` to the clipboard and confirms with a check for two seconds. */
export function CopyButton({
  text,
  label,
  showText = false,
  className = "",
}: {
  text: string;
  /** Accessible name, e.g. "Salin ID model muara-v1-flash-low". */
  label: string;
  /** Show "Salin" / "Tersalin" next to the icon. */
  showText?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the text stays selectable.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      title={copied ? "Tersalin" : label}
      className={`btn-quiet ${showText ? "" : "min-w-[44px] justify-center"} ${copied ? "text-saffron hover:text-saffron" : ""} ${className}`}
    >
      <span className="material-symbols-rounded" aria-hidden="true">
        {copied ? "check" : "content_copy"}
      </span>
      {showText ? (
        <span aria-live="polite">{copied ? "Tersalin" : "Salin"}</span>
      ) : (
        <span className="sr-only" aria-live="polite">
          {copied ? "Tersalin" : ""}
        </span>
      )}
    </button>
  );
}
