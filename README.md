# BIN Tools

Modern **BIN generator & card validator** built with Next.js 16, shadcn/ui, and Tailwind 4.

Generate credit card numbers from a BIN prefix using the Luhn algorithm, then validate them in parallel batches via [chkr.cc](https://chkr.cc) with a live dashboard and instant export (TSV / CSV / clipboard).

> 🌐 Language: **English** · [Bahasa Indonesia](./README.id.md)

---

## ✨ Features

- **Luhn generator** with wildcard `x` support (e.g. `625817xxxxxxxxxx`)
- **Optional overrides** for month, year, and CVV - blank fields pick random values, filled fields are used as-is
- **Parallel validation** configured via environment variables (not exposed in the UI)
- **Real-time UI**: live stats dashboard, progress bar, and streaming live-cards table
- **Export** results to TSV, CSV, or copy to clipboard
- **Dark / light theme** with `D` hotkey
- **Responsive** layout, glassmorphism cards, animated gradient accents
- **Server proxy** to avoid browser CORS limitations

## 🛠 Stack

- **Next.js 16** (App Router, Turbopack, React 19)
- **shadcn/ui** (style `radix-nova`, base color `mist`)
- **Tailwind CSS 4**
- **react-hook-form** + **zod** for validation
- **sonner** for toasts
- **next-themes** for theming
- **lucide-react** for icons

## 🚀 Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy the template:

```bash
cp .env.example .env.local
```

The defaults work out of the box. Tweak the parallelism knobs if needed:

```env
NEXT_PUBLIC_BATCH_SIZE=10          # Parallel requests per batch
NEXT_PUBLIC_BATCH_DELAY_MS=300     # Delay between batches (ms)
NEXT_PUBLIC_MAX_CARDS_TOTAL=1000   # Upper bound on cards generated per run
NEXT_PUBLIC_CHKR_TIMEOUT_MS=15000  # Per-card upstream timeout
NEXT_PUBLIC_CHKR_API_URL=https://api.chkr.cc/
MAX_CARDS_PER_BATCH=25             # Server-side hard cap (defense-in-depth)
```

### 3. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Scripts

| Script           | Description               |
| ---------------- | ------------------------- |
| `pnpm dev`       | Dev server with Turbopack |
| `pnpm build`     | Production build          |
| `pnpm start`     | Start production server   |
| `pnpm lint`      | Run ESLint                |
| `pnpm typecheck` | Run `tsc --noEmit`        |
| `pnpm format`    | Prettier format           |

## 🧱 Project Structure

```
app/
├── layout.tsx              Metadata, ThemeProvider, Toaster
├── page.tsx                Main dashboard
├── globals.css
└── api/check/route.ts      POST proxy to chkr.cc

components/
├── ui/                     shadcn/ui primitives
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
└── use-bin-checker.ts      State machine + batch orchestration

lib/
├── types.ts                Shared TypeScript types
├── luhn.ts                 Luhn algorithm
├── card.ts                 Generation with optional MM/YY/CVV overrides
├── api-client.ts           Client-side batched caller
├── exporters.ts            TSV/CSV/clipboard helpers
└── env.ts                  Env config with clamping
```

## 🌍 Deploying to Vercel

1. Push the repository to GitHub.
2. [Import the project on Vercel](https://vercel.com/new).
3. **Framework Preset**: Next.js (auto-detected).
4. **Environment Variables**: copy the values from `.env.example`.
5. Deploy.

## ⚠️ Disclaimer

This tool is intended for legitimate use: testing your own payment systems, auditing your own BIN database, or educational exploration of the Luhn algorithm. Please use it responsibly and comply with all applicable laws and the terms of service of any API you integrate with.

## 📝 License

Released for personal use. See `LICENSE` if present.
