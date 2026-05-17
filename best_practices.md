# Gadang Barubah — Best Practices (Qodo)

## 1. Project Purpose

Website restoran Padang **Gadang Barubah** (Cikarang): landing interaktif dengan mascot "Uni", layanan delivery/catering/outlet, membership, dan panel admin/kasir/member. Stack: React + Vite (client), Express + TypeScript (server), Drizzle ORM + **Neon PostgreSQL**.

## 2. Project Structure

```
client/src/     # React UI (Wouter routing, Shadcn, TanStack Query)
server/         # Express API, auth, upload, security
shared/         # Schema Drizzle + Zod + SEO types (dipakai client & server)
migrations/     # Drizzle migrations
dist/           # Build output (jangan edit manual)
```

- Alias import: `@/` → `client/src`, `@shared/` → `shared`
- Jangan commit `.env` — gunakan `.env.example` sebagai template

## 3. Commands

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Dev server (port `PORT` atau 5000) |
| `npm run build` | Build client + bundle server |
| `npm run start` | Production (`dist/index.js`) |
| `npm run check` | TypeScript strict check |
| `npm run db:push` | Push schema ke Neon (`DATABASE_URL` wajib) |

## 4. Environment

Wajib di `.env` (lihat `.env.example`):

- `DATABASE_URL` — Neon PostgreSQL (`?sslmode=require`)
- `SESSION_SECRET` — wajib di production
- `PORT` — Railway set otomatis; lokal default 5000
- `NODE_ENV` — `development` | `production`

## 5. Code Style

- **TypeScript strict** — perbaiki error `npm run check` sebelum merge
- **ES modules** (`import`/`export`), tidak CommonJS
- Komponen React: functional + hooks; UI dari Shadcn/Radix yang sudah ada
- Validasi input: **Zod** + `react-hook-form` di client; Zod/drizzle-zod di server
- Styling: **Tailwind** + token warna proyek (merah gelap `#3f1113`, krem/emas)
- Bahasa UI utama: **Indonesia**

## 6. Backend & Database

- ORM: **Drizzle** — schema di `shared/schema.ts`
- DB driver: `@neondatabase/serverless` + `Pool`
- Session: `express-session` + `connect-pg-simple` (PostgreSQL store)
- Password: **bcrypt** (12 rounds)
- Role user: `"admin"` | `"kasir"` | `"member"` — jangan pakai `string` bebas untuk role
- Tanggal di DB: gunakan tipe **`Date`**, bukan `string`, saat insert/update Drizzle
- Auth: rate limit login; jangan matikan proteksi di production tanpa alasan jelas

## 7. Security Review Focus

- Jangan hardcode secret/API key
- Jangan log PIN/password/hash
- Validasi semua input API (body, query, upload)
- `SESSION_SECRET` harus kuat di production
- Helmet/CSP: hati-hati jika melonggarkan untuk "akses pelanggan"

## 8. Deploy

- **Railway**: `npm run build` → `npm run start` (`railway.toml`)
- **GitHub Actions**: CI build di `.github/workflows/ci.yml`
- **Cloudflare**: DNS/proxy ke Railway (bukan hosting Node di CF Workers tanpa refactor)
- **Neon**: database terpisah per environment (dev/staging/prod)

## 9. Do's and Don'ts

**Do**

- Ikuti pola file/komponen yang sudah ada di folder terdekat
- Gunakan `shared/schema` untuk tipe DB yang konsisten
- Uji perubahan API dengan flow login role yang relevan
- Perubahan schema: `db:push` atau migration Drizzle, dokumentasikan di PR

**Don't**

- Jangan tambah dependensi Replit atau plugin khusus Replit
- Jangan commit `node_modules`, `dist`, `.env`, `.local`
- Jangan buat file contoh (`examples/`) yang import modul yang tidak ada
- Jangan ubah `vite.config` untuk REPL_ID / Replit

## 10. Routing

- `/uni` — hub layanan (UniPage)
- `/member/dashboard` — dilindungi session member
- Admin/kasir: `/admin`, `/kasir` (akses via URL langsung)
