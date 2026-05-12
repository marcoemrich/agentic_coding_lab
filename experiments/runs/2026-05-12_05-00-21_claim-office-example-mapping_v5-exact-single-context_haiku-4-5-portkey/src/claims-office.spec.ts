import { describe, it, expect } from "vitest";
import { quote, claim } from "./claims-office.js";

describe("MHPCO Claims Office", () => {
  // Quote: Base functionality
  it.todo("should return 5G for empty item list (processing fee only)");
  it.todo("should calculate premium for a single sword");
  it.todo("should calculate premium for a single amulet");
  it.todo("should calculate premium for a single staff");
  it.todo("should calculate premium for a single potion");
  it.todo("should calculate premium for components (runes/moonstones)");
  it.todo("should apply 3-component block discount to components");
  it.todo("should calculate premium for multiple different items");
  it.todo("should apply cursed surcharge to item premium");
  it.todo("should apply high enchantment surcharge (≥5) to item premium");
  it.todo("should apply both cursed and high enchantment surcharges together");
  it.todo("should apply loyalty discount for customer (≥2 years)");
  it.todo("should apply first insurance surcharge to new customer");
  it.todo("should apply follow-up contract discount to subsequent contracts");
  it.todo("should combine all modifiers correctly in final premium");
  it.todo("should include processing fee in final premium");
  it.todo("should round premium up in MHPCO's favor");

  // Claim: Base functionality
  it.todo("should calculate payout with deductible applied");
  it.todo("should cap payout at twice the insurance sum");
  it.todo("should apply high enchantment clause (50% reimbursement at ≥8)");
  it.todo("should apply dragon material clause (full reimbursement)");
  it.todo("should reduce payout by deductible for multiple damages");
  it.todo("should track remaining cap across multiple damage items");
  it.todo("should round payout down in MHPCO's favor");
});
