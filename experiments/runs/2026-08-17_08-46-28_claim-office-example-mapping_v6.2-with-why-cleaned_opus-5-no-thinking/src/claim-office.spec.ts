import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums: single main items (plus 5 G fee, 10 % first insurance) ---
  it("quotes an empty item list as 5 G (only the processing fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(results).toEqual([{ premium: 5 }]);
  });
  it("quotes a plain sword (base 100 G) as 115 G (100 + 10 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quotes a plain amulet (base 60 G) as 71 G (60 + 6 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      ],
    });

    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quotes a plain staff (base 80 G) as 93 G (80 + 8 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }] },
      ],
    });

    expect(results).toEqual([{ premium: 93 }]);
  });
  it("quotes a plain potion (base 40 G) as 49 G (40 + 4 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    expect(results).toEqual([{ premium: 49 }]);
  });

  // --- Components and the building block of 3 alike ---
  it("quotes 1 rune at base premium 25 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    // base 25 + 2.5 first insurance + 5 fee = 32.5 → 33 (rounded up)
    expect(results).toEqual([{ premium: 33 }]);
  });
  it("quotes 2 runes at base premium 50 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    // base 50 + 5 first insurance + 5 fee = 60
    expect(results).toEqual([{ premium: 60 }]);
  });
  it("quotes 3 runes at base premium 60 G (block applies)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });

    // block base 60 + 6 first insurance + 5 fee = 71
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quotes 4 runes at base premium 100 G (no block — block requires exactly 3)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });

    // base 100 + 10 first insurance + 5 fee = 115
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quotes 7 runes at base premium 175 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });

    // base 175 + 17.5 first insurance + 5 fee = 197.5 → 198 (rounded up)
    expect(results).toEqual([{ premium: 198 }]);
  });
  it("quotes 2 runes + 1 moonstone at base premium 75 G (no block: different types)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });

    // base 75 + 7.5 first insurance + 5 fee = 87.5 → 88 (rounded up)
    expect(results).toEqual([{ premium: 88 }]);
  });
  it("quotes 3 runes + 3 moonstones at base premium 120 G (two separate blocks)", () => {
    const results = runScenario({
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

    // two blocks: 60 + 60 = 120 + 12 first insurance + 5 fee = 137
    expect(results).toEqual([{ premium: 137 }]);
  });

  // --- Item-specific modifiers ---
  it("adds a 50 % curse surcharge to the cursed item's base premium", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      ],
    });

    // base 100 + 50 curse + 10 first insurance (10 % of base) + 5 fee = 165
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("adds a 30 % surcharge for a sword with exactly enchantment 5", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
      ],
    });

    // base 100 + 30 high enchantment + 10 first insurance + 5 fee = 145
    expect(results).toEqual([{ premium: 145 }]);
  });
  it("adds no high-enchantment surcharge for a sword with enchantment 4", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] },
      ],
    });

    // base 100 + 10 first insurance + 5 fee = 115 (no surcharge below enchantment 5)
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment 5", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] },
      ],
    });

    // base 100 + 50 curse + 30 high enchantment + 10 first insurance + 5 fee = 195
    expect(results).toEqual([{ premium: 195 }]);
  });

  // --- Policy-wide modifiers ---
  it("applies a 20 % loyalty discount for a customer with exactly 2 years with MHPCO", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });

    // base 100 − 20 loyalty + 10 first insurance + 5 fee = 95
    expect(results).toEqual([{ premium: 95 }]);
  });
  it("applies no loyalty discount for a customer with 1 year with MHPCO", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });

    // base 100 + 10 first insurance + 5 fee = 115 (no discount below 2 years)
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("applies a 10 % first insurance surcharge per item in a quote", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      ],
    });

    // every item is a first insurance: 10 + 6 = 16, i.e. 10 % of the 160 G policy base
    // 160 + 16 + 5 fee = 181
    expect(results).toEqual([{ premium: 181 }]);
  });
  it("applies a 15 % follow-up discount on the customer's second contract", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    // first contract: 100 + 10 + 5 = 115
    // second contract: 100 + 10 first insurance − 15 follow-up + 5 fee = 100
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("applies the first insurance surcharge on a follow-up contract too", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    // a brand-new sword on a long-standing customer's second contract is still a
    // first insurance: 100 − 20 loyalty + 10 first insurance − 15 follow-up = 75 + 5 fee = 80
    expect(results[1]).toEqual({ premium: 80 });
  });

  // --- Modifier scope on multi-item policies ---
  it("applies the curse surcharge only to the cursed item on a multi-item policy — cursed sword + plain amulet: base 160 G, +50 G curse", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });

    // policy base 160; curse adds 50 (50 % of the sword's 100, not of the 160 total) → 210
    // + 16 first insurance (10 % of 160) + 5 fee = 231
    expect(results).toEqual([{ premium: 231 }]);
  });

  // --- Rounding ---
  it("rounds a premium of 197.5 G up to 198 G (in the MHPCO's favor)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });

    // 175 base + 17.5 first insurance + 5 fee = 197.5 exactly, rounded up
    expect(results).toEqual([{ premium: 198 }]);
  });
  it("rounds a payout of 350.5 G down to 350 G (in the MHPCO's favor)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });

    // 50 % of 901 = 450.5, − 100 deductible = 350.5 exactly, rounded down
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Integration examples ---
  it("quotes a newcomer's cursed steel sword (enchantment 3) at 165 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      ],
    });

    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("quotes a 3-year customer's second contract for a cursed sword (enchantment 7) at 160 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });

    // second quote: 100 base + 50 curse + 30 high enchantment − 20 loyalty
    //               + 10 first insurance − 15 follow-up = 155 + 5 fee = 160
    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Claims: standard reimbursement ---
  it("pays 400 G for a regular sword (steel, enchantment 3) damaged 500 G (damage minus 100 G deductible)", () => {
    const results = runScenario({
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

    // 500 damage − 100 deductible = 400; cap 2000 − 400 = 1600 remaining
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for a rune damaged 200 G (no enchantment or material, so no special clause)", () => {
    const results = runScenario({
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

    // 200 damage − 100 deductible = 100; cap 500 (2 × 250) − 100 = 400 remaining
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claims: special clauses ---
  it("pays 400 G for a dragon-material sword with exactly enchantment 8 damaged 1000 G (50 % clause, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // enchantment 8 → 50 % of 1000 = 500, then − 100 deductible = 400
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for a dragon-material sword, enchantment 9, damaged 1000 G (50 % rule wins over full reimbursement)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // both clauses apply; the 50 % rule wins: 500 − 100 deductible = 400
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for a dragon-material sword, enchantment 5, damaged 800 G (full reimbursement, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });

    // only the dragon-material clause applies: full 800 − 100 deductible = 700
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for a steel sword, enchantment 9, damaged 1000 G (50 % clause, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // only the high-enchantment clause applies: 50 % of 1000 = 500, − 100 = 400
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Deductible per damage event ---
  it("pays 600 G when a dragon attack damages a sword (500 G) and an amulet (300 G) — 100 G deductible per damaged item", () => {
    const results = runScenario({
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

    // (500 − 100) + (300 − 100) = 600; cap 3200 (2 × 1600) − 600 = 2600
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Insurance sum and cap ---
  it("reports a remaining cap of 3200 G minus the payout for a policy covering a sword and an amulet (insurance sum 1600 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });

    // insurance sum 1000 + 600 = 1600 → cap 3200; payout 100, so 3100 remains
    expect(results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("caps a cursed sword policy at 2000 G based on the unmodified insurance value", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
        },
      ],
    });

    // premium is modified (165 G), but the cap stays 2 × 1000 = 2000
    expect(results[0]).toEqual({ premium: 165 });
    expect(results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });
  it("caps a policy covering a sword and 3 runes at 3500 G (insurance sum 1750 G — the block discount affects the premium only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });

    // premium base 100 + 60 (rune block) = 160 → ceil(160 + 16 + 5) = 181
    // insurance sum 1000 + 3 × 250 = 1750 (block discount does NOT reduce it) → cap 3500
    expect(results[0]).toEqual({ premium: 181 });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("caps two swords at 4000 G (insurance sum 2000 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 400 }] },
        },
      ],
    });

    // insurance sum 2 × 1000 = 2000 → cap 4000; payout 300 leaves 3700
    expect(results[1]).toEqual({ payout: 300, remainingCap: 3700 });
  });
  it("treats two sword damage entries as separate damages, each with its own deductible", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
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

    // each entry carries its own deductible: (500 − 100) + (300 − 100) = 600
    expect(results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("exhausts the cap across successive claims — sword (cap 2000 G), two claims of 1500 G: payout 1400 G (600 G left), then 600 G (0 G left)", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };

    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });

    // first: 1500 − 100 = 1400, cap 2000 − 1400 = 600 left
    // second: the desired 1400 is reduced to the 600 remaining
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Errors: non-zero exit and stderr ---
  it("rejects a quote containing an item with an unknown type (e.g. broomstick)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });
  it("rejects a claim whose damage references an item not covered by the policy (amulet damaged when only a sword is insured)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("rejects a claim whose damage references an unknown item type", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("rejects a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured)", () => {
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
  it("rejects a claim containing a damage entry with a negative amount", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/-200/);
  });

  // --- CLI ---
  it("returns one result per step, in order, for the schema example scenario", () => {
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

    const run = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    expect(run.status).toBe(0);
    // premium: base 60 − 12 loyalty + 6 first insurance = 54 + 5 fee = 59
    // payout: 200 − 100 = 100; cap 1200 (2 × 600) − 100 = 1100
    expect(JSON.parse(run.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("exits non-zero with a stderr description and no results on stdout for an unknown item type", () => {
    const run = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
      encoding: "utf8",
    });

    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/broomstick/);
    expect(run.stdout).toBe("");
  });
});
