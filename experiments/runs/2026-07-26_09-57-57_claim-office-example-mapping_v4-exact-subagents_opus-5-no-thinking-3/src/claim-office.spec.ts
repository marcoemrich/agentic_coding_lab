import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("should quote 5 G for an empty item list (processing fee only)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });

      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("should quote 115 G for a single plain sword (100 G base + 10 G first insurance + 5 G fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should quote 71 G for a single plain amulet (60 G base + 6 G first insurance + 5 G fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("should quote 93 G for a single plain staff (80 G base + 8 G first insurance + 5 G fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("should quote 49 G for a single plain potion (40 G base + 4 G first insurance + 5 G fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("should quote 181 G for a plain sword and a plain amulet (160 G base + 16 G first insurance + 5 G fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
  });

  describe("quote — components and blocks", () => {
    it("should charge 25 G base per component (2 runes → 50 G base premium)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("should charge 60 G base for a block of exactly 3 alike components (3 runes)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("should charge 100 G base for 4 runes (no block — block requires exactly 3)", () => {
      const result = runScenario({
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
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should charge 175 G base for 7 runes (no block — block requires exactly 3)", () => {
      const result = runScenario({
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
      });

      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
    it("should charge 75 G base for 2 runes and 1 moonstone (no block — different types)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 88 }] });
    });
    it("should charge 120 G base for 3 runes and 3 moonstones (two separate blocks)", () => {
      const result = runScenario({
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
      });

      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("should add 50 % of the item's base premium for a cursed item", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
      });

      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("should add 30 % of the item's base premium for enchantment level 5", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      });

      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("should not add the high-enchantment surcharge for enchantment level 4", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should add both surcharges for a cursed item with enchantment level 5", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", cursed: true, enchantment: 5 }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
    it("should apply the cursed surcharge only to the cursed item on a multi-item policy", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", cursed: true }, { type: "amulet" }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("should add 10 % of the policy base premium as first insurance surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should subtract 20 % of the policy base premium for a customer with 2 years", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("should not apply the loyalty discount for a customer with 1 year", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should subtract 15 % of the policy base premium on each quote after the first", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });

      expect(result).toEqual({
        results: [{ premium: 115 }, { premium: 100 }],
      });
    });
    it("should apply the first insurance surcharge on a follow-up contract as well", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "potion" }] },
          { op: "quote", items: [{ type: "amulet" }] },
        ],
      });

      expect(result).toEqual({
        results: [{ premium: 49 }, { premium: 62 }],
      });
    });
  });

  describe("quote — rounding", () => {
    it("should round the final premium up to a whole G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", cursed: true, enchantment: 5 },
              { type: "rune" },
            ],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
    it("should keep intermediate amounts as fractions and round only the final premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          { op: "quote", items: [{ type: "rune", enchantment: 5 }] },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 35 }] });
    });
  });

  describe("quote — integration", () => {
    it("should quote 165 G for a newcomer with a cursed steel sword of enchantment 3", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: true,
              },
            ],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("should quote 160 G for a 3-year customer's second contract with a cursed sword of enchantment 7", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "quote",
            items: [{ type: "sword", cursed: true, enchantment: 7 }],
          },
        ],
      });

      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("claim — standard reimbursement", () => {
    it("should pay 400 G for 500 G damage to a regular sword (deductible 100 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should pay 100 G for 200 G damage to a rune (no enchantment or material clause)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin raid",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("should apply the 100 G deductible once per damage entry (sword 500 G + amulet 300 G → 600 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          {
            op: "claim",
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

      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("should treat two damage entries of the same item type as separate damages", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          {
            op: "claim",
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

      expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
    });
  });

  describe("claim — special clauses", () => {
    it("should pay 400 G for 1000 G damage to a steel sword with enchantment 9 (50 % then deductible)", () => {
      const result = runScenario({
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should pay 700 G for 800 G damage to a dragon-material sword with enchantment 5 (full then deductible)", () => {
      const result = runScenario({
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("should pay 400 G for 1000 G damage to a dragon-material sword with enchantment 9 (50 % rule wins)", () => {
      const result = runScenario({
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should pay 400 G for 1000 G damage to a dragon-material sword with exactly enchantment 8", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 8 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim — cap", () => {
    it("should report the remaining cap as twice the insurance sum minus the payout", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 700 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 1400 });
    });
    it("should base the insurance sum on unmodified item values (sword + amulet → cap 3200 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 5 },
              { type: "amulet", enchantment: 9 },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 100 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
    });
    it("should base the insurance sum on unmodified item values when a block discount applies (sword + 3 runes → cap 3500 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 100 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
    });
    it("should not raise the cap for a cursed item (cursed sword → cap 2000 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", cursed: true }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 100 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
    });
    it("should reduce the payout to the remaining cap when the cap is exhausted across successive claims", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("claim — rounding", () => {
    it("should round the final payout down to a whole G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", enchantment: 9 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("errors", () => {
    it("should reject a quote containing an item of unknown type", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      ).toThrowError(/broomstick/);
    });
    it("should reject a claim whose damage references an item not in the policy", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "dragon attack",
                damages: [{ itemType: "amulet", amount: 300 }],
              },
            },
          ],
        }),
      ).toThrowError(/amulet/);
    });
    it("should reject a claim whose damage references an unknown item type", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "dragon attack",
                damages: [{ itemType: "broomstick", amount: 300 }],
              },
            },
          ],
        }),
      ).toThrowError(/broomstick/);
    });
    it("should reject a claim with more damages of a type than the policy insures", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "dragon attack",
                damages: [
                  { itemType: "sword", amount: 300 },
                  { itemType: "sword", amount: 400 },
                ],
              },
            },
          ],
        }),
      ).toThrowError(/sword/);
    });
    it("should reject a claim with a negative damage amount", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "dragon attack",
                damages: [{ itemType: "sword", amount: -200 }],
              },
            },
          ],
        }),
      ).toThrowError(/-200/);
    });
  });

  describe("scenario processing", () => {
    it("should return one result per step in the same order as the input steps", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
          { op: "quote", items: [{ type: "amulet" }] },
        ],
      });

      expect(result.results).toEqual([
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
        { premium: 62 },
      ]);
    });
    it("should resolve a claim's policy field to the quote step at that zero-based index", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "claim",
            policy: 2,
            incident: {
              cause: "goblin raid",
              damages: [{ itemType: "amulet", amount: 500 }],
            },
          },
        ],
      });

      expect(result.results).toEqual([
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
        { premium: 62 },
        { payout: 400, remainingCap: 800 },
      ]);
    });
  });

  describe("claim — insurance values of all insurable types", () => {
    it("should cap a staff policy at 1600 G (staff insured at 800 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "staff" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "staff", amount: 100 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 0, remainingCap: 1600 });
    });
    it("should cap a potion policy at 800 G (potion insured at 400 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "potion" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "potion", amount: 100 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 0, remainingCap: 800 });
    });
    it("should cap a moonstone policy at 500 G (moonstone insured at 250 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "moonstone" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "moonstone", amount: 100 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 0, remainingCap: 500 });
    });
  });
});

const CLI_PATH = fileURLToPath(new URL("./cli.ts", import.meta.url));

function runCli(stdin: string): {
  stdout: string;
  stderr: string;
  status: number | null;
} {
  const result = spawnSync("npx", ["tsx", CLI_PATH], {
    input: stdin,
    encoding: "utf-8",
  });

  return {
    stdout: result.stdout,
    stderr: result.stderr,
    status: result.status,
  };
}

describe("claim-office CLI", () => {
  it("should write a results object to stdout for a scenario read from stdin", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "amulet",
              material: "silver",
              enchantment: 2,
              cursed: false,
            },
          ],
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
    };

    const { stdout } = runCli(JSON.stringify(scenario));

    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("should exit with status code 0 for a valid scenario", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };

    const { status } = runCli(JSON.stringify(scenario));

    expect(status).toBe(0);
  });
  it("should exit with a non-zero status code for an invalid scenario", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const { status } = runCli(JSON.stringify(scenario));

    expect(status).not.toBe(0);
  });
  it("should write an error description to stderr for an invalid scenario", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const { stderr } = runCli(JSON.stringify(scenario));

    expect(stderr).toMatch(/broomstick/);
    expect(stderr).not.toMatch(/^\s*at\s/m);
  });
  it("should write no results to stdout for an invalid scenario", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const { stdout } = runCli(JSON.stringify(scenario));

    expect(stdout).toBe("");
  });
});
