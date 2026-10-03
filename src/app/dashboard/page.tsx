"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QuotaBar } from "@/components/dashboard/QuotaBar";
import { GeneratePanel } from "@/components/dashboard/GeneratePanel";
import { KeyList, type ApiKeyItem } from "@/components/dashboard/KeyList";
import { CodeExamples } from "@/components/dashboard/CodeExamples";
import { ViewOnceModal } from "@/components/ViewOnceModal";
import { CopyEndpoint } from "@/components/CopyEndpoint";
import { loadMember, type GuardResult } from "@/lib/guard";
import { DB, getSupabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [guardState, setGuardState] = useState<GuardResult | null>(null);
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [viewOnceKey, setViewOnceKey] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchKeys = useCallback(async () => {
    try {
      setLoadingKeys(true);
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from(DB.apiKeys)
        .select("id, name, key_prefix, is_active, created_at, last_used_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setKeys(data as ApiKeyItem[]);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingKeys(false);
    }
  }, []);

  useEffect(() => {
    loadMember()
      .then((res) => {
        setGuardState(res);
        if (res.state === "anon") {
          router.replace("/login");
        } else if (res.state === "approved") {
          fetchKeys();
        }
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router, fetchKeys]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const supabase = getSupabase();
      await supabase.auth.signOut();
      router.replace("/");
    } finally {
      setLoggingOut(false);
    }
  };

  // 1. Loading state
  if (!guardState || guardState.state === "anon") {
    return (
      <div className="flex min-h-screen flex-col bg-background text-text">
        <Navbar />
        <main className="flex flex-1 items-center justify-center p-6">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="material-symbols-rounded animate-spin text-sm text-accent">
              progress_activity
            </span>
            <span>Memverifikasi akun dan hak akses...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 2. Pending approval state
  if (guardState.state === "pending") {
    return (
      <div className="flex min-h-screen flex-col bg-background text-text">
        <Navbar />
        <main className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface-solid/80 p-7 text-center backdrop-blur-xl shadow-xl space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <span className="material-symbols-rounded text-2xl">pending</span>
            </div>
            <h2 className="text-lg font-bold text-text">Pendaftaran Menunggu Persetujuan</h2>
            <p className="text-xs text-text-muted leading-relaxed">
              Akun Anda telah terdaftar, namun status keanggotaan Anda saat ini masih dalam tahap peninjauan oleh pengurus komunitas MuaraAI.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://muaraai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto rounded-lg bg-surface-hover border border-stroke px-4 py-2 text-xs font-medium text-text hover:text-white transition-colors"
              >
                Kunjungi Portal Utama
              </a>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full sm:w-auto rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
              >
                Keluar
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 3. Rejected state
  if (guardState.state === "rejected") {
    return (
      <div className="flex min-h-screen flex-col bg-background text-text">
        <Navbar />
        <main className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface-solid/80 p-7 text-center backdrop-blur-xl shadow-xl space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <span className="material-symbols-rounded text-2xl">block</span>
            </div>
            <h2 className="text-lg font-bold text-text">Akses Belum Disetujui</h2>
            <p className="text-xs text-text-muted leading-relaxed">
              Mohon maaf, status keanggotaan Anda belum disetujui untuk mengakses gateway AI komunitas ini. Silakan hubungi pengurus divisi Anda.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-stroke bg-surface-hover px-4 py-2 text-xs font-medium text-text hover:text-white"
              >
                Keluar
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 4. Approved member dashboard
  const activeKey = keys.find((k) => k.is_active);

  return (
    <div className="flex min-h-screen flex-col bg-background text-text">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Member header card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-stroke bg-surface-solid p-5 sm:p-6 shadow-sm">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg sm:text-xl font-bold text-text">
                  Dashboard Anggota
                </h1>
                <span className="inline-flex items-center rounded-full border border-stroke bg-accent/20 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-on-accent capitalize">
                  {guardState.member.hierarchy}
                </span>
              </div>
              <p className="mt-1 text-xs text-text-muted">
                Selamat datang kembali, <strong className="text-text font-medium">{guardState.member.fullName}</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <CopyEndpoint />
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-stroke bg-surface px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-red-500 hover:border-red-500/30"
              >
                <span className="material-symbols-rounded text-sm">logout</span>
                <span>{loggingOut ? "Keluar..." : "Keluar"}</span>
              </button>
            </div>
          </div>

          {/* Quota overview */}
          <QuotaBar />

          {/* Key generation panel */}
          <GeneratePanel
            userId={guardState.member.id}
            hasActiveKey={Boolean(activeKey)}
            activeKeyId={activeKey?.id}
            onKeyCreated={(raw) => setViewOnceKey(raw)}
            onRefresh={fetchKeys}
          />

          {/* Key list table */}
          <KeyList
            keys={keys}
            loading={loadingKeys}
            onRefresh={fetchKeys}
          />

          {/* Code integration examples */}
          <CodeExamples />
        </div>
      </main>

      {/* View once modal when a key is newly generated */}
      {viewOnceKey && (
        <ViewOnceModal
          apiKey={viewOnceKey}
          onClose={() => setViewOnceKey(null)}
        />
      )}

      <Footer />
    </div>
  );
}
