import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

describe("quotes", () => {
  const scenario = (customerYears: number, steps: any[]) =>
    processScenario({ customer: { yearsWithMHPCO: customerYears }, steps });

  it("prices the component block examples", () => {
    const quote = (types: string[]) => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: types.map(type => ({ type })) }],
    }).results[0];
    expect(quote(["rune", "rune"])).toEqual({ premium: 60 });
    expect(quote(["rune", "rune", "rune"])).toEqual({ premium: 71 });
    expect(quote(["rune", "rune", "rune", "rune"])).toEqual({ premium: 115 });
    expect(quote(["rune", "rune", "moonstone"])).toEqual({ premium: 88 });
    expect(quote(["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"])).toEqual({ premium: 137 });
  });

  it("stacks item and policy modifiers and rounds in the office's favor", () => {
    expect(scenario(0, [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] }]).results)
      .toEqual([{ premium: 165 }]);
    expect(scenario(3, [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
    ]).results).toEqual([{ premium: 5 }, { premium: 160 }]);
    expect(scenario(0, [{ op: "quote", items: [
      { type: "sword", cursed: true }, { type: "amulet" },
    ] }]).results).toEqual([{ premium: 231 }]);
  });

  it("calculates claims, deductibles, cap exhaustion, and special clauses", () => {
    expect(scenario(0, [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 1000 }, { itemType: "amulet", amount: 300 },
      ] } },
    ]).results[1]).toEqual({ payout: 600, remainingCap: 2600 });

    expect(scenario(0, [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "a", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "b", damages: [{ itemType: "sword", amount: 1500 }] } },
    ]).results).toEqual([
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it("rounds only the final payout", () => {
    expect(scenario(0, [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }, { type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "x", damages: [
        { itemType: "sword", amount: 451 }, { itemType: "sword", amount: 450 },
      ] } },
    ]).results[1]).toEqual({ payout: 250, remainingCap: 3750 });
  });

  it("rejects invalid items, damages, multiplicity, and policy references", () => {
    expect(() => scenario(0, [{ op: "quote", items: [{ type: "broomstick" }] }])).toThrow(/Unknown/);
    const quote = { op: "quote", items: [{ type: "sword" }] };
    expect(() => scenario(0, [quote, { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -1 }] } }])).toThrow(/non-negative/);
    expect(() => scenario(0, [quote, { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 1 }] } }])).toThrow(/not covered/);
    expect(() => scenario(0, [quote, { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1 }, { itemType: "sword", amount: 1 }] } }])).toThrow(/not covered/);
    expect(() => scenario(0, [{ op: "claim", policy: 4, incident: { cause: "x", damages: [] } }])).toThrow(/policy/);
  });
});
