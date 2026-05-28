import { describe, it, expect } from "vitest";
import { processClaim } from "./claim.js";

describe("processClaim", () => {
  describe("standard reimbursement — no special clauses", () => {
    it("should return payout 400 G and remainingCap 1600 G for regular sword (steel, enchantment 3), damage 500 G — full reimbursement minus 100 G deductible (500 − 100 = 400)", () => {
      const result = processClaim(
        [{ type: "sword", enchantment: 3 }],
        { cause: "test", damages: [{ itemType: "sword", amount: 500 }] },
        0
      );
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
    it("should return payout 100 G and remainingCap 400 G for rune, damage 200 G — full reimbursement minus 100 G deductible (200 − 100 = 100)", () => {
      const result = processClaim(
        [{ type: "rune" }],
        { cause: "test", damages: [{ itemType: "rune", amount: 200 }] },
        0
      );
      expect(result.payout).toBe(100);
      expect(result.remainingCap).toBe(400);
    });
  });

  describe("deductible per damage event — one deductible per damaged item", () => {
    it("should return payout 600 G for dragon attack damaging sword (500) and amulet (300) — 100 G deductible per item (400 + 200 = 600)", () => {
      const result = processClaim(
        [{ type: "sword" }, { type: "amulet" }],
        { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] },
        0
      );
      expect(result.payout).toBe(600);
    });
  });

  describe("high enchantment clause — enchantment ≥ 8 reimbursed at 50%", () => {
    it("should return payout 400 G for steel sword enchantment 9, damage 1000 G — 50% then deductible (500 − 100 = 400)", () => {
      const result = processClaim(
        [{ type: "sword", enchantment: 9 }],
        { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] },
        0
      );
      expect(result.payout).toBe(400);
    });
  });

  describe("dragon material clause — full reimbursement", () => {
    it("should return payout 700 G for dragon-material sword enchantment 5, damage 800 G — full reimbursement, then deductible (800 − 100 = 700)", () => {
      const result = processClaim(
        [{ type: "sword", enchantment: 5, material: "dragon" }],
        { cause: "test", damages: [{ itemType: "sword", amount: 800 }] },
        0
      );
      expect(result.payout).toBe(700);
    });
  });

  describe("both clauses — 50% rule wins over dragon material", () => {
    it("should return payout 400 G for dragon-material sword enchantment 9, damage 1000 G — 50% rule wins (500 − 100 = 400)", () => {
      const result = processClaim(
        [{ type: "sword", enchantment: 9, material: "dragon" }],
        { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] },
        0
      );
      expect(result.payout).toBe(400);
    });
  });

  describe("cap — twice insurance sum", () => {
    it("should have cap 3200 G for sword + amulet policy (insurance sum 1600 = 1000 + 600, cap 2×1600)", () => {
      const result = processClaim(
        [{ type: "sword" }, { type: "amulet" }],
        { cause: "test", damages: [{ itemType: "sword", amount: 100 }] },
        0
      );
      expect(result.payout).toBe(0);
      expect(result.remainingCap).toBe(3200);
    });
    it("should have cap 2000 G for cursed sword — cap based on unmodified insurance value 1000 (2×1000)", () => {
      const result = processClaim(
        [{ type: "sword", cursed: true }],
        { cause: "test", damages: [{ itemType: "sword", amount: 100 }] },
        0
      );
      expect(result.remainingCap).toBe(2000);
    });
    it("should have insurance sum 1750 G for sword + 3 runes — block discount affects premium only, not insurance sum (1000 + 3×250)", () => {
      const result = processClaim(
        [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        { cause: "test", damages: [{ itemType: "sword", amount: 100 }] },
        0
      );
      expect(result.payout).toBe(0);
      expect(result.remainingCap).toBe(3500);
    });
  });

  describe("multiple items of same type", () => {
    it("should have insurance sum 2000 G and cap 4000 G for policy with two swords (2×1000)", () => {
      const result = processClaim(
        [{ type: "sword" }, { type: "sword" }],
        { cause: "test", damages: [{ itemType: "sword", amount: 100 }] },
        0
      );
      expect(result.remainingCap).toBe(4000);
    });
    it("should process two sword damages with separate deductibles (500→400, 300→200 = 600 total) when two swords insured", () => {
      const result = processClaim(
        [{ type: "sword" }, { type: "sword" }],
        { cause: "test", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] },
        0
      );
      expect(result.payout).toBe(600);
    });
  });

  describe("cap exhaustion", () => {
    it("should return first claim payout 1400 G, remainingCap 600 G for two successive 1500 G claims on a sword (2000 cap, 1400 payout → 600 remaining)", () => {
      const result = processClaim(
        [{ type: "sword" }],
        { cause: "test", damages: [{ itemType: "sword", amount: 1500 }] },
        0
      );
      expect(result.payout).toBe(1400);
      expect(result.remainingCap).toBe(600);
    });
    it("should return second claim payout 600 G, remainingCap 0 G for two successive 1500 G claims on a sword (cap exhausted)", () => {
      const result = processClaim(
        [{ type: "sword" }],
        { cause: "test", damages: [{ itemType: "sword", amount: 1500 }] },
        1400
      );
      expect(result.payout).toBe(600);
      expect(result.remainingCap).toBe(0);
    });
  });

  describe("rounding in MHPCO's favor — payout rounds down", () => {
    it("should return payout 350 G for steel sword enchantment 9, damage 901 G — 50% = 450.5, deductible 100 → 350.5 → 350 rounded down", () => {
      const result = processClaim(
        [{ type: "sword", enchantment: 9 }],
        { cause: "test", damages: [{ itemType: "sword", amount: 901 }] },
        0
      );
      expect(result.payout).toBe(350);
    });
  });

  describe("error handling", () => {
    it("should throw error when damage entry references an item type not in the policy", () => {
      expect(() =>
        processClaim(
          [{ type: "sword" }],
          { cause: "test", damages: [{ itemType: "amulet", amount: 100 }] },
          0
        )
      ).toThrow();
    });
    it("should throw error when damages contain more entries of a type than insured (two sword damages, one sword insured)", () => {
      expect(() =>
        processClaim(
          [{ type: "sword" }],
          { cause: "test", damages: [{ itemType: "sword", amount: 100 }, { itemType: "sword", amount: 100 }] },
          0
        )
      ).toThrow();
    });
    it("should throw error for negative damage amount", () => {
      expect(() =>
        processClaim(
          [{ type: "sword" }],
          { cause: "test", damages: [{ itemType: "sword", amount: -200 }] },
          0
        )
      ).toThrow();
    });
  });
});