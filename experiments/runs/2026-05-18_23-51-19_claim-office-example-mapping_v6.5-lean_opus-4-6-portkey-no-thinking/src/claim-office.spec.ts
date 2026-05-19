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
    it("computes base premium for a single sword (100 G + 5 G fee)", () => {
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
    it("computes base premium for a single amulet (60 G + 5 G fee)", () => {
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
    it("computes base premium for a single staff (80 G + 5 G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("computes base premium for a single potion (40 G + 5 G fee)", () => {
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
    it("computes base premium for a single component (25 G + 5 G fee)", () => {
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
      // 100 + 60 = 160 base, + 16 (10% first insurance) + 5 fee = 181
      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
  });

  describe("Quote - component blocks", () => {
    it("applies block discount for exactly 3 alike components (60 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      // 60 base (block) + 6 (10% first insurance) + 5 fee = 71
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("does not apply block for 2 alike components (50 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      });
      // 50 base + 5 (10%) + 5 fee = 60
      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("does not apply block for 4 alike components (100 G)", () => {
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
      // 100 base + 10 (10%) + 5 fee = 115
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("applies two separate blocks for 3 runes + 3 moonstones (120 G)", () => {
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
      // 120 base + 12 (10%) + 5 fee = 137
      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
    it("does not apply block for mixed component types (2 runes + 1 moonstone = 75 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
            ],
          },
        ],
      });
      // 75 base + 7.5 (10%) + 5 fee = 87.5 → 88
      expect(result).toEqual({ results: [{ premium: 88 }] });
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% cursed surcharge to the cursed item's base premium", () => {
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
      // 100 base + 50 cursed surcharge + 10 (10% first insurance on 100 base) + 5 fee = 165
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("adds 30% high-enchantment surcharge for enchantment level >= 5", () => {
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
      // 100 base + 30 enchantment surcharge + 10 (10% first insurance on 100) + 5 fee = 145
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
      // 100 base + 50 cursed + 30 enchantment + 10 (10% first insurance on 100) + 5 fee = 195
      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
    it("applies cursed surcharge only to the cursed item in a multi-item policy", () => {
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
      // 160 base + 50 cursed surcharge (on sword only) + 16 (10% first insurance on 160) + 5 fee = 231
      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("applies 10% first insurance surcharge for a new customer's first quote", () => {
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
      // policy base 160 + 16 (10% first insurance) + 5 fee = 181
      expect(result).toEqual({ results: [{ premium: 181 }] });
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
      // 100 base - 20 (20% loyalty) + 10 (10% first insurance) + 5 fee = 95
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("applies 15% follow-up discount on second and subsequent quotes", () => {
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
      // First quote: 100 + 10 (first insurance) + 5 = 115
      // Second quote: 100 + 10 (first insurance) - 15 (follow-up) + 5 = 100
      expect(result).toEqual({
        results: [{ premium: 115 }, { premium: 100 }],
      });
    });
    it("stacks loyalty discount, first insurance surcharge, and follow-up discount", () => {
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
      // First: 100 - 20 (loyalty) + 10 (first insurance) + 5 fee = 95
      // Second: 100 - 20 (loyalty) + 10 (first insurance) - 15 (follow-up) + 5 fee = 80
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
            items: [{ type: "rune" }],
          },
        ],
      });
      // 25 base - 5 (20% loyalty) + 2.5 (10% first insurance) + 5 fee = 27.5 → 28
      expect(result).toEqual({ results: [{ premium: 28 }] });
    });
  });

  describe("Quote - integration", () => {
    it("newcomer with cursed sword yields 165 G", () => {
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
    it("long-standing customer second contract with cursed enchanted sword yields 160 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
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
      // First: 60 base - 12 (loyalty) + 6 (first insurance) + 5 fee = 59
      // Second: 100 base + 50 curse + 30 enchantment - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee = 160
      expect(result).toEqual({
        results: [{ premium: 59 }, { premium: 160 }],
      });
    });
  });

  describe("Quote - errors", () => {
    it("rejects unknown item type", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "broomstick" }],
            },
          ],
        }),
      ).toThrow();
    });
  });

  describe("Claim - basic payout", () => {
    it("applies 100 G deductible per damaged item", () => {
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      // payout = 500 - 100 deductible = 400, cap = 2000, remaining = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("fully reimburses damage to regular items minus deductible", () => {
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
              cause: "theft",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      });
      // payout = 300 - 100 deductible = 200, cap = 1200, remaining = 1000
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1000 });
    });
    it("fully reimburses damage to dragon-material items minus deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon-scale", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "tavern brawl",
              damages: [{ itemType: "sword", amount: 600 }],
            },
          },
        ],
      });
      // payout = 600 - 100 deductible = 500, cap = 2000, remaining = 1500
      expect(result.results[1]).toEqual({ payout: 500, remainingCap: 1500 });
    });
    it("reimburses damage to high-enchantment items (>= 8) at 50% minus deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "magical mishap",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      // high enchantment: 50% of 500 = 250, minus 100 deductible = 150
      // cap = 2000, remaining = 1850
      expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
    });
    it.todo("applies 50% rule when item has both dragon material and enchantment >= 8");
  });

  describe("Claim - cap", () => {
    it.todo("caps total payout at twice the insurance sum");
    it.todo("tracks remaining cap across successive claims on the same policy");
  });

  describe("Claim - multiple damages", () => {
    it.todo("applies deductible separately to each damaged item in a single event");
    it.todo("handles damage to components (no enchantment/material clauses)");
  });

  describe("Claim - errors", () => {
    it.todo("rejects damage for item type not in the policy");
    it.todo("rejects negative damage amount");
    it.todo("rejects more damages of a type than the policy covers");
  });

  describe("Claim - rounding", () => {
    it.todo("rounds payout down in MHPCO's favor");
  });
});
