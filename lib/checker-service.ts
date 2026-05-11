/**
 * Checker service — handles communication with the upstream chkr.cc API.
 * Extracted from the route handler to maintain single responsibility.
 */

import { CHKR_API_URL, CHKR_TIMEOUT_MS } from "./env";
import type { CardResult, CardStatus, CardString } from "./types";

// ─── Upstream request headers ────────────────────────────────────────────────

const UPSTREAM_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0",
  Accept: "*/*",
  "Accept-Language": "id,en-US;q=0.9,en;q=0.8",
  "Content-Type": "application/json; charset=utf-8",
  "Sec-GPC": "1",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-site",
  Priority: "u=4",
  Referer: "https://chkr.cc/",
  Origin: "https://chkr.cc",
} as const;

// ─── Upstream response shape ─────────────────────────────────────────────────

interface UpstreamResponse {
  status?: string;
  message?: string;
  card?: {
    bank?: string;
    brand?: string;
    category?: string;
    country?: { emoji?: string };
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Checks a single card against the upstream API.
 * Returns a normalized `CardResult` regardless of success or failure.
 */
export async function checkCard(card: CardString): Promise<CardResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CHKR_TIMEOUT_MS);

  try {
    const res = await fetch(CHKR_API_URL, {
      method: "POST",
      headers: UPSTREAM_HEADERS,
      body: JSON.stringify({ data: card, charge: false }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return unknownResult(card, `HTTP ${res.status}`);
    }

    const data = (await res.json()) as UpstreamResponse;

    return {
      card,
      status: normalizeStatus(data?.status),
      message: data?.message ?? "-",
      bank: data?.card?.bank ?? "-",
      brand: data?.card?.brand ?? "-",
      country: data?.card?.country?.emoji ?? "",
      category: data?.card?.category ?? "-",
      checkedAt: Date.now(),
    };
  } catch (err) {
    const e = err as Error;
    return unknownResult(card, e.name === "AbortError" ? "Timeout" : e.message);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Checks multiple cards in parallel.
 * Each card is checked independently — one failure won't affect others.
 */
export async function checkCards(cards: CardString[]): Promise<CardResult[]> {
  return Promise.all(cards.map(checkCard));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function unknownResult(card: CardString, message: string): CardResult {
  return {
    card,
    status: "Unknown",
    message,
    bank: "-",
    brand: "-",
    country: "",
    category: "-",
    checkedAt: Date.now(),
  };
}

function normalizeStatus(raw: unknown): CardStatus {
  if (typeof raw !== "string") return "Unknown";
  const lower = raw.toLowerCase();
  if (lower === "live") return "Live";
  if (lower === "die") return "Die";
  return "Unknown";
}
