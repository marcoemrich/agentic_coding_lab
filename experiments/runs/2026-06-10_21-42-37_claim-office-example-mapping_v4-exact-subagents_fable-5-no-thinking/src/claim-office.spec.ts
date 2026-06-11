// claim-office.spec.ts
import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quotes: basics", () => {
    it("should return premium 5 for a quote with an empty item list (processing fee only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      };

      expect(processScenario(scenario)).toEqual({ results: [{ premium: 5 }] });
    });
    it("should return premium 115 for a single sword (100 base + 10% first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      };

      expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });
    it("should return premium 71 for a single amulet (60 base)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      };

      expect(processScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
    });
    it("should return premium 93 for a single staff (80 base)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      };

      expect(processScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
    });
    it("should return premium 49 for a single potion (40 base)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      };

      expect(processScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
    });
    it("should return one result per step in the scenario", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [] },
        ],
      };

      expect(processScenario(scenario).results).toHaveLength(2);
    });
  });

  describe("quotes: components and block", () => {
    it("should return premium 33 for a single rune (25 base, final premium rounded up)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      };

      expect(processScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
    });
    it("should return premium 60 for 2 runes (50 base, no block)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      };

      expect(processScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
    });
    it("should return premium 71 for exactly 3 runes (block rate of 60 base)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      };

      expect(processScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
    });
    it("should return premium 115 for 4 runes (100 base, block requires exactly 3)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      };

      expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });
    it("should return premium 198 for 7 runes (175 base, no block)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      };

      expect(processScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
    });
    it("should return premium 88 for 2 runes and 1 moonstone (75 base, no block across types)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      };

      expect(processScenario(scenario)).toEqual({ results: [{ premium: 88 }] });
    });
    it("should return premium 137 for 3 runes and 3 moonstones (two blocks, 120 base)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
              { type: "moonstone" },
              { type: "moonstone" },
            ],
          },
        ],
      };

      expect(processScenario(scenario)).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quotes: item modifiers", () => {
    it("should add 50% of the item base premium for a cursed item (cursed sword -> 165)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
      };

      expect(processScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
    });
    it("should add 30% of the item base premium for enchantment level 5 or higher (sword ench 5 -> 145)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      };

      expect(processScenario(scenario)).toEqual({ results: [{ premium: 145 }] });
    });
  });

  describe("quotes: policy modifiers", () => {
    it("should subtract 20% loyalty discount for customers with 2 or more years (sword, 2 years -> 95)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      };

      expect(processScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
    });
    it("should subtract 15% follow-up discount on each quote after the first in the scenario (second sword quote -> 100)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      };

      expect(processScenario(scenario)).toEqual({
        results: [{ premium: 115 }, { premium: 100 }],
      });
    });
  });

  describe("quotes: integration examples", () => {
    it("should return premium 165 for a newcomer with a cursed steel sword of enchantment 3", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      };

      expect(processScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
    });
    it("should return premium 160 for a 3-year customer's second quote with a cursed steel sword of enchantment 7", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      };

      expect(processScenario(scenario).results[1]).toEqual({ premium: 160 });
    });
  });

  describe("claims: payouts", () => {
    it("should pay damage minus 100 deductible for a standard item (steel sword ench 3, damage 500 -> payout 400)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      };

      expect(processScenario(scenario).results[1]).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("should pay 100 for a rune damaged at 200", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "mana surge",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      };

      expect(processScenario(scenario).results[1]).toEqual({
        payout: 100,
        remainingCap: 400,
      });
    });
    it("should reimburse 50% of the damage before deductible for enchantment 8 or higher (steel sword ench 9, damage 1000 -> payout 400)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };

      expect(processScenario(scenario).results[1]).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("should reimburse the full damage minus deductible for dragon material below enchantment 8 (dragon sword ench 5, damage 800 -> payout 700)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 5 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      };

      expect(processScenario(scenario).results[1]).toEqual({
        payout: 700,
        remainingCap: 1300,
      });
    });
    it("should apply the 50% rule when both dragon material and enchantment 8+ apply (dragon sword ench 9, damage 1000 -> payout 400)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 9 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };

      expect(processScenario(scenario).results[1]).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("should round the final payout down to a whole G (steel sword ench 9, damage 999 -> payout 399)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 999 }],
            },
          },
        ],
      };

      expect(processScenario(scenario).results[1]).toEqual({
        payout: 399,
        remainingCap: 1601,
      });
    });
  });

  describe("claims: deductible per damaged item", () => {
    it("should apply the deductible once per damaged item (sword damage 500 + amulet damage 300 -> payout 600)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }, { type: "amulet" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      };

      expect(processScenario(scenario).results[1]).toEqual({
        payout: 600,
        remainingCap: 2600,
      });
    });
    it("should apply a separate deductible to each damage entry of the same type (two insured swords, two sword damage entries)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }, { type: "sword" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      };

      expect(processScenario(scenario).results[1]).toEqual({
        payout: 600,
        remainingCap: 3400,
      });
    });
  });

  describe("claims: payout cap", () => {
    it("should report remainingCap as twice the insurance sum minus the payout (sword policy, claim 1500 -> payout 1400, remainingCap 600)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      };

      expect(processScenario(scenario).results[1]).toEqual({
        payout: 1400,
        remainingCap: 600,
      });
    });
    it("should reduce the payout to the remaining cap on a later claim (second 1500 claim -> payout 600, remainingCap 0)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      };

      const { results } = processScenario(scenario);

      expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("should compute the cap from unmodified insurance values of all items (two swords -> cap 4000)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", cursed: true },
              { type: "sword", cursed: true },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [{ itemType: "sword", amount: 3000 }],
            },
          },
        ],
      };

      expect(processScenario(scenario).results[1]).toEqual({
        payout: 2900,
        remainingCap: 1100,
      });
    });
  });

  describe("errors", () => {
    it("should throw for an unknown item type in a quote (e.g. broomstick)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      };

      expect(() => processScenario(scenario)).toThrow();
    });
    it("should throw for a damage entry whose item type is not covered by the policy", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      };

      expect(() => processScenario(scenario)).toThrow();
    });
    it("should throw when more damage entries of a type are claimed than items of that type are covered", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon fire",
              damages: [
                { itemType: "sword", amount: 300 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      };

      expect(() => processScenario(scenario)).toThrow();
    });
    it("should throw for a negative damage amount", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      };

      expect(() => processScenario(scenario)).toThrow();
    });
  });
});
