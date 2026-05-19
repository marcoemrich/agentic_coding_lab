import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("empty item list returns premium of 5G (processing fee only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it.todo("single sword returns base premium 100G plus 5G fee");
    it.todo("single amulet returns base premium 60G plus 5G fee");
    it.todo("single staff returns base premium 80G plus 5G fee");
    it.todo("single potion returns base premium 40G plus 5G fee");
    it.todo("multiple items sum their base premiums plus fee");
  });

  describe("Quote - component premiums", () => {
    it.todo("single rune has 25G base premium");
    it.todo("2 runes have 50G base premium");
    it.todo("3 alike runes get block discount at 60G base premium");
    it.todo("4 runes have 100G base premium (no block)");
    it.todo("3 runes and 3 moonstones form two separate blocks at 120G");
    it.todo("mixed runes and moonstones without block quantities get individual pricing");
  });

  describe("Quote - item-level modifiers", () => {
    it.todo("cursed item adds 50% surcharge to that item's base premium");
    it.todo("highly enchanted item (enchantment >= 5) adds 30% surcharge to that item's base premium");
    it.todo("cursed and highly enchanted item applies both surcharges");
    it.todo("item-level modifiers apply per-item, not to whole policy");
  });

  describe("Quote - policy-level modifiers", () => {
    it.todo("first insurance adds 10% surcharge on policy base premium");
    it.todo("long-standing customer (>= 2 years) gets 20% loyalty discount on policy base premium");
    it.todo("follow-up contract (second quote) gets 15% discount on policy base premium");
    it.todo("all policy-level modifiers can stack together");
  });

  describe("Quote - rounding", () => {
    it.todo("premium is rounded up to whole G in MHPCO's favor");
  });

  describe("Quote - integration", () => {
    it.todo("newcomer with cursed sword: premium 165G");
    it.todo("long-standing customer second contract with cursed enchanted sword: premium 160G");
  });

  describe("Quote - errors", () => {
    it.todo("unknown item type causes an error");
  });

  describe("Claim - basic reimbursement", () => {
    it.todo("standard item damage is fully reimbursed minus 100G deductible");
    it.todo("component damage is fully reimbursed minus 100G deductible");
  });

  describe("Claim - special clauses", () => {
    it.todo("enchantment >= 8 reimburses at 50% of damage then deductible");
    it.todo("dragon material item is fully reimbursed then deductible");
    it.todo("dragon material with enchantment >= 8 uses 50% rule then deductible");
  });

  describe("Claim - multiple damages", () => {
    it.todo("multiple damaged items each have their own deductible");
  });

  describe("Claim - cap", () => {
    it.todo("policy cap is 2x insurance sum");
    it.todo("payout is limited by remaining cap");
    it.todo("cap tracks across successive claims");
  });

  describe("Claim - rounding", () => {
    it.todo("payout is rounded down to whole G in MHPCO's favor");
  });

  describe("Claim - errors", () => {
    it.todo("damage to item not in policy causes an error");
    it.todo("more damages of a type than insured count causes an error");
    it.todo("negative damage amount causes an error");
  });
});
