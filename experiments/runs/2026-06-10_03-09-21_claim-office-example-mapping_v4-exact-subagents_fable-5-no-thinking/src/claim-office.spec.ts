// claim-office.spec.ts
import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Office", () => {
  describe("quote: base premiums", () => {
    it("should return premium 5 for an empty item list (only processing fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });

      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("should quote a single sword for a newcomer at 115 (100 base + 10% first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should quote a single amulet for a newcomer at 71 (60 base + 10% first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("should quote a single staff for a newcomer at 93 (80 base + 10% first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("should quote a single potion for a newcomer at 49 (40 base + 10% first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("should charge 25 base premium per component (2 runes → base premium 50)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
  });

  describe("quote: building block of 3 alike components", () => {
    it("should price a block of exactly 3 runes at base premium 60", () => {
      const result = processScenario({
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
    it("should not apply the block to 4 runes (base premium 100 — block requires exactly 3)", () => {
      const result = processScenario({
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
    it("should not apply the block to 7 runes (base premium 175)", () => {
      const result = processScenario({
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
    it("should not form a block from different component types (2 runes + 1 moonstone → base premium 75)", () => {
      const result = processScenario({
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
    it("should form two separate blocks for 3 runes + 3 moonstones (base premium 120)", () => {
      const result = processScenario({
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

  describe("quote: item-level modifiers", () => {
    it("should add 50% curse surcharge to a cursed item's base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
      });

      // 100 base + 50 curse + 10 first insurance (10% of unmodified base) + 5 fee
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("should add 30% high-enchantment surcharge for enchantment exactly 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      });

      // 100 base + 30 enchantment + 10 first insurance (10% of unmodified base) + 5 fee
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("should not add the high-enchantment surcharge for enchantment 4", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should stack curse and high-enchantment surcharges on the same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", cursed: true, enchantment: 5 }],
          },
        ],
      });

      // 100 base + 50 curse + 30 enchantment + 10 first insurance (10% of unmodified base) + 5 fee
      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
    it("should apply the curse surcharge only to the cursed item's base premium, not the whole policy (cursed sword + plain amulet → policy base 210 before policy modifiers and fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", cursed: true }, { type: "amulet" }],
          },
        ],
      });

      // 160 base + 50 curse + 16 first insurance (10% of unmodified base 160) + 5 fee
      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("quote: policy-level modifiers", () => {
    it("should apply the 20% loyalty discount for a customer with exactly 2 years with MHPCO", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("should not apply the loyalty discount for a customer with fewer than 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should apply the 15% follow-up discount on the customer's second quote in the scenario", () => {
      const result = processScenario({
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
    it("should quote a newcomer's cursed steel sword (enchantment 3) at 165 (100 + 50 curse + 10 first insurance + 5 fee)", () => {
      const result = processScenario({
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

      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("should quote a 3-year customer's second quote for a cursed sword (enchantment 7) at 160 (100 + 50 + 30 − 20 loyalty + 10 first − 15 follow-up + 5 fee)", () => {
      const result = processScenario({
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
      });

      expect(result).toEqual({
        results: [{ premium: 95 }, { premium: 160 }],
      });
    });
  });

  describe("quote: rounding", () => {
    it("should round the final premium up to a whole G, keeping intermediates fractional (7 runes for a newcomer: 175 × 1.10 + 5 = 197.5 → 198)", () => {
      const result = processScenario({
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
  });

  describe("quote: errors", () => {
    it("should throw an error for an unknown item type (e.g. broomstick)", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      ).toThrow();
    });
  });

  describe("claim: standard reimbursement", () => {
    it("should pay damage minus 100 deductible for a regular item (steel sword enchantment 3, damage 500 → payout 400)", () => {
      const result = processScenario({
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("should pay damage minus 100 deductible for a component (rune, damage 200 → payout 100)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
      });
    });
    it("should include payout and remainingCap in a claim result", () => {
      const result = processScenario({
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });

      const claimResult = result.results[1] as {
        payout: number;
        remainingCap: number;
      };
      expect(claimResult).toHaveProperty("payout");
      expect(claimResult).toHaveProperty("remainingCap");
      expect(typeof claimResult.payout).toBe("number");
      expect(typeof claimResult.remainingCap).toBe("number");
    });
  });

  describe("claim: special reimbursement clauses", () => {
    it("should reimburse 50% for enchantment ≥ 8 before deductible (steel sword enchantment 9, damage 1000 → payout 400)", () => {
      const result = processScenario({
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

      const claimResult = result.results[1];
      expect(claimResult).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should fully reimburse dragon-material items before deductible (dragon sword enchantment 5, damage 800 → payout 700)", () => {
      const result = processScenario({
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

      const claimResult = result.results[1];
      expect(claimResult).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("should let the 50% rule win when both clauses apply (dragon sword enchantment 9, damage 1000 → payout 400)", () => {
      const result = processScenario({
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

      const claimResult = result.results[1];
      expect(claimResult).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should apply the 50% rule at exactly enchantment 8 (dragon sword enchantment 8, damage 1000 → payout 400)", () => {
      const result = processScenario({
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

      const claimResult = result.results[1];
      expect(claimResult).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim: multiple damages in one incident", () => {
    it("should apply the deductible once per damaged item (sword 500 + amulet 300 → payout 600)", () => {
      const result = processScenario({
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
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      });

      const claimResult = result.results[1];
      expect(claimResult).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("should treat two damage entries for two insured swords as separate damages with their own deductibles", () => {
      const result = processScenario({
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

      const claimResult = result.results[1];
      expect(claimResult).toEqual({ payout: 600, remainingCap: 3400 });
    });
  });

  describe("claim: payout cap", () => {
    it("should cap the payout at twice the insurance sum (single sword → cap 2000)", () => {
      const result = processScenario({
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

      const claimResult = result.results[1];
      expect(claimResult).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should compute the insurance sum from item values for multiple items (sword + amulet → insurance sum 1600, cap 3200)", () => {
      const result = processScenario({
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
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      });

      const claimResult = result.results[1];
      expect(claimResult).toEqual({ payout: 100, remainingCap: 3100 });
    });
    it("should compute the cap for two swords (insurance sum 2000, cap 4000)", () => {
      const result = processScenario({
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
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      });

      const claimResult = result.results[1];
      expect(claimResult).toEqual({ payout: 100, remainingCap: 3900 });
    });
    it("should not let premium modifiers change the cap (cursed sword → cap still 2000)", () => {
      const result = processScenario({
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
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      });

      const claimResult = result.results[1];
      expect(claimResult).toEqual({ payout: 100, remainingCap: 1900 });
    });
    it("should not let the block discount affect the insurance sum (sword + 3 runes → insurance sum 1750)", () => {
      const result = processScenario({
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
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      });

      const claimResult = result.results[1];
      expect(claimResult).toEqual({ payout: 100, remainingCap: 3400 });
    });
    it("should deplete the cap across successive claims (sword, two claims of 1500: first payout 1400 / remainingCap 600, second payout 600 / remainingCap 0)", () => {
      const result = processScenario({
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
  });

  describe("claim: rounding", () => {
    it("should round the final payout down to a whole G", () => {
      const result = processScenario({
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
              damages: [{ itemType: "sword", amount: 701 }],
            },
          },
        ],
      });

      const claimResult = result.results[1];
      expect(claimResult).toEqual({ payout: 250, remainingCap: 1750 });
    });
  });

  describe("claim: errors", () => {
    it("should throw an error for a damage entry whose item type is not in the policy", () => {
      expect(() =>
        processScenario({
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
        })
      ).toThrow();
    });
    it("should throw an error for a damage entry with an unknown item type", () => {
      expect(() =>
        processScenario({
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
        })
      ).toThrow();
    });
    it("should throw an error when damages contain more entries of a type than insured items of that type", () => {
      expect(() =>
        processScenario({
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
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 300 },
                ],
              },
            },
          ],
        })
      ).toThrow();
    });
    it("should throw an error for a negative damage amount", () => {
      expect(() =>
        processScenario({
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
        })
      ).toThrow();
    });
  });

  describe("scenario processing", () => {
    it("should return one result per step in input order (quote → {premium}, claim → {payout, remainingCap})", () => {
      const result = processScenario({
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
      });

      expect(result.results).toHaveLength(2);
      expect(result.results[0]).toEqual({ premium: 59 });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    });
  });
});
