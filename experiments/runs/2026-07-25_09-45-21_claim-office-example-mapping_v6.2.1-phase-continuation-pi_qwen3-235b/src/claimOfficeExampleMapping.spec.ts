import { describe, it, expect } from "vitest";
import { calculateMagicalItemInsurancePremium } from "./claimOfficeExampleMapping.js";

describe("claimOfficeExampleMapping", () => {
  it("should handle empty item list -> premium 5 G (only processing fee)", () => {
    expect(calculateMagicalItemInsurancePremium({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [] }
      ]
    })).toEqual({
      results: [
        { premium: 5 }
      ]
    });
  });
  
  it("should process quote for a sword -> base premium 100 G", () => {
    expect(calculateMagicalItemInsurancePremium({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }
      ]
    })).toEqual({
      results: [
        { premium: 100 }
      ]
    });
  });
  it("should process quote for an amulet -> base premium 60 G", () => {
    expect(calculateMagicalItemInsurancePremium({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] }
      ]
    })).toEqual({
      results: [
        { premium: 60 }
      ]
    });
  });
  it("should process quote for a staff -> base premium 80 G", () => {
    expect(calculateMagicalItemInsurancePremium({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff" }] }
      ]
    })).toEqual({
      results: [
        { premium: 80 }
      ]
    });
  });
  it.todo("should process quote for a potion -> base premium 40 G");
  it.todo("should process quote for a rune -> base premium 25 G");
  it.todo("should process quote for a moonstone -> base premium 25 G");
  
  it.todo("should process quote for 3 runes -> base premium 60 G (block applies)");
  it.todo("should process quote for 4 runes -> base premium 100 G (no block)");
  it.todo("should process quote for 7 runes -> base premium 175 G");
  it.todo("should process quote for 2 runes + 1 moonstone -> base premium 75 G (no block: different types)");
  it.todo("should process quote for 3 runes + 3 moonstones -> base premium 120 G (two separate blocks)");
  
  it.todo("should process quote for a cursed sword (100 G base) -> adds 50 G surcharge");
  it.todo("should process quote for a highly enchanted sword (enchantment 5) -> adds 30 G surcharge");
  it.todo("should apply 20 % loyalty discount for long-standing customer (≥ 2 years)");
  it.todo("should apply 10 % initial assessment surcharge on a first insurance");
  it.todo("should apply 15 % discount on each contract after the first");
  it.todo("should add 5 G processing fee to every premium");
  
  it.todo("should calculate premium for a newcomer with a cursed sword -> 165 G");
  it.todo("should calculate premium for a long-standing customer's second contract with a cursed, highly enchanted sword -> 160 G");
  
  it.todo("should round premium 197.5 G → 198 G (in MHPCO's favor)");
  it.todo("should calculate cap = 2 × sum of insurance values");
  
  it.todo("should process claim for damaged sword (500 G) -> payout 400 G (standard reimbursement minus 100 G deductible)");
  it.todo("should apply 100 G deductible per damage event");
  
  it.todo("should process claim for dragon-material sword with enchantment 9, damage 1000 G -> payout 400 G (50 % rule wins)");
  it.todo("should process claim for dragon-material sword with enchantment 5, damage 800 G -> payout 700 G (full reimbursement)");
  it.todo("should process claim for steel sword with enchantment 9, damage 1000 G -> payout 400 G (50 % rule applies)");
  
  it.todo("should handle claim with two damages to same item type when only one insured -> exit with non-zero status");
  it.todo("should handle claim for item not in policy -> exit with non-zero status");
  it.todo("should handle claim with negative damage amount -> exit with non-zero status");
  
  it.todo("should calculate remaining cap correctly: second claim reduces payout to remaining cap");
});
