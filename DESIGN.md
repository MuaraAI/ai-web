---
version: beta
name: Muara AI Void
description: Design system for the Muara AI member portal and landing page (ai.muaraai.com). Black and white themes, one Electric Iris action color, Saffron Spark accents, weightless Inter typography, and scrubbed GSAP scroll motion.

colors:  # dark / light (CSS variables in globals.css, switched by data-theme on <html>)
  void: "#000000 / #ffffff"   # canvas
  bone: "#ffffff / #0a0a0a"   # ink
  ash: "#9a9a9a / #666666"
  mist: "#bdbdbd / #404040"
  iris: "#8052ff"
  iris-hover: "#9370ff"
  saffron: "#ffb829 / #a66200"
  teal: "#2bd4b4"  # logo gradient only
  ember: "#ff6b6b / #cc3030"
  line: "ink at 10%"
  line-strong: "ink at 16%"

typography:
  display:
    fontFamily: Inter
    fontWeight: 400
    fontSize: clamp(52px, 7.4vw, 108px)
    lineHeight: 0.98
    letterSpacing: -0.04em
  heading-lg:
    fontFamily: Inter
    fontWeight: 400
    fontSize: clamp(42px, 5.4vw, 78px)
    letterSpacing: -0.04em
  heading-sm:
    fontFamily: Inter
    fontWeight: 400
    fontSize: clamp(36px, 3.6vw, 48px)
    letterSpacing: -0.035em
  body:
    fontFamily: Inter
    fontWeight: 200
    fontSize: 18px
    lineHeight: 1.5
  label:
    fontFamily: Inter
    fontWeight: 600
    fontSize: 14px
    letterSpacing: 0.025em
    textTransform: uppercase
  code:
    fontFamily: JetBrains Mono
    fontWeight: 400
    lineHeight: 1.7

spacing:
  base: 6px
  scale: [6, 12, 18, 24, 30, 36, 60, 96, 120]
  page-max-width: 1280px
  section-gap: 120px

rounded:
  button: 10px
  field: 10px
  card: 16px
  pill: 9999px  # status dots only
---

# Muara AI Design System (Void)

Desain resmi portal komunitas Muara AI (`ai.muaraai.com`). Dua tema (hitam dan putih), satu warna aksi ungu, percikan amber, tipografi yang ringan, dan gerak scroll GSAP yang menyambung antar section.

## Prinsip Desain
1. **Kanvas polos, dua tema:** Semua section berlatar `void`: hitam pekat di tema gelap, putih di tema terang. Tema mengikuti sistem saat kunjungan pertama, bisa diganti lewat `<ThemeToggle />` di navbar (tema baru mengembang sebagai lingkaran dari tengah layar via View Transitions API; tanpa dukungan browser atau dengan reduced motion cukup cross-fade warna), dan disimpan di `localStorage` (`muara-theme`). Skrip pra-render di `layout.tsx` memasang `data-theme` sebelum paint agar tidak berkedip. Warna selalu lewat token (`bg-void`, `text-bone`, `border-line`, ...), jangan hex langsung. Tidak ada panel abu-abu, kartu berisi, bayangan, atau gradien pada komponen UI. Pemisah hanya garis tipis `line` (tinta 10%) bila benar-benar dibutuhkan (tabel, daftar).
2. **Hierarki lewat skala, bukan ketebalan:** Judul selalu Inter 400 dengan tracking `-0.04em` pada ukuran besar. Body copy Inter **200** (ultra-light) 18px. Label & navigasi Inter 600, 14px, uppercase, tracking `0.025em`.
3. **Satu aksi utama per tampilan:** Tombol semi-rounded `iris` (`.btn-primary`, radius 10px, teks selalu putih) hanya untuk aksi utama. Aksi sekunder memakai teks tanpa wadah (`.btn-ghost`, `.btn-quiet`). `iris` tidak dipakai sebagai latar blok besar.
4. **Amber untuk penekanan:** `saffron` untuk eyebrow di atas judul, sorotan, dan tautan aksen. `ember` hanya untuk status error/pencabutan. Tidak ada badge/titik status hijau; status ditulis sebagai teks.
5. **Data langsung di hero:** Kolom kanan hero adalah `<LiveStats />`, yang mengambil `https://api.muaraai.com/v1/ai/stats` dari browser, menyegarkan tiap 60 detik saat tab terlihat, dan menghitung naik angka dengan GSAP. `parseStats` (`src/lib/stats.ts`) memetakan kunci yang dikenal (total request, token, anggota aktif, uptime, ...) ke label Indonesia dan mengisi sisa slot dengan field numerik lain. Bila endpoint gagal, ditampilkan spesifikasi statis. Tidak ada visual prosedural berat; gradien hanya di logo.
6. **Scroll GSAP yang menyambung:** `<HomeMotion />` memakai GSAP ScrollTrigger + SplitText, semuanya *scrub* (terikat posisi scroll) agar satu section mengalir ke section berikutnya: bar progres di bawah navbar, garis benang di kiri kolom (≥1400px) yang terisi dan menyalakan titik tiap section (`data-section`, `data-node`), judul `data-split` yang menebal kata demi kata, baris `data-rise` di dalam `data-rise-group` yang naik berurutan, blok kode `data-unroll`, dan section yang ditinggalkan meredup. Halaman lain memakai `<Reveal />` (GSAP, sekali jalan). Elemen `data-reveal` disembunyikan hanya saat `html[data-motion]` aktif, yang tidak dipasang bila `prefers-reduced-motion`, sehingga konten tetap terbaca tanpa animasi.
7. **Tipografi hidup:** judul hero memakai `<TypeCycle />`, kata amber yang diketik ulang (ide → riset → karya → kode) dengan caret ungu dan slot selebar kata terpanjang agar tidak reflow. Judul memakai `text-wrap: balance`, paragraf `pretty`.
8. **Scrollbar kustom:** tipis, thumb abu transparan, ungu saat ditarik; Firefox memakai `scrollbar-color`.
9. **Copyable Endpoints & Credentials:** Base URL dan kunci API dapat disalin dengan satu klik.
10. **Self-hosted Fonts:** Inter (200/400/600), JetBrains Mono, dan Material Symbols Rounded dari `public/fonts`. Nol koneksi ke Google Fonts / CDN eksternal.
11. **Zero Decorative Emojis:** Tidak ada emoji sebagai ikon, bullet, atau tombol.
12. **Mobile Floor 360px & Aksesibilitas:** Tanpa scrollbar horizontal di 360px, target sentuh ≥ 44px, fokus terlihat (outline amber), kontras teks ≥ 4.5:1.

## Komponen Utilitas (`globals.css`)
| Kelas | Peran |
|-------|-------|
| `.container-page` | Lebar maksimum 1280px dengan gutter 24px |
| `.eyebrow` | Label amber uppercase di atas judul |
| `.label` | Label kolom/field 12px uppercase abu |
| `.btn-primary` | Tombol ungu semi-rounded (10px), aksi utama tunggal |
| `.btn-ghost` / `.btn-quiet` | Aksi teks tanpa wadah |
| `.field` | Input/select semi-rounded dengan garis tipis |
| `.code-block` | Blok kode hitam bergaris tipis, radius 16px |
| `[data-reveal]` | Elemen yang dimunculkan GSAP (tersembunyi hanya saat motion aktif) |
| `.thread` / `.thread-node` | Garis benang scroll dan titik section di landing |
| `.type-caret` | Caret ungu berkedip untuk `<TypeCycle />` |
