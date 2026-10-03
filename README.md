# Muara AI — Member Portal (`ai.muaraai.com`)

Official web portal and dashboard for the Muara V1 Flash AI Gateway.

## Apa itu
Aplikasi web Next.js publik untuk komunitas MuaraAI:
- Landing page informatif (tabel model, rate limit per role, quickstart cURL/Python/JS).
- SSO Login With MuaraAI (berbagi sesi antar subdomain `.muaraai.com`).
- Self-service dashboard: generate key (WebCrypto browser-side, view-once, zero secret di server), revoke key, dan pantau kuota.

## Setup & Jalankan Lokal

1. Salin environment:
   ```bash
   cp .env.example .env.local
   ```
   Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari project Supabase `muaraai`.

2. Install dependency:
   ```bash
   npm install
   ```

3. Jalankan development server:
   ```bash
   npm run dev
   ```

4. Testing & Typecheck:
   ```bash
   npm test
   npx tsc --noEmit
   ```

## Lisensi
MIT
