import { describe, it, expect } from "vitest";
import { quote } from "./claim-office.js";

describe("Claim Office", () => {
  describe("quote - base premiums", () => {
    it("returns 5G premium for an empty item list (processing fee only)", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [], false);
      expect(result).toBe(5);
    });
    it.todo("returns 105G premium for a single sword (100G base + 5G fee)");
    it.todo("returns 65G premium for a single amulet (60G base + 5G fee)");
    it.todo("returns 85G premium for a single staff (80G base + 5G fee)");
    it.todo("returns 45G premium for a single potion (40G base + 5G fee)");
    it.todo("returns 165G premium for a sword and an amulet (100 + 60 + 5 fee)");
  });

  describe("quote - component premiums", () => {
    it.todo("returns 30G premium for a single rune (25G base + 5G fee)");
    it.todo("returns 55G premium for 2 runes (2x25 = 50G + 5G fee)");
    it.todo("returns 65G premium for 3 alike runes (block discount: 60G + 5G fee)");
    it.todo("returns 105G premium for 4 runes (no block: 4x25 = 100G + 5G fee)");
    it.todo("returns 180G premium for 7 runes (7x25 = 175G + 5G fee)");
    it.todo("returns 80G premium for 2 runes and 1 moonstone (no block: 3x25 = 75G + 5G fee)");
    it.todo("returns 125G premium for 3 runes and 3 moonstones (two blocks: 60 + 60 = 120G + 5G fee)");
  });

  describe("quote - item-specific modifiers", () => {
    it.todo("adds 50% cursed surcharge to the cursed item base premium only");
    it.todo("adds 30% high-enchantment surcharge for enchantment level 5");
    it.todo("does not add high-enchantment surcharge for enchantment level 4");
    it.todo("applies both cursed and high-enchantment surcharges to the same item");
    it.todo("applies cursed surcharge only to the cursed item in a multi-item policy");
  });

  describe("quote - policy-wide modifiers", () => {
    it.todo("adds 10% first insurance surcharge to every quote");
    it.todo("applies 20% loyalty discount for customer with 2+ years");
    it.todo("does not apply loyalty discount for customer with less than 2 years");
    it.todo("applies 15% follow-up contract discount on second and subsequent quotes");
  });

  describe("quote - rounding", () => {
    it.todo("rounds premium up (in MHPCO favor) when result has fractional G");
  });

  describe("quote - integration", () => {
    it.todo("newcomer with cursed sword: 165G (100 + 50 curse + 10 first + 5 fee)");
    it.todo("long-standing customer second contract cursed sword ench 7: 160G");
  });

  describe("quote - errors", () => {
    it.todo("throws error for unknown item type");
  });

  describe("claim - standard reimbursement", () => {
    it.todo("reimburses damage minus 100G deductible for a regular item");
    it.todo("reimburses damage to a rune minus 100G deductible");
  });

  describe("claim - enchantment and material clauses", () => {
    it.todo("reimburses at 50% for items with enchantment level >= 8");
    it.todo("fully reimburses dragon material items then subtracts deductible");
    it.todo("applies 50% rule when both dragon material and enchantment >= 8");
    it.todo("fully reimburses dragon material with enchantment < 8 then subtracts deductible");
  });

  describe("claim - deductible per item", () => {
    it.todo("applies deductible separately to each damaged item in one event");
  });

  describe("claim - payout cap", () => {
    it.todo("caps total payout at 2x insurance sum");
    it.todo("tracks remaining cap across multiple claims on the same policy");
  });

  describe("claim - errors", () => {
    it.todo("rejects claim when damaged item is not in the policy");
    it.todo("rejects claim when more damage entries than insured items of that type");
    it.todo("rejects claim with negative damage amount");
  });

  describe("claim - rounding", () => {
    it.todo("rounds payout down (in MHPCO favor) when result has fractional G");
  });

  describe("CLI", () => {
    it.todo("reads JSON scenario from stdin and writes results to stdout");
    it.todo("processes sequential steps with claim referencing earlier quote by index");
    it.todo("exits with non-zero status and writes to stderr on error");
  });
});
