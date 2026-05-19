import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5 G processing fee for an empty item list", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(5);
    });
    it("returns base premium plus fee for a single sword", () => {
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
      expect(result.results[0].premium).toBe(115);
    });
    it("returns base premium plus fee for each main item type (amulet, staff, potion)", () => {
      const makeScenario = (type: string) => ({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type, material: "silver", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(processScenario(makeScenario("amulet")).results[0].premium).toBe(71);
      expect(processScenario(makeScenario("staff")).results[0].premium).toBe(93);
      expect(processScenario(makeScenario("potion")).results[0].premium).toBe(49);
    });
    it("returns 25 G base premium per component (rune)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(60);
    });
    it("applies building block discount for exactly 3 alike components", () => {
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
      expect(result.results[0].premium).toBe(71);
    });
    it("does not apply block discount for 4 alike components", () => {
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
      expect(result.results[0].premium).toBe(115);
    });
    it("treats different component types separately for block eligibility", () => {
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
      expect(result.results[0].premium).toBe(137);
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
      expect(result.results[0].premium).toBe(181);
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% cursed surcharge to the cursed item base premium", () => {
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
      expect(result.results[0].premium).toBe(165);
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
      expect(result.results[0].premium).toBe(145);
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
      expect(result.results[0].premium).toBe(195);
    });
    it("applies item modifiers only to the affected item in a multi-item policy", () => {
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
      expect(result.results[0].premium).toBe(231);
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("applies 10% first-insurance surcharge on policy base premium", () => {
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
      // staff base 80 + first-insurance 8 (10% of 80) + fee 5 = 93
      expect(result.results[0].premium).toBe(93);
    });
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
      // base 100 + first-insurance 10 (10% of 100) - loyalty 20 (20% of 100) + fee 5 = 95
      expect(result.results[0].premium).toBe(95);
    });
    it("applies 15% follow-up discount on second and subsequent quotes", () => {
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
      expect(result.results[0].premium).toBe(115);
      expect(result.results[1].premium).toBe(100);
    });
    it("stacks policy-wide modifiers (loyalty, first insurance, follow-up)", () => {
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
      // Step 0: base 100 + first-insurance 10 - loyalty 20 + fee 5 = 95
      expect(result.results[0].premium).toBe(95);
      // Step 1: base 100 + first-insurance 10 - loyalty 20 - follow-up 15 + fee 5 = 80
      expect(result.results[1].premium).toBe(80);
    });
  });

  describe("Quote - rounding", () => {
    it("rounds premium up (in MHPCO's favor)", () => {
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
            items: [{ type: "rune" }],
          },
        ],
      };
      const result = processScenario(scenario);
      // Step 1: rune base 25 + first-ins 2.5 - follow-up 3.75 + fee 5 = 28.75 -> ceil = 29
      expect(result.results[1].premium).toBe(29);
    });
  });

  describe("Quote - integration", () => {
    it("newcomer with cursed sword computes to 165 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(165);
    });
    it("long-standing customer second contract with cursed high-enchantment sword computes to 160 G", () => {
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
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1].premium).toBe(160);
    });
  });

  describe("Claim - standard reimbursement", () => {
    it("reimburses damage minus 100 G deductible for a regular item", () => {
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
      expect(result.results[1].payout).toBe(400);
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
              cause: "fire",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(100);
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
      expect(result.results[1].payout).toBe(600);
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(400);
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(700);
    });
    it("applies 50% rule when both dragon material and enchantment >= 8", () => {
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
      expect(result.results[1].payout).toBe(400);
    });
    it("applies only dragon-material clause when enchantment < 8", () => {
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
      expect(result.results[1].payout).toBe(700);
    });
  });

  describe("Claim - cap", () => {
    it("caps total payout at twice the insurance sum", () => {
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
      // sword insurance value 1000, cap = 2000
      // damage 2500 - 100 deductible = 2400, but capped at 2000
      expect(result.results[1].payout).toBe(2000);
      expect(result.results[1].remainingCap).toBe(0);
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // cap = 2 * 1000 = 2000
      // claim 1: 1500 - 100 = 1400, fits in cap -> payout 1400, remaining 600
      expect(result.results[1].payout).toBe(1400);
      expect(result.results[1].remainingCap).toBe(600);
      // claim 2: 1500 - 100 = 1400, but only 600 remaining -> payout 600, remaining 0
      expect(result.results[2].payout).toBe(600);
      expect(result.results[2].remainingCap).toBe(0);
    });
    it("bases cap on unmodified insurance values", () => {
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
      // cursed sword: insurance value 1000, cap = 2000 (unmodified)
      // damage 2500 - 100 = 2400, capped at 2000
      expect(result.results[1].payout).toBe(2000);
      expect(result.results[1].remainingCap).toBe(0);
    });
  });

  describe("Claim - rounds payout down (in MHPCO's favor)", () => {
    it("rounds payout down", () => {
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
      // 501 * 0.5 = 250.5, minus 100 deductible = 150.5, floor = 150
      expect(result.results[1].payout).toBe(150);
    });
  });

  describe("Validation", () => {
    it("rejects unknown item type in a quote", () => {
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
      expect(() => processScenario(scenario)).toThrow();
    });
    it("rejects claim for item not in policy", () => {
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
    it("rejects claim with more damage entries than insured items of that type", () => {
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
  });
});
