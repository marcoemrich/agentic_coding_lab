import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario, type Damage, type Item, type QuoteResult, type Scenario, type StepResult } from "./claimOffice.js";

function quotePremium(items: Item[], yearsWithMHPCO = 0): number {
  const { results } = runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] });
  return (results[0] as QuoteResult).premium;
}

function successiveQuotePremiums(items: Item[], quotes: number, yearsWithMHPCO = 0): number[] {
  const steps = Array.from({ length: quotes }, () => ({ op: "quote" as const, items }));
  const { results } = runScenario({ customer: { yearsWithMHPCO }, steps });
  return results.map((result) => (result as QuoteResult).premium);
}

/** Insures `items` with one quote, then runs one claim per damage list against that policy. */
function claimResults(items: Item[], ...claims: Damage[][]): StepResult[] {
  const claimSteps = claims.map((damages) => ({
    op: "claim" as const,
    policy: 0,
    incident: { cause: "dragon attack", damages },
  }));
  const { results } = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }, ...claimSteps] });
  return results.slice(1);
}

/** The scenario given as the schema example in the specification. */
const schemaExampleScenario: Scenario = {
  customer: { yearsWithMHPCO: 5 },
  steps: [
    { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
    { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
  ],
};

/** Regular sword: no curse, enchantment below the high-enchantment level. */
const plainSword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };

function alikeComponents(count: number, type: string): Item[] {
  return Array.from({ length: count }, () => ({ type }));
}

// Reading adopted for premiums: every quote is a first insurance (+10 % of the
// policy base premium); follow-up contracts are later `quote` steps in the same
// scenario. Derived expected premiums show their arithmetic in the description.

describe("quote", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(quotePremium([])).toBe(5);
  });
  it("plain sword, newcomer -> premium 115 G (100 + 10 first insurance + 5 fee)", () => {
    expect(quotePremium([plainSword])).toBe(115);
  });
  it("plain amulet, newcomer -> premium 71 G (60 + 6 + 5)", () => {
    expect(quotePremium([{ type: "amulet", material: "silver", enchantment: 2, cursed: false }])).toBe(71);
  });
  it("plain staff, newcomer -> premium 93 G (80 + 8 + 5)", () => {
    expect(quotePremium([{ type: "staff", material: "oak", enchantment: 2, cursed: false }])).toBe(93);
  });
  it("plain potion, newcomer -> premium 49 G (40 + 4 + 5)", () => {
    expect(quotePremium([{ type: "potion", material: "glass", enchantment: 1, cursed: false }])).toBe(49);
  });
  it("1 rune, newcomer -> premium 33 G (25 + 2.5 + 5 = 32.5, rounded up in MHPCO's favor)", () => {
    expect(quotePremium([{ type: "rune" }])).toBe(33);
  });
  it("1 moonstone, newcomer -> premium 33 G (25 + 2.5 + 5 = 32.5, rounded up)", () => {
    expect(quotePremium([{ type: "moonstone" }])).toBe(33);
  });
  it("2 runes -> base 50 G -> premium 60 G (50 + 5 + 5)", () => {
    expect(quotePremium(alikeComponents(2, "rune"))).toBe(60);
  });
  it("3 runes -> block base 60 G -> premium 71 G (60 + 6 + 5)", () => {
    expect(quotePremium(alikeComponents(3, "rune"))).toBe(71);
  });
  it("4 runes -> no block, base 100 G -> premium 115 G", () => {
    expect(quotePremium(alikeComponents(4, "rune"))).toBe(115);
  });
  it("7 runes -> base 175 G -> premium 198 G (175 + 17.5 + 5 = 197.5, rounded up)", () => {
    expect(quotePremium(alikeComponents(7, "rune"))).toBe(198);
  });
  it("2 runes + 1 moonstone -> no block (different types), base 75 G -> premium 88 G (87.5 rounded up)", () => {
    expect(quotePremium([...alikeComponents(2, "rune"), { type: "moonstone" }])).toBe(88);
  });
  it("3 moonstones -> block base 60 G -> premium 71 G", () => {
    expect(quotePremium(alikeComponents(3, "moonstone"))).toBe(71);
  });
  it("3 runes + 3 moonstones -> two blocks, base 120 G -> premium 137 G (120 + 12 + 5)", () => {
    expect(quotePremium([...alikeComponents(3, "rune"), ...alikeComponents(3, "moonstone")])).toBe(137);
  });
  it("cursed sword (steel, enchantment 3), newcomer -> premium 165 G (100 + 50 curse + 10 + 5)", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("cursed sword + plain amulet -> curse on the sword only: 160 + 50 + 16 first insurance + 5 -> premium 231 G", () => {
    expect(
      quotePremium([
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ]),
    ).toBe(231);
  });
  it("sword with enchantment 4, not cursed -> no high-enchantment surcharge -> premium 115 G", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 4, cursed: false }])).toBe(115);
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge -> premium 145 G (100 + 30 + 10 + 5)", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 5, cursed: false }])).toBe(145);
  });
  it("cursed sword with enchantment 5 -> both surcharges -> premium 195 G (100 + 50 + 30 + 10 + 5)", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("customer with 1 year -> no loyalty discount; plain sword -> premium 115 G", () => {
    expect(quotePremium([plainSword], 1)).toBe(115);
  });
  it("customer with exactly 2 years -> loyalty discount; plain sword -> premium 95 G (100 - 20 + 10 + 5)", () => {
    expect(quotePremium([plainSword], 2)).toBe(95);
  });
  it("second quote of a newcomer -> follow-up discount; plain sword -> premium 100 G (100 + 10 - 15 + 5)", () => {
    expect(successiveQuotePremiums([plainSword], 2)).toEqual([115, 100]);
  });
  it("third quote also receives the follow-up discount; plain sword -> premium 100 G", () => {
    expect(successiveQuotePremiums([plainSword], 3)[2]).toBe(100);
  });
  it("long-standing customer's second contract, cursed sword enchantment 7, 3 years -> premium 160 G", () => {
    const cursedEnchantedSword: Item = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [plainSword] },
        { op: "quote", items: [cursedEnchantedSword] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });
});

describe("claim", () => {
  it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G, remaining cap 1600 G", () => {
    expect(claimResults([plainSword], [{ itemType: "sword", amount: 500 }])).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("rune, damage 200 G -> payout 100 G, remaining cap 400 G (cap 2 x 250)", () => {
    expect(claimResults([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual([{ payout: 100, remainingCap: 400 }]);
  });
  it("staff, damage 200 G -> payout 100 G, remaining cap 1500 G (cap 2 x 800)", () => {
    expect(claimResults([{ type: "staff" }], [{ itemType: "staff", amount: 200 }])).toEqual([{ payout: 100, remainingCap: 1500 }]);
  });
  it("potion, damage 200 G -> payout 100 G, remaining cap 700 G (cap 2 x 400)", () => {
    expect(claimResults([{ type: "potion" }], [{ itemType: "potion", amount: 200 }])).toEqual([{ payout: 100, remainingCap: 700 }]);
  });
  it("moonstone, damage 200 G -> payout 100 G, remaining cap 400 G (cap 2 x 250)", () => {
    expect(claimResults([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 200 }])).toEqual([
      { payout: 100, remainingCap: 400 },
    ]);
  });
  it("sword and amulet, damage to amulet 200 G -> payout 100 G, remaining cap 3100 G (cap 3200)", () => {
    expect(claimResults([plainSword, { type: "amulet" }], [{ itemType: "amulet", amount: 200 }])).toEqual([
      { payout: 100, remainingCap: 3100 },
    ]);
  });
  it("cursed sword, damage 500 G -> payout 400 G, remaining cap 1600 G (cap from unmodified value 1000)", () => {
    const cursedSword: Item = { ...plainSword, cursed: true };
    expect(claimResults([cursedSword], [{ itemType: "sword", amount: 500 }])).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("sword + 3 runes (block), damage to a rune 200 G -> payout 100 G, remaining cap 3400 G (sum 1750)", () => {
    expect(claimResults([plainSword, ...alikeComponents(3, "rune")], [{ itemType: "rune", amount: 200 }])).toEqual([
      { payout: 100, remainingCap: 3400 },
    ]);
  });
  it("dragon attack damages sword 500 G and amulet 300 G -> payout 600 G, remaining cap 2600 G (deductible per item)", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(claimResults([plainSword, { type: "amulet" }], damages)).toEqual([{ payout: 600, remainingCap: 2600 }]);
  });
  it("two swords, both damaged 500 G -> payout 800 G, remaining cap 3200 G (cap 4000, deductible per entry)", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(claimResults([plainSword, plainSword], damages)).toEqual([{ payout: 800, remainingCap: 3200 }]);
  });
  it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (50 % first, then deductible)", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimResults([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("dragon-material sword, exactly enchantment 8, damage 1000 G -> payout 400 G", () => {
    const sword: Item = { type: "sword", material: "dragon", enchantment: 8 };
    expect(claimResults([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (50 % rule wins)", () => {
    const sword: Item = { type: "sword", material: "dragon", enchantment: 9 };
    expect(claimResults([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (full reimbursement)", () => {
    const sword: Item = { type: "sword", material: "dragon", enchantment: 5 };
    expect(claimResults([sword], [{ itemType: "sword", amount: 800 }])).toEqual([{ payout: 700, remainingCap: 1300 }]);
  });
  it("steel sword, enchantment 9, damage 901 G -> payout 350 G (350.5 rounded down in MHPCO's favor)", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimResults([sword], [{ itemType: "sword", amount: 901 }])).toEqual([{ payout: 350, remainingCap: 1650 }]);
  });
  it("two successive claims of 1500 G on a sword -> payouts 1400 G / 600 G, remaining caps 600 G / 0 G", () => {
    const damage = { itemType: "sword", amount: 1500 };
    expect(claimResults([plainSword], [damage], [damage])).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("schema example: 5-year customer, silver amulet enchantment 2 -> premium 59 G; fire damage 200 G -> payout 100 G, remaining cap 1100 G", () => {
    expect(runScenario(schemaExampleScenario).results).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
});

// Reading adopted for rejections: the CLI exits with status 1, writes an error
// description to stderr, and writes nothing to stdout.
function runCli(scenario: unknown): { status: number | null; stdout: string; stderr: string } {
  const { status, stdout, stderr } = spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
  return { status, stdout, stderr };
}

/** A newcomer insures one plain sword, then claims the given damages against it. */
function swordPolicyClaim(damages: Damage[]): Scenario {
  return {
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items: [plainSword] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  };
}

describe("claim-office CLI", () => {
  it("reads the schema example scenario from stdin and writes {results:[{premium:59},{payout:100,remainingCap:1100}]} to stdout", () => {
    const { status, stdout } = runCli(schemaExampleScenario);
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("quote with unknown item type 'broomstick' -> exit status 1, error on stderr, no stdout", () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).toBe(1);
    expect(stderr).not.toBe("");
    expect(stdout).toBe("");
  });
  it("claim damaging an amulet when only a sword is insured -> exit status 1, error on stderr, no stdout", () => {
    const { status, stdout, stderr } = runCli(swordPolicyClaim([{ itemType: "amulet", amount: 200 }]));
    expect(status).toBe(1);
    expect(stderr).not.toBe("");
    expect(stdout).toBe("");
  });
  it("claim damaging an unknown item type -> exit status 1, error on stderr, no stdout", () => {
    const { status, stdout, stderr } = runCli(swordPolicyClaim([{ itemType: "broomstick", amount: 200 }]));
    expect(status).toBe(1);
    expect(stderr).not.toBe("");
    expect(stdout).toBe("");
  });
  it("claim with damage amount -200 -> exit status 1, error on stderr, no stdout", () => {
    const { status, stdout, stderr } = runCli(swordPolicyClaim([{ itemType: "sword", amount: -200 }]));
    expect(status).toBe(1);
    expect(stderr).not.toBe("");
    expect(stdout).toBe("");
  });
  it("claim with two sword damages when only one sword is insured -> exit status 1, whole claim rejected, no stdout", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    const { status, stdout } = runCli(swordPolicyClaim(damages));
    expect(status).toBe(1);
    expect(stdout).toBe("");
  });
});
