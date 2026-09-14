import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario, type Item } from "./claim-office.js";

const quote = (items: Item[] = [], yearsWithMHPCO = 0) =>
  processScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];

const cli = (scenario: unknown) => spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
  input: JSON.stringify(scenario), encoding: "utf8",
});

describe("MHPCO claim office", () => {
  it("empty quote returns premium 5 G", () => {
    expect(quote()).toEqual({ premium: 5 });
  });
  it("main item price list uses base premiums sword 100, amulet 60, staff 80, potion 40 G", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => quote([{ type }])))
      .toEqual([{ premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 }]);
  });
  it("2/3/4/7 alike components have base premiums 50/60/100/175 G", () => {
    const runes = (count: number) => quote(Array.from({ length: count }, () => ({ type: "rune" })));
    expect([2, 3, 4, 7].map(runes)).toEqual([
      { premium: 60 }, { premium: 71 }, { premium: 115 }, { premium: 198 },
    ]);
  });
  it("blocks require exact component type and two typed triples have base premium 120 G", () => {
    const items = (runes: number, moonstones: number): Item[] => [
      ...Array.from({ length: runes }, () => ({ type: "rune" })),
      ...Array.from({ length: moonstones }, () => ({ type: "moonstone" })),
    ];
    expect(quote(items(2, 1))).toEqual({ premium: 88 });
    expect(quote(items(3, 3))).toEqual({ premium: 137 });
  });
  it("cursed surcharge is item-scoped: cursed sword plus plain amulet integrates to 231 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 });
  });
  it("newcomer with cursed sword receives premium 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]))
      .toEqual({ premium: 165 });
  });
  it("exactly 2 years activates loyalty discount", () => {
    expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 });
  });
  it("enchantment 5 activates surcharge and stacks with curse while enchantment 4 does not", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ premium: 195 });
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toEqual({ premium: 165 });
  });
  it("long-standing customer's second contract costs 160 G and each item retains initial assessment", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("premium result 197.5 rounds up to 198 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", cursed: true }, { type: "rune" }, { type: "rune" }] },
    ] });
    expect(result.results[1]).toEqual({ premium: 198 });
  });
  it("standard sword and rune damage pay 400 G and 100 G", () => {
    const claim = (item: Item, amount: number) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [item] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: item.type, amount }] } },
    ] }).results[1];
    expect(claim({ type: "sword", material: "steel", enchantment: 3 }, 500))
      .toEqual({ payout: 400, remainingCap: 1600 });
    expect(claim({ type: "rune" }, 200)).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("enchantment and dragon examples pay 400/400/700/400 G", () => {
    const payout = (material: string, enchantment: number, amount: number) => processScenario({
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", material, enchantment }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount }] } },
      ],
    }).results[1].payout;
    expect([
      payout("dragon", 8, 1000), payout("dragon", 9, 1000),
      payout("dragon", 5, 800), payout("steel", 9, 1000),
    ]).toEqual([400, 400, 700, 400]);
  });
  it("two damaged items each receive a deductible for total payout 600 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two insured swords are distinct and have a 4000 G cap", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("more damage entries of a type than insured rejects the whole claim", () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ] } },
    ] })).toThrow();
  });
  it("sword plus amulet insurance cap is 3200 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "loss", damages: [
        { itemType: "sword", amount: 5000 }, { itemType: "amulet", amount: 5000 },
      ] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("curse premium modifiers do not raise sword cap above 2000 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "loss", damages: [{ itemType: "sword", amount: 5000 }] } },
    ] });
    expect(result.results).toEqual([{ premium: 165 }, { payout: 2000, remainingCap: 0 }]);
  });
  it("component block discount does not reduce sword plus three rune cap below 3500 G", () => {
    const damages = [
      { itemType: "sword", amount: 5000 },
      ...Array.from({ length: 3 }, () => ({ itemType: "rune", amount: 5000 })),
    ];
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "loss", damages } },
    ] });
    expect(result.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("successive 1500 G sword claims pay 1400 G then 600 G", () => {
    const incident = { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] };
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident },
      { op: "claim", policy: 0, incident },
    ] });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("raw payout 350.5 G rounds down to 350 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("unknown quote type exits non-zero with stderr and no stdout results", () => {
    const result = cli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Unknown item type");
    expect(result.stdout).toBe("");
  });
  it("uninsured damage type exits non-zero with stderr", () => {
    const result = cli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("not insured");
  });
  it("unknown damage type exits non-zero with stderr", () => {
    const result = cli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("negative damage exits non-zero with stderr", () => {
    const result = cli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("claim-office executable reads stdin and writes stdout", () => {
    const result = spawnSync("./claim-office", [], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }),
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
});
