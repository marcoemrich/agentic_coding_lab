import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote — base premiums per item type", () => {
    it("quotes a sword for a brand-new customer: 100 base × 1.10 first-insurance + 5 fee = 115 G", () => {
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
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("quotes an amulet for a brand-new customer: 60 × 1.10 + 5 = 71 G", () => {
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
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("quotes a staff for a brand-new customer: 80 × 1.10 + 5 = 93 G", () => {
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
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("quotes a potion for a brand-new customer: 40 × 1.10 + 5 = 49 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "potion", material: "glass", enchantment: 1, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
  });

  describe("Quote — components", () => {
    it("quotes a single rune component at 25 base × 1.10 + 5, rounded up in MHPCO's favor = 33 G", () => {
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
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("bundles 3 alike components at a special 60 G base instead of 75 G (so 60 × 1.10 + 5 = 71 G)", () => {
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
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
  });

  describe("Quote — surcharges and discounts", () => {
    it("applies 50% cursed surcharge: cursed sword = 100 × 1.5 × 1.10 + 5 = 170 G", () => {
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
      expect(result).toEqual({ results: [{ premium: 170 }] });
    });
    it("applies 30% high-enchantment surcharge: sword enchantment 5 = 100 × 1.3 × 1.10 + 5 = 148 G", () => {
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
      expect(result).toEqual({ results: [{ premium: 148 }] });
    });
    it("applies 20% loyalty discount for customers with ≥ 2 years: sword = 100 × 1.10 × 0.80 + 5 = 93 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 2, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("applies 15% discount and no first-insurance surcharge on contracts after the first: 2nd sword quote = 100 × 0.85 + 5 = 90 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }],
          },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
    });
  });

  describe("Claim — payouts", () => {
    it("pays out damage minus 100 G deductible and reports remainingCap", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      });
      // Amulet: insurance value 600 G, cap = 1200 G
      // Damage 200 - 100 deductible = 100 payout; remainingCap = 1200 - 100 = 1100
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    });
    it("caps total payout per policy at twice the insurance sum across multiple claims", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "spell mishap",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      // Sword: insurance 1000, cap = 2000
      // Claim 1: 1500 - 100 = 1400 payout; remainingCap = 2000 - 1400 = 600
      // Claim 2: 1000 - 100 = 900 pre-cap; capped to 600; remainingCap = 0
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("reimburses 50% of damage for items with enchantment ≥ 8", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      // Sword enchantment 8: insurance 1000, cap = 2000.
      // 50% of 500 = 250 reimbursable; minus 100 deductible = 150 payout
      // remainingCap = 2000 - 150 = 1850
      expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
    });
    it("fully reimburses damage to dragon-material items (overrides 50% enchantment rule)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      // Dragon-material sword: fully reimbursed (overrides 50% rule despite enchantment 9).
      // Damage 500 - 100 deductible = 400 payout; remainingCap = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });
});
