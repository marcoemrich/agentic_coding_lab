import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns premium of 5G for an empty item list (processing fee only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it.todo("returns premium of 105G for a single sword (100G base + 5G fee)");
    it.todo("returns premium of 65G for a single amulet (60G base + 5G fee)");
    it.todo("returns premium of 85G for a single staff (80G base + 5G fee)");
    it.todo("returns premium of 45G for a single potion (40G base + 5G fee)");
    it.todo("returns premium of 30G for a single rune component (25G base + 5G fee)");
    it.todo("returns combined base premiums plus fee for multiple different items");
  });

  describe("Quote - component block pricing", () => {
    it.todo("returns 55G for 2 runes (50G base + 5G fee, no block)");
    it.todo("returns 65G for 3 runes (60G block + 5G fee)");
    it.todo("returns 105G for 4 runes (100G = 4x25G, no block)");
    it.todo("returns 80G for 2 runes + 1 moonstone (75G, no block, different types)");
    it.todo("returns 125G for 3 runes + 3 moonstones (two blocks: 60G + 60G + 5G fee)");
  });

  describe("Quote - item-specific modifiers", () => {
    it.todo("adds 50% cursed surcharge to the cursed item's base premium only");
    it.todo("adds 30% high-enchantment surcharge for enchantment level >= 5");
    it.todo("applies both cursed and high-enchantment surcharges to the same item");
    it.todo("applies cursed surcharge only to the cursed item in a multi-item policy");
  });

  describe("Quote - policy-wide modifiers", () => {
    it.todo("applies 10% first insurance surcharge on policy base premium");
    it.todo("applies 20% loyalty discount for customer with >= 2 years");
    it.todo("applies 15% follow-up discount on second and subsequent quotes");
    it.todo("applies first insurance surcharge even for long-standing customers");
  });

  describe("Quote - rounding", () => {
    it.todo("rounds premium up in MHPCO's favor");
  });

  describe("Quote - integration", () => {
    it.todo("newcomer with cursed sword: premium is 165G");
    it.todo("long-standing customer second contract with cursed high-enchantment sword: premium is 160G");
  });

  describe("Quote - errors", () => {
    it.todo("throws error for unknown item type");
  });

  describe("Claim - standard reimbursement", () => {
    it.todo("reimburses damage minus 100G deductible for a regular item");
    it.todo("reimburses damage to a rune minus 100G deductible");
  });

  describe("Claim - special clauses", () => {
    it.todo("reimburses at 50% for items with enchantment >= 8, then deductible");
    it.todo("reimburses fully for dragon-material items, then deductible");
    it.todo("uses 50% rule when item is both dragon-material and enchantment >= 8");
  });

  describe("Claim - deductible per item", () => {
    it.todo("applies deductible once per damaged item in a multi-item claim");
  });

  describe("Claim - cap", () => {
    it.todo("caps total payout at 2x insurance sum per policy");
    it.todo("tracks remaining cap across multiple claims on same policy");
    it.todo("insurance sum is based on unmodified item values, not premiums");
  });

  describe("Claim - rounding", () => {
    it.todo("rounds payout down in MHPCO's favor");
  });

  describe("Claim - errors", () => {
    it.todo("throws error when damage references item not in policy");
    it.todo("throws error when more damages of a type than policy covers");
    it.todo("throws error for negative damage amount");
  });

  describe("Scenario - sequential steps", () => {
    it.todo("processes quote then claim referencing that quote by step index");
    it.todo("processes multiple quotes and claims in sequence");
  });
});
