import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote - base premiums and processing fee
  it("empty item list yields premium of 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("quote for a single plain sword (steel, enchantment 0, not cursed, new customer with no previous contracts) → 100 + 10 (first insurance) + 5 (fee) = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote for a single plain amulet → 60 + 6 + 5 = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote for a single plain staff → 80 + 8 + 5 = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote for a single plain potion → 40 + 4 + 5 = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Components and blocks
  it("quote for 1 rune → 25 + 3 (first insurance, rounded up) + 5 = 33 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quote for 2 runes → 50 + 5 + 5 = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote for 3 runes (block) → 60 + 6 + 5 = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote for 4 runes (no block) → 100 + 10 + 5 = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote for 7 runes → 175 + 18 (rounded up) + 5 = 198 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("quote for 2 runes + 1 moonstone (no block, different types) → 75 + 8 + 5 = 88 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("quote for 3 runes + 3 moonstones (two separate blocks) → 120 + 12 + 5 = 137 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // Premium modifiers - item-specific
  it("quote for cursed sword adds 50% surcharge on item base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }] },
      ],
    });
    // 100 base + 50 curse + 10 first insurance (10% of policy base 100) + 5 fee = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("quote for sword with enchantment 5 adds 30% high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
      ],
    });
    // 100 base + 30 high ench + 10 first ins + 5 fee = 145
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("quote for sword with enchantment 4 has no high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote for cursed sword with enchantment 5 applies both surcharges", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] },
      ],
    });
    // 100 + 50 curse + 30 high ench + 10 first ins + 5 = 195
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // Premium modifiers - policy-wide
  it("quote for customer with 2 years gets 20% loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      ],
    });
    // 100 base - 20 loyalty + 10 first ins + 5 fee = 95
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("quote for customer's second contract gets 15% follow-up discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      ],
    }) as { results: { premium: number }[] };
    // First: 115 G (already verified)
    // Second: 100 base - 15 follow-up + 10 first ins + 5 fee = 100
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  // Multi-item policy
  it("quote for cursed sword + plain amulet (newcomer) → 231 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // 100 + 60 + 50 curse + 16 first ins (10% of 160) + 5 = 231
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // Rounding
  it("premium that yields 197.5 G rounds up to 198 G", () => {
    // 7 runes: base 175 + 17.5 first insurance + 5 fee = 197.5 → 198
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // Integration
  it("newcomer with cursed sword (steel, ench 3) → 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second contract with cursed enchanted sword → 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    }) as { results: { premium: number }[] };
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Claim - basic
  it("claim with no special clauses: regular sword (steel, ench 3), damage 500 → payout 400", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    }) as { results: { premium?: number; payout?: number; remainingCap?: number }[] };
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim for rune (no enchantment, no material), damage 200 → payout 100", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    }) as { results: { premium?: number; payout?: number; remainingCap?: number }[] };
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("claim for sword with enchantment 8 (dragon material), damage 1000 → payout 400 (50% rule, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    }) as { results: { premium?: number; payout?: number; remainingCap?: number }[] };
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim for dragon-material sword, enchantment 5, damage 800 → payout 700", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    }) as { results: { premium?: number; payout?: number; remainingCap?: number }[] };
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("claim for steel sword, enchantment 9, damage 1000 → payout 400", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    }) as { results: { premium?: number; payout?: number; remainingCap?: number }[] };
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim for dragon-material sword, enchantment 9, damage 1000 → payout 400 (50% wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    }) as { results: { premium?: number; payout?: number; remainingCap?: number }[] };
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Multiple damages per claim
  it("dragon attack damaging sword (500) and amulet (300) → payout 600 (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
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
    }) as { results: { premium?: number; payout?: number; remainingCap?: number }[] };
    // (500-100) + (300-100) = 600, cap=3200, remaining=2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Cap
  it("policy on a sword (cap 2000), two successive 1500-damage claims: first payout 1400, remainingCap 600; second payout 600, remainingCap 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    }) as { results: { premium?: number; payout?: number; remainingCap?: number }[] };
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Multiple same-type items
  it("policy with two swords; damages for both swords each get their own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
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
    }) as { results: { premium?: number; payout?: number; remainingCap?: number }[] };
    // (500-100) + (500-100) = 800, cap=4000, remaining=3200
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("claim with more damages of a type than insured items → CLI rejects (error)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
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
      }),
    ).toThrow();
  });

  // Payout rounding
  it("payout that yields 350.5 G rounds down to 350 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    }) as { results: { premium?: number; payout?: number; remainingCap?: number }[] };
    // 901 * 0.5 = 450.5 - 100 = 350.5 → 350 (rounded down)
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // Edge cases / errors
  it("quote with unknown item type → CLI exits non-zero, error to stderr", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim referencing damage for item not in policy → CLI exits non-zero", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with negative damage amount → CLI exits non-zero", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });
});
