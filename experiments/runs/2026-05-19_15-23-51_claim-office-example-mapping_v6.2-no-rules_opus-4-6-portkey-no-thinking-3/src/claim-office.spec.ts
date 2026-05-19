import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns premium of 5 G for an empty item list (processing fee only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("returns correct base premium for a single sword (100 G + 5 G fee = 105 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 }); // 100 + 10 first insurance + 5 fee
    });
    it("returns correct base premium for a single amulet (60 G + 5 G fee = 65 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 71 }); // 60 + 6 first insurance + 5 fee
    });
    it("returns correct base premium for a single staff (80 G + 5 G fee = 85 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 93 }); // 80 + 8 first insurance + 5 fee
    });
    it("returns correct base premium for a single potion (40 G + 5 G fee = 45 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 49 }); // 40 + 4 first insurance + 5 fee
    });
    it("returns correct base premium for a single component (25 G + 5 G fee = 30 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 33 }); // 25 + 2.5 rounds up to 3 + 5 fee
    });
    it("sums base premiums for multiple items in a policy", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 181 }); // 160 + 16 first insurance + 5 fee
    });
  });

  describe("Quote - component blocks", () => {
    it("charges 50 G for 2 runes (no block)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 60 }); // 50 + 5 first insurance + 5 fee
    });
    it("charges 60 G for exactly 3 alike components (block applies)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 71 }); // 60 block + 6 first insurance + 5 fee
    });
    it("charges 100 G for 4 runes (no block — block requires exactly 3)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" }, { type: "rune" },
              { type: "rune" }, { type: "rune" },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 }); // 100 + 10 first insurance + 5 fee
    });
    it("charges 75 G for 2 runes + 1 moonstone (no block: different types)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 88 }); // 75 + 7.5 rounds up to 8 + 5 fee
    });
    it("charges 120 G for 3 runes + 3 moonstones (two separate blocks)", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 137 }); // 120 + 12 first insurance + 5 fee
    });
    it("charges 175 G for 7 runes (no blocks apply)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: Array.from({ length: 7 }, () => ({ type: "rune" })),
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 198 }); // 175 + 17.5 rounds up to 18 + 5 fee
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% cursed surcharge on the cursed item's base premium only", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      // 100 sword + 50 curse + 60 amulet = 210 items + 16 first insurance (10% of 160) + 5 fee = 231
      expect(result.results[0]).toEqual({ premium: 231 });
    });
    it("adds 30% high-enchantment surcharge for enchantment level >= 5", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // 100 + 30 enchantment + 10 first insurance + 5 fee = 145
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("applies both cursed and high-enchantment surcharges on the same item", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // 100 + 50 curse + 30 enchantment + 10 first insurance + 5 fee = 195
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("does not add high-enchantment surcharge for enchantment level 4", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 4, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // 100 + 10 first insurance + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies item-specific surcharges only to affected items in multi-item policy", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 6, cursed: false },
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // 80 + 24 enchantment + 40 potion + 12 first insurance (10% of 120) + 5 fee = 161
      expect(result.results[0]).toEqual({ premium: 161 });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("adds 10% first insurance surcharge on policy base premium", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // 100 base + 10 first insurance (10% of 100) + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies 20% loyalty discount for customer with >= 2 years", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // 100 base + 10 first insurance - 20 loyalty (20% of 100) + 5 fee = 95
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("applies 15% follow-up discount on second and subsequent contracts", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      // First quote: 100 + 10 first insurance + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
      // Second quote: 100 + 10 first insurance - 15 follow-up (15% of 100) + 5 fee = 100
      expect(result.results[1]).toEqual({ premium: 100 });
    });
    it("does not apply loyalty discount for customer with < 2 years", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // No loyalty discount: 100 + 10 first insurance + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
  });

  describe("Quote - integration: modifier stacking", () => {
    it("newcomer with cursed sword: 100 + 50 curse + 10 first = 160 + 5 fee = 165 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("long-standing second contract cursed enchanted sword: 100 + 50 + 30 - 20 + 10 - 15 = 155 + 5 = 160 G", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      // Second contract: 100 base + 50 curse + 30 enchantment - 20 loyalty (20% of 100) + 10 first insurance (10% of 100) - 15 follow-up (15% of 100) + 5 fee = 160
      expect(result.results[1]).toEqual({ premium: 160 });
    });
    it("rounds premium up in MHPCO's favor", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      };
      const result = processScenario(scenario);
      // 1 rune: componentTotal = 25, policyBase = 25
      // firstInsurance = 2.5, loyalty = 5
      // 5 + 0 + 25 + 2.5 - 5 = 27.5 → rounds UP to 28
      expect(result.results[0]).toEqual({ premium: 28 });
    });
  });

  describe("Quote - error handling", () => {
    it("rejects unknown item type with an error", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "banana", material: "peel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      expect(() => processScenario(scenario)).toThrow();
    });
  });

  describe("Claim - standard reimbursement", () => {
    it("reimburses damage minus 100 G deductible for a standard item", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      // 500 damage - 100 deductible = 400 payout
      // insurance sum = 1000, cap = 2000, remaining = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("applies deductible per damaged item in same event", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      // sword: 500 - 100 = 400, amulet: 300 - 100 = 200, total = 600
      // insurance sum = 1000 + 600 = 1600, cap = 3200, remaining = 3200 - 600 = 2600
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("reimburses damage to a component minus deductible", () => {
      const scenario = {
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
              cause: "mishap",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // 200 - 100 deductible = 100 payout
      // insurance sum = 250, cap = 500, remaining = 500 - 100 = 400
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("Claim - special clauses", () => {
    it("reimburses at 50% for items with enchantment >= 8, then deductible", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      // 50% of 1000 = 500, minus 100 deductible = 400
      // insurance sum = 1000, cap = 2000, remaining = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("fully reimburses dragon-material items minus deductible", () => {
      const scenario = {
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // dragon material: full reimbursement, then deductible: 800 - 100 = 700
      // insurance sum = 1000, cap = 2000, remaining = 2000 - 700 = 1300
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("applies 50% rule when item is both dragon-material and enchantment >= 8", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      // both dragon + enchantment >= 8: 50% rule wins
      // 50% of 1000 = 500, minus 100 deductible = 400
      // insurance sum = 1000, cap = 2000, remaining = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("fully reimburses dragon-material with enchantment < 8 minus deductible", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "mishap",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // dragon material, enchantment < 8: full reimbursement minus deductible
      // 800 - 100 = 700
      // insurance sum = 1000, cap = 2000, remaining = 2000 - 700 = 1300
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
  });

  describe("Claim - cap tracking", () => {
    it("caps total payout at 2x insurance sum per policy", () => {
      const scenario = {
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
        ],
      };
      const result = processScenario(scenario);
      // 1500 - 100 deductible = 1400 payout
      // insurance sum = 1000, cap = 2000, remaining = 2000 - 1400 = 600
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    });
    it("tracks remaining cap across multiple claims on same policy", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      // First claim: 1500 - 100 = 1400, cap 2000, remaining 600
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      // Second claim: 1500 - 100 = 1400, but capped at remaining 600
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("reduces payout to remaining cap when cap is nearly exhausted", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "explosion",
              damages: [{ itemType: "potion", amount: 400 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "potion", amount: 400 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "flood",
              damages: [{ itemType: "potion", amount: 400 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // potion: insurance sum = 400, cap = 800
      // Claim 1: 400 - 100 = 300, remaining = 800 - 300 = 500
      expect(result.results[1]).toEqual({ payout: 300, remainingCap: 500 });
      // Claim 2: 400 - 100 = 300, remaining = 500 - 300 = 200
      expect(result.results[2]).toEqual({ payout: 300, remainingCap: 200 });
      // Claim 3: 400 - 100 = 300, but capped at remaining 200
      expect(result.results[3]).toEqual({ payout: 200, remainingCap: 0 });
    });
  });

  describe("Claim - error handling", () => {
    it("rejects claim referencing item not in the policy", () => {
      const scenario = {
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
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      };
      expect(() => processScenario(scenario)).toThrow();
    });
    it("rejects claim with negative damage amount", () => {
      const scenario = {
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
      };
      expect(() => processScenario(scenario)).toThrow();
    });
    it("rejects claim with more damages of a type than policy covers", () => {
      const scenario = {
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
      };
      // Policy covers 1 sword but claim has 2 sword damages
      expect(() => processScenario(scenario)).toThrow();
    });
  });
});
