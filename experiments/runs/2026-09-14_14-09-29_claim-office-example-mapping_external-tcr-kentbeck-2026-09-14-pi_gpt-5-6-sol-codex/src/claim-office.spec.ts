import { describe, expect, it } from "vitest";
import { processScenario, type Item, type Scenario } from "./claim-office";

function quotes(items: Item[], yearsWithMHPCO = 0): number {
  const scenario: Scenario = {
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  };
  return (processScenario(scenario).results[0] as { premium: number }).premium;
}

describe("quotes", () => {
  it("prices each main item", () => {
    expect(quotes([{ type: "sword" }])).toBe(115);
    expect(quotes([{ type: "amulet" }])).toBe(71);
    expect(quotes([{ type: "staff" }])).toBe(93);
    expect(quotes([{ type: "potion" }])).toBe(49);
  });

  it("prices exact blocks of three alike components specially", () => {
    expect(quotes([{ type: "rune" }, { type: "rune" }])).toBe(60);
    expect(quotes([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    expect(quotes(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
    expect(quotes(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });

  it("only groups components of the same type", () => {
    expect(quotes([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
    expect(quotes([
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ])).toBe(137);
  });

  it("applies item modifiers only to their affected items", () => {
    expect(quotes([
      { type: "sword", cursed: true },
      { type: "amulet", cursed: false },
    ])).toBe(231);
    expect(quotes([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    expect(quotes([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
    expect(quotes([
      { type: "rune", cursed: true },
      { type: "rune", cursed: true },
      { type: "rune", cursed: true },
    ])).toBe(101);
  });

  it("applies customer and contract modifiers to the policy base", () => {
    expect(quotes([{ type: "sword", cursed: true }])).toBe(165);
    expect(quotes([{ type: "sword" }], 2)).toBe(95);

    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    };
    expect(processScenario(scenario).results).toEqual([{ premium: 59 }, { premium: 160 }]);
  });

  it("charges only the processing fee for an empty policy", () => {
    expect(quotes([])).toBe(5);
  });

  it("rejects unknown item types", () => {
    expect(() => quotes([{ type: "broomstick" }])).toThrow("Unknown item type");
  });
});

describe("claims", () => {
  function claimFor(item: Item, amount: number) {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [item] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "accident", damages: [{ itemType: item.type, amount }] },
        },
      ],
    };
    return processScenario(scenario).results[1];
  }

  it("deducts 100 G from standard reimbursement", () => {
    expect(claimFor({ type: "sword", material: "steel", enchantment: 3 }, 500))
      .toEqual({ payout: 400, remainingCap: 1600 });
    expect(claimFor({ type: "rune" }, 200))
      .toEqual({ payout: 100, remainingCap: 400 });
  });

  it("halves highly enchanted item damage before the deductible", () => {
    expect(claimFor({ type: "sword", material: "dragon", enchantment: 8 }, 1000))
      .toEqual({ payout: 400, remainingCap: 1600 });
    expect(claimFor({ type: "sword", material: "dragon", enchantment: 5 }, 800))
      .toEqual({ payout: 700, remainingCap: 1300 });
    expect(claimFor({ type: "sword", material: "steel", enchantment: 9 }, 1000))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("applies the deductible separately to every damage entry", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
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
    };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it("tracks and exhausts the policy cap across claims", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [damage] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [damage] } },
      ],
    };
    expect(processScenario(scenario).results).toEqual([
      { premium: 165 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it("supports separately damaged duplicate item types", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: {
          cause: "dragon attack",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 500 },
          ],
        } },
      ],
    };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  it("bases the cap on unmodified item values", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", cursed: true },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
      ],
    };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });

  it("rounds only the final payout down", () => {
    expect(claimFor({ type: "sword", enchantment: 8 }, 901))
      .toEqual({ payout: 350, remainingCap: 1650 });
  });

  it("rejects uncovered, excess, and negative damages", () => {
    const base: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    expect(() => processScenario({
      ...base,
      steps: [...base.steps, { op: "claim", policy: 0, incident: {
        cause: "fire", damages: [{ itemType: "amulet", amount: 200 }],
      } }],
    })).toThrow("not covered");
    expect(() => processScenario({
      ...base,
      steps: [...base.steps, { op: "claim", policy: 0, incident: {
        cause: "fire", damages: [
          { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
        ],
      } }],
    })).toThrow("not covered");
    expect(() => claimFor({ type: "sword" }, -200)).toThrow("non-negative");
  });
});
