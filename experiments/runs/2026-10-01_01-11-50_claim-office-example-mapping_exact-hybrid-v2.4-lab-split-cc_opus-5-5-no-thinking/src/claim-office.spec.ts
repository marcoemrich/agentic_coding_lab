import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario, type Item } from "./claim-office.js";

const runes = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "rune" }));
const moonstones = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "moonstone" }));

const premiumFor = (items: Item[], yearsWithMHPCO = 0) =>
  runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });

type Damage = { itemType: string; amount: number };

const claimResultsFor = (items: Item[], ...claims: Damage[][]) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      ...claims.map((damages) => ({
        op: "claim" as const,
        policy: 0,
        incident: { cause: "dragon attack", damages },
      })),
    ],
  }).results.slice(1);

describe("Claim Office — quote", () => {
  it("empty item list → premium 5 G (only the processing fee)", () => {
    expect(premiumFor([])).toEqual({ results: [{ premium: 5 }] });
  });
  it("plain sword, newcomer → premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(premiumFor([{ type: "sword", material: "steel", enchantment: 3, cursed: false }])).toEqual({
      results: [{ premium: 115 }],
    });
  });
  it("plain amulet, newcomer → premium 71 G (60 + 6 + 5)", () => {
    expect(premiumFor([{ type: "amulet" }])).toEqual({ results: [{ premium: 71 }] });
  });
  it("plain staff, newcomer → premium 93 G (80 + 8 + 5)", () => {
    expect(premiumFor([{ type: "staff" }])).toEqual({ results: [{ premium: 93 }] });
  });
  it("plain potion, newcomer → premium 49 G (40 + 4 + 5)", () => {
    expect(premiumFor([{ type: "potion" }])).toEqual({ results: [{ premium: 49 }] });
  });
  it("2 runes → 50 G base premium → premium 60 G", () => {
    expect(premiumFor(runes(2))).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block) → premium 71 G", () => {
    expect(premiumFor(runes(3))).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block) → premium 115 G", () => {
    expect(premiumFor(runes(4))).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium → 197.5 G rounded up to premium 198 G", () => {
    expect(premiumFor(runes(7))).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone → 75 G base premium (different types, no block) → premium 88 G", () => {
    expect(premiumFor([...runes(2), ...moonstones(1)])).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → 120 G base premium (two blocks) → premium 137 G", () => {
    expect(premiumFor([...runes(3), ...moonstones(3)])).toEqual({ results: [{ premium: 137 }] });
  });
  it("newcomer with a cursed sword (steel, enchantment 3) → premium 165 G", () => {
    expect(premiumFor([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({
      results: [{ premium: 165 }],
    });
  });
  it("sword with enchantment 4 → no high-enchantment surcharge → premium 115 G", () => {
    expect(premiumFor([{ type: "sword", enchantment: 4 }])).toEqual({ results: [{ premium: 115 }] });
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge → premium 145 G", () => {
    expect(premiumFor([{ type: "sword", enchantment: 5 }])).toEqual({ results: [{ premium: 145 }] });
  });
  it("cursed sword with exactly enchantment 5 → both surcharges → premium 195 G", () => {
    expect(premiumFor([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ results: [{ premium: 195 }] });
  });
  it("cursed sword + plain amulet → curse surcharge only on sword base (210 G) → premium 231 G", () => {
    expect(premiumFor([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({
      results: [{ premium: 231 }],
    });
  });
  it("customer with exactly 2 years → loyalty discount applies → plain sword premium 95 G", () => {
    expect(premiumFor([{ type: "sword" }], 2)).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year → no loyalty discount → plain sword premium 115 G", () => {
    expect(premiumFor([{ type: "sword" }], 1)).toEqual({ results: [{ premium: 115 }] });
  });
  it("second quote in scenario → 15 % follow-up discount, first insurance still applies → plain sword premium 100 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("long-standing customer's second contract, cursed sword enchantment 7 → premium 160 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const output = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [cursedSword] },
        { op: "quote", items: [cursedSword] },
      ],
    });
    expect(output.results[1]).toEqual({ premium: 160 });
  });
  it("quote with an unknown item type (broomstick) → rejected with an error", () => {
    expect(() => premiumFor([{ type: "broomstick" }])).toThrow(/broomstick/);
  });
});

describe("Claim Office — claim", () => {
  it("regular steel sword enchantment 3, damage 500 → payout 400, remainingCap 1600", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3 };
    expect(claimResultsFor([sword], [{ itemType: "sword", amount: 500 }])).toEqual([
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("rune damage 200 → payout 100, remainingCap 400", () => {
    expect(claimResultsFor(runes(1), [{ itemType: "rune", amount: 200 }])).toEqual([
      { payout: 100, remainingCap: 400 },
    ]);
  });
  it("schema example: amulet damage 200 → payout 100, remainingCap 1100", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("dragon-material sword enchantment 8, damage 1000 → payout 400", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 8 };
    expect(claimResultsFor([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("dragon-material sword enchantment 9, damage 1000 → payout 400 (50 % rule wins)", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 9 };
    expect(claimResultsFor([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("dragon-material sword enchantment 5, damage 800 → payout 700", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 5 };
    expect(claimResultsFor([sword], [{ itemType: "sword", amount: 800 }])).toEqual([
      { payout: 700, remainingCap: 1300 },
    ]);
  });
  it("steel sword enchantment 9, damage 1000 → payout 400", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimResultsFor([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("payout of 350.5 G is rounded down to 350 G (enchantment 9, damage 901)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimResultsFor([sword], [{ itemType: "sword", amount: 901 }])).toEqual([
      { payout: 350, remainingCap: 1650 },
    ]);
  });
  it("sword (500) + amulet (300) damaged in one event → deductible per item → payout 600, remainingCap 2600", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(claimResultsFor([{ type: "sword" }, { type: "amulet" }], damages)).toEqual([
      { payout: 600, remainingCap: 2600 },
    ]);
  });
  it("two swords insured, both damaged 500 → each its own deductible → payout 800, remainingCap 3200", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(claimResultsFor([{ type: "sword" }, { type: "sword" }], damages)).toEqual([
      { payout: 800, remainingCap: 3200 },
    ]);
  });
  it("cursed sword cap is based on insurance value 1000 → damage 500 → remainingCap 1600", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "curse", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 165 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("sword + 3 runes → insurance sum 1750, cap 3500 → sword damage 500 → remainingCap 3100", () => {
    expect(claimResultsFor([{ type: "sword" }, ...runes(3)], [{ itemType: "sword", amount: 500 }])).toEqual([
      { payout: 400, remainingCap: 3100 },
    ]);
  });
  it("two successive 1500 G claims on a sword → payouts 1400 then 600, remainingCap 600 then 0", () => {
    const damage = { itemType: "sword", amount: 1500 };
    expect(claimResultsFor([{ type: "sword" }], [damage], [damage])).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("more damage entries of a type than insured items → claim rejected", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(() => claimResultsFor([{ type: "sword" }], damages)).toThrow();
  });
  it("damage to an item not in the policy → claim rejected", () => {
    expect(() => claimResultsFor([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }])).toThrow();
  });
  it("damage to an unknown item type → claim rejected", () => {
    expect(() => claimResultsFor([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }])).toThrow();
  });
  it("damage with negative amount → claim rejected", () => {
    expect(() => claimResultsFor([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow();
  });
});

const runCli = (input: string) =>
  spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes results JSON to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const result = runCli(JSON.stringify(scenario));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("exits non-zero with an error on stderr and no results on stdout for invalid input", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const result = runCli(JSON.stringify(scenario));
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broomstick");
    expect(result.stdout).toBe("");
  });
});
