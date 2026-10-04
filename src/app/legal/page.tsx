import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Legal | Muara AI",
  description:
    "Disclaimer dan kebijakan privasi gateway AI komunitas MuaraAI.",
};

export default function LegalPage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="container-page flex flex-col gap-9 pb-24 pt-16">
          <div className="flex flex-col gap-5">
            <span className="eyebrow">Legal</span>
            <h1 className="text-heading-sm">Disclaimer &amp; privasi data.</h1>
          </div>

          <div className="flex max-w-[760px] flex-col gap-9">
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-normal text-bone">Disclaimer</h2>
              <p className="text-[15px] font-extralight leading-relaxed text-mist">
                Muara V1 Flash adalah gateway independen non-komersial untuk
                keperluan riset dan pembelajaran anggota komunitas MuaraAI.
                Layanan diabstraksikan melalui lapisan proksi komunitas dan
                tidak berafiliasi resmi dengan penyedia model dasar.
                Disediakan apa adanya tanpa jaminan ketersediaan komersial.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-normal text-bone">Privasi data</h2>
              <p className="text-[15px] font-extralight leading-relaxed text-mist">
                Konten percakapan dan prompt anggota tidak pernah dicatat atau
                disimpan (hanya di-stream langsung). Sistem hanya mencatat
                penghitung request untuk menegakkan kuota per peran.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-normal text-bone">Lisensi</h2>
              <p className="text-[15px] font-extralight leading-relaxed text-mist">
                Kode situs ini terbuka di{" "}
                <a
                  href="https://github.com/MuaraAI/ai-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone underline underline-offset-4 transition-colors hover:text-saffron"
                >
                  GitHub
                </a>{" "}
                dengan lisensi MIT.
              </p>
            </div>

            <Link href="/" className="btn-quiet self-start">
              <span className="material-symbols-rounded" aria-hidden="true">
                arrow_back
              </span>
              Kembali ke beranda
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
