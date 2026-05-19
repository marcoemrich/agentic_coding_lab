import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5G processing fee for empty item list", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it.todo("calculates premium for a single sword");
    it.todo("calculates premium for a single amulet");
    it.todo("calculates premium for a single staff");
    it.todo("calculates premium for a single potion");
    it.todo("calculates premium for a single component (rune)");
    it.todo("applies building block discount for exactly 3 alike components");
    it.todo("does not apply block discount for 4 alike components");
    it.todo("does not apply block discount for 3 components of different types");
    it.todo("calculates premium for multiple items in one policy");
  });

  describe("Quote - item-level modifiers", () => {
    it.todo("adds 50% cursed surcharge to cursed item base premium");
    it.todo("adds 30% high enchantment surcharge for enchantment level 5");
    it.todo("applies both cursed and high enchantment surcharges to same item");
  });

  describe("Quote - policy-level modifiers", () => {
    it.todo("applies 10% first insurance surcharge to policy base premium");
    it.todo("applies 20% loyalty discount for customer with 2+ years");
    it.todo("applies 15% follow-up discount on second contract");
  });

  describe("Quote - rounding and errors", () => {
    it.todo("rounds premium up in MHPCO's favor");
    it.todo("rejects unknown item type with error");
  });

  describe("Claim - basic payout", () => {
    it.todo("applies 100G deductible per damaged item");
    it.todo("reimburses at 50% for enchantment level 8 or higher");
    it.todo("fully reimburses dragon material items minus deductible");
    it.todo("applies 50% rule when both dragon material and enchantment >= 8");
    it.todo("rounds payout down in MHPCO's favor");
  });

  describe("Claim - cap and multiple damages", () => {
    it.todo("caps total payout at twice the insurance sum");
    it.todo("tracks remaining cap across multiple claims");
    it.todo("applies separate deductible per damaged item in same event");
  });

  describe("Claim - errors", () => {
    it.todo("rejects damage to item not covered by policy");
    it.todo("rejects more damages of a type than policy covers");
    it.todo("rejects negative damage amount");
  });

  describe("Integration", () => {
    it.todo("newcomer with cursed sword pays 165G");
    it.todo("long-standing customer second contract with cursed enchanted sword pays 160G");
  });
});
