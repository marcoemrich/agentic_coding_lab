import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote — base premiums", () => {
    it("returns 5 G for an empty item list (processing fee only)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("returns 105 G for a single sword (100 base + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("returns 65 G for a single amulet (60 base + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("returns 85 G for a single staff (80 base + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("returns 45 G for a single potion (40 base + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("returns 30 G for a single rune component (25 base + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("returns 165 G for a sword and an amulet (100 + 60 + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 181 });
    });
  });

  describe("Quote — component block pricing", () => {
    it("returns 55 G for 2 runes (2 × 25 + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("returns 65 G for 3 runes (block of 3 alike = 60 + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("returns 105 G for 4 runes (no block: 4 × 25 + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("returns 80 G for 2 runes + 1 moonstone (no block: different types, 3 × 25 + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("returns 125 G for 3 runes + 3 moonstones (two blocks: 60 + 60 + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" }, { type: "rune" }, { type: "rune" },
              { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Quote — item-specific modifiers", () => {
    it("adds 50% curse surcharge to cursed item base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      });
      // 100 base + 50 curse + 10 first-insurance (10% of 100) + 5 fee = 165
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("adds 30% high-enchantment surcharge for enchantment level >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      // 100 base + 30 enchantment + 10 first-insurance (10% of 100) + 5 fee = 145
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("does not add high-enchantment surcharge for enchantment level 4", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 4, cursed: false },
            ],
          },
        ],
      });
      // 100 base + 10 first-insurance + 5 fee = 115 (no enchantment surcharge)
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies both curse and high-enchantment surcharges to same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      });
      // 100 base + 50 curse + 30 enchantment + 10 first-insurance + 5 fee = 195
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("applies item-specific surcharges only to the affected item in a multi-item policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // sword: 100 + 50 curse = 150; amulet: 60; policy base = 160; first-insurance = 16; total = 210 + 16 + 5 = 231
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote — policy-wide modifiers", () => {
    it("adds 10% first-insurance surcharge to policy base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 100 base + 10 first-insurance (10% of 100 policy base) + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies 20% loyalty discount for customer with >= 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 100 base + 10 first-insurance - 20 loyalty (20% of 100) + 5 fee = 95
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("applies 15% follow-up discount on second quote", () => {
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
      // First quote: 100 base + 10 first-insurance + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
      // Second quote: 100 base + 10 first-insurance - 15 follow-up (15% of 100) + 5 fee = 100
      expect(result.results[1]).toEqual({ premium: 100 });
    });
    it("applies both loyalty and follow-up discounts together", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
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
      // First quote: 100 base + 10 first-insurance - 20 loyalty + 5 fee = 95
      expect(result.results[0]).toEqual({ premium: 95 });
      // Second quote: 100 base + 10 first-insurance - 20 loyalty - 15 follow-up + 5 fee = 80
      expect(result.results[1]).toEqual({ premium: 80 });
    });
  });

  describe("Quote — rounding", () => {
    it("rounds premium up in MHPCO's favor", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      });
      // 25 base + 2.5 first-insurance (10% of 25) + 5 fee = 32.5 → rounds up to 33
      expect(result.results[0]).toEqual({ premium: 33 });
    });
  });

  describe("Quote — integration", () => {
    it("newcomer with a cursed sword: premium 165 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      });
      // 100 base + 50 curse + 10 first-insurance (10% of 100) + 5 fee = 165
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("long-standing customer second contract with cursed high-enchantment sword: premium 160 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });
      // Second quote (follow-up): 100 base + 50 curse + 30 enchantment + 10 first-insurance - 20 loyalty - 15 follow-up + 5 fee = 160
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Claim — basic payout", () => {
    it("applies 100 G deductible per damaged item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      // 500 damage - 100 deductible = 400 payout; cap = 2×1000 = 2000; remaining = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("reimburses standard damage at full amount minus deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "staff", amount: 300 }],
            },
          },
        ],
      });
      // 300 damage - 100 deductible = 200 payout; cap = 2×800 = 1600; remaining = 1400
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1400 });
    });
    it("reimburses component damage at full amount minus deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "wear",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });
      // 200 damage - 100 deductible = 100 payout; cap = 2×250 = 500; remaining = 400
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("Claim — enchantment and material modifiers", () => {
    it("reimburses enchantment >= 8 items at 50% of damage then deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      // 50% of 1000 = 500, then minus 100 deductible = 400
      // cap = 2×1000 = 2000; remaining = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("reimburses dragon-material items at full damage minus deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 5, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "battle",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });
      // Dragon material: full reimbursement, then deductible: 800 - 100 = 700
      // cap = 2×1000 = 2000; remaining = 2000 - 700 = 1300
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("applies 50% rule when both enchantment >= 8 and dragon material", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      // Both clauses: 50% wins → 500, then deductible: 500 - 100 = 400
      // cap = 2×1000 = 2000; remaining = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("Claim — cap", () => {
    it("caps total payout at 2x insurance sum per policy", () => {
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
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "catastrophe",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      });
      // 2500 - 100 deductible = 2400, but cap = 2×1000 = 2000 → payout capped at 2000
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("tracks remaining cap across multiple claims", () => {
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
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });
      // First claim: 1500 - 100 = 1400 payout; cap 2000 → remaining 600
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      // Second claim: 1500 - 100 = 1400 desired, capped at 600 → payout 600, remaining 0
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("Claim — multiple items", () => {
    it("applies deductible per damaged item in a multi-damage event", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      });
      // sword: 500 - 100 = 400; amulet: 300 - 100 = 200; total = 600
      // cap = 2×(1000+600) = 3200; remaining = 3200 - 600 = 2600
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("handles multiple items of the same type in a policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      });
      // Each sword: 500 - 100 = 400; total = 800
      // cap = 2×(1000+1000) = 4000; remaining = 4000 - 800 = 3200
      expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
    });
  });

  describe("Claim — payout rounding", () => {
    it("rounds payout down in MHPCO's favor", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "battle",
              damages: [{ itemType: "sword", amount: 701 }],
            },
          },
        ],
      });
      // 50% of 701 = 350.5, minus 100 deductible = 250.5 → rounds down to 250
      // cap = 2×1000 = 2000; remaining = 2000 - 250 = 1750
      expect(result.results[1]).toEqual({ payout: 250, remainingCap: 1750 });
    });
  });

  describe("Error handling", () => {
    it("rejects unknown item type in quote", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [{ type: "broomstick", material: "wood", enchantment: 0, cursed: false }],
            },
          ],
        })
      ).toThrow();
    });
    it("rejects claim referencing item not in policy", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [
                { type: "sword", material: "steel", enchantment: 0, cursed: false },
              ],
            },
            {
              op: "claim" as const,
              policy: 0,
              incident: {
                cause: "theft",
                damages: [{ itemType: "amulet", amount: 300 }],
              },
            },
          ],
        })
      ).toThrow();
    });
    it("rejects claim with more damages than insured items of that type", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [
                { type: "sword", material: "steel", enchantment: 0, cursed: false },
              ],
            },
            {
              op: "claim" as const,
              policy: 0,
              incident: {
                cause: "dragon attack",
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 300 },
                ],
              },
            },
          ],
        })
      ).toThrow();
    });
    it("rejects negative damage amount", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [
                { type: "sword", material: "steel", enchantment: 0, cursed: false },
              ],
            },
            {
              op: "claim" as const,
              policy: 0,
              incident: {
                cause: "fraud",
                damages: [{ itemType: "sword", amount: -200 }],
              },
            },
          ],
        })
      ).toThrow();
    });
  });
});
