<p align="center">
  <img src="./public/logo.svg" alt="BIN Tools Logo" width="120" height="120" />
</p>

<h1 align="center">BIN Tools</h1>

<p align="center">
  Modern <strong>BIN generator & card validator</strong> built with Next.js 16, shadcn/ui, Tailwind 4, and Motion.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#stack">Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deploying-to-vercel">Deploy</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

> 🌐 Language: **English** · [Bahasa Indonesia](./README.id.md)

---

## Features

- **Luhn generator** with wildcard `x` support (e.g. `625817xxxxxxxxxx`)
- **Optional overrides** for month, year, and CVV — blank fields pick random values, filled fields are used as-is
- **Parallel validation** configured via environment variables (not exposed in the UI)
- **Real-time UI**: live stats dashboard, animated progress bar, and streaming live-cards table
- **Smooth motion animations** across all components using Motion library
- **Export** results to TSV, CSV, or copy to clipboard
- **Dark / light theme** with animated toggle
- **Responsive** layout, glassmorphism cards, animated gradient accents
- **Server proxy** to avoid browser CORS limitations
- **Error boundary** for graceful runtime error handling
- **Unit tested** with Vitest (33 tests covering core logic)

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack, React 19) |
| UI Components | shadcn/ui (Radix primitives) |
| Styling | Tailwind CSS 4 |
| Animations | Motion (Framer Motion successor) |
| Forms | react-hook-form + zod |
| Toasts | sonner |
| Theming | next-themes |
| Icons | lucide-react |
| Testing | Vitest + Testing Library |

## Getting Started

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

| Script | Description |
|--------|-------------|
| `pnpm dev` | Dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run `tsc --noEmit` |
| `pnpm format` | Prettier format |
| `pnpm test` | Run unit tests |
| `pnpm test:watch` | Run tests in watch mode |

## Project Structure

```
app/
├── layout.tsx              Metadata, ThemeProvider, ErrorBoundary, Toaster
├── page.tsx                Main dashboard
├── globals.css
└── api/check/route.ts      POST proxy to chkr.cc

components/
├── ui/                     shadcn/ui primitives
├── error-boundary.tsx      React Error Boundary with fallback UI
├── site-header.tsx
├── site-footer.tsx
├── theme-toggle.tsx
├── hero-section.tsx
├── bin-form.tsx
├── features-grid.tsx
├── stats-dashboard.tsx
├── progress-section.tsx
├── count-up.tsx
└── live-cards-table.tsx

hooks/
├── use-bin-checker.ts      State machine + batch orchestration
└── use-timer.ts            Reusable elapsed-time tracker

lib/
├── types.ts                Shared TypeScript types
├── luhn.ts                 Luhn algorithm
├── card.ts                 Generation with optional MM/YY/CVV overrides
├── checker-service.ts      Upstream API communication (service layer)
├── api-client.ts           Client-side batched caller
├── exporters.ts            TSV/CSV/clipboard helpers
├── motion.ts               Shared animation variants and easings
└── env.ts                  Env config with clamping

tests/
├── setup.ts                Test setup (jest-dom matchers)
├── luhn.test.ts            Luhn algorithm tests
├── card.test.ts            Card generation tests
└── exporters.test.ts       Export utility tests
```

## Deploying to Vercel

1. Push the repository to GitHub.
2. [Import the project on Vercel](https://vercel.com/new).
3. **Framework Preset**: Next.js (auto-detected).
4. **Environment Variables**: copy the values from `.env.example`.
5. Deploy.

## Disclaimer

This tool is intended for legitimate use: testing your own payment systems, auditing your own BIN database, or educational exploration of the Luhn algorithm. Please use it responsibly and comply with all applicable laws and the terms of service of any API you integrate with.

## License

This project is licensed under the [MIT License](./LICENSE).
