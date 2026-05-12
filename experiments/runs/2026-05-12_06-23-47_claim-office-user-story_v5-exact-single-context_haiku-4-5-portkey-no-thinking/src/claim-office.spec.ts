import { describe, it, expect } from "vitest";
import { calculatePremium } from "./claim-office.js";

describe("MHPCO Claim Office - Premium Quoting", () => {
  // Base functionality: single items and premium calculation
  it.todo("should calculate premium for a single sword (base case)");
  it.todo("should calculate premium for a single amulet");
  it.todo("should calculate premium for a single staff");
  it.todo("should calculate premium for a single potion");

  // Components: individual components
  it.todo("should calculate premium for a single component (rune/moonstone)");

  // Components: special building block (3 alike components)
  it.todo("should apply special premium for 3 alike components");

  // Surcharges: cursed items
  it.todo("should add 50% surcharge for cursed main items");

  // Surcharges: enchanted items
  it.todo("should add 30% surcharge for highly enchanted items (level >= 5)");

  // Discounts: customer loyalty
  it.todo("should apply 20% loyalty discount for long-standing customers (>= 2 years)");

  // Discounts: first policy vs repeat
  it.todo("should add 10% initial assessment surcharge for first policy");
  it.todo("should add 15% repeat contract discount for policies after first");

  // Processing fee
  it.todo("should add 5 G processing fee to final premium");

  // Multiple items
  it.todo("should calculate premium for multiple different main items");

  // Rounding
  it.todo("should round final premium to whole G in MHPCO's favor (up)");

  // Combined modifiers
  it.todo("should combine cursed and enchanted surcharges");
  it.todo("should apply surcharges before loyalty discount");
  it.todo("should calculate final premium with all modifiers combined");
});
