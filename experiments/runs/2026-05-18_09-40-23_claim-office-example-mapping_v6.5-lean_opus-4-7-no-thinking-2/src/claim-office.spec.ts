import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote — base premiums for single items
  it("empty item list yields premium of 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
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
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("quote for a single plain amulet yields 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("quote for a single plain staff yields 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("quote for a single plain potion yields 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // Quote — components and building block
  it("quote for a single rune yields 33 G (25 base + 2.5 first ins + 5 fee, rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 33 });
  });
  it("quote for 2 runes yields 60 G (50 base + 5 first ins + 5 fee, no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("quote for 3 runes yields 71 G (60 block base + 6 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("quote for 4 runes yields 115 G (100 base + 10 first ins + 5 fee, no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("quote for 2 runes + 1 moonstone yields 88 G (75 base + 7.5 first ins + 5 fee, rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("quote for 3 runes + 3 moonstones yields 137 G (two blocks of 60 + 12 first ins + 5 fee)", () => {
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
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // Quote — premium modifiers (item-specific)
  it("cursed sword adds 50% surcharge on that item's base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 10 first ins + 5 fee = 165
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("highly enchanted item (enchantment ≥ 5) adds 30% surcharge on its base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: false }],
        },
      ],
    });
    // 100 base + 30 surcharge + 10 first ins + 5 fee = 145
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("sword with enchantment exactly 5 triggers high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("sword with enchantment 4 does not trigger high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("cursed and highly enchanted item gets both surcharges", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 30 enchant + 10 first ins + 5 fee = 195
    expect(result.results[0]).toEqual({ premium: 195 });
  });

  // Quote — premium modifiers (policy-wide)
  it("long-standing customer (≥ 2 years) receives 20% loyalty discount on policy base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 100 base + 10 first ins - 20 loyalty + 5 fee = 95
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("customer with exactly 2 years gets loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 100 base + 10 first ins - 20 loyalty + 5 fee = 95
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("first insurance adds 10% surcharge per item", () => {
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
    // 100 + 60 base + 10 + 6 first insurance + 5 fee = 181
    expect(result.results[0]).toEqual({ premium: 181 });
  });
  it("follow-up contract (after first) gets 15% discount on policy base premium", () => {
    const sword = { type: "sword", material: "steel", enchantment: 0, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });
    // second quote: 100 base - 15 follow-up + 10 first ins + 5 fee = 100
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  // Quote — rounding
  it("premium rounds up to whole G in MHPCO's favor", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    // 25 base + 2.5 first ins + 5 fee = 32.5 → 33 (rounded up)
    expect(result.results[0]).toEqual({ premium: 33 });
  });

  // Integration — newcomer with cursed sword: 165 G
  it("newcomer with cursed sword yields 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 10 first ins + 5 fee = 165
    expect(result.results[0]).toEqual({ premium: 165 });
  });

  // Integration — long-standing customer's second contract: 160 G
  it("long-standing customer second contract with cursed enchanted sword yields 160 G", () => {
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
    // second quote: 100 base + 50 curse + 30 enchant - 20 loyalty + 10 first ins - 15 follow-up + 5 fee = 160
    // Wait: customer is 3 years (not newcomer), so first insurance shouldn't apply per current impl.
    // But integration says first insurance applies per item regardless of customer.
    // Per current implementation: 100 - 20 - 15 + 50 + 30 + 5 = 150, rounded 150. Will fail.
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Claim — basic
  it("standard sword claim of 500 G yields payout 400 G (full minus 100 deductible)", () => {
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
          incident: { damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage of 200 G yields payout 100 G (full minus 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("payout rounds down in MHPCO's favor", () => {
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
          incident: { damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    // 901 * 0.5 - 100 = 350.5 → 350 (rounded down). Cap 2000 - 350 = 1650.
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // Claim — special clauses
  it("high enchantment (≥ 8) reimburses 50% of damage, then deductible", () => {
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
    // 50% of 1000 = 500, minus 100 deductible = 400; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon material item is fully reimbursed", () => {
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
    // dragon, enchantment 5 (not high): fully reimbursed minus deductible = 800 - 100 = 700
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon material with high enchantment: 50% rule wins, then deductible", () => {
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
    // 50% rule wins: 1000 * 0.5 - 100 = 400; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Claim — multiple damages
  it("multiple damages each get their own deductible", () => {
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
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    // (500-100) + (300-100) = 600. Cap = (1000+600)*2 = 3200, remaining 2600.
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Claim — cap
  it("payout capped at twice the insurance sum", () => {
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
          incident: { damages: [{ itemType: "sword", amount: 5000 }] },
        },
      ],
    });
    // raw payout 5000-100=4900, but cap 2*1000=2000, so payout 2000, remaining 0
    expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("successive claims exhaust remaining cap", () => {
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
          incident: { damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    // cap 2000; first claim: payout 1400, remaining 600. Second: payout limited to 600, remaining 0.
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Multi-item policy
  it("policy with cursed sword and plain amulet yields 231 G", () => {
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
    // base 160 + curse 50 + first ins 16 + fee 5 = 231
    expect(result.results[0]).toEqual({ premium: 231 });
  });
  it("policy with two swords has insurance sum 2000 G, cap 4000 G", () => {
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
          incident: { damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    // insurance sum 2000, cap 4000, payout 500-100=400, remaining 3600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3600 });
  });

  // Errors
  it("unknown item type throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim with item not in policy throws", () => {
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
            incident: { damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with negative damage amount throws", () => {
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
            incident: { damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("more damage entries of a type than insured items throws", () => {
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
});
