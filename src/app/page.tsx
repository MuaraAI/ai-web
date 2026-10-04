import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopyButton } from "@/components/CopyButton";
import { CopyEndpoint } from "@/components/CopyEndpoint";
import { CodeBlock } from "@/components/CodeBlock";
import { HomeMotion } from "@/components/HomeMotion";
import { LiveStats } from "@/components/LiveStats";
import { TypeCycle } from "@/components/TypeCycle";

const heroWords = ["ide", "riset", "karya", "kode"];

const quickstartCode = `from openai import OpenAI

client = OpenAI(
    base_url="https://api.muaraai.com/v1/ai",
    api_key="muara_ai_YOUR_KEY"
)

response = client.chat.completions.create(
    model="muara-v1-flash-high",
    messages=[
        {"role": "user",
         "content": "Jelaskan arsitektur Transformer secara ringkas"}
    ],
    stream=True
)

for chunk in response:
    print(chunk.choices[0].delta.content or "", end="", flush=True)
print()`;

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

const useCases = [
  {
    icon: "sync",
    title: "Tugas & riset kuliah",
    description:
      "Ringkas paper, wawancara materi, dan susun draft laporan. Kuota Contributor 150 request per 5 jam cukup untuk satu pekan pengerjaan tugas.",
  },
  {
    icon: "check",
    title: "Coding & proyek tim",
    description:
      "Debug, refactor, dan audit kode lewat `muara-v1-flash-high`. Cocok untuk proyek divisional Builder dan Creative yang jalan tiap semester.",
  },
  {
    icon: "arrow_forward",
    title: "Bot & otomatisasi",
    description:
      "Format OpenAI API berarti bot Discord, assistant Telegram, dan skrip batch tinggal ganti base URL. Streaming SSE didukung penuh.",
  },
];

const faqs = [
  {
    q: "Berapa biaya pemakaian gateway?",
    a: "Nol. Gateway disediakan non-komersial untuk anggota komunitas MuaraAI dari FTI UBSI Pontianak. Kuota ditegakkan otomatis lewat penghitung request per peran, bukan pembayaran.",
  },
  {
    q: "Bagaimana cara mendapatkan kunci API?",
    a: "Masuk lewat akun komunitas di halaman login, lalu buat kunci di dashboard. Kunci berformat muara_ai_... dan bisa dicabut kapan pun dari daftar kunci.",
  },
  {
    q: "Apakah percakapan saya disimpan?",
    a: "Tidak. Prompt dan keluaran langsung di-stream tanpa dicatat. Sistem hanya menyimpan penghitung request untuk menegakkan kuota per peran.",
  },
  {
    q: "Apa bedanya low, medium, dan high?",
    a: "Ketiganya satu model yang sama dengan kedalaman penalaran berbeda. Low untuk latensi tercepat 2-3 detik, medium seimbang 4-5 detik, dan high tanpa batas kedalaman untuk logika rumit dan audit kode.",
  },
  {
    q: "SDK atau framework apa saja yang didukung?",
    a: "Semua yang bicara protokol OpenAI: pustaka resmi Python dan TypeScript, LangChain, Vercel AI SDK, OpenWebUI, sampai tooling CLI seperti aichat. Cukup arahkan base URL ke endpoint gateway.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details data-rise data-reveal className="group border-t border-line last:border-b">
      <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 py-4 text-[15px] font-normal text-bone transition-colors hover:text-saffron sm:text-base [&::-webkit-details-marker]:hidden">
        {q}
        <span className="material-symbols-rounded shrink-0 text-ash transition-transform duration-200 group-open:rotate-45" aria-hidden="true">
          add
        </span>
      </summary>
      <p className="max-w-[760px] pb-4 text-[14px] font-extralight leading-relaxed text-mist sm:pb-5 sm:text-[15px]">{a}</p>
    </details>
  );
}

function ArrowUpRight() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <Navbar />

      <main data-home className="relative flex-1 overflow-x-hidden">
        <HomeMotion />

        {/* Page progress, just under the sticky navbar */}
        <div
          data-progress
          aria-hidden="true"
          className="fixed inset-x-0 top-16 z-40 h-0.5 origin-left scale-x-0 bg-iris motion-reduce:hidden"
        />

        {/* Hero */}
        <section
          data-hero
          className="container-page grid items-center gap-12 pb-20 pt-10 sm:pt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-15 lg:pb-24"
        >
          <div data-hero-copy className="flex flex-col gap-7">
            <h1 className="text-[clamp(2.5rem,4.9vw,4.5rem)] leading-[1] tracking-[-0.04em]">
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-hero-line data-reveal className="block">
                  Setiap aliran
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-hero-line data-reveal className="block">
                  <span className="sr-only">ide</span>
                  <TypeCycle words={heroWords} className="text-saffron" />
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-hero-line data-reveal className="block">
                  bermuara di sini.
                </span>
              </span>
            </h1>

            <p data-hero-fade data-reveal className="max-w-[500px] text-body font-extralight text-mist">
              Gateway AI komunitas MuaraAI: satu endpoint berformat OpenAI API menuju model penalaran mutakhir. Disediakan khusus bagi mahasiswa FTI UBSI Pontianak untuk riset, karya, dan inovasi tanpa biaya.
            </p>

            <div data-hero-fade data-reveal className="flex flex-wrap items-center gap-x-7.5 gap-y-3">
              <Link href="/login" className="btn-primary">
                Buat Kunci API
              </Link>
              <a href="https://github.com/MuaraAI" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                GitHub Org
                <ArrowUpRight />
              </a>
            </div>

            <div data-hero-fade data-reveal>
              <CopyEndpoint />
            </div>
          </div>

          <div data-hero-stats data-reveal>
            <div data-hero-stats-inner>
              <LiveStats />
            </div>
          </div>
        </section>

        <div data-thread className="relative">
          {/* Reading thread that ties the sections together on wide screens */}
          <div aria-hidden="true" className="thread pointer-events-none absolute bottom-24 top-0 hidden w-px bg-line-strong min-[1400px]:block">
            <div data-thread-fill className="h-full w-full origin-top scale-y-0 bg-iris motion-reduce:scale-y-100" />
          </div>

          {/* Models & limits */}
          <section id="models" data-section className="container-page relative pb-24">
            <span data-node aria-hidden="true" className="thread-node absolute top-2 hidden h-[9px] w-[9px] rounded-pill border border-line-strong bg-void transition-[transform,background-color,border-color] duration-300 min-[1400px]:block" />
            <div className="flex flex-col gap-5 pb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-15">
              <div className="flex flex-col gap-5">
                <span className="eyebrow">01 · Model &amp; batas</span>
                <h2 data-split data-reveal className="max-w-[640px] text-heading-sm">
                  Tiga tingkat penalaran. Kuota mengikuti peran.
                </h2>
              </div>
              <p className="max-w-[420px] text-base font-extralight leading-relaxed text-mist">
                Semua tingkat berbagi jendela konteks 500k dan keluaran 64k token lewat protokol OpenAI REST + SSE. Batas request diberikan otomatis sesuai keanggotaan aktif.
              </p>
            </div>

            <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-15">
              <ol data-rise-group className="border-b border-line">
                {models.map((m, i) => (
                  <li key={m.id} data-rise data-reveal className="grid grid-cols-[40px_minmax(0,1fr)] gap-4 border-t border-line py-5">
                    <span className="pt-1 font-mono text-sm text-ash">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4.5 gap-y-1">
                        <span className="-my-2.5 flex min-w-0 items-center gap-1">
                          <code className="select-all break-all font-mono text-base text-bone sm:text-lg">{m.id}</code>
                          <CopyButton text={m.id} label={`Salin ID model ${m.id}`} className="shrink-0" />
                        </span>
                        <span className={`label ${m.highlight ? "text-saffron" : ""}`}>{m.tier}</span>
                      </div>
                      <p className="text-[15px] font-extralight leading-relaxed text-mist">{m.description}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <table data-rise-group className="w-full text-left">
                <caption className="sr-only">Batas request per peran</caption>
                <thead>
                  <tr className="label">
                    <th scope="col" className="pb-3 font-semibold">Peran</th>
                    <th scope="col" className="pb-3 font-semibold">Per menit</th>
                    <th scope="col" className="pb-3 font-semibold">Per 5 jam</th>
                  </tr>
                </thead>
                <tbody className="border-b border-line">
                  {roles.map((r) => (
                    <tr key={r.role} data-rise data-reveal className="border-t border-line align-baseline">
                      <th scope="row" className="py-4 pr-4.5 font-normal">
                        <span className={`block text-lg ${r.highlight ? "text-saffron" : ""}`}>{r.role}</span>
                        <span className="mt-0.5 block text-sm font-extralight text-ash">{r.note}</span>
                      </th>
                      <td className="py-4 pr-4.5 font-mono text-base">{r.perMinute}</td>
                      <td className="py-4 font-mono text-base">{r.perWindow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quickstart */}
          <section
            id="quickstart"
            data-section
            className="container-page relative grid items-center gap-10 pb-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-15"
          >
            <span data-node aria-hidden="true" className="thread-node absolute top-2 hidden h-[9px] w-[9px] rounded-pill border border-line-strong bg-void transition-[transform,background-color,border-color] duration-300 min-[1400px]:block" />
            <div className="flex flex-col gap-5">
              <span className="eyebrow">02 · Quickstart</span>
              <h2 data-split data-reveal className="text-heading-sm">
                Langsung jalan di SDK OpenAI.
              </h2>
              <p className="max-w-[420px] text-base font-extralight leading-relaxed text-mist">
                Ganti base URL dan kunci API. Dapat langsung digunakan pada pustaka OpenAI resmi tanpa instalasi SDK tambahan.
              </p>
            </div>

            <div data-unroll data-reveal className="min-w-0">
              <CodeBlock code={quickstartCode} />
            </div>
          </section>

          {/* Use cases */}
          <section id="use-cases" data-section className="container-page relative pb-24">
            <span data-node aria-hidden="true" className="thread-node absolute top-2 hidden h-[9px] w-[9px] rounded-pill border border-line-strong bg-void transition-[transform,background-color,border-color] duration-300 min-[1400px]:block" />
            <div className="flex flex-col gap-5 pb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-15">
              <div className="flex flex-col gap-5">
                <span className="eyebrow">03 · Untuk apa saja</span>
                <h2 data-split data-reveal className="max-w-[640px] text-heading-sm">
                  Satu gateway, tiga kebiasaan.
                </h2>
              </div>
              <p className="max-w-[420px] text-base font-extralight leading-relaxed text-mist">
                Dari tugas kuliah sampai bot produksi divisi. Semua lewat satu base URL dengan format yang sudah dikenal.
              </p>
            </div>

            <div data-rise-group className="grid gap-px border border-line bg-line sm:grid-cols-3">
              {useCases.map((u) => (
                <article key={u.title} data-rise data-reveal className="flex flex-col gap-2 bg-void px-4.5 py-4 sm:gap-3 sm:p-6">
                  <h3 className="flex items-center gap-2.5 text-base font-normal text-bone sm:text-lg">
                    <span className="material-symbols-rounded shrink-0 text-saffron" aria-hidden="true">
                      {u.icon}
                    </span>
                    {u.title}
                  </h3>
                  <p className="text-[15px] font-extralight leading-relaxed text-mist">{u.description}</p>
                </article>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" data-section className="container-page relative pb-24">
            <span data-node aria-hidden="true" className="thread-node absolute top-2 hidden h-[9px] w-[9px] rounded-pill border border-line-strong bg-void transition-[transform,background-color,border-color] duration-300 min-[1400px]:block" />
            <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-15">
              <div className="flex flex-col gap-4">
                <span className="eyebrow">04 · FAQ</span>
                <h2 data-split data-reveal className="max-w-[480px] text-heading-sm">
                  Yang paling sering ditanyakan.
                </h2>
                <p className="max-w-[420px] text-[15px] font-extralight leading-relaxed text-mist">
                  Belum ketemu jawabannya? Tanya langsung di kanal komunitas MuaraAI.
                </p>
              </div>
              <div data-rise-group>
                {faqs.map((f) => (
                  <FaqItem key={f.q} q={f.q} a={f.a} />
                ))}
              </div>
            </div>
          </section>

          {/* Community */}
          <section data-section className="container-page relative pb-24">
            <span data-node aria-hidden="true" className="thread-node absolute top-2 hidden h-[9px] w-[9px] rounded-pill border border-line-strong bg-void transition-[transform,background-color,border-color] duration-300 min-[1400px]:block" />
            <div className="flex flex-col gap-6 border-t border-line pt-12 lg:flex-row lg:items-end lg:justify-between lg:gap-15">
              <div className="flex flex-col gap-5">
                <span className="eyebrow">05 · Komunitas MuaraAI</span>
                <h2 data-split data-reveal className="max-w-[760px] text-heading-lg">
                  Dibangun mahasiswa, untuk mahasiswa.
                </h2>
                <p className="max-w-[560px] text-base font-extralight leading-relaxed text-mist">
                  Wadah komunitas mahasiswa Fakultas Teknik dan Informatika UBSI Pontianak untuk kolaborasi praktis rekayasa perangkat lunak dan kecerdasan buatan.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-7.5 gap-y-2">
                <a href="https://muaraai.com" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  Portal Komunitas
                  <ArrowUpRight />
                </a>
                <Link href="/login" className="btn-ghost text-ash">
                  Masuk sekarang
                  <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
