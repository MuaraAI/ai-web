---
version: beta
name: Muara AI Void
description: Dark-stage design system for the Muara AI member portal and landing page (ai.muaraai.com). Pure black void, one Electric Iris action color, Saffron Spark accents, weightless Inter typography, and a river-to-sea (muara) motion language.

colors:
  void: "#000000"
  bone: "#ffffff"
  ash: "#9a9a9a"
  mist: "#bdbdbd"
  iris: "#8052ff"
  iris-hover: "#9370ff"
  saffron: "#ffb829"
  teal: "#2bd4b4"  # river water in procedural visuals only
  ember: "#ff6b6b"
  line: "rgba(255, 255, 255, 0.10)"
  line-strong: "rgba(255, 255, 255, 0.16)"

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

Desain resmi portal komunitas Muara AI (`ai.muaraai.com`). Panggung gelap: kanvas hitam pekat, satu warna aksi ungu, percikan amber, tipografi yang ringan, dan bahasa visual **muara**: aliran sungai yang melebar menuju laut.

## Prinsip Desain
1. **Void adalah desainnya:** Semua section berlatar `#000000`. Tidak ada panel abu-abu, kartu berisi, bayangan, atau gradien pada komponen UI. Pemisah hanya garis tipis `line` (`rgba(255,255,255,0.10)`) bila benar-benar dibutuhkan (tabel, daftar).
2. **Hierarki lewat skala, bukan ketebalan:** Judul selalu Inter 400 dengan tracking `-0.04em` pada ukuran besar. Body copy Inter **200** (ultra-light) 18px. Label & navigasi Inter 600, 14px, uppercase, tracking `0.025em`.
3. **Satu aksi utama per tampilan:** Tombol semi-rounded `iris` (`.btn-primary`, radius 10px) hanya untuk aksi utama. Aksi sekunder memakai teks tanpa wadah (`.btn-ghost`, `.btn-quiet`). `iris` tidak dipakai sebagai latar blok besar.
4. **Amber untuk penekanan:** `saffron` untuk eyebrow di atas judul, sorotan, dan tautan aksen. `ember` hanya untuk status error/pencabutan. Tidak ada badge/titik status hijau; status ditulis sebagai teks.
5. **Muara sebagai visual hero:** `<Estuary />` adalah peta muara: sungai berkelok dari **Hulu**, pecah menjadi kanal-kanal delta di titik **Muara** (penanda amber berdenyut), lalu gelombang bergulir ke **Laut**. Partikel segitiga mengalir di sepanjang sungai (teal) dan berubah ungu saat masuk laut. Logo adalah delta Δ yang dibelah aliran sungai. Gradien hanya diizinkan di logo dan visual prosedural.
6. **Scene per section saat scroll:** `<FlowField />` adalah latar garis arus tetap. Setiap section memilih scene lewat `data-scene` (atau `<Reveal scene="…">`): `hero`, `river`, `rapids`, `mouth`, `sea`, `deep` (lihat `src/lib/scenes.ts`). Latar bertransisi halus di akhir tiap section, mengubah kemiringan, lebar kanal, tinggi ombak, kecepatan arus, dan warna (teal → ungu). Landing: hero → river → rapids → mouth → sea → deep. Login: mouth. Dashboard: sea/mouth/deep. `<JourneyRail />` menandai posisi pembaca di layar ≥1440px, dan `<Reveal />` memunculkan konten saat masuk viewport. Semua animasi berhenti saat tab tersembunyi dan menghormati `prefers-reduced-motion`.
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
| `.reveal` | Status awal/akhir animasi muncul saat scroll |
| `.type-caret` | Caret ungu berkedip untuk `<TypeCycle />` |
