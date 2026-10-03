import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopyEndpoint } from "@/components/CopyEndpoint";
import { CodeBlock } from "@/components/CodeBlock";
import { Reveal } from "@/components/Reveal";
import { ShapeField } from "@/components/ShapeField";
import { TypeCycle } from "@/components/TypeCycle";

const heroWords = ["ide", "riset", "karya", "kode"];

const quickstartCode = `from openai import OpenAI

client = OpenAI(
    base_url="https://api.muaraai.com/v1/ai",
    api_key="muara_ai_YOUR_KEY"
)

response = client.chat.completions.create(
    model="muara-v1-flash-high",
    messages=[{"role": "user",
               "content": "Jelaskan arsitektur Transformer"}],
    stream=True
)

for chunk in response:
    print(chunk.choices[0].delta.content or "", end="")`;

const stats = [
  { value: "500k", label: "Jendela konteks" },
  { value: "64k", label: "Token keluaran" },
  { value: "<80ms", label: "Overhead edge" },
  { value: "Zero log", label: "Privasi prompt" },
];

const models = [
  { id: "muara-v1-flash-low", tier: "Cepat · 2–3 dtk", description: "Percakapan interaktif, perangkuman, skrip ringan." },
  { id: "muara-v1-flash-medium", tier: "Seimbang · 4–5 dtk", description: "Analisis dokumen, ekstraksi data, riset teks." },
  { id: "muara-v1-flash-high", tier: "Mendalam", description: "Logika rumit, arsitektur kode besar, audit sistem.", highlight: true },
];

const roles = [
  { role: "Contributor", perMinute: "10", perWindow: "150" },
  { role: "Head", perMinute: "20", perWindow: "300" },
  { role: "Lead", perMinute: "40", perWindow: "600" },
  { role: "Maintainer", perMinute: "80", perWindow: "1.200", highlight: true },
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
    <div className="relative isolate flex min-h-screen flex-col">
      {/* anime.js background: dots regroup into each section's shape as it scrolls into view. */}
      <ShapeField fallback="stream" />
      <Navbar />

      <main className="flex-1">
        {/* Hero — river into delta */}
        <section data-formation="stream" className="container-page flex min-h-[calc(100svh-80px)] flex-col justify-center gap-12 py-15">
          <div className="flex max-w-[720px] flex-col gap-7">
            <Reveal>
              <h1 className="text-display">
                <span className="block">Setiap aliran</span>
                <span className="sr-only">ide</span>
                <span className="block">
                  <TypeCycle words={heroWords} className="text-gradient" />
                </span>
                <span className="block">bermuara di sini.</span>
              </h1>
            </Reveal>
            <Reveal delay={100}>
              <p className="max-w-[520px] text-body font-extralight text-soft">
                Gateway AI komunitas MuaraAI: satu endpoint berformat OpenAI API menuju model penalaran mutakhir, gratis untuk mahasiswa FTI UBSI Pontianak.
              </p>
            </Reveal>
            <Reveal delay={180} className="flex flex-wrap items-center gap-4">
              <Link href="/login" className="btn-primary">
                Buat Kunci API
              </Link>
              <Link href="/#quickstart" className="btn-secondary">
                <span className="material-symbols-rounded" aria-hidden="true">terminal</span>
                Lihat Quickstart
              </Link>
            </Reveal>
            <Reveal delay={240}>
              <CopyEndpoint />
            </Reveal>
          </div>

          <Reveal delay={320}>
            <dl className="grid max-w-[640px] grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse gap-1">
                  <dt className="text-sm text-muted">{s.label}</dt>
                  <dd className="text-heading-2xs">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </section>

        {/* Models & limits — quota bars */}
        <section id="models" data-formation="bars" className="container-page py-24">
          <div className="flex max-w-[640px] flex-col gap-9">
            <Reveal className="flex flex-col gap-4">
              <span className="eyebrow">Model &amp; Limit</span>
              <h2 className="text-heading-sm">Tiga tingkat penalaran, kuota sesuai peran.</h2>
              <p className="text-body font-extralight text-soft">
                Satu endpoint OpenAI REST + SSE. Semua model berbagi konteks 500k dan keluaran 64k token.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <ul className="border-b border-line">
                {models.map((m) => (
                  <li key={m.id} className="flex flex-col gap-1 border-t border-line py-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <code className="font-mono text-base text-ink">{m.id}</code>
                      <span className={`label ${m.highlight ? "text-saffron" : ""}`}>{m.tier}</span>
                    </div>
                    <p className="text-sm font-extralight text-soft">{m.description}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={160}>
              <table className="w-full text-left">
                <caption className="label pb-3 text-left">Batas request per peran</caption>
                <thead>
                  <tr className="text-caption uppercase tracking-[0.025em] text-muted">
                    <th scope="col" className="pb-2 font-semibold">Peran</th>
                    <th scope="col" className="pb-2 font-semibold">Per menit</th>
                    <th scope="col" className="pb-2 font-semibold">Per 5 jam</th>
                  </tr>
                </thead>
                <tbody className="border-b border-line">
                  {roles.map((r) => (
                    <tr key={r.role} className="border-t border-line">
                      <th scope="row" className={`py-3 font-normal ${r.highlight ? "text-saffron" : ""}`}>{r.role}</th>
                      <td className="py-3 font-mono">{r.perMinute}</td>
                      <td className="py-3 font-mono">{r.perWindow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </section>

        {/* Quickstart — </> */}
        <section id="quickstart" data-formation="code" className="container-page py-24">
          <div className="flex max-w-[640px] flex-col gap-9">
            <Reveal className="flex flex-col gap-4">
              <span className="eyebrow">Quickstart</span>
              <h2 className="text-heading-sm">Langsung jalan di SDK OpenAI.</h2>
              <p className="text-body font-extralight text-soft">Ganti base URL dan kunci API. Tanpa SDK tambahan.</p>
            </Reveal>
            <Reveal delay={100}>
              <CodeBlock code={quickstartCode} />
            </Reveal>
          </div>
        </section>

        {/* Community — a ring of people */}
        <section data-formation="ring" className="container-page pb-30 pt-24">
          <Reveal className="flex max-w-[640px] flex-col gap-6">
            <span className="eyebrow">Komunitas MuaraAI</span>
            <h2 className="text-heading-lg">Dibangun mahasiswa, untuk mahasiswa.</h2>
            <p className="text-body font-extralight text-soft">
              Wadah mahasiswa Fakultas Teknik dan Informatika UBSI Pontianak untuk kolaborasi praktis rekayasa perangkat lunak dan kecerdasan buatan.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://muaraai.com" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Portal Komunitas
                <ArrowUpRight />
              </a>
              <Link href="/login" className="btn-ghost px-2">
                Masuk sekarang
                <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
