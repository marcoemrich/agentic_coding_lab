import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote — base premiums", () => {
    it("returns 5 G for an empty item list (processing fee only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("returns base premium + first-insurance + fee for a single sword (100 * 1.1 + 5 = 115 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("returns base premium + first-insurance + fee for a single amulet (60 * 1.1 + 5 = 71 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("returns base premium + first-insurance + fee for a single staff (80 * 1.1 + 5 = 93 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("returns base premium + first-insurance + fee for a single potion (40 * 1.1 + 5 = 49 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("returns 25 G base premium per component (e.g. 2 runes → 50 * 1.1 + 5 = 60 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("applies block discount for exactly 3 alike components (3 runes → 60 * 1.1 + 5 = 71 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("does not apply block for 4 alike components (4 runes → 100 * 1.1 + 5 = 115 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies separate blocks for different component types (3 runes + 3 moonstones → 120 * 1.1 + 5 = 137 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
              { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
              { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 137 });
    });
    it("does not apply block for mixed component types (2 runes + 1 moonstone → 75 * 1.1 + 5 = 87.5 → ceil 88 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("sums base premiums for multiple main items (sword + amulet → 160 * 1.1 + 5 = 181 G)", () => {
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
      expect(result.results[0]).toEqual({ premium: 181 });
    });
  });

  describe("Quote — item-specific modifiers", () => {
    it("adds 50% cursed surcharge to the cursed item's base premium only (150 + 100*0.1 + 5 = 165 G)", () => {
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
    it("adds 30% high-enchantment surcharge for enchantment >= 5 (130 + 100*0.1 + 5 = 145 G)", () => {
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
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("does not add high-enchantment surcharge for enchantment 4 (100 * 1.1 + 5 = 115 G)", () => {
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
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies both cursed and high-enchantment surcharges to the same item (180 + 100*0.1 + 5 = 195 G)", () => {
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
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("applies cursed surcharge only to cursed item in a multi-item policy (210 + 160*0.1 + 5 = 231 G)", () => {
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
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote — policy-wide modifiers", () => {
    it("applies 10% first-insurance surcharge for a newcomer", () => {
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
      expect(result.results[0]).toEqual({ premium: 115 });
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
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("applies 15% follow-up contract discount on second quote", () => {
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
      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ premium: 100 });
    });
    it("applies loyalty, first-insurance, and follow-up together for long-standing repeat customer", () => {
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
      expect(result.results[0]).toEqual({ premium: 95 });
      expect(result.results[1]).toEqual({ premium: 80 });
    });
  });

  describe("Quote — rounding", () => {
    it("rounds premium up (in MHPCO's favor) on the final result", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // 25 * 1.1 = 27.5, ceil(27.5) = 28, + 5 = 33
      expect(result.results[0]).toEqual({ premium: 33 });
    });
  });

  describe("Quote — integration", () => {
    it("newcomer with cursed sword yields 165 G", () => {
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
      // 100 base + 50 curse + 10 first-insurance (10% of 100 base) = 160 + 5 fee = 165
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("long-standing customer second contract with cursed high-enchant sword yields 160 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
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
      // First quote: 180 + (100*0.1 - 100*0.2) + 5 = 180 - 10 + 5 = 175
      expect(result.results[0]).toEqual({ premium: 175 });
      // Second quote: 180 + (100*0.1 - 100*0.2 - 100*0.15) + 5 = 180 - 25 + 5 = 160
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Claim — standard reimbursement", () => {
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
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      } as any;
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("reimburses component damage minus 100 G deductible", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      } as any;
      const result = processScenario(scenario);
      // 200 - 100 deductible = 100, cap = 2*250 = 500, remainingCap = 500 - 100 = 400
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("applies deductible per damaged item in a multi-damage event", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      } as any;
      const result = processScenario(scenario);
      // (500-100) + (300-100) = 600, cap = 2*(1000+600) = 3200, remaining = 2600
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("Claim — enchantment and material clauses", () => {
    it("reimburses 50% for enchantment >= 8, then deductible", () => {
      const scenario = {
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
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      } as any;
      const result = processScenario(scenario);
      // 50% of 1000 = 500, then -100 deductible = 400
      // cap = 2*1000 = 2000, remaining = 2000-400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("fully reimburses dragon material items, then deductible", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 5, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      } as any;
      const result = processScenario(scenario);
      // dragon material, enchantment 5 (< 8): full reimbursement, then deductible
      // 800 - 100 = 700, cap = 2000, remaining = 1300
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("applies 50% when both dragon material and enchantment >= 8", () => {
      const scenario = {
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
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      } as any;
      const result = processScenario(scenario);
      // both clauses: 50% wins, then deductible: 500 - 100 = 400
      // cap = 2000, remaining = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("fully reimburses dragon material with enchantment < 8, then deductible", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 7, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      } as any;
      const result = processScenario(scenario);
      // dragon material, enchantment 7 (< 8): full reimbursement, then deductible
      // 1000 - 100 = 900, cap = 2000, remaining = 1100
      expect(result.results[1]).toEqual({ payout: 900, remainingCap: 1100 });
    });
  });

  describe("Claim — cap", () => {
    it("caps total payout at 2x insurance sum of the policy", () => {
      const scenario = {
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
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      } as any;
      const result = processScenario(scenario);
      // first claim: 1500-100=1400, cap=2000, payout=1400, remaining=600
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      // second claim: 1500-100=1400, cap=600, payout=600, remaining=0
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("tracks remaining cap across multiple claims on same policy", () => {
      const scenario = {
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
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 2000 }],
            },
          },
        ],
      } as any;
      const result = processScenario(scenario);
      // first claim: 500-100=400, cap=2000, payout=400, remaining=1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
      // second claim: 2000-100=1900, cap=1600, payout=1600, remaining=0
      expect(result.results[2]).toEqual({ payout: 1600, remainingCap: 0 });
    });
  });

  describe("Claim — payout rounding", () => {
    it("rounds payout down (in MHPCO's favor) on the final result", () => {
      const scenario = {
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
              damages: [{ itemType: "sword", amount: 501 }],
            },
          },
        ],
      } as any;
      const result = processScenario(scenario);
      // 501 * 0.5 = 250.5, then -100 deductible = 150.5, floor = 150
      // cap = 2000, remaining = 2000 - 150 = 1850
      expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
    });
  });

  describe("Error handling", () => {
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
    it("rejects claim referencing an item not in the policy", () => {
      const scenario = {
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
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      } as any;
      expect(() => processScenario(scenario)).toThrow();
    });
    it("rejects negative damage amount", () => {
      const scenario = {
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
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      } as any;
      expect(() => processScenario(scenario)).toThrow();
    });
    it("rejects more damages of a type than the policy covers", () => {
      const scenario = {
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
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      } as any;
      expect(() => processScenario(scenario)).toThrow();
    });
  });
});
