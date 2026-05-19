import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it.todo("should return 5 G for an empty item list (processing fee only)");
    it.todo("should return 115 G for a single sword (100 base + 10 first insurance + 5 fee)");
    it.todo("should return 71 G for a single amulet (60 base + 6 first insurance + 5 fee)");
    it.todo("should return 33 G for a single rune component (25 base + 2.5 first insurance + 5 fee, rounded up to 33)");
  });

  describe("Quote - item-level modifiers", () => {
    it.todo("should add 50% cursed surcharge to cursed item base premium");
    it.todo("should add 30% high-enchantment surcharge for enchantment level >= 5");
    it.todo("should apply both cursed and high-enchantment surcharges to same item");
  });

  describe("Quote - component blocks", () => {
    it.todo("should charge 60 G base premium for a block of 3 alike components");
    it.todo("should charge 100 G base premium for 4 alike components (no block discount)");
    it.todo("should charge 75 G for 2 runes + 1 moonstone (no block, different types)");
  });

  describe("Quote - policy-level modifiers", () => {
    it.todo("should apply 20% loyalty discount for customer with >= 2 years");
    it.todo("should apply 15% follow-up discount on second quote step");
  });

  describe("Quote - integration", () => {
    it.todo("should compute 165 G for newcomer with cursed sword");
    it.todo("should compute 160 G for long-standing customer second contract with cursed enchanted sword");
  });

  describe("Claim - basic", () => {
    it.todo("should apply 100 G deductible per damaged item");
    it.todo("should reimburse at 50% for items with enchantment >= 8");
    it.todo("should fully reimburse dragon-material items then apply deductible");
    it.todo("should apply 50% rule when both enchantment >= 8 and dragon material");
  });

  describe("Claim - cap", () => {
    it.todo("should cap total payout at twice the insurance sum");
    it.todo("should track remaining cap across multiple claims on same policy");
  });

  describe("Errors", () => {
    it.todo("should throw for unknown item type in quote");
    it.todo("should throw for damage to item not covered by policy");
  });
});
