import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("computes premium for a single sword (new customer, no surcharges)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      });
      // base 100 * 1.10 (first insurance) + 5 fee = 115
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("computes premium for a single amulet", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      });
      // base 60 * 1.10 (first insurance) + 5 fee = 71
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("computes premium for a single staff", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "staff", material: "oak", enchantment: 1, cursed: false },
            ],
          },
        ],
      });
      // base 80 * 1.10 + 5 fee = 93
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("computes premium for a single potion", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // base 40 * 1.10 + 5 fee = 49
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("computes premium for a single component (rune) and rounds in MHPCO's favor", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // base 25 * 1.10 = 27.5 + 5 fee = 32.5 -> ceil in MHPCO favor = 33
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("offers a building block base premium for 3 alike components", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // building block of 3 runes: base 60 (not 3*25=75) * 1.10 + 5 = 71
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("adds a 50% surcharge for a cursed item", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      });
      // base 100 * 1.50 (cursed) * 1.10 (first insurance) + 5 = 170
      expect(result).toEqual({ results: [{ premium: 170 }] });
    });
    it("adds a 30% surcharge for a highly enchanted item (enchantment >= 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      // base 100 * 1.30 (enchanted) * 1.10 (first insurance) + 5 = 148
      expect(result).toEqual({ results: [{ premium: 148 }] });
    });
    it("applies a 20% loyalty discount for customers with >= 2 years of business", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      });
      // base 100 * 1.10 (first insurance) * 0.80 (loyalty) + 5 = 93
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("applies a 15% discount on a second contract instead of the first-insurance surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      });
      // first: base 100 * 1.10 + 5 = 115
      // second: base 100 * 0.85 + 5 = 90
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
    });
  });

  describe("claim", () => {
    it("subtracts the 100 G deductible from the damage amount", () => {
      const result = runScenario({
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
      // amulet insurance sum = 600, cap = 1200
      // payout = 300 - 100 deductible = 200
      // remainingCap = 1200 - 200 = 1000
      expect(result).toEqual({
        results: [{ premium: 71 }, { payout: 200, remainingCap: 1000 }],
      });
    });
    it("fully reimburses damage to items made of dragon material", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "dragon", enchantment: 2, cursed: false },
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
      // amulet insurance sum = 600, cap = 1200
      // dragon material -> fully reimbursed (no deductible)
      // payout = 300, remainingCap = 1200 - 300 = 900
      expect(result).toEqual({
        results: [{ premium: 71 }, { payout: 300, remainingCap: 900 }],
      });
    });
    it("reimburses 50% of damage to items with enchantment >= 8", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 8, cursed: false },
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
      // sword insurance sum = 1000, cap = 2000
      // enchantment 8: 50% reimbursement = 200, minus 100 deductible = 100 payout
      // remainingCap = 2000 - 100 = 1900
      // premium: base 100 * 1.30 (high-enchant) * 1.10 (first) + 5 = 148
      expect(result).toEqual({
        results: [{ premium: 148 }, { payout: 100, remainingCap: 1900 }],
      });
    });
    it("caps the total payout at twice the insurance sum across multiple claims", () => {
      const result = runScenario({
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
              cause: "spell mishap",
              damages: [{ itemType: "amulet", amount: 800 }],
            },
          },
        ],
      });
      // amulet insurance sum = 600, cap = 1200
      // claim 1: would-pay 800-100 = 700, within cap. remainingCap = 1200-700 = 500.
      // claim 2: would-pay 700, but only 500 cap left. payout = 500. remainingCap = 0.
      expect(result).toEqual({
        results: [
          { premium: 71 },
          { payout: 700, remainingCap: 500 },
          { payout: 500, remainingCap: 0 },
        ],
      });
    });
  });
});
