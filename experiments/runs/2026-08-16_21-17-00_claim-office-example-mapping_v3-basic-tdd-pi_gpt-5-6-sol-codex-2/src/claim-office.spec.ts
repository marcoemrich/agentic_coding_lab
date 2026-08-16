import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

describe("quotes", () => {
  it("prices ordinary items and an empty policy", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "quote", items: [] },
    ] })).toEqual({ results: [{ premium: 115 }, { premium: 5 }] });
  });

  it("prices component blocks separately by exact type", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }] },
      { op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) },
    ] })).toEqual({ results: [{ premium: 137 }, { premium: 100 }] });
  });

  it("stacks item and policy modifiers before rounding", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [{ type: "amulet" }] },
      { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
    ] })).toEqual({ results: [{ premium: 59 }, { premium: 160 }] });
  });

  it("rounds fractional premiums upward", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "potion", enchantment: 5 }] },
      { op: "quote", items: [{ type: "rune" }] },
    ] })).toEqual({ results: [{ premium: 61 }, { premium: 29 }] });
  });

  it("rejects unknown quote item types", () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] })).toThrow(/unknown item type/);
  });
});

describe("claims", () => {
  it("applies special reimbursement and a deductible to each damage", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [
        { type: "sword", material: "dragon", enchantment: 9 },
        { type: "amulet", material: "silver", enchantment: 2 },
      ] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 1000 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] })).toEqual({ results: [{ premium: 211 }, { payout: 600, remainingCap: 2600 }] });
  });

  it("rounds the final aggregate payout downward", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "staff", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "staff", amount: 901 }] } },
    ] })).toEqual({ results: [{ premium: 117 }, { payout: 350, remainingCap: 1250 }] });
  });

  it("tracks and exhausts the policy cap over claims", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "a", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "b", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] })).toEqual({ results: [
      { premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ] });
  });

  it("rejects invalid and excess damage entries", () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "x", damages: [
        { itemType: "sword", amount: 1 }, { itemType: "sword", amount: 1 },
      ] } },
    ] })).toThrow();
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -1 }] } },
    ] })).toThrow();
  });
});
