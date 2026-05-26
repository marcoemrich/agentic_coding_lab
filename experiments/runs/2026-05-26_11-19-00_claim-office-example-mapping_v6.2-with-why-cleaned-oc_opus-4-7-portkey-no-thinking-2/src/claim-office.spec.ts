import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // ---- Edge cases & simplest premium ----
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("quote with unknown item type throws (CLI exits non-zero)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });

  // ---- Single main item base premiums (+ fee) ----
  it("plain sword for newcomer -> premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("plain amulet for newcomer -> premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("plain staff for newcomer -> premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("plain potion for newcomer -> premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // ---- Components & building blocks ----
  // (long-standing customer with prior contract: no first-insurance surcharge complications - but spec says first-insurance applies per item)
  // Use only the BASE premium check via a returning customer scenario where surcharges are clear.
  // The example values in the spec (50, 60, 100, 175) are explicit BASE premiums; we verify by isolating from first-insurance.
  // Strategy: customer has 0 years but multiple steps; first step gets first-insurance treatment.
  // For block tests we use a 2nd contract (no follow-up discount on the items themselves; spec applies follow-up to whole contract).
  // Simplest: use a customer with 2+ years and a single-quote scenario; loyalty discount is whole-policy.
  // Actually cleanest: just compute expected with all modifiers explicitly.
  // For "2 runes" newcomer: base 50 + 5 first-ins (10%) + 5 fee = 60. We assert that.
  it("2 runes newcomer -> base 50 G + 5 first-ins + 5 fee = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes newcomer -> base 60 G (block) + 6 first-ins + 5 fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes newcomer -> base 100 G (no block) + 10 first-ins + 5 fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes newcomer -> base 175 G + 17.5 first-ins + 5 fee = 198 G (rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone newcomer -> base 75 G + 7.5 first-ins + 5 fee = 88 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones newcomer -> base 120 G (two blocks) + 12 first-ins + 5 fee = 137 G", () => {
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

  // ---- Item-level modifiers ----
  it("cursed sword (newcomer) -> premium 165 G (integration example)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword enchantment exactly 5 newcomer -> premium 145 G (100 base + 30 high-ench + 10 first-ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword enchantment 4 newcomer -> premium 115 G (no high-ench surcharge)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("sword enchantment 5 AND cursed newcomer -> premium 195 G (both surcharges)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // ---- Customer-level modifiers ----
  it("customer with exactly 2 years, plain sword first contract -> premium 95 G (loyalty discount applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("long-standing customer second contract cursed sword ench 7 -> premium 160 G (integration example)", () => {
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
    expect((result as { results: { premium: number }[] }).results[1]).toEqual({ premium: 160 });
  });

  // ---- Modifier scope on multi-item policies ----
  it("cursed sword + plain amulet newcomer -> premium 231 G (160 base + 50 curse + 16 first-ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // ---- Rounding ----
  it("premium calc yields 197.5 -> rounded up to 198 G (favor of MHPCO)", () => {
    // 7 runes: base 175 + 17.5 first-ins + 5 fee = 197.5 → 198
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // ---- Claim: standard reimbursement ----
  it("regular sword damage 500 G -> payout 400 G (full reimbursement minus 100 G deductible)", () => {
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
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 G -> payout 100 G (no special clauses, minus deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // ---- Claim: enchantment threshold vs dragon material ----
  it("dragon-material sword enchantment 9 damage 1000 G -> payout 400 G (50% wins, then deductible)", () => {
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
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 5 damage 800 G -> payout 700 G (full reimbursement, then deductible)", () => {
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
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword enchantment 9 damage 1000 G -> payout 400 G (50% then deductible)", () => {
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
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment exactly 8 damage 1000 G -> payout 400 G", () => {
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
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // ---- Claim: deductible per damage event ----
  it("dragon attack damages sword (500) and amulet (300) -> payout 600 G (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
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
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // ---- Claim: cap exhaustion ----
  it("sword + amulet insurance sum 1600 G cap 3200 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    // payout = 100; cap before = 3200, after = 3100
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cursed sword cap 2000 G (based on unmodified insurance value)", () => {
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
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("sword + 3 runes insurance sum 1750 G cap 3500 G (block discount affects premium only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    // cap = 2 * (1000 + 3*250) = 2 * 1750 = 3500. Payout 100, remaining 3400.
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("sword two successive claims of 1500: first payout 1400, second payout 600, cap exhausted", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    const results = (result as { results: unknown[] }).results;
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // ---- Claim: multiple items of same type ----
  it("two swords -> insurance sum 2000 G cap 4000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("dragon attack damages both swords (two entries) -> each gets its own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    // Each damage: 500 - 100 = 400. Total = 800. Cap 4000, remaining 3200.
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("damages array has more entries of a type than insured -> throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "test",
              damages: [
                { itemType: "sword", amount: 100 },
                { itemType: "sword", amount: 100 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });

  // ---- Claim errors ----
  it("claim references item not in policy -> throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "test", damages: [{ itemType: "amulet", amount: 100 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim has negative damage amount -> throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "test", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });

  // ---- Payout rounding ----
  it("payout calc yields 350.5 -> rounded down to 350 G (favor of MHPCO)", () => {
    // sword ench 8, damage 901 -> 450.5 -> minus deductible 100 -> 350.5 -> rounded down to 350
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
          incident: { cause: "test", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});
