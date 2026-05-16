import { describe, it, expect } from "vitest";
import { runScenario } from "./scenario.js";
import type { Scenario } from "./types.js";

describe("Schema example 1 — Quote only", () => {
  it("computes premium for a single sword for a new customer", () => {
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
    // base 100, no surcharges, first quote +10%, no loyalty, +5 fee
    // 100 * 1.10 + 5 = 115
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }],
    });
  });
});

describe("Schema example 2 — Quote followed by two claims", () => {
  it("computes premium then processes two claims", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "amulet",
              material: "silver",
              enchantment: 2,
              cursed: false,
            },
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
    // base 60. factor = 1 - 0.2 (loyalty, 5 yrs >= 2) + 0.1 (first) = 0.9
    // premium = 60 * 0.9 + 5 = 59
    // insuranceSum = 600, cap = 1200
    // claim 1: 200 - 100 = 100, cap remaining 1100
    // claim 2: 250 - 100 = 150, cap remaining 950
    expect(runScenario(scenario)).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
        { payout: 150, remainingCap: 950 },
      ],
    });
  });
});

describe("Pricing modifiers", () => {
  it("applies cursed surcharge of 50%", () => {
    // sword base 100, cursed → 150. first quote +10%, +5 = 150*1.1 +5 = 170
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true, enchantment: 0 }],
        },
      ],
    };
    expect(runScenario(scenario).results).toEqual([{ premium: 170 }]);
  });

  it("applies high-enchantment surcharge of 30%", () => {
    // staff base 80, enchantment 5 → 80 * 1.3 = 104. first +10%, +5 = 104*1.1+5 = 119.4 → 120
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", enchantment: 5 }],
        },
      ],
    };
    expect(runScenario(scenario).results).toEqual([{ premium: 120 }]);
  });

  it("stacks cursed and high-enchantment surcharges additively", () => {
    // potion base 40, cursed +50%, enchanted +30% => 40*(1+0.5+0.3)=72. first +10%, +5 = 72*1.1+5 = 84.2 → 85
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", cursed: true, enchantment: 5 }],
        },
      ],
    };
    expect(runScenario(scenario).results).toEqual([{ premium: 85 }]);
  });

  it("loyalty discount applies for >= 2 years", () => {
    // sword base 100. loyalty -20%, first +10%. factor 0.9 → 90. +5 = 95
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }],
        },
      ],
    };
    expect(runScenario(scenario).results).toEqual([{ premium: 95 }]);
  });

  it("applies 15% discount on second contract", () => {
    // first quote: sword 100 * 1.1 + 5 = 115
    // second quote: amulet 60 * (1 - 0.15) + 5 = 51 + 5 = 56
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
      ],
    };
    expect(runScenario(scenario).results).toEqual([
      { premium: 115 },
      { premium: 56 },
    ]);
  });

  it("rounds in MHPCO's favor (ceiling)", () => {
    // potion 40, factor 1.1, +5: 44 + 5 = 49. Already whole.
    // Use staff to force non-integer: 80*1.1+5 = 93 (integer too)
    // Use enchanted high: 80 * 1.3 = 104, * 1.1 = 114.4 → +5 = 119.4 → 120
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff", enchantment: 5 }] },
      ],
    };
    expect(runScenario(scenario).results).toEqual([{ premium: 120 }]);
  });
});

describe("Components", () => {
  it("prices a single rune at base 25", () => {
    // rune base 25, first +10%, +5 fee = 27.5 + 5 = 32.5 → 33
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
      ],
    };
    expect(runScenario(scenario).results).toEqual([{ premium: 33 }]);
  });

  it("uses block pricing of 60 for 3 alike components", () => {
    // 3 runes → block base 60. first +10%, +5 = 66 + 5 = 71
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };
    expect(runScenario(scenario).results).toEqual([{ premium: 71 }]);
  });

  it("prices 4 runes as one block of 3 plus one solo", () => {
    // 60 + 25 = 85. *1.1 + 5 = 93.5 + 5 = 98.5 → 99
    // Wait: 85 * 1.1 = 93.5, + 5 = 98.5 → 99
    const scenario: Scenario = {
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
    };
    expect(runScenario(scenario).results).toEqual([{ premium: 99 }]);
  });

  it("only groups blocks among alike components", () => {
    // 2 runes + 2 moonstones → no blocks: 4 * 25 = 100. * 1.1 + 5 = 115
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    };
    expect(runScenario(scenario).results).toEqual([{ premium: 115 }]);
  });
});

describe("Claim processing", () => {
  it("applies 50% reimbursement for highly enchanted items (≥ 8)", () => {
    // sword enchantment 10: base 100 * 1.3 = 130. * 1.1 + 5 = 148. premium 148
    // insuranceSum 1000, cap 2000.
    // claim damage 500, item enchantment 10 → 50% reimbursement = 250. Deductible 100 → 150.
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 10 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    expect(runScenario(scenario).results).toEqual([
      { premium: 148 },
      { payout: 150, remainingCap: 1850 },
    ]);
  });

  it("fully reimburses dragon-material items", () => {
    // staff dragon, enchantment 8 (would be 50%, but dragon overrides)
    // base 80, enchanted +30% = 104, * 1.1 + 5 = 119.4 → 120. premium 120.
    // insuranceSum 800, cap 1600.
    // claim damage 300, dragon material → 300. deductible 100 → 200.
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "staff", amount: 300 }] },
        },
      ],
    };
    expect(runScenario(scenario).results).toEqual([
      { premium: 120 },
      { payout: 200, remainingCap: 1400 },
    ]);
  });

  it("caps total payout at twice the insurance sum", () => {
    // potion base 40, first +10%, +5 = 49 premium. insuranceSum 400, cap 800.
    // huge claim: damage 5000 → 5000 - 100 = 4900. Cap to 800. payout 800, remainingCap 0.
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "potion", amount: 5000 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "potion", amount: 1000 }] },
        },
      ],
    };
    const r = runScenario(scenario).results;
    expect(r[0]).toEqual({ premium: 49 });
    expect(r[1]).toEqual({ payout: 800, remainingCap: 0 });
    // Subsequent claim has nothing left.
    expect(r[2]).toEqual({ payout: 0, remainingCap: 0 });
  });

  it("yields zero payout when damage is below deductible", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "amulet", amount: 50 }] },
        },
      ],
    };
    const r = runScenario(scenario).results;
    expect(r[1]).toEqual({ payout: 0, remainingCap: 1200 });
  });

  it("sums multiple damages in a single incident before deductible", () => {
    // amulet, sword in one policy. damages 70 + 50 = 120, deductible 100 → 20.
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet" }, { type: "sword" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            damages: [
              { itemType: "amulet", amount: 70 },
              { itemType: "sword", amount: 50 },
            ],
          },
        },
      ],
    };
    const r = runScenario(scenario).results;
    expect(r[1]).toMatchObject({ payout: 20 });
  });
});
