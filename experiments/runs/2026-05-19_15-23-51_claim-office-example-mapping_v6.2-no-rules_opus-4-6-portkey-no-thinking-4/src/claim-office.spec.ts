import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns premium of 5 G for an empty item list (processing fee only)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it.todo("returns base premium plus fee for a single sword (100 + 5 = 105 G)");
    it.todo("returns base premium plus fee for a single amulet (60 + 5 = 65 G)");
    it.todo("returns base premium plus fee for a single staff (80 + 5 = 85 G)");
    it.todo("returns base premium plus fee for a single potion (40 + 5 = 45 G)");
    it.todo("returns base premium plus fee for a single component (25 + 5 = 30 G)");
    it.todo("sums base premiums for multiple items (sword + amulet = 160 + 5 = 165 G)");
  });

  describe("Quote - component blocks", () => {
    it.todo("charges 50 G for 2 runes (no block)");
    it.todo("charges 60 G for exactly 3 alike components (block applies)");
    it.todo("charges 100 G for 4 runes (no block)");
    it.todo("charges 75 G for 2 runes + 1 moonstone (different types, no block)");
    it.todo("charges 120 G for 3 runes + 3 moonstones (two separate blocks)");
  });

  describe("Quote - item-specific modifiers", () => {
    it.todo("adds 50% cursed surcharge to the cursed item base premium");
    it.todo("adds 30% high-enchantment surcharge for enchantment >= 5");
    it.todo("applies both cursed and high-enchantment surcharges to the same item");
    it.todo("applies cursed surcharge only to the cursed item in a multi-item policy");
  });

  describe("Quote - policy-wide modifiers", () => {
    it.todo("applies 20% loyalty discount for customers with >= 2 years");
    it.todo("applies 10% first insurance surcharge (always applies per quote)");
    it.todo("applies 15% follow-up contract discount on second quote");
    it.todo("newcomer with cursed sword: 100 + 50 curse + 10 first = 160 + 5 = 165 G");
    it.todo("long-standing customer second contract: cursed sword ench 7 = 160 G");
  });

  describe("Quote - rounding", () => {
    it.todo("rounds premium up in MHPCO favor (e.g. 197.5 -> 198 G)");
  });

  describe("Claim - basic payout", () => {
    it.todo("reimburses damage minus 100 G deductible for a standard item");
    it.todo("reimburses damage to a component minus deductible");
  });

  describe("Claim - special reimbursement rules", () => {
    it.todo("reimburses at 50% for items with enchantment >= 8, then deductible");
    it.todo("fully reimburses dragon-material items, then deductible");
    it.todo("applies 50% rule when both dragon material and enchantment >= 8");
  });

  describe("Claim - cap", () => {
    it.todo("caps total payout at 2x insurance sum");
    it.todo("tracks remaining cap across multiple claims on same policy");
  });

  describe("Claim - multiple damages in one event", () => {
    it.todo("applies deductible per damaged item in the same event");
  });

  describe("Claim - payout rounding", () => {
    it.todo("rounds payout down in MHPCO favor");
  });

  describe("Error handling", () => {
    it.todo("rejects unknown item type in quote");
    it.todo("rejects claim for item not covered by policy");
    it.todo("rejects negative damage amount");
    it.todo("rejects more damage entries than insured items of that type");
  });

  describe("CLI integration", () => {
    it.todo("processes a full scenario with quote and claim via CLI");
  });
});
