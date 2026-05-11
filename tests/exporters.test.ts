import { describe, it, expect } from "vitest";
import {
  toTabRow,
  toCsvRow,
  resultsToTSV,
  resultsToCSV,
} from "@/lib/exporters";
import type { CardResult } from "@/lib/types";

const mockResult: CardResult = {
  card: "4111111111111111|01|2026|123",
  status: "Live",
  message: "Approved",
  bank: "Test Bank",
  brand: "VISA",
  country: "🇺🇸",
  category: "credit",
  checkedAt: 1700000000000,
};

describe("exporters", () => {
  describe("toTabRow", () => {
    it("converts card string to tab-separated format", () => {
      const result = toTabRow("4111111111111111|01|2026|123");
      expect(result).toBe("4111111111111111\t01/26\t123");
    });

    it("returns null for incomplete card strings", () => {
      expect(toTabRow("4111111111111111")).toBeNull();
      expect(toTabRow("4111111111111111|01")).toBeNull();
      expect(toTabRow("4111111111111111|01|2026")).toBeNull();
    });

    it("handles 4-digit year by taking last 2 digits", () => {
      const result = toTabRow("5500000000000004|12|2031|456");
      expect(result).toBe("5500000000000004\t12/31\t456");
    });
  });

  describe("toCsvRow", () => {
    it("produces a comma-separated row with all fields", () => {
      const row = toCsvRow(mockResult);
      const parts = row.split(",");
      expect(parts[0]).toBe("4111111111111111");
      expect(parts[1]).toBe("01");
      expect(parts[2]).toBe("2026");
      expect(parts[3]).toBe("123");
      expect(parts[4]).toBe("Live");
    });

    it("escapes fields containing commas", () => {
      const result: CardResult = {
        ...mockResult,
        bank: "Bank, International",
      };
      const row = toCsvRow(result);
      expect(row).toContain('"Bank, International"');
    });

    it("escapes fields containing quotes", () => {
      const result: CardResult = {
        ...mockResult,
        message: 'Said "hello"',
      };
      const row = toCsvRow(result);
      expect(row).toContain('"Said ""hello"""');
    });
  });

  describe("resultsToTSV", () => {
    it("joins multiple results with newlines", () => {
      const results = [mockResult, mockResult];
      const tsv = resultsToTSV(results);
      const lines = tsv.split("\n");
      expect(lines).toHaveLength(2);
    });

    it("returns empty string for empty array", () => {
      expect(resultsToTSV([])).toBe("");
    });
  });

  describe("resultsToCSV", () => {
    it("includes a header row", () => {
      const csv = resultsToCSV([mockResult]);
      const lines = csv.split("\n");
      expect(lines[0]).toBe(
        "number,mm,yyyy,cvv,status,bank,brand,country,category,message",
      );
      expect(lines).toHaveLength(2);
    });

    it("returns only header for empty array", () => {
      const csv = resultsToCSV([]);
      const lines = csv.split("\n");
      expect(lines).toHaveLength(1);
    });
  });
});
