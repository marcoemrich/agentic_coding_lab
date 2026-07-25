import { describe, it, expect } from "vitest";
import { calculateQuote, processClaim } from "./claim-office.js";

describe("Claim Office", () => {
  it.todo("should compute premium for empty item list as 5 G -- processing fee only");

  // Base premiums for main items
  it.todo("should compute 100 G base premium for a sword");
  it.todo("should compute 60 G base premium for an amulet");
  it.todo("should compute 80 G base premium for a staff");
  it.todo("should compute 40 G base premium for a potion");

  // Components and building blocks
  it.todo("should compute 25 G base premium per component (rune or moonstone)");
  it.todo("should apply 60 G special base premium for a block of exactly 3 alike components");
  it.todo("should not apply block discount for 2 runes -- expect 50 G");
  it.todo("should apply block discount for 3 runes -- expect 60 G");
  it.todo("should not apply block discount for 4 runes -- expect 100 G");
  it.todo("should compute 175 G base premium for 7 runes");
  it.todo("should not form block with 2 runes + 1 moonstone -- expect 75 G");
  it.todo("should form two separate blocks with 3 runes + 3 moonstones -- expect 120 G");

  // Premium modifiers - item specific
  it.todo("should add 50% risk surcharge for cursed items");
  it.todo("should add 30% risk surcharge for highly enchanted items (enchantment level ≥ 5)");

  // Premium modifiers - policy wide
  it.todo("should apply 20% loyalty discount for customers with ≥ 2 years with MHPCO");
  it.todo("should add 10% initial assessment surcharge for first insurance");
  it.todo("should apply 15% discount on each contract after the first");

  // Newcomer with cursed sword example
  it.todo("should compute 165 G premium for newcomer with cursed sword -- 100 base + 50 curse + 10 first insurance + 5 fee");

  // Long-standing customer's second contract example
  it.todo("should compute 160 G premium for long-standing customer's second contract with cursed, highly enchanted sword -- includes both first insurance surcharge and follow-up discount");

  // Policy modifier scope
  it.todo("should apply cursed surcharge only to the cursed sword's base premium in a policy with cursed sword and plain amulet -- total base 160 G, surcharge 50 G");

  // Rounding
  it.todo("should round premium of 197.5 G up to 198 G in MHPCO's favor");
  it.todo("should round payout of 350.5 G down to 350 G in MHPCO's favor");

  // Deductible and cap
  it.todo("should apply 100 G deductible per damage event");
  it.todo("should cap total payout per policy at twice the insurance sum");

  // Claim processing - standard reimbursement
  it.todo("should reimburse 400 G for regular sword (steel, enchantment 3) with 500 G damage -- full minus 100 G deductible");
  it.todo("should reimburse 100 G for rune with 200 G damage -- full minus 100 G deductible");

  // Claim processing - special clauses
  it.todo("should reimburse 400 G for dragon-material sword, enchantment 9, 1000 G damage -- 50% rule wins, then deductible");
  it.todo("should reimburse 700 G for dragon-material sword, enchantment 5, 800 G damage -- dragon-material clause applies");
  it.todo("should reimburse 400 G for steel sword, enchantment 9, 1000 G damage -- high-enchantment clause applies");

  // Multiple items of the same type
  it.todo("should support policy with two swords -- insurance sum 2000 G, cap 4000 G");
  it.todo("should apply separate 100 G deductible for each damaged sword in dragon attack");
  it.todo("should reject claim when damages array contains more entries of a type than insured -- exit with non-zero status");

  // Cap exhaustion
  it.todo("should have 600 G payout and 0 G remaining cap for second claim of 1500 G when cap was already reduced to 600 G");

  // Edge cases
  it.todo("should exit with non-zero status code when quote includes an item with unknown type");
  it.todo("should exit with non-zero status code when claim references a damage entry whose item is not part of the policy");
  it.todo("should exit with non-zero status code when claim contains a damage entry with negative amount");
});
