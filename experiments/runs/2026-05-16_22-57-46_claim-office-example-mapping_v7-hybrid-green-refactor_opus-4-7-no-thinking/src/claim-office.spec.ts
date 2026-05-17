import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote — base premiums per item type
  it("empty item list yields premium of 5 G (just the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("a single plain sword quote yields 115 G (100 base + 10 first insurance + 5 fee)", () => {
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
  it("a single plain amulet quote yields 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("a single plain staff quote yields 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("a single plain potion quote yields 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Components
  it("a single rune yields 33 G (25 base + 3 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("three alike runes form a block at 60 G base (60 + 6 first insurance + 5 fee = 71 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("three runes and three moonstones form two blocks: 120 G base (132 + 5 fee with surcharge = 137 G)", () => {
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
    // 120 base × 1.10 = 132, + 5 fee = 137
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // Item-specific surcharges
  it("a cursed sword adds 50% curse surcharge to its base premium (165 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 10 first insurance + 5 fee = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("a sword with enchantment level 5 adds 30% high-enchantment surcharge (145 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    // 100 base + 30 high-enchantment + 10 first insurance + 5 fee = 145
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });

  // Policy-wide modifiers
  it("a 2-year customer receives a 20% loyalty discount on policy base", () => {
    // 100 base, 2 year loyal (20% off base = -20), +10% first insurance = 90, +5 fee = 95
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("a follow-up contract gets a 15% discount on policy base", () => {
    // Two quotes: first is 115, second is 100 + 10 first-insurance - 15 follow-up + 5 fee = 100
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // Multi-item modifier scope
  it("cursed surcharge applies only to the cursed item, not the policy total", () => {
    // Cursed sword (100) + plain amulet (60) → policy base 160
    // Cursed: +50 (50% of sword base, not policy)
    // First insurance: +16 (10% of 160 policy base)
    // Fee: +5
    // Total: 160 + 50 + 16 + 5 = 231
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
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // Rounding
  it("premium rounds up in MHPCO's favor (intermediate fractions, final rounded)", () => {
    // Plain amulet base 60, 2-year loyalty (-20% = -12 = 48), +10% first insurance (+6 = 54), +5 fee = 59
    // Actually, integer math. Need fractional intermediates. Try: cursed amulet for 0 year:
    // base 60 + curse 30 + first-insurance 6 + 5 = 101. Whole numbers, won't trigger rounding.
    // Try: cursed staff for 2-year: base 80 + curse 40 + first-insurance 8 - loyalty 16 + 5 = 117. Whole again.
    // Need an item base that's odd, with a percent that produces fractions:
    // single rune (25) → first-insurance 2.5 → ceil 3 ✓ (already in test for single rune)
    // Two-year customer with sword: 100 + 10 - 20 + 5 = 95 (no fraction)
    // Cursed cursed-block: 3 cursed runes → block 60, curse on each: 12.5*3=37.5, first-insurance 6, fee 5
    // Total: 60 + 37.5 + 6 + 5 = 108.5 → ceil 109
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", cursed: true },
            { type: "rune", cursed: true },
            { type: "rune", cursed: true },
          ],
        },
      ],
    });
    // 3 cursed runes: base 60 (block), curse 0.5 * 25 = 12.5 each, total curse 37.5
    // first insurance 10% of 60 = 6, fee 5
    // 60 + 37.5 + 6 + 5 = 108.5 → ceil to 109
    expect(result).toEqual({ results: [{ premium: 109 }] });
  });

  // Integration examples
  it("long-standing customer's second contract with cursed enchantment-7 sword yields 160 G", () => {
    // 100 base + 50 curse + 30 high-enchant - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee = 160
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: expect.any(Number) }, { premium: 160 }],
    });
  });

  // Claim — base behaviors
  it("standard sword damage of 500 G yields payout 400 G (after 100 G deductible)", () => {
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: expect.any(Number) }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it.todo("damage to a rune (250 G insurance) with damage 200 G yields payout 100 G");
  it("damage to an item with enchantment ≥ 8 is reimbursed at 50% then deductible", () => {
    // Steel sword, enchantment 9, damage 1000 → 50%*1000 = 500 − 100 = 400 payout
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
          incident: {
            cause: "wear",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: expect.any(Number) }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon material + high enchantment: 50% rule wins, then deductible", () => {
    // Dragon-material sword, enchantment 9, damage 1000 → 50%*1000=500 − 100 = 400
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
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: expect.any(Number) }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("deductible applies once per damage entry on multi-item incidents", () => {
    // Sword (500 damage) and amulet (300 damage) — each gets its own deductible
    // sword: 500-100=400; amulet: 300-100=200; total 600
    // insurance sum = 1000 + 600 = 1600, cap = 3200; remaining = 3200-600 = 2600
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
    });
    expect(result).toEqual({
      results: [{ premium: expect.any(Number) }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // Cap
  it("payout is capped at twice the unmodified insurance sum across claims", () => {
    // Sword (insurance 1000, cap 2000); two claims of 1500 each
    // Claim 1: 1500-100=1400 ≤ cap 2000 → payout 1400, remaining 600
    // Claim 2: 1500-100=1400, but only 600 remains → payout 600, remaining 0
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: expect.any(Number) },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // Multiple items of same type
  it("two swords on a policy double the insurance sum (cap = 4000)", () => {
    // Two swords → insurance sum 2000, cap 4000
    // Dragon damages both: 1000 each, but only damage one entry to test cap.
    // Claim with single 3500 damage on sword: 3500-100=3400 ≤ 4000, payout 3400, remaining 600
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 3500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: expect.any(Number) },
        { payout: 3400, remainingCap: 600 },
      ],
    });
  });

  // Error handling
  it("quote with unknown item type rejects the scenario (throws)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim with damage on item not in policy rejects the scenario (throws)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with negative damage amount rejects the scenario (throws)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
});
