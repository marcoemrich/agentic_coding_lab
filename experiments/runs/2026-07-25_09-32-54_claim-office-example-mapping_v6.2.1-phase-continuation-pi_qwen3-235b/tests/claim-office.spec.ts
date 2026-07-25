import { describe, it, expect } from "vitest";
import { calculateInsurancePremium as handleScenario } from "../src/claim-office.js";

describe("Claim Office", () => {
  it("should compute 5 G premium for empty item list -- empty item list → premium 5 G (only the processing fee)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: []
        }
      ]
    };
    const result = handleScenario(input);
    expect(result.results[0].premium).toBe(5);
  });

  it("should reject quote with unknown item type with non-zero exit code -- unknown type (e.g. \"broomstick\") → error", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "broomstick" }
          ]
        }
      ]
    };
    expect(() => handleScenario(input)).toThrow("Unknown item type: broomstick");
  });
  it("should assign 100 G base premium to a sword -- Sword: 1000 G insurance value, 100 G base premium", () => {
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
    const result = handleScenario(input);
    expect(result.results[0].premium).toBe(105); // 100 base + 5 fee
  });
  it("should assign 60 G base premium to an amulet -- Amulet: 600 G / 60 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet" }
          ]
        }
      ]
    };
    const result = handleScenario(input);
    expect(result.results[0].premium).toBe(65); // 60 base + 5 fee
  });
  it("should assign 80 G base premium to a staff -- Staff: 800 G / 80 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff" }
          ]
        }
      ]
    };
    const result = handleScenario(input);
    expect(result.results[0].premium).toBe(85); // 80 base + 5 fee
  });
  it("should assign 40 G base premium to a potion -- Potion: 400 G / 40 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion" }
          ]
        }
      ]
    };
    const result = handleScenario(input);
    expect(result.results[0].premium).toBe(45); // 40 base + 5 fee
  });
  it("should assign 25 G base premium per component -- Components: 250 G each, 25 G base premium", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" }
          ]
        }
      ]
    };
    const result = handleScenario(input);
    expect(result.results[0].premium).toBe(30); // 25 base + 5 fee
  });
  it("should charge 50% risk surcharge for cursed items -- Cursed items add a 50 % risk surcharge", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true }
          ]
        }
      ]
    };
    const result = handleScenario(input);
    expect(result.results[0].premium).toBe(155); // 100 base + 50 curse surcharge + 5 fee
  });
  it("should charge 30% risk surcharge for highly enchanted items (enchantment ≥ 5) -- Highly enchanted items (enchantment level ≥ 5) add a 30 % risk surcharge", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", enchantment: 5 }
          ]
        }
      ]
    };
    const result = handleScenario(input);
    expect(result.results[0].premium).toBe(135); // 100 base + 30 high-enchantment surcharge + 5 fee
  });
  it("should apply 20% loyalty discount for long-standing customers (≥ 2 years) -- Long-standing customers (≥ 2 years) receive a 20 % loyalty discount", () => {
    const input = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" }
          ]
        }
      ]
    };
    const result = handleScenario(input);
    expect(result.results[0].premium).toBe(85); // 100 base + 5 fee - 20 loyalty (100×0.2)
  });
  it("should apply 10% initial assessment surcharge for first insurance -- A first insurance carries a 10 % initial assessment surcharge", () => {
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
    const result = handleScenario(input);
    expect(result.results[0].premium).toBe(115); // 100 base + 10 first insurance + 5 fee
  });
  it.todo("should apply 15% discount for each contract after the first -- Customers receive a 15 % discount on each contract after their first");
  it.todo("should add 5 G processing fee to every premium -- A 5 G processing fee is added to every premium");
  it.todo("should round final premium in MHPCO's favor (up) -- Rounding in the MHPCO's favor: 197.5 G → 198 G");
  it.todo("should round final payout in MHPCO's favor (down) -- Rounding in the MHPCO's favor: 350.5 G → 350 G");
  it.todo("should apply item-specific modifiers only to affected items -- modifier scope: cursed surcharge applies to affected item's base premium");
  it.todo("should apply policy-wide modifiers to the policy base premium -- loyalty, first insurance, follow-up contract apply to sum of item base premiums");
  it.todo("should group exactly 3 alike components into a block for 60 G premium -- 3 runes → 60 G base premium (block applies)");
  it.todo("should not apply block to 4 runes -- 4 runes → 100 G base premium (no block — block requires exactly 3)");
  it.todo("should require same type for 'alike' components (rune vs moonstone) -- 2 runes + 1 moonstone → no block: different types");
  it.todo("should apply blocks separately to 3 runes and 3 moonstones -- 3 runes + 3 moonstones → two separate blocks, 60 G each → 120 G total");
  it.todo("should apply curse surcharge of 50 G to cursed sword in multi-item policy -- policy: cursed sword (100 G) and plain amulet (60 G) → curse surcharge adds 50 G");
  it.todo("should apply loyalty discount to customer with exactly 2 years -- customer with exactly 2 years → loyalty discount applies");
  it.todo("should apply high-enchantment surcharge to sword with exactly enchantment 5 -- sword with exactly enchantment 5 → high-enchantment surcharge applies");
  it.todo("should not apply high-enchantment surcharge to sword with enchantment 4 -- sword with enchantment 4 → no high-enchantment surcharge");
  it.todo("should apply both curse and high-enchantment surcharges to a cursed sword with enchantment 5");
  it.todo("should compute 165 G premium for newcomer's cursed sword -- newcomer: 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee = 165 G");
  it.todo("should compute 160 G premium for long-standing customer's second contract with cursed, highly-enchanted sword -- 100 G base + 50 G curse + 30 G high enchantment − 20 G loyalty + 10 G first insurance − 15 G follow-up = 155 G + 5 G fee = 160 G");
  it.todo("should apply first insurance surcharge to new item even for long-standing customer -- each item in a quote is treated as a first insurance, regardless of customer history");
  it.todo("should apply 100 G deductible per damage event -- Deductible per damage event: 100 G per damaged item");
  it.todo("should fully reimburse a regular sword with 500 G damage minus deductible → 400 G payout -- regular sword, damage 500 G → payout 400 G");
  it.todo("should reimburse 100 G for rune damage of 200 G minus deductible -- rune, damage 200 G → payout 100 G");
  it.todo("should apply 50% reimbursement to damage on items with enchantment ≥ 8 -- enchantment ≥ 8 → 50% reimbursement");
  it.todo("should fully reimburse damage on items made of dragon material -- dragon material → fully reimbursed");
  it.todo("should apply 400 G payout for dragon-material sword, enchantment 9, damage 1000 G -- both clauses apply; 50% rule wins: 500 - 100 = 400 G");
  it.todo("should apply 700 G payout for dragon-material sword, enchantment 5, damage 800 G -- only dragon-material clause: 800 - 100 = 700 G");
  it.todo("should apply 400 G payout for steel sword, enchantment 9, damage 1000 G -- only high-enchantment clause: 500 - 100 = 400 G");
  it.todo("should reject claim with more damage entries than policy covers -- claim has two swords damaged, only one insured → reject");
  it.todo("should calculate insurance sum and cap correctly for multi-item policy -- sword and amulet → sum 1600 G, cap 3200 G");
  it.todo("should reduce cap by payout amounts across claims -- first claim 1400 G, second claim capped at remaining 600 G");
  it.todo("should reject claim if damage entry item is not part of the policy -- amulet damaged when only sword insured → reject");
  it.todo("should reject claim if damage entry has negative amount -- amount: -200 → reject");
});
