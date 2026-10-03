"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { LoginButton } from "@/components/LoginButton";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    // Check if error=auth in query string
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("error") === "auth") {
        setAuthError(true);
      }
    }

    try {
      const supabase = getSupabase();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          router.replace("/dashboard");
        } else {
          setCheckingSession(false);
        }
      });
    } catch {
      setCheckingSession(false);
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-text">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-sm rounded-2xl border border-stroke bg-surface-solid p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-surface border border-stroke text-accent-dark mb-3 shadow-sm">
              <svg
                className="h-6 w-6"
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
            <h1 className="text-xl font-bold tracking-tight text-text">
              Masuk ke Muara AI
            </h1>
            <p className="mt-1 text-xs text-text-muted">
              Gunakan akun terdaftar anggota komunitas Anda
            </p>
          </div>

          {authError && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500">
              Autentikasi gagal atau tautan sesi telah kedaluwarsa. Silakan coba masuk kembali.
            </div>
          )}

          {checkingSession ? (
            <div className="py-8 text-center text-xs text-text-muted">
              Memeriksa sesi login...
            </div>
          ) : (
            <LoginButton />
          )}

          <div className="mt-6 border-t border-stroke pt-4 text-center text-[11px] text-text-muted leading-relaxed">
            Belum terdaftar sebagai anggota komunitas?{" "}
            <a
              href="https://muaraai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-dark font-medium underline hover:text-accent-dark/80 transition-colors"
            >
              Daftar keanggotaan
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
