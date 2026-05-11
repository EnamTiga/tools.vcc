/**
 * Environment-backed configuration.
 * Defaults apply both client-side (NEXT_PUBLIC_*) and server-side.
 */

// Parallelism & limits
export const BATCH_SIZE = clampInt(
  process.env.NEXT_PUBLIC_BATCH_SIZE,
  10,
  1,
  25,
);
export const BATCH_DELAY_MS = clampInt(
  process.env.NEXT_PUBLIC_BATCH_DELAY_MS,
  300,
  0,
  5000,
);
export const MAX_CARDS_TOTAL = clampInt(
  process.env.NEXT_PUBLIC_MAX_CARDS_TOTAL,
  1000,
  1,
  5000,
);
export const MAX_CARDS_PER_BATCH = clampInt(
  process.env.MAX_CARDS_PER_BATCH,
  25,
  1,
  50,
);

// Upstream API
export const CHKR_API_URL =
  process.env.NEXT_PUBLIC_CHKR_API_URL ?? "https://api.chkr.cc/";
export const CHKR_TIMEOUT_MS = clampInt(
  process.env.NEXT_PUBLIC_CHKR_TIMEOUT_MS,
  15000,
  1000,
  60000,
);

// ─── Helpers ────────────────────────────────────────────────────────────────

function clampInt(
  raw: string | undefined,
  fallback: number,
  min: number,
  max: number,
): number {
  const n = raw ? parseInt(raw, 10) : NaN;
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}
