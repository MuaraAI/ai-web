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
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-6 pb-30 pt-15">
        <div className="flex w-full max-w-[480px] flex-col gap-7.5">
          <span className="eyebrow">Login with MuaraAI</span>
          <h1 className="text-heading-lg">Masuk ke Muara AI.</h1>
          <p className="text-body font-extralight text-mist">
            Gunakan akun GitHub yang terdaftar sebagai anggota komunitas. Sesi berlaku di seluruh subdomain muaraai.com.
          </p>

          {authError && (
            <p role="alert" className="text-sm text-ember">
              Autentikasi gagal atau tautan sesi telah kedaluwarsa. Silakan coba masuk kembali.
            </p>
          )}

          {checkingSession ? (
            <p className="flex min-h-[48px] items-center gap-2 text-sm text-ash">
              <span className="material-symbols-rounded animate-spin" aria-hidden="true">progress_activity</span>
              Memeriksa sesi login...
            </p>
          ) : (
            <LoginButton />
          )}

          <p className="border-t border-line pt-7.5 text-sm font-extralight text-ash">
            Belum terdaftar sebagai anggota komunitas?{" "}
            <a
              href="https://muaraai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal text-saffron underline-offset-4 hover:underline"
            >
              Daftar keanggotaan
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
