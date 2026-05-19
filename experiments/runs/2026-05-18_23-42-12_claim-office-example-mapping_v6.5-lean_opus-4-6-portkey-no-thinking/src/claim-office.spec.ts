import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5G processing fee for an empty item list", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it.todo("computes base premium for a single sword (100G + 5G fee = 105G)");
    it.todo("computes base premium for a single amulet (60G + 5G fee = 65G)");
    it.todo("computes base premium for a single staff (80G + 5G fee = 85G)");
    it.todo("computes base premium for a single potion (40G + 5G fee = 45G)");
    it.todo("computes base premium for a single component (25G + 5G fee = 30G)");
  });

  describe("Quote - component blocks", () => {
    it.todo("2 runes cost 50G base premium");
    it.todo("3 alike runes cost 60G base premium (block discount)");
    it.todo("4 alike runes cost 100G base premium (no block)");
    it.todo("7 alike runes cost 175G base premium");
    it.todo("2 runes + 1 moonstone = 75G (no block, different types)");
    it.todo("3 runes + 3 moonstones = 120G (two separate blocks)");
  });

  describe("Quote - item-specific modifiers", () => {
    it.todo("cursed item adds 50% surcharge to that item's base premium");
    it.todo("high enchantment (level >= 5) adds 30% surcharge to that item's base premium");
    it.todo("enchantment level 4 does not trigger high-enchantment surcharge");
    it.todo("cursed + high enchantment both apply to the same item");
  });

  describe("Quote - modifier scope on multi-item policies", () => {
    it.todo("cursed surcharge applies only to cursed item, not whole policy (cursed sword + plain amulet = 210G + fee)");
  });

  describe("Quote - policy-wide modifiers", () => {
    it.todo("loyalty discount (>= 2 years) applies 20% discount on policy base premium");
    it.todo("customer with exactly 2 years gets loyalty discount");
    it.todo("customer with < 2 years gets no loyalty discount");
    it.todo("first insurance surcharge adds 10% to policy base premium (always applies per quote)");
    it.todo("follow-up contract discount gives 15% off on second and subsequent quotes");
  });

  describe("Quote - rounding", () => {
    it.todo("premium rounded up in MHPCO's favor (e.g. 197.5G -> 198G)");
  });

  describe("Quote - errors", () => {
    it.todo("unknown item type throws an error");
  });

  describe("Quote - integration", () => {
    it.todo("newcomer with cursed sword: 0 years, no previous contract = 165G");
    it.todo("long-standing customer second contract: cursed sword enchantment 7, 3 years, 2nd quote = 160G");
  });

  describe("Claim - basic payout", () => {
    it.todo("deducts 100G deductible per damaged item");
    it.todo("regular item damage: full reimbursement minus deductible");
    it.todo("component damage: full reimbursement minus deductible (no enchantment/material)");
  });

  describe("Claim - enchantment and material clauses", () => {
    it.todo("enchantment >= 8: reimbursed at 50% then deductible applied");
    it.todo("dragon material: fully reimbursed then deductible applied");
    it.todo("dragon material + enchantment >= 8: 50% rule wins then deductible");
    it.todo("dragon material + enchantment < 8: full reimbursement then deductible");
  });

  describe("Claim - multiple damages in one event", () => {
    it.todo("deductible applies per damaged item (sword 500G + amulet 300G = 600G payout)");
    it.todo("two items of the same type each get their own deductible");
  });

  describe("Claim - cap", () => {
    it.todo("cap is 2x insurance sum of the policy");
    it.todo("payout is limited by remaining cap");
    it.todo("cap tracks across multiple claims on the same policy");
    it.todo("component block discount affects premium only, not insurance sum for cap");
  });

  describe("Claim - rounding", () => {
    it.todo("payout rounded down in MHPCO's favor (e.g. 350.5G -> 350G)");
  });

  describe("Claim - errors", () => {
    it.todo("damage to item not in policy throws error");
    it.todo("more damages of a type than policy covers throws error");
    it.todo("negative damage amount throws error");
  });
});
