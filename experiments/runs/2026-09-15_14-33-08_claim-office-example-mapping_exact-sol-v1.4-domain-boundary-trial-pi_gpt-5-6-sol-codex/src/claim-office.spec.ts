import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { basePremium, itemAdjustedPremium, runScenario } from "./claim-office.js";

function runCli(input: unknown) {
  return spawnSync("./claim-office", [], {
    input: JSON.stringify(input), encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price list for sword 100 G, amulet 60 G, staff 80 G, and potion 40 G base premiums", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => basePremium([{ type }])))
      .toEqual([100, 60, 80, 40]);
  });
  it("prices alike rune quantities 2 at 50 G, 3 at 60 G, 4 at 100 G, and 7 at 175 G base", () => {
    const runes = (count: number) => Array.from({ length: count }, () => ({ type: "rune" }));
    expect([2, 3, 4, 7].map((count) => basePremium(runes(count))))
      .toEqual([50, 60, 100, 175]);
  });
  it("does not form a block from 2 runes and 1 moonstone: 75 G base", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("forms separate blocks from 3 runes and 3 moonstones: 120 G base", () => {
    const types = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"];
    expect(basePremium(types.map((type) => ({ type })))).toBe(120);
  });
  it("applies a cursed surcharge only to the cursed sword: sword plus amulet is 210 G before policy modifiers and fee", () => {
    expect(itemAdjustedPremium([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }]))
      .toBe(210);
  });
  it("applies the loyalty discount at exactly 2 years", () => {
    const premiumAt = (yearsWithMHPCO: number) => runScenario({
      customer: { yearsWithMHPCO }, steps: [{ op: "quote", items: [{ type: "sword" }] }],
    }).results[0];
    expect([premiumAt(1), premiumAt(2)]).toEqual([{ premium: 115 }, { premium: 95 }]);
  });
  it("applies high enchantment at exactly 5 and not at 4 while also applying curse", () => {
    const premiumAt = (enchantment: number) => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment }] }],
    }).results[0];
    expect([premiumAt(4), premiumAt(5)]).toEqual([{ premium: 165 }, { premium: 195 }]);
  });
  it("quotes a newcomer with a cursed sword at 165 G", () => {
    expect(runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second contract with a new cursed enchanted sword at 160 G", () => {
    const output = runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] });
    expect(output.results[1]).toEqual({ premium: 160 });
  });
  it("pays 400 G for dragon material at exactly enchantment 8 with 1000 G damage", () => {
    const output = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies one deductible to each of sword 500 G and amulet 300 G damage: payout 600 G", () => {
    const output = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays a regular enchantment-3 steel sword's 500 G damage at 400 G", () => {
    const output = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays rune damage of 200 G at 100 G without item special clauses", () => {
    const output = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("resolves dragon and enchantment clauses: 400 G at level 9 dragon, 700 G at level 5 dragon, 400 G at level 9 steel", () => {
    const payout = (material: string, enchantment: number, amount: number) => runScenario({
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", material, enchantment }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount }] } },
      ],
    }).results[1];
    expect([payout("dragon", 9, 1000), payout("dragon", 5, 800), payout("steel", 9, 1000)])
      .toEqual([
        { payout: 400, remainingCap: 1600 }, { payout: 700, remainingCap: 1300 },
        { payout: 400, remainingCap: 1600 },
      ]);
  });
  it("insures two swords for 2000 G with a 4000 G cap", () => {
    const output = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries as separate damages with separate deductibles", () => {
    const output = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 1500 }, { itemType: "sword", amount: 1500 },
      ] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 2800, remainingCap: 1200 });
  });
  it("rejects a whole CLI claim when sword damages outnumber insured swords", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 1500 }, { itemType: "sword", amount: 1500 },
      ] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("bases caps on unmodified item values: sword plus amulet 3200 G, cursed sword 2000 G, sword plus 3 runes 3500 G", () => {
    const cap = (items: Array<{ type: string; cursed?: boolean }>) => runScenario({
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    }).results[1];
    expect([
      cap([{ type: "sword" }, { type: "amulet" }]), cap([{ type: "sword", cursed: true }]),
      cap([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ]).toEqual([
      { payout: 0, remainingCap: 3200 }, { payout: 0, remainingCap: 2000 },
      { payout: 0, remainingCap: 3500 },
    ]);
  });
  it("exhausts a sword policy cap across claims: payouts 1400 G then 600 G, leaving 0 G", () => {
    const output = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] });
    expect(output.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a 197.5 G premium up to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 198 }] });
  });
  it("rounds a 350.5 G payout down to 350 G and keeps intermediate fractions", () => {
    const output = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects an unknown quote item via CLI with stderr, non-zero status, and no stdout results", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("rejects uncovered and unknown damage item types via CLI with stderr and non-zero status", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType, amount: 200 }] } },
      ] });
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    }
  });
  it("rejects a negative damage amount via CLI with stderr and non-zero status", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("reads sequential JSON steps and writes ordered quote and claim result objects", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
