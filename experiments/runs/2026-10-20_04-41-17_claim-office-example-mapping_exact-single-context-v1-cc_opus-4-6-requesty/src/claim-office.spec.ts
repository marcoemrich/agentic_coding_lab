import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  function quoteItems(items: Array<Record<string, unknown>>, yearsWithMHPCO = 0) {
    return processScenario({
      customer: { yearsWithMHPCO },
      steps: [{ op: "quote" as const, items }],
    });
  }

  describe("Quote - base premiums", () => {
    it("should return 5G for an empty item list (processing fee only)", () => {
      expect(quoteItems([]).results[0]).toEqual({ premium: 5 });
    });
    it("should return base premium + fee for a single sword (100 + 5 = 105)", () => {
      expect(quoteItems([{ type: "sword" }]).results[0]).toEqual({ premium: 115 });
    });
    it("should return base premium + fee for each main item type (amulet, staff, potion)", () => {
      expect(quoteItems([{ type: "amulet" }]).results[0]).toEqual({ premium: 71 });
      expect(quoteItems([{ type: "staff" }]).results[0]).toEqual({ premium: 93 });
      expect(quoteItems([{ type: "potion" }]).results[0]).toEqual({ premium: 49 });
    });
    it("should return 25G base premium per component (rune or moonstone)", () => {
      expect(quoteItems([{ type: "rune" }]).results[0]).toEqual({ premium: 33 });
      expect(quoteItems([{ type: "moonstone" }]).results[0]).toEqual({ premium: 33 });
      expect(quoteItems([{ type: "rune" }, { type: "rune" }]).results[0]).toEqual({ premium: 60 });
    });
    it("should apply block discount for exactly 3 alike components (60G instead of 75G)", () => {
      const threeRunes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
      expect(quoteItems(threeRunes).results[0]).toEqual({ premium: 71 });
    });
    it("should not apply block discount for non-exact-3 counts of alike components", () => {
      const runes = (n: number) => Array.from({ length: n }, () => ({ type: "rune" }));
      expect(quoteItems(runes(2)).results[0]).toEqual({ premium: 60 });
      expect(quoteItems(runes(4)).results[0]).toEqual({ premium: 115 });
      expect(quoteItems(runes(7)).results[0]).toEqual({ premium: 198 });
    });
    it("should treat different component types separately for block discount", () => {
      expect(quoteItems([
        { type: "rune" }, { type: "rune" }, { type: "moonstone" },
      ]).results[0]).toEqual({ premium: 88 });
      expect(quoteItems([
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ]).results[0]).toEqual({ premium: 137 });
    });
    it("should sum base premiums for multiple items in a policy", () => {
      expect(quoteItems([
        { type: "sword" }, { type: "amulet" },
      ]).results[0]).toEqual({ premium: 181 });
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("should add 50% cursed surcharge to the cursed item's base premium", () => {
      expect(quoteItems([
        { type: "sword", cursed: true },
      ]).results[0]).toEqual({ premium: 165 });
    });
    it("should add 30% high-enchantment surcharge for enchantment >= 5", () => {
      expect(quoteItems([
        { type: "sword", enchantment: 5 },
      ]).results[0]).toEqual({ premium: 145 });
      expect(quoteItems([
        { type: "sword", enchantment: 4 },
      ]).results[0]).toEqual({ premium: 115 });
    });
    it("should apply both cursed and high-enchantment surcharges to same item", () => {
      expect(quoteItems([
        { type: "sword", cursed: true, enchantment: 5 },
      ]).results[0]).toEqual({ premium: 195 });
    });
    it("should apply item-specific modifiers only to affected item, not whole policy", () => {
      expect(quoteItems([
        { type: "sword", cursed: true },
        { type: "amulet" },
      ]).results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("should apply 20% loyalty discount for customer with >= 2 years", () => {
      expect(quoteItems([{ type: "sword" }], 2).results[0]).toEqual({ premium: 95 });
      expect(quoteItems([{ type: "sword" }], 3).results[0]).toEqual({ premium: 95 });
      expect(quoteItems([{ type: "sword" }], 1).results[0]).toEqual({ premium: 115 });
    });
    it("should apply 10% first insurance surcharge on each quote", () => {
      expect(quoteItems([{ type: "sword" }]).results[0]).toEqual({ premium: 115 });
    });
    it("should apply 15% follow-up discount on second and subsequent quotes", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword" }] },
          { op: "quote" as const, items: [{ type: "sword" }] },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ premium: 100 });
    });
    it("should stack policy-wide modifiers (loyalty + first insurance + follow-up)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote" as const, items: [{ type: "amulet" }] },
          { op: "quote" as const, items: [{ type: "sword", cursed: true, enchantment: 7 }] },
        ],
      });
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Quote - rounding", () => {
    it("should round premiums up (in MHPCO's favor)", () => {
      expect(quoteItems([{ type: "rune" }]).results[0]).toEqual({ premium: 33 });
    });
  });

  describe("Claim - basic payout", () => {
    it("should apply 100G deductible per damaged item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword" }] },
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
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should fully reimburse standard items minus deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "accident",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should reimburse at 50% for items with enchantment >= 8, then deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword", enchantment: 9 }] },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "curse",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should fully reimburse dragon-material items minus deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
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
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("should apply 50% when both dragon-material and enchantment >= 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "battle",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should apply deductible per damaged item in multi-item damage", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
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
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("Claim - cap", () => {
    it("should cap total payout at 2x insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword" }] },
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
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("should track remaining cap across multiple claims on same policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword" }] },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "battle",
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
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("Claim - payout rounding", () => {
    it("should round payouts down (in MHPCO's favor)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword", enchantment: 9 }] },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "curse",
              damages: [{ itemType: "sword", amount: 501 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
    });
  });

  describe("Error handling", () => {
    it("should reject unknown item types in quote", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [{ type: "broomstick" }] }],
      })).toThrow();
    });
    it("should reject damage for item not in policy", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword" }] },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      })).toThrow();
    });
    it("should reject negative damage amounts", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword" }] },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "accident",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      })).toThrow();
    });
    it("should reject more damages of a type than insured items of that type", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword" }] },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "battle",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      })).toThrow();
    });
  });
});
