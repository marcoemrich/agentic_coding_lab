import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import {
  itemModifierPremium,
  policyBasePremium,
  quotePremium,
} from "./quote.js";
import { insuranceSum, payoutCap, processClaim } from "./claims.js";
import { runScenario } from "./scenario.js";

function runCli(input: unknown): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  const result = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return {
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

// Test List for the MHPCO Claim Office kata.
// Every entry is inactive (it.todo) until its Predictive TDD cycle starts.
// Observable contract for rejection cases (stated reading of the spec):
// the CLI exits with a non-zero status code, writes an error description to
// stderr, and writes no `results` document to stdout.

describe("MHPCO price list -- base premiums", () => {
  it("empty item list has base premium 0 (quote premium 5 G, only the processing fee)", () => {
    const premium = quotePremium([], { yearsWithMHPCO: 0 }, true);
    expect(premium).toBe(5);
  });
  it("a sword has base premium 100 G (insurance value 1000 G)", () => {
    expect(policyBasePremium([{ type: "sword" }])).toBe(100);
  });
  it("an amulet has base premium 60 G (insurance value 600 G)", () => {
    expect(policyBasePremium([{ type: "amulet" }])).toBe(60);
  });
  it("a staff has base premium 80 G (insurance value 800 G)", () => {
    expect(policyBasePremium([{ type: "staff" }])).toBe(80);
  });
  it("a potion has base premium 40 G (insurance value 400 G)", () => {
    expect(policyBasePremium([{ type: "potion" }])).toBe(40);
  });
  it("2 runes have base premium 50 G (2 x 25 G, no block)", () => {
    expect(policyBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes have base premium 60 G (building block of 3 alike components)", () => {
    expect(
      policyBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toBe(60);
  });
  it("4 runes have base premium 100 G (no block -- block requires exactly 3)", () => {
    const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(policyBasePremium(runes)).toBe(100);
  });
  it("7 runes have base premium 175 G (no block)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(policyBasePremium(runes)).toBe(175);
  });
  it("3 moonstones have base premium 60 G (block applies to moonstones too)", () => {
    const moonstones = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
    expect(policyBasePremium(moonstones)).toBe(60);
  });
  it("2 runes + 1 moonstone have base premium 75 G (no block: different types)", () => {
    expect(
      policyBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ]),
    ).toBe(75);
  });
  it("3 runes + 3 moonstones have base premium 120 G (two separate blocks)", () => {
    const runes = Array.from({ length: 3 }, () => ({ type: "rune" }));
    const moonstones = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
    expect(policyBasePremium([...runes, ...moonstones])).toBe(120);
  });
});

describe("MHPCO premium modifiers", () => {
  it("a cursed sword adds 50% of its own base premium -- 150 G before policy modifiers", () => {
    const premium = policyBasePremium([{ type: "sword", cursed: true }]);
    expect(premium + itemModifierPremium([{ type: "sword", cursed: true }])).toBe(
      150,
    );
  });
  it("a sword with enchantment exactly 5 adds 30% -- 130 G before policy modifiers", () => {
    const sword = { type: "sword", enchantment: 5 };
    expect(policyBasePremium([sword]) + itemModifierPremium([sword])).toBe(130);
  });
  it("a sword with enchantment 4 gets no high-enchantment surcharge -- 100 G", () => {
    const sword = { type: "sword", enchantment: 4 };
    expect(policyBasePremium([sword]) + itemModifierPremium([sword])).toBe(100);
  });
  it("a cursed sword with enchantment 5 gets both surcharges -- 180 G", () => {
    const sword = { type: "sword", enchantment: 5, cursed: true };
    expect(policyBasePremium([sword]) + itemModifierPremium([sword])).toBe(180);
  });
  it("cursed sword + plain amulet: policy base 160 G and the curse adds 50 G to the sword only -- premium 231 G", () => {
    const items = [
      { type: "sword", cursed: true },
      { type: "amulet" },
    ];
    expect(policyBasePremium(items)).toBe(160);
    expect(itemModifierPremium(items)).toBe(50);
    expect(quotePremium(items, { yearsWithMHPCO: 0 }, true)).toBe(231);
  });
  it("high-enchantment sword + plain amulet: +30 G on the sword only -- premium 211 G", () => {
    const items = [
      { type: "sword", enchantment: 5 },
      { type: "amulet" },
    ];
    expect(quotePremium(items, { yearsWithMHPCO: 0 }, true)).toBe(211);
  });
  it("a customer with exactly 2 years with MHPCO gets the 20% loyalty discount -- premium 95 G for a sword", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 2 }, true)).toBe(95);
  });
  it("a customer with 1 year with MHPCO gets no loyalty discount -- premium 115 G for a sword", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 1 }, true)).toBe(115);
  });
  it("a first insurance carries a 10% initial assessment surcharge -- newcomer cursed sword premium 165 G", () => {
    const items = [{ type: "sword", cursed: true }];
    expect(quotePremium(items, { yearsWithMHPCO: 0 }, true)).toBe(165);
  });
  it("a second contract gets a 15% follow-up discount -- two sword quotes give 115 G then 100 G", () => {
    const items = [{ type: "sword" }];
    expect(quotePremium(items, { yearsWithMHPCO: 0 }, true)).toBe(115);
    expect(quotePremium(items, { yearsWithMHPCO: 0 }, false)).toBe(100);
  });
  it("long-standing customer's second contract: cursed sword enchantment 7 -- premium 160 G (first insurance still applies)", () => {
    const items = [{ type: "sword", enchantment: 7, cursed: true }];
    expect(quotePremium(items, { yearsWithMHPCO: 3 }, false)).toBe(160);
  });
  it("a premium of 197.5 G is rounded up to 198 G (7 runes, newcomer, first insurance)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quotePremium(runes, { yearsWithMHPCO: 0 }, true)).toBe(198);
  });
});

describe("MHPCO claim processing", () => {
  it("regular steel sword enchantment 3, damage 500 G -- payout 400 G, remainingCap 1600 G", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 3 }] };
    const claim = processClaim(policy, [
      { itemType: "sword", amount: 500 },
    ]);
    expect(claim.payout).toBe(400);
    expect(claim.remainingCap).toBe(1600);
  });
  it("rune damage 200 G -- payout 100 G, remainingCap 400 G (no special clause)", () => {
    const policy = { items: [{ type: "rune" }] };
    const claim = processClaim(policy, [{ itemType: "rune", amount: 200 }]);
    expect(claim.payout).toBe(100);
    expect(claim.remainingCap).toBe(400);
  });
  it("dragon attack damages sword 500 G and amulet 300 G -- payout 600 G, remainingCap 2600 G (deductible once per item)", () => {
    const policy = { items: [{ type: "sword" }, { type: "amulet" }] };
    const claim = processClaim(policy, [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ]);
    expect(claim.payout).toBe(600);
    expect(claim.remainingCap).toBe(2600);
  });
  it("dragon-material sword enchantment 9, damage 1000 G -- payout 400 G (both clauses, 50% rule wins)", () => {
    const policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 9 }],
    };
    const claim = processClaim(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(claim.payout).toBe(400);
  });
  it("dragon-material sword enchantment 5, damage 800 G -- payout 700 G (dragon clause only)", () => {
    const policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 5 }],
    };
    const claim = processClaim(policy, [{ itemType: "sword", amount: 800 }]);
    expect(claim.payout).toBe(700);
  });
  it("steel sword enchantment 9, damage 1000 G -- payout 400 G (high-enchantment clause only)", () => {
    const policy = {
      items: [{ type: "sword", material: "steel", enchantment: 9 }],
    };
    const claim = processClaim(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(claim.payout).toBe(400);
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G -- payout 400 G", () => {
    const policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 8 }],
    };
    const claim = processClaim(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(claim.payout).toBe(400);
  });
  it("a payout of 350.5 G is rounded down to 350 G (enchanted sword, damage 901 G, fractions kept until the end)", () => {
    const policy = { items: [{ type: "sword", enchantment: 9 }] };
    const claim = processClaim(policy, [{ itemType: "sword", amount: 901 }]);
    expect(claim.payout).toBe(350);
  });
  it("two swords insured, two sword damages of 500 G each -- payout 800 G, remainingCap 3200 G (separate deductibles)", () => {
    const policy = { items: [{ type: "sword" }, { type: "sword" }] };
    const claim = processClaim(policy, [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ]);
    expect(claim.payout).toBe(800);
    expect(claim.remainingCap).toBe(3200);
  });
  it("sword + 3 runes insured: insurance sum 1750 G, cap 3500 G -- sword damage 1000 G gives payout 900 G, remainingCap 2600 G", () => {
    const policy = {
      items: [
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ],
    };
    expect(insuranceSum(policy)).toBe(1750);
    expect(payoutCap(policy)).toBe(3500);
    const claim = processClaim(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(claim.payout).toBe(900);
    expect(claim.remainingCap).toBe(2600);
  });
  it("cursed sword: cap 2000 G from the unmodified insurance value -- damage 3000 G gives payout 2000 G, remainingCap 0 G", () => {
    const policy = { items: [{ type: "sword", cursed: true }] };
    expect(payoutCap(policy)).toBe(2000);
    const claim = processClaim(policy, [{ itemType: "sword", amount: 3000 }]);
    expect(claim.payout).toBe(2000);
    expect(claim.remainingCap).toBe(0);
  });
  it("sword + amulet: cap 3200 G -- sword damage 3000 G gives payout 2900 G, remainingCap 300 G", () => {
    const policy = { items: [{ type: "sword" }, { type: "amulet" }] };
    expect(payoutCap(policy)).toBe(3200);
    const claim = processClaim(policy, [{ itemType: "sword", amount: 3000 }]);
    expect(claim.payout).toBe(2900);
    expect(claim.remainingCap).toBe(300);
  });
  it("cap exhaustion: two 1500 G claims on a sword -- 1400 G/600 G then 600 G/0 G", () => {
    const policy = { items: [{ type: "sword" }] };
    const first = processClaim(policy, [{ itemType: "sword", amount: 1500 }]);
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);
    const second = processClaim(
      policy,
      [{ itemType: "sword", amount: 1500 }],
      first.remainingCap,
    );
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
});

describe("MHPCO CLI", () => {
  it("schema example: amulet quote with 5 years gives premium 59 G, then damage 200 G gives payout 100 G and remainingCap 1100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });
    expect(results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });
  it("writes one result per step in input order -- quote then claim", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { premium: 62 }]);
  });
  it("rejects a quote item with unknown type broomstick: non-zero exit, error on stderr, no results on stdout", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).not.toBe("");
    expect(run.stdout).toBe("");
  });
  it("rejects a claim for an amulet when only a sword is insured: non-zero exit, error on stderr", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).not.toBe("");
  });
  it("rejects a claim damage with an unknown item type: non-zero exit, error on stderr", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "broomstick", amount: 200 }],
          },
        },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).not.toBe("");
  });
  it("rejects a claim damage with amount -200: non-zero exit, error on stderr", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).not.toBe("");
  });
  it("rejects a claim with two sword damages when only one sword is insured: non-zero exit, error on stderr", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).not.toBe("");
  });
});
