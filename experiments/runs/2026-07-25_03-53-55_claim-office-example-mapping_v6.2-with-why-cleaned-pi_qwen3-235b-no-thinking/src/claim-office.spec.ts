import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Office", () => {
  it.todo("should compute premium 5 G for empty item list -- edge case: empty item list");
  
  it.todo("should compute base premium 100 G for a sword");
  it.todo("should compute base premium 60 G for an amulet");
  it.todo("should compute base premium 80 G for a staff");
  it.todo("should compute base premium 40 G for a potion");
  it.todo("should compute base premium 25 G per component for runes and moonstones");
  it.todo("should compute base premium 60 G for a block of 3 alike components -- building block applies");
  it.todo("should compute base premium 50 G for 2 runes -- no block applies");
  it.todo("should compute base premium 100 G for 4 runes -- no block as block requires exactly 3");
  it.todo("should apply component block only to exactly 3 alike components of same type -- different types do not form block");
  it.todo("should compute base premium 120 G for 3 runes and 3 moonstones -- two separate blocks");
  
  it.todo("should add 50 % risk surcharge for cursed items -- applies to base premium of cursed item only");
  it.todo("should add 30 % risk surcharge for highly enchanted items (enchantment level ≥ 5) -- applies to base premium of enchanted item only");
  it.todo("should apply cursed surcharge only to cursed sword in multi-item policy -- modifier scope per item");
  
  it.todo("should apply 20 % loyalty discount for long-standing customers (≥ 2 years) -- policy-wide modifier");
  it.todo("should apply 10 % initial assessment surcharge for first insurance -- applies per item regardless of customer history");
  it.todo("should apply 15 % discount on each contract after first -- policy-wide modifier");
  
  it.todo("should add 5 G processing fee to every premium -- added at the very end");
  
  it.todo("should round final premium to whole G in MHPCO's favor -- e.g. 197.5 → 198");
  it.todo("should round final payout to whole G in MHPCO's favor -- e.g. 350.5 → 350");
  
  it.todo("should reject quote with unknown item type and exit with error -- e.g. broomstick");
  it.todo("should reject claim with damage to item not in policy and exit with error");
  it.todo("should reject claim with negative damage amount and exit with error");
  
  it.todo("should compute payout 400 G for regular sword damage 500 G -- standard reimbursement minus deductible");
  it.todo("should compute payout 100 G for rune damage 200 G -- standard reimbursement minus deductible");
  it.todo("should apply 100 G deductible per damaged item -- applies once per item in damage event");
  
  it.todo("should cap total payout per policy at twice the insurance sum");
  it.todo("should reimburse damage to items with enchantment level ≥ 8 at 50 % of damage amount -- then apply deductible");
  it.todo("should fully reimburse damage to items made of dragon material -- then apply deductible");
  it.todo("should apply both 50 % rule and deductible for dragon-material sword with enchantment 9 -- 50 % rule wins");
  it.todo("should fully reimburse dragon-material sword with enchantment 5 -- only dragon-material clause applies");
  
  it.todo("should reject claim if damages array has more entries of a type than insured -- claim validation");
  
  it.todo("should compute premium 165 G for cursed sword by newcomer -- integration example");
  it.todo("should compute premium 160 G for cursed highly-enchanted sword by long-standing customer on second contract -- integration example, first insurance applies to new item");
  
  it.todo("should reduce second claim payout when cap is partially exhausted -- cap exhaustion example");
});
