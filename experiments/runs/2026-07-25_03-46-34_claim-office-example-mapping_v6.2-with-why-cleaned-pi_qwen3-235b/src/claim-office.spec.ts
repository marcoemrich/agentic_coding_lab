// src/claim-office.spec.ts
import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it("should compute premium for empty item list as 5 G (only processing fee)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: []
        }
      ]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(5);
  });
  
  // Base premiums for main items
  it.todo("should compute base premium for sword as 100 G");
  it.todo("should compute base premium for amulet as 60 G");
  it.todo("should compute base premium for staff as 80 G");
  it.todo("should compute base premium for potion as 40 G");
  
  // Components and building blocks
  it.todo("should compute base premium for 2 runes as 50 G");
  it.todo("should compute base premium for 3 runes as 60 G (block applies)");
  it.todo("should compute base premium for 4 runes as 100 G (no block)");
  it.todo("should compute base premium for 7 runes as 175 G");
  it.todo("should not apply block to 2 runes + 1 moonstone (premium 75 G)");
  it.todo("should apply two separate blocks for 3 runes + 3 moonstones (premium 120 G)");
  
  // Item-specific modifiers
  it.todo("should add 50% risk surcharge for cursed sword (50 G on 100 G base)");
  it.todo("should add 30% risk surcharge for highly enchanted sword (enchantment ≥ 5)");
  it.todo("should not add high-enchantment surcharge for sword with enchantment 4");
  
  // Policy-wide modifiers
  it.todo("should apply 20% loyalty discount for customer with ≥ 2 years with MHPCO");
  it.todo("should apply 10% first insurance surcharge to each quote item");
  it.todo("should apply 15% discount on each contract after the first");
  
  // Modifier scope
  it.todo("should apply cursed surcharge only to the cursed item in a multi-item policy");
  it.todo("should apply policy-wide modifiers to the entire policy base premium");
  
  // Modifier thresholds
  it.todo("should apply loyalty discount for customer with exactly 2 years with MHPCO");
  it.todo("should apply high-enchantment surcharge for sword with exactly enchantment 5");
  it.todo("should apply both surcharges for cursed sword with enchantment ≥ 5");
  
  // Integration examples
  it.todo("should compute premium 165 G for newcomer with cursed sword (integration example)");
  it.todo("should compute premium 160 G for long-standing customer's second contract with cursed, enchanted sword (integration example)");
  it.todo("should treat each quote item as first insurance regardless of customer history");
  
  // Rounding rules
  it.todo("should round up premium 197.5 G to 198 G");
  it.todo("should round down payout 350.5 G to 350 G");
  it.todo("should keep intermediate calculations as fractions");
  
  // Processing fee
  it.todo("should add 5 G processing fee to every premium");
  
  // Claim processing - standard reimbursement
  it.todo("should reimburse 400 G for 500 G damage to regular sword (minus 100 G deductible)");
  it.todo("should reimburse 100 G for 200 G damage to rune (minus 100 G deductible)");
  
  // Deductible per damage event
  it.todo("should apply 100 G deductible per damaged item in multi-item claim");
  
  // Special claim clauses
  it.todo("should reimburse at 50% for damage to item with enchantment ≥ 8");
  it.todo("should fully reimburse damage to item made of dragon material");
  
  // Claim clause interactions
  it.todo("should apply 50% rule over dragon-material clause for dragon-material sword with enchantment ≥ 8");
  it.todo("should fully reimburse dragon-material sword with enchantment < 8");
  it.todo("should reimburse at 50% for steel sword with enchantment ≥ 8");
  
  // Insurance sum and cap
  it.todo("should set policy cap to twice the insurance sum");
  it.todo("should compute insurance sum as total of item insurance values");
  it.todo("should keep insurance sum unaffected by component block discounts");
  
  // Multi-item policies
  it.todo("should handle policy with two swords (insurance sum 2000 G, cap 4000 G)");
  it.todo("should allow claim with two sword damages when two swords are insured");
  it.todo("should reject claim with two sword damages when only one sword is insured");
  
  // Cap exhaustion scenarios
  it.todo("should limit first claim payout and reduce remaining cap accordingly");
  it.todo("should reduce second claim payout to remaining cap when insufficient");
  it.todo("should set remaining cap to 0 after complete exhaustion");
  
  // Error cases
  it.todo("should exit with error for quote with unknown item type");
  it.todo("should exit with error for claim referencing non-insured item");
  it.todo("should exit with error for claim with negative damage amount");
});