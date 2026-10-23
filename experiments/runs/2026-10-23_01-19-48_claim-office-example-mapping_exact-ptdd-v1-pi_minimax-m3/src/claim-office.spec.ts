import { describe, expect, it } from "vitest";
import { ClaimOfficeError, quotePremium, type Item } from "./quote.js";

describe("MHPCO Claim Office - Quote", () => {
  describe("base premiums (main items)", () => {
    it("empty items list → premium 5 (only processing fee)", () => {
      expect(quotePremium([], { yearsWithMHPCO: 0, isFirstContract: true })).toBe(5);
    });
    it("sword → premium 115 (100 base + 10 first insurance + 5 fee)", () => {
      expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 0, isFirstContract: true })).toBe(115);
    });
    it("amulet → premium 71 (60 base + 6 first insurance + 5 fee)", () => {
      expect(quotePremium([{ type: "amulet" }], { yearsWithMHPCO: 0, isFirstContract: true })).toBe(71);
    });
    it("staff → premium 93 (80 base + 8 first insurance + 5 fee)", () => {
      expect(quotePremium([{ type: "staff" }], { yearsWithMHPCO: 0, isFirstContract: true })).toBe(93);
    });
    it("potion → premium 49 (40 base + 4 first insurance + 5 fee)", () => {
      expect(quotePremium([{ type: "potion" }], { yearsWithMHPCO: 0, isFirstContract: true })).toBe(49);
    });
  });

  describe("component base premiums", () => {
    it("1 rune → premium 33 (25 base + 2.5 first insurance + 5 fee, rounds up)", () => {
      expect(quotePremium([{ type: "rune" }], { yearsWithMHPCO: 0, isFirstContract: true })).toBe(33);
    });
    it("2 runes → premium 60 (50 base + 5 first insurance + 5 fee, no block)", () => {
      expect(quotePremium([{ type: "rune" }, { type: "rune" }], { yearsWithMHPCO: 0, isFirstContract: true })).toBe(60);
    });
    it("3 runes → premium 73 (60 block + 7.5 first insurance + 5 fee, rounds up)", () => {
      expect(
        quotePremium(
          [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          { yearsWithMHPCO: 0, isFirstContract: true },
        ),
      ).toBe(73);
    });
    it("4 runes → premium 115 (100 base + 10 first insurance + 5 fee, no block - exceeds 3)", () => {
      expect(
        quotePremium(
          [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          { yearsWithMHPCO: 0, isFirstContract: true },
        ),
      ).toBe(115);
    });
    it("7 runes → premium 198 (175 base + 17.5 first insurance + 5 fee, rounds up)", () => {
      const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
      expect(quotePremium(items, { yearsWithMHPCO: 0, isFirstContract: true })).toBe(198);
    });
    it("2 runes + 1 moonstone → premium 88 (75 base + 7.5 first insurance + 5 fee, no block - different types)", () => {
      expect(
        quotePremium(
          [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          { yearsWithMHPCO: 0, isFirstContract: true },
        ),
      ).toBe(88);
    });
    it("3 runes + 3 moonstones → premium 140 (120 = two separate blocks + 15 first insurance + 5 fee)", () => {
      const items = [
        ...Array.from({ length: 3 }, () => ({ type: "rune" as const })),
        ...Array.from({ length: 3 }, () => ({ type: "moonstone" as const })),
      ];
      expect(quotePremium(items, { yearsWithMHPCO: 0, isFirstContract: true })).toBe(140);
    });
  });

  describe("item-specific premium modifiers", () => {
    it("cursed sword → premium 165 (100 + 50 curse + 10 first insurance + 5 fee)", () => {
      expect(
        quotePremium(
          [{ type: "sword", cursed: true }],
          { yearsWithMHPCO: 0, isFirstContract: true },
        ),
      ).toBe(165);
    });
    it("sword enchantment 5 → premium 145 (100 + 30 high-enchant + 10 first insurance + 5 fee)", () => {
      expect(
        quotePremium(
          [{ type: "sword", enchantment: 5 }],
          { yearsWithMHPCO: 0, isFirstContract: true },
        ),
      ).toBe(145);
    });
    it("sword enchantment 4 → premium 115 (100 + 10 first insurance + 5 fee, no high-enchant)", () => {
      expect(
        quotePremium(
          [{ type: "sword", enchantment: 4 }],
          { yearsWithMHPCO: 0, isFirstContract: true },
        ),
      ).toBe(115);
    });
    it("cursed sword enchantment 5 → premium 195 (100 + 50 curse + 30 high-enchant + 10 first insurance + 5 fee, both apply)", () => {
      expect(
        quotePremium(
          [{ type: "sword", cursed: true, enchantment: 5 }],
          { yearsWithMHPCO: 0, isFirstContract: true },
        ),
      ).toBe(195);
    });
    it("cursed amulet → premium 101 (60 + 30 curse + 6 first insurance + 5 fee)", () => {
      expect(
        quotePremium(
          [{ type: "amulet", cursed: true }],
          { yearsWithMHPCO: 0, isFirstContract: true },
        ),
      ).toBe(101);
    });
    it("sword enchantment 7 → premium 145 (100 + 30 high-enchant + 10 first insurance + 5 fee, ≥5 threshold)", () => {
      expect(
        quotePremium(
          [{ type: "sword", enchantment: 7 }],
          { yearsWithMHPCO: 0, isFirstContract: true },
        ),
      ).toBe(145);
    });
  });

  describe("policy-wide premium modifiers", () => {
    it("customer with exactly 2 years → loyalty discount applies (sword 100 - 20 + 10 + 5 = 95)", () => {
      expect(
        quotePremium(
          [{ type: "sword" }],
          { yearsWithMHPCO: 2, isFirstContract: true },
        ),
      ).toBe(95);
    });
    it("customer with 1 year → no loyalty discount (sword stays 115)", () => {
      expect(
        quotePremium(
          [{ type: "sword" }],
          { yearsWithMHPCO: 1, isFirstContract: true },
        ),
      ).toBe(115);
    });
    it("customer with 0 years → no loyalty discount (sword stays 115)", () => {
      expect(
        quotePremium(
          [{ type: "sword" }],
          { yearsWithMHPCO: 0, isFirstContract: true },
        ),
      ).toBe(115);
    });
    it("customer with 2 years, second contract → loyalty + follow-up apply (sword 100 - 20 + 10 - 15 + 5 = 80)", () => {
      expect(
        quotePremium(
          [{ type: "sword" }],
          { yearsWithMHPCO: 2, isFirstContract: false },
        ),
      ).toBe(80);
    });
    it("customer with 0 years, first contract → no loyalty, no follow-up (sword stays 115)", () => {
      expect(
        quotePremium(
          [{ type: "sword" }],
          { yearsWithMHPCO: 0, isFirstContract: true },
        ),
      ).toBe(115);
    });
  });

  describe("modifier scope on multi-item policies", () => {
    it("cursed sword + plain amulet → premium 231 (160 base + 50 curse on sword + 16 first insurance + 5 fee)", () => {
      expect(
        quotePremium(
          [{ type: "sword", cursed: true }, { type: "amulet" }],
          { yearsWithMHPCO: 0, isFirstContract: true },
        ),
      ).toBe(231);
    });
  });

  describe("integration examples", () => {
    it("newcomer (0 years, 1st contract) + cursed sword (steel, enchantment 3) → premium 165", () => {
      expect(
        quotePremium(
          [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          { yearsWithMHPCO: 0, isFirstContract: true },
        ),
      ).toBe(165);
    });
    it("long-standing customer (3 years, 2nd contract) + cursed sword (steel, enchantment 7) → premium 160", () => {
      expect(
        quotePremium(
          [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          { yearsWithMHPCO: 3, isFirstContract: false },
        ),
      ).toBe(160);
    });
  });

  describe("rounding in MHPCO's favor", () => {
    it("premium calculation 197.5 → final 198 (round up, exercised by 7 runes)", () => {
      const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
      expect(quotePremium(items, { yearsWithMHPCO: 0, isFirstContract: true })).toBe(198);
    });
  });

  describe("error cases", () => {
    it("quote with unknown item type → throws ClaimOfficeError", () => {
      expect(() =>
        quotePremium(
          [{ type: "broomstick" }],
          { yearsWithMHPCO: 0, isFirstContract: true },
        ),
      ).toThrow(ClaimOfficeError);
    });
  });
});
