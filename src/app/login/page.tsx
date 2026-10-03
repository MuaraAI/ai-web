"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { LoginButton } from "@/components/LoginButton";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { CodeBlock } from "@/components/CodeBlock";

const steps = [
  { title: "Masuk dengan GitHub", body: "Keanggotaan komunitas diperiksa otomatis dari akun GitHub Anda." },
  { title: "Buat kunci API", body: "Kunci dibuat di browser dan tampil sekali saja. Server hanya menyimpan hash SHA-256." },
  { title: "Panggil endpoint", body: "Pakai SDK OpenAI biasa. Kuota mengikuti peran, prompt tidak pernah dicatat." },
];

const facts = ["Gratis untuk anggota", "Format OpenAI API", "Zero log prompt"];

const firstCall = `curl https://api.muaraai.com/v1/ai/chat/completions \\
  -H "Authorization: Bearer muara_ai_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "muara-v1-flash-low",
       "messages": [{"role": "user", "content": "Halo!"}]}'`;

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
      <Navbar />

      <main className="container-page grid flex-1 items-center gap-12 pb-24 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <Reveal className="flex max-w-[520px] flex-col gap-7.5">
          <Link href="/" className="btn-quiet w-fit">
            <span className="material-symbols-rounded" aria-hidden="true">arrow_back</span>
            Kembali ke beranda
          </Link>

          <div className="flex flex-col gap-5">
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

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-mist">
            {facts.map((fact) => (
              <li key={fact} className="flex items-center gap-1.5">
                <span className="material-symbols-rounded text-[16px] text-iris" aria-hidden="true">check</span>
                {fact}
              </li>
            ))}
          </ul>

          <p className="border-t border-line pt-6 text-sm font-extralight text-ash">
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

        <Reveal delay={150} className="min-w-0">
          <section aria-labelledby="login-steps" className="flex flex-col gap-7 rounded-card border border-line p-6 sm:p-8">
            <h2 id="login-steps" className="label text-bone">
              Dari login ke request pertama
            </h2>

            <ol className="flex flex-col">
              {steps.map((step, i) => (
                <li key={step.title} className="relative grid grid-cols-[32px_minmax(0,1fr)] gap-4 pb-6 last:pb-0">
                  {i < steps.length - 1 && (
                    <span aria-hidden="true" className="absolute bottom-0 left-[15.5px] top-9 w-px bg-line-strong" />
                  )}
                  <span
                    aria-hidden="true"
                    className={`flex h-8 w-8 items-center justify-center rounded-pill border font-mono text-caption ${
                      i === 0 ? "border-iris bg-iris text-white" : "border-line-strong text-ash"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-1 pt-1">
                    <span className="text-base">{step.title}</span>
                    <span className="text-sm font-extralight leading-relaxed text-mist">{step.body}</span>
                  </div>
                </li>
              ))}
            </ol>

            <div className="flex flex-col gap-3">
              <span className="label">Contoh request pertama</span>
              <CodeBlock code={firstCall} className="!p-5 text-[13px]" />
            </div>
          </section>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
