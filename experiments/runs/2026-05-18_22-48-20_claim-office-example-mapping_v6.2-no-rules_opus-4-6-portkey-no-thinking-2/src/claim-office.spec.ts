import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - Base Premiums", () => {
    it("returns 5 G for an empty item list (processing fee only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [] }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(5);
    });
    it.todo("returns 105 G for a single plain sword (100 base + 5 fee)");
    it.todo("returns 65 G for a single plain amulet (60 base + 5 fee)");
    it.todo("returns 85 G for a single plain staff (80 base + 5 fee)");
    it.todo("returns 45 G for a single plain potion (40 base + 5 fee)");
    it.todo("returns 30 G for a single rune component (25 base + 5 fee)");
  });

  describe("Quote - Component Block Pricing", () => {
    it.todo("returns 55 G for 2 runes (50 base + 5 fee)");
    it.todo("returns 65 G for 3 runes (60 block base + 5 fee)");
    it.todo("returns 105 G for 4 runes (4x25 = 100 base + 5 fee, no block)");
    it.todo("returns 125 G for 3 runes + 3 moonstones (two blocks: 60+60 + 5 fee)");
    it.todo("returns 80 G for 2 runes + 1 moonstone (no block: 3x25 = 75 + 5 fee)");
  });

  describe("Quote - Item-Specific Modifiers", () => {
    it.todo("adds 50% cursed surcharge to a cursed sword (100+50=150 + 10 first + 5 fee = 165 G)");
    it.todo("adds 30% high-enchantment surcharge for enchantment level 5");
    it.todo("applies both cursed and high-enchantment surcharges when both apply");
    it.todo("does not apply high-enchantment surcharge for enchantment level 4");
  });

  describe("Quote - Policy-Wide Modifiers", () => {
    it.todo("adds 10% first insurance surcharge for every quote");
    it.todo("applies 20% loyalty discount for customer with 2+ years");
    it.todo("applies 15% follow-up discount on second and subsequent quotes");
  });

  describe("Quote - Multi-Item Policies", () => {
    it.todo("sums base premiums for multiple items before applying policy modifiers");
    it.todo("applies cursed surcharge only to the cursed item, not the whole policy");
  });

  describe("Quote - Rounding", () => {
    it.todo("rounds premium up in MHPCO's favor (ceiling)");
  });

  describe("Quote - Integration", () => {
    it.todo("newcomer with cursed sword: 165 G");
    it.todo("long-standing customer second contract with cursed high-enchantment sword: 160 G");
  });

  describe("Claim - Basic Reimbursement", () => {
    it.todo("reimburses damage minus 100 G deductible for a regular item");
    it.todo("reimburses component damage minus deductible (no special clauses)");
  });

  describe("Claim - Special Clauses", () => {
    it.todo("reimburses at 50% for items with enchantment >= 8, then deductible");
    it.todo("fully reimburses dragon material items, then deductible");
    it.todo("applies 50% rule when both dragon material and enchantment >= 8");
  });

  describe("Claim - Cap and Multiple Damages", () => {
    it.todo("caps total payout at 2x insurance sum");
    it.todo("applies deductible per damaged item in a single event");
    it.todo("tracks remaining cap across successive claims");
  });

  describe("Claim - Payout Rounding", () => {
    it.todo("rounds payout down in MHPCO's favor (floor)");
  });

  describe("Error Handling", () => {
    it.todo("rejects unknown item type in quote");
    it.todo("rejects claim for item not in policy");
    it.todo("rejects claim with more damage entries than insured items of that type");
    it.todo("rejects claim with negative damage amount");
  });
});
