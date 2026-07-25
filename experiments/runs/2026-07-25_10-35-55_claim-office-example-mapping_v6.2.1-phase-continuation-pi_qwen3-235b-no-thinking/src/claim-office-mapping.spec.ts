import { describe, it, expect } from "vitest";
import { claimOfficeMapping } from "./claim-office-mapping.js";

describe("MHPCO Claim Office Mapping", () => {
  it("should handle empty item list - premium should be 5 G (only processing fee)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: []
        }
      ]
    };
    const result = claimOfficeMapping(input);
    expect(result.results[0].premium).toBe(5);
  });
  
  it("should compute base premium for sword - 100 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" }
          ]
        }
      ]
    };
    const result = claimOfficeMapping(input);
    expect(result.results[0].premium).toBe(100);
  });
  
  it.todo("should compute base premium for amulet - 60 G");
  it.todo("should compute base premium for staff - 80 G");
  it.todo("should compute base premium for potion - 40 G");
  
  it.todo("should compute base premium for sword - 100 G");
  it.todo("should compute base premium for amulet - 60 G");
  it.todo("should compute base premium for staff - 80 G");
  it.todo("should compute base premium for potion - 40 G");
  
  it.todo("should compute base premium for components - 25 G each");
  it.todo("should apply building block of 3 alike components - 60 G for 3 components");
  it.todo("should not apply building block to 4 components - 100 G for 4 components");
  it.todo("should handle mixed component types - no block applied");
  
  it.todo("should add 50% surcharge for cursed items - applied only to affected item");
  it.todo("should add 30% surcharge for highly enchanted items (enchantment level >= 5) - applied only to affected item");
  
  it.todo("should apply 20% loyalty discount for long-standing customers (>= 2 years) - on policy base premium");
  it.todo("should add 10% initial assessment surcharge for first insurance - on policy base premium");
  it.todo("should apply 15% discount for follow-up contracts - on policy base premium");
  
  it.todo("should add 5 G processing fee to every premium - at the end");
  
  it.todo("should process quote for newcomer with cursed sword - premium 165 G");
  it.todo("should process quote for long-standing customer's second contract - premium 160 G");
  
  it.todo("should handle unknown item type in quote - exit with error");
  
  it.todo("should apply 100 G deductible per damage event");
  it.todo("should cap total payout at twice the insurance sum");
  
  it.todo("should reimburse 50% of damage for items with enchantment level >= 8");
  it.todo("should fully reimburse damage to items made of dragon material");
  it.todo("should handle conflict between enchantment >=8 and dragon material - 50% rule wins");
  
  it.todo("should reject claim for item not in policy - exit with error");
  it.todo("should reject claim with negative damage amount - exit with error");
  
  it.todo("should handle multiple items of same type - separate deductibles");
  it.todo("should handle cap exhaustion across multiple claims");
  
  it.todo("should round premiums up in MHPCO's favor");
  it.todo("should round payouts down in MHPCO's favor");
});
