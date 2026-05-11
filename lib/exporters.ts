/**
 * Exporters for check results - TSV, CSV, clipboard.
 */

import type { CardResult, CardString } from "./types";

/**
 * Converts a card string "NUMBER|MM|YYYY|CVV" to "NUMBER\tMM/YY\tCVV" format.
 */
export function toTabRow(card: CardString): string | null {
  const parts = card.split("|").map((s) => s.trim());
  const [number, mm, yyyy, cvv] = parts;
  if (!number || !mm || !yyyy || !cvv) return null;
  return `${number}\t${mm}/${yyyy.slice(-2)}\t${cvv}`;
}

/**
 * Converts a card string to plain CSV row.
 */
export function toCsvRow(r: CardResult): string {
  const parts = r.card.split("|");
  const [number, mm, yyyy, cvv] = parts;
  const safe = (s: string) =>
    /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;

  return [
    safe(number ?? ""),
    safe(mm ?? ""),
    safe(yyyy ?? ""),
    safe(cvv ?? ""),
    safe(r.status),
    safe(r.bank),
    safe(r.brand),
    safe(r.country),
    safe(r.category),
    safe(r.message),
  ].join(",");
}

export function resultsToTSV(results: CardResult[]): string {
  return results.map((r) => toTabRow(r.card)).filter(Boolean).join("\n");
}

export function resultsToCSV(results: CardResult[]): string {
  const header = [
    "number",
    "mm",
    "yyyy",
    "cvv",
    "status",
    "bank",
    "brand",
    "country",
    "category",
    "message",
  ].join(",");
  return [header, ...results.map(toCsvRow)].join("\n");
}

/**
 * Copies text to the clipboard using the modern async API with a fallback.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Ignore, try fallback
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Triggers a browser download of the given text as a file.
 */
export function downloadTextFile(
  text: string,
  filename: string,
  mime = "text/plain;charset=utf-8",
): void {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
