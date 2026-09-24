import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { type Damage, type Item, runScenario } from "./claimOffice.js";

// Reading: base-premium examples are observed through a newcomer's (0 years) first quote,
// i.e. premium = ceil(base × 1.10 first-insurance + surcharges + 5 G fee).
// Reading: a rejected scenario means the CLI exits non-zero, writes a non-empty
// error description to stderr, and writes nothing to stdout.

function quotePremiums(yearsWithMHPCO: number, ...quotes: Item[][]): number[] {
  const steps = quotes.map((items) => ({ op: "quote" as const, items }));
  const output = runScenario({ customer: { yearsWithMHPCO }, steps });
  return output.results.map((result) => (result as { premium: number }).premium);
}

function quotePremium(items: Item[], yearsWithMHPCO = 0): number {
  return quotePremiums(yearsWithMHPCO, items)[0];
}

function claimResults(items: Item[], ...claims: Damage[][]): object[] {
  const claimSteps = claims.map((damages) => ({
    op: "claim" as const,
    policy: 0,
    incident: { cause: "dragon attack", damages },
  }));
  const output = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [{ op: "quote", items }, ...claimSteps],
  });
  return output.results.slice(1);
}

function components(type: string, count: number): Item[] {
  return Array.from({ length: count }, () => ({ type }));
}

describe("quote", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(quotePremium([])).toBe(5);
  });
  it("newcomer plain sword (base 100 G) -> premium 115 G", () => {
    expect(quotePremium([{ type: "sword" }])).toBe(115);
  });
  it("newcomer plain amulet (base 60 G) -> premium 71 G", () => {
    expect(quotePremium([{ type: "amulet" }])).toBe(71);
  });
  it("newcomer plain staff (base 80 G) -> premium 93 G", () => {
    expect(quotePremium([{ type: "staff" }])).toBe(93);
  });
  it("newcomer plain potion (base 40 G) -> premium 49 G", () => {
    expect(quotePremium([{ type: "potion" }])).toBe(49);
  });
  it("newcomer single rune (base 25 G) -> 32.5 G rounded up -> premium 33 G", () => {
    expect(quotePremium([{ type: "rune" }])).toBe(33);
  });
  it("newcomer single moonstone (base 25 G) -> premium 33 G", () => {
    expect(quotePremium([{ type: "moonstone" }])).toBe(33);
  });
  it("2 runes -> base 50 G -> premium 60 G", () => {
    expect(quotePremium(components("rune", 2))).toBe(60);
  });
  it("3 runes -> block base 60 G -> premium 71 G", () => {
    expect(quotePremium(components("rune", 3))).toBe(71);
  });
  it("4 runes -> no block, base 100 G -> premium 115 G", () => {
    expect(quotePremium(components("rune", 4))).toBe(115);
  });
  it("7 runes -> base 175 G -> 197.5 G rounded up in MHPCO's favor -> premium 198 G", () => {
    expect(quotePremium(components("rune", 7))).toBe(198);
  });
  it("2 runes + 1 moonstone -> no block (different types), base 75 G -> premium 88 G", () => {
    expect(quotePremium([...components("rune", 2), ...components("moonstone", 1)])).toBe(88);
  });
  it("3 runes + 3 moonstones -> two blocks, base 120 G -> premium 137 G", () => {
    expect(quotePremium([...components("rune", 3), ...components("moonstone", 3)])).toBe(137);
  });
  it("newcomer cursed steel sword enchantment 3 -> 100 + 50 curse + 10 first = 160 + 5 -> premium 165 G", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("sword with exactly enchantment 5 -> 100 + 30 + 10 + 5 -> premium 145 G", () => {
    expect(quotePremium([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("cursed sword with exactly enchantment 5 -> both surcharges -> premium 195 G", () => {
    expect(quotePremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("plain sword with enchantment 4 -> no high-enchantment surcharge -> premium 115 G", () => {
    expect(quotePremium([{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("customer with 1 year -> no loyalty discount on sword -> premium 115 G", () => {
    expect(quotePremium([{ type: "sword" }], 1)).toBe(115);
  });
  it("customer with exactly 2 years -> loyalty discount on sword -> 100 - 20 + 10 + 5 -> premium 95 G", () => {
    expect(quotePremium([{ type: "sword" }], 2)).toBe(95);
  });
  it("cursed sword + plain amulet -> curse on sword only: 160 + 50 + 16 first + 5 -> premium 231 G", () => {
    expect(quotePremium([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
  it("newcomer's second quote of a plain sword -> 100 + 10 - 15 + 5 -> premium 100 G", () => {
    expect(quotePremiums(0, [{ type: "sword" }], [{ type: "sword" }])).toEqual([115, 100]);
  });
  it("3-year customer's second quote, cursed steel sword enchantment 7 -> premium 160 G (first-insurance still applies)", () => {
    const cursedSteelSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(quotePremiums(3, [{ type: "sword" }], [cursedSteelSword])).toEqual([95, 160]);
  });
});

describe("claim", () => {
  it("regular steel sword enchantment 3, damage 500 G -> payout 400 G, remainingCap 1600 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3 };
    expect(claimResults([sword], [{ itemType: "sword", amount: 500 }])).toEqual([
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("amulet (value 600 G), damage 200 G -> payout 100 G, remainingCap 1100 G", () => {
    expect(claimResults([{ type: "amulet" }], [{ itemType: "amulet", amount: 200 }])).toEqual([
      { payout: 100, remainingCap: 1100 },
    ]);
  });
  it("staff (value 800 G), damage 200 G -> payout 100 G, remainingCap 1500 G", () => {
    expect(claimResults([{ type: "staff" }], [{ itemType: "staff", amount: 200 }])).toEqual([
      { payout: 100, remainingCap: 1500 },
    ]);
  });
  it("potion (value 400 G), damage 200 G -> payout 100 G, remainingCap 700 G", () => {
    expect(claimResults([{ type: "potion" }], [{ itemType: "potion", amount: 200 }])).toEqual([
      { payout: 100, remainingCap: 700 },
    ]);
  });
  it("rune (value 250 G), damage 200 G -> payout 100 G, remainingCap 400 G", () => {
    expect(claimResults([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual([
      { payout: 100, remainingCap: 400 },
    ]);
  });
  it("moonstone (value 250 G), damage 200 G -> payout 100 G, remainingCap 400 G", () => {
    expect(claimResults([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 200 }])).toEqual([
      { payout: 100, remainingCap: 400 },
    ]);
  });
  it("damage below the deductible (sword, 50 G) -> payout 0 G, remainingCap 2000 G (reading: deductible never yields a negative payout)", () => {
    expect(claimResults([{ type: "sword" }], [{ itemType: "sword", amount: 50 }])).toEqual([
      { payout: 0, remainingCap: 2000 },
    ]);
  });
  it("steel sword enchantment 9, damage 1000 G -> 50% then deductible -> payout 400 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimResults([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("dragon sword exactly enchantment 8, damage 1000 G -> payout 400 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 8 };
    expect(claimResults([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("dragon sword enchantment 9, damage 1000 G -> 50% rule wins -> payout 400 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 9 };
    expect(claimResults([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("dragon sword enchantment 5, damage 800 G -> full reimbursement -> payout 700 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 5 };
    expect(claimResults([sword], [{ itemType: "sword", amount: 800 }])).toEqual([
      { payout: 700, remainingCap: 1300 },
    ]);
  });
  it("sword enchantment 8, damage 901 G -> 350.5 G rounded down -> payout 350 G", () => {
    expect(claimResults([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }])).toEqual([
      { payout: 350, remainingCap: 1650 },
    ]);
  });
  it("sword + amulet damaged 500 G and 300 G -> deductible per item -> payout 600 G, remainingCap 2600 G (cap 3200 G)", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(claimResults([{ type: "sword" }, { type: "amulet" }], damages)).toEqual([
      { payout: 600, remainingCap: 2600 },
    ]);
  });
  it("two swords both damaged 500 G -> each own deductible -> payout 800 G, remainingCap 3200 G (cap 4000 G)", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(claimResults([{ type: "sword" }, { type: "sword" }], damages)).toEqual([
      { payout: 800, remainingCap: 3200 },
    ]);
  });
  it("sword + 3 runes (block) -> insurance sum 1750 G; sword damage 500 G -> payout 400 G, remainingCap 3100 G", () => {
    const items = [{ type: "sword" }, ...components("rune", 3)];
    expect(claimResults(items, [{ itemType: "sword", amount: 500 }])).toEqual([
      { payout: 400, remainingCap: 3100 },
    ]);
  });
  it("cursed sword -> cap 2000 G from unmodified value; damage 1500 G -> payout 1400 G, remainingCap 600 G", () => {
    expect(claimResults([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 1500 }])).toEqual([
      { payout: 1400, remainingCap: 600 },
    ]);
  });
  it("two successive 1500 G claims on a sword -> 1400/600 then 600/0 (reduced to remaining cap)", () => {
    const damage = { itemType: "sword", amount: 1500 };
    expect(claimResults([{ type: "sword" }], [damage], [damage])).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
});

function runCli(scenario: object) {
  return spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
}

function expectRejected(cli: ReturnType<typeof runCli>): void {
  expect(cli.status).not.toBe(0);
  expect(cli.stderr.trim()).not.toBe("");
  expect(cli.stdout).toBe("");
}

function claimScenario(insured: Item[], damages: Damage[]): object {
  return {
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items: insured },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  };
}

describe("claim-office CLI", () => {
  it("schema example (5 years, silver amulet enchantment 2, fire damage 200 G) -> results [{premium 59}, {payout 100, remainingCap 1100}]", () => {
    const cli = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(cli.status).toBe(0);
    expect(JSON.parse(cli.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("quote with unknown item type broomstick -> non-zero exit, stderr error, no stdout", () => {
    const cli = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expectRejected(cli);
  });
  it("claim damaging an amulet when only a sword is insured -> non-zero exit, stderr error, no stdout", () => {
    const cli = runCli(claimScenario([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }]));
    expectRejected(cli);
  });
  it("claim damaging an unknown item type -> non-zero exit, stderr error, no stdout", () => {
    const cli = runCli(claimScenario([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }]));
    expectRejected(cli);
  });
  it("claim with damage amount -200 -> non-zero exit, stderr error, no stdout", () => {
    const cli = runCli(claimScenario([{ type: "sword" }], [{ itemType: "sword", amount: -200 }]));
    expectRejected(cli);
  });
  it("claim with two sword damages but only one sword insured -> non-zero exit, stderr error, no stdout", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expectRejected(runCli(claimScenario([{ type: "sword" }], damages)));
  });
});
