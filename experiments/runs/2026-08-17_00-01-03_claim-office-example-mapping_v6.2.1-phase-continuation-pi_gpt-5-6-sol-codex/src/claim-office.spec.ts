import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price list for sword, amulet, staff, and potion", () => {
    for (const [type, premium] of [["sword", 115], ["amulet", 71], ["staff", 93], ["potion", 49]] as const) {
      expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] })).toEqual({ results: [{ premium }] });
    }
  });
  it("prices ordinary components at 25 G each and only an exact group of 3 alike components at 60 G", () => {
    for (const [count, premium] of [[2, 60], [3, 71], [4, 115], [7, 198]] as const) {
      const items = Array.from({ length: count }, () => ({ type: "rune" }));
      expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium }] });
    }
  });
  it("treats component types separately, pricing mixed triples at 75 G and separate triples at 120 G", () => {
    const quote = (types: string[]) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: types.map((type) => ({ type })) }] });
    expect(quote(["rune", "rune", "moonstone"])).toEqual({ results: [{ premium: 88 }] });
    expect(quote(["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"])).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies curse and high-enchantment modifiers only to affected items, and stacks both at enchantment 5", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [
      { type: "sword", cursed: true, enchantment: 5 }, { type: "amulet", cursed: false, enchantment: 4 },
    ] }] });
    expect(result).toEqual({ results: [{ premium: 261 }] });
  });
  it("applies loyalty at exactly 2 years, first-insurance per item, and follow-up discount after the first quote", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "quote", items: [{ type: "sword" }] },
    ] })).toEqual({ results: [{ premium: 95 }, { premium: 80 }] });
  });
  it("rounds a fractional premium up only after all modifiers", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes the newcomer cursed-sword integration example at 165 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes the long-standing customer's second cursed enchanted sword contract at 160 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("reimburses ordinary and component damage fully before a 100 G per-damage deductible", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }, { itemType: "rune", amount: 200 }] } },
    ] })).toEqual({ results: [{ premium: 143 }, { payout: 500, remainingCap: 2000 }] });
  });
  it("applies one deductible to each damaged item in a multi-item incident, yielding 600 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ] }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("applies 50% reimbursement at enchantment 8 even for dragon material, yielding 400 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("resolves dragon and enchantment clauses for dragon enchantment 9, dragon enchantment 5, and steel enchantment 9", () => {
    const claim = (material: string, enchantment: number, amount: number) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material, enchantment }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount }] } },
    ] }).results[1];
    expect(claim("dragon", 9, 1000)).toEqual({ payout: 400, remainingCap: 1600 });
    expect(claim("dragon", 5, 800)).toEqual({ payout: 700, remainingCap: 1300 });
    expect(claim("steel", 9, 1000)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rounds a fractional payout down only at the end", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ] }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("supports duplicate insured item types and applies a deductible to each duplicate damage", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ] }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects more damage entries of a type than the policy covers", () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } },
    ] })).toThrow(/not insured/i);
  });
  it("bases the cap on twice unmodified insurance values, including components, not premium modifiers or blocks", () => {
    const cap = (items: Array<{ type: string; cursed?: boolean }>) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "audit", damages: [] } },
    ] }).results[1];
    expect(cap([{ type: "sword" }, { type: "amulet" }])).toEqual({ payout: 0, remainingCap: 3200 });
    expect(cap([{ type: "sword", cursed: true }])).toEqual({ payout: 0, remainingCap: 2000 });
    expect(cap([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("tracks cap exhaustion over successive claims, paying 1400 G then 600 G", () => {
    const damage = { itemType: "sword", amount: 1500 };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [damage] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [damage] } },
    ] }).results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rejects an unknown item type in a quote without producing results", () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] })).toThrow(/unknown item type/i);
  });
  it("rejects damage for an uninsured or unknown item type", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType, amount: 200 }] } },
      ] })).toThrow(/not insured/i);
    }
  });
  it("rejects a negative damage amount", () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ] })).toThrow(/negative damage amount/i);
  });
  it("processes the normative quote-then-claim schema with ordered result shapes", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] })).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
