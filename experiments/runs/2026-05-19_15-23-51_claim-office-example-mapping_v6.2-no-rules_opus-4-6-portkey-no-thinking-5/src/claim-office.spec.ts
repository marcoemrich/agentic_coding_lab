import { describe, it, expect } from "vitest";
import { quote } from "./claim-office.js";

describe("Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5G processing fee for an empty item list", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [], false);
      expect(result).toBe(5);
    });
    it.todo("returns base premium plus fee for a single sword (105G)");
    it.todo("returns correct base premium for each main item type (amulet, staff, potion)");
    it.todo("returns 25G base premium per component (rune or moonstone)");
    it.todo("applies block discount of 60G for exactly 3 alike components");
    it.todo("does not apply block discount for non-alike components (2 runes + 1 moonstone = 75G)");
    it.todo("applies two separate blocks for 3 runes + 3 moonstones (120G)");
    it.todo("does not apply block for 4 alike components (4 runes = 100G)");
  });

  describe("Quote - item-specific modifiers", () => {
    it.todo("adds 50% cursed surcharge to the cursed item's base premium only");
    it.todo("adds 30% high enchantment surcharge for enchantment level >= 5");
    it.todo("applies both cursed and high enchantment surcharges to the same item");
    it.todo("does not apply high enchantment surcharge for enchantment level 4");
    it.todo("applies item-specific modifiers only to the affected item in a multi-item policy");
  });

  describe("Quote - policy-wide modifiers", () => {
    it.todo("applies 20% loyalty discount for customers with >= 2 years");
    it.todo("applies 10% first insurance surcharge on policy base premium");
    it.todo("applies 15% follow-up contract discount on second and subsequent quotes");
    it.todo("rounds premium up in MHPCO's favor");
  });

  describe("Quote - integration", () => {
    it.todo("newcomer with cursed sword: 165G");
    it.todo("long-standing customer second contract with cursed high-enchantment sword: 160G");
  });

  describe("Claim - standard reimbursement", () => {
    it.todo("reimburses damage minus 100G deductible for a standard item");
    it.todo("applies deductible per damaged item in a multi-damage event");
    it.todo("reimburses component damage with standard rules (no enchantment/material)");
  });

  describe("Claim - special clauses", () => {
    it.todo("reimburses at 50% then deductible for enchantment >= 8");
    it.todo("reimburses fully then deductible for dragon material items");
    it.todo("applies 50% rule when both enchantment >= 8 and dragon material");
  });

  describe("Claim - cap", () => {
    it.todo("caps total payout at 2x insurance sum");
    it.todo("tracks remaining cap across multiple claims");
    it.todo("insurance sum is based on unmodified item values, not premiums");
  });

  describe("Claim - validation", () => {
    it.todo("rejects claim with more damage entries than insured items of that type");
    it.todo("rejects claim referencing an item type not in the policy");
    it.todo("rejects claim with negative damage amount");
  });

  describe("Quote - validation", () => {
    it.todo("rejects unknown item type with error");
  });

  describe("CLI", () => {
    it.todo("reads JSON scenario from stdin and writes results to stdout");
    it.todo("processes sequential steps where claims reference earlier quotes");
  });
});
