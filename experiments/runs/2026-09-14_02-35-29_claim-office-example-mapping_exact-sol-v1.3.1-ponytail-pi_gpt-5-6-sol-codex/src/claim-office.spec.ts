import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario, type Item } from "./claim-office.js";

const quote = (items: Item[], yearsWithMHPCO = 0) =>
  runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];

const policy = (items: Item[], damages: { itemType: string; amount: number }[], yearsWithMHPCO = 0) =>
  runScenario({ customer: { yearsWithMHPCO }, steps: [
    { op: "quote", items },
    { op: "claim", policy: 0, incident: { cause: "incident", damages } },
  ] }).results;

describe("MHPCO claim office", () => {
  it("empty quote costs 5 G", () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
  it("main-item newcomer premiums are sword 115, amulet 71, staff 93, potion 49 G", () => {
    expect(["sword", "amulet", "staff", "potion"].map(type => quote([{ type }]))).toEqual([
      { premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 },
    ]);
  });
  it("2 runes cost 60 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual({ premium: 60 });
  });
  it("exactly 3 runes use the block and cost 71 G", () => {
    expect(quote(Array.from({ length: 3 }, () => ({ type: "rune" })))).toEqual({ premium: 71 });
  });
  it("4 runes do not use the block and cost 115 G", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({ premium: 115 });
  });
  it("7 runes cost 198 G after rounding up from 197.5 G", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ premium: 198 });
  });
  it("2 runes plus 1 moonstone do not form a block and cost 88 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({ premium: 88 });
  });
  it("3 runes plus 3 moonstones form two blocks and cost 137 G", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map(type => ({ type }));
    expect(quote(items)).toEqual({ premium: 137 });
  });
  it("cursed sword plus plain amulet applies curse only to sword and costs 231 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 });
  });
  it("exactly 2 customer years applies loyalty and a sword costs 95 G", () => {
    expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 });
  });
  it("enchantment 5 and curse both apply and sword costs 195 G", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ premium: 195 });
  });
  it("enchantment 4 alone adds no enchantment surcharge and sword costs 115 G", () => {
    expect(quote([{ type: "sword", enchantment: 4 }])).toEqual({ premium: 115 });
  });
  it("newcomer's cursed sword costs 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
  });
  it("long-standing customer's second cursed enchantment-7 sword quote costs 160 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [{ type: "amulet" }] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("fractional premium is rounded up only at the end", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ premium: 198 });
  });
  it("regular sword damage 500 G pays 400 G", () => {
    expect(policy([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }])[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 G pays 100 G", () => {
    expect(policy([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])[1])
      .toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon enchantment-8 sword damage 1000 G pays 400 G", () => {
    expect(policy([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }])[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon enchantment-9 sword damage 1000 G pays 400 G", () => {
    expect(policy([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }])[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon enchantment-5 sword damage 800 G pays 700 G", () => {
    expect(policy([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }])[1])
      .toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel enchantment-9 sword damage 1000 G pays 400 G", () => {
    expect(policy([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }])[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword 500 G and amulet 300 G damage pay 600 G with two deductibles", () => {
    expect(policy([{ type: "sword" }, { type: "amulet" }], [
      { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
    ])[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two insured swords have 4000 G cap and separate damage deductibles", () => {
    expect(policy([{ type: "sword" }, { type: "sword" }], [
      { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
    ])[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("sword and amulet policy has 3200 G cap", () => {
    expect(policy([{ type: "sword" }, { type: "amulet" }], [])[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword cap remains 2000 G despite premium modifiers", () => {
    expect(policy([{ type: "sword", cursed: true }], [])[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sword plus 3-rune block has 3500 G cap", () => {
    expect(policy([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], [])[1])
      .toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("successive 1500 G sword claims pay 1400 then 600 G and exhaust cap", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("fractional payout 350.5 G rounds down to 350 G", () => {
    expect(policy([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }])[1])
      .toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("unknown quote item, uninsured or excess claim item, and negative damage throw Error", () => {
    const scenario = (items: Item[], damages: { itemType: string; amount: number }[]) => () => policy(items, damages);
    const invalid = [
      () => quote([{ type: "broomstick" }]),
      scenario([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }]),
      scenario([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }]),
      scenario([{ type: "sword" }], [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }]),
      scenario([{ type: "sword" }], [{ itemType: "sword", amount: -200 }]),
    ];
    for (const execute of invalid) expect(execute).toThrow(Error);
  });
  it("CLI emits ordered JSON and invalid input exits non-zero with stderr and no stdout", () => {
    const execute = (input: unknown) => spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify(input), encoding: "utf8",
    });
    const valid = execute({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(valid.status).toBe(0);
    expect(JSON.parse(valid.stdout)).toEqual({ results: [
      { premium: 59 }, { payout: 100, remainingCap: 1100 },
    ] });

    const invalid = execute({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    expect(invalid.status).not.toBe(0);
    expect(invalid.stderr).not.toBe("");
    expect(invalid.stdout).toBe("");
  });
});
