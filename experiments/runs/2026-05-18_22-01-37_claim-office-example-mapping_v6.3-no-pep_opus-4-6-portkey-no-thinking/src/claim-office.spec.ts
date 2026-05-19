import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Office", () => {
  describe("quote - base premiums", () => {
    it("returns 5 G premium for an empty item list (processing fee only)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it.todo("returns base premium plus fee for a single sword");
    it.todo("returns base premium plus fee for a single amulet");
    it.todo("returns base premium plus fee for a single staff");
    it.todo("returns base premium plus fee for a single potion");
    it.todo("returns base premium plus fee for a single component (rune)");
    it.todo("sums base premiums for multiple different items");
  });

  describe("quote - component block pricing", () => {
    it.todo("charges 60 G for exactly 3 alike components (rune block)");
    it.todo("charges individual pricing for 2 alike components (no block)");
    it.todo("charges individual pricing for 4 alike components (no block)");
    it.todo("does not apply block across different component types");
    it.todo("applies two separate blocks for 3 runes and 3 moonstones");
  });

  describe("quote - cursed surcharge", () => {
    it.todo("adds 50% surcharge to a cursed item's base premium");
    it.todo("applies cursed surcharge only to the cursed item in a multi-item policy");
  });

  describe("quote - high enchantment surcharge", () => {
    it.todo("adds 30% surcharge for enchantment level 5");
    it.todo("adds 30% surcharge for enchantment level above 5");
    it.todo("does not add surcharge for enchantment level 4");
  });

  describe("quote - combined item surcharges", () => {
    it.todo("applies both cursed and high enchantment surcharges to the same item");
  });

  describe("quote - loyalty discount", () => {
    it.todo("applies 20% loyalty discount for customer with 2 years");
    it.todo("applies 20% loyalty discount for customer with more than 2 years");
    it.todo("does not apply loyalty discount for customer with less than 2 years");
  });

  describe("quote - first insurance surcharge", () => {
    it.todo("adds 10% first insurance surcharge on every quote");
  });

  describe("quote - follow-up contract discount", () => {
    it.todo("applies 15% follow-up discount on second and subsequent quotes");
    it.todo("does not apply follow-up discount on the first quote");
  });

  describe("quote - rounding", () => {
    it.todo("rounds premium up to whole G (in MHPCO's favor)");
  });

  describe("quote - integration", () => {
    it.todo("newcomer with cursed sword: premium is 165 G");
    it.todo("long-standing customer second contract with cursed high-enchantment sword: premium is 160 G");
  });

  describe("claim - basic payout", () => {
    it.todo("reimburses damage minus 100 G deductible for a regular item");
    it.todo("reimburses damage to a component minus deductible");
  });

  describe("claim - high enchantment reimbursement", () => {
    it.todo("reimburses at 50% for enchantment level 8 or above, then deductible");
  });

  describe("claim - dragon material reimbursement", () => {
    it.todo("fully reimburses dragon material items, then deductible");
  });

  describe("claim - both enchantment and dragon clauses", () => {
    it.todo("applies 50% rule when both dragon material and high enchantment apply");
    it.todo("applies only dragon clause when enchantment is below 8");
  });

  describe("claim - deductible per item", () => {
    it.todo("applies deductible separately to each damaged item in an event");
  });

  describe("claim - cap", () => {
    it.todo("caps total payout at twice the insurance sum");
    it.todo("tracks remaining cap across multiple claims on same policy");
  });

  describe("claim - payout rounding", () => {
    it.todo("rounds payout down to whole G (in MHPCO's favor)");
  });

  describe("error handling", () => {
    it.todo("rejects unknown item type in quote");
    it.todo("rejects claim for item not in policy");
    it.todo("rejects claim with more damages of a type than policy covers");
    it.todo("rejects negative damage amount");
  });
});
