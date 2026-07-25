import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

const quote = (items: any[], years = 0, prior: any[] = []) => runScenario({ customer: { yearsWithMHPCO: years }, steps: [...prior, { op: "quote" as const, items }] });
const claim = (items: any[], damages: any[], years = 0) => runScenario({ customer: { yearsWithMHPCO: years }, steps: [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages } }] });

describe("MHPCO claim office", () => {
  it("quotes an empty item list for the 5 G processing fee", () => expect(quote([])).toEqual({ results: [{ premium: 5 }] }));
  it("quotes each main item at its base premium", () => {
    for (const [type, premium] of [["sword", 115], ["amulet", 71], ["staff", 93], ["potion", 49]] as const) expect(quote([{ type }])).toEqual({ results: [{ premium }] });
  });
  it("quotes 2 components at 25 G each", () => expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual({ results: [{ premium: 60 }] }));
  it("quotes exactly 3 alike components as a 60 G block", () => expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toEqual({ results: [{ premium: 71 }] }));
  it("does not apply the block to 4 and 7 alike components", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({ results: [{ premium: 115 }] });
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ results: [{ premium: 198 }] });
  });
  it("requires identical component types and applies separate blocks", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({ results: [{ premium: 88 }] });
    expect(quote([...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))])).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies item-specific curse modifiers", () => expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ results: [{ premium: 231 }] }));
  it("applies high enchantment at 5, combines curse, and not at 4", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ results: [{ premium: 195 }] });
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toEqual({ results: [{ premium: 165 }] });
  });
  it("applies loyalty at exactly 2 years", () => expect(quote([{ type: "sword" }], 2)).toEqual({ results: [{ premium: 95 }] }));
  it("prices a newcomer cursed sword at 165 G", () => expect(quote([{ type: "sword", cursed: true, enchantment: 3 }])).toEqual({ results: [{ premium: 165 }] }));
  it("prices a long-standing second cursed enchanted contract at 160 G", () => expect(quote([{ type: "sword", cursed: true, enchantment: 7 }], 3, [{ op: "quote", items: [] }])).toEqual({ results: [{ premium: 5 }, { premium: 160 }] }));
  it("rounds final premium up", () => expect(quote([{ type: "potion", cursed: true }], 2)).toEqual({ results: [{ premium: 61 }] }));
  it("rejects unknown quote types", () => expect(() => quote([{ type: "broomstick" }])).toThrow(/Unknown item/));
  it("pays standard and component damage after deductible", () => {
    expect(claim([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }]).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    expect(claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies deductible separately per damaged item", () => expect(claim([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }]).results[1]).toEqual({ payout: 600, remainingCap: 2600 }));
  it("uses the high-enchantment 50 percent clause at 8 or 9 over dragon material", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }]).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    expect(claim([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon material below enchantment 8", () => expect(claim([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]).results[1]).toEqual({ payout: 700, remainingCap: 1300 }));
  it("handles duplicate insured items and rejects excess, unknown, and negative damages", () => {
    expect(claim([{ type: "sword" }, { type: "sword" }], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }]).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
    expect(() => claim([{ type: "sword" }], [{ itemType: "sword", amount: 1 }, { itemType: "sword", amount: 1 }])).toThrow();
    expect(() => claim([{ type: "sword" }], [{ itemType: "amulet", amount: 1 }])).toThrow();
    expect(() => claim([{ type: "sword" }], [{ itemType: "sword", amount: -1 }])).toThrow();
  });
  it("caps successive claims at twice unmodified insurance value", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } }, { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } }] });
    expect(result.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("bases cap on item values despite premium modifiers and blocks", () => {
    expect(quote([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]).results[0]).toEqual({ premium: 181 });
    expect(claim([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 3000 }]).results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("rounds a fractional final payout down", () => expect(claim([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }]).results[1]).toEqual({ payout: 350, remainingCap: 1650 }));
});
