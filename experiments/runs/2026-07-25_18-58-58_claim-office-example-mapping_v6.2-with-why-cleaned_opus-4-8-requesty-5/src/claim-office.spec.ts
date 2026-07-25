import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Simplest quote cases ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums for single main items (with first-insurance surcharge always applied) ---
  it("single plain sword, newcomer → base 100 + 10 first insurance + 5 fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  // --- Component base premiums ---
  it("2 runes → 50 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    });
    // 2×25 = 50 base + 10% first insurance (5) + 5 fee = 60
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    // block: 60 base + 10% first insurance (6) + 5 fee = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    // no block: 4×25 = 100 base + 10% first insurance (10) + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    // no block: 7×25 = 175 base + 17.5 first insurance + 5 fee = 197.5 → ceil 198
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- 'Alike' components clarification ---
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    // no block (types differ): 3×25 = 75 base + 7.5 first insurance + 5 fee = 87.5 → ceil 88
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    });
    // two blocks: 60 + 60 = 120 base + 12 first insurance + 5 fee = 137
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Premium modifiers in isolation ---
  it("cursed sword adds 50% curse surcharge to item base", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 10 first insurance + 5 fee = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword enchantment 5 adds 30% high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    // 100 base + 30 high-ench + 10 first insurance + 5 fee = 145
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword enchantment 4 → no high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });
    // below threshold: 100 base + 10 first insurance + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("sword enchantment 5 and cursed → both surcharges apply", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 30 high-ench + 10 first insurance + 5 fee = 195
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("customer with exactly 2 years → 20% loyalty discount applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    // policy base 100 + 10 first insurance - 20 loyalty + 5 fee = 95
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword (100) + plain amulet (60): policy base 160, curse adds 50 → 210 before fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    // policy base 160 + 50 curse + 16 first insurance (10+6) + 5 fee = 231
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding ---
  it("premium calculation yielding 197.5 G → 198 G (rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    // 175 base + 17.5 first insurance + 5 fee = 197.5 → ceil 198
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- Integration examples ---
  it("newcomer with cursed sword (steel, ench 3), 0 years, first quote → premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 10 first insurance + 5 fee = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's 2nd contract: cursed sword (ench 7), 3 years → premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    // 2nd quote: 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first insurance
    //            - 15 follow-up + 5 fee = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("first insurance surcharge applies to each item even on a follow-up contract", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    // 2nd quote (follow-up, 0 years): 100 base + 10 first insurance - 15 follow-up + 5 fee = 100
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, ench 3), damage 500 → payout 400 G (500 - 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    // full reimbursement 500 - 100 deductible = 400; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 (no ench/material) → payout 100 G (200 - 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    // insurance value 250 → cap 500; 200 - 100 deductible = 100; remainingCap 400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: special clauses ---
  it("steel sword ench 9, damage 1000 → payout 400 G (50% then deductible: 500 - 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // enchantment >= 8: 50% of 1000 = 500, - 100 deductible = 400; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench 5, damage 800 → payout 700 G (full then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    // dragon material → full reimbursement; ench 5 < 8; 800 - 100 = 700; cap 2000 - 700 = 1300
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword ench 9, damage 1000 → payout 400 G (50% wins: 500 - 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // both clauses apply; 50% rule wins: 500 - 100 = 400; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword exactly ench 8, damage 1000 → payout 400 G (high-ench then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // ench 8 >= 8 → 50% → 500 - 100 = 400; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    // (500-100) + (300-100) = 600; insurance sum 1600, cap 3200; remainingCap 2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: multiple items of same type ---
  it("policy covers two swords → insurance sum 2000, cap 4000; both damaged, separate deductibles", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 400 },
            ],
          },
        },
      ],
    });
    // (500-100) + (400-100) = 700; insurance sum 2000, cap 4000; remainingCap 3300
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 3300 });
  });
  it("more damage entries of a type than insured → CLI rejects (non-zero exit)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 400 },
            ],
          },
        },
      ],
    };
    // only one sword insured, two sword damages → whole claim rejected
    expect(() => runScenario(scenario)).toThrow();
  });

  // --- Claim: cap and insurance sum ---
  it("sword + amulet → insurance sum 1600, cap 3200", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    // insurance sum 1600 → cap 3200; payout 100; remainingCap 3100
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cursed sword → cap 2000 based on unmodified insurance value", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
        },
      ],
    });
    // cap uses unmodified insurance value 1000 → 2000; payout 200; remainingCap 1800
    expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });
  it("sword + 3 runes → insurance sum 1750 (block discount does not affect insurance sum)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
        },
      ],
    });
    // insurance sum 1000 + 3×250 = 1750 → cap 3500; payout 200; remainingCap 3300
    expect(result.results[1]).toEqual({ payout: 200, remainingCap: 3300 });
  });
  it("cap exhaustion: two 1500 claims → first payout 1400 (remaining 600), second payout 600 (remaining 0)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    // cap 2000; first claim 1400 (remaining 600); second desired 1400 capped to 600 (remaining 0)
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Payout rounding ---
  it("payout calculation yielding 350.5 G → payout 350 G (rounded down)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    // 50% of 901 = 450.5, - 100 = 350.5 → floor 350; cap 2000 - 350 = 1650
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Error cases ---
  it("quote with unknown item type → throws / non-zero exit, no results", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [{ type: "broomstick" }] }],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim referencing an item not in the policy → throws / non-zero exit", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim damage entry with negative amount → throws / non-zero exit", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});
