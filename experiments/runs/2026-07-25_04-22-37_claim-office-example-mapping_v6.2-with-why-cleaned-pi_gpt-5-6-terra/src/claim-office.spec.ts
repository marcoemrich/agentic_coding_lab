import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { processScenario, type Item } from "./claim-office.js";

const quote = (items: Item[], yearsWithMHPCO = 0) =>
  processScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] });

describe("MHPCO claim office", () => {
  it("quotes an empty item list for the 5 G processing fee", () => {
    expect(quote([])).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes each main item at its base premium: sword 100, amulet 60, staff 80, potion 40 G", () => {
    expect(quote([{ type: "sword" }])).toEqual({ results: [{ premium: 115 }] });
    expect(quote([{ type: "amulet" }])).toEqual({ results: [{ premium: 71 }] });
    expect(quote([{ type: "staff" }])).toEqual({ results: [{ premium: 93 }] });
    expect(quote([{ type: "potion" }])).toEqual({ results: [{ premium: 49 }] });
  });
  it("quotes component building blocks: 2 runes 50, 3 runes 60, 4 runes 100, and 7 runes 175 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual({ results: [{ premium: 60 }] });
    expect(quote(Array.from({ length: 3 }, () => ({ type: "rune" })))).toEqual({ results: [{ premium: 73 }] });
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({ results: [{ premium: 115 }] });
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ results: [{ premium: 198 }] });
  });
  it("treats component types separately: 2 runes plus moonstone 75 G and 3 runes plus 3 moonstones 120 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({ results: [{ premium: 88 }] });
    expect(quote([...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))])).toEqual({ results: [{ premium: 140 }] });
  });
  it("applies cursed and high-enchantment item surcharges only to affected items, including thresholds 4 and 5", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ results: [{ premium: 231 }] });
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ results: [{ premium: 195 }] });
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toEqual({ results: [{ premium: 165 }] });
  });
  it("applies loyalty at exactly 2 years and rounds premiums up only at the final amount", () => {
    expect(quote([{ type: "amulet" }], 2)).toEqual({ results: [{ premium: 59 }] });
  });
  it("charges initial assessment per quoted item and follow-up discount per later contract, yielding 165 G then 160 G for specified cursed swords", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] },
      { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
    ] })).toEqual({ results: [{ premium: 145 }, { premium: 160 }] });
  });
  it("creates policy insurance sums and caps from item values, including duplicate swords, a cursed sword, and a sword plus three runes", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [] } },
    ] })).toEqual({ results: [{ premium: 183 }, { payout: 0, remainingCap: 3500 }] });
  });
  it("pays standard damage after one deductible: sword damage 500 pays 400 and rune damage 200 pays 100", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }, { type: "rune" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }, { itemType: "rune", amount: 200 }] } }] })).toEqual({ results: [{ premium: 143 }, { payout: 500, remainingCap: 2000 }] });
  });
  it("pays each damage entry independently: dragon sword 500 plus amulet 300 pays 600", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "dragon" }, { type: "amulet" }] }, { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } }] }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("applies enchantment-8 half reimbursement before deductible, which wins over dragon material at enchantment 9", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon material below enchantment 8 after deductible", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }] }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("limits successive payouts to the cap: 1400 then 600 with cap exhausted", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } }] }).results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rejects unknown quote items, invalid or over-count claim items, and negative damage without stdout results", () => {
    expect(() => quote([{ type: "broomstick" }])).toThrow("Unknown item type");
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 1 }] } }] })).toThrow("Invalid damage");
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }] })).toThrow("Invalid damage");
  });
  it("exposes the scenario processor through the src/cli.ts JSON stdin/stdout executable contract", () => {
    const output = execFileSync("./node_modules/.bin/tsx", ["src/cli.ts"], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }),
      encoding: "utf8",
    });
    expect(JSON.parse(output)).toEqual({ results: [{ premium: 5 }] });
  });
});
