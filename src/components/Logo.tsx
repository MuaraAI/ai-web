import { useId } from "react";

/** Angular brand mark: the only place the iris → verdant gradient is allowed. */
export function LogoMark({ className = "h-[26px] w-[26px]" }: { className?: string }) {
  const gradientId = useId();

  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8052ff" />
          <stop offset="1" stopColor="#15846e" />
        </linearGradient>
      </defs>
      <path d="M16 2 L30 28 L2 28 Z" fill={`url(#${gradientId})`} />
      <path d="M16 12 L22 24 L10 24 Z" fill="#000000" />
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
