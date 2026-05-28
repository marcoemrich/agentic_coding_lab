import { describe, it, expect } from "vitest";
import { calculatePremium } from "./premium.js";

describe("calculatePremium", () => {
  describe("empty item list", () => {
    it("should return 5 G for empty item list — only processing fee (0 base + 0 first insurance + 5 fee)", () => {
      expect(calculatePremium([], 0, false)).toBe(5);
    });
  });

  describe("single items — base premiums", () => {
    it("should return 115 G for a single non-cursed non-high-enchantment sword, 0 years, first contract (100 base + 10 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "sword" }], 0, false)).toBe(115);
    });
    it("should return 71 G for a single non-cursed amulet, 0 years, first contract (60 base + 6 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "amulet" }], 0, false)).toBe(71);
    });
    it("should return 93 G for a single non-cursed staff, 0 years, first contract (80 base + 8 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "staff" }], 0, false)).toBe(93);
    });
    it("should return 49 G for a single non-cursed potion, 0 years, first contract (40 base + 4 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "potion" }], 0, false)).toBe(49);
    });
  });

  describe("components — single and multiple", () => {
    it("should return 33 G for a single rune, 0 years, first contract (25 base + 2.5 first insurance = 27.5 + 5 fee = 32.5 → 33)", () => {
      expect(calculatePremium([{ type: "rune" }], 0, false)).toBe(33);
    });
    it("should return 33 G for a single moonstone, 0 years, first contract (25 base + 2.5 first insurance = 27.5 + 5 fee = 32.5 → 33)", () => {
      expect(calculatePremium([{ type: "moonstone" }], 0, false)).toBe(33);
    });
  });

  describe("building blocks of 3 alike components", () => {
    it("should return 60 G for 2 runes — no block, 0 years, first contract (50 base + 5 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "rune" }, { type: "rune" }], 0, false)).toBe(60);
    });
    it("should return 71 G for 3 runes — block applies, 0 years, first contract (60 base + 6 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }], 0, false)).toBe(71);
    });
    it("should return 115 G for 4 runes — no block (block requires exactly 3), 0 years, first contract (100 base + 10 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], 0, false)).toBe(115);
    });
    it("should return 198 G for 7 runes — no block, 0 years, first contract (175 base + 17.5 first insurance = 192.5 + 5 fee = 197.5 → 198 rounded up)", () => {
      expect(calculatePremium(Array(7).fill({ type: "rune" }), 0, false)).toBe(198);
    });
  });

  describe("\"alike\" components — same type required", () => {
    it("should return 88 G for 2 runes + 1 moonstone — no block (different types), 0 years, first contract (75 base + 7.5 first insurance = 82.5 + 5 fee = 87.5 → 88)", () => {
      expect(calculatePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], 0, false)).toBe(88);
    });
    it("should return 137 G for 3 runes + 3 moonstones — two separate blocks, 0 years, first contract (120 base + 12 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }], 0, false)).toBe(137);
    });
  });

  describe("cursed items — 50% risk surcharge", () => {
    it("should return 165 G for a cursed sword, 0 years, first contract (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "sword", cursed: true }], 0, false)).toBe(165);
    });
    it("should return 101 G for a cursed amulet, 0 years, first contract (60 base + 30 curse + 6 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "amulet", cursed: true }], 0, false)).toBe(101);
    });
  });

  describe("highly enchanted items — enchantment ≥ 5 adds 30% surcharge", () => {
    it("should return 145 G for a non-cursed sword enchantment 5, 0 years, first contract (100 base + 30 enchant + 10 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "sword", enchantment: 5 }], 0, false)).toBe(145);
    });
    it("should return 115 G for a non-cursed sword enchantment 4 — no high-enchantment surcharge, 0 years, first contract (100 base + 10 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "sword", enchantment: 4 }], 0, false)).toBe(115);
    });
  });

  describe("both cursed and high enchantment modifiers", () => {
    it("should return 195 G for a cursed sword enchantment 5, 0 years, first contract (100 base + 50 curse + 30 enchant + 10 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "sword", cursed: true, enchantment: 5 }], 0, false)).toBe(195);
    });
  });

  describe("loyalty discount — ≥ 2 years gives 20% discount", () => {
    it("should return 95 G for a non-cursed sword with loyalty discount (exactly 2 years), first contract (100 base − 20 loyalty + 10 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "sword" }], 2, false)).toBe(95);
    });
    it("should return 115 G for a non-cursed sword with 1 year — no loyalty discount, first contract (100 base + 10 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "sword" }], 1, false)).toBe(115);
    });
  });

  describe("first insurance surcharge — always applies", () => {
    it("should return 115 G for a non-cursed sword, 0 years, first contract — first insurance 10% always applies (100 base + 10 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "sword" }], 0, false)).toBe(115);
    });
  });

  describe("follow-up contract discount — 15% after first contract", () => {
    it("should return 100 G for a non-cursed sword, 0 years, follow-up contract (100 base − 15 follow-up + 10 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "sword" }], 0, true)).toBe(100);
    });
  });

  describe("modifier scope — item-specific vs policy-wide", () => {
    it("should return 231 G for cursed sword + plain amulet, 0 years, first contract — curse surcharge on sword only, first insurance on policy base (160 base + 50 curse + 16 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "sword", cursed: true }, { type: "amulet" }], 0, false)).toBe(231);
    });
  });

  describe("integration examples", () => {
    it("should return 165 G for newcomer (0 years, first contract) with a cursed sword (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
      expect(calculatePremium([{ type: "sword", cursed: true }], 0, false)).toBe(165);
    });
    it("should return 160 G for long-standing customer (3 years, second contract) with cursed sword enchantment 7 (100 base + 50 curse + 30 enchant − 20 loyalty + 10 first − 15 follow-up + 5 fee)", () => {
      expect(calculatePremium([{ type: "sword", cursed: true, enchantment: 7 }], 3, true)).toBe(160);
    });
  });

  describe("error handling", () => {
    it("should throw error for unknown item type (e.g. \"broomstick\")", () => {
      expect(() => calculatePremium([{ type: "broomstick" as unknown as ItemType }], 0, false)).toThrow();
    });
  });
});