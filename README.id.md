# BIN Tools

**BIN generator & card validator** modern yang dibangun dengan Next.js 16, shadcn/ui, dan Tailwind 4.

Generate nomor kartu kredit dari prefix BIN menggunakan algoritma Luhn, lalu validasi secara paralel per batch via [chkr.cc](https://chkr.cc) dengan dashboard live dan export instan (TSV / CSV / clipboard).

> 🌐 Bahasa: [English](./README.md) · **Bahasa Indonesia**

---

## ✨ Fitur

- **Generator Luhn** dengan dukungan wildcard `x` (contoh: `625817xxxxxxxxxx`)
- **Override opsional** untuk bulan, tahun, dan CVV - field kosong diisi nilai acak, field terisi dipakai apa adanya
- **Validasi paralel** yang diatur via environment variable (tidak terekspos di UI)
- **UI real-time**: stats dashboard live, progress bar, dan tabel live-cards yang streaming
- **Export** hasil ke TSV, CSV, atau copy ke clipboard
- **Tema terang / gelap** dengan hotkey `D`
- **Layout responsive**, kartu glassmorphism, aksen gradient beranimasi
- **Server proxy** untuk menghindari pembatasan CORS pada browser

## 🛠 Tech Stack

- **Next.js 16** (App Router, Turbopack, React 19)
- **shadcn/ui** (style `radix-nova`, base color `mist`)
- **Tailwind CSS 4**
- **react-hook-form** + **zod** untuk validasi
- **sonner** untuk notifikasi toast
- **next-themes** untuk tema
- **lucide-react** untuk ikon

## 🚀 Mulai

### 1. Install dependencies

```bash
pnpm install
```

### 2. Konfigurasi environment

Copy template-nya:

```bash
cp .env.example .env.local
```

Default-nya sudah bisa langsung pakai. Atur tombol paralelisme jika perlu:

```env
NEXT_PUBLIC_BATCH_SIZE=10          # Jumlah request paralel per batch
NEXT_PUBLIC_BATCH_DELAY_MS=300     # Jeda antar batch (ms)
NEXT_PUBLIC_MAX_CARDS_TOTAL=1000   # Batas atas kartu per run
NEXT_PUBLIC_CHKR_TIMEOUT_MS=15000  # Timeout upstream per kartu
NEXT_PUBLIC_CHKR_API_URL=https://api.chkr.cc/
MAX_CARDS_PER_BATCH=25             # Hard cap di server (defense-in-depth)
```

### 3. Jalankan dev server

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000).

### 4. Scripts

| Script           | Deskripsi                   |
| ---------------- | --------------------------- |
| `pnpm dev`       | Dev server dengan Turbopack |
| `pnpm build`     | Build production            |
| `pnpm start`     | Jalankan production server  |
| `pnpm lint`      | Jalankan ESLint             |
| `pnpm typecheck` | Jalankan `tsc --noEmit`     |
| `pnpm format`    | Format dengan Prettier      |

## 🧱 Struktur Proyek

```
app/
├── layout.tsx              Metadata, ThemeProvider, Toaster
├── page.tsx                Dashboard utama
├── globals.css
└── api/check/route.ts      POST proxy ke chkr.cc

components/
├── ui/                     Primitif shadcn/ui
├── site-header.tsx
├── site-footer.tsx
├── theme-toggle.tsx
├── hero-section.tsx
├── bin-form.tsx
├── features-grid.tsx
├── stats-dashboard.tsx
├── progress-section.tsx
└── live-cards-table.tsx

hooks/
└── use-bin-checker.ts      State machine + orkestrasi batch

lib/
├── types.ts                Tipe TypeScript bersama
├── luhn.ts                 Algoritma Luhn
├── card.ts                 Generator dengan override MM/YY/CVV opsional
├── api-client.ts           Pemanggil batched sisi client
├── exporters.ts            Helper TSV/CSV/clipboard
└── env.ts                  Konfigurasi env dengan clamping
```

## 🌍 Deploy ke Vercel

1. Push repo ke GitHub.
2. [Import proyek di Vercel](https://vercel.com/new).
3. **Framework Preset**: Next.js (auto-detected).
4. **Environment Variables**: copy nilai dari `.env.example`.
5. Deploy.

## ⚠️ Disclaimer

Tool ini dimaksudkan untuk penggunaan yang sah: testing sistem pembayaran milik sendiri, audit database BIN sendiri, atau eksplorasi edukatif terhadap algoritma Luhn. Gunakan dengan bertanggung jawab dan patuhi semua hukum yang berlaku serta terms of service dari API yang terintegrasi.

## 📝 Lisensi

Dirilis untuk penggunaan pribadi. Lihat `LICENSE` jika tersedia.
