import { describe, it, expect } from "vitest";
import { quotePolicy, processClaim, Policy } from "./claim-office.js";

describe("MHPCO Claims Office - Quote", () => {
  it.todo("should calculate premium for single sword with no modifiers");
  it.todo("should calculate premium for single amulet");
  it.todo("should calculate premium for single staff");
  it.todo("should calculate premium for single potion");
  it.todo("should apply 50% surcharge for cursed items");
  it.todo("should apply 30% surcharge for highly enchanted items (enchantment >= 5)");
  it.todo("should apply both cursed and enchantment surcharges together");
  it.todo("should apply 20% loyalty discount for customers with 2+ years");
  it.todo("should apply 10% surcharge for first-time contracts");
  it.todo("should apply 15% discount for repeat contracts (after first)");
  it.todo("should add 5 G processing fee to all premiums");
  it.todo("should round amounts to whole G in MHPCO's favor (upward)");
  it.todo("should calculate premium for multiple different items together");
  it.todo("should calculate premium for 3 alike components at special base rate");
  it.todo("should calculate premium for components mixed with main items");
});

describe("MHPCO Claims Office - Claim", () => {
  it.todo("should apply 100 G deductible per damage event");
  it.todo("should cap total payout at twice the insurance sum");
  it.todo("should process basic claim on non-enchanted, non-dragon item");
  it.todo("should reimburse 50% for high enchantment items (enchantment >= 8)");
  it.todo("should fully reimburse damage to dragon material items");
  it.todo("should track remaining cap after first claim");
  it.todo("should track remaining cap after multiple claims on same policy");
  it.todo("should not exceed cap across multiple claims");
});
