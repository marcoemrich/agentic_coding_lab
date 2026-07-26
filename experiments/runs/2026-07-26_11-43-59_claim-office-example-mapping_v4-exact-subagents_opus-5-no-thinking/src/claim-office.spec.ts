import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("should charge a premium of 5 G for an empty item list", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });

      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("should charge 115 G for a single plain sword (100 G base + 10 G first insurance + 5 G fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should charge 71 G for a single plain amulet", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("should charge 93 G for a single plain staff", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("should charge 49 G for a single plain potion", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("should charge 33 G for a single rune (25 G base + 2.5 G first insurance + 5 G fee, rounded up)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("should charge 33 G for a single moonstone", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("should sum the base premiums of several different items", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }, { type: "amulet" }, { type: "potion" }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 225 }] });
    });
  });

  describe("quote — component blocks", () => {
    it("should charge 50 G base premium for 2 runes (no block)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("should charge 60 G base premium for 3 runes (block applies)", () => {
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
    it("should charge 100 G base premium for 4 runes (block requires exactly 3)", () => {
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
    it("should charge 175 G base premium for 7 runes (no block)", () => {
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
    it("should charge 75 G base premium for 2 runes and 1 moonstone (different types do not form a block)", () => {
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
    it("should charge 120 G base premium for 3 runes and 3 moonstones (two separate blocks)", () => {
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
    it("should add 30 % of the item's base premium for enchantment 5", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      });

      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("should not add the high-enchantment surcharge for enchantment 4", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should add both surcharges for a cursed item with enchantment 5", () => {
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
    it("should apply the cursed surcharge only to the cursed item on a multi-item policy (cursed sword + plain amulet → 210 G before fee)", () => {
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
    it("should add 10 % of the policy base premium as first insurance surcharge to every quote", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should subtract 20 % of the policy base premium for a customer with 2 years with MHPCO", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("should not apply the loyalty discount for a customer with 1 year with MHPCO", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should subtract 15 % of the policy base premium for each quote after the customer's first", () => {
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
    it("should not apply the follow-up discount to the customer's first quote", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
  });

  describe("quote — rounding", () => {
    it("should round a premium up in the MHPCO's favour (197.5 → 198, and fractions below .5 also round up)", () => {
      // 7 runes, first quote: 175 base + 17.5 first insurance + 5 fee = 197.5 → 198
      expect(
        runScenario({
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
        }),
      ).toEqual({ results: [{ premium: 198 }] });

      // Second quote for a cursed rune:
      //   25 base + 12.5 cursed + 2.5 first insurance - 3.75 follow-up + 5 fee
      //   = 41.25 → rounded up in the MHPCO's favour → 42
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "rune" }] },
            { op: "quote", items: [{ type: "rune", cursed: true }] },
          ],
        }),
      ).toEqual({ results: [{ premium: 33 }, { premium: 42 }] });
    });
    it("should keep intermediate amounts as fractions and round only the final premium", () => {
      // Second quote for a 2-year customer insuring a cursed rune with enchantment 5.
      // Every intermediate amount is fractional:
      //   25 base
      //   + 12.5 cursed
      //   + 7.5 high enchantment
      //   + 2.5 first insurance
      //   - 5 loyalty
      //   - 3.75 follow-up
      //   + 5 fee
      //   = 43.75 → rounded up once at the end → 44
      // Rounding each intermediate amount up instead would give 45.
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "quote",
            items: [{ type: "rune", cursed: true, enchantment: 5 }],
          },
        ],
      });

      expect(result.results[1]).toEqual({ premium: 44 });
    });
  });

  describe("quote — integration examples", () => {
    it("should charge 165 G for a newcomer's cursed sword (0 years, first contract)", () => {
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
    it("should charge 160 G for the second quote of a 3-year customer insuring a cursed sword with enchantment 7", () => {
      // 100 base + 50 curse + 30 high enchantment - 20 loyalty
      //   + 10 first insurance - 15 follow-up = 155 + 5 fee = 160
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 7,
                cursed: true,
              },
            ],
          },
        ],
      });

      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("quote — errors", () => {
    it("should reject a quote containing an item with an unknown type", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      ).toThrowError(/broomstick/);
    });
  });

  describe("claim — standard reimbursement", () => {
    it("should pay 400 G for 500 G damage to a plain steel sword with enchantment 3 (deductible 100 G)", () => {
      const result = runScenario({
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
      });

      expect(result).toEqual({
        results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("should pay 100 G for 200 G damage to a rune (no enchantment level or material)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "goblin ambush",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
      });
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
  });

  describe("claim — special clauses", () => {
    it("should pay 50 % of the damage before the deductible for enchantment 8 (dragon sword, 1000 G → 400 G)", () => {
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
    it("should pay 400 G for a steel sword with enchantment 9 damaged by 1000 G (50 % rule only)", () => {
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
    it("should pay 700 G for a dragon-material sword with enchantment 5 damaged by 800 G (full reimbursement, then deductible)", () => {
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
    it("should let the 50 % rule win over dragon material (dragon sword, enchantment 9, 1000 G → 400 G)", () => {
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
  });

  describe("claim — cap", () => {
    it("should report a remaining cap of twice the insurance sum minus the payout", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }],
          },
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
    it("should base the cap on the sum of the items' unmodified insurance values (sword + amulet → cap 3200 G)", () => {
      const result = runScenario({
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
              cause: "dragon attack",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
    });
    it("should not raise the cap through premium modifiers (cursed sword → cap 2000 G)", () => {
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
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
        ],
      });

      expect(result.results).toEqual([
        { premium: 165 },
        { payout: 200, remainingCap: 1800 },
      ]);
    });
    it("should not reduce the insurance sum through a component block discount (sword + 3 runes → insurance sum 1750 G)", () => {
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
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
        ],
      });

      expect(result.results).toEqual([
        { premium: 181 },
        { payout: 200, remainingCap: 3300 },
      ]);
    });
    it("should carry the cap across successive claims (two 1500 G claims on a sword → 1400 G then 600 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }],
          },
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
    it("should report a remaining cap of 0 G once the cap is exhausted", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 2100 }],
            },
          },
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

      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
      expect(result.results[2]).toEqual({ payout: 0, remainingCap: 0 });
    });
  });

  describe("claim — multiple items of the same type", () => {
    it("should insure two swords with an insurance sum of 2000 G and a cap of 4000 G", () => {
      const result = runScenario({
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 225 });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3600 });
    });
    it("should treat two damage entries of the same item type as separate damages with their own deductible", () => {
      const result = runScenario({
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
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
    });
  });

  describe("claim — rounding", () => {
    it("should round a payout of 350.5 G down to 350 G", () => {
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

  describe("claim — errors", () => {
    it("should reject a claim whose damage entry references an item not covered by the policy", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword" }],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "dragon attack",
                damages: [{ itemType: "amulet", amount: 200 }],
              },
            },
          ],
        }),
      ).toThrow("Item not covered by the policy: amulet");
    });
    it("should reject a claim whose damage entry references an unknown item type", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword" }],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "dragon attack",
                damages: [{ itemType: "broomstick", amount: 200 }],
              },
            },
          ],
        }),
      ).toThrow(/broomstick/);
    });
    it("should reject a claim with more damage entries of a type than the policy insures", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword" }],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "dragon attack",
                damages: [
                  { itemType: "sword", amount: 300 },
                  { itemType: "sword", amount: 200 },
                ],
              },
            },
          ],
        }),
      ).toThrow("More sword damages claimed than the policy insures");
    });
    it("should reject a claim with a negative damage amount", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword" }],
            },
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
      ).toThrow("Negative damage amount: -200");
    });
  });

  describe("scenario processing", () => {
    it("should return one result per step in the same order as the input steps", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
          {
            op: "quote",
            items: [{ type: "amulet" }],
          },
          {
            op: "claim",
            policy: 2,
            incident: {
              cause: "goblin raid",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      });

      expect(result.results).toEqual([
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
        { premium: 62 },
        { payout: 200, remainingCap: 1000 },
      ]);
    });
    it("should resolve a claim's policy field to the quote step at that zero-based index", () => {
      // The second quote is at step index 2, not at index 1 of the quote steps:
      // a claim step sits between the two quotes. A claim naming policy 2
      // therefore refers to the amulet policy created by the quote at step 2.
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
          {
            op: "quote",
            items: [{ type: "amulet" }],
          },
          {
            op: "claim",
            policy: 2,
            incident: {
              cause: "goblin raid",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      });

      expect(result.results).toEqual([
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
        { premium: 62 },
        { payout: 200, remainingCap: 1000 },
      ]);
    });
  });
});
