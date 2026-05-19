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
    it("calculates base premium for a single sword (100 G + 10 G first ins + 5 G fee = 115 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("calculates base premium for a single amulet (60 G + 5 G fee = 65 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("calculates base premium for a single staff (80 G + 8 G first ins + 5 G fee = 93 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("calculates base premium for a single potion (40 G + 4 G first ins + 5 G fee = 49 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("calculates base premium for a single component (25 G + 5 G fee = 30 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("calculates base premium for multiple items (sword + amulet = 160 G + 5 G fee = 165 G)", () => {
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
      expect(result.results[0]).toEqual({ premium: 181 });
    });
  });

  describe("Quote - component block pricing", () => {
    it("charges 50 G for 2 runes (no block)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("charges 60 G for 3 alike runes (block applies)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("charges 100 G for 4 runes (no block — block requires exactly 3)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("charges 75 G for 2 runes + 1 moonstone (no block — different types)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("charges 120 G for 3 runes + 3 moonstones (two separate blocks)", () => {
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
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% cursed surcharge to the cursed item's base premium only", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
          },
        ],
      });
      // 100 base + 50 curse + 10 first insurance + 5 fee = 165
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("adds 30% high-enchantment surcharge for enchantment level >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      });
      // 100 base + 30 high-ench + 10 first ins + 5 fee = 145
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("does not add high-enchantment surcharge for enchantment level 4", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
          },
        ],
      });
      // 100 base + 0 high-ench (below threshold) + 10 first ins + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies both cursed and high-enchantment surcharges to the same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      });
      // 100 base + 50 curse + 30 high-ench + 10 first ins + 5 fee = 195
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("applies cursed surcharge only to the cursed item in a multi-item policy", () => {
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
      // base 160 (100+60) + 50 curse (on sword only) + 16 first ins (10% of 160) + 5 fee = 231
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("applies 20% loyalty discount for customers with >= 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      // 100 base - 20 loyalty (20% of 100) + 10 first ins (10% of 100) + 5 fee = 95
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("does not apply loyalty discount for customers with < 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      // 100 base + 0 loyalty (1 < 2) + 10 first ins + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies 10% first insurance surcharge to every item in a quote", () => {
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
      // base 160 (100+60) + 16 first ins (10% of 160) + 5 fee = 181
      expect(result.results[0]).toEqual({ premium: 181 });
    });
    it("applies 15% follow-up contract discount on the second quote step", () => {
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
      // First quote: 100 + 10 first ins + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
      // Second quote: 100 + 10 first ins - 15 follow-up (15% of 100) + 5 fee = 100
      expect(result.results[1]).toEqual({ premium: 100 });
    });
  });

  describe("Quote - rounding", () => {
    it("rounds premium up to whole G in MHPCO's favor (e.g. 197.5 → 198)", () => {
      // rune with loyal customer: base 25 - 5 loyalty + 2.5 first ins + 5 fee = 27.5 → ceil = 28
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 28 });
    });
  });

  describe("Quote - integration", () => {
    it("newcomer with cursed sword → 165 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });
      // 100 base + 50 curse + 10 first ins = 160 + 5 fee = 165
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("long-standing customer second contract with cursed enchanted sword → 160 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
          },
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });
      // Second quote: 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first ins - 15 follow-up = 155 + 5 fee = 160
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Quote - errors", () => {
    it("rejects unknown item type with an error", () => {
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
  });

  describe("Claim - basic payout", () => {
    it("applies 100 G deductible per damaged item", () => {
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      // sword insurance value 1000 G, cap = 2000 G
      // damage 500 G - 100 G deductible = 400 G payout
      // remainingCap = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it.todo("applies deductible to each item separately in a multi-item damage event");
  });

  describe("Claim - special reimbursement clauses", () => {
    it.todo("reimburses at 50% for items with enchantment >= 8 (then deductible)");
    it.todo("fully reimburses dragon-material items (then deductible)");
    it.todo("applies 50% rule when both enchantment >= 8 and dragon material");
    it.todo("fully reimburses dragon-material with enchantment < 8 (then deductible)");
  });

  describe("Claim - standard reimbursement", () => {
    it.todo("fully reimburses regular items minus deductible (no special clause)");
    it.todo("fully reimburses component damage minus deductible");
  });

  describe("Claim - cap", () => {
    it.todo("caps total payout at 2x insurance sum");
    it.todo("tracks remaining cap across successive claims on same policy");
    it.todo("reduces payout to remaining cap when cap is nearly exhausted");
  });

  describe("Claim - payout rounding", () => {
    it.todo("rounds payout down in MHPCO's favor (e.g. 350.5 → 350)");
  });

  describe("Claim - errors", () => {
    it.todo("rejects claim referencing an item not in the policy");
    it.todo("rejects claim with negative damage amount");
    it.todo("rejects claim with more damages of a type than policy covers");
  });

  describe("CLI", () => {
    it.todo("reads JSON from stdin and writes results to stdout");
    it.todo("processes sequential quote and claim steps");
  });
});
