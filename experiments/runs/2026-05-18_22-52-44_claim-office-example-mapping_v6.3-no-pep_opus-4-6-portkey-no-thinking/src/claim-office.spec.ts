import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5 G for an empty item list (processing fee only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("computes base premium for a single sword (100 base + 10 first-ins + 5 fee = 115 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("computes base premium for a single amulet (60 base + 6 first-ins + 5 fee = 71 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("computes base premium for a single staff (80 G + 5 G fee = 85 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("computes base premium for a single potion (40 base + 4 first-ins + 5 fee = 49 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("computes base premium for a single component (25 base + 2.5 first-ins + 5 fee = 33 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "rune" }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("computes base premium for multiple items (sword + amulet = 160 base + 16 first-ins + 5 fee = 181 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 181 });
    });
  });

  describe("Quote - component blocks", () => {
    it("applies block discount for exactly 3 alike components (60 base + 6 first-ins + 5 fee = 71 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("does not apply block for 2 alike components (50 base + 5 first-ins + 5 fee = 60 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("does not apply block for 4 alike components (100 base + 10 first-ins + 5 fee = 115 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("does not apply block for 3 components of different types (75 base + 7.5 first-ins + 5 fee = 88 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("applies two separate blocks for 3 runes + 3 moonstones (120 base + 12 first-ins + 5 fee = 137 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% cursed surcharge to a cursed item's base premium", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("adds 30% high-enchantment surcharge for enchantment level >= 5", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("applies both cursed and high-enchantment surcharges to the same item", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("does not apply high-enchantment surcharge for enchantment level 4", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies item-specific surcharges only to the affected item in a multi-item policy", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("applies 20% loyalty discount for customer with >= 2 years", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("applies 15% follow-up contract discount on second quote", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ premium: 100 });
    });
    it("applies loyalty, first-insurance, and follow-up modifiers together", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
          },
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Quote - rounding", () => {
    it("rounds premium up (in MHPCO's favor) to whole G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "rune" }],
        }],
      };
      const result = processScenario(scenario);
      // rune base 25, policy base 25, first-ins +2.5, loyalty -5 = -2.5 modifiers
      // total = 25 + (-2.5) + 5 = 27.5, ceil → 28
      expect(result.results[0]).toEqual({ premium: 28 });
    });
  });

  describe("Claim - basic payout", () => {
    it("reimburses damage minus 100 G deductible for a regular item", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
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
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("applies deductible per damaged item in a single event", () => {
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
      // (500-100) + (300-100) = 600, cap = 3200, remaining = 2600
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("reimburses component damage minus deductible", () => {
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
              cause: "theft",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // 200 - 100 deductible = 100 payout, cap = 500, remaining = 400
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("Claim - special reimbursement rules", () => {
    it("reimburses at 50% for items with enchantment level >= 8", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // 50% of 1000 = 500, minus 100 deductible = 400
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("fully reimburses dragon-material items", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // dragon material: full reimbursement, then deductible: 800 - 100 = 700
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("applies 50% rule when item is both dragon-material and enchantment >= 8", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // both dragon and enchantment >= 8: 50% wins → 500, minus 100 deductible = 400
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("fully reimburses dragon-material item with enchantment < 8", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "dragon", enchantment: 7, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 600 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // dragon material, enchantment 7 < 8: full reimbursement, minus 100 deductible = 500
      expect(result.results[1]).toEqual({ payout: 500, remainingCap: 1500 });
    });
  });

  describe("Claim - cap", () => {
    it("caps total payout at twice the insurance sum", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // uncapped: 2500 - 100 = 2400, but cap = 2000 → payout 2000, remaining 0
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("tracks remaining cap across multiple claims on the same policy", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
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
      // first claim: 1500 - 100 = 1400, cap 2000 → payout 1400, remaining 600
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      // second claim: 1500 - 100 = 1400, but cap remaining 600 → payout 600, remaining 0
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("returns remaining cap of 0 when cap is exhausted", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // first claim: 2500 - 100 = 2400, capped at 2000, remaining 0
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
      // second claim: 500 - 100 = 400, but cap remaining 0 → payout 0, remaining 0
      expect(result.results[2]).toEqual({ payout: 0, remainingCap: 0 });
    });
  });

  describe("Claim - rounding", () => {
    it("rounds payout down (in MHPCO's favor) to whole G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 501 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // 50% of 501 = 250.5, minus 100 deductible = 150.5, floor → 150
      expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
    });
  });

  describe("Error handling", () => {
    it("rejects unknown item type in quote", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "broomstick", material: "wood", enchantment: 0, cursed: false }],
        }],
      };
      expect(() => processScenario(scenario)).toThrow();
    });
    it("rejects claim for item not in the policy", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
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
    it("rejects negative damage amount", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      };
      expect(() => processScenario(scenario)).toThrow();
    });
    it("rejects more damages of a type than insured items of that type", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
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
      expect(() => processScenario(scenario)).toThrow();
    });
  });

  describe("Integration - newcomer with cursed sword", () => {
    it("computes 165 G for a newcomer with a cursed sword", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 165 });
    });
  });

  describe("Integration - long-standing customer second contract", () => {
    it("computes 160 G for a long-standing customer's second contract with cursed high-enchantment sword", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
          },
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });
});
