import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { executeScenario, type ItemInput } from "./claim-office.js";

const quote = (items: ItemInput[], yearsWithMHPCO = 0) =>
  executeScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];

describe("MHPCO claim office", () => {
  it("empty quote costs 5 G", () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
  it("main-item price list quotes sword 115 G, amulet 71 G, staff 93 G, potion 49 G for a newcomer", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => quote([{ type }]))).toEqual([
      { premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 },
    ]);
  });
  it("2 runes have 50 G base premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual({ premium: 60 });
  });
  it("exactly 3 runes have 60 G block base premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toEqual({ premium: 71 });
  });
  it("4 runes have 100 G base premium", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({ premium: 115 });
  });
  it("7 runes have 175 G base premium", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ premium: 198 });
  });
  it("2 runes plus 1 moonstone do not form a block", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({ premium: 88 });
  });
  it("3 runes plus 3 moonstones form two blocks", () => {
    expect(quote([
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ])).toEqual({ premium: 137 });
  });
  it("cursed surcharge applies only to the cursed sword in a sword-and-amulet policy", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 });
  });
  it("exactly 2 years earns the loyalty discount", () => {
    expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 });
  });
  it("enchantment 5 and curse both add their item surcharges", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ premium: 195 });
  });
  it("enchantment 4 adds no enchantment surcharge", () => {
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toEqual({ premium: 165 });
  });
  it("newcomer cursed-sword integration premium is 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
  });
  it("a long-standing customer's second quote of a new cursed enchanted sword is 160 G", () => {
    const scenario = executeScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(scenario.results[1]).toEqual({ premium: 160 });
  });
  it("fractional premium is rounded upward only at the end", () => {
    expect(quote([{ type: "moonstone", cursed: true, enchantment: 5 }])).toEqual({ premium: 53 });
  });
  it("unknown quote type is rejected observably by the CLI", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const run = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/unknown item type/i);
    expect(run.stdout).toBe("");
  });
  it("regular sword damage 500 G pays 400 G", () => {
    const output = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 G pays 100 G", () => {
    const output = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("enchantment 8 dragon sword damage 1000 G pays 400 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("enchantment 9 dragon sword damage 1000 G pays 400 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("enchantment 5 dragon sword damage 800 G pays 700 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 800 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("enchantment 9 steel sword damage 1000 G pays 400 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to sword and amulet applies two deductibles and pays 600 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two insured swords produce a 4000 G cap and separate damage deductibles", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 },
      ] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("excess same-type damage entries reject the whole claim", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    const run = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/not covered/i);
    expect(run.stdout).toBe("");
  });
  it("unlisted or unknown damaged item is rejected", () => {
    const scenarioFor = (itemType: string) => () => executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType, amount: 200 }] } },
    ] });
    expect(scenarioFor("amulet")).toThrow(/not covered/i);
    expect(scenarioFor("broomstick")).toThrow(/not covered/i);
  });
  it("negative damage is rejected", () => {
    expect(() => executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "report", damages: [{ itemType: "sword", amount: -200 }] } },
    ] })).toThrow(/negative damage/i);
  });
  it("cap uses item insurance values despite curse and component block discounts", () => {
    const noDamage = { cause: "inspection", damages: [] };
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "quote", items: [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))] },
      { op: "claim", policy: 0, incident: noDamage },
      { op: "claim", policy: 1, incident: noDamage },
      { op: "claim", policy: 2, incident: noDamage },
    ] });
    expect(output.results.slice(3)).toEqual([
      { payout: 0, remainingCap: 3200 },
      { payout: 0, remainingCap: 2000 },
      { payout: 0, remainingCap: 3500 },
    ]);
  });
  it("successive claims pay 1400 G then 600 G, while fractional payout rounds down", () => {
    const capped = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] });
    expect(capped.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
    const fractional = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "rounding", damages: [{ itemType: "sword", amount: 901 }] } },
    ] });
    expect(fractional.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});
