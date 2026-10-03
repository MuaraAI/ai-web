import { useId } from "react";

/** River delta mark: a channel cuts through the Δ and opens at its base. Verdant river → iris sea. */
export function LogoMark({ className = "h-[26px] w-[26px]" }: { className?: string }) {
  const gradientId = useId();

  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2bd4b4" />
          <stop offset="1" stopColor="#8052ff" />
        </linearGradient>
      </defs>
      <path d="M16 2 L30 28 L2 28 Z" fill={`url(#${gradientId})`} />
      <path
        d="M16 7 C13.5 11 18.5 13.5 16 17.5 S12.5 23.5 16 29"
        fill="none"
        className="stroke-void"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-3">
      <LogoMark />
      <span className="text-lg tracking-[-0.02em] text-bone">Muara AI</span>
    </span>
  );
}
