import { describe, expect, it } from "vitest";
import { ItemType, parseScenario, runScenario } from "./claim-office";

describe("quotes", () => {
  it("uses the price list, first-insurance surcharge and processing fee", () => {
    expect(runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword" }, { type: "amulet" },
        { type: "staff" }, { type: "potion" },
      ] }],
    })).toEqual({ results: [{ premium: 313 }] });
  });

  it("prices exact blocks of alike components", () => {
    const quote = (types: ItemType[]) => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: types.map((type) => ({ type })) }],
    });
    expect(quote(["rune", "rune", "rune"])).toEqual({ results: [{ premium: 71 }] });
    expect(quote(["rune", "rune", "moonstone"])).toEqual({ results: [{ premium: 88 }] });
    expect(quote(Array(7).fill("rune"))).toEqual({ results: [{ premium: 198 }] });
  });

  it("applies item risk modifiers and policy modifiers to their proper scopes", () => {
    expect(runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [
          { type: "sword", cursed: true, enchantment: 5 },
          { type: "amulet" },
        ] },
      ],
    })).toEqual({ results: [{ premium: 59 }, { premium: 205 }] });
  });

  it("matches the integrated newcomer and follow-up examples", () => {
    expect(runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
    expect(runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] }],
    })).toEqual({ results: [{ premium: 165 }] });
  });

  it("returns only the fee for an empty quote", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
});

describe("claims", () => {
  it("applies each deductible and tracks the policy cap", () => {
    expect(runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
        ] } },
      ],
    })).toEqual({ results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }] });
  });

  it("reimburses ordinary and component damage in full before the deductible", () => {
    expect(runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "accident", damages: [
          { itemType: "rune", amount: 200 }, { itemType: "sword", amount: 800 },
        ] } },
      ],
    })).toEqual({ results: [{ premium: 173 }, { payout: 800, remainingCap: 1700 }] });
  });

  it("halves highly enchanted damage, including dragon material", () => {
    expect(runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 1000 },
        ] } },
      ],
    })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });

  it("uses separate duplicate insured items and exhausts the cap over claims", () => {
    expect(runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    })).toEqual({ results: [
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ] });
  });

  it("rounds a fractional payout down only at the end", () => {
    expect(runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "magic", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    })).toEqual({ results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }] });
  });
});

describe("input validation", () => {
  const scenario = (step: unknown) => ({ customer: { yearsWithMHPCO: 0 }, steps: [step] });

  it("rejects unknown quote items", () => {
    expect(() => parseScenario(scenario({ op: "quote", items: [{ type: "broomstick" }] })))
      .toThrow(/unknown item type/i);
  });

  it("rejects unknown, uncovered, duplicate, and negative claim damages", () => {
    const prefix = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    const claim = (itemType: string, amount: number, count = 1) => ({
      ...prefix,
      steps: [...prefix.steps, { op: "claim", policy: 0, incident: {
        cause: "accident", damages: Array(count).fill({ itemType, amount }),
      } }],
    });
    expect(() => parseScenario(claim("broomstick", 20))).toThrow(/unknown item type/i);
    expect(() => runScenario(parseScenario(claim("amulet", 20)))).toThrow(/not covered/i);
    expect(() => runScenario(parseScenario(claim("sword", 20, 2)))).toThrow(/not covered/i);
    expect(() => parseScenario(claim("sword", -200))).toThrow(/non-negative/i);
  });

  it("rejects claims that do not reference an earlier quote", () => {
    const input = scenario({ op: "claim", policy: 0, incident: { cause: "fire", damages: [] } });
    expect(() => runScenario(parseScenario(input))).toThrow(/does not reference/i);
  });
});
