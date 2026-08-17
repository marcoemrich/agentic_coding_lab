import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: simplest cases ---
  it("charges only the 5 G processing fee for an empty item list — premium 5 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(result.results).toEqual([{ premium: 5 }]);
  });
  it("quotes a plain sword for a new customer — 100 G base + 10 G first insurance + 5 G fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("quotes a plain amulet for a new customer — 60 G base + 6 G first insurance + 5 G fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });

    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("quotes a plain staff for a new customer — 80 G base + 8 G first insurance + 5 G fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }],
        },
      ],
    });

    expect(result.results).toEqual([{ premium: 93 }]);
  });
  it("quotes a plain potion for a new customer — 40 G base + 4 G first insurance + 5 G fee = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    expect(result.results).toEqual([{ premium: 49 }]);
  });

  // --- Components and the building block of 3 alike ---
  it("charges 25 G base per component — 2 runes → 50 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    // 50 G base + 5 G first insurance + 5 G fee
    expect(result.results).toEqual([{ premium: 60 }]);
  });
  it("applies the block price to exactly 3 alike components — 3 runes → 60 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });

    // 60 G block base + 6 G first insurance + 5 G fee
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("does not apply the block to 4 runes — 4 runes → 100 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });

    // 100 G base + 10 G first insurance + 5 G fee
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("charges 7 runes per component — no block, since a block requires exactly 3 → 175 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });

    // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 → 198 G
    expect(result.results).toEqual([{ premium: 198 }]);
  });
  it("treats only identical types as alike — 2 runes + 1 moonstone → 75 G base premium (no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });

    // 75 G base + 7.5 G first insurance + 5 G fee = 87.5 → 88 G
    expect(result.results).toEqual([{ premium: 88 }]);
  });
  it("forms a separate block per component type — 3 runes + 3 moonstones → 120 G base premium", () => {
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

    // 120 G base (two blocks) + 12 G first insurance + 5 G fee
    expect(result.results).toEqual([{ premium: 137 }]);
  });

  it("restricts the block price to components — 3 swords → 300 G base premium, not 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 3 }, () => ({ type: "sword" })) },
      ],
    });

    // 300 G base + 30 G first insurance + 5 G fee
    expect(result.results).toEqual([{ premium: 335 }]);
  });

  // --- Item-specific modifiers ---
  it("adds a 50 % curse surcharge to the cursed item's base premium — cursed sword → 150 G base", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    // 100 G base + 50 G curse + 10 G first insurance + 5 G fee
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("adds a 30 % surcharge at enchantment exactly 5 — sword enchantment 5 → 130 G base", () => {
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
    expect(result.results).toEqual([{ premium: 145 }]);
  });
  it("adds no high-enchantment surcharge at enchantment 4 — sword enchantment 4 → 100 G base", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });

    // 100 G base + 10 G first insurance + 5 G fee — no surcharge below 5
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("stacks curse and high enchantment on the same item — cursed sword enchantment 5 → 180 G base", () => {
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
    expect(result.results).toEqual([{ premium: 195 }]);
  });
  it("applies the curse surcharge only to the cursed item, not the policy total — cursed sword + plain amulet → 210 G before policy modifiers and fee", () => {
    const result = runScenario({
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

    // 160 G policy base + 50 G curse (50 % of the sword's 100 G, not of 160 G)
    // + 16 G first insurance + 5 G fee
    expect(result.results).toEqual([{ premium: 231 }]);
  });

  // --- Policy-wide modifiers ---
  it("grants the 20 % loyalty discount at exactly 2 years with MHPCO", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    // 100 G base − 20 G loyalty + 10 G first insurance + 5 G fee
    expect(result.results).toEqual([{ premium: 95 }]);
  });
  it("grants no loyalty discount at 1 year with MHPCO", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    // 100 G base + 10 G first insurance + 5 G fee — no discount below 2 years
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("applies the 15 % follow-up discount to the customer's second quote but not the first", () => {
    const plainSword = {
      op: "quote" as const,
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [plainSword, plainSword],
    });

    expect(result.results).toEqual([
      // 100 G base + 10 G first insurance + 5 G fee
      { premium: 115 },
      // 100 G base − 15 G follow-up + 10 G first insurance + 5 G fee
      { premium: 100 },
    ]);
  });

  // --- Rounding ---

  // --- Integration examples ---
  it("quotes a long-standing customer's second contract with a cursed sword enchantment 7 — 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    expect(result.results).toEqual([
      // 100 G base − 20 G loyalty + 10 G first insurance + 5 G fee
      { premium: 95 },
      // 100 base + 50 curse + 30 high enchantment − 20 loyalty
      // + 10 first insurance − 15 follow-up = 155 G + 5 G fee
      { premium: 160 },
    ]);
  });

  // --- Claims: standard reimbursement ---
  it("reimburses damage in full minus a 100 G deductible — steel sword enchantment 3, damage 500 G → payout 400 G", () => {
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

    expect(result.results).toEqual([
      { premium: 115 },
      // 500 G damage − 100 G deductible; cap 2000 G − 400 G paid out
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("reimburses component damage minus the deductible — rune damage 200 G → payout 100 G", () => {
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

    // No enchantment and no material, so no special clause; cap 500 G − 100 G
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies the 100 G deductible once per damaged item — sword 500 G + amulet 300 G → payout 600 G", () => {
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

    expect(result.results).toEqual([
      { premium: 181 },
      // (500 − 100) + (300 − 100); cap 3200 G − 600 G
      { payout: 600, remainingCap: 2600 },
    ]);
  });

  // --- Claims: special clauses ---
  it("reimburses damage to items with enchantment ≥ 8 at 50 % — steel sword enchantment 9, damage 1000 G → payout 400 G", () => {
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

    // 50 % of 1000 = 500, then the 100 G deductible; cap 2000 G − 400 G
    expect((result.results as { payout: number }[])[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("reimburses dragon-material damage in full — dragon sword enchantment 5, damage 800 G → payout 700 G", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });

    // Full reimbursement, then the 100 G deductible; cap 2000 G − 700 G
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("lets the 50 % rule win when both clauses apply — dragon sword enchantment 9, damage 1000 G → payout 400 G", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // 50 % of 1000 = 500, then the deductible — the dragon clause does not win
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies the 50 % clause at exactly enchantment 8 — dragon sword enchantment 8, damage 1000 G → payout 400 G", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claims: cap ---
  it("caps successive claims at twice the insurance sum — sword, two 1500 G claims → 1400 G then 600 G, remainingCap 0", () => {
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
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        claimOf1500,
        claimOf1500,
      ],
    });

    expect(result.results.slice(1)).toEqual([
      // 1500 − 100 = 1400, well inside the 2000 G cap
      { payout: 1400, remainingCap: 600 },
      // the desired 1400 is reduced to the 600 G still available
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("excludes the block discount from the insurance sum — sword + 3 runes → insurance sum 1750 G, cap 3500 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ...Array.from({ length: 3 }, () => ({ type: "rune" })),
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    expect(result.results).toEqual([
      // 100 G sword + 60 G rune block = 160 G base + 16 G first insurance + 5 G fee
      { premium: 181 },
      // cap 3500 G (= 2 × (1000 + 3×250)) − 400 G payout
      { payout: 400, remainingCap: 3100 },
    ]);
  });

  // --- Multiple items of the same type ---
  it("treats each damage entry of the same type as a separate damage with its own deductible", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });

    expect(result.results).toEqual([
      // 200 G base + 20 G first insurance + 5 G fee
      { premium: 225 },
      // (500 − 100) twice; cap 4000 G − 800 G
      { payout: 800, remainingCap: 3200 },
    ]);
  });

  // --- Payout rounding ---
  it("rounds a payout down in the MHPCO's favor — 350.5 G → 350 G", () => {
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

    // 50 % of 901 = 450.5, less the 100 G deductible = 350.5 → rounded down
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Errors ---
  it("rejects a quote containing an item with an unknown type", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });
  it("rejects a claim whose damaged item is not part of the policy", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("rejects a claim with more damage entries of a type than the policy covers", () => {
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
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });
  it("rejects a claim with a negative damage amount", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/-200/);
  });

});
