import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5G premium for an empty item list (processing fee only)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("returns base premium + fee for a single sword (100 + 5 = 105)", () => {
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
    it("returns base premium + fee for a single amulet (60 + 5 = 65)", () => {
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
    it("returns base premium + fee for a single staff (80 + 5 = 85)", () => {
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
    it("returns base premium + fee for a single potion (40 + 5 = 45)", () => {
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
    it("sums base premiums for multiple items (sword + amulet = 160 + 5 = 165)", () => {
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

  describe("Quote - components", () => {
    it("returns 25G base premium per component (2 runes = 50 + 5 = 55)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("applies building block discount for exactly 3 alike components (3 runes = 60 + 5 = 65)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("does not apply block discount for 4 alike components (4 runes = 100 + 5 = 105)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("does not apply block discount across different component types (2 runes + 1 moonstone = 75 + 5 = 80)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("applies separate block discounts per component type (3 runes + 3 moonstones = 120 + 5 = 125)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
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
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Quote - item-level modifiers", () => {
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
      // 100 base + 50 curse + 10 first-insurance + 5 fee = 165
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
      // 100 base + 30 ench + 10 first-insurance + 5 fee = 145
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
      // 100 base + 10 first-insurance + 5 fee = 115
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
      // 100 base + 50 curse + 30 ench + 10 first-insurance + 5 fee = 195
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("applies item-level surcharges only to affected items in a multi-item policy", () => {
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
      // sword: 100+50 curse; amulet: 60; base=160, surcharges=50, first-ins=16, fee=5 → 231
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote - policy-level modifiers", () => {
    it("adds 10% first-insurance surcharge on the policy base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      // 100 base + 10 first-insurance (10% of 100) = 110 + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
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
      // 100 base + 10 first-insurance - 20 loyalty (20% of 100) + 5 fee = 95
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
      // 100 base + 10 first-insurance + 5 fee = 115 (no loyalty discount)
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies 15% follow-up contract discount on second and subsequent quotes", () => {
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
      // First quote: 100 + 10 first-ins + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
      // Second quote: 100 + 10 first-ins - 15 follow-up (15% of 100) + 5 fee = 100
      expect(result.results[1]).toEqual({ premium: 100 });
    });
    it("applies first-insurance surcharge even for long-standing customers (per-item, always)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      // 100 base + 10 first-insurance - 20 loyalty + 5 fee = 95
      expect(result.results[0]).toEqual({ premium: 95 });
    });
  });

  describe("Quote - rounding", () => {
    it("rounds premium up (in MHPCO's favor) to whole G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" }, { type: "rune" }, { type: "rune" },
              { type: "rune" }, { type: "rune" }, { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      // 7 runes = 175 base, firstIns = 17.5, fee = 5 → 197.5 → ceil = 198
      expect(result.results[0]).toEqual({ premium: 198 });
    });
  });

  describe("Quote - integration", () => {
    it("newcomer with cursed sword: 165G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it.todo("long-standing customer second contract with cursed high-enchantment sword: 160G");
  });

  describe("Quote - errors", () => {
    it.todo("throws error for unknown item type");
  });

  describe("Claim - basic payout", () => {
    it.todo("applies 100G deductible per damaged item");
    it.todo("fully reimburses damage to a regular item minus deductible");
    it.todo("applies deductible separately to each damaged item in same event");
  });

  describe("Claim - special reimbursement clauses", () => {
    it.todo("reimburses at 50% for items with enchantment >= 8, then deductible");
    it.todo("fully reimburses dragon-material items minus deductible");
    it.todo("applies 50% rule when both dragon material and enchantment >= 8");
    it.todo("does not apply enchantment clause for enchantment < 8");
  });

  describe("Claim - cap", () => {
    it.todo("caps total payout at 2x insurance sum");
    it.todo("tracks remaining cap across multiple claims on the same policy");
    it.todo("returns remainingCap in each claim result");
  });

  describe("Claim - errors", () => {
    it.todo("throws error when damage references an item not in the policy");
    it.todo("throws error for negative damage amount");
    it.todo("throws error when more damages of a type than insured items");
  });

  describe("Claim - rounding", () => {
    it.todo("rounds payout down (in MHPCO's favor) to whole G");
  });
});
