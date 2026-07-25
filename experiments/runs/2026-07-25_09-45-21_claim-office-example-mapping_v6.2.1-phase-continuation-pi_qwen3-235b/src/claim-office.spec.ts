import { describe, it, expect } from "vitest";
import { calculateQuote, processClaim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it("should calculate premium of 160 G for long-standing customer's second contract with cursed, highly-enchanted sword", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] }
      ]
    };
    const result = calculateQuote(scenario);
    // 100 base + (100 × 0.5) curse + (100 × 0.3) high enchantment -
    // (100+50+30) × 0.2 loyalty + (100+50+30) × 0.1 first insurance -
    // (100+50+30) × 0.15 follow-up contract + 5 fee = 160
    expect(result.results[0].premium).toBe(160);
  });

  it.todo("should compute base premium 100 G for a sword");
  it.todo("should compute base premium 60 G for an amulet");
  it.todo("should compute base premium 80 G for a staff");
  it.todo("should compute base premium 40 G for a potion");
  it.todo("should compute base premium 25 G per component (rune or moonstone)");
  
  it.todo("should apply 50 % risk surcharge for cursed items");
  it.todo("should apply 30 % risk surcharge for highly enchanted items (enchantment level ≥ 5)");
  it.todo("should apply 20 % loyalty discount for long-standing customers (≥ 2 years)");
  it.todo("should apply 10 % initial assessment surcharge for first insurance");
  it.todo("should apply 15 % discount on each contract after the first");
  it.todo("should add 5 G processing fee to every premium");

  it.todo("should handle a policy with a cursed sword and a plain amulet: cursed surcharge applies only to sword's base premium");

  it.todo("should apply building block of 3 alike components at special base premium of 60 G");
  it.todo("should not apply building block for 2 alike components: premium 50 G");
  it.todo("should not apply building block for 4 alike components: premium 100 G");
  it.todo("should apply separate blocks for 3 runes and 3 moonstones: total 120 G");
  it.todo("should not apply block for mixed components (2 runes + 1 moonstone): premium 75 G");

  it.todo("should apply loyalty discount for customer with exactly 2 years with MHPCO");
  it.todo("should apply high-enchantment surcharge for item with exactly enchantment level 5");
  it.todo("should not apply high-enchantment surcharge for item with enchantment level 4");

  it.todo("should apply 100 G deductible per damage event");

  it.todo("should fully reimburse standard sword damage (steel, enchantment 3), subtracting 100 G deductible");
  it.todo("should reimburse rune damage 200 G with 100 G payout (subtracting 100 G deductible)");

  it.todo("should reimburse 50 % of damage for items with enchantment level ≥ 8, then subtract 100 G deductible");
  it.todo("should fully reimburse damage for items made of dragon material");

  it.todo("should give 400 G payout for dragon-material sword, enchantment 9, damage 1000 G (50 % rule wins, deductible applied)");
  it.todo("should give 700 G payout for dragon-material sword, enchantment 5, damage 800 G (dragon clause applies, deductible applied)");
  it.todo("should give 400 G payout for steel sword, enchantment 9, damage 1000 G (high-enchantment rule, 50 % first, then deductible)");

  it.todo("should process two sword damages correctly when policy covers two swords");
  it.todo("should reject claim with non-zero exit code if damages include an item not covered by policy");
  
  it.todo("should set cap to twice the insurance sum of the policy");
  it.todo("should allow claim payout up to the remaining cap");
  it.todo("should reduce payout if cap is exhausted");

  it.todo("should round premium up in the MHPCO's favor");
  it.todo("should round payout down in the MHPCO's favor");

  it.todo("should exit with non-zero status code for unknown item type in quote");
  it.todo("should exit with non-zero status code for damage entry with unknown item type");
  it.todo("should exit with non-zero status code for damage amount less than 0");

  it.todo("should calculate premium of 165 G for newcomer with cursed sword (0 years, one item)");
  it.todo("should calculate premium of 160 G for long-standing customer's second contract with cursed, highly-enchanted sword");
});
