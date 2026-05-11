import { describe, it, expect } from "vitest";
import {
  parseBinTemplate,
  generateCard,
  generateUniqueCards,
  getCardNumber,
} from "@/lib/card";
import { luhnValid } from "@/lib/luhn";

describe("card", () => {
  describe("parseBinTemplate", () => {
    it("strips non-digit/non-x characters", () => {
      expect(parseBinTemplate("6258 17")).toBe("625817");
      expect(parseBinTemplate("625-817-xxxx")).toBe("625817xxxx");
    });

    it("lowercases X to x", () => {
      expect(parseBinTemplate("625817XXXX")).toBe("625817xxxx");
    });

    it("trims whitespace", () => {
      expect(parseBinTemplate("  625817  ")).toBe("625817");
    });

    it("returns empty string for empty input", () => {
      expect(parseBinTemplate("")).toBe("");
      expect(parseBinTemplate("   ")).toBe("");
    });
  });

  describe("generateCard", () => {
    it("generates a card in NUMBER|MM|YYYY|CVV format", () => {
      const card = generateCard("625817");
      const parts = card.split("|");
      expect(parts).toHaveLength(4);

      const [number, mm, yyyy, cvv] = parts;
      expect(number).toHaveLength(16);
      expect(mm).toMatch(/^(0[1-9]|1[0-2])$/);
      expect(yyyy).toMatch(/^\d{4}$/);
      expect(cvv).toMatch(/^\d{3,4}$/);
    });

    it("generates a Luhn-valid card number", () => {
      const card = generateCard("411111");
      const number = card.split("|")[0];
      expect(luhnValid(number)).toBe(true);
    });

    it("preserves the BIN prefix", () => {
      const card = generateCard("625817");
      const number = card.split("|")[0];
      expect(number.startsWith("625817")).toBe(true);
    });

    it("respects month override", () => {
      const card = generateCard("625817", { month: "03" });
      const mm = card.split("|")[1];
      expect(mm).toBe("03");
    });

    it("respects year override", () => {
      const card = generateCard("625817", { year: "2028" });
      const yyyy = card.split("|")[2];
      expect(yyyy).toBe("2028");
    });

    it("respects 2-digit year override", () => {
      const card = generateCard("625817", { year: "28" });
      const yyyy = card.split("|")[2];
      expect(yyyy).toBe("2028");
    });

    it("respects CVV override", () => {
      const card = generateCard("625817", { cvv: "456" });
      const cvv = card.split("|")[3];
      expect(cvv).toBe("456");
    });

    it("expands x wildcards to random digits", () => {
      const card = generateCard("625817xxxxxxxxxx");
      const number = card.split("|")[0];
      expect(number).toHaveLength(16);
      expect(number.startsWith("625817")).toBe(true);
      expect(luhnValid(number)).toBe(true);
    });
  });

  describe("generateUniqueCards", () => {
    it("generates the requested number of cards", () => {
      const cards = generateUniqueCards("625817", 10);
      expect(cards).toHaveLength(10);
    });

    it("generates unique card numbers", () => {
      const cards = generateUniqueCards("625817", 50);
      const numbers = cards.map((c) => c.split("|")[0]);
      const unique = new Set(numbers);
      expect(unique.size).toBe(50);
    });

    it("all generated cards are Luhn-valid", () => {
      const cards = generateUniqueCards("411111", 20);
      for (const card of cards) {
        const number = card.split("|")[0];
        expect(luhnValid(number)).toBe(true);
      }
    });
  });

  describe("getCardNumber", () => {
    it("extracts the number part from a card string", () => {
      expect(getCardNumber("4111111111111111|01|2026|123")).toBe(
        "4111111111111111",
      );
    });

    it("returns the full string if no pipe separator", () => {
      expect(getCardNumber("4111111111111111")).toBe("4111111111111111");
    });
  });
});
