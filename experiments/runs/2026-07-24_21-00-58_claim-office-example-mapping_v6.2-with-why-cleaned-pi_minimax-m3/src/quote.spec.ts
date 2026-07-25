import { describe, it, expect } from "vitest";
import { calculatePremium } from "./quote.js";
import type { Customer, Item } from "./types.js";

// Default customer: no years of loyalty, first contract.
const newcomer: Customer = { yearsWithMHPCO: 0, contractCount: 0 };

describe("Quote", () => {
  describe("Basic item premiums (no item modifiers, but first insurance always applies)", () => {
    // Each item is a "first insurance" → +10% × policyBase × numItems.
    // Newcomer (0 years, contractCount=0): no loyalty, no follow-up.
    // So expected premium = basePremium * (1 + 0.10 * numItems) + 5.

    it("empty item list: premium 5 G (only processing fee, no items = no first insurance)", () => {
      expect(calculatePremium([], newcomer)).toBe(5);
    });

    it("single sword: 100 base + 10 first insurance + 5 fee = 115 G", () => {
      expect(calculatePremium([{ type: "sword" }], newcomer)).toBe(115);
    });

    it("single amulet: 60 base + 6 first insurance + 5 fee = 71 G", () => {
      expect(calculatePremium([{ type: "amulet" }], newcomer)).toBe(71);
    });

    it("single staff: 80 base + 8 first insurance + 5 fee = 93 G", () => {
      expect(calculatePremium([{ type: "staff" }], newcomer)).toBe(93);
    });

    it("single potion: 40 base + 4 first insurance + 5 fee = 49 G", () => {
      expect(calculatePremium([{ type: "potion" }], newcomer)).toBe(49);
    });
  });

  describe("Components and building blocks (no modifiers)", () => {
    // With the default newcomer customer (0 years, 1st contract), the only
    // policy-wide modifier in play is first insurance: 10% × policyBase × numItems.
    // No loyalty discount (years < 2) and no follow-up discount (contractCount < 1).
    // So expected premium = basePremium + 0.10 * basePremium * numItems + 5.

    it("2 runes (no block): 50 base + 10 first insurance + 5 fee = 65 G", () => {
      expect(calculatePremium(
        [{ type: "rune" }, { type: "rune" }],
        newcomer,
      )).toBe(65);
    });

    it("3 runes (block applies): 60 base + 18 first insurance + 5 fee = 83 G", () => {
      expect(calculatePremium(
        [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        newcomer,
      )).toBe(83);
    });

    it("4 runes (no block): 100 base + 40 first insurance + 5 fee = 145 G", () => {
      expect(calculatePremium(
        [
          { type: "rune" }, { type: "rune" },
          { type: "rune" }, { type: "rune" },
        ],
        newcomer,
      )).toBe(145);
    });
    it("7 runes (no block): 175 base + 122.5 first insurance + 5 fee → 303 G (rounded up)", () => {
      expect(calculatePremium(
        [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
        ],
        newcomer,
      )).toBe(303);
    });
    it("2 runes + 1 moonstone (no block, different types): 75 base + 22.5 first insurance + 5 fee → 103 G", () => {
      expect(calculatePremium(
        [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        newcomer,
      )).toBe(103);
    });
    it("3 runes + 3 moonstones (two separate blocks): 120 base + 72 first insurance + 5 fee = 197 G", () => {
      expect(calculatePremium(
        [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
        newcomer,
      )).toBe(197);
    });
  });

  describe("Item-specific modifiers (cursed, enchantment)", () => {
    it("cursed sword: 100 + 50 curse = 150 item total; + 10 first insurance + 5 fee = 165 G", () => {
      expect(calculatePremium(
        [{ type: "sword", cursed: true }],
        newcomer,
      )).toBe(165);
    });

    it("sword with enchantment 5: 100 + 30 = 130 item total; + 10 first insurance + 5 fee = 145 G", () => {
      expect(calculatePremium(
        [{ type: "sword", enchantment: 5 }],
        newcomer,
      )).toBe(145);
    });
    it("sword with enchantment 4: no high-enchantment surcharge → item total 100; + 10 first insurance + 5 fee = 115 G", () => {
      expect(calculatePremium(
        [{ type: "sword", enchantment: 4 }],
        newcomer,
      )).toBe(115);
    });
    it("cursed sword with enchantment 5: 100 + 50 + 30 = 180 item total; + 10 first insurance + 5 fee = 195 G", () => {
      expect(calculatePremium(
        [{ type: "sword", cursed: true, enchantment: 5 }],
        newcomer,
      )).toBe(195);
    });
    it("cursed sword with enchantment 4: 100 + 50 = 150 item total; + 10 first insurance + 5 fee = 165 G (only curse)", () => {
      expect(calculatePremium(
        [{ type: "sword", cursed: true, enchantment: 4 }],
        newcomer,
      )).toBe(165);
    });
  });

  describe("Modifier scope on multi-item policies", () => {
    it("cursed sword + plain amulet: 100 + 60 + 50 (curse on sword) = 210 base + 32 first insurance + 5 fee = 247 G", () => {
      expect(calculatePremium(
        [{ type: "sword", cursed: true }, { type: "amulet" }],
        newcomer,
      )).toBe(247);
    });
  });

  describe("Policy-wide modifiers", () => {
    it("customer with exactly 2 years: loyalty discount applies (-20% of policy base = -20 G)", () => {
      const loyal = { yearsWithMHPCO: 2, contractCount: 0 };
      expect(calculatePremium(
        [{ type: "sword" }],
        loyal,
      )).toBe(95); // 100 − 20 + 10 + 5
    });

    it("customer with 1 year: no loyalty discount (still -20 not applied)", () => {
      const oneYear = { yearsWithMHPCO: 1, contractCount: 0 };
      expect(calculatePremium(
        [{ type: "sword" }],
        oneYear,
      )).toBe(115); // 100 + 10 + 5 (no loyalty)
    });
    it("first insurance surcharge: +10% per item in quote (scales with item count)", () => {
      // Two swords with newcomer: base 200, first insurance = 10% × 200 × 2 = 40
      // Total: 200 + 40 + 5 = 245
      expect(calculatePremium(
        [{ type: "sword" }, { type: "sword" }],
        newcomer,
      )).toBe(245);
    });

    it("follow-up contract: contractCount >= 1 → -15% on policy base", () => {
      // Sword on second contract (contractCount=1), 0 years
      // base 100, first insurance 10, follow-up = -15, no loyalty
      // Total: 100 + 10 - 15 + 5 = 100
      const secondContract = { yearsWithMHPCO: 0, contractCount: 1 };
      expect(calculatePremium(
        [{ type: "sword" }],
        secondContract,
      )).toBe(100);
    });
  });

  describe("Rounding", () => {
    it("premium calculation that yields a fraction rounds UP (MHPCO's favor)", () => {
      // 2 runes + 1-year customer + 1 prior contract:
      // base 50, first insurance 10, follow-up = -15% × 50 = -7.5
      // Total: 50 + 10 - 7.5 + 5 = 57.5 → ceil 58
      const customer = { yearsWithMHPCO: 1, contractCount: 1 };
      expect(calculatePremium(
        [{ type: "rune" }, { type: "rune" }],
        customer,
      )).toBe(58);
    });
  });

  describe("Integration examples from spec", () => {
    it("newcomer (0 years, 1st contract) with cursed sword (steel, enchantment 3): 165 G", () => {
      // 100 base + 50 curse = 150 item total
      // + 10 first insurance + 5 fee = 165 (no loyalty, no follow-up)
      expect(calculatePremium(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        { yearsWithMHPCO: 0, contractCount: 0 },
      )).toBe(165);
    });
    it.todo(
      "long-standing customer (3 years, 2nd contract) with cursed sword (steel, enchantment 7): 160 G",
    );
  });
});
