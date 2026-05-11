/**
 * Shared type definitions for BIN Tools.
 */

export type CardStatus = "Live" | "Die" | "Unknown";

/**
 * A card record in format: NUMBER|MM|YYYY|CVV
 */
export type CardString = string;

/**
 * Result from chkr.cc API check.
 */
export interface CardResult {
  card: CardString;
  status: CardStatus;
  message: string;
  bank: string;
  brand: string;
  country: string; // emoji flag
  category: string;
  checkedAt: number; // timestamp
}

/**
 * Form values from the BIN input form.
 */
export interface FormValues {
  bin: string;
  count: number;
  month?: string; // "01".."12" or empty
  year?: string; // "2026".."2031" or empty (4-digit)
  cvv?: string; // "000".."999" or empty
}

/**
 * Options passed to card generation for overrides.
 */
export interface CardOverrides {
  month?: string;
  year?: string;
  cvv?: string;
}

/**
 * Runtime stats.
 */
export interface CheckerStats {
  total: number;
  done: number;
  live: number;
  die: number;
  unknown: number;
}

/**
 * Overall runtime status.
 */
export type CheckerStatus = "idle" | "generating" | "running" | "stopped" | "done" | "error";
