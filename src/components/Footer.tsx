import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer data-scene="deep" className="w-full border-t border-line">
      <div className="container-page flex flex-col gap-15 pb-9 pt-15">
        <div className="grid grid-cols-1 gap-9 md:grid-cols-2">
          <div className="flex flex-col gap-4.5">
            <Logo />
            <p className="max-w-md text-[15px] font-extralight leading-relaxed text-mist">
              Gateway AI resmi komunitas mahasiswa MuaraAI. Akses terkelola ke Muara V1 Flash untuk riset, karya, dan pembelajaran.
            </p>
          </div>

          <div className="flex flex-col gap-4.5 text-sm font-extralight leading-relaxed text-mist">
            <p>
              <strong className="font-semibold text-bone">Disclaimer.</strong> Muara V1 Flash adalah gateway independen non-komersial untuk keperluan riset dan pembelajaran anggota komunitas MuaraAI. Layanan diabstraksikan melalui lapisan proksi komunitas dan tidak berafiliasi resmi dengan penyedia model dasar. Disediakan apa adanya tanpa jaminan ketersediaan komersial.
            </p>
            <p>
              <strong className="font-semibold text-bone">Privasi data.</strong> Konten percakapan dan prompt anggota tidak pernah dicatat atau disimpan (hanya di-stream langsung). Sistem hanya mencatat penghitung request untuk menegakkan kuota.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4.5 text-caption text-ash sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} MuaraAI Community · Lisensi MIT</p>
          <div className="flex items-center gap-6">
            <a href="https://github.com/MuaraAI" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-bone">
              GitHub Org
            </a>
            <a href="https://github.com/MuaraAI/ai-web" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-bone">
              Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
