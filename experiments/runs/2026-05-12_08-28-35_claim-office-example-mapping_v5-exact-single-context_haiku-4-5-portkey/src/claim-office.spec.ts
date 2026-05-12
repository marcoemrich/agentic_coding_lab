import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote Operation", () => {
    it.todo("should return 5 G (processing fee only) for empty items list");
    it.todo("should calculate base premium for a single sword");
    it.todo("should calculate base premium for a single amulet");
    it.todo("should calculate base premium for a single staff");
    it.todo("should calculate base premium for a single potion");
    it.todo("should calculate base premium for a single component (rune or moonstone)");
    it.todo("should sum base premiums for multiple different items");
    it.todo("should apply cursed surcharge (50% of item base premium) to cursed items only");
    it.todo("should apply high-enchantment surcharge (30%) for items with enchantment >= 5");
    it.todo("should apply first-insurance surcharge (10%) for new customer");
    it.todo("should apply loyalty discount (20%) for customer with >= 2 years");
    it.todo("should apply follow-up contract discount (15%) for second+ contract");
    it.todo("should apply special block discount for exactly 3 alike components");
    it.todo("should include 5 G processing fee in final premium");
    it.todo("should round final premium up in MHPCO's favor");
    it.todo("should stack item-specific and policy-wide modifiers correctly");
  });

  describe("Claim Operation", () => {
    it.todo("should calculate payout with 100 G deductible per damage event");
    it.todo("should apply 50% reimbursement for damage to items with enchantment >= 8");
    it.todo("should apply 100% reimbursement for damage to dragon-material items");
    it.todo("should cap total claim payout at 2x policy insurance sum");
    it.todo("should reject claim if damage amount exceeds policy coverage");
    it.todo("should reject claim with invalid item type");
    it.todo("should reject claim with negative damage amount");
    it.todo("should round payout down in MHPCO's favor");
  });
});
