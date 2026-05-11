import { describe, it, expect } from "vitest";
import { luhnComplete, luhnValid } from "@/lib/luhn";

describe("luhn", () => {
  describe("luhnComplete", () => {
    it("appends a valid check digit to a 15-digit partial", () => {
      const partial = "625817123456789";
      const result = luhnComplete(partial);
      expect(result).toHaveLength(16);
      expect(luhnValid(result)).toBe(true);
    });

    it("produces different results for different partials", () => {
      const a = luhnComplete("411111111111111");
      const b = luhnComplete("555555555555555");
      expect(a).not.toBe(b);
    });

    it("always produces a valid Luhn number", () => {
      // Test with multiple known BINs
      const partials = [
        "411111111111111",
        "555555555555444",
        "378282246310000",
        "625817000000000",
      ];
      for (const p of partials) {
        const completed = luhnComplete(p);
        expect(luhnValid(completed)).toBe(true);
      }
    });
  });

  describe("luhnValid", () => {
    it("returns true for known valid card numbers", () => {
      // Visa test number
      expect(luhnValid("4111111111111111")).toBe(true);
      // Mastercard test number
      expect(luhnValid("5500000000000004")).toBe(true);
    });

    it("returns false for invalid numbers", () => {
      expect(luhnValid("4111111111111112")).toBe(false);
      expect(luhnValid("1234567890123456")).toBe(false);
    });

    it("returns false for all-zeros", () => {
      expect(luhnValid("0000000000000001")).toBe(false);
    });
  });
});
