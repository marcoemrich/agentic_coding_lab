import { describe, it, expect } from "vitest";
import { calculateInsurancePremium as processScenario } from "./claim-office.js";
import { describe, it, expect } from "vitest";

describe("Claim Office", () => {
  it("should return premium of 5 G for empty item list -- matches rule: empty item list → premium 5 G (only the processing fee)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [] }
      ]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(5);
  });
  it("should apply base premium for a sword -- 100 G base premium for a sword", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }
      ]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(100 + 5); // base premium + processing fee
  });
  it("should apply base premium for an amulet -- 60 G base premium for amulet", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] }
      ]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(60 + 5); // base premium + processing fee
  });
  it("should apply base premium for a staff -- 80 G base premium for a staff", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff" }] }
      ]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(80 + 5); // base premium + processing fee
  });
  it("should apply base premium for a potion -- 40 G base premium for a potion", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] }
      ]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(40 + 5); // base premium + processing fee
  });
  it("should apply base premium of 25 G per component for runes and moonstones -- 25 G each", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] }
      ]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(25 + 5); // base premium + processing fee
  });
  it("should apply special base premium of 60 G for exactly 3 alike components -- block of 3 runes → 60 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }
      ]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(60 + 5); // block premium + processing fee
  });
  it("should not apply block discount for 4 runes -- 4 runes → 100 G (no block)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }
      ]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(100 + 5); // 4 × 25 = 100 + processing fee
  });
  it("should apply block discount separately per component type -- 3 runes + 3 moonstones → 120 G (two separate blocks)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }
        ] }
      ]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(120 + 5); // 60 + 60 + processing fee
  });
  it("should not apply block discount for mixed component types -- 2 runes + 1 moonstone → 75 G (different types)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "rune" }, { type: "rune" },
          { type: "moonstone" }
        ] }
      ]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(75 + 5); // 2×25 + 1×25 = 75 + processing fee
  });
  it("should add 50 % risk surcharge for cursed items -- cursed sword (100 G base) → +50 G surcharge", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] }
      ]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(100 + 50 + 5); // base + surcharge + processing fee
  });
  it("should add 30 % risk surcharge for highly enchanted items (enchantment ≥ 5) -- sword with enchantment 5 → +30 G surcharge", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 5 }] }
      ]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(100 + 30 + 5); // base + surcharge + processing fee
  });
  it("should apply 20 % loyalty discount for long-standing customers (≥ 2 years) -- 3-year customer → 20 % off policy base premium", () => {
    const input = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }
      ]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(Math.ceil(100 * 0.8) + 5); // 20% discount on base, then + processing fee
  });
  it("should add 10 % initial assessment surcharge for first insurance -- first insurance → +10 % of policy base premium", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }
      ]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(Math.ceil(100 * 1.1) + 5); // 10% initial assessment surcharge + processing fee
  });
  it.todo("should apply 15 % discount for contracts after the first -- second contract → 15 % off policy base premium");
  it.todo("should add 5 G processing fee to every premium -- every premium gets +5 G fee");
  it.todo("should apply modifier stacking: cursed sword with high enchantment → base + 50 % + 30 % -- cursed sword, enchantment 7 → 100 + 50 + 30 = 180 G before other modifiers and fee");
  it.todo("should apply modifier stacking: loyalty discount and follow-up contract discount -- customer with 3 years, second contract → -20 % -15 % on policy base premium");
  it.todo("should apply item-specific modifiers only to affected items -- policy with cursed sword (100 G) and plain amulet (60 G) → cursed surcharge adds 50 G (50 % of sword only)");
  it.todo("should apply policy-wide modifiers to sum of item base premiums -- loyalty discount applies to total base premium, not per item");
  it.todo("should return 165 G premium for cursed sword with new customer, no previous contract -- matches integration example: 100 + 50 + 10 + 5 = 165 G");
  it.todo("should return 160 G premium for cursed sword with high enchantment under long-standing customer's second contract -- matches integration example: 100 + 50 + 30 - 20 + 10 - 15 + 5 = 160 G");
  it.todo("should reject quote with unknown item type and exit with error -- type \"broomstick\" → non-zero status code, error to stderr");
  it.todo("should compute cap as twice insurance sum -- sword (1000 G) → cap 2000 G");
  it.todo("should apply 100 G deductible per damage event -- regular sword, damage 500 G → payout 400 G");
  it.todo("should apply 50 % reimbursement for items with enchantment level ≥ 8 -- dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % then -100)");
  it.todo("should fully reimburse damage to items made of dragon material -- steel sword, enchantment 4, damage 500 G → payout 400 G; dragon-material sword, enchantment 4, damage 500 G → payout 500 G");
  it.todo("should cap payout per policy at twice insurance sum -- policy with sword, two claims of 1500 G: first → 1400 G payout, second → 600 G (remaining cap)");
  it.todo("should reject claim if damaged item not in policy -- claim refers to amulet when only sword insured → non-zero status, error to stderr");
  it.todo("should reject claim if damage amount is negative -- amount: -200 → non-zero status, error to stderr");
  it.todo("should reject claim if more damage entries than insured items of that type -- two sword damages but only one sword insured → non-zero status, error to stderr");
  it.todo("should handle multiple items of the same type correctly -- two swords insured → 2000 G sum, cap 4000 G, two separate damage payouts with deductibles");
  it.todo("should round final premiums up in MHPCO's favor -- 197.5 G → 198 G");
  it.todo("should round final payouts down in MHPCO's favor -- 350.5 G → 350 G");
  it.todo("should keep intermediate calculations precise -- use fractions during calculation, round only final result");
});
