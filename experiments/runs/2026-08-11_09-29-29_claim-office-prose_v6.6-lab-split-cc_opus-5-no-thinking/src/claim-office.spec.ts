import { describe, it, expect } from "vitest";
import { run, type Scenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quoting: base price list (new customer, first contract: +10 %, +5 G fee) ---
  it("quotes a sword for a brand-new customer — 100 * 1.1 + 5 = 115 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes an amulet for a brand-new customer — 60 * 1.1 + 5 = 71 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a staff for a brand-new customer — 80 * 1.1 + 5 = 93 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "oak", enchantment: 1, cursed: false },
          ],
        },
      ],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a potion for a brand-new customer — 40 * 1.1 + 5 = 49 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 49 }] });
  });
  it("quotes a single rune component — 25 * 1.1 + 5 = 33 G (rounded up from 32.5)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
          ],
        },
      ],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes a single moonstone component — 25 * 1.1 + 5 = 33 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 33 }] });
  });
  it("sums base premiums of several main items — sword + potion = 140 * 1.1 + 5 = 159 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 159 }] });
  });

  // --- Quoting: component building blocks ---
  it("charges 60 G for a building block of 3 alike components instead of 75 G — 60 * 1.1 + 5 = 71 G", () => {
    const rune = {
      type: "rune",
      material: "stone",
      enchantment: 1,
      cursed: false,
    };
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [rune, rune, rune] }],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("charges block price plus single price for 4 alike components — (60 + 25) * 1.1 + 5 = 98.5 -> 99 G", () => {
    const rune = {
      type: "rune",
      material: "stone",
      enchantment: 1,
      cursed: false,
    };
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [rune, rune, rune, rune] }],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 99 }] });
  });
  it("charges two block prices for 6 alike components — 120 * 1.1 + 5 = 137 G", () => {
    const moonstone = {
      type: "moonstone",
      material: "stone",
      enchantment: 0,
      cursed: false,
    };
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [moonstone, moonstone, moonstone, moonstone, moonstone, moonstone],
        },
      ],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 137 }] });
  });
  it("does not form a block from unlike components — 2 runes + 1 moonstone = 75 * 1.1 + 5 = 87.5 -> 88 G", () => {
    const rune = {
      type: "rune",
      material: "stone",
      enchantment: 1,
      cursed: false,
    };
    const moonstone = {
      type: "moonstone",
      material: "stone",
      enchantment: 0,
      cursed: false,
    };
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [rune, rune, moonstone] }],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 88 }] });
  });

  it("does not form a building block from main items — 3 swords = 300 * 1.1 + 5 = 335 G", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 1,
      cursed: false,
    };
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [sword, sword, sword] }],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 335 }] });
  });

  // --- Quoting: risk surcharges ---
  it("adds a 50 % risk surcharge for a cursed item — 100 * 1.5 * 1.1 + 5 = 170 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 2, cursed: true },
          ],
        },
      ],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 170 }] });
  });
  it("adds a 30 % risk surcharge for enchantment level 5 — 100 * 1.3 * 1.1 + 5 = 148 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 148 }] });
  });
  it("adds no enchantment surcharge below level 5 — enchantment 4 sword = 115 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: false },
          ],
        },
      ],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("stacks the cursed and high-enchantment surcharges on the same item — 100 * 1.5 * 1.3 * 1.1 + 5 = 219.5 -> 220 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 220 }] });
  });
  it("applies surcharges per item, not to the whole quote — cursed sword + plain potion = (150 + 40) * 1.1 + 5 = 214 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 2, cursed: true },
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 214 }] });
  });

  // --- Quoting: customer modifiers ---
  it("grants a 20 % loyalty discount at 2 years with MHPCO — 100 * 1.1 * 0.8 + 5 = 93 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
          ],
        },
      ],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 93 }] });
  });
  it("grants no loyalty discount below 2 years with MHPCO — 1 year sword = 115 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
          ],
        },
      ],
    };

    expect(run(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies a 15 % discount to the second contract instead of the 10 % first-insurance surcharge — 100 * 0.85 + 5 = 90 G", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 1,
      cursed: false,
    };
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    };

    expect(run(scenario)).toEqual({
      results: [{ premium: 115 }, { premium: 90 }],
    });
  });
  it("applies the 15 % discount to every contract after the first — third contract sword = 90 G", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 1,
      cursed: false,
    };
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    };

    expect(run(scenario)).toEqual({
      results: [{ premium: 115 }, { premium: 90 }, { premium: 90 }],
    });
  });
  it("combines the loyalty discount with the repeat-contract discount — 100 * 0.8 * 0.85 + 5 = 73 G", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 1,
      cursed: false,
    };
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    };

    expect(run(scenario)).toEqual({
      results: [{ premium: 93 }, { premium: 73 }],
    });
  });

  // --- Claims: basics ---
  it("pays a damage minus the 100 G deductible — 200 G damage to an amulet pays 100 G", () => {
    const scenario: Scenario = {
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
    };

    expect(run(scenario)).toEqual({
      results: [{ premium: 58 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("pays nothing when the damage does not exceed the deductible — 100 G damage pays 0 G", () => {
    const scenario: Scenario = {
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
            cause: "clumsiness",
            damages: [{ itemType: "amulet", amount: 100 }],
          },
        },
      ],
    };

    expect(run(scenario)).toEqual({
      results: [{ premium: 58 }, { payout: 0, remainingCap: 1200 }],
    });
  });
  it("never pays a negative amount — 40 G damage pays 0 G", () => {
    const scenario: Scenario = {
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
            cause: "a scuff",
            damages: [{ itemType: "amulet", amount: 40 }],
          },
        },
      ],
    };

    expect(run(scenario)).toEqual({
      results: [{ premium: 58 }, { payout: 0, remainingCap: 1200 }],
    });
  });
  it("applies one deductible per incident, not per damaged item — two 200 G damages pay 300 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 2, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "rockfall",
            damages: [
              { itemType: "sword", amount: 200 },
              { itemType: "amulet", amount: 200 },
            ],
          },
        },
      ],
    };

    expect(run(scenario)).toEqual({
      results: [{ premium: 146 }, { payout: 300, remainingCap: 2900 }],
    });
  });
  // "reports the remaining cap after a claim" is already asserted by the
  // 200 G amulet claim above (payout 100, remainingCap 1100).

  // --- Claims: reimbursement rates ---
  it("reimburses damage to an item with enchantment level 8 at 50 % — 500 G damage pays 250 - 100 = 150 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "troll",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };

    expect(run(scenario)).toEqual({
      results: [{ premium: 120 }, { payout: 150, remainingCap: 1850 }],
    });
  });
  it("pays nothing for damage to an item the policy does not cover", () => {
    const scenario: Scenario = {
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
            cause: "misfiled paperwork",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };

    expect(run(scenario)).toEqual({
      results: [{ premium: 58 }, { payout: 0, remainingCap: 1200 }],
    });
  });
  it("reimburses damage to an item with enchantment level 7 in full — 500 G damage pays 400 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "troll",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };

    expect(run(scenario)).toEqual({
      results: [{ premium: 120 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("reimburses damage to a dragon-material item in full even at enchantment 8 — 500 G damage pays 400 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "troll",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };

    expect(run(scenario)).toEqual({
      results: [{ premium: 120 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("applies the rate per damaged item before the single deductible is subtracted", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 8, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "avalanche",
            damages: [
              { itemType: "sword", amount: 400 },
              { itemType: "amulet", amount: 200 },
            ],
          },
        },
      ],
    };

    expect(run(scenario)).toEqual({
      results: [{ premium: 173 }, { payout: 300, remainingCap: 2900 }],
    });
  });

  // --- Claims: cap ---
  it("caps the total payout at twice the insurance sum — amulet policy pays at most 1200 G overall", () => {
    const scenario: Scenario = {
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
            cause: "dragon fire",
            damages: [{ itemType: "amulet", amount: 5000 }],
          },
        },
      ],
    };

    expect(run(scenario)).toEqual({
      results: [{ premium: 58 }, { payout: 1200, remainingCap: 0 }],
    });
  });
  it("accumulates payouts across claims against the same policy and reduces the cap each time (schema example 2)", () => {
    const scenario: Scenario = {
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
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "spell mishap",
            damages: [{ itemType: "amulet", amount: 250 }],
          },
        },
      ],
    };

    expect(run(scenario)).toEqual({
      results: [
        { premium: 58 },
        { payout: 100, remainingCap: 1100 },
        { payout: 150, remainingCap: 950 },
      ],
    });
  });
  it("pays 0 G once the cap is exhausted and reports a remaining cap of 0 G", () => {
    const scenario: Scenario = {
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
            cause: "dragon fire",
            damages: [{ itemType: "amulet", amount: 5000 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "aftershock",
            damages: [{ itemType: "amulet", amount: 500 }],
          },
        },
      ],
    };

    expect(run(scenario)).toEqual({
      results: [
        { premium: 58 },
        { payout: 1200, remainingCap: 0 },
        { payout: 0, remainingCap: 0 },
      ],
    });
  });
  it("keeps caps of separate policies independent", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
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
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 2,
          incident: {
            cause: "troll",
            damages: [{ itemType: "sword", amount: 400 }],
          },
        },
      ],
    };

    expect(run(scenario)).toEqual({
      results: [
        { premium: 71 },
        { payout: 200, remainingCap: 1000 },
        { premium: 90 },
        { payout: 300, remainingCap: 1700 },
      ],
    });
  });

  // --- Multi-step scenarios ---
  // "counts only quote steps as contracts" is not observable through `run`:
  // within the spec a claim can only follow the quote it references, so every
  // quote after step 0 is a repeat contract whether you count steps or quotes.
  // The distinction is a clarity concern, not a behavioural one.
  // Schema example 2 (quote then two claims on one policy) is covered by the
  // cap-accumulation test above, which uses exactly that scenario.
  it("returns one result per step, in step order, with the fields matching each operation", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
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
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 2,
          incident: {
            cause: "troll",
            damages: [{ itemType: "sword", amount: 400 }],
          },
        },
      ],
    };

    const { results } = run(scenario);

    expect(results).toHaveLength(scenario.steps.length);
    expect(results.map((result) => Object.keys(result).sort())).toEqual([
      ["premium"],
      ["payout", "remainingCap"],
      ["premium"],
      ["payout", "remainingCap"],
    ]);
  });
});
