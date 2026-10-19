import { describe, it, expect } from "vitest";
import { computePremium } from "./premium.js";
import type { Item } from "./types.js";

describe("computePremium", () => {
  describe("base item premiums", () => {
    it("should return 5 G for empty item list (only processing fee)", () => {
      expect(computePremium({ items: [], yearsWithMHPCO: 0, isFirstContract: true })).toBe(5);
    });
    it("should return 115 G for a single sword (base 100 + first insurance 10 + fee 5)", () => {
      expect(computePremium({ items: [{ type: "sword" }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(115);
    });
    it("should return 71 G for a single amulet (base 60 + first insurance 6 + fee 5)", () => {
      expect(computePremium({ items: [{ type: "amulet" }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(71);
    });
    it("should return 93 G for a single staff (base 80 + first insurance 8 + fee 5)", () => {
      expect(computePremium({ items: [{ type: "staff" }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(93);
    });
    it("should return 49 G for a single potion (base 40 + first insurance 4 + fee 5)", () => {
      expect(computePremium({ items: [{ type: "potion" }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(49);
    });
    it("should return 33 G for a single rune (base 25 + first insurance 2.5 + fee 5, rounded up)", () => {
      expect(computePremium({ items: [{ type: "rune" }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(33);
    });
    it("should return 33 G for a single moonstone (base 25 + first insurance 2.5 + fee 5, rounded up)", () => {
      expect(computePremium({ items: [{ type: "moonstone" }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(33);
    });
    it("should return 225 G for two swords (200 + first insurance 20 + fee 5)", () => {
      expect(computePremium({ items: [{ type: "sword" }, { type: "sword" }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(225);
    });
  });

  describe("component building block", () => {
    it("should return 60 G for 2 runes (no block: 2 * 25 + first insurance 5 + fee 5)", () => {
      expect(computePremium({ items: [{ type: "rune" }, { type: "rune" }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(60);
    });
    it("should return 71 G for 3 runes (block applies: base 60 + first insurance 6 + fee 5)", () => {
      expect(computePremium({ items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(71);
    });
    it("should return 115 G for 4 runes (no block: 4 * 25 + first insurance 10 + fee 5)", () => {
      expect(computePremium({ items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(115);
    });
    it("should return 198 G for 7 runes (no block: 7 * 25 + first insurance 17.5 + fee 5, rounded up)", () => {
      const items = Array(7).fill({ type: "rune" }) as Item[];
      expect(computePremium({ items, yearsWithMHPCO: 0, isFirstContract: true })).toBe(198);
    });
    it("should return 88 G for 2 runes + 1 moonstone (no block, different types: 75 + first insurance 7.5 + fee 5, rounded up)", () => {
      expect(computePremium({ items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(88);
    });
    it("should return 137 G for 3 runes + 3 moonstones (two separate blocks: 120 + first insurance 12 + fee 5)", () => {
      expect(computePremium({ items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(137);
    });
  });

  describe("item-specific modifiers", () => {
    it("should add 50% curse surcharge for cursed sword -> 165 G (100 + 50 + first insurance 10 + fee 5)", () => {
      expect(computePremium({ items: [{ type: "sword", cursed: true }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(165);
    });
    it("should add 30% high-enchantment surcharge for sword with enchantment 5 -> 145 G", () => {
      expect(computePremium({ items: [{ type: "sword", enchantment: 5 }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(145);
    });
    it("should NOT add high-enchantment surcharge for sword with enchantment 4 -> 115 G", () => {
      expect(computePremium({ items: [{ type: "sword", enchantment: 4 }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(115);
    });
    it("should add both surcharges for cursed sword with enchantment 5 -> 195 G", () => {
      expect(computePremium({ items: [{ type: "sword", enchantment: 5, cursed: true }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(195);
    });
    it("should apply cursed surcharge only to cursed item, modifier scope -> 231 G for cursed sword + plain amulet", () => {
      expect(computePremium({ items: [{ type: "sword", cursed: true }, { type: "amulet" }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(231);
    });
  });

  describe("policy-wide modifiers", () => {
    it("should add 10% first insurance surcharge -> 115 G for 1 sword, 0 years, 1st contract", () => {
      expect(computePremium({ items: [{ type: "sword" }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(115);
    });
    it("should apply 15% follow-up contract discount -> 100 G for 1 sword, 0 years, 2nd contract (100 + first insurance 10 - follow-up 15 + fee 5)", () => {
      expect(computePremium({ items: [{ type: "sword" }], yearsWithMHPCO: 0, isFirstContract: false })).toBe(100);
    });
    it("should apply 20% loyalty discount for customer with exactly 2 years, 1st contract -> 95 G (100 + first insurance 10 - loyalty 20 + fee 5)", () => {
      expect(computePremium({ items: [{ type: "sword" }], yearsWithMHPCO: 2, isFirstContract: true })).toBe(95);
    });
    it("should apply loyalty + follow-up -> 80 G for 1 sword, 2 years, 2nd contract (100 + first insurance 10 - loyalty 20 - follow-up 15 + fee 5)", () => {
      expect(computePremium({ items: [{ type: "sword" }], yearsWithMHPCO: 2, isFirstContract: false })).toBe(80);
    });
  });

  describe("modifier threshold: loyalty requires years >= 2", () => {
    it("should NOT apply loyalty discount for customer with exactly 1 year -> 115 G (no loyalty, only first insurance)", () => {
      expect(computePremium({ items: [{ type: "sword" }], yearsWithMHPCO: 1, isFirstContract: true })).toBe(115);
    });
  });

  describe("rounding", () => {
    it("should round premium up to whole G in MHPCO's favor (32.5 -> 33 for 1 rune)", () => {
      // 1 rune: base 25 + first insurance 2.5 + fee 5 = 32.5, ceil to 33
      expect(computePremium({ items: [{ type: "rune" }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(33);
    });
  });

  describe("integration examples from spec", () => {
    it("should compute premium 165 G for newcomer with cursed sword (0 years, 1st contract, enchantment 3)", () => {
      expect(computePremium({ items: [{ type: "sword", enchantment: 3, cursed: true }], yearsWithMHPCO: 0, isFirstContract: true })).toBe(165);
    });
    it("should compute premium 160 G for long-standing customer's second contract (3 years, 2nd contract, cursed sword enchantment 7)", () => {
      expect(computePremium({ items: [{ type: "sword", enchantment: 7, cursed: true }], yearsWithMHPCO: 3, isFirstContract: false })).toBe(160);
    });
  });
});

// Suppress unused warning for Item type
void (null as unknown as Item);
