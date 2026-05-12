import { describe, it, expect } from "vitest";
import { calculatePremium, processClaim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Premium Calculation", () => {
    it.todo("should calculate premium for a single sword");
    it.todo("should calculate premium for a single amulet");
    it.todo("should calculate premium for a single staff");
    it.todo("should calculate premium for a single potion");
    it.todo("should calculate premium for a single component");
    it.todo("should calculate premium for multiple different main items");
    it.todo("should apply cursed item surcharge (50%)");
    it.todo("should apply enchanted item surcharge (30%) for enchantment level >= 5");
    it.todo("should apply loyalty discount (20%) for customers with >= 2 years");
    it.todo("should apply initial assessment surcharge (10%) for first policy");
    it.todo("should apply repeat contract discount (15%) for policies after first");
    it.todo("should add 5 G processing fee to every premium");
    it.todo("should calculate premium for a bundle of 3 identical components");
    it.todo("should round amounts to whole G in MHPCO's favor (always round up)");
  });

  describe("Claim Processing", () => {
    it.todo("should calculate payout with deductible (100 G) applied per damage event");
    it.todo("should enforce policy cap at twice the insurance sum");
    it.todo("should apply 50% reduction for damage on high enchantment items (level >= 8)");
    it.todo("should fully reimburse damage to dragon material items");
    it.todo("should track remaining cap after first claim");
    it.todo("should apply deductible only once per damage event (not per item)");
    it.todo("should process multiple claims against the same policy sequentially");
    it.todo("should reduce remaining cap after each claim");
  });

  describe("CLI Integration", () => {
    it.todo("should read JSON from stdin describing a quote operation");
    it.todo("should read JSON from stdin describing a claim operation");
    it.todo("should process multiple sequential operations");
    it.todo("should output JSON with results array matching input steps");
    it.todo("should include premium in quote result");
    it.todo("should include payout and remainingCap in claim result");
  });
});
