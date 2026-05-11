/**
 * Client-side card checker.
 * Calls the internal /api/check Next.js route which proxies to chkr.cc.
 * Using a server proxy avoids browser CORS restrictions on third-party APIs.
 */

import { BATCH_SIZE, BATCH_DELAY_MS } from "./env";
import type { CardResult, CardString } from "./types";

const CHECK_ENDPOINT = "/api/check";

/**
 * Sends a batch of cards to the server proxy.
 */
export async function checkBatchRequest(
  cards: CardString[],
  signal?: AbortSignal,
): Promise<CardResult[]> {
  const res = await fetch(CHECK_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cards }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as { results: CardResult[] };
  return data.results;
}

export interface RunBatchOptions {
  cards: CardString[];
  batchSize?: number;
  delayMs?: number;
  onBatchDone?: (results: CardResult[], batchIndex: number) => void;
  signal?: AbortSignal;
}

/**
 * Runs the full batched check workflow.
 * - Splits cards into batches of `batchSize`.
 * - Calls server per batch.
 * - Invokes `onBatchDone` after each batch is received.
 * - Honors `signal` for cancellation between batches.
 */
export async function runBatchedCheck({
  cards,
  batchSize = BATCH_SIZE,
  delayMs = BATCH_DELAY_MS,
  onBatchDone,
  signal,
}: RunBatchOptions): Promise<CardResult[]> {
  const all: CardResult[] = [];

  for (let i = 0; i < cards.length; i += batchSize) {
    if (signal?.aborted) break;

    const batch = cards.slice(i, i + batchSize);
    const batchIndex = Math.floor(i / batchSize);

    try {
      const results = await checkBatchRequest(batch, signal);
      all.push(...results);
      onBatchDone?.(results, batchIndex);
    } catch (err) {
      if ((err as Error).name === "AbortError") break;
      // Mark the whole batch as unknown so progress still advances
      const fallback: CardResult[] = batch.map((card) => ({
        card,
        status: "Unknown",
        message: (err as Error).message,
        bank: "-",
        brand: "-",
        country: "",
        category: "-",
        checkedAt: Date.now(),
      }));
      all.push(...fallback);
      onBatchDone?.(fallback, batchIndex);
    }

    // Pause between batches (skip after the last one)
    if (i + batchSize < cards.length && delayMs > 0) {
      await sleep(delayMs, signal);
    }
  }

  return all;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const id = setTimeout(() => {
      resolve();
      signal?.removeEventListener("abort", onAbort);
    }, ms);
    const onAbort = () => {
      clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
