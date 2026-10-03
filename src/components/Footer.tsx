export function Footer() {
  return (
    <footer className="w-full border-t border-stroke bg-surface-solid py-12 text-sm text-text-muted">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-background border border-stroke text-accent-dark shadow-sm">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M4 19V5l8 7 8-7v14" />
                </svg>
              </div>
              <span className="font-bold text-text tracking-tight">Muara AI</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed max-w-md">
              Gateway AI resmi komunitas mahasiswa MuaraAI. Menyediakan akses model komputasi cerdas Muara V1 Flash secara terkelola untuk riset, karya, dan pembelajaran.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text">
              Penafian & Kebijakan Privasi
            </h4>
            <div className="rounded-lg border border-stroke bg-background/60 p-3.5 space-y-2.5 text-xs">
              <p className="leading-relaxed">
                <strong className="text-text font-medium">Disclaimer:</strong> Muara V1 Flash adalah gateway independen non-komersial untuk keperluan riset dan pembelajaran anggota komunitas MuaraAI. Layanan diabstraksikan melalui lapisan proksi komunitas dan tidak berafiliasi resmi dengan penyedia model dasar. Disediakan apa adanya tanpa jaminan ketersediaan komersial.
              </p>
              <p className="leading-relaxed">
                <strong className="text-text font-medium">Privasi Data:</strong> Konten percakapan dan pesan prompt anggota tidak pernah dicatat atau disimpan di database MuaraAI (hanya di-stream secara langsung). Sistem hanya mencatat penghitung request untuk menegakkan kuota rate limiting.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-stroke pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} MuaraAI Community. Dilindungi di bawah lisensi MIT.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/MuaraAI"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text transition-colors"
            >
              GitHub Org
            </a>
            <a
              href="https://github.com/MuaraAI/ai-web"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text transition-colors"
            >
              Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
