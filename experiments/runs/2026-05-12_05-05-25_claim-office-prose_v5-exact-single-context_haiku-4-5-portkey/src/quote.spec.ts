import { describe, it, expect } from "vitest";
import { quotePremium, processClaim } from "./quote.js";

describe("MHPCO Claim Office", () => {
  describe("Quote Premium", () => {
    // Simplest case: single main item
    it.todo("should calculate base premium for a sword");

    // Other main items
    it.todo("should calculate base premium for an amulet");
    it.todo("should calculate base premium for a staff");
    it.todo("should calculate base premium for a potion");

    // Component items
    it.todo("should calculate base premium for a single component");

    // Modifiers
    it.todo("should apply cursed item 50% surcharge");
    it.todo("should apply enchanted item 30% surcharge for level >= 5");
    it.todo("should apply loyalty discount 20% for customers with >= 2 years");
    it.todo("should apply initial assessment 10% surcharge for first contract");
    it.todo("should apply repeat contract 15% discount for contracts after first");

    // Components special case
    it.todo("should apply special base premium of 60G for 3 alike components");

    // Fee and rounding
    it.todo("should add 5G processing fee");
    it.todo("should round premium up in MHPCO's favor");

    // Multiple items
    it.todo("should calculate premium for multiple different items");

    // Full complexity
    it.todo("should combine all modifiers correctly in one premium");
  });

  describe("Process Claim", () => {
    // Simplest case: basic deductible
    it.todo("should apply 100G deductible to claim");

    // Cap enforcement
    it.todo("should enforce policy cap at 2x the insurance sum");

    // Special reimbursement rates
    it.todo("should reimburse damage to high enchantment items (level >= 8) at 50%");
    it.todo("should fully reimburse damage to dragon material items");

    // Multiple claims
    it.todo("should track remaining cap after multiple claims on same policy");
  });
});
