import { describe, it, expect } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office — quote: base premiums", () => {
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("a sword → base premium 100 G (+10 G first insurance + 5 G fee = 115 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("an amulet → base premium 60 G (+6 G first insurance + 5 G fee = 71 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("a staff → base premium 80 G (+8 G first insurance + 5 G fee = 93 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("a potion → base premium 40 G (+4 G first insurance + 5 G fee = 49 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 49 }] });
  });
  it("runes are components at 25 G each → 2 runes = 50 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    // 2 × 25 G base = 50 G, +5 G first insurance, +5 G fee
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("moonstones are components at 25 G each → 2 moonstones = 50 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }, { type: "moonstone" }] }],
    });

    // 2 × 25 G base = 50 G, +5 G first insurance, +5 G fee
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
});

describe("MHPCO Claim Office — quote: building block of 3 alike components", () => {
  // "2 runes → 50 G" is covered by the component-price test above.
  it("3 runes → 60 G base premium (block applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });

    // block base 60 G, +6 G first insurance, +5 G fee
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });

    // 4 × 25 G = 100 G base, +10 G first insurance, +5 G fee
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });

    // 7 × 25 G = 175 G base (no block), +17.5 G first insurance, +5 G fee = 197.5 → 198
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
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

    // 3 × 25 G = 75 G base (no block — types differ), +7.5 G, +5 G fee = 87.5 → 88
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

    // two blocks of 60 G = 120 G base, +12 G first insurance, +5 G fee
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });
});

describe("MHPCO Claim Office — quote: premium modifiers", () => {
  it("cursed sword adds 50 G risk surcharge (50 % of the item's base premium)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment 5 adds 30 G high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });

    // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 gets no high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });

    // 100 G base + 10 G first insurance + 5 G fee — no surcharge below level 5
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5 gets both surcharges", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });

    // 100 G base + 50 G curse + 30 G high enchantment + 10 G first insurance + 5 G fee
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("customer with exactly 2 years with MHPCO gets the 20 % loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
      ],
    });

    // 100 G base − 20 G loyalty + 10 G first insurance + 5 G fee
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year with MHPCO gets no loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
      ],
    });

    // 100 G base + 10 G first insurance + 5 G fee — below the 2-year threshold
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("every item in a quote carries the 10 % first insurance surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
            { type: "staff", material: "oak", enchantment: 1, cursed: false },
          ],
        },
      ],
    });

    // First quote: 100 G base − 20 G loyalty + 10 G first insurance + 5 G fee = 95 G.
    // Second quote: 240 G base (100 + 60 + 80) − 48 G loyalty − 36 G follow-up
    // + 24 G first insurance (10 % of every item, not suppressed by the customer's
    // history) + 5 G fee = 185 G.
    expect(result).toEqual({ results: [{ premium: 95 }, { premium: 185 }] });
  });
  it("the customer's second quote gets the 15 % follow-up contract discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
      ],
    });

    // first quote: 100 G base + 10 G first insurance + 5 G fee = 115 G
    // second quote: 100 G base + 10 G first insurance − 15 G follow-up + 5 G fee = 100 G
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("a 5 G processing fee is added at the very end of every premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
      ],
    });

    // 100 G base − 20 G loyalty + 10 G first insurance = 90 G, then +5 G fee = 95 G.
    // The fee is not itself discounted: were it added before the loyalty discount,
    // the premium would be 105 × 0.9 + 10 = 104.5 → 105 G.
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
});

describe("MHPCO Claim Office — quote: modifier scope on multi-item policies", () => {
  it("cursed sword + plain amulet → policy base 160 G, curse adds 50 G (only the cursed item's base) → 210 G before further modifiers and fee", () => {
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

    // policy base 100 + 60 = 160 G; curse adds 50 G (50 % of the sword's own
    // base, not of the 160 G policy total) → 210 G, +16 G first insurance
    // (10 % of the 160 G policy base), +5 G fee = 231 G.
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });
  it("policy-wide modifiers (loyalty, follow-up) apply to the sum of all item base premiums", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion", material: "glass" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: true },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
        },
      ],
    });

    // first quote: 40 G base − 8 G loyalty + 4 G first insurance + 5 G fee = 41 G
    // second quote: policy base 160 G (sword 100 + amulet 60).
    // Loyalty −32 G, follow-up −24 G and first insurance +16 G are each a
    // percentage of that 160 G — not of one item's base, and not of the
    // curse-inflated 210 G. Curse adds 50 G on the sword alone.
    // 160 + 50 + 16 − 32 − 24 + 5 = 175 G
    expect(result).toEqual({ results: [{ premium: 41 }, { premium: 175 }] });
  });
});

describe("MHPCO Claim Office — quote: rounding in the MHPCO's favor", () => {
  it("a premium calculation that yields 197.5 G → final premium 198 G (rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });

    // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G exactly — a
    // half-gold amount, rounded up rather than to the nearest whole G.
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("intermediate amounts are kept as fractions; only the final premium is rounded", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion", material: "glass" }] },
        { op: "quote", items: Array.from({ length: 5 }, () => ({ type: "rune" })) },
      ],
    });

    // second quote: 125 G base, +12.5 G first insurance, −18.75 G follow-up,
    // +5 G fee = 123.75 G → 124 G. Both modifiers are fractional and neither
    // is rounded on its own: rounding 12.5 up to 13 and 18.75 up to 19 would
    // give 124 by luck, but truncating each toward zero would give 124 too —
    // so the discriminating error is rounding each up in the MHPCO's favour
    // (13 and 18), which yields 125 G.
    expect(result).toEqual({ results: [{ premium: 49 }, { premium: 124 }] });
  });
});

describe("MHPCO Claim Office — quote: integration examples", () => {
  it("newcomer (0 years, no previous contract) with a cursed steel sword enchantment 3 → premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee = 165 G.
    // No loyalty (0 years) and no follow-up (first contract); enchantment 3 is
    // below the level-5 threshold.
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer (3 years), second quote, cursed steel sword enchantment 7 → premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion", material: "glass" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    // second quote: 100 G base + 50 G curse + 30 G high enchantment
    // − 20 G loyalty + 10 G first insurance − 15 G follow-up = 155 G
    // + 5 G fee = 160 G. The first insurance surcharge still applies to the
    // new sword even though the customer is on a follow-up contract.
    expect(result).toEqual({ results: [{ premium: 41 }, { premium: 160 }] });
  });
});

describe("MHPCO Claim Office — claim: standard reimbursement", () => {
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

    // full reimbursement minus the 100 G deductible; no special clause applies.
    // Sword insurance sum 1000 G → cap 2000 G, of which 400 G is now used.
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("damage to a rune (no enchantment, no material), damage 200 G → payout 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "clumsiness", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });

    // full reimbursement minus the 100 G deductible: runes carry no enchantment
    // level and no material, so no special clause applies.
    // Rune insurance value 250 G → cap 500 G, of which 100 G is now used.
    expect(result).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("a dragon attack damaging a sword (500 G) and an amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
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
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });

    // (500 − 100) + (300 − 100) = 600 G: the deductible is charged per damage
    // entry, not once per incident. The cause is a dragon attack but neither
    // item is made of dragon material, so no full-reimbursement clause applies.
    // Insurance sum 1600 G → cap 3200 G, of which 600 G is now used.
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });
});

describe("MHPCO Claim Office — claim: special clauses", () => {
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
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
          incident: { cause: "rockfall", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });

    // Only the dragon-material clause applies (enchantment 5 is below the
    // level-8 claim threshold): full reimbursement, then the deductible.
    // 800 − 100 = 700 G. Cap 2000 G, of which 700 G is now used.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
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
          incident: { cause: "rockfall", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // Only the high-enchantment clause applies (steel is not dragon material):
    // 50 % of 1000 G = 500 G, then the deductible → 400 G.
    // Cap 2000 G, of which 400 G is now used.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (the 50 % rule wins)", () => {
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
          incident: { cause: "rockfall", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // Both clauses apply. The 50 % rule wins over full reimbursement:
    // 500 G, then the deductible → 400 G. Cap 2000 G, of which 400 G is used.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G", () => {
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
          incident: { cause: "rockfall", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // Level 8 is exactly the threshold, so the high-enchantment clause applies
    // and wins: 50 % of 1000 G = 500 G, then the deductible → 400 G.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("a payout calculation that yields 350.5 G → final payout 350 G (rounded down)", () => {
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
          incident: { cause: "rockfall", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });

    // 50 % of 901 G = 450.5 G, minus the deductible = 350.5 G — a half-gold
    // amount, rounded down rather than to the nearest whole G.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });
});

describe("MHPCO Claim Office — claim: insurance sum and cap", () => {
  it("a policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] },
        },
      ],
    });

    // insurance sum 1000 + 600 = 1600 G → cap 3200 G. The claim pays
    // 100 − 100 = 0 G, so the whole cap is still available.
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 0, remainingCap: 3200 }],
    });
  });
  it("a cursed sword → cap 2000 G (based on the unmodified insurance value)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });

    // The curse raises the premium to 165 G but not the cap: that is twice the
    // sword's unmodified 1000 G insurance value = 2000 G. Premium modifiers do
    // not enlarge the MHPCO's exposure.
    expect(result).toEqual({
      results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }],
    });
  });
  it("a policy covering a sword and 3 runes (a block) → insurance sum 1750 G, cap 3500 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
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

    // The block discount cuts the runes' base premium from 75 G to 60 G, but
    // leaves their insurance value alone: 1000 + 3 × 250 = 1750 G → cap 3500 G.
    // Premium: 160 G base + 16 G first insurance + 5 G fee = 181 G.
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 0, remainingCap: 3500 }],
    });
  });
  it("a policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });

    // Two of the same type count as two insured items: 2 × 1000 = 2000 G
    // → cap 4000 G. Premium: 200 G base + 20 G first insurance + 5 G fee.
    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 0, remainingCap: 4000 }],
    });
  });
  it("sword (cap 2000 G), two successive claims of 1500 G each → first payout 1400 G, remaining cap 600 G; second payout 600 G, remaining cap 0 G", () => {
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
        {
          op: "claim",
          policy: 0,
          incident: { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });

    // Cap 2000 G. First claim wants 1500 − 100 = 1400 G, which fits: 600 G left.
    // Second claim wants 1400 G again but only 600 G remains, so the payout is
    // reduced to 600 G and the cap is exhausted.
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });
});

describe("MHPCO Claim Office — claim: multiple items of the same type", () => {
  it("two insured swords both damaged → each damage entry gets its own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 700 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });

    // Premium: 200 G base + 20 G first insurance + 5 G fee = 225 G.
    // Payout: (700 − 100) + (500 − 100) = 1000 G — two damage entries, two
    // deductibles, not one deductible for the incident.
    // Insurance sum 2×1000 = 2000 G, cap 4000 G; 4000 − 1000 = 3000 G remaining.
    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 1000, remainingCap: 3000 }],
    });
  });
  it("more damage entries of a type than the policy insures → the claim is rejected", () => {
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
                { itemType: "sword", amount: 700 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      }),
      // Only one sword is insured, so the second sword damage entry has no item
      // behind it. The whole claim is rejected rather than paying the one sword twice.
    ).toThrow(/sword/);
  });
});

describe("MHPCO Claim Office — errors", () => {
  it("a quote with an unknown item type (e.g. broomstick) → error, no results", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 1, cursed: false },
              { type: "broomstick" },
            ],
          },
        ],
      }),
      // The MHPCO price list has no broomstick. The whole scenario is rejected —
      // no premium is quoted for the sword either.
    ).toThrow(/broomstick/);
  });
  it("a claim damaging an item that is not part of the policy (amulet when only a sword is insured) → error", () => {
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
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      }),
      // The amulet is a real MHPCO item type, but this policy does not cover one.
    ).toThrow(/amulet/);
  });
  it("a claim damaging an item with an unknown type → error", () => {
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
              cause: "fire",
              damages: [{ itemType: "broomstick", amount: 300 }],
            },
          },
        ],
      }),
      // A broomstick is not an MHPCO item type at all, so no policy can cover one.
    ).toThrow(/broomstick/);
  });
  it("a claim with a damage entry of amount -200 → error", () => {
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
      // Damage cannot be negative. Left unchecked this would pay out −300 G and
      // hand the customer 300 G of extra cap.
    ).toThrow(/-200/);
  });
});

describe("MHPCO Claim Office — CLI", () => {
  it("reads a scenario from stdin and writes {results: [...]} to stdout in step order", () => {
    // The spec's own schema example, run as a real subprocess so the stdin →
    // stdout contract is exercised rather than simulated.
    const scenario = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
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
    });

    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: scenario,
      encoding: "utf8",
    });

    // Quote: 60 G base − 12 G loyalty + 6 G first insurance + 5 G fee = 59 G.
    // Claim: 200 − 100 deductible = 100 G; cap 2 × 600 = 1200, so 1100 G remains.
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("exits with a non-zero status and writes an error description to stderr on an invalid scenario", () => {
    const scenario = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    const { status, stdout, stderr } = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: scenario,
      encoding: "utf8",
    });

    expect(status).not.toBe(0);
    // No results are written when the scenario is rejected.
    expect(stdout).toBe("");
    // A description the customer can act on — not a stack trace.
    expect(stderr).toContain("broomstick");
    expect(stderr).not.toMatch(/\bat /);
  });
});
