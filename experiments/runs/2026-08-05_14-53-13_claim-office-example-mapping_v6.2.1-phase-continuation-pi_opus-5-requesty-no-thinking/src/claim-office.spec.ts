import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import {
  runScenario,
  type Customer,
  type Item,
  type StepResult,
} from "./claim-office.js";

/** A customer who has never insured anything with MHPCO before. */
const NEWCOMER: Customer = { yearsWithMHPCO: 0 };

/** Asks MHPCO for a quote on `items` and returns the results of that scenario. */
const quote = (items: Item[], customer: Customer = NEWCOMER): StepResult[] =>
  runScenario({ customer, steps: [{ op: "quote", items }] }).results;

describe("MHPCO Claim Office", () => {
  // --- Simplest cases -------------------------------------------------
  it("empty item list -- premium 5 G (only the processing fee)", () => {
    expect(quote([])).toEqual([{ premium: 5 }]);
  });
  it("single plain sword for a newcomer -- premium 100 + 10 first insurance + 5 fee = 115 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: false }])).toEqual([
      { premium: 115 },
    ]);
  });
  it("single plain amulet for a newcomer -- premium 60 + 6 + 5 = 71 G", () => {
    expect(quote([{ type: "amulet", material: "silver", enchantment: 2, cursed: false }])).toEqual([
      { premium: 71 },
    ]);
  });
  it("single plain staff for a newcomer -- premium 80 + 8 + 5 = 93 G", () => {
    expect(quote([{ type: "staff", material: "oak", enchantment: 1, cursed: false }])).toEqual([
      { premium: 93 },
    ]);
  });
  it("single plain potion for a newcomer -- premium 40 + 4 + 5 = 49 G", () => {
    expect(quote([{ type: "potion", material: "glass", enchantment: 0, cursed: false }])).toEqual([
      { premium: 49 },
    ]);
  });

  // --- Components and building blocks ---------------------------------
  it("2 runes -- base premium 50 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual([{ premium: 60 }]);
  });
  it("3 runes -- base premium 60 G (block applies)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toEqual([
      { premium: 71 },
    ]);
  });
  it("4 runes -- base premium 100 G (no block -- block requires exactly 3)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toEqual(
      [{ premium: 115 }],
    );
  });
  it("7 runes -- base premium 175 G", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual([{ premium: 198 }]);
  });
  it("2 runes + 1 moonstone -- base premium 75 G (no block: different types)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual([
      { premium: 88 },
    ]);
  });
  it("3 runes + 3 moonstones -- base premium 120 G (two separate blocks)", () => {
    expect(
      quote([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ]),
    ).toEqual([{ premium: 137 }]);
  });

  // --- Individual premium modifiers -----------------------------------
  it("cursed sword adds a 50 % risk surcharge on the item's base premium", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual([
      { premium: 165 },
    ]);
  });
  it("sword with enchantment 5 adds a 30 % high-enchantment surcharge (threshold)", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 5, cursed: false }])).toEqual([
      { premium: 145 },
    ]);
  });
  it("sword with enchantment 4 -- no high-enchantment surcharge", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 4, cursed: false }])).toEqual([
      { premium: 115 },
    ]);
  });
  it("cursed sword with enchantment 5 -- both surcharges apply", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 5, cursed: true }])).toEqual([
      { premium: 195 },
    ]);
  });
  it("customer with exactly 2 years with MHPCO -- 20 % loyalty discount applies", () => {
    expect(
      quote([{ type: "sword", material: "steel", enchantment: 3, cursed: false }], {
        yearsWithMHPCO: 2,
      }),
    ).toEqual([{ premium: 95 }]);
  });
  it("customer with 1 year with MHPCO -- no loyalty discount", () => {
    expect(
      quote([{ type: "sword", material: "steel", enchantment: 3, cursed: false }], {
        yearsWithMHPCO: 1,
      }),
    ).toEqual([{ premium: 115 }]);
  });
  it("each item in a quote carries the 10 % initial assessment surcharge", () => {
    expect(
      quote([
        { type: "sword", material: "steel", enchantment: 1, cursed: false },
        { type: "amulet", material: "silver", enchantment: 1, cursed: false },
      ]),
    ).toEqual([{ premium: 181 }]);
  });
  it("second and later contracts receive a 15 % follow-up discount on the policy base premium", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 1, cursed: false };
    const results = runScenario({
      customer: NEWCOMER,
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    }).results;
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });

  // --- Modifier scope on multi-item policies --------------------------
  it("cursed sword + plain amulet -- policy base 160 G, curse adds 50 G (item-scoped), 210 G before further modifiers and fee", () => {
    expect(
      quote([
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ]),
    ).toEqual([{ premium: 231 }]);
  });

  // --- Rounding --------------------------------------------------------
  it("premium of 197.5 G is rounded up to 198 G (MHPCO's favor)", () => {
    // 7 runes: base 175 + 17.5 initial assessment + 5 fee = 197.5
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual([{ premium: 198 }]);
  });
  it("payout of 350.5 G is rounded down to 350 G (MHPCO's favor)", () => {
    // enchantment 9 sword, damage 901 -> 450.5 - 100 = 350.5
    const results = runScenario({
      customer: NEWCOMER,
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    }).results;
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Integration examples -------------------------------------------
  it("newcomer with a cursed sword (steel, enchantment 3) -- premium 165 G", () => {
    expect(
      quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], {
        yearsWithMHPCO: 0,
      }),
    ).toEqual([{ premium: 165 }]);
  });
  it("long-standing customer's second contract, cursed sword enchantment 7 -- premium 160 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1 }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    }).results;
    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Claims: standard reimbursement ---------------------------------
  it("regular sword (steel, enchantment 3), damage 500 G -- payout 400 G", () => {
    const results = runScenario({
      customer: NEWCOMER,
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (value 250 G), damage 200 G -- payout 100 G", () => {
    const results = runScenario({
      customer: NEWCOMER,
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    }).results;
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claims: special clauses -----------------------------------------
  it("steel sword, enchantment 9, damage 1000 G -- payout 400 G (50 % then deductible)", () => {
    const results = runScenario({
      customer: NEWCOMER,
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 5, damage 800 G -- payout 700 G (full reimbursement then deductible)", () => {
    const results = runScenario({
      customer: NEWCOMER,
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    }).results;
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G -- payout 400 G (50 % rule wins, then deductible)", () => {
    const results = runScenario({
      customer: NEWCOMER,
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, exactly enchantment 8, damage 1000 G -- payout 400 G", () => {
    const results = runScenario({
      customer: NEWCOMER,
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claims: deductible per damage event -----------------------------
  it("dragon attack damages sword (500 G) and amulet (300 G) -- payout 600 G (deductible per damaged item)", () => {
    const results = runScenario({
      customer: NEWCOMER,
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    }).results;
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claims: insurance sum and cap -----------------------------------
  it("policy with sword and amulet -- insurance sum 1600 G, cap 3200 G reflected in remainingCap", () => {
    const results = runScenario({
      customer: NEWCOMER,
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    }).results;
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("policy with a cursed sword -- cap 2000 G based on unmodified insurance value", () => {
    const results = runScenario({
      customer: NEWCOMER,
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    }).results;
    expect(results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("policy with a sword and 3 runes (a block) -- insurance sum 1750 G, cap 3500 G", () => {
    const results = runScenario({
      customer: NEWCOMER,
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    }).results;
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("two successive claims of 1500 G on a sword policy -- payouts 1400 G then 600 G, cap remaining 600 G then 0 G", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const results = runScenario({
      customer: NEWCOMER,
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
        claim,
        claim,
      ],
    }).results;
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Multiple items of the same type ---------------------------------
  it("policy covering two swords -- insurance sum 2000 G, cap 4000 G", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 1, cursed: false };
    const results = runScenario({
      customer: NEWCOMER,
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    }).results;
    expect(results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("two sword damages on a two-sword policy -- each damage gets its own deductible", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 1, cursed: false };
    const results = runScenario({
      customer: NEWCOMER,
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    }).results;
    expect(results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });

  // --- Errors -----------------------------------------------------------
  it("quote with an unknown item type (broomstick) -- throws an error", () => {
    expect(() => quote([{ type: "broomstick" }])).toThrow(/broomstick/);
  });
  it("claim damaging an amulet when only a sword is insured -- throws an error", () => {
    expect(() =>
      runScenario({
        customer: NEWCOMER,
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("claim with an unknown damaged item type -- throws an error", () => {
    expect(() =>
      runScenario({
        customer: NEWCOMER,
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("claim with more damage entries of a type than insured -- throws an error", () => {
    expect(() =>
      runScenario({
        customer: NEWCOMER,
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 200 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });
  it("claim with a negative damage amount -- throws an error", () => {
    expect(() =>
      runScenario({
        customer: NEWCOMER,
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/-200/);
  });
});

describe("claim-office CLI", () => {
  const runCli = (
    input: string,
  ): { status: number | null; stdout: string; stderr: string } => {
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });
    return { status: result.status, stdout: result.stdout, stderr: result.stderr };
  };

  it("reads a scenario from stdin and writes results JSON to stdout", () => {
    const scenario = {
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
    };
    const { status, stdout } = runCli(JSON.stringify(scenario));
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("exits with a non-zero status and writes to stderr on an unknown item type, with no results on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    const { status, stdout, stderr } = runCli(JSON.stringify(scenario));
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).toBe("");
  });
  it("exits with a non-zero status and writes to stderr on an invalid claim", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };
    const { status, stdout, stderr } = runCli(JSON.stringify(scenario));
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    // an error description, not a crash dump
    expect(stderr).toMatch(/-200/);
    expect(stderr).not.toMatch(/^\s+at /m);
  });
});
