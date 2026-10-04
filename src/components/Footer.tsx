import Link from "next/link";
import { Logo } from "@/components/Logo";

const productLinks = [
  { href: "/#models", label: "Model & Limit" },
  { href: "/#quickstart", label: "Quickstart" },
  { href: "/#faq", label: "FAQ" },
  { href: "/login", label: "Masuk" },
];

const communityLinks = [
  { href: "https://muaraai.com", label: "Portal Komunitas" },
  { href: "https://github.com/MuaraAI", label: "GitHub Org" },
  { href: "https://github.com/MuaraAI/ai-web", label: "Repository" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-line">
      <div className="container-page flex flex-col gap-9 pb-9 pt-12">
        <div className="grid grid-cols-2 gap-9 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-15">
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
            <Logo />
            <p className="max-w-xs text-sm font-extralight leading-relaxed text-mist">
              Gateway AI komunitas mahasiswa MuaraAI.
            </p>
          </div>

          <nav aria-label="Produk" className="flex flex-col gap-2.5">
            <span className="label">Produk</span>
            {productLinks.map((l) => (
              <Link key={l.label} href={l.href} className="min-h-[24px] text-sm font-extralight text-mist transition-colors hover:text-bone">
                {l.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Komunitas" className="flex flex-col gap-2.5">
            <span className="label">Komunitas</span>
            {communityLinks.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="min-h-[24px] text-sm font-extralight text-mist transition-colors hover:text-bone">
                {l.label}
              </a>
            ))}
            <Link href="/legal" className="min-h-[24px] text-sm font-extralight text-mist transition-colors hover:text-bone">
              Disclaimer &amp; Privasi
            </Link>
          </nav>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-caption text-ash sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} MuaraAI Community · Lisensi MIT</p>
          <p>
            Non-komersial, tanpa penyimpanan prompt.{" "}
            <Link href="/legal" className="underline underline-offset-4 transition-colors hover:text-bone">
              Selengkapnya
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
