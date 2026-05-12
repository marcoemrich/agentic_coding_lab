import { describe, it, expect } from "vitest";
import { quotePremium, processClaim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Premium Calculation - Base Items
  it.todo("should calculate premium for a single sword with no modifiers");
  it.todo("should calculate premium for a single amulet");
  it.todo("should calculate premium for a single staff");
  it.todo("should calculate premium for a single potion");

  // Premium Calculation - Components
  it.todo("should calculate premium for a single component");
  it.todo("should calculate premium for three alike components at special rate");

  // Premium Calculation - Multiple Items
  it.todo("should calculate total premium for multiple different items");
  it.todo("should sum multiple items with components");

  // Premium Calculation - Modifiers (Surcharges)
  it.todo("should add 50% surcharge for cursed items");
  it.todo("should add 30% surcharge for highly enchanted items (enchantment >= 5)");
  it.todo("should apply multiple surcharges to single item");

  // Premium Calculation - Discounts
  it.todo("should apply 20% loyalty discount for long-standing customers (>= 2 years)");
  it.todo("should apply 15% repeat customer discount (not first policy)");
  it.todo("should not apply loyalty discount for new customers");

  // Premium Calculation - Fees and Surcharges
  it.todo("should add 10% initial assessment surcharge on first policy");
  it.todo("should add 5 G processing fee to every premium");

  // Premium Calculation - Rounding
  it.todo("should round premium down in MHPCO's favor");

  // Claims Processing - Basic
  it.todo("should calculate claim payout with 100 G deductible applied");
  it.todo("should cap total payout at 2x insurance sum per policy");
  it.todo("should reduce payout to 50% for high enchantment damage (enchantment >= 8)");
  it.todo("should fully reimburse dragon material damage");

  // Claims Processing - Multiple Damages
  it.todo("should process claim with multiple damage items");

  // Claims Processing - Tracking
  it.todo("should track remaining cap after claim payout");
  it.todo("should prevent payout exceeding remaining cap");

  // Integration - JSON Processing
  it.todo("should process JSON input with single quote step");
  it.todo("should process JSON input with quote and claim steps");
  it.todo("should return results array matching input steps order");
});
