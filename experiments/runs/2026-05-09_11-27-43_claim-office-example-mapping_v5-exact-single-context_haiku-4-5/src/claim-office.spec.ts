import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Base Quote Functionality - Simple Cases
  it.todo("should calculate empty quote as processing fee only");
  it.todo("should calculate premium for single sword");
  it.todo("should calculate premium for single amulet");
  it.todo("should calculate premium for single component (rune)");
  it.todo("should calculate premium for three alike components (block)");

  // Base Quote Functionality - Modifiers
  it.todo("should apply cursed item surcharge");
  it.todo("should apply high enchantment surcharge");
  it.todo("should apply both cursed and high enchantment surcharges");
  it.todo("should apply first insurance surcharge");
  it.todo("should apply loyalty discount for long-standing customer");
  it.todo("should apply follow-up contract discount");

  // Base Quote Functionality - Multiple Items
  it.todo("should calculate premium for multiple different items");
  it.todo("should apply item-specific modifiers per item");

  // Base Claim Processing - Simple Cases
  it.todo("should calculate simple claim payout with deductible");
  it.todo("should apply deductible per damage event");
  it.todo("should enforce policy cap on total payout");

  // Base Claim Processing - Special Clauses
  it.todo("should reimburse high enchantment damage at 50 percent");
  it.todo("should fully reimburse dragon material damage");
});
