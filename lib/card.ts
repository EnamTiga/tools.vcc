/**
 * Card generation utilities with optional field overrides.
 * Combines BIN template parsing with the Luhn algorithm.
 */

import { luhnComplete } from "./luhn";
import type { CardOverrides, CardString } from "./types";

const CARD_LENGTH = 16;
const DEFAULT_MIN_YR = 2026;
const DEFAULT_MAX_YR = 2031;

// ─── Random helpers ──────────────────────────────────────────────────────────

const randDigit = (): number => Math.floor(Math.random() * 10);
const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randMonth = (): string => String(randInt(1, 12)).padStart(2, "0");
const randYear = (): string => String(randInt(DEFAULT_MIN_YR, DEFAULT_MAX_YR));
const randCVV = (): string => String(randInt(0, 999)).padStart(3, "0");

// ─── Validators ──────────────────────────────────────────────────────────────

const MONTH_RE = /^(0[1-9]|1[0-2])$/;
const YEAR_RE = /^\d{4}$/;
const YY_RE = /^\d{2}$/;
const CVV_RE = /^\d{3,4}$/;

function normalizeMonth(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const padded = trimmed.padStart(2, "0");
  return MONTH_RE.test(padded) ? padded : undefined;
}

function normalizeYear(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  // "26" → "2026"
  if (YY_RE.test(trimmed)) return `20${trimmed}`;
  if (YEAR_RE.test(trimmed)) return trimmed;
  return undefined;
}

function normalizeCVV(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return CVV_RE.test(trimmed) ? trimmed.padStart(3, "0") : undefined;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Parses and normalizes a BIN template.
 * Accepts digits and 'x'/'X' as wildcard characters. Other chars stripped.
 * @example parseBinTemplate("625817")         → "625817"
 * @example parseBinTemplate("625 817-xxxx")   → "625817xxxx"
 */
export function parseBinTemplate(raw: string): string {
  return raw.toLowerCase().trim().replace(/[^0-9x]/g, "");
}

/**
 * Generates a single card string in format NUMBER|MM|YYYY|CVV.
 * - Wildcards (`x`) are expanded to random digits.
 * - Template is padded with random digits to `CARD_LENGTH - 1`, then Luhn digit appended.
 * - MM/YYYY/CVV overrides are used if provided, else random.
 */
export function generateCard(
  binTemplate: string,
  overrides: CardOverrides = {},
): CardString {
  // Expand 'x' wildcards
  let partial = [...binTemplate]
    .map((ch) => (ch === "x" ? randDigit() : ch))
    .join("");

  // Pad to CARD_LENGTH - 1 with random digits, then Luhn
  while (partial.length < CARD_LENGTH - 1) partial += randDigit();
  partial = partial.slice(0, CARD_LENGTH - 1);

  const number = luhnComplete(partial);

  const month = normalizeMonth(overrides.month) ?? randMonth();
  const year = normalizeYear(overrides.year) ?? randYear();
  const cvv = normalizeCVV(overrides.cvv) ?? randCVV();

  return `${number}|${month}|${year}|${cvv}`;
}

/**
 * Generates a list of cards with unique card numbers.
 * If enough unique numbers can't be generated, returns whatever was collected.
 */
export function generateUniqueCards(
  binTemplate: string,
  count: number,
  overrides: CardOverrides = {},
): CardString[] {
  const seen = new Set<string>();
  const cards: CardString[] = [];
  const maxAttempts = Math.max(count * 20, 100);

  for (let i = 0; i < maxAttempts && cards.length < count; i++) {
    const card = generateCard(binTemplate, overrides);
    const number = card.split("|")[0];
    if (!seen.has(number)) {
      seen.add(number);
      cards.push(card);
    }
  }

  return cards;
}

/**
 * Extracts only the card number part from a card string.
 */
export function getCardNumber(card: CardString): string {
  return card.split("|")[0] ?? card;
}
