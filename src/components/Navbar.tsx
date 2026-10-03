"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLink = "text-label font-semibold uppercase text-muted transition-colors hover:text-ink";

export function Navbar() {
  const pathname = usePathname();
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
    <header className="sticky top-0 z-50 w-full bg-canvas/80 backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center" aria-label="Muara AI, beranda">
          <Logo />
        </Link>

        <nav aria-label="Utama" className="flex items-center gap-3 sm:gap-6 lg:gap-8">
          <div className="hidden items-center gap-8 md:flex">
            {pathname !== "/" && (
              <Link href="/" className={navLink}>
                Beranda
              </Link>
            )}
            <Link href="/#models" className={navLink}>
              Model &amp; Limit
            </Link>
            <Link href="/#quickstart" className={navLink}>
              Quickstart
            </Link>
            <a href="https://github.com/MuaraAI" target="_blank" rel="noopener noreferrer" className={navLink}>
              GitHub
            </a>
          </div>

          {isLoggedIn ? (
            <Link
              href="/dashboard"
              aria-current={pathname === "/dashboard" ? "page" : undefined}
              className={pathname === "/dashboard" ? `${navLink} text-ink` : navLink}
            >
              Dashboard
            </Link>
          ) : (
            pathname !== "/login" && (
              <Link href="/login" className="btn-primary min-h-[44px] px-4 sm:px-5">
                Masuk
              </Link>
            )
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
