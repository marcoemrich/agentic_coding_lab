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
    it("returns base premium + first insurance + fee for a single sword", () => {
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
    it("returns base premium + first insurance + fee for a single amulet", () => {
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
      // 60 base + 6 first insurance + 5 fee = 71
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("returns base premium + first insurance + fee for a single staff", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "oak", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // 80 base + 8 first insurance + 5 fee = 93
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("returns base premium + first insurance + fee for a single potion", () => {
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
      // 40 base + 4 first insurance + 5 fee = 49
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("returns component base premium + first insurance + fee for 1 rune", () => {
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
      // 25 base + 2.5 first insurance = 27.5 → rounds up to 28 + 5 fee = 33
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("sums base premiums + first insurance for multiple items", () => {
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
      // 160 base + 16 first insurance + 5 fee = 181
      expect(result.results[0]).toEqual({ premium: 181 });
    });
  });

  describe("Quote - component block pricing", () => {
    it("charges 50 G base for 2 alike components (no block)", () => {
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
      // 50 base + 5 first insurance + 5 fee = 60
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("charges 60 G base for exactly 3 alike components (block applies)", () => {
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
      // 60 base + 6 first insurance + 5 fee = 71
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("charges 100 G base for 4 alike components (no block)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // 100 base + 10 first insurance + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("charges 75 G base for 2 runes + 1 moonstone (different types, no block)", () => {
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
      // 75 base + 7.5 first insurance = 87.5 → rounds up to 88 + 5 fee...
      // wait: intermediate amounts kept as fractions, only final rounded: 75 + 7.5 + 5 = 87.5 → 88
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("charges 120 G base for 3 runes + 3 moonstones (two separate blocks)", () => {
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
      // 120 base + 12 first insurance + 5 fee = 137
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% surcharge to a cursed item's base premium", () => {
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
      // 100 base + 50 curse + 10 first insurance + 5 fee = 165
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("adds 30% surcharge for enchantment level >= 5", () => {
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
      // 100 base + 30 enchantment + 10 first insurance + 5 fee = 145
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("applies both cursed and high-enchantment surcharges to the same item", () => {
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
      // 100 base + 50 curse + 30 enchantment + 10 first insurance + 5 fee = 195
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
      // 100 base + 10 first insurance + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("cursed surcharge applies only to the cursed item in a multi-item policy", () => {
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
      // policy base = 160, curse surcharge = 50, first insurance = 16, fee = 5 → 231
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it.todo("applies 10% first insurance surcharge to policy base premium");
    it("applies 20% loyalty discount for customer with >= 2 years", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
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
      // 100 base, first insurance = 10, loyalty = -20, total = 90 + 5 fee = 95
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("applies 15% follow-up discount on second quote", () => {
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
      // First quote: 100 base + 10 first insurance + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
      // Second quote: 100 base + 10 first insurance - 15 follow-up + 5 fee = 100
      expect(result.results[1]).toEqual({ premium: 100 });
    });
    it("applies both loyalty and follow-up discounts together", () => {
      const scenario = {
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
      };
      const result = processScenario(scenario);
      // First quote: 100 base + 10 first insurance - 20 loyalty + 5 fee = 95
      expect(result.results[0]).toEqual({ premium: 95 });
      // Second quote: 100 base + 10 first insurance - 20 loyalty - 15 follow-up + 5 fee = 80
      expect(result.results[1]).toEqual({ premium: 80 });
    });
  });

  describe("Quote - integration", () => {
    it("newcomer with cursed sword: 165 G", () => {
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
      // 100 base + 50 curse + 10 first insurance + 5 fee = 165
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("long-standing customer second contract with cursed enchanted sword: 160 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
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
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // Second quote: 100 base + 50 curse + 30 enchantment - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee = 160
      expect(result.results[1]).toEqual({ premium: 160 });
    });
    it("rounds premium up to whole G in MHPCO's favor", () => {
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
      // 25 base + 2.5 first insurance - 5 loyalty + 5 fee = 27.5 → Math.ceil = 28
      expect(result.results[0]).toEqual({ premium: 28 });
    });
  });

  describe("Claim - basic payout", () => {
    it("applies 100 G deductible to damage on a regular item", () => {
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // payout = 500 - 100 deductible = 400
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("fully reimburses dragon-material item minus deductible", () => {
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
    it("reimburses 50% for enchantment >= 8, then applies deductible", () => {
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // enchantment >= 8: 50% of 1000 = 500, then deductible: 500 - 100 = 400
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // both dragon + enchantment >= 8: 50% rule wins: 500 - 100 = 400
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("fully reimburses dragon-material item with enchantment < 8 minus deductible", () => {
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // dragon material, enchantment < 8: full reimbursement minus deductible: 800 - 100 = 700
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
  });

  describe("Claim - deductible per item", () => {
    it("applies deductible separately to each damaged item in an event", () => {
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
      // (500-100) + (300-100) = 400+200 = 600; cap = 2*(1000+600) = 3200
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("component damage uses full reimbursement minus deductible", () => {
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
              cause: "fire",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // 200 - 100 deductible = 100; cap = 2*250 = 500
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("Claim - cap", () => {
    it("caps total payout at 2x insurance sum", () => {
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
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // cap = 2*1000 = 2000; payout = min(2500-100, 2000) = 2000; remaining = 0
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("tracks remaining cap across successive claims", () => {
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
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // cap = 2*1000 = 2000
      // first claim: 1500-100 = 1400, remaining = 600
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      // second claim: desired 1500-100 = 1400, but remaining = 600, so payout = 600
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("insurance sum is based on item values, not premiums", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // insurance sum = 1000 (not affected by curse premium), cap = 2000
      // payout = min(2500-100, 2000) = 2000, remaining = 0
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("component block discount does not affect insurance sum", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "rune" }, { type: "rune" }, { type: "rune" },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 4000 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // insurance sum = 1000 + 3*250 = 1750, cap = 3500
      // payout = min(4000-100, 3500) = 3500, remaining = 0
      expect(result.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
    });
  });

  describe("Claim - rounding", () => {
    it("rounds payout down to whole G in MHPCO's favor", () => {
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 501 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // enchantment >= 8: 501*0.5 = 250.5, minus deductible: 250.5-100 = 150.5, floor = 150
      // remainingCap = 2000 - 150.5 = 1849.5 (raw), but output is integer
      expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
    });
  });

  describe("Error handling", () => {
    it("rejects unknown item type in quote", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "broomstick", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      expect(() => processScenario(scenario)).toThrow("Unknown item type: broomstick");
    });
    it("rejects claim referencing item not in policy", () => {
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
    it("rejects negative damage amount", () => {
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
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      };
      expect(() => processScenario(scenario)).toThrow();
    });
    it("rejects more damages of a type than policy covers", () => {
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
      expect(() => processScenario(scenario)).toThrow();
    });
  });

  describe("CLI integration", () => {
    it("processes a scenario with quote and claim steps via CLI", async () => {
      const { execSync } = await import("child_process");
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
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
      const output = execSync(`echo '${input}' | npx tsx src/cli.ts`, {
        encoding: "utf-8",
        cwd: process.cwd(),
      });
      const result = JSON.parse(output.trim());
      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });
});
