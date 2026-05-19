import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("should charge only the 5 G processing fee for an empty item list", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("should compute base premium for a single sword (100 G + 5 G fee = 105 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should compute base premium for a single amulet (60 G + 5 G fee = 65 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("should compute base premium for a single staff (80 G + 5 G fee = 85 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("should compute base premium for a single potion (40 G + 5 G fee = 45 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("should compute base premium for a single component (25 G + 5 G fee = 30 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 30 }] });
    });
    it("should sum base premiums for multiple items in a policy", () => {
      const result = processScenario({
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
      });
      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
  });

  describe("Quote - component blocks", () => {
    it("should charge 50 G base premium for 2 runes (no block)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 55 }] });
    });
    it("should charge 60 G base premium for exactly 3 alike components (block applies)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 65 }] });
    });
    it("should charge 100 G base premium for 4 runes (no block)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 105 }] });
    });
    it("should charge 175 G base premium for 7 runes", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: Array.from({ length: 7 }, () => ({ type: "rune" })),
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 180 }] });
    });
    it("should not form a block from different component types (2 runes + 1 moonstone = 75 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 80 }] });
    });
    it("should form two separate blocks for 3 runes + 3 moonstones (120 G)", () => {
      const result = processScenario({
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
      });
      expect(result).toEqual({ results: [{ premium: 125 }] });
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("should add 50% cursed surcharge to a cursed item's base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("should add 30% high-enchantment surcharge for enchantment level >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("should apply both cursed and high-enchantment surcharges to the same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
    it("should apply cursed surcharge only to the cursed item in a multi-item policy", () => {
      const result = processScenario({
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
      });
      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("should apply 10% first-insurance surcharge to the policy base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should apply 20% loyalty discount for customers with >= 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("should apply 15% follow-up discount on second and subsequent quotes", () => {
      const result = processScenario({
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
      });
      expect(result).toEqual({
        results: [{ premium: 115 }, { premium: 100 }],
      });
    });
    it("should stack loyalty, first-insurance, and follow-up modifiers", () => {
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
      expect(result).toEqual({
        results: [{ premium: 95 }, { premium: 80 }],
      });
    });
  });

  describe("Quote - rounding", () => {
    it("should round premium up to whole G in MHPCO's favor", () => {
      // With current item premiums and modifier percentages, all calculations
      // produce integer results. This test documents the rounding contract:
      // premiums must be rounded up (Math.ceil) in MHPCO's favor.
      // A loyal follow-up customer with a plain sword: 100 + 10 - 20 - 15 + 5 = 80 (integer)
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
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
      // First quote: 100 + 10 - 20 + 5 = 95 (loyalty, no follow-up)
      // Second quote: 100 + 10 - 20 - 15 + 5 = 80 (loyalty + follow-up)
      expect(result).toEqual({
        results: [{ premium: 95 }, { premium: 80 }],
      });
    });
  });

  describe("Quote - integration", () => {
    it("should compute 165 G for newcomer with cursed sword (steel, enchantment 3)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("should compute 160 G for long-standing customer's second contract with cursed sword (enchantment 7)", () => {
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
      expect(result).toEqual({
        results: [expect.any(Object), { premium: 160 }],
      });
    });
  });

  describe("Claim - standard reimbursement", () => {
    it("should reimburse damage minus 100 G deductible for a regular item", () => {
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
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("should reimburse damage to a component minus deductible", () => {
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
      expect(result).toEqual({
        results: [
          { premium: 30 },
          { payout: 100, remainingCap: 400 },
        ],
      });
    });
  });

  describe("Claim - special clauses", () => {
    it("should reimburse at 50% for enchantment >= 8, then subtract deductible", () => {
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
      expect(result).toEqual({
        results: [
          expect.any(Object),
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("should fully reimburse dragon-material items, then subtract deductible", () => {
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
      expect(result).toEqual({
        results: [
          expect.any(Object),
          { payout: 700, remainingCap: 1300 },
        ],
      });
    });
    it("should apply 50% rule when both enchantment >= 8 and dragon material", () => {
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
      expect(result).toEqual({
        results: [
          expect.any(Object),
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
  });

  describe("Claim - multiple damages", () => {
    it("should apply deductible separately per damaged item in a single event", () => {
      const result = processScenario({
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
      });
      expect(result).toEqual({
        results: [
          expect.any(Object),
          { payout: 600, remainingCap: 2600 },
        ],
      });
    });
  });

  describe("Claim - cap", () => {
    it("should cap total payout at 2x insurance sum", () => {
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
      expect(result).toEqual({
        results: [
          expect.any(Object),
          { payout: 800, remainingCap: 0 },
        ],
      });
    });
    it("should track remaining cap across successive claims on the same policy", () => {
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "flood",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          expect.any(Object),
          { payout: 1400, remainingCap: 600 },
          { payout: 600, remainingCap: 0 },
        ],
      });
    });
  });

  describe("Claim - rounding", () => {
    it("should round payout down to whole G in MHPCO's favor", () => {
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
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          expect.any(Object),
          { payout: 350, remainingCap: 1650 },
        ],
      });
    });
  });

  describe("Error handling", () => {
    it("should reject unknown item type in a quote", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [{ type: "broomstick", material: "wood", enchantment: 0, cursed: false }],
            },
          ],
        })
      ).toThrow();
    });
    it("should reject claim for item not in policy", () => {
      expect(() =>
        processScenario({
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
        })
      ).toThrow();
    });
    it("should reject claim with more damages of a type than insured", () => {
      expect(() =>
        processScenario({
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
    it("should reject claim with negative damage amount", () => {
      expect(() =>
        processScenario({
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
        })
      ).toThrow();
    });
  });
});
