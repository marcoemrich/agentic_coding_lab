import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it("should compute premium for empty item list as 5 G (only processing fee)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [] }
      ]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(5);
  });

  it.todo("should compute base premium for a sword as 100 G");
  it.todo("should compute base premium for an amulet as 60 G");
  it.todo("should compute base premium for a staff as 80 G");
  it.todo("should compute base premium for a potion as 40 G");
  it.todo("should compute base premium for a component (rune/moonstone) as 25 G each");

  it.todo("should apply 50% surcharge for a cursed item on its base premium");
  it.todo("should apply 30% surcharge for an item with enchantment level >= 5");
  it.todo("should apply both cursed and high enchantment surcharges when both conditions are met");

  it.todo("should apply 20% loyalty discount for long-standing customers (>= 2 years)");
  it.todo("should apply 10% initial assessment surcharge for a first insurance");
  it.todo("should apply 15% discount for each contract after the first");
  it.todo("should apply all policy-wide modifiers to the policy base premium");
  it.todo("should apply item-specific modifiers only to the affected item's base premium");

  it.todo("should add 5 G processing fee to every premium");
  it.todo("should round final premium up to whole G in MHPCO's favor");
  it.todo("should round final payout down to whole G in MHPCO's favor");
  it.todo("should keep intermediate values as fractions during calculation");

  it.todo("should reject quote with unknown item type and exit with error");
  it.todo("should reject claim with unknown item type and exit with error");
  it.todo("should reject claim with damage amount < 0 and exit with error");
  it.todo("should reject claim referencing item not in policy and exit with error");

  it.todo("should apply 60 G base premium for a building block of 3 alike components");
  it.todo("should not apply block discount for 4 identical components");
  it.todo("should apply block discount only to exactly 3 identical components");
  it.todo("should treat different component types (rune, moonstone) as not alike");
  it.todo("should handle two separate blocks: 3 runes and 3 moonstones -> 120 G");

  it.todo("should compute premium for newcomer's cursed sword as 165 G: (100 + 50 + 10) + 5");
  it.todo("should compute premium for long-standing customer's second contract cursed highly enchanted sword as 160 G: (100 + 50 + 30 - 20 + 10 - 15) + 5");

  it.todo("should apply 100 G deductible per damaged item in claim");
  it.todo("should compute payout for standard sword (enchantment < 8, not dragon) damage 500 G as 400 G (500 - 100)");
  it.todo("should compute payout for rune damage 200 G as 100 G (200 - 100)");

  it.todo("should cap total payout per policy at twice the insurance sum");
  it.todo("should base cap on unmodified insurance value, not on premium");
  it.todo("should not let cap increase with premium modifiers");
  it.todo("should reduce payout when claim exceeds remaining cap");
  it.todo("should exhaust cap after sufficient claims");

  it.todo("should reimburse 50% of damage for items with enchantment level >= 8");
  it.todo("should fully reimburse damage for items made of dragon material");
  it.todo("should apply enchantment 50% rule even if item is also dragon material");
  it.todo("should fully reimburse dragon-material item with enchantment < 8");
  it.todo("should reimburse 50% then deduct 100 for steel sword enchantment 9 damage 1000 G -> 400 G");
  it.todo("should reimburse 400 G for dragon-material sword enchantment 9 damage 1000 G: 50% of 1000 = 500, minus 100 = 400");
  it.todo("should reimburse 700 G for dragon-material sword enchantment 5 damage 800 G: full 800 minus 100 = 700");

  it.todo("should treat each damage entry as separate event with its own deductible");
  it.todo("should reject claim with more damage entries of a type than items insured");
});