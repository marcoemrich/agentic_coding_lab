import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { adjustedItemSubtotal, basePremium, insuranceValue, policyCap, roundPayout, roundPremium, runScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price list for sword 1000/100, amulet 600/60, staff 800/80, and potion 400/40", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => [insuranceValue(type), basePremium([{ type }])]))
      .toEqual([[1000, 100], [600, 60], [800, 80], [400, 40]]);
  });
  it("prices 2 runes at a 50 G component base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("prices exactly 3 runes as one 60 G building block", () => {
    expect(basePremium(Array.from({ length: 3 }, () => ({ type: "rune" })))).toBe(60);
  });
  it("prices 4 runes at 100 G because a block requires exactly 3", () => {
    expect(basePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(100);
  });
  it("prices 7 runes at 175 G with no partial building block", () => {
    expect(basePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("prices 2 runes plus 1 moonstone at 75 G because alike means the exact type", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("prices 3 runes plus 3 moonstones as two separate blocks totaling 120 G", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(basePremium(items)).toBe(120);
  });
  it("applies a cursed surcharge only to the cursed sword: sword plus amulet subtotal is 210 G", () => {
    expect(adjustedItemSubtotal([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(210);
  });
  it("applies the 20 percent loyalty discount at exactly 2 years: a plain sword quote is 95 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }))
      .toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5: sword subtotal is 180 G", () => {
    expect(adjustedItemSubtotal([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(180);
  });
  it("does not apply high-enchantment below 5: cursed enchantment-4 sword subtotal is 150 G", () => {
    expect(adjustedItemSubtotal([{ type: "sword", cursed: true, enchantment: 4 }])).toBe(150);
  });
  it("quotes a newcomer's cursed sword at 165 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's cursed enchantment-7 sword on their second contract at 160 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote" as const, items: [] },
      { op: "quote" as const, items: [{ type: "sword", cursed: true, enchantment: 7 }] },
    ] };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("rounds a fractional final premium of 197.5 G up to 198 G", () => {
    expect(roundPremium(197.5)).toBe(198);
  });
  it("bases a cursed sword policy cap on 1000 G insurance value, yielding a 2000 G cap", () => {
    expect(policyCap([{ type: "sword", cursed: true }])).toBe(2000);
  });
  it("counts two insured swords separately: insurance sum 2000 G and cap 4000 G", () => {
    expect(policyCap([{ type: "sword" }, { type: "sword" }])).toBe(4000);
  });
  it("sums sword and amulet insurance values to 1600 G and a 3200 G cap", () => {
    expect(policyCap([{ type: "sword" }, { type: "amulet" }])).toBe(3200);
  });
  it("keeps a sword plus 3-rune block insurance sum at 1750 G despite its premium discount", () => {
    expect(policyCap([{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))])).toBe(3500);
  });
  it("reimburses regular sword damage of 500 G at 400 G after one deductible", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses rune damage of 200 G at 100 G without item special clauses", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for dragon-material enchantment-8 sword damage of 1000 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("lets the 50 percent rule win for dragon-material enchantment-9 damage: 1000 G pays 400 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon-material enchantment-5 damage: 800 G pays 700 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 800 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("halves steel enchantment-9 damage: 1000 G pays 400 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies a deductible per damaged item: sword 500 plus amulet 300 pays 600 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("treats two sword damage entries as separate insured items with separate deductibles", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim through a non-zero CLI exit when sword damages outnumber insured swords", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ] };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/insured|damage/i);
    expect(result.stdout).toBe("");
  });
  it("exhausts a sword policy cap across claims: payouts are 1400 G then 600 G, leaving 0 G", () => {
    const damage = { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] };
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: damage },
      { op: "claim", policy: 0, incident: damage },
    ] });
    expect(result.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a fractional final payout of 350.5 G down to 350 G", () => {
    expect(roundPayout(350.5)).toBe(350);
  });
  it("rejects an unknown quote item through a non-zero CLI exit, stderr description, and no stdout result", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown|broomstick/i);
    expect(result.stdout).toBe("");
  });
  it("rejects a claim for an unlisted item through a non-zero CLI exit and stderr description", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not insured/i);
  });
  it("rejects a claim with an unknown item type through a non-zero CLI exit and stderr description", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick|not insured/i);
  });
  it("rejects negative damage through a non-zero CLI exit and stderr description", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ] };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/negative|amount/i);
  });
  it("processes schema-shaped quote and later claim steps in order with exact result field names", () => {
    const input = { customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const result = spawnSync("./claim-office", { input: JSON.stringify(input), encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(result.stderr).toBe("");
  });
});
