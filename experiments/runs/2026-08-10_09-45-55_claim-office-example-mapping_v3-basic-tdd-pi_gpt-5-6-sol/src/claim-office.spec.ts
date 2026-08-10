import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office";

const customer = { yearsWithMHPCO: 0 };

describe("quotes", () => {
  it("prices main items, empty policies, and component blocks", () => {
    expect(processScenario({ customer, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword" }] },
      { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
    ] })).toEqual({ results: [{ premium: 5 }, { premium: 100 }, { premium: 62 }] });
  });

  it("stacks item and policy modifiers additively and rounds up", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [{ type: "amulet" }] },
      { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      { op: "quote", items: [{ type: "potion", cursed: true }] },
    ] })).toEqual({ results: [{ premium: 59 }, { premium: 160 }, { premium: 55 }] });
  });
});

describe("claims", () => {
  it("applies reimbursement, deductibles, enchantment clauses, and cap", () => {
    expect(processScenario({ customer, steps: [
      { op: "quote", items: [
        { type: "sword", material: "dragon", enchantment: 9 },
        { type: "amulet", enchantment: 3 },
      ] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 1000 },
        { itemType: "amulet", amount: 300 },
      ] } },
      { op: "claim", policy: 0, incident: { cause: "again", damages: [
        { itemType: "sword", amount: 6000 },
      ] } },
    ] })).toEqual({ results: [
      { premium: 211 },
      { payout: 600, remainingCap: 2600 },
      { payout: 2600, remainingCap: 0 },
    ] });
  });

  it("rejects invalid item and damage references", () => {
    expect(() => processScenario({ customer, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] })).toThrow(/unknown item type/i);
    expect(() => processScenario({ customer, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [
        { itemType: "sword", amount: -1 },
      ] } },
    ] })).toThrow(/amount/i);
  });
});
