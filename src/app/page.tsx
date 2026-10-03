import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopyEndpoint } from "@/components/CopyEndpoint";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-accent selection:text-accent-dark">
      <Navbar />

      <main className="flex-1 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="badge-dark mb-6">
              <span className="w-2 h-2 rounded-full bg-[#92EEFF] shadow-[0_0_8px_#92EEFF] animate-pulse" />
              <span>MUARA V1 FLASH GATEWAY</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.12] mb-6">
              Antarmuka REST API Cerdas untuk Komunitas MuaraAI.
            </h1>

            <p className="text-secondary text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              Akses independen berkecepatan tinggi ke model penalaran mutakhir dengan format standar OpenAI API. Disediakan khusus bagi mahasiswa FTI UBSI Pontianak untuk riset, karya, dan inovasi tanpa batas biaya.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-pill bg-accent hover:bg-accent-hover text-accent-dark font-semibold text-sm transition-all duration-200 ease-glass shadow-float"
              >
                Buat Kunci API
              </Link>
              <a
                href="https://github.com/MuaraAI"
                target="_blank"
                rel="noopener noreferrer"
                className="uw-button"
              >
                <span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub Org
                </span>
              </a>
            </div>

            {/* Copyable Base URL Banner */}
            <div className="flex justify-center">
              <CopyEndpoint />
            </div>

            {/* 4 Stat Cards */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-left">
              <div className="glass-card-3d px-4 py-3.5 text-xs font-mono text-secondary">
                <span className="text-accent-dark font-bold block text-lg mb-0.5">500k</span>
                Jendela Konteks
              </div>
              <div className="glass-card-3d px-4 py-3.5 text-xs font-mono text-secondary">
                <span className="text-accent-dark font-bold block text-lg mb-0.5">64k</span>
                Max Output Token
              </div>
              <div className="glass-card-3d px-4 py-3.5 text-xs font-mono text-secondary">
                <span className="text-accent-dark font-bold block text-lg mb-0.5">Sub-80ms</span>
                Overhead Edge
              </div>
              <div className="glass-card-3d px-4 py-3.5 text-xs font-mono text-secondary">
                <span className="text-accent-dark font-bold block text-lg mb-0.5">Zero Log</span>
                Privasi Prompt
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specs Strip */}
        <section className="border-b border-stroke bg-surface-solid/30 py-6">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
              <div>
                <span className="text-text-muted block text-[11px]">Protokol Gateway</span>
                <span className="font-semibold text-text font-mono mt-0.5 block">OpenAI REST + SSE</span>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Jendela Konteks</span>
                <span className="font-semibold text-text font-mono mt-0.5 block">500.000 Token</span>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Keluaran Maksimal</span>
                <span className="font-semibold text-text font-mono mt-0.5 block">64.000 Token</span>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Privasi Data</span>
                <span className="font-semibold text-accent-dark font-mono mt-0.5 block">Zero Prompt Logging</span>
              </div>
            </div>
          </div>
        </section>

        {/* Model Specification Table */}
        <section id="models" className="border-b border-stroke py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
                Spesifikasi Model Muara V1 Flash
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-text-muted">
                Tersedia 3 tingkat penalaran terkelola melalui endpoint tunggal
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-stroke bg-surface-solid">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stroke bg-surface text-text-muted">
                    <th className="py-3 px-4 font-semibold">Model Identifier</th>
                    <th className="py-3 px-4 font-semibold">Tingkat Penalaran</th>
                    <th className="py-3 px-4 font-semibold">Context / Max Out</th>
                    <th className="py-3 px-4 font-semibold">Karakteristik & Peruntukan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-accent-dark">
                      muara-v1-flash-low
                    </td>
                    <td className="py-3.5 px-4 text-text font-medium">Rendah (Cepat)</td>
                    <td className="py-3.5 px-4 font-mono text-text-muted">500k / 64k</td>
                    <td className="py-3.5 px-4 text-text-muted">
                      Latensi terendah (2-3 detik). Percakapan interaktif, perangkuman, dan otomatisasi skrip ringan.
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-accent-dark">
                      muara-v1-flash-medium
                    </td>
                    <td className="py-3.5 px-4 text-text font-medium">Sedang (Seimbang)</td>
                    <td className="py-3.5 px-4 font-mono text-text-muted">500k / 64k</td>
                    <td className="py-3.5 px-4 text-text-muted">
                      Kecepatan dan penalaran proporsional (4-5 detik). Analisis dokumen, ekstraksi data, dan riset teks.
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-accent-dark">
                      muara-v1-flash-high
                    </td>
                    <td className="py-3.5 px-4 text-text font-medium">Tinggi (Mendalam)</td>
                    <td className="py-3.5 px-4 font-mono text-text-muted">500k / 64k</td>
                    <td className="py-3.5 px-4 text-text-muted">
                      Penalaran penuh tanpa kompromi. Pemecahan logika rumit, coding arsitektur besar, dan audit kode sistem.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Rate Limits per Role Table */}
        <section className="py-16 sm:py-20 border-t border-white/10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
                Batas Penggunaan Berdasarkan Peran
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-text-muted">
                Kuota otomatis diberikan berdasarkan status keanggotaan aktif Anda di komunitas
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-stroke bg-surface-solid">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stroke bg-surface text-text-muted">
                    <th className="py-3 px-4 font-semibold">Peran Komunitas</th>
                    <th className="py-3 px-4 font-semibold">Batas / Menit</th>
                    <th className="py-3 px-4 font-semibold">Batas / 5 Jam</th>
                    <th className="py-3 px-4 font-semibold">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-text">
                      <span className="inline-block rounded bg-background border border-stroke px-2 py-0.5 text-xs font-mono text-text">
                        contributor
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-accent-dark font-medium">10 request</td>
                    <td className="py-3.5 px-4 font-mono text-accent-dark font-medium">150 request</td>
                    <td className="py-3.5 px-4 text-xs text-text-muted">Anggota biasa, proyek kuliah & eksplorasi</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-text">
                      <span className="inline-block rounded bg-background border border-stroke px-2 py-0.5 text-xs font-mono text-text">
                        head
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-accent-dark font-medium">20 request</td>
                    <td className="py-3.5 px-4 font-mono text-accent-dark font-medium">300 request</td>
                    <td className="py-3.5 px-4 text-xs text-text-muted">Ketua divisi (Builder / Creative)</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-text">
                      <span className="inline-block rounded bg-background border border-stroke px-2 py-0.5 text-xs font-mono text-text">
                        lead
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-accent-dark font-medium">40 request</td>
                    <td className="py-3.5 px-4 font-mono text-accent-dark font-medium">600 request</td>
                    <td className="py-3.5 px-4 text-xs text-text-muted">Lead project & koordinator inisiatif</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-text">
                      <span className="inline-block rounded bg-accent/20 border border-stroke px-2 py-0.5 text-xs font-mono text-on-accent font-semibold">
                        maintainer
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-accent-dark font-bold">80 request</td>
                    <td className="py-3.5 px-4 font-mono text-accent-dark font-bold">1.200 request</td>
                    <td className="py-3.5 px-4 text-xs text-text-muted">Pengurus inti & pengelola infrastruktur</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Quickstart Section */}
        <section id="quickstart" className="border-b border-stroke py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
                Contoh Pemanggilan Cepat
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-text-muted">
                Dapat langsung digunakan pada pustaka OpenAI resmi tanpa instalasi SDK tambahan
              </p>
            </div>

            <div className="rounded-xl border border-stroke bg-code-bg p-5 font-mono text-xs text-code-text overflow-x-auto shadow-lg">
              <pre className="leading-relaxed">
                <code>{`from openai import OpenAI

client = OpenAI(
    base_url="https://api.muaraai.com/v1/ai",
    api_key="muara_ai_YOUR_KEY"
)

response = client.chat.completions.create(
    model="muara-v1-flash-high",
    messages=[
        {"role": "user", "content": "Jelaskan arsitektur Transformer secara ringkas"}
    ],
    stream=True
)

for chunk in response:
    print(chunk.choices[0].delta.content or "", end="", flush=True)
print()`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Community Info Banner */}
        <section className="py-16 sm:py-20 bg-surface-solid/30">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="rounded-2xl border border-stroke bg-surface-solid p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-xl">
                <h3 className="text-base sm:text-lg font-bold text-text">
                  Komunitas MuaraAI
                </h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  MuaraAI adalah wadah komunitas mahasiswa Fakultas Teknik dan Informatika UBSI Pontianak yang berfokus pada kolaborasi praktis rekayasa perangkat lunak dan kecerdasan buatan.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="https://muaraai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-stroke bg-surface-hover px-4 py-2 text-xs font-medium text-text hover:text-white transition-colors"
                >
                  Portal Komunitas
                </a>
                <Link
                  href="/login"
                  className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-on-accent hover:bg-accent-hover transition-colors"
                >
                  Masuk Sekarang
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
