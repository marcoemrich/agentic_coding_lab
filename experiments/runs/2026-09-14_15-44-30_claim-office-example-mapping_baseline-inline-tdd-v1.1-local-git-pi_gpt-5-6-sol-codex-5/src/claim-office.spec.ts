import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office";

describe("quotes", () => {
  it("prices the four listed main items and the processing fee", () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword" }, { type: "amulet" }, { type: "staff" }, { type: "potion" },
      ] }],
    })).toEqual({ results: [{ premium: 313 }] });
  });

  it("applies component blocks only to exactly three alike components", () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    })).toEqual({ results: [{ premium: 71 }, { premium: 77 }, { premium: 172 }] });
  });

  it("stacks item and policy modifiers, then rounds up and adds the fee", () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    })).toEqual({ results: [{ premium: 59 }, { premium: 160 }] });
  });

  it("charges only the fee for an empty policy", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });

  it("applies item surcharges only to the affected item", () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", cursed: true }, { type: "amulet" },
      ] }],
    })).toEqual({ results: [{ premium: 231 }] });
  });

  it("rounds only the final premium upward", () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune", cursed: true }] }],
    })).toEqual({ results: [{ premium: 45 }] });
  });
});

describe("claims", () => {
  it("uses item clauses, one deductible per damage, and keeps policy cap state", () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "dragon", enchantment: 9 },
          { type: "amulet", material: "silver", enchantment: 2 },
        ] },
        { op: "claim", policy: 0, incident: { cause: "attack", damages: [
          { itemType: "sword", amount: 1000 }, { itemType: "amulet", amount: 300 },
        ] } },
        { op: "claim", policy: 0, incident: { cause: "again", damages: [
          { itemType: "sword", amount: 6000 },
        ] } },
      ],
    })).toEqual({ results: [
      { premium: 211 }, { payout: 600, remainingCap: 2600 }, { payout: 2600, remainingCap: 0 },
    ] });
  });

  it("rounds the final payout down", () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    })).toEqual({ results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }] });
  });

  it("handles multiple insured items of the same type separately", () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [
          { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
        ] } },
      ],
    })).toEqual({ results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }] });
  });

  it("rejects unknown, excess, and negative damage", () => {
    const base = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] };
    expect(() => processScenario({ ...base, steps: [...base.steps, { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 1 }] } }] }))
      .toThrow(/not covered/);
    expect(() => processScenario({ ...base, steps: [...base.steps, { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -1 }] } }] }))
      .toThrow(/non-negative/);
    expect(() => processScenario({ ...base, steps: [...base.steps, { op: "claim", policy: 0, incident: { cause: "x", damages: [
      { itemType: "sword", amount: 1 }, { itemType: "sword", amount: 1 },
    ] } }] })).toThrow(/not covered/);
  });
});
