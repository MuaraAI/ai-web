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
import { Reveal } from "@/components/Reveal";
import { loadMember, type GuardResult } from "@/lib/guard";
import { DB, getSupabase } from "@/lib/supabase";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

function StatusNotice({
  eyebrow,
  eyebrowClass = "text-saffron",
  title,
  children,
}: {
  eyebrow: string;
  eyebrowClass?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 items-center justify-center px-6 pb-30 pt-15">
      <Reveal className="flex w-full max-w-[560px] flex-col gap-6">
        <span className={`eyebrow ${eyebrowClass}`}>{eyebrow}</span>
        <h1 className="text-heading-sm">{title}</h1>
        {children}
      </Reveal>
    </main>
  );
}

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

  const logoutButton = (
    <button type="button" onClick={handleLogout} disabled={loggingOut} className="btn-quiet">
      <span className="material-symbols-rounded" aria-hidden="true">logout</span>
      <span>{loggingOut ? "Keluar..." : "Keluar"}</span>
    </button>
  );

  // 1. Loading state
  if (!guardState || guardState.state === "anon") {
    return (
      <Shell>
        <main className="flex flex-1 items-center justify-center p-6">
          <p className="flex items-center gap-2 text-sm text-ash">
            <span className="material-symbols-rounded animate-spin text-iris" aria-hidden="true">
              progress_activity
            </span>
            Memverifikasi akun dan hak akses...
          </p>
        </main>
      </Shell>
    );
  }

  // 2. Pending approval state
  if (guardState.state === "pending") {
    return (
      <Shell>
        <StatusNotice eyebrow="Menunggu persetujuan" title="Pendaftaran sedang ditinjau.">
          <p className="text-body font-extralight text-mist">
            Akun Anda telah terdaftar, namun status keanggotaan Anda masih dalam tahap peninjauan oleh pengurus komunitas MuaraAI.
          </p>
          <div className="flex flex-wrap items-center gap-7.5">
            <a href="https://muaraai.com" target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Kunjungi portal utama
            </a>
            {logoutButton}
          </div>
        </StatusNotice>
      </Shell>
    );
  }

  // 3. Rejected state
  if (guardState.state === "rejected") {
    return (
      <Shell>
        <StatusNotice eyebrow="Akses ditolak" eyebrowClass="text-ember" title="Akses belum disetujui.">
          <p className="text-body font-extralight text-mist">
            Mohon maaf, status keanggotaan Anda belum disetujui untuk mengakses gateway AI komunitas ini. Silakan hubungi pengurus divisi Anda.
          </p>
          <div>{logoutButton}</div>
        </StatusNotice>
      </Shell>
    );
  }

  // 4. Approved member dashboard
  const activeKey = keys.find((k) => k.is_active);

  return (
    <Shell>
      <main className="flex-1">
        <div className="container-page flex flex-col gap-24 pb-30 pt-10 sm:gap-30 sm:pt-15">
          {/* Greeting */}
          <Reveal className="flex flex-wrap items-end justify-between gap-9">
            <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-6">
              <span className="eyebrow">
                Dashboard anggota · <span className="capitalize">{guardState.member.hierarchy}</span>
              </span>
              <h1 className="text-heading-lg">Selamat datang kembali, {guardState.member.fullName}.</h1>
            </div>
            <div className="flex flex-col items-start gap-1">
              <CopyEndpoint />
              {logoutButton}
            </div>
          </Reveal>

          <Reveal>
            <QuotaBar />
          </Reveal>

          <Reveal>
            <GeneratePanel
              userId={guardState.member.id}
              hasActiveKey={Boolean(activeKey)}
              activeKeyId={activeKey?.id}
              onKeyCreated={(raw) => setViewOnceKey(raw)}
              onRefresh={fetchKeys}
            />
          </Reveal>

          <Reveal>
            <KeyList keys={keys} loading={loadingKeys} onRefresh={fetchKeys} />
          </Reveal>

          <Reveal>
            <CodeExamples />
          </Reveal>
        </div>
      </main>

      {/* View once modal when a key is newly generated */}
      {viewOnceKey && <ViewOnceModal apiKey={viewOnceKey} onClose={() => setViewOnceKey(null)} />}
    </Shell>
  );
}
