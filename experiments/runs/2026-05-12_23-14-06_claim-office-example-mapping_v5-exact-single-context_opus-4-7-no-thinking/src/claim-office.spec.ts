import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Empty / processing fee
  it("empty item list quote yields premium of 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // Single-item base premiums
  it("quote for a single sword yields 115 G (100 base + 10 first insurance + 5 fee)", () => {
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
  it("quote for a single amulet yields 71 G (60 base + 6 first insurance + 5 fee)", () => {
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
  it("quote for a single staff yields 93 G (80 base + 8 first insurance + 5 fee)", () => {
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
  it("quote for a single potion yields 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "liquid", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Components
  it("quote for a single rune component yields 33 G (25 base + 2.5 first insurance + 5 fee, rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "component", componentType: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quote for 2 runes yields 60 G (50 base + 5 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "component", componentType: "rune" },
            { type: "component", componentType: "rune" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote for 3 runes applies block discount: yields 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "component", componentType: "rune" },
            { type: "component", componentType: "rune" },
            { type: "component", componentType: "rune" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote for 4 runes yields no block: 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "component", componentType: "rune" },
            { type: "component", componentType: "rune" },
            { type: "component", componentType: "rune" },
            { type: "component", componentType: "rune" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote for 3 runes + 3 moonstones yields two blocks: 137 G (120 base + 12 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "component", componentType: "rune" },
            { type: "component", componentType: "rune" },
            { type: "component", componentType: "rune" },
            { type: "component", componentType: "moonstone" },
            { type: "component", componentType: "moonstone" },
            { type: "component", componentType: "moonstone" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });
  it("quote for 2 runes + 1 moonstone yields no block: 88 G (75 base + 7.5 first insurance + 5 fee, rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "component", componentType: "rune" },
            { type: "component", componentType: "rune" },
            { type: "component", componentType: "moonstone" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });

  // Modifiers
  it("cursed sword for newcomer with 0 years yields 165 G (integration example)", () => {
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
  it("highly enchanted sword (enchantment 5) for newcomer yields 145 G (100 + 30 + 10 + 5 fee)", () => {
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
  it("long-standing customer (2 years) with plain sword: 20% loyalty discount applied", () => {
    // sword: base 100, first ins 10 → 110. Loyalty -20% on policy base 100 = -20.
    // 100 - 20 + 10 + 5 = 95
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
  it("follow-up contract (second quote) applies 15% discount on policy base", () => {
    // newcomer, two quote steps with same sword.
    // First quote: 100 + 10 + 5 = 115
    // Second quote: 100 + 10 - 15 + 5 = 100
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
  it("cursed sword + plain amulet for newcomer: cursed surcharge applies only to sword", () => {
    // policy base: 100 + 60 = 160; cursed sword surcharge: 50 (50% × 100, not 50% × 160)
    // first insurance: 16 (10% × 160); total: 160 + 50 + 16 + 5 = 231
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

  // Integration
  it("long-standing customer's second contract with cursed enchanted sword yields 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    // Step 2: 100 + 50 + 30 - 20 + 10 - 15 = 155 + 5 = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Rounding in MHPCO favor
  it("premium calculation yielding 197.5 G rounds up to 198 G", () => {
    // Construct a case yielding 197.5: need something with .5 fraction.
    // 1 rune: base 25, first ins 2.5 → 27.5 + fee 5 = 32.5 → rounds to 33 already passes.
    // 5 runes (no block): base 125, first ins 12.5 → 137.5 + 5 = 142.5 → 143
    // We want 197.5: 7 runes (no block): 7×25=175 base, 17.5 first ins, +5 = 197.5 → 198
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "component", componentType: "rune" },
            { type: "component", componentType: "rune" },
            { type: "component", componentType: "rune" },
            { type: "component", componentType: "rune" },
            { type: "component", componentType: "rune" },
            { type: "component", componentType: "rune" },
            { type: "component", componentType: "rune" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // Claim - basic
  it("claim for steel sword enchantment 3, damage 500 G: payout 400 G", () => {
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
    // sword cap = 2 × 1000 = 2000; payout = 500 - 100 = 400; remaining = 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim for rune (no enchantment, no material), damage 200 G: payout 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "component", componentType: "rune" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            damages: [{ itemType: "component:rune", amount: 200 }],
          },
        },
      ],
    });
    // rune insurance 250, cap 500, payout = 200 - 100 = 100, remaining 400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("claim for high-enchantment sword (enchantment 9), damage 1000 G: payout 400 G", () => {
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
          incident: { damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim for dragon-material sword (enchantment 5), damage 800 G: payout 700 G", () => {
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
          incident: { damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    // dragon full reimbursement, minus deductible: 800 - 100 = 700; remaining = 2000-700 = 1300
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("claim for dragon-material sword with enchantment 9: 50% rule wins, then deductible", () => {
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
          incident: { damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // 50% rule wins: 500 - 100 = 400
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim with multiple damages applies deductible per damage event", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    // sword 500-100 = 400; amulet 300-100 = 200; total 600; cap 3200; remaining 2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Claim - cap
  it("policy with sword has cap 2000 G; two 1500 G claims: first payout 1400, then 600", () => {
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
          incident: { damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("claim payout rounds down (350.5 → 350)", () => {
    // High-ench sword (enchantment 8), damage 901: raw payout 450.5, - 100 = 350.5 → floor 350
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
          incident: { damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // Errors
  it("quote with unknown item type rejects", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim referencing item not in policy rejects", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with negative amount rejects", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with more damaged items than insured rejects", () => {
    expect(() =>
      runScenario({
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
              damages: [
                { itemType: "sword", amount: 200 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
});
