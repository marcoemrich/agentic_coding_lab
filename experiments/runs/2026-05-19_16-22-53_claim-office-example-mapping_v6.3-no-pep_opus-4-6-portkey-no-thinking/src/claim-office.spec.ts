import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it.todo("should return 5 G for an empty item list (processing fee only)");
    it.todo("should compute base premium for a single sword (100 G base + 10% first insurance + 5 G fee = 115 G)");
    it.todo("should compute base premium for a single amulet (60 G base + 6 G first insurance + 5 G fee = 71 G)");
  });

  describe("Quote - item-level modifiers", () => {
    it.todo("should add 50% cursed surcharge to the cursed item's base premium");
    it.todo("should add 30% high enchantment surcharge for enchantment level >= 5");
  });

  describe("Quote - multi-item policies", () => {
    it.todo("should sum base premiums for multiple items in a policy");
  });

  describe("Quote - components", () => {
    it.todo("should compute base premium for individual components (25 G each)");
    it.todo("should apply block discount for exactly 3 alike components (60 G instead of 75 G)");
  });

  describe("Quote - policy-level modifiers", () => {
    it.todo("should apply 20% loyalty discount for customers with >= 2 years");
    it.todo("should apply 15% follow-up contract discount on second quote");
  });

  describe("Quote - integration", () => {
    it.todo("should compute 165 G for newcomer with cursed sword");
    it.todo("should compute 160 G for long-standing customer's second contract with cursed enchanted sword");
  });

  describe("Claim - basic processing", () => {
    it.todo("should apply 100 G deductible per damaged item for standard reimbursement");
    it.todo("should reimburse at 50% for items with enchantment >= 8");
    it.todo("should fully reimburse dragon material items minus deductible");
    it.todo("should cap total payout at twice the insurance sum");
  });

  describe("Validation", () => {
    it.todo("should reject quote with unknown item type");
    it.todo("should reject claim for item not covered by policy");
    it.todo("should reject claim with negative damage amount");
  });
});
