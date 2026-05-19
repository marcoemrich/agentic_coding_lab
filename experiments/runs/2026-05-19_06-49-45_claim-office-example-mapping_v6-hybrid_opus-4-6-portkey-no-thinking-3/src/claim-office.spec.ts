import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5 G processing fee for an empty item list", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("returns base premium plus fee for a single sword (100 + 5 = 105 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        }],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("returns base premium plus fee for a single amulet (60 + 5 = 65 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        }],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("returns base premium plus fee for a single staff (80 + 5 = 85 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
        }],
      });
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("returns base premium plus fee for a single potion (40 + 5 = 45 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        }],
      });
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("returns 25 G base premium per component (rune) plus fee", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
          ],
        }],
      });
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("returns 60 G base premium for a building block of exactly 3 alike components", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        }],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("returns individual pricing for 4 alike components (no block discount)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        }],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("sums base premiums for multiple different items plus fee", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        }],
      });
      expect(result.results[0]).toEqual({ premium: 181 });
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% cursed surcharge to the cursed item's base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        }],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("adds 30% high-enchantment surcharge for enchantment level >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        }],
      });
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("applies both cursed and high-enchantment surcharges to the same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        }],
      });
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("applies item-specific surcharges only to affected items in a multi-item policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        }],
      });
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("adds 10% first-insurance surcharge for a new customer", () => {
      // potion: base 40, first-insurance 10% of 40 = 4, total 44 + 5 fee = 49
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        }],
      });
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("applies 20% loyalty discount for customer with >= 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        }],
      });
      // sword base 100, first-ins 10% of 100 = 10, loyalty -20% of 100 = -20
      // total: 100 + 10 - 20 = 90 + 5 fee = 95
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("applies 15% follow-up discount on second and subsequent quotes", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
          },
        ],
      });
      // first quote: sword 100 + first-ins 10 = 110 + 5 = 115
      expect(result.results[0]).toEqual({ premium: 115 });
      // second quote: amulet 60 + first-ins 6 - follow-up 9 = 57 + 5 = 62
      expect(result.results[1]).toEqual({ premium: 62 });
    });
    it("combines loyalty discount, first-insurance surcharge, and follow-up discount", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
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
      });
      // first quote: 100 base + 10 first-ins - 20 loyalty = 90 + 5 fee = 95
      expect(result.results[0]).toEqual({ premium: 95 });
      // second quote: 100 base + 10 first-ins - 20 loyalty - 15 follow-up = 75 + 5 fee = 80
      expect(result.results[1]).toEqual({ premium: 80 });
    });
  });

  describe("Quote - rounding", () => {
    it("rounds premium up in MHPCO's favor", () => {
      // 1 rune: policyBase = 25, itemsTotal = 25
      // firstInsurance = 2.5, loyalty = -5
      // total = 25 + 2.5 - 5 + 5 = 27.5 → rounds up to 28
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "rune" }],
        }],
      });
      expect(result.results[0]).toEqual({ premium: 28 });
    });
  });

  describe("Quote - errors", () => {
    it("throws error for unknown item type", () => {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "broomstick", material: "wood", enchantment: 0, cursed: false }],
        }],
      })).toThrow();
    });
  });

  describe("Claim - basic payout", () => {
    it("applies 100 G deductible per damaged item for standard reimbursement", () => {
      const result = processScenario({
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      // sword insurance value 1000, cap = 2000
      // damage 500, standard reimbursement, deductible 100 → payout 400
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("applies 100 G deductible per item when multiple items are damaged", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim" as const,
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
      });
      // sword: 500 - 100 = 400, amulet: 300 - 100 = 200, total = 600
      // insurance sum = 1000 + 600 = 1600, cap = 3200, remaining = 3200 - 600 = 2600
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("reimburses component (rune) damage with standard deductible", () => {
      const result = processScenario({
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
      });
      // rune insurance value 250, cap = 500
      // damage 200, standard reimbursement, deductible 100 → payout 100
      // remaining cap = 500 - 100 = 400
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("Claim - enchantment and material clauses", () => {
    it("reimburses at 50% for items with enchantment >= 8 then applies deductible", () => {
      const result = processScenario({
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
      });
      // enchantment 9 >= 8: reimburse at 50% → 500, then deductible → 400
      // insurance sum 1000, cap 2000, remaining = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("fully reimburses dragon-material items then applies deductible", () => {
      const result = processScenario({
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
      });
      // dragon material: full reimbursement, then deductible: 800 - 100 = 700
      // insurance sum 1000, cap 2000, remaining = 2000 - 700 = 1300
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("applies 50% rule when item has both enchantment >= 8 and dragon material", () => {
      const result = processScenario({
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
      });
      // both enchantment >= 8 and dragon: 50% wins → 500, then deductible → 400
      // insurance sum 1000, cap 2000, remaining = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("fully reimburses dragon-material item with enchantment < 8 then applies deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "dragon", enchantment: 7, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 400 }],
            },
          },
        ],
      });
      // dragon material, enchantment 7 (< 8): full reimbursement, then deductible
      // 400 - 100 = 300
      // insurance sum 600, cap 1200, remaining = 1200 - 300 = 900
      expect(result.results[1]).toEqual({ payout: 300, remainingCap: 900 });
    });
  });

  describe("Claim - payout cap", () => {
    it("caps total payout at twice the insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "explosion",
              damages: [{ itemType: "potion", amount: 1000 }],
            },
          },
        ],
      });
      // potion insurance value 400, cap = 800
      // damage 1000 - 100 deductible = 900, but cap is 800
      // payout = 800, remaining cap = 0
      expect(result.results[1]).toEqual({ payout: 800, remainingCap: 0 });
    });
    it("tracks remaining cap across multiple claims on the same policy", () => {
      const result = processScenario({
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
              cause: "dragon",
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
      // sword insurance sum 1000, cap = 2000
      // first claim: 1500 - 100 = 1400, cap remaining = 2000 - 1400 = 600
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      // second claim: 1500 - 100 = 1400, but cap remaining is 600
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("Claim - errors", () => {
    it("throws error when damage references an item not in the policy", () => {
      expect(() => processScenario({
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
      })).toThrow();
    });
    it("throws error when more damages of a type than insured items", () => {
      expect(() => processScenario({
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
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      })).toThrow();
    });
    it("throws error for negative damage amount", () => {
      expect(() => processScenario({
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
      })).toThrow();
    });
  });

  describe("Claim - rounding", () => {
    it("rounds payout down in MHPCO's favor", () => {
      const result = processScenario({
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
      });
      // enchantment 9 >= 8: 50% of 501 = 250.5, minus deductible 100 = 150.5
      // round down → 150
      // insurance sum 1000, cap 2000, remaining = 2000 - 150 = 1850
      expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
    });
  });

  describe("Integration", () => {
    it("newcomer with cursed sword pays 165 G premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        }],
      });
      // 100 base + 50 curse + 10 first-insurance = 160 + 5 fee = 165
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("long-standing customer second contract with cursed high-enchantment sword pays 160 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });
      // second quote: 100 base + 50 curse + 30 enchantment - 20 loyalty + 10 first-ins - 15 follow-up
      // = 155 + 5 fee = 160
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });
});
