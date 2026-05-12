import { describe, it, expect } from "vitest";
import { quotePremium, processClaim } from "./mhpco.js";

describe("MHPCO Claim Office", () => {
  describe("Premium Quoting", () => {
    // Simplest cases - single items with base pricing
    it.todo("should calculate premium for a single sword with no modifiers");
    it.todo("should calculate premium for a single amulet with no modifiers");
    it.todo("should calculate premium for a single staff with no modifiers");
    it.todo("should calculate premium for a single potion with no modifiers");
    it.todo("should calculate premium for a single component with no modifiers");

    // Special pricing rule
    it.todo("should apply special base premium of 60G for 3 alike components");

    // Surcharge modifiers
    it.todo("should apply 50% surcharge for a cursed item");
    it.todo("should apply 30% surcharge for highly enchanted item (enchantment >= 5)");
    it.todo("should apply both cursed and enchantment surcharges when both conditions met");

    // Customer discount modifiers
    it.todo("should apply 10% initial assessment surcharge for new customer (0 years)");
    it.todo("should apply 20% loyalty discount for long-standing customer (>= 2 years)");
    it.todo("should apply 15% discount on contract after first insurance");

    // Processing fee
    it.todo("should add 5G processing fee to every premium");

    // Multiple items
    it.todo("should calculate premium for multiple different items");
    it.todo("should sum premiums for multiple items with various modifiers");

    // Rounding
    it.todo("should round premiums to whole G in customer's disfavor (MHPCO's favor)");
  });

  describe("Claim Processing", () => {
    // Simplest claim cases
    it.todo("should process simple claim with 100G deductible applied");
    it.todo("should pay zero if damage is less than deductible");
    it.todo("should process claim for high enchantment item (>= 8) at 50% reimbursement");
    it.todo("should process claim for dragon material item at 100% reimbursement");

    // Claim cap
    it.todo("should cap total payout at 2x the insurance sum");
    it.todo("should track remaining cap after each claim");
    it.todo("should reduce remaining cap as claims are processed");

    // Multiple claims on same policy
    it.todo("should process multiple claims on same policy sequentially");
    it.todo("should apply deductible to each damage event");
  });

  describe("CLI Integration", () => {
    it.todo("should read JSON scenario from stdin and parse customer and steps");
    it.todo("should output results array with premium for quote operations");
    it.todo("should output results array with payout and remainingCap for claim operations");
    it.todo("should process sequence of quotes and claims in order");
  });
});
