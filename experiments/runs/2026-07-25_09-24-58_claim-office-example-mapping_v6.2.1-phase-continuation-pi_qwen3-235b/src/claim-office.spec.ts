import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it.todo("should calculate empty item list premium as 5 G -- only processing fee");

  // Item Base Premiums
  it.todo("should calculate sword base premium as 100 G");
  it.todo("should calculate amulet base premium as 60 G");
  it.todo("should calculate staff base premium as 80 G");
  it.todo("should calculate potion base premium as 40 G");
  it.todo("should calculate component (rune/moonstone) base premium as 25 G each");
  it.todo("should apply special 60 G premium for exactly 3 alike components");
  it.todo("should not apply block discount to 4 or more components of the same type");
  it.todo("should not apply block discount across different component types");
  it.todo("should apply multiple blocks for multiple sets of 3 alike components");

  // Premium Modifiers - Item Specific
  it.todo("should add 50% surcharge to cursed items");
  it.todo("should add 30% surcharge to highly enchanted items (enchantment ≥ 5)");
  it.todo("should apply cursed surcharge only to the base premium of the cursed item in multi-item policies");
  it.todo("should apply high enchantment surcharge only to the base premium of the enchanted item in multi-item policies");
  it.todo("should apply both cursed and high enchantment surcharges when both conditions are met");

  // Premium Modifiers - Policy Wide
  it.todo("should apply 20% loyalty discount for customers with ≥ 2 years with MHPCO");
  it.todo("should apply 10% initial assessment surcharge for first insurance");
  it.todo("should apply 15% follow-up contract discount for contracts after the first");
  it.todo("should apply processing fee of 5 G to every premium");

  // Premium Modifier Order and Integration
  it.todo("should apply first insurance surcharge to new items even for long-standing customers");
  it.todo("should calculate premium as 165 G for newcomer with cursed sword");
  it.todo("should calculate premium as 160 G for long-standing customer's second contract with cursed, highly enchanted sword");

  // Rounding Rules
  it.todo("should round final premium up to whole G in MHPCO's favor when fractional");
  it.todo("should keep intermediate calculations as fractions, only rounding final result");

  // Claim Processing - Base Rules
  it.todo("should apply 100 G deductible per damage event");
  it.todo("should cap total payout per policy at twice the insurance sum");
  it.todo("should reimburse damage to items with enchantment ≥ 8 at 50% of damage amount");
  it.todo("should fully reimburse damage to items made of dragon material");

  // Claim Processing - Special Cases
  it.todo("should apply both dragon material and high enchantment rules when both conditions are met, with 50% rule taking precedence");
  it.todo("should fully reimburse dragon material items with enchantment < 8");
  it.todo("should apply only high enchantment rule (50%) to non-dragon material items with enchantment ≥ 8");

  // Claim Processing - Multiple Items and Events
  it.todo("should apply deductible separately to each damaged item in multi-item damage events");
  it.todo("should support multiple items of the same type in a policy");
  it.todo("should reject claim when damages include more items of a type than are insured");

  // Claim Processing - Cap Exhaustion
  it.todo("should reduce payout when remaining cap is less than calculated payout");
  it.todo("should update remaining cap after each claim");
  it.todo("should set remaining cap to zero when fully exhausted");

  // Claim Processing - Insurance Sum Calculation
  it.todo("should calculate insurance sum as sum of items' insurance values, regardless of component block discounts");
  it.todo("should set cap as twice the insurance sum based on unmodified insurance values");

  // Input Validation and Error Handling
  it.todo("should exit with error for quote with unknown item type");
  it.todo("should exit with error for claim referencing item not part of policy");
  it.todo("should exit with error for claim with negative damage amount");
  it.todo("should exit with error for claim with unknown item type in damages");
})
