import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

const run = (steps: unknown[], yearsWithMHPCO = 0) =>
  processScenario({ customer: { yearsWithMHPCO }, steps }).results;
const quote = (items: unknown[]) => ({ op: "quote", items });
const claim = (policy: number, damages: unknown[]) => ({
  op: "claim", policy, incident: { cause: "accident", damages },
});

describe("quotes", () => {
  it("uses every main-item price and charges the fee and initial assessment", () => {
    expect(run([quote([
      { type: "sword" }, { type: "amulet" }, { type: "staff" }, { type: "potion" },
    ])])).toEqual([{ premium: 313 }]);
  });

  it("charges only the processing fee for an empty policy", () => {
    expect(run([quote([])])).toEqual([{ premium: 5 }]);
  });

  it("applies a component block only to exactly three alike components", () => {
    expect(run([
      quote([{ type: "rune" }, { type: "rune" }]),
      quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }]),
      quote(Array.from({ length: 4 }, () => ({ type: "rune" }))),
      quote(Array.from({ length: 7 }, () => ({ type: "rune" }))),
      quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
      quote([...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))]),
    ])).toEqual([
      { premium: 60 }, { premium: 62 }, { premium: 100 },
      { premium: 172 }, { premium: 77 }, { premium: 119 },
    ]);
  });

  it("scopes item modifiers to affected items and policy modifiers to base", () => {
    expect(run([quote([
      { type: "sword", cursed: true }, { type: "amulet" },
    ])])).toEqual([{ premium: 231 }]);
  });

  it("stacks curse and enchantment at their exact thresholds", () => {
    expect(run([quote([{ type: "sword", cursed: true, enchantment: 5 }])]))
      .toEqual([{ premium: 195 }]);
    expect(run([quote([{ type: "sword", cursed: true, enchantment: 4 }])]))
      .toEqual([{ premium: 165 }]);
  });

  it("applies loyalty at two years and follow-up discount after a quote", () => {
    expect(run([
      quote([{ type: "sword" }]),
      quote([{ type: "sword", cursed: true, enchantment: 7 }]),
    ], 3)).toEqual([{ premium: 95 }, { premium: 160 }]);
  });

  it("rounds fractional premiums upward only at the end", () => {
    expect(run([quote([{ type: "rune", cursed: true }])], 2)).toEqual([{ premium: 40 }]);
  });

  it("rejects unknown item types", () => {
    expect(() => run([quote([{ type: "broomstick" }])])).toThrow(/unknown item type/i);
  });
});

describe("claims", () => {
  it("reimburses ordinary and component damage with one deductible per entry", () => {
    expect(run([
      quote([{ type: "sword" }, { type: "amulet" }, { type: "rune" }]),
      claim(0, [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
        { itemType: "rune", amount: 200 },
      ]),
    ])).toEqual([{ premium: 209 }, { payout: 700, remainingCap: 3000 }]);
  });

  it("halves reimbursement at enchantment eight, including dragon items", () => {
    expect(run([
      quote([
        { type: "sword", enchantment: 8, material: "dragon" },
        { type: "staff", enchantment: 9, material: "steel" },
        { type: "amulet", enchantment: 5, material: "dragon" },
      ]),
      claim(0, [
        { itemType: "sword", amount: 1000 },
        { itemType: "staff", amount: 1000 },
        { itemType: "amulet", amount: 800 },
      ]),
    ])).toEqual([{ premium: 341 }, { payout: 1500, remainingCap: 3300 }]);
  });

  it("supports duplicate insured types and applies a deductible to each", () => {
    expect(run([
      quote([{ type: "sword" }, { type: "sword" }]),
      claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }]),
    ])).toEqual([{ premium: 225 }, { payout: 800, remainingCap: 3200 }]);
  });

  it("caps successive claims at twice the unmodified insurance sum", () => {
    expect(run([
      quote([{ type: "sword", cursed: true }]),
      claim(0, [{ itemType: "sword", amount: 1500 }]),
      claim(0, [{ itemType: "sword", amount: 1500 }]),
    ])).toEqual([
      { premium: 165 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it("counts component units, not discounted blocks, in the cap", () => {
    expect(run([
      quote([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]),
      claim(0, [{ itemType: "sword", amount: 4000 }]),
    ])).toEqual([{ premium: 181 }, { payout: 3500, remainingCap: 0 }]);
  });

  it("keeps payout fractions until final downward rounding", () => {
    expect(run([
      quote([{ type: "sword", enchantment: 8 }]),
      claim(0, [{ itemType: "sword", amount: 901 }]),
    ])).toEqual([{ premium: 145 }, { payout: 350, remainingCap: 1650 }]);
  });

  it("rejects uncovered, duplicate excess, unknown, and negative damages", () => {
    const oneSword = [quote([{ type: "sword" }])];
    expect(() => run([...oneSword, claim(0, [{ itemType: "amulet", amount: 10 }])])).toThrow(/not covered/i);
    expect(() => run([...oneSword, claim(0, [{ itemType: "sword", amount: 10 }, { itemType: "sword", amount: 10 }])])).toThrow(/not covered/i);
    expect(() => run([...oneSword, claim(0, [{ itemType: "wand", amount: 10 }])])).toThrow(/unknown damaged/i);
    expect(() => run([...oneSword, claim(0, [{ itemType: "sword", amount: -200 }])])).toThrow(/non-negative/i);
  });

  it("requires a claim to reference an earlier quote", () => {
    expect(() => run([claim(0, [])])).toThrow(/earlier quote/i);
  });
});
