---
version: beta
name: Muara AI
description: Design system for the Muara AI member portal (ai.muaraai.com). Light and dark themes, one Electric Iris action color, left-aligned weightless Inter typography, and an anime.js background whose dots regroup into a shape for every section.

colors:
  # Theme-aware tokens (CSS variables in globals.css, switched by html[data-theme])
  canvas: { dark: "#07070b", light: "#fafafc" }
  ink: { dark: "#ffffff", light: "#0e0e14" }
  muted: { dark: "#9a9aa0", light: "#62626e" }
  soft: { dark: "#c4c4cc", light: "#40404a" }
  saffron: { dark: "#ffb829", light: "#a16207" }
  ember: { dark: "#ff6b6b", light: "#dc2626" }
  line: "ink @ 10%"
  line-strong: "ink @ 16%"
  # Fixed accents
  iris: "#8052ff"
  iris-hover: "#9370ff"
  teal: "#2bd4b4"
  palette: ["#8052ff", "#a98bff", "#2bd4b4", "#3d7bff", "#ff4fa3", "#ffb829"]  # background dots & glows

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

# Muara AI Design System

Desain resmi portal komunitas Muara AI (`ai.muaraai.com`): dua tema (terang & gelap), satu warna aksi ungu, teks rata kiri yang ringan, dan latar anime.js penuh warna yang berubah bentuk di setiap section.

## Prinsip Desain
1. **Dua tema, satu sistem:** Semua warna memakai token `canvas`, `ink`, `muted`, `soft`, `saffron`, `ember`, `line` yang nilainya diganti lewat `html[data-theme]`. Pilihan disimpan di `localStorage` (default mengikuti sistem) dan diterapkan sebelum render pertama agar tidak berkedip. Toggle `<ThemeToggle />` ada di navbar. Komponen UI tetap datar: tanpa kartu berisi atau bayangan; pemisah hanya garis tipis `line`.
2. **Hierarki lewat skala, bukan ketebalan:** Judul selalu Inter 400 dengan tracking `-0.04em` pada ukuran besar. Body copy Inter **200** (ultra-light) 18px. Label & navigasi Inter 600, 14px, uppercase, tracking `0.025em`.
3. **Satu aksi utama per tampilan:** Tombol semi-rounded `iris` (`.btn-primary`, radius 10px) untuk aksi utama, didampingi tombol bergaris `.btn-secondary`. Aksi kecil memakai teks tanpa wadah (`.btn-ghost`, `.btn-quiet`). `iris` tidak dipakai sebagai latar blok besar.
4. **Amber untuk penekanan:** `saffron` untuk eyebrow di atas judul, sorotan, dan tautan aksen. `ember` hanya untuk status error/pencabutan. Tidak ada badge/titik status hijau; status ditulis sebagai teks.
5. **Teks di kiri, bentuk di kanan:** Konten setiap section berada di kolom kiri (maks ±640–720px). Sisi kanan layar desktop adalah panggung latar. Di ponsel, bentuk berada di belakang konten dengan opasitas rendah.
6. **Latar anime.js yang berubah bentuk saat scroll:** `<ShapeField />` (fixed, di belakang konten) berisi 120 titik berwarna dan tiga cahaya lembut. Section menandai bentuknya dengan `data-formation` (atau `<Reveal formation="…">`). Saat section melewati tengah layar, titik-titik berkumpul ulang memakai `animate` + `stagger` dari anime.js dan warnanya berganti. Bentuk dipilih supaya mudah dipahami (`src/lib/formations.ts`):

   | Bentuk | Dipakai di | Makna |
   |---|---|---|
   | `stream` | Hero | Sungai yang bermuara ke laut |
   | `bars` | Model & Limit, kuota dashboard | Batang kuota per peran |
   | `code` | Quickstart, contoh integrasi | Simbol `</>` |
   | `ring` | Komunitas | Lingkar orang-orang |
   | `key` | Login, buat kunci & daftar kunci | Kunci API |

   Titik juga "bernapas" pelan saat diam. Animasi berhenti total saat `prefers-reduced-motion`.
7. **Tipografi hidup:** judul hero memakai `<TypeCycle />`, kata bergradien di barisnya sendiri yang diketik ulang (ide → riset → karya → kode) dengan caret ungu. Judul memakai `text-wrap: balance`, paragraf `pretty`.
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
| `.btn-secondary` | Tombol bergaris untuk aksi pendamping |
| `.btn-ghost` / `.btn-quiet` | Aksi teks tanpa wadah |
| `.text-gradient` | Teks gradien aksen (per tema) |
| `.shape-glow` | Cahaya warna buram di belakang formasi |
| `.field` | Input/select semi-rounded dengan garis tipis |
| `.code-block` | Blok kode bergaris tipis, radius 16px |
| `.reveal` | Status awal/akhir animasi muncul saat scroll |
| `.type-caret` | Caret ungu berkedip untuk `<TypeCycle />` |
