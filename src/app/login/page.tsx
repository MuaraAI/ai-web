"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { LoginButton } from "@/components/LoginButton";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FlowField } from "@/components/FlowField";
import { Estuary } from "@/components/Estuary";
import { Reveal } from "@/components/Reveal";

const perks = [
  { title: "Kunci dibuat di browser Anda", body: "Ditampilkan sekali saja. Server hanya menyimpan hash SHA-256." },
  { title: "Kuota mengikuti peran", body: "Batas request otomatis sesuai status keanggotaan aktif." },
  { title: "Prompt tidak pernah dicatat", body: "Percakapan hanya di-stream. Yang dihitung hanya jumlah request." },
];

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
    <div className="relative isolate flex min-h-screen flex-col">
      {/* The login gate sits at the river mouth. */}
      <FlowField fallback="mouth" />
      <Navbar />

      <main data-scene="mouth" className="container-page grid flex-1 items-center gap-15 pb-30 pt-6 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <Reveal className="flex max-w-[540px] flex-col gap-7.5">
          <Link href="/" className="btn-quiet w-fit">
            <span className="material-symbols-rounded" aria-hidden="true">arrow_back</span>
            Kembali ke beranda
          </Link>

          <div className="flex flex-col gap-6">
            <span className="eyebrow">Login with MuaraAI</span>
            <h1 className="text-heading-lg">Masuk ke Muara AI.</h1>
            <p className="text-body font-extralight text-mist">
              Gunakan akun GitHub yang terdaftar sebagai anggota komunitas. Sesi berlaku di seluruh subdomain muaraai.com.
            </p>
          </div>

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

          <ol className="border-b border-line">
            {perks.map((perk, i) => (
              <li key={perk.title} className="grid grid-cols-[36px_minmax(0,1fr)] gap-3 border-t border-line py-4.5">
                <span className="pt-0.5 font-mono text-sm text-ash">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex flex-col gap-1">
                  <span className="text-[15px]">{perk.title}</span>
                  <span className="text-sm font-extralight text-mist">{perk.body}</span>
                </div>
              </li>
            ))}
          </ol>

          <p className="text-sm font-extralight text-ash">
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
        </Reveal>

        <Reveal delay={150} className="hidden lg:block">
          <Estuary />
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
