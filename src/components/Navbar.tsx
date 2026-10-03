"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const supabase = getSupabase();
      supabase.auth.getSession().then(({ data: { session } }) => {
        setIsLoggedIn(Boolean(session?.user));
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsLoggedIn(Boolean(session?.user));
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      // Env variables not yet present in some contexts
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stroke bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-solid border border-stroke text-accent-dark transition-colors group-hover:border-accent-dark/40 shadow-sm">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19V5l8 7 8-7v14" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-text">
              Muara AI
            </span>
            <span className="hidden items-center gap-1.5 rounded-full border border-stroke bg-surface-solid px-2 py-0.5 text-[11px] font-medium text-accent-dark sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-dark animate-pulse" />
              Operational
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-6 text-sm text-text-muted md:flex font-medium">
          <Link
            href="/#models"
            className="transition-colors hover:text-text focus:outline-none focus:text-text"
          >
            Model & Limit
          </Link>
          <Link
            href="/#quickstart"
            className="transition-colors hover:text-text focus:outline-none focus:text-text"
          >
            Quickstart
          </Link>
          <a
            href="https://github.com/MuaraAI"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-text focus:outline-none focus:text-text"
          >
            GitHub
          </a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-accent border border-stroke px-4 py-2 text-xs sm:text-sm font-semibold text-on-accent transition-all hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent-dark shadow-sm"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-surface-solid border border-stroke px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-text transition-all hover:border-accent-dark/40 hover:text-accent-dark focus:outline-none focus:ring-2 focus:ring-accent-dark shadow-sm"
            >
              Login With MuaraAI
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
