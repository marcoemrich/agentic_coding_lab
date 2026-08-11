import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Edge case: simplest possible quote ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums for single main items (with 10% first insurance + 5 G fee) ---
  it("quote for a plain sword (base 100 G) → premium 115 G (100 + 10 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote for a plain amulet (base 60 G) → premium 71 G (60 + 6 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote for a plain staff (base 80 G) → premium 93 G (80 + 8 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }] }],
    });

    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote for a plain potion (base 40 G) → premium 49 G (40 + 4 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] }],
    });

    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components and the building block of 3 alike components ---
  it("quote for 1 rune → base premium 25 G (premium 33 G: 25 + 2.5 first insurance + 5 fee, rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quote for 2 runes → base premium 50 G (no block; premium 60 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote for 3 runes → base premium 60 G (block applies; premium 71 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote for 4 runes → base premium 100 G (no block — block requires exactly 3; premium 115 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote for 7 runes → base premium 175 G (no block — block requires exactly 3; premium 198 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });

    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("quote for 2 runes + 1 moonstone → base premium 75 G (no block: different types; premium 88 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("quote for 3 runes + 3 moonstones → base premium 120 G (two separate blocks; premium 137 G)", () => {
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

    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers in isolation ---
  it("cursed sword adds a 50 % surcharge of its base premium → +50 G (premium 165 G: 100 + 50 curse + 10 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with exactly enchantment 5 adds a 30 % surcharge → +30 G (premium 145 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 gets no high-enchantment surcharge (premium 115 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with exactly enchantment 5 gets both surcharges (premium 195 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Policy-wide modifiers ---
  it("customer with exactly 2 years with MHPCO gets the 20 % loyalty discount (premium 95 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year gets no loyalty discount (premium 115 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("the second quote in a scenario gets the 15 % follow-up contract discount (115 G then 100 G)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("the first insurance surcharge of 10 % applies to every quote, even a follow-up contract", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });

    // Second quote: 100 base + 10 first insurance − 15 follow-up + 5 fee = 100 G.
    // Without the first-insurance surcharge it would be 90 G.
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  // --- Modifier scope on multi-item policies ---
  it("policy with a cursed sword (100 G) and a plain amulet (60 G) → 210 G before further modifiers and fee; curse adds 50 G, 50 % of the cursed sword only (premium 231 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 2, cursed: true },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding of the premium ---
  it("a premium calculation yielding 197.5 G → final premium 198 G (rounded up, MHPCO's favor)", () => {
    // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });

    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  it("intermediate amounts are kept as fractions; only the final premium is rounded", () => {
    // 1 rune, cursed: 25 base + 12.5 curse + 2.5 first insurance + 5 fee = 45 exactly.
    // Rounding the 12.5 curse up on its own would yield 46.
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune", cursed: true }] }],
    });

    expect(result).toEqual({ results: [{ premium: 45 }] });
  });

  // --- Integration examples ---
  // "Newcomer with a cursed sword" (165 G) is covered by the cursed-sword test above:
  // same customer (0 years), same item, same expected premium.
  it("long-standing customer (3 years), second quote, cursed sword (steel, enchantment 7) → premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });

    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (damage minus 100 G deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G (no special clause)", () => {
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

    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: special clauses ---
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (both clauses apply; the 50 % rule wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (high-enchantment clause applies, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damages a sword (500 G) and an amulet (300 G) → payout 600 G (100 G deductible per damaged item)", () => {
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

    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: rounding of the payout ---
  it("a payout calculation yielding 350.5 G → final payout 350 G (rounded down, MHPCO's favor)", () => {
    // enchantment 9 → 50 % of 901 = 450.5, minus the 100 G deductible = 350.5
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Cap: insurance sum and remaining cap ---
  // "sword + amulet → insurance sum 1600 G, cap 3200 G" is asserted by the
  // per-item-deductible test (remainingCap 2600 after a 600 G payout).
  // "two swords → insurance sum 2000 G, cap 4000 G" is asserted by the
  // two-swords test (remainingCap 3400 after a 600 G payout).
  it("policy covering a sword and 3 runes → insurance sum 1750 G, cap 3500 G (block discount affects the premium only)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 100 }] },
        },
      ],
    });

    // Cap 3500 G, payout 100 − 100 = 0 → the untouched cap is visible as remainingCap.
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("cursed sword (premium with modifiers 165 G) → cap 2000 G (premium modifiers do not raise the cap)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });

    expect(result.results[0]).toEqual({ premium: 165 });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sword insured (cap 2000 G), first claim of 1500 G → payout 1400 G, remaining cap 600 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword insured (cap 2000 G), second successive claim of 1500 G → payout 600 G, remaining cap 0 G (the desired 1400 G is reduced to the remaining cap)", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        claim,
        claim,
      ],
    });

    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Multiple items of the same type ---
  it("policy covers two swords, a dragon attack damages both → each damage entry gets its own deductible (insurance sum 2000 G, cap 4000 G)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("more damage entries of a type than insured (two sword damages, one sword insured) → the whole claim is rejected", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });

  // --- Error cases ---
  it("quote with an unknown item type (e.g. broomstick) → rejected with an error naming the type", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });
  it("claim referencing an item not part of the policy (amulet damaged, only a sword insured) → rejected", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("claim referencing a damage entry with an unknown item type → rejected", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("claim with a damage entry of amount -200 → rejected with an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/-200|negative/);
  });

  // --- CLI end-to-end ---
  // CLI behaviour (stdin/stdout, exit codes) is covered in cli.spec.ts.
});
