import { describe, it, expect } from "vitest";
import { quotePremium, processClaim, Policy } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Premium Quoting", () => {
    it.todo("should quote single sword with no modifiers");
    it.todo("should quote single component (rune or moonstone)");
    it.todo("should quote three components with bulk pricing discount");
    it.todo("should quote multiple different items");
    it.todo("should apply cursed item surcharge (50%)");
    it.todo("should apply enchantment surcharge for level >= 5 (30%)");
    it.todo("should apply first insurance surcharge (10%) for new customer");
    it.todo("should apply loyalty discount (20%) for customer >= 2 years");
    it.todo("should apply repeat contract discount (15%) for non-first contract");
  });

  describe("Claims Processing", () => {
    it.todo("should process simple claim with deductible (100G)");
    it.todo("should track remaining cap after multiple claims");
    it.todo("should reimburse 50% for high enchantment damage (level >= 8)");
    it.todo("should fully reimburse dragon material damage");
  });
});
