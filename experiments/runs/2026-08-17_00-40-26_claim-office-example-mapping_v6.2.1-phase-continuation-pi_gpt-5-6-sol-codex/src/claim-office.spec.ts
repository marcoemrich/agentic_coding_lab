import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import {
  calculateBasePremium,
  calculateDamagePayout,
  calculateInsuranceSum,
  calculatePremium,
  processScenario,
  roundPayout,
  roundPremium,
} from "./claim-office.js";

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(calculatePremium([], 0, 0)).toBe(5);
  });
  it("uses the price-list base premiums and insurance values for every item type", () => {
    const types = ["sword", "amulet", "staff", "potion", "rune", "moonstone"];
    expect(types.map((type) => calculateBasePremium([{ type }]))).toEqual([100, 60, 80, 40, 25, 25]);
    expect(types.map((type) => calculateInsuranceSum([{ type }]))).toEqual([1000, 600, 800, 400, 250, 250]);
  });
  it("prices 2, 3, 4, and 7 alike runes at 50, 60, 100, and 175 G base premium", () => {
    const rune = { type: "rune" };
    expect([2, 3, 4, 7].map((count) => calculateBasePremium(Array(count).fill(rune)))).toEqual([
      50, 60, 100, 175,
    ]);
  });
  it("requires component blocks to have exactly three of the same type: mixed is 75 G and two blocks are 120 G", () => {
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
    expect(calculateBasePremium([
      ...Array(3).fill({ type: "rune" }),
      ...Array(3).fill({ type: "moonstone" }),
    ])).toBe(120);
  });
  it("scopes curse and enchantment modifiers to affected items and applies thresholds at enchantment 5", () => {
    expect(calculatePremium([{ type: "sword", cursed: true }, { type: "amulet" }], 0, 0)).toBe(231);
    expect(calculatePremium([{ type: "sword", cursed: true, enchantment: 5 }], 0, 0)).toBe(195);
    expect(calculatePremium([{ type: "sword", cursed: true, enchantment: 4 }], 0, 0)).toBe(165);
    expect(calculatePremium([{ type: "sword", enchantment: 5 }], 0, 0)).toBe(145);
  });
  it("applies the 20% loyalty discount starting at exactly 2 years", () => {
    expect(calculatePremium([{ type: "sword" }], 1, 0)).toBe(115);
    expect(calculatePremium([{ type: "sword" }], 2, 0)).toBe(95);
  });
  it("quotes a newcomer's cursed sword at 165 G", () => {
    expect(calculatePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0, 0)).toBe(165);
  });
  it("quotes a long-standing customer's second-contract cursed enchanted sword at 160 G", () => {
    expect(calculatePremium([{ type: "sword", cursed: true, enchantment: 7 }], 3, 1)).toBe(160);
  });
  it("rounds 197.5 G premium up to 198 and 350.5 G payout down to 350 only at the end", () => {
    expect(roundPremium(197.5)).toBe(198);
    expect(roundPayout(350.5)).toBe(350);
    const result = processScenario({ customer: customer(), steps: [
      { op: "quote", items: [
        { type: "sword", enchantment: 8 }, { type: "sword", enchantment: 8 },
      ] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [
        { itemType: "sword", amount: 701 }, { itemType: "sword", amount: 701 },
      ] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 501, remainingCap: 3499 });
  });
  it("reimburses ordinary sword damage 500 at 400 and rune damage 200 at 100", () => {
    expect(calculateDamagePayout({ type: "sword", material: "steel", enchantment: 3 }, 500)).toBe(400);
    expect(calculateDamagePayout({ type: "rune" }, 200)).toBe(100);
    expect(calculateDamagePayout({ type: "sword" }, 50)).toBe(0);
  });
  it("resolves enchantment and dragon clauses: exact 8 and level 9 pay 400, dragon level 5 pays 700", () => {
    expect(calculateDamagePayout({ type: "sword", material: "dragon", enchantment: 8 }, 1000)).toBe(400);
    expect(calculateDamagePayout({ type: "sword", material: "dragon", enchantment: 9 }, 1000)).toBe(400);
    expect(calculateDamagePayout({ type: "sword", material: "dragon", enchantment: 5 }, 800)).toBe(700);
    expect(calculateDamagePayout({ type: "sword", material: "steel", enchantment: 9 }, 1000)).toBe(400);
  });
  it("applies a separate 100 G deductible to sword 500 and amulet 300 for total payout 600", () => {
    const result = processScenario({
      customer: customer(),
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
        ] } },
      ],
    }) as { results: unknown[] };
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("supports two insured swords as distinct damages with insurance sum 2000 and cap 4000", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    expect(calculateInsuranceSum(items)).toBe(2000);
    const result = processScenario({ customer: customer(), steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects a claim containing more damages of a type than the policy insures", () => {
    expect(() => processScenario({ customer: customer(), steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ] } },
    ] })).toThrow(/more.*sword|not insured/i);
  });
  it("bases caps on unmodified values: sword+amulet 3200, cursed sword 2000, sword+3 runes 3500", () => {
    expect(calculateInsuranceSum([{ type: "sword" }, { type: "amulet" }]) * 2).toBe(3200);
    expect(calculateInsuranceSum([{ type: "sword", cursed: true }]) * 2).toBe(2000);
    expect(calculateInsuranceSum([{ type: "sword" }, ...Array(3).fill({ type: "rune" })]) * 2).toBe(3500);
  });
  it("exhausts a sword policy cap across claims: payouts 1400 then 600, remaining cap 0", () => {
    const claim = { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] } };
    const result = processScenario({ customer: customer(), steps: [
      { op: "quote", items: [{ type: "sword" }] }, claim, claim,
    ] });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rejects an unknown quote item such as broomstick", () => {
    expect(() => processScenario({ customer: customer(), steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] })).toThrow(/unknown item type.*broomstick/i);
  });
  it("rejects unknown or uninsured damage item types", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      expect(() => processScenario({ customer: customer(), steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType, amount: 200 }] } },
      ] })).toThrow(/not insured/i);
    }
  });
  it("rejects a negative damage amount", () => {
    expect(() => processScenario({ customer: customer(), steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ] })).toThrow(/negative|non-negative|amount/i);
  });
  it("processes quote and claim steps sequentially with the normative result shape", () => {
    const scenario = { customer: customer(5), steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const cli = spawnSync("./node_modules/.bin/tsx", ["src/cli.ts"], {
      input: JSON.stringify(scenario), encoding: "utf8",
    });
    expect(cli.status, cli.stderr).toBe(0);
    expect(JSON.parse(cli.stdout)).toEqual({ results: [
      { premium: 59 }, { payout: 100, remainingCap: 1100 },
    ] });
  });
});
