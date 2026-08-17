import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { runScenario, type Item } from "./claim-office.js";

const cliPath = fileURLToPath(new URL("./cli.ts", import.meta.url));
const tsxLoader = fileURLToPath(new URL("../node_modules/tsx/dist/cli.mjs", import.meta.url));

function runCli(input: string): string {
  const result = spawnSync("node", [tsxLoader, cliPath], {
    input,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(`CLI exited with ${String(result.status)}: ${result.stderr}`);
  }

  return result.stdout;
}

const runes = (count: number): Item[] =>
  Array.from({ length: count }, () => ({ type: "rune" }));

const moonstones = (count: number): Item[] =>
  Array.from({ length: count }, () => ({ type: "moonstone" }));

describe("MHPCO claim office", () => {
  // --- Quote: simplest case and single items ---
  it("empty item list -> premium 5 G (processing fee only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(results).toEqual([{ premium: 5 }]);
  });
  it("single plain sword -> base premium 100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 G base + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("single plain amulet -> base premium 60 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });

    // 60 G base + 6 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("single plain staff -> base premium 80 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });

    // 80 G base + 8 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 93 }]);
  });

  it("single plain potion -> base premium 40 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    // 40 G base + 4 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 49 }]);
  });

  // --- Components and the block of 3 alike ---
  it("2 runes -> 50 G base premium (no block)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    // 50 G base + 5 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 60 }]);
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });

    // 60 G block base + 6 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("4 runes -> 100 G base premium (no block -- block requires exactly 3)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: runes(4) }],
    });

    // 100 G base + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 115 }]);
  });

  it("7 runes -> 175 G base premium (no block for 7)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: runes(7) }],
    });

    // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 -> 198
    expect(results).toEqual([{ premium: 198 }]);
  });

  it("2 runes + 1 moonstone -> 75 G base premium (alike means same type)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [...runes(2), { type: "moonstone" }] }],
    });

    // 75 G base + 7.5 G first insurance + 5 G fee = 87.5 -> 88
    expect(results).toEqual([{ premium: 88 }]);
  });

  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [...runes(3), ...moonstones(3)],
        },
      ],
    });

    // 120 G base + 12 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 137 }]);
  });

  // --- Item-specific modifiers ---
  it("cursed sword adds 50 % of its base premium as risk surcharge", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    // 100 G base + 50 G curse + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("sword with enchantment 5 adds 30 % high-enchantment surcharge (threshold inclusive)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });

    // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 145 }]);
  });
  it("sword with enchantment 4 adds no high-enchantment surcharge", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });

    // 100 G base + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 115 }]);
  });

  it("cursed sword with enchantment 5 adds both surcharges", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });

    // 100 G base + 50 G curse + 30 G high enchantment + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 195 }]);
  });

  // --- Policy-wide modifiers ---
  it("customer with exactly 2 years with MHPCO receives the 20 % loyalty discount", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 G base - 20 G loyalty + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 95 }]);
  });
  it("customer with 1 year with MHPCO receives no loyalty discount", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 G base + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("second quote in a scenario receives the 15 % follow-up contract discount", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    // first: 100 + 10 + 5 = 115; second: 100 - 15 + 10 + 5 = 100
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("every quote carries the 10 % first insurance surcharge on the policy base premium", () => {
    // A long-standing customer's second contract still pays the first insurance
    // surcharge: each quote treats its items as newly insured.
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    // second: 100 base + 50 curse + 30 ench - 20 loyalty + 10 first - 15 follow-up + 5 fee
    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet -> curse surcharge is 50 G (50 % of the cursed item only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
        },
      ],
    });

    // policy base 160 + 50 curse (of the sword only) = 210, + 16 first insurance + 5 fee
    expect(results).toEqual([{ premium: 231 }]);
  });

  // --- Rounding ---
  it("premium of 197.5 G rounds up to 198 G (MHPCO's favor)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: runes(7) }],
    });

    // 175 + 17.5 + 5 = 197.5 -> rounded up in the MHPCO's favor
    expect(results).toEqual([{ premium: 198 }]);
  });
  it("payout of 350.5 G rounds down to 350 G (MHPCO's favor)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
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
    });

    // 50 % of 901 = 450.5, - 100 deductible = 350.5 -> rounded down
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Quote errors ---
  it("quote with an unknown item type throws an Error (CLI exits non-zero)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/unknown item type: broomstick/i);
  });

  // --- Claim: standard reimbursement ---
  it("steel sword enchantment 3, damage 500 G -> payout 400 G (deductible only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
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
    });

    // full reimbursement 500 - 100 deductible; cap 2000 - 400 = 1600 remaining
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (no enchantment, no material), damage 200 G -> payout 100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: runes(1) },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });

    // 200 - 100 deductible; cap 2 x 250 = 500, remaining 400
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: special clauses ---
  it("steel sword enchantment 9, damage 1000 G -> payout 400 G (50 % then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // 50 % of 1000 = 500, then - 100 deductible
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 5, damage 800 G -> payout 700 G (full, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });

    // dragon material: full reimbursement, then - 100 deductible
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon sword enchantment 9, damage 1000 G -> payout 400 G (50 % rule wins)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // both clauses apply; the 50 % rule wins: 500 - 100
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("dragon sword enchantment 8, damage 1000 G -> payout 400 G (threshold inclusive)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: deductible per damage event ---
  it("sword 500 G + amulet 300 G in one incident -> payout 600 G (deductible per item)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
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
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });

    // (500 - 100) + (300 - 100) = 600; cap 3200 - 600 = 2600
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: cap ---
  it("policy of sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });

    // payout 0 (100 - 100 deductible), so the full cap of 3200 remains
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });

  it("policy of sword + 3 runes -> insurance sum 1750 G (block affects premium only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, ...runes(3)] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });

    // cap = 2 x (1000 + 3 x 250) = 3500
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });

  it("cursed sword -> cap 2000 G based on the unmodified insurance value", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
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
    });

    // premium modifiers do not raise the cap
    expect(results[0]).toEqual({ premium: 165 });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("two successive 1500 G claims on a sword -> payouts 1400 G then 600 G, cap remaining 0 G", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
        claim,
        claim,
      ],
    });

    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: multiple items of the same type ---
  it("policy with two swords -> insurance sum 2000 G, cap 4000 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });

  it("two sword damages against two insured swords -> each has its own deductible", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
          ],
        },
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
    });

    // (500 - 100) + (300 - 100) = 600; cap 4000 - 600 = 3400
    expect(results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("more damages of a type than insured items throws an Error (CLI exits non-zero)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
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
      }),
    ).toThrow(/sword/i);
  });

  // --- Claim errors ---
  it("claim for an item not part of the policy throws an Error (CLI exits non-zero)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/amulet/i);
  });

  it("claim with a negative damage amount throws an Error (CLI exits non-zero)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/negative|amount/i);
  });

  // --- Integration examples ---
  it("newcomer with a cursed sword -> premium 165 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("long-standing customer's second contract, cursed sword ench. 7 -> premium 160 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- CLI ---
  it("CLI reads the schema example from stdin and writes the results JSON to stdout", () => {
    const scenario = {
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
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };

    const stdout = runCli(JSON.stringify(scenario));

    // quote: 60 - 12 loyalty + 6 first insurance + 5 fee = 59
    // claim: 200 - 100 deductible = 100; cap 1200 - 100 = 1100
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("CLI exits non-zero and writes to stderr for an unknown item type", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const result = spawnSync("node", [tsxLoader, cliPath], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/i);
    expect(result.stdout).toBe("");
  });
});
