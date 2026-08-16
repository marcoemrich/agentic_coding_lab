import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

describe("quotes", () => {
  it("prices base items, components, and an empty policy", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
    ] })).toEqual({ results: [{ premium: 5 }, { premium: 62 }, { premium: 77 }] });
  });

  it("stacks item and policy modifiers and rounds only at the end", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [{ type: "amulet" }] },
      { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      { op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] },
    ] })).toEqual({ results: [{ premium: 59 }, { premium: 160 }, { premium: 175 }] });
  });
});

describe("claims", () => {
  it("applies item deductibles, clauses, and the policy cap", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [
        { type: "sword", material: "dragon", enchantment: 9 },
        { type: "amulet", enchantment: 2 },
      ] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 1000 }, { itemType: "amulet", amount: 300 },
      ] } },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 6000 },
      ] } },
    ] })).toEqual({ results: [
      { premium: 211 }, { payout: 600, remainingCap: 2600 }, { payout: 2600, remainingCap: 0 },
    ] });
  });

  it("rounds payouts down after summing fractions", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "staff", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "staff", amount: 901 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 350, remainingCap: 1250 });
  });
});

describe("validation", () => {
  it("rejects unknown and over-reported items and negative damage", () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] })).toThrow(/unknown item type/i);
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "x", damages: [
        { itemType: "sword", amount: 1 }, { itemType: "sword", amount: 1 },
      ] } },
    ] })).toThrow(/not covered/i);
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "rune", amount: -1 }] } },
    ] })).toThrow(/non-negative/i);
  });
});
