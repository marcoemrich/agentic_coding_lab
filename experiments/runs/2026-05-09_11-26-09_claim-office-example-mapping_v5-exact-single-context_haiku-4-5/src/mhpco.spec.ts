import { describe, it, expect } from "vitest";
import { quote, claim } from "./mhpco.js";

describe("MHPCO Claim Office", () => {
  // Quote: Base functionality
  it.todo("should calculate premium for a single plain sword");
  it.todo("should include 5G processing fee in premium");
  it.todo("should calculate premium for a single plain amulet");
  it.todo("should calculate premium for a single plain staff");
  it.todo("should calculate premium for a single plain potion");
  it.todo("should calculate premium for multiple different items");
  it.todo("should calculate premium for component items (runes, moonstones)");
  it.todo("should apply component block discount for exactly 3 alike components");
  it.todo("should not apply block discount for non-alike components");
  it.todo("should apply curse surcharge (+50%) to a single item");
  it.todo("should apply high enchantment surcharge (+30%) for enchantment >= 5");
  it.todo("should apply both curse and enchantment surcharges to same item");
  it.todo("should apply loyalty discount (-20%) for customers with >= 2 years");
  it.todo("should apply first insurance surcharge (+10%) to new contract");
  it.todo("should apply follow-up contract discount (-15%) on repeat quote");
  it.todo("should return premium of 5G for empty item list (only fee)");
  it.todo("should round premium up in MHPCO's favor");

  // Claim: Base functionality
  it.todo("should process claim with 100G deductible per damaged item");
  it.todo("should process claim for single item damage");
  it.todo("should process claim for damage to multiple items (separate deductibles)");
  it.todo("should cap payout at 2x insurance sum of policy");
  it.todo("should apply dragon material clause (100% reimbursement)");
  it.todo("should apply high enchantment clause (50% reimbursement) for enchantment >= 8");
  it.todo("should apply dragon material clause over enchantment clause when both apply");
  it.todo("should enforce cap across multiple claims (remaining cap decreases)");
  it.todo("should round payout down in customer's favor");
  it.todo("should reject claim if damage references item not in policy");
  it.todo("should reject claim if damage amount is negative");
  it.todo("should reject claim if more damage entries than policy items");

  // CLI integration
  it.todo("should read JSON from stdin and write results to stdout");
  it.todo("should process sequential quote and claim operations");
  it.todo("should exit with error on unknown item type");
  it.todo("should exit with error on invalid claim");
});
