import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5 G processing fee for an empty item list", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("returns base premium plus fee for a single sword", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("returns base premium plus fee for a single amulet", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("returns base premium plus fee for a single staff", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "staff", material: "oak", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("returns base premium plus fee for a single potion", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("returns base premium plus fee for a single component (rune)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("sums base premiums for multiple different items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
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

  describe("Quote - component block pricing", () => {
    it("charges 50 G for 2 runes (no block)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("charges 60 G for exactly 3 alike components (block applies)", () => {
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
    it("charges 100 G for 4 runes (no block)", () => {
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
    it("charges 75 G for 2 runes + 1 moonstone (different types, no block)", () => {
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
    it("charges 120 G for 3 runes + 3 moonstones (two separate blocks)", () => {
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
    it("charges 175 G for 7 runes (no block for non-3 counts)", () => {
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

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% surcharge for a cursed item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("adds 30% surcharge for enchantment level >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("applies both cursed and high-enchantment surcharges to the same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
    it("does not add high-enchantment surcharge for enchantment level 4", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 4, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("applies item-specific surcharges only to the affected item in a multi-item policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
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
    it("adds 10% first insurance surcharge for a new customer", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("applies 20% loyalty discount for customer with >= 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("applies 15% follow-up discount on second and subsequent contracts", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({
        results: [{ premium: 115 }, { premium: 100 }],
      });
    });
    it("applies loyalty, first insurance, and follow-up modifiers together", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({
        results: [{ premium: 95 }, { premium: 80 }],
      });
    });
  });

  describe("Quote - rounding", () => {
    it("rounds premium up in MHPCO's favor", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }],
          },
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result).toEqual({
        results: [{ premium: 50 }, { premium: 43 }],
      });
    });
  });

  describe("Quote - integration", () => {
    it("newcomer with cursed sword: premium is 165 G", () => {
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
    it("long-standing customer second contract with cursed enchanted sword: premium is 160 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });
      expect(result).toEqual({
        results: [{ premium: 175 }, { premium: 160 }],
      });
    });
  });

  describe("Quote - validation", () => {
    it("rejects unknown item type with an error", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "broomstick", material: "wood", enchantment: 0, cursed: false }],
            },
          ],
        }),
      ).toThrow();
    });
  });

  describe("Claim - basic payout", () => {
    it("applies 100 G deductible to a standard damage claim", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
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
      });
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("fully reimburses dragon material items minus deductible", () => {
      const result = processScenario({
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
      });
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 700, remainingCap: 1300 },
        ],
      });
    });
    it("reimburses at 50% for enchantment >= 8 then applies deductible", () => {
      const result = processScenario({
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
      });
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("applies 50% rule when both dragon material and enchantment >= 8", () => {
      const result = processScenario({
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
      });
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("fully reimburses dragon material with enchantment < 8 minus deductible", () => {
      const result = processScenario({
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
      });
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 700, remainingCap: 1300 },
        ],
      });
    });
  });

  describe("Claim - cap and multiple damages", () => {
    it("caps total payout at twice the insurance sum", () => {
      const result = processScenario({
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
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 1400, remainingCap: 600 },
          { payout: 600, remainingCap: 0 },
        ],
      });
    });
    it("applies deductible per damaged item in a multi-damage event", () => {
      const result = processScenario({
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
          { premium: 181 },
          { payout: 600, remainingCap: 2600 },
        ],
      });
    });
    it("tracks remaining cap across successive claims on the same policy", () => {
      const result = processScenario({
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
              damages: [{ itemType: "sword", amount: 500 }],
            },
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
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 400, remainingCap: 1600 },
          { payout: 400, remainingCap: 1200 },
          { payout: 400, remainingCap: 800 },
        ],
      });
    });
    it("reduces payout to remaining cap when cap is nearly exhausted", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 1000 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 500 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 71 },
          { payout: 900, remainingCap: 300 },
          { payout: 300, remainingCap: 0 },
        ],
      });
    });
  });

  describe("Claim - component and multi-item", () => {
    it("processes damage to a component (rune) with deductible", () => {
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
              cause: "fire",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 33 },
          { payout: 100, remainingCap: 400 },
        ],
      });
    });
    it("handles multiple items of the same type with separate deductibles", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
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
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 225 },
          { payout: 800, remainingCap: 3200 },
        ],
      });
    });
  });

  describe("Claim - validation", () => {
    it("rejects claim referencing an item not in the policy", () => {
      expect(() =>
        processScenario({
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
        }),
      ).toThrow();
    });
    it("rejects negative damage amount", () => {
      expect(() =>
        processScenario({
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
        }),
      ).toThrow();
    });
    it("rejects more damages of a type than the policy covers", () => {
      expect(() =>
        processScenario({
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
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 300 },
                ],
              },
            },
          ],
        }),
      ).toThrow();
    });
  });

  describe("Claim - rounding", () => {
    it("rounds payout down in MHPCO's favor", () => {
      const result = processScenario({
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
      });
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 150, remainingCap: 1850 },
        ],
      });
    });
  });
});
