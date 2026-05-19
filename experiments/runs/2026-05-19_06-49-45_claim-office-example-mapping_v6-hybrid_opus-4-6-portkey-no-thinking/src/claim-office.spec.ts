import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns premium of 5 G for an empty item list (processing fee only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it.todo("returns base premium + fee for a single sword (100 + 5 = 105 G)");
    it.todo("returns base premium + fee for a single amulet (60 + 5 = 65 G)");
    it.todo("returns base premium + fee for a single staff (80 + 5 = 85 G)");
    it.todo("returns base premium + fee for a single potion (40 + 5 = 45 G)");
    it.todo("returns base premium + fee for a single rune component (25 + 5 = 30 G)");
    it.todo("returns sum of base premiums + fee for multiple items (sword + amulet = 160 + 5 = 165 G)");
  });

  describe("Quote - component block pricing", () => {
    it.todo("charges 50 G base premium for 2 runes (no block)");
    it.todo("charges 60 G base premium for 3 runes (block of 3 alike)");
    it.todo("charges 100 G base premium for 4 runes (no block applies)");
    it.todo("charges 75 G base premium for 2 runes + 1 moonstone (different types, no block)");
    it.todo("charges 120 G base premium for 3 runes + 3 moonstones (two separate blocks)");
    it.todo("charges 175 G base premium for 7 runes");
  });

  describe("Quote - item-specific modifiers", () => {
    it.todo("adds 50% cursed surcharge to cursed item's base premium");
    it.todo("adds 30% high-enchantment surcharge for enchantment level >= 5");
    it.todo("applies both cursed and high-enchantment surcharges to the same item");
    it.todo("does not add high-enchantment surcharge for enchantment level 4");
    it.todo("applies cursed surcharge only to the cursed item in a multi-item policy");
  });

  describe("Quote - policy-wide modifiers", () => {
    it.todo("applies 10% first insurance surcharge for newcomer (0 years, first contract)");
    it.todo("applies 20% loyalty discount for customer with >= 2 years");
    it.todo("applies 15% follow-up discount on second and subsequent contracts");
    it.todo("applies loyalty, first insurance, and follow-up modifiers together");
  });

  describe("Quote - rounding", () => {
    it.todo("rounds premium up to whole G in MHPCO's favor");
  });

  describe("Quote - integration", () => {
    it.todo("newcomer with cursed sword: 165 G");
    it.todo("long-standing customer second contract with cursed high-enchantment sword: 160 G");
  });

  describe("Quote - error handling", () => {
    it.todo("rejects unknown item type with error");
  });

  describe("Claim - standard reimbursement", () => {
    it.todo("reimburses damage minus 100 G deductible for a regular item");
    it.todo("reimburses damage to a component minus deductible");
  });

  describe("Claim - special clauses", () => {
    it.todo("reimburses at 50% for items with enchantment >= 8, then deductible");
    it.todo("fully reimburses dragon-material items minus deductible");
    it.todo("applies 50% rule when item is both dragon-material and enchantment >= 8");
    it.todo("fully reimburses dragon-material item with enchantment < 8 minus deductible");
  });

  describe("Claim - multiple damages", () => {
    it.todo("applies deductible per damaged item in a single event");
    it.todo("treats two damages of the same item type separately with own deductible");
  });

  describe("Claim - cap", () => {
    it.todo("caps total payout at 2x insurance sum");
    it.todo("tracks remaining cap across multiple claims on the same policy");
    it.todo("returns remainingCap of 0 when cap is exhausted");
  });

  describe("Claim - rounding", () => {
    it.todo("rounds payout down to whole G in MHPCO's favor");
  });

  describe("Claim - error handling", () => {
    it.todo("rejects damage for an item type not in the policy");
    it.todo("rejects more damage entries than insured items of that type");
    it.todo("rejects negative damage amount");
  });

  describe("CLI - scenario processing", () => {
    it.todo("processes a quote step and returns premium");
    it.todo("processes a claim step referencing a prior quote and returns payout and remainingCap");
    it.todo("processes multiple sequential steps");
  });
});
