import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });

describe("quotes", () => {
  it("prices an empty policy and the standard item types", () => {
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items: [
      { type: "sword" }, { type: "amulet" }, { type: "staff" }, { type: "potion" },
    ] }] })).toEqual({ results: [{ premium: 313 }] });
  });

  it("only gives blocks to exactly three components of the same type", () => {
    const premiums = [2, 3, 4, 7].map(count => processScenario({ customer: customer(), steps: [
      { op: "quote", items: Array.from({ length: count }, () => ({ type: "rune" })) },
    ] }).results[0]);
    expect(premiums).toEqual([{ premium: 60 }, { premium: 71 }, { premium: 115 }, { premium: 198 }]);
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items: [
      { type: "rune" }, { type: "rune" }, { type: "moonstone" },
    ] }] })).toEqual({ results: [{ premium: 88 }] });
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items: [
      { type: "rune", cursed: true }, { type: "rune", cursed: true }, { type: "rune", cursed: true },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ] }] })).toEqual({ results: [{ premium: 167 }] });
  });

  it("stacks item and policy modifiers and tracks follow-up contracts", () => {
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items: [
      { type: "sword", cursed: true, enchantment: 3 }, { type: "amulet" },
    ] }] })).toEqual({ results: [{ premium: 231 }] });
    expect(processScenario({ customer: customer(3), steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
    ] })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
});

describe("claims", () => {
  it("applies reimbursement clauses and one deductible per damage", () => {
    expect(processScenario({ customer: customer(), steps: [
      { op: "quote", items: [
        { type: "sword", material: "dragon", enchantment: 9 },
        { type: "amulet", material: "silver", enchantment: 3 },
        { type: "rune" },
      ] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 1000 },
        { itemType: "amulet", amount: 300 },
        { itemType: "rune", amount: 200 },
      ] } },
    ] })).toEqual({ results: [{ premium: 239 }, { payout: 700, remainingCap: 3000 }] });
  });

  it("tracks and exhausts the policy cap across claims", () => {
    expect(processScenario({ customer: customer(), steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] })).toEqual({ results: [
      { premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ] });
  });

  it("rounds fractional payouts down only at the end", () => {
    expect(processScenario({ customer: customer(), steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "sword", amount: 901 }] } },
    ] }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe("invalid scenarios", () => {
  it.each([
    { customer: customer(), steps: [{ op: "quote", items: [{ type: "broomstick" }] }] },
    { customer: customer(), steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 2 }] } }] },
    { customer: customer(), steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -2 }] } }] },
    { customer: customer(), steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 2 }, { itemType: "sword", amount: 2 }] } }] },
  ])("rejects bad input", scenario => expect(() => processScenario(scenario)).toThrow());
});
