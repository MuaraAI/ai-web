import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopyEndpoint } from "@/components/CopyEndpoint";
import { Constellation } from "@/components/Constellation";
import { CodeBlock } from "@/components/CodeBlock";

const quickstartCode = `from openai import OpenAI

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
print()`;

const stats = [
  { value: "500k", label: "Jendela konteks token" },
  { value: "64k", label: "Maksimal token keluaran" },
  { value: "<80ms", label: "Overhead edge gateway" },
  { value: "Zero log", label: "Prompt tidak pernah disimpan" },
];

const models = [
  {
    id: "muara-v1-flash-low",
    tier: "Rendah · 2–3 dtk",
    description: "Latensi terendah. Percakapan interaktif, perangkuman, dan otomatisasi skrip ringan.",
  },
  {
    id: "muara-v1-flash-medium",
    tier: "Seimbang · 4–5 dtk",
    description: "Kecepatan dan penalaran proporsional. Analisis dokumen, ekstraksi data, dan riset teks.",
  },
  {
    id: "muara-v1-flash-high",
    tier: "Mendalam · penuh",
    description: "Penalaran penuh tanpa kompromi. Logika rumit, coding arsitektur besar, dan audit kode sistem.",
    highlight: true,
  },
];

const roles = [
  { role: "Contributor", note: "Anggota biasa, proyek kuliah & eksplorasi", perMinute: "10", perWindow: "150" },
  { role: "Head", note: "Ketua divisi Builder / Creative", perMinute: "20", perWindow: "300" },
  { role: "Lead", note: "Lead project & koordinator inisiatif", perMinute: "40", perWindow: "600" },
  { role: "Maintainer", note: "Pengurus inti & pengelola infrastruktur", perMinute: "80", perWindow: "1.200", highlight: true },
];

function ArrowUpRight() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 overflow-x-hidden">
        {/* Hero */}
        <section className="container-page grid items-center gap-9 pb-24 pt-10 sm:pt-15 lg:grid-cols-2">
          <div className="relative z-10 flex flex-col gap-7.5">
            <span className="eyebrow">Muara V1 Flash Gateway</span>
            <h1 className="text-display">Gateway AI untuk komunitas MuaraAI.</h1>
            <p className="max-w-[480px] text-body font-extralight">
              Akses berkecepatan tinggi ke model penalaran mutakhir dengan format standar OpenAI API. Disediakan khusus bagi mahasiswa FTI UBSI Pontianak untuk riset, karya, dan inovasi tanpa biaya.
            </p>
            <div className="flex flex-wrap items-center gap-7.5">
              <Link href="/login" className="btn-primary">
                Buat Kunci API
              </Link>
              <a href="https://github.com/MuaraAI" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                GitHub Org
                <ArrowUpRight />
              </a>
            </div>
            <CopyEndpoint />
          </div>

          <Constellation className="aspect-[5/4] w-full" />
        </section>

        {/* Key figures */}
        <section aria-label="Spesifikasi utama" className="container-page pb-30">
          <dl className="grid grid-cols-2 gap-9 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-1.5">
                <dt className="text-sm text-ash">{s.label}</dt>
                <dd className="text-[clamp(2.25rem,4vw,3rem)] leading-[1.1] tracking-[-0.035em]">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Models */}
        <section id="models" className="container-page grid items-start gap-15 pb-30 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <span className="eyebrow">Model</span>
            <h2 className="text-heading-lg">Tiga tingkat penalaran. Satu endpoint.</h2>
            <p className="max-w-[440px] text-body font-extralight text-mist">
              Pilih kedalaman berpikir sesuai tugas. Semua tingkat berbagi jendela konteks 500k dan keluaran 64k token, melalui protokol OpenAI REST + SSE.
            </p>
          </div>

          <ol className="border-b border-line">
            {models.map((m, i) => (
              <li key={m.id} className="grid grid-cols-[48px_minmax(0,1fr)] gap-4.5 border-t border-line py-7.5">
                <span className="pt-1 font-mono text-sm text-ash">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4.5 gap-y-1.5">
                    <code className="font-mono text-lg text-bone">{m.id}</code>
                    <span className={`label ${m.highlight ? "text-saffron" : ""}`}>{m.tier}</span>
                  </div>
                  <p className="text-base font-extralight leading-relaxed text-mist">{m.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Rate limits — zigzag: data left, copy right */}
        <section className="container-page grid items-start gap-15 pb-30 lg:grid-cols-2">
          <div className="flex flex-col gap-6 lg:order-2">
            <span className="eyebrow">Batas penggunaan</span>
            <h2 className="text-heading-lg">Kuota mengikuti peran Anda.</h2>
            <p className="max-w-[440px] text-body font-extralight text-mist">
              Batas request diberikan otomatis berdasarkan status keanggotaan aktif Anda di komunitas.
            </p>
          </div>

          <div className="lg:order-1">
            <table className="w-full text-left">
              <thead>
                <tr className="label">
                  <th scope="col" className="pb-3 font-semibold">Peran</th>
                  <th scope="col" className="pb-3 font-semibold">Per menit</th>
                  <th scope="col" className="pb-3 font-semibold">Per 5 jam</th>
                </tr>
              </thead>
              <tbody className="border-b border-line">
                {roles.map((r) => (
                  <tr key={r.role} className="border-t border-line align-baseline">
                    <th scope="row" className="py-6 pr-4.5 font-normal">
                      <span className={`block text-heading-2xs ${r.highlight ? "text-saffron" : ""}`}>{r.role}</span>
                      <span className="mt-1 block text-sm font-extralight text-ash">{r.note}</span>
                    </th>
                    <td className="py-6 pr-4.5 font-mono text-lg">{r.perMinute}</td>
                    <td className="py-6 font-mono text-lg">{r.perWindow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quickstart */}
        <section id="quickstart" className="container-page grid items-center gap-15 pb-30 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex flex-col gap-6">
            <span className="eyebrow">Quickstart</span>
            <h2 className="text-heading-lg">Langsung jalan di SDK OpenAI.</h2>
            <p className="max-w-[420px] text-body font-extralight text-mist">
              Ganti base URL dan kunci API. Dapat langsung digunakan pada pustaka OpenAI resmi tanpa instalasi SDK tambahan.
            </p>
          </div>

          <CodeBlock code={quickstartCode} />
        </section>

        {/* Community */}
        <section className="container-page flex flex-col gap-7.5 pb-30 pt-15">
          <span className="eyebrow">Komunitas MuaraAI</span>
          <h2 className="max-w-[1000px] text-display">Dibangun mahasiswa, untuk mahasiswa.</h2>
          <p className="max-w-[560px] text-body font-extralight">
            MuaraAI adalah wadah komunitas mahasiswa Fakultas Teknik dan Informatika UBSI Pontianak yang berfokus pada kolaborasi praktis rekayasa perangkat lunak dan kecerdasan buatan.
          </p>
          <div className="flex flex-wrap gap-7.5">
            <a href="https://muaraai.com" target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Portal Komunitas
              <ArrowUpRight />
            </a>
            <Link href="/login" className="btn-ghost text-ash">
              Masuk sekarang
              <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
