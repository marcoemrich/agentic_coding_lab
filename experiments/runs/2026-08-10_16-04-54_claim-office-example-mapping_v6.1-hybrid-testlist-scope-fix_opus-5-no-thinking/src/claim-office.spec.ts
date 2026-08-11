import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office — quote: base premiums", () => {
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(results).toEqual([{ premium: 5 }]);
  });
  it("a sword → base premium 100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 G base + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("an amulet → base premium 60 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });

    // 60 G base + 6 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("a staff → base premium 80 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });

    // 80 G base + 8 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 93 }]);
  });
  it("a potion → base premium 40 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    // 40 G base + 4 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 49 }]);
  });
  it("a single rune (component) → base premium 25 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    // 25 G base + 2.5 G first insurance + 5 G fee = 32.5 → rounded up
    expect(results).toEqual([{ premium: 33 }]);
  });
  it("a single moonstone (component) → base premium 25 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });

    // 25 G base + 2.5 G first insurance + 5 G fee = 32.5 → rounded up
    expect(results).toEqual([{ premium: 33 }]);
  });
});

describe("MHPCO Claim Office — quote: component blocks of 3 alike", () => {
  it("2 runes → 50 G base premium (no block)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    // 50 G base + 5 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 60 }]);
  });
  it("3 runes → 60 G base premium (block applies)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });

    // 60 G block base + 6 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    const results = runScenario({
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

    // 100 G base + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("7 runes → 175 G base premium", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array(7).fill({ type: "rune" }) },
      ],
    });

    // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 → rounded up
    expect(results).toEqual([{ premium: 198 }]);
  });
  it("3 swords → 300 G base premium (blocks are a component offering; main items do not form blocks)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(3).fill({ type: "sword" }) }],
    });

    // 300 G base + 30 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 335 }]);
  });
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });

    // 75 G base + 7.5 G first insurance + 5 G fee = 87.5 → rounded up
    expect(results).toEqual([{ premium: 88 }]);
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            ...Array(3).fill({ type: "rune" }),
            ...Array(3).fill({ type: "moonstone" }),
          ],
        },
      ],
    });

    // 120 G base (two blocks) + 12 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 137 }]);
  });
});

describe("MHPCO Claim Office — quote: premium modifiers", () => {
  it("a cursed sword adds a 50 % risk surcharge on the item's base premium", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });

    // 100 G base + 50 G curse + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("a sword with enchantment 5 adds a 30 % high-enchantment surcharge", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5 }],
        },
      ],
    });

    // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 145 }]);
  });
  it("a sword with enchantment 4 → no high-enchantment surcharge", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4 }],
        },
      ],
    });

    // 100 G base + 10 G first insurance + 5 G fee (no surcharge)
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("a cursed sword with enchantment 5 → both surcharges apply", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
          ],
        },
      ],
    });

    // 100 G base + 50 G curse + 30 G high enchantment + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 195 }]);
  });
  it("a customer with exactly 2 years with MHPCO → 20 % loyalty discount applies", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 G base − 20 G loyalty + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 95 }]);
  });
  it("a customer with 1 year with MHPCO → no loyalty discount", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 G base + 10 G first insurance + 5 G fee (no loyalty discount)
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("the second quote in a scenario receives a 15 % follow-up contract discount", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    expect(results).toEqual([
      // 100 G base + 10 G first insurance + 5 G fee
      { premium: 115 },
      // 100 G base + 10 G first insurance − 15 G follow-up + 5 G fee
      { premium: 100 },
    ]);
  });
  // "a 5 G processing fee is added at the very end of every premium" is asserted by
  // every premium expectation in this file; no separate test adds coverage.
});

describe("MHPCO Claim Office — quote: modifier scope on multi-item policies", () => {
  it("cursed sword + plain amulet → item surcharge is 50 G (50 % of the cursed item only), 210 G before policy modifiers and fee", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet" },
          ],
        },
      ],
    });

    // policy base 160 G (100 + 60) + 50 G curse (50 % of the SWORD only) = 210 G,
    // + 16 G first insurance (10 % of the 160 G policy base) + 5 G fee
    expect(results).toEqual([{ premium: 231 }]);
  });
});

// Premium rounding is covered above: "7 runes" yields 197.5 G → 198 G (rounded up),
// and the single-rune/moonstone tests (32.5 G → 33 G) pin that intermediate amounts
// stay fractional until the final rounding.

describe("MHPCO Claim Office — quote: integration examples", () => {
  // The spec's first integration example (newcomer, cursed steel sword enchantment 3
  // → 165 G) is asserted by "a cursed sword adds a 50 % risk surcharge" above.
  it("long-standing customer (3 years), second quote, cursed steel sword enchantment 7 → premium 160 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });

    // 100 G base + 50 G curse + 30 G high enchantment − 20 G loyalty
    // + 10 G first insurance − 15 G follow-up = 155 G + 5 G fee
    expect(results[1]).toEqual({ premium: 160 });
  });
});

describe("MHPCO Claim Office — claim: standard reimbursement", () => {
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
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

    // full reimbursement minus the 100 G deductible; cap 2000 G − 400 G paid
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (no enchantment or material), damage 200 G → payout 100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });

    // runes have no enchantment level or material, so no special clause applies;
    // cap 500 G (2 × 250) − 100 G paid
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
});

describe("MHPCO Claim Office — claim: special clauses", () => {
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });

    // only the dragon-material clause applies: full reimbursement, then deductible
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
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

    // only the high-enchantment clause applies: 50 % first, then deductible
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (the 50 % rule wins)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    // both clauses apply; the 50 % rule wins, then deductible: 500 − 100
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    // the high-enchantment clause applies at exactly 8, then the deductible
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe("MHPCO Claim Office — claim: deductible per damage event", () => {
  it("dragon attack damaging an insured sword (500 G) and an insured amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "amulet" }],
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

    // (500 − 100) + (300 − 100); cap 3200 G (2 × 1600) − 600 G paid
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
});

describe("MHPCO Claim Office — claim: rounding in the MHPCO's favor", () => {
  it("a payout calculation yielding 350.5 G → final payout 350 G (rounded down)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });

    // 50 % of 901 = 450.5, minus the 100 G deductible = 350.5 → rounded down
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe("MHPCO Claim Office — claim: insurance sum and cap", () => {
  // "a sword and an amulet → insurance sum 1600 G, cap 3200 G" is asserted by the
  // deductible-per-damage-event test above, which claims against exactly that policy.

  it("a cursed sword (premium with modifiers 165 G) → cap 2000 G (premium modifiers do not raise the cap)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });

    // the premium carries modifiers (165 G), but the cap is 2 × the unmodified
    // insurance value: 2000 G, of which this claim consumes nothing (100 − 100)
    expect(results[0]).toEqual({ premium: 165 });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });

  it("a policy covering a sword and 3 runes (a block) → insurance sum 1750 G, cap 3500 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, ...Array(3).fill({ type: "rune" })],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });

    // the block discount affects the premium only, not the insurance sum:
    // 1000 + 3 × 250 = 1750 G, cap 3500 G
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("sword insured (cap 2000 G), two successive claims of 1500 G exhaust the cap", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
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
            cause: "flood",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });

    // first claim: 1500 − 100 = 1400 paid, 2000 − 1400 = 600 cap left
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    // second claim: the desired 1400 G is reduced to the remaining cap
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe("MHPCO Claim Office — multiple items of the same type", () => {
  it("two swords → insurance sum 2000 G, cap 4000 G; a dragon attack damaging both applies a deductible per entry", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array(2).fill({ type: "sword" }) },
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

    // each entry is a separate damage with its own deductible:
    // (500 − 100) + (300 − 100) = 600; cap 4000 G (2 × 2000) − 600 G
    expect(results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("more damage entries of a type than the policy covers → error (whole claim rejected)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
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
      }),
    ).toThrow(/sword/);
  });
});

describe("MHPCO Claim Office — error cases", () => {
  it("quote includes an item with an unknown type (e.g. broomstick) → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });
  const swordPolicyThenClaim = (damages: { itemType: string; amount: number }[]) => ({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote" as const, items: [{ type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages } },
    ],
  });

  it("claim references a damage entry whose item is not part of the policy → error", () => {
    expect(() =>
      runScenario(swordPolicyThenClaim([{ itemType: "amulet", amount: 200 }])),
    ).toThrow(/amulet/);
  });

  it("claim references a damage entry with an unknown item type → error", () => {
    expect(() =>
      runScenario(swordPolicyThenClaim([{ itemType: "broomstick", amount: 200 }])),
    ).toThrow(/broomstick/);
  });

  it("claim references a policy step that does not exist → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 5,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow(/policy/i);
  });

  it("claim contains a damage entry with amount -200 → error", () => {
    expect(() =>
      runScenario(swordPolicyThenClaim([{ itemType: "sword", amount: -200 }])),
    ).toThrow(/-200|negative/);
  });
});

// The CLI is covered by src/cli.spec.ts, which drives the real executable.
