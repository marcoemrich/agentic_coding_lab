import { describe, it, expect } from "vitest";
import { runScenario } from "./index.js";

describe("MHPCO Claim Office Policy Management", () => {
  // 1. Quote: Empty item list
  it("Quote with empty items should return 5 G (only the processing fee)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: []
        }
      ]
    };
    const output = runScenario(input);
    expect(output).toEqual({
      results: [{ premium: 5 }]
    });
  });

  // 2. Quote: Single items (Base premium + fee + first insurance)
  it("Quote with a plain sword should return 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false }
          ]
        }
      ]
    };
    const output = runScenario(input);
    expect(output).toEqual({
      results: [{ premium: 115 }]
    });
  });
  
  it.todo("Quote with a plain amulet should return 71 G (60 base + 6 first insurance + 5 fee)");
  it.todo("Quote with a plain staff should return 93 G (80 base + 8 first insurance + 5 fee)");
  it.todo("Quote with a plain potion should return 49 G (40 base + 4 first insurance + 5 fee)");
  it.todo("Quote with a single rune should return 33 G (25 base + 2.5 first insurance + 5 fee = 32.5 rounded up to 33)");

  // 3. Quote: Component building blocks
  it.todo("Quote with 2 runes should return 60 G base premium (2 * 25 = 50 base + 5 first insurance + 5 fee = 60)");
  it.todo("Quote with 3 runes should return 71 G base premium (60 block + 6 first insurance + 5 fee = 71)");
  it.todo("Quote with 4 runes should return 115 G base premium (4 * 25 = 100 base + 10 first insurance + 5 fee = 115)");
  it.todo("Quote with 7 runes should return 198 G base premium (7 * 25 = 175 base + 17.5 first insurance + 5 fee = 197.5 rounded up to 198)");
  it.todo("Quote with 2 runes + 1 moonstone should return 88 G base premium (75 base + 7.5 first insurance + 5 fee = 87.5 rounded up to 88)");
  it.todo("Quote with 3 runes + 3 moonstones should return 137 G base premium (120 base + 12 first insurance + 5 fee = 137)");

  // 4. Quote: Premium modifiers in isolation
  it.todo("Quote with a cursed sword should return 165 G (100 base + 50 curse + 10 first insurance + 5 fee)");
  it.todo("Quote with a highly enchanted sword (level 5) should return 145 G (100 base + 30 high enchantment + 10 first insurance + 5 fee)");
  it.todo("Quote with a sword of enchantment level 4 should return 115 G (no high enchantment surcharge)");
  it.todo("Quote with a plain sword for a customer with exactly 2 years should return 95 G (100 base - 20 loyalty + 10 first insurance + 5 fee)");
  it.todo("Quote with a plain sword for a customer with 1 year should return 115 G (no loyalty discount)");
  it.todo("Quote for a second contract should return 100 G (100 base - 15 follow-up + 10 first insurance + 5 fee)");

  // 5. Quote: Combined modifiers and rounding
  it.todo("Quote for a long-standing customer's second contract with a cursed, highly enchanted (level 7) sword should return 160 G");

  // 6. Claim: Standard reimbursement
  it.todo("Claim damage to a regular steel sword (damage 500 G) should return 400 G payout with 1600 G remaining cap");
  it.todo("Claim damage to a rune (damage 200 G) should return 100 G payout with 400 G remaining cap");

  // 7. Claim: Enchantment and dragon material clauses
  it.todo("Claim damage to a dragon-material sword with enchantment level 5 (damage 800 G) should return 700 G payout");
  it.todo("Claim damage to a steel sword with enchantment level 9 (damage 1000 G) should return 400 G payout");
  it.todo("Claim damage to a dragon-material sword with enchantment level 9 (damage 1000 G) should return 400 G payout (50% rule wins)");

  // 8. Claim: Deductible per damage event
  it.todo("Claim damage to a sword (500 G) and an amulet (300 G) in a single incident should return 600 G payout (two deductibles)");

  // 9. Claim: Multiple items of the same type
  it.todo("Claim damage to two swords in a single incident should treat each as a separate damage with its own deductible");

  // 10. Claim: Cap exhaustion
  it.todo("Claim on a sword policy with two successive claims of 1500 G should return 1400 G then 600 G payouts");

  // 11. Claim: Rounding
  it.todo("Claim with fractional payout should round down to whole G");

  // 12. Edge cases and errors
  it.todo("Quote with an unknown item type should throw an error");
  it.todo("Claim referencing an item type not covered in policy should throw an error");
  it.todo("Claim with negative damage amount should throw an error");
  it.todo("Claim with more damages of a type than insured should throw an error");
});
