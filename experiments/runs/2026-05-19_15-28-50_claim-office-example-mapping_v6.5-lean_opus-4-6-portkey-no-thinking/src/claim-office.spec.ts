import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it.todo("should return 5G premium for empty item list (processing fee only)");
    it.todo("should calculate base premium for a single sword (100G + 5G fee = 105G)");
    it.todo("should calculate base premium for each main item type");
    it.todo("should sum base premiums for multiple items in a policy");
  });

  describe("Quote - component pricing", () => {
    it.todo("should calculate premium for individual components at 25G each");
    it.todo("should apply block discount for exactly 3 alike components (60G instead of 75G)");
    it.todo("should not apply block discount for 4 alike components");
    it.todo("should apply separate blocks for different component types");
  });

  describe("Quote - item-specific modifiers", () => {
    it.todo("should add 50% cursed surcharge to cursed item base premium");
    it.todo("should add 30% high-enchantment surcharge for enchantment >= 5");
    it.todo("should apply both cursed and high-enchantment surcharges to same item");
    it.todo("should apply item-specific modifiers only to affected item, not whole policy");
  });

  describe("Quote - policy-wide modifiers", () => {
    it.todo("should add 10% first insurance surcharge to policy base premium");
    it.todo("should apply 20% loyalty discount for customer with >= 2 years");
    it.todo("should apply 15% follow-up contract discount on second quote");
    it.todo("should combine loyalty, first insurance, and follow-up modifiers");
  });

  describe("Quote - rounding", () => {
    it.todo("should round premium up in MHPCO's favor");
  });

  describe("Claim - basic payout", () => {
    it.todo("should apply 100G deductible per damaged item");
    it.todo("should reimburse standard damage fully minus deductible");
  });

  describe("Claim - reimbursement rules", () => {
    it.todo("should reimburse enchantment >= 8 damage at 50% then apply deductible");
    it.todo("should fully reimburse dragon material damage then apply deductible");
    it.todo("should apply 50% rule when both high-enchantment and dragon-material apply");
  });

  describe("Claim - cap tracking", () => {
    it.todo("should cap total payout at 2x insurance sum");
    it.todo("should track remaining cap across multiple claims on same policy");
  });

  describe("Claim - rounding", () => {
    it.todo("should round payout down in MHPCO's favor");
  });

  describe("Validation", () => {
    it.todo("should reject unknown item types in quote");
    it.todo("should reject claim damage for item not in policy");
    it.todo("should reject negative damage amounts");
  });
});
