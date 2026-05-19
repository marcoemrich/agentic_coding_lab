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
    it.todo("computes base premium for a single sword (100G + 5G fee)");
    it.todo("computes base premium for a single amulet (60G + 5G fee)");
    it.todo("computes base premium for a single staff (80G + 5G fee)");
    it.todo("computes base premium for a single potion (40G + 5G fee)");
    it.todo("computes base premium for a single component (25G + 5G fee)");
  });

  describe("Quote - component blocks", () => {
    it.todo("2 runes → 50G base premium (no block)");
    it.todo("3 alike runes → 60G base premium (block discount)");
    it.todo("4 runes → 100G base premium (no block for non-exact-3)");
    it.todo("7 runes → 175G base premium");
    it.todo("2 runes + 1 moonstone → 75G (different types, no block)");
    it.todo("3 runes + 3 moonstones → 120G (two separate blocks)");
  });

  describe("Quote - item-specific modifiers", () => {
    it.todo("cursed item adds 50% surcharge to that item's base premium");
    it.todo("high enchantment (≥5) adds 30% surcharge to that item's base premium");
    it.todo("cursed and highly enchanted item gets both surcharges on its base premium");
    it.todo("item-specific modifiers apply per item in a multi-item policy");
  });

  describe("Quote - policy-wide modifiers", () => {
    it.todo("first insurance adds 10% surcharge on policy base premium total");
    it.todo("long-standing customer (≥2 years) gets 20% loyalty discount");
    it.todo("follow-up contract (second quote) gets 15% discount");
  });

  describe("Quote - integration", () => {
    it.todo("newcomer with cursed sword: 100+50+10+5 = 165G");
    it.todo("long-standing customer second contract with cursed high-enchantment sword: 160G");
    it.todo("rounds premium up in MHPCO's favor");
  });

  describe("Quote - errors", () => {
    it.todo("rejects unknown item type");
  });

  describe("Claim - standard reimbursement", () => {
    it.todo("standard damage payout: full amount minus 100G deductible");
    it.todo("deductible applies per damaged item");
    it.todo("component damage uses standard reimbursement");
  });

  describe("Claim - special clauses", () => {
    it.todo("enchantment ≥8: reimbursed at 50% then deductible");
    it.todo("dragon material: fully reimbursed then deductible");
    it.todo("dragon material with enchantment ≥8: 50% wins then deductible");
    it.todo("dragon material with enchantment <8: full reimbursement then deductible");
  });

  describe("Claim - cap", () => {
    it.todo("cap is 2× insurance sum");
    it.todo("payout is limited to remaining cap");
    it.todo("cap exhaustion across multiple claims");
  });

  describe("Claim - errors", () => {
    it.todo("rejects damage to item not in policy");
    it.todo("rejects more damage entries than insured items of that type");
    it.todo("rejects negative damage amount");
  });
});
