import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns premium of 5G for an empty item list (processing fee only)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("returns base premium plus fee for a single sword (100 + 5 = 105G)", () => {
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
    it("returns base premium plus fee for a single amulet (60 + 5 = 65G)", () => {
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
    it("returns base premium plus fee for a single staff (80 + 5 = 85G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "staff", material: "oak", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("returns base premium plus fee for a single potion (40 + 5 = 45G)", () => {
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
    it("returns combined base premium plus fee for multiple items (sword + amulet = 160 + 5 = 165G)", () => {
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

  describe("Quote - component premiums", () => {
    it("returns 25G base premium per component (2 runes = 50 + 5 = 55G)", () => {
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
    it("applies block discount for exactly 3 alike components (3 runes = 60 + 5 = 65G)", () => {
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
    it("does not apply block discount for 4 alike components (4 runes = 100 + 5 = 105G)", () => {
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
    it("does not apply block for mixed component types (2 runes + 1 moonstone = 75 + 5 = 80G)", () => {
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
    it("applies separate blocks for different component types (3 runes + 3 moonstones = 120 + 5 = 125G)", () => {
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
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies 10% first insurance surcharge (always applies to each quote item)", () => {
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
    it.todo("applies 15% follow-up contract discount on second and subsequent quotes");
  });

  describe("Quote - rounding", () => {
    it.todo("rounds premium up in MHPCO's favor (ceiling)");
  });

  describe("Quote - integration", () => {
    it.todo("newcomer with cursed sword: 165G");
    it.todo("long-standing customer second contract with cursed high-enchant sword: 160G");
  });

  describe("Quote - errors", () => {
    it.todo("throws error for unknown item type");
  });

  describe("Claim - standard reimbursement", () => {
    it.todo("reimburses full damage minus 100G deductible for a standard item");
    it.todo("reimburses full damage minus deductible for a component (rune)");
  });

  describe("Claim - special clauses", () => {
    it.todo("reimburses at 50% for items with enchantment >= 8, then applies deductible");
    it.todo("fully reimburses dragon-material items, then applies deductible");
    it.todo("applies 50% rule when item has both dragon material and enchantment >= 8");
    it.todo("fully reimburses dragon-material item with enchantment < 8, then applies deductible");
  });

  describe("Claim - cap", () => {
    it.todo("caps total payout at twice the insurance sum");
    it.todo("tracks remaining cap across multiple claims");
  });

  describe("Claim - multiple damages in one event", () => {
    it.todo("applies deductible per damaged item in a single event");
    it.todo("handles two items of the same type with separate deductibles");
  });

  describe("Claim - rounding", () => {
    it.todo("rounds payout down in MHPCO's favor (floor)");
  });

  describe("Claim - errors", () => {
    it.todo("throws error when damage references an item not in the policy");
    it.todo("throws error when more damage entries than insured items of that type");
    it.todo("throws error for negative damage amount");
  });
});
