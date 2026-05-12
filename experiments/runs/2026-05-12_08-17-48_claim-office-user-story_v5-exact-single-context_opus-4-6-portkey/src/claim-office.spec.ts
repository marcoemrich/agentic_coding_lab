import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

function quoteScenario(
  items: Array<{ type: string; material: string; enchantment: number; cursed: boolean }>,
  customer: { yearsWithMHPCO: number } = { yearsWithMHPCO: 0 },
) {
  return processScenario({
    customer,
    steps: [{ op: "quote" as const, items }],
  });
}

describe("Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should calculate premium for a single sword (base + first-insurance surcharge + processing fee)", () => {
      const result = quoteScenario([
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ]);
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should calculate premium for a single amulet", () => {
      const result = quoteScenario([
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ]);
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("should calculate premium for a single staff", () => {
      const result = quoteScenario([
        { type: "staff", material: "oak", enchantment: 1, cursed: false },
      ]);
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("should calculate premium for a single potion", () => {
      const result = quoteScenario([
        { type: "potion", material: "glass", enchantment: 0, cursed: false },
      ]);
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("should calculate premium for a single component", () => {
      const result = quoteScenario([
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ]);
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("should sum premiums for multiple items in one quote", () => {
      const result = quoteScenario([
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ]);
      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
    it("should apply special 60G building block premium for 3 alike components", () => {
      const result = quoteScenario([
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ]);
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("should add 50% risk surcharge for cursed items", () => {
      const result = quoteScenario([
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
      ]);
      expect(result).toEqual({ results: [{ premium: 170 }] });
    });
    it("should add 30% risk surcharge for highly enchanted items (enchantment >= 5)", () => {
      const result = quoteScenario([
        { type: "staff", material: "oak", enchantment: 6, cursed: false },
      ]);
      expect(result).toEqual({ results: [{ premium: 120 }] });
    });
    it("should apply both cursed and enchantment surcharges on the same item", () => {
      const result = quoteScenario([
        { type: "amulet", material: "silver", enchantment: 7, cursed: true },
      ]);
      expect(result).toEqual({ results: [{ premium: 134 }] });
    });
    it("should apply 20% loyalty discount for customers with 2+ years", () => {
      const result = quoteScenario(
        [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        { yearsWithMHPCO: 3 },
      );
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("should apply 15% discount on each contract after the first", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({
        results: [{ premium: 115 }, { premium: 90 }],
      });
    });
    it("should round premium up in MHPCO's favor", () => {
      // Enchanted potion: 40 * 1.3 = 52, first insurance: 52 * 1.1 = 57.2
      // Ceil(57.2) = 58 + 5 fee = 63 (rounds up in MHPCO's favor)
      const result = quoteScenario([
        { type: "potion", material: "glass", enchantment: 5, cursed: false },
      ]);
      expect(result).toEqual({ results: [{ premium: 63 }] });
    });
  });

  describe("Processing a claim", () => {
    it("should apply 100G deductible per damage event", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [{ premium: 71 }, { payout: 200, remainingCap: 1000 }],
      });
    });
    it("should return zero payout when damage is within deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "staff", material: "oak", enchantment: 1, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "staff", amount: 50 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [{ premium: 93 }, { payout: 0, remainingCap: 1600 }],
      });
    });
    it("should cap total payout at twice the insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 800 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "flood",
              damages: [{ itemType: "amulet", amount: 900 }],
            },
          },
        ],
      });
      // Amulet insurance value = 600, cap = 2 * 600 = 1200
      // Claim 1: 800 - 100 deductible = 700 payout, remainingCap = 1200 - 700 = 500
      // Claim 2: 900 - 100 deductible = 800, but capped at remainingCap 500, payout = 500, remainingCap = 0
      expect(result).toEqual({
        results: [
          { premium: 71 },
          { payout: 700, remainingCap: 500 },
          { payout: 500, remainingCap: 0 },
        ],
      });
    });
    it("should reimburse damage to highly enchanted items (enchantment >= 8) at 50%", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 400 }],
            },
          },
        ],
      });
      // Sword enchantment 9 >= 8: reimbursed at 50%
      // Reimbursable = 400 * 0.5 = 200, minus 100 deductible = 100 payout
      // Sword insurance value = 1000, cap = 2000, remainingCap = 2000 - 100 = 1900
      expect(result).toEqual({
        results: [{ premium: 148 }, { payout: 100, remainingCap: 1900 }],
      });
    });
    it("should fully reimburse damage to dragon material items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 400 }],
            },
          },
        ],
      });
      // Dragon material: fully reimbursed despite enchantment >= 8
      // Reimbursable = 400 (full), minus 100 deductible = 300 payout
      // Sword insurance value = 1000, cap = 2000, remainingCap = 2000 - 300 = 1700
      expect(result).toEqual({
        results: [{ premium: 148 }, { payout: 300, remainingCap: 1700 }],
      });
    });
    it("should round payout down in MHPCO's favor", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "staff", material: "oak", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "staff", amount: 301 }],
            },
          },
        ],
      });
      // Staff enchantment 9 >= 8: reimbursed at 50%
      // Reimbursable = 301 * 0.5 = 150.5, minus 100 deductible = 50.5
      // Floor(50.5) = 50 (rounded down in MHPCO's favor)
      // Staff insurance value = 800, cap = 1600, remainingCap = 1600 - 50 = 1550
      expect(result).toEqual({
        results: [{ premium: 120 }, { payout: 50, remainingCap: 1550 }],
      });
    });
  });
});
