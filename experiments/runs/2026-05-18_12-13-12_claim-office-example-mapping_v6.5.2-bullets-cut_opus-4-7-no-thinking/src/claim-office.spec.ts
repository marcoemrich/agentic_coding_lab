import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote: base premiums and processing fee
  it("empty item list yields premium of 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results).toEqual([{ premium: 5 }]);
  });
  it("quote for a single plain sword yields 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("quote for a single plain amulet yields 71 G (60 + 6 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("quote for sword + amulet yields 181 G (110 + 66 + 5)", () => {
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
      ],
    });
    expect(result.results).toEqual([{ premium: 181 }]);
  });

  // Components
  it("quote for 2 runes yields 60 G (50 base + 5 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 60 }]);
  });
  it("quote for 3 runes yields 71 G (60 G block + 6 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("quote for 4 runes yields 115 G (100 base, no block + 10 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("quote for 3 runes + 3 moonstones yields 137 G (two blocks 120 + 12 first ins + 5 fee)", () => {
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
    expect(result.results).toEqual([{ premium: 137 }]);
  });

  // Premium modifiers (item-specific)
  it("cursed sword adds 50% surcharge (newcomer cursed sword = 165 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("high enchantment (≥5) adds 30% surcharge to the affected item", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 145 }]);
  });

  // Premium modifiers (policy-wide)
  it("long-standing customer (≥2 years) gets 20% loyalty discount on policy base", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 100 base - 20 loyalty + 10 first insurance + 5 fee = 95
    expect(result.results).toEqual([{ premium: 95 }]);
  });
  it("follow-up contract gets 15% discount on policy base", () => {
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
    // First: 115 G (100 base + 10 first ins + 5 fee)
    // Second: 100 G (100 base - 15 follow-up + 10 first ins + 5 fee)
    expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("first insurance adds 10% surcharge per item", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "staff", material: "oak", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // sword: 100 + 10 = 110; staff: 100 + 10 = 110 (unknown type defaults to 100); + 5 fee = 225
    expect(result.results).toEqual([{ premium: 225 }]);
  });

  // Rounding
  it("premium is rounded up to whole G (MHPCO's favor)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune", enchantment: 5, cursed: true }],
        },
      ],
    });
    // 25 base + 12.5 curse + 7.5 high-ench + 2.5 first-ins = 47.5 + 5 fee = 52.5 → 53
    expect(result.results).toEqual([{ premium: 53 }]);
  });

  // Claim: standard reimbursement
  it("claim with damage on plain sword reimburses full minus 100 G deductible", () => {
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
    // 500 damage - 100 deductible = 400 payout; cap 2000 - 400 = 1600 remaining
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("remainingCap reflects payout deducted from 2x insurance sum", () => {
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // cap = 2 × (1000 + 600) = 3200; payout 400 → remainingCap 2800
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 2800 });
  });

  // Claim: special clauses
  it("damage on enchantment ≥8 item is reimbursed at 50% then deductible", () => {
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    // 50% of 1000 = 500; 500 - 100 deductible = 400 payout; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage on dragon material item is fully reimbursed (deductible only)", () => {
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    // full reimbursement: 800 - 100 deductible = 700; cap 2000 - 700 = 1300
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon material + enchantment ≥8: 50% rule wins, then deductible", () => {
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    // 50% × 1000 = 500; 500 - 100 = 400 payout; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Claim: multiple damages
  it("multiple damage entries each apply their own deductible", () => {
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
            cause: "dragon-attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    // (500-100) + (300-100) = 400 + 200 = 600; cap 3200 - 600 = 2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Claim: cap
  it("cap is exhausted across successive claims", () => {
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
    // First: 1500-100 = 1400, cap 2000-1400 = 600
    // Second: desired 1400, but limited to remaining cap 600 → payout 600, cap 0
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Claim: rounding
  it("payout is rounded down to whole G (MHPCO's favor)", () => {
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 701 }],
          },
        },
      ],
    });
    // 50% × 701 = 350.5; 350.5 - 100 = 250.5 → 250
    expect(result.results[1]).toEqual({ payout: 250, remainingCap: 1750 });
  });

  // Validation / errors
  it("unknown item type in quote throws an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "broomstick" }],
          },
        ],
      }),
    ).toThrow(/unknown item type/i);
  });
  it("claim damage for item not in policy throws an error", () => {
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
    ).toThrow(/not insured|not in policy/i);
  });
  it("negative damage amount throws an error", () => {
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
    ).toThrow(/negative damage/i);
  });
});
