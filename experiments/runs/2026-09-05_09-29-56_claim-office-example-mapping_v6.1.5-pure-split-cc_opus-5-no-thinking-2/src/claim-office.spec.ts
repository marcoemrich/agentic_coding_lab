import { execFileSync } from "node:child_process";
import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums: single main items ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("a plain sword → base premium 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("a plain amulet → base premium 60 G + 6 G first insurance + 5 G fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("a plain staff → base premium 80 G + 8 G first insurance + 5 G fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("a plain potion → base premium 40 G + 4 G first insurance + 5 G fee = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components and the block of 3 alike ---
  it("1 rune → base premium 25 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    // 25 base + 2.5 first insurance + 5 fee = 32.5 → 33 (rounded up)
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes → base premium 50 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    // 50 base + 5 first insurance + 5 fee = 60
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → base premium 60 G (block applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });

    // 60 base (block) + 6 first insurance + 5 fee = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → base premium 100 G (no block — block requires exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });

    // 100 base + 10 first insurance + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → base premium 175 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });

    // 175 base + 17.5 first insurance + 5 fee = 197.5 → 198 (rounded up)
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("1 moonstone → base premium 25 G (components are priced alike)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });

    // 25 base + 2.5 first insurance + 5 fee = 32.5 → 33 (rounded up)
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes + 1 moonstone → base premium 75 G (no block: different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });

    // 75 base + 7.5 first insurance + 5 fee = 87.5 → 88 (rounded up)
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → base premium 120 G (two separate blocks)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            ...Array.from({ length: 3 }, () => ({ type: "rune" })),
            ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
          ],
        },
      ],
    });

    // 120 base (two blocks) + 12 first insurance + 5 fee = 137
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers ---
  it("cursed sword adds a 50 % surcharge on that item's base premium (100 G → +50 G)", () => {
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
  it("sword with enchantment 5 → high-enchantment surcharge applies (+30 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });

    // 100 base + 30 high enchantment + 10 first insurance + 5 fee = 145
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 → no high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });

    // 100 base + 10 first insurance + 5 fee = 115 (no surcharge below 5)
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5 → both surcharges apply (+50 G and +30 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });

    // 100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee = 195
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Policy-wide modifiers ---
  it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
      ],
    });

    // 100 base − 20 loyalty + 10 first insurance + 5 fee = 95
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year with MHPCO → no loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
      ],
    });

    // 100 base + 10 first insurance + 5 fee = 115 (no discount below 2 years)
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("first insurance adds a 10 % surcharge on the policy base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }, { type: "potion" }] },
      ],
    });

    // policy base 100 (60 + 40) + 10 first insurance + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("the customer's second quote gets a 15 % follow-up contract discount", () => {
    const sword = { type: "sword", material: "steel", enchantment: 1, cursed: false };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });

    // step 0: 100 + 10 first insurance + 5 fee = 115
    // step 1: 100 + 10 first insurance − 15 follow-up + 5 fee = 100
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("each item in a quote is a first insurance even on a follow-up contract", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    // step 0: 40 base − 8 loyalty + 4 first insurance + 5 fee = 41
    // step 1: 100 base + 50 curse + 30 high ench − 20 loyalty
    //         + 10 first insurance − 15 follow-up = 155 + 5 fee = 160
    expect(result).toEqual({ results: [{ premium: 41 }, { premium: 160 }] });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword (100 G) + plain amulet (60 G) → policy base 160 G, curse adds 50 G (50 % of the cursed item only) → 210 G before further modifiers and fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: true },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
        },
      ],
    });

    // policy base 160 + 50 curse (of the sword's 100 only)
    // + 16 first insurance (10% of 160, not of 210) + 5 fee = 231
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding ---
  it("a fractional premium is rounded up in the MHPCO's favour (98.5 G → 99 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            ...Array.from({ length: 3 }, () => ({ type: "rune" })),
            { type: "moonstone" },
          ],
        },
      ],
    });

    // base 85 (60 rune block + 25) + 8.5 first insurance + 5 fee = 98.5 → 99
    expect(result).toEqual({ results: [{ premium: 99 }] });
  });
  // "intermediate amounts are kept as fractions; only the final premium is
  // rounded" is asserted by the 98.5 → 99 and 197.5 → 198 tests above.
  //
  // --- Integration examples (premium) ---
  // Both spec integration examples are already asserted verbatim: the 165 G
  // newcomer by the cursed-sword test, and the 160 G follow-up contract by
  // "each item in a quote is a first insurance even on a follow-up contract".

  // --- Claims: standard reimbursement ---
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    // payout 500 − 100 deductible = 400; cap 2000 (2 × 1000) − 400 = 1600
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("damage to a rune (value 250 G), damage 200 G → payout 100 G (no special clause)", () => {
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

    // runes have no enchantment or material, so no special clause applies:
    // payout 200 − 100 = 100; cap 500 (2 × 250) − 100 = 400
    expect(result).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  // "a claim reports remainingCap after the payout" is asserted by every claim
  // test in this file, each of which checks both fields of the result.

  // --- Claims: special clauses ---
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % then deductible)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // premium: 100 base + 30 high ench + 10 first insurance + 5 fee = 145
    // payout: 50% of 1000 = 500, − 100 deductible = 400; cap 2000 − 400 = 1600
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full, then deductible)", () => {
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
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });

    // premium: 100 base + 30 high ench + 10 first insurance + 5 fee = 145
    // payout: full reimbursement, then deductible: 800 − 100 = 700; cap 2000 − 700 = 1300
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
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
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // both clauses apply; the 50 % rule wins: 500 − 100 = 400; cap 2000 − 400 = 1600
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (threshold is ≥ 8)", () => {
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
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // enchantment exactly 8 still halves: 500 − 100 = 400; cap 2000 − 400 = 1600
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- Deductible per damage event ---
  it("dragon attack damages a sword (500 G) and an amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });

    // premium: base 160 + 16 first insurance + 5 fee = 181
    // payout: (500 − 100) + (300 − 100) = 600; cap 3200 (2 × 1600) − 600 = 2600
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // --- Payout rounding ---
  it("a payout calculation yielding 350.5 G → final payout 350 G (rounded down)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });

    // 901 × 0.5 = 450.5, − 100 deductible = 350.5 → payout 350 (rounded down).
    // The cap is drawn down by the payout actually made, so 2000 − 350 = 1650
    // and both reported figures stay whole G as the output schema requires.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // --- Insurance sum and cap ---
  // The sword+amulet cap of 3200 G is pinned by the per-item-deductible test
  // (remainingCap 2600 after a 600 G payout), and the two-sword cap of 4000 G
  // by the two-swords test (remainingCap 3550 after a 450 G payout).
  it("a cursed sword (premium 165 G) → cap 2000 G (premium modifiers do not raise the cap)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 2500 }] },
        },
      ],
    });

    // the desired 2400 is clamped to the cap, showing the cap is 2000 —
    // built from the sword's unmodified insurance value, not its 165 G premium
    expect(result).toEqual({
      results: [{ premium: 165 }, { payout: 2000, remainingCap: 0 }],
    });
  });
  it("a policy covering a sword and 3 runes → insurance sum 1750 G (block discount affects premium only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            ...Array.from({ length: 3 }, () => ({ type: "rune" })),
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 4000 }] },
        },
      ],
    });

    // premium: base 160 (100 sword + 60 rune block) + 16 first insurance + 5 fee = 181
    // the desired 3900 clamps to the cap, showing the cap is 3500 = 2 × 1750:
    // the block discount cut the premium but not the insurance sum
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 3500, remainingCap: 0 }],
    });
  });

  // --- Cap exhaustion ---
  it("sword insured (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });

    // payout 1500 − 100 = 1400, within the 2000 cap; remaining 600
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
    });
  });
  it("second claim of 1500 G → payout 600 G, remainingCap 0 G (reduced to the remaining cap)", () => {
    const claimOf1500 = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
        claimOf1500,
        claimOf1500,
      ],
    });

    // first claim takes 1400 of the 2000 cap; the second wants 1400 but only
    // 600 remains, so it is reduced to 600 and the cap is exhausted
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Multiple items of the same type ---
  it("two swords insured, a dragon attack damages both → each damage entry gets its own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });

    // premium: base 200 + 30 high ench (the enchantment-9 sword)
    //          + 20 first insurance + 5 fee = 255
    // payout: the two damages settle against the two distinct swords —
    //         (500 − 100) + (300 × 0.5 − 100) = 400 + 50 = 450
    //         cap 4000 (2 × 2000) − 450 = 3550
    expect(result).toEqual({
      results: [{ premium: 255 }, { payout: 450, remainingCap: 3550 }],
    });
  });

  // --- Error cases ---
  it("quote with an unknown item type (broomstick) → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim referencing an item not part of the policy (amulet when only a sword is insured) → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim referencing a damage with an unknown item type → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with a damage amount of -200 → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 200 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });

  // --- CLI ---
  it("the CLI reads a scenario from stdin and writes {results:[...]} to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };

    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    // premium: 60 base − 12 loyalty + 6 first insurance + 5 fee = 59
    // payout: 200 − 100 = 100; cap 1200 (2 × 600) − 100 = 1100
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  // The spec's schema example is exactly the scenario used by the stdin/stdout
  // test above, which asserts a premium result then a payout/remainingCap one.
  it("the CLI exits with a non-zero status and writes to stderr on an invalid scenario", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const run = (): { status: number; stdout: string; stderr: string } => {
      try {
        execFileSync("npx", ["tsx", "src/cli.ts"], {
          input: JSON.stringify(scenario),
          encoding: "utf8",
          stdio: ["pipe", "pipe", "pipe"],
        });
      } catch (error) {
        const failure = error as { status: number; stdout: string; stderr: string };

        return failure;
      }

      throw new Error("expected the CLI to exit with a non-zero status");
    };

    const { status, stdout, stderr } = run();

    expect(status).not.toBe(0);
    expect(stderr).toContain("broomstick");
    expect(stdout).toBe("");
    // a reported error, not an unhandled crash
    expect(stderr).not.toContain("at ");
  });
});
