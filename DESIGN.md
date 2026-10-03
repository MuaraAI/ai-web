---
version: alpha
name: Muara AI Light Glass Ocean
description: Light glassmorphism design system for the Muara AI member portal and landing page (ai.muaraai.com). Ocean Cyan accent on a crisp mist canvas, Inter and JetBrains Mono typography, WCAG AA compliant.

colors:
  primary: "#062535"
  secondary: "#5a616e"
  background: "#eef1f6"
  surface: "rgba(255, 255, 255, 0.65)"
  surface-solid: "#ffffff"
  surface-hover: "rgba(255, 255, 255, 0.90)"
  stroke: "rgba(17, 24, 39, 0.08)"
  text: "#1a1d26"
  text-muted: "#5a616e"
  accent: "#92EEFF"
  accent-hover: "#B8F5FF"
  on-accent: "#062535"
  accent-muted: "rgba(146, 238, 255, 0.20)"
  accent-glow: "rgba(146, 238, 255, 0.45)"
  code-bg: "#131b26"
  code-text: "#cdd6f4"

typography:
  body:
    fontFamily: Inter
    fontWeight: 400
    lineHeight: 1.6
  h1:
    fontFamily: Inter
    fontWeight: 800
    lineHeight: 1.15
  h2:
    fontFamily: Inter
    fontWeight: 700
    lineHeight: 1.25
  code:
    fontFamily: JetBrains Mono
    fontWeight: 400
    lineHeight: 1.6

spacing:
  base: 4px
  card-padding: 24px
  section-gap: 64px

rounded:
  small: 8px
  card: 16px
  large: 24px
---

# Muara AI Design System (Light Glass Ocean)

Desain resmi portal komunitas Muara AI (`ai.muaraai.com`).

## Prinsip Desain
1. **Light-first & Crisp:** Latar mist terang (`#eef1f6`) dengan permukaan frosted glass (`rgba(255, 255, 255, 0.65)`), stroke halus (`rgba(17, 24, 39, 0.08)`), dan aksen Ocean Cyan (`#92EEFF`).
2. **Copyable Endpoints & Credentials:** Base URL dan Kunci API harus dapat disalin langsung dengan satu klik tombol Copy yang responsif.
3. **Self-hosted Fonts:** Menggunakan font lokal Inter latin woff2, JetBrains Mono, dan Material Symbols Rounded. Nol koneksi pihak ketiga ke Google Fonts / CDN eksternal.
4. **Zero Decorative Emojis:** Tidak ada emoji sebagai icon, bullet list, atau tombol di komponen UI (mengikuti protokol antislop & font enforcement).
5. **Mobile Floor 360px:** Tampilan tetap proporsional dan tidak ada horizontal scrollbar pada layar terkecil 360px.
