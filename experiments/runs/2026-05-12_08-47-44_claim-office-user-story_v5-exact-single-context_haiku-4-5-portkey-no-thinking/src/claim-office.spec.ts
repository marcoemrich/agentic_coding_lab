import { describe, it, expect } from "vitest";
import { processClaim, quotePremium } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Premium Quoting", () => {
    it.todo("should calculate base premium for a single sword");
    it.todo("should calculate base premium for a single component");
    it.todo("should apply special premium for 3 alike components");
    it.todo("should apply 50% surcharge for cursed items");
    it.todo("should apply 30% surcharge for highly enchanted items (level >= 5)");
    it.todo("should apply 10% initial assessment surcharge for new customers (0 years)");
    it.todo("should apply 15% discount on contracts after the first");
    it.todo("should apply 20% loyalty discount for long-standing customers (>= 2 years)");
    it.todo("should add 5G processing fee to every premium");
    it.todo("should round all amounts to whole G in MHPCO's favor (round up)");
    it.todo("should calculate premium for multiple mixed items in one quote");
  });

  describe("Claims Processing", () => {
    it.todo("should calculate payout for a single damage claim");
    it.todo("should apply 100G deductible per damage event");
    it.todo("should reimburse 50% for damage to highly enchanted items (level >= 8)");
    it.todo("should fully reimburse damage to dragon material items");
    it.todo("should cap total payout at twice the insurance sum");
    it.todo("should track remaining cap across multiple claims on the same policy");
    it.todo("should return zero payout when deductible exceeds damage amount");
  });
});
